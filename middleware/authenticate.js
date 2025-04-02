const { verifyAccessToken } = require('../config/jwt');
const UserRole = require('../models/userRole');
const User = require('../models/user');

const authenticate = (
  requiredPermission = 'read', 
  restrictStudents = false, 
  restrictInstructors = false, 
  selfUpdate = false
) => {
  return async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(403).json({ error: 'Forbidden: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
      // Decode token and attach user info
      const decoded = verifyAccessToken(token);
      req.user = decoded; 

      // Fetch user role with permissions
      const user = await User.findById(req.user.id).populate('roleId').lean();
      const userRole = await UserRole.findById(user.roleId._id.toString()).populate('userPermissions');

      if (!userRole) {
        return res.status(403).json({ error: 'Forbidden: Role not found' });
      }

      // Check if user has the required permission
      const hasPermission = userRole.userPermissions.some(
        (perm) => perm.name === requiredPermission
      );

      if (!hasPermission) {
        return res.status(403).json({ error: `Forbidden: Missing ${requiredPermission} permission` });
      }

      // Restrict students from certain routes
      if (restrictStudents && userRole.name === 'student') {
        return res.status(403).json({ error: 'Forbidden: Students are not allowed to access this resource' });
      }

      // Restrict instructors from certain routes
      if (restrictInstructors && userRole.name === 'instructor') {
        return res.status(403).json({ error: 'Forbidden: Instructors are not allowed to access this resource' });
      }

      // Allow self-update: If user is updating their own info, bypass restrictions
      if (selfUpdate && (userRole.name === 'student' || userRole.name === 'instructor')) {
        const userIdFromRequest = req.params.id; // Get user ID from request
        if (req.user.id !== userIdFromRequest) {
          return res.status(403).json({ error: 'Forbidden: You can only update your own profile' });
        }
      }

      next();
    } catch (error) {
      return res.status(403).json({ error: 'Forbidden: Invalid token' });
    }
  };
};

module.exports = authenticate;
