// middleware/validateOwnership.js
const Student = require("../models/student");

async function validateStudentOwnership(req, res, next) {
  // Skip check for admins (type=10)
  if (req.user.type === 10) return next(); // Admin bypass
  try {
    const resourceId = req.params.id;
    const userId = req.user.id;

    // Single query that checks both existence and ownership
    const student = await Student.findOne({
      _id: resourceId,
      userId: userId,
    });

    if (!student) {
      // Don't reveal whether record exists
      return res.status(403).json({
        error: "You can only modify your own data",
      });
    }

    // Attach the student document to the request for later use
    req.student = student;
    next();
  } catch (error) {
    console.error("Ownership validation error:", error);
    res.status(500).json({ error: "Server error during ownership validation" });
  }
}

module.exports = validateStudentOwnership;
