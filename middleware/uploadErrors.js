const multer = require('multer');

/**
 * Handles file upload errors
 * @param {Error} err - Error object
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware
 * @returns {Response|void} Returns error response or passes to next middleware
 */
const handleUploadErrors = (err, req, res, next) => {
  // Multer-specific errors
  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({
          success: false,
          message: "File size exceeds 2MB limit",
          code: "FILE_TOO_LARGE",
          maxSize: "2MB"
        });
      
      // Add other Multer error cases as needed
      default:
        return res.status(400).json({
          success: false,
          message: "File upload error",
          code: "UPLOAD_ERROR",
          details: err.message
        });
    }
  }

  // Custom file type errors
  if (err?.code === 'LIMIT_FILE_TYPE') {
    return res.status(400).json({
      success: false,
      message: "Only JPEG, PNG, or WebP images are allowed",
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
      code: "INVALID_FILE_TYPE"
    });
  }

  // Pass to default error handler if not a file upload error
  next(err);
};

module.exports = handleUploadErrors;