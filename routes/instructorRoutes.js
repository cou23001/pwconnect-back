// routes/instructorRoutes.js
const express = require("express");
const {
  getInstructors,
  createInstructor,
  getInstructorById,
  getInstructorsByWard,
  updateInstructor,
  deleteInstructor,
  uploadAvatar,
} = require("../controllers/instructorController");
const { authenticate, authorize } = require("../middleware/authenticate");
const router = express.Router();
const formDataToJson = require("../middleware/formDataParser");
const uploadErrors = require("../middleware/uploadErrors");

const multer = require("multer");
const memoryStorage = multer.memoryStorage(); // Store file in memory

const upload = multer({
  storage: memoryStorage, // Don't save locally
  limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 2MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error("Invalid file type");
      error.code = "LIMIT_FILE_TYPE"; // Custom error code
      return cb(error);
    }
    cb(null, true);
  },
});

// GET /instructors
router.get("/instructors", authenticate, authorize([10]), getInstructors);

// GET /instructors/:id
router.get(
  "/instructors/:id",
  authenticate,
  authorize([10]),
  getInstructorById
);

// GET /instructors/wards/{wardId}
router.get(
  "/instructors/wards/:wardId",
  authenticate,
  authorize([10]),
  getInstructorsByWard
);

// POST /instructors
router.post(
  "/instructors",
  upload.single("avatar"),
  uploadErrors,
  authenticate,
  authorize([10]),
  formDataToJson,
  createInstructor
);

// PUT /instructors/:id
router.put(
  "/instructors/:id",
  upload.single("avatar"),
  uploadErrors,
  authenticate,
  authorize([10]),
  formDataToJson,
  updateInstructor
);

// POST /instructors/upload/:id
// Route requires authentication and authorization for types 1 and 10.
// It checks if the user owns the data (or is admin).
router.put(
  "/instructors/upload/:id",
  upload.single("avatar"),
  authenticate,
  authorize([1, 10, 11]),
  formDataToJson,
  //validateOwnership,
  uploadAvatar
);

// DELETE /instructors/:id
router.delete(
  "/instructors/:id",
  authenticate,
  authorize([10]),
  deleteInstructor
);

module.exports = router;
