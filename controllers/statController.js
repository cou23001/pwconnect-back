// controllers/statController.js
const Group = require("../models/group");
const mongoose = require("mongoose");
const Ward = require("../models/ward");
const Registration = require("../models/registration");
const Attendance = require("../models/attendance");


/**
 * @swagger
 * /stats/stake/{stakeId}/groups-sessions:
 *   get:
 *     summary: Get all group sessions for a specific stake
 *     tags: [Statistics]
 *     parameters:
 *       - name: stakeId
 *         in: path
 *         required: true
 *         description: The ID of the stake to get group sessions for
 *         schema:
 *           type: string
 *           format: objectid
 *     responses:
 *       200:
 *         description: A list of group sessions for the specified stake
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Group sessions retrieved successfully
 *                 sessionStats:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       groupId:
 *                         type: string
 *                         format: objectid
 *                         example: 507f1f77bcf86cd799439011
 *                       groupName:
 *                         type: string
 *                         example: EC1 Group A
 *                       sessionCount:
 *                         type: integer
 *                         example: 5
 *       400:
 *         description: Invalid stake ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid stake ID
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized access
 *       404:
 *         description: No wards found for this stake
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No wards found for this stake
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error
 */
const getGroupSessionsByStake = async (req, res) => {
    try {
      const { stakeId } = req.params;
  
      if (!mongoose.Types.ObjectId.isValid(stakeId)) {
        return res.status(400).json({ message: "Invalid stake ID" });
      }
  
      // Step 1: Get all wards in the stake
      const wards = await Ward.find({ stakeId }).select('_id');
      if (wards.length === 0) {
        return res.status(404).json({ message: "No wards found for this stake" });
      }
      const wardIds = wards.map(w => w._id);
  
      // Step 2: Find all groups in those wards
      const groups = await Group.find({ wardId: { $in: wardIds } }).select('name sessions');
  
      // Step 3: Count completed sessions per group
      const sessionStats = groups.map(group => {
        const completedCount = group.sessions?.filter(s => s.completed)?.length || 0;
        return {
          groupId: group._id,
          groupName: group.name,
          sessionCount: completedCount,
        };
      });
  
      res.status(200).json({ message: "Group sessions retrieved successfully", sessionStats });
    } catch (error) {
      console.error("Error in getGroupSessionsByStake:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

/**
 * @swagger
 * /stats/stake/{stakeId}/group-students:
 *   get:
 *     summary: Get student counts for all groups in a specific stake
 *     tags: [Statistics]
 *     parameters:
 *       - name: stakeId
 *         in: path
 *         required: true
 *         description: The ID of the stake to get student counts for
 *         schema:
 *           type: string
 *           format: objectid
 *     responses:
 *       200:
 *         description: A list of group student counts for the specified stake
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Student count retrieved successfully
 *                 studentStats:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       groupId:
 *                         type: string
 *                         format: objectid
 *                         example: 507f1f77bcf86cd799439011
 *                       groupName:
 *                         type: string
 *                         example: EC1 Group A
 *                       studentCount:
 *                         type: integer
 *                         example: 25
 *       400:
 *         description: Invalid stake ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid stake ID
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized access
 *       404:
 *         description: No wards found for this stake
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No wards found for this stake
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error
 */
  const getGroupStudentCountsByStake = async (req, res) => {
    try {
      const { stakeId } = req.params;
  
      if (!mongoose.Types.ObjectId.isValid(stakeId)) {
        return res.status(400).json({ message: "Invalid stake ID" });
      }
  
      // Step 1: Get all wards in the stake
      const wards = await Ward.find({ stakeId }).select('_id');
      if (wards.length === 0) {
        return res.status(404).json({ message: "No wards found for this stake" });
      }
      const wardIds = wards.map(w => w._id);
  
      // Step 2: Get all groups in those wards
      const groups = await Group.find({ wardId: { $in: wardIds } }).select('_id name');
  
      // Step 3: For each group, count how many registrations (students)
      const studentStats = await Promise.all(
        groups.map(async (group) => {
          const studentCount = await Registration.countDocuments({ groupId: group._id });
  
          return {
            groupId: group._id,
            groupName: group.name,
            studentCount,
          };
        })
      );
  
      res.status(200).json({ message: "Student count retrieved successfully", studentStats });
    } catch (error) {
      console.error("Error in getTotalStudentsByGroupByStake:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  
  

/**
 * @swagger
 * /stats/stake/{stakeId}/group-attendance:
 *   get:
 *     summary: Get attendance statistics for all groups in a specific stake
 *     tags: [Statistics]
 *     parameters:
 *       - name: stakeId
 *         in: path
 *         required: true
 *         description: The ID of the stake to get attendance statistics for
 *         schema:
 *           type: string
 *           format: objectid
 *     responses:
 *       200:
 *         description: A list of group attendance statistics for the specified stake
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Attendance statistics retrieved successfully
 *                 attendanceStats:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       groupId:
 *                         type: string
 *                         format: objectid
 *                         example: 507f1f77bcf86cd799439011
 *                       groupName:
 *                         type: string
 *                         example: EC1 Group A
 *                       averageAttendance:
 *                         type: integer
 *                         example: 85
 *       400:
 *         description: Invalid stake ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid stake ID
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized access
 *       404:
 *         description: No wards found for this stake
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No wards found for this stake
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error
 */
const getGroupAttendanceByStake = async (req, res) => {
  try {
    const { stakeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(stakeId)) {
      return res.status(400).json({ message: "Invalid stake ID" });
    }

    // Step 1: Get all ward IDs for this stake
    const wards = await Ward.find({ stakeId }).select('_id');
    if (wards.length === 0) {
      return res.status(404).json({ message: "No wards found for this stake" });
    }
    const wardIds = wards.map(w => w._id);

    // Step 2: Get all groups in these wards
    const groups = await Group.find({ wardId: { $in: wardIds } }).select('_id name');

    // Step 3: For each group, calculate attendance
    const attendanceStats = await Promise.all(groups.map(async (group) => {
      const totalRecords = await Attendance.countDocuments({ groupId: group._id });
      const presentRecords = await Attendance.countDocuments({ groupId: group._id, isPresent: true });

      const averageAttendance = totalRecords === 0 ? 0 : Math.round((presentRecords / totalRecords) * 100);

      return {
        groupId: group._id,
        groupName: group.name,
        averageAttendance
      };
    }));

    res.status(200).json(attendanceStats);
  } catch (error) {
    console.error("Error in getGroupAttendanceByStake:", error);
    res.status(500).json({ message: "Server error" });
  }
};
  

module.exports = {
    getGroupSessionsByStake,
    getGroupStudentCountsByStake,
    getGroupAttendanceByStake,
};