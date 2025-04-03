// routes/studentRoutes.js
const express = require("express");
const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  uploadAvatar,
} = require("../controllers/studentController");
const { authenticate, authorize } = require("../middleware/authenticate");
const validateOwnership = require("../middleware/validateOwnership");
const router = express.Router();
const formDataToJson = require("../middleware/formDataParser");

const multer = require("multer");
const memoryStorage = multer.memoryStorage(); // Store file in memory

const upload = multer({
  storage: memoryStorage, // Don't save locally
  limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 2MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error('Invalid file type');
      error.code = 'LIMIT_FILE_TYPE';  // Custom error code
      return cb(error);
    }
    cb(null, true);
  }
});

// GET /students
router.get("/students", getAllStudents);

// GET /students/:id
// Route requires authentication and authorization for types 1 and 10.
// It checks if the user owns the data (or is admin).
router.get(
  "/students/:id",
  authenticate,
  authorize([1, 10]),
  validateOwnership,
  getStudentById
);

// POST /students
router.post("/students", authenticate, createStudent);

// PUT /students/:id
// Route requires authentication and authorization for tyoes 1 and 10.
// It checks if the user owns the data (or is admin).
router.put("/students/:id", upload.single("avatar"), (err, req, res, next) => {
    if (err?.code === 'LIMIT_FILE_TYPE') {
      return res.status(400).json({
        success: false,
        message: "Only JPEG, PNG, or WebP images are allowed"
      });
    }
    // Size limit exceeded
    if (err?.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: "File size exceeds 2MB"
      });
    }
    next();
  }, formDataToJson, updateStudent);

// DELETE /students/:id
// Route requires authentication and authorization for type 10 (admin).
router.delete("/students/:id", authenticate, authorize([10]), deleteStudent);

// POST /students/upload/:id
// Route requires authentication and authorization for types 1 and 10.
// It checks if the user owns the data (or is admin).
router.post(
  "/students/upload/:id",
  upload.single("avatar"),
  formDataToJson,
  uploadAvatar
);

module.exports = router;
