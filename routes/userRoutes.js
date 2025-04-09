const express = require("express");
const {
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
} = require("../controllers/userController");
const { authenticate, authorize } = require("../middleware/authenticate");
const validateOwnership = require("../middleware/validateOwnership");
const router = express.Router();
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

// GET /users
router.get("/users",
  authenticate,
  authorize([10]), 
  getUsers
);

// GET /users/:id
router.get(
  "/users/:id",
  authenticate,
  authorize([10]),
  validateOwnership,
  getUserById
);

// PUT /users/:id
router.put(
  "/users/:id",
  upload.single("avatar"),
  uploadErrors,
  authenticate,
  authorize([10]),
  validateOwnership,
  updateUser
);

// DELETE /users/:id
router.delete("/users/:id", 
    authenticate, 
    authorize([10]), 
    deleteUser
);

module.exports = router;
