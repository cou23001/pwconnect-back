// controllers/attendanceController.js
const Attendance = require("../models/attendance");
const Group = require("../models/group");
const Ward = require("../models/ward");

/**
 * @swagger
 * tags:
 *   - name: Attendance
 *     description: Attendance management
 */

// Create a new Attendance record
/**
 * @swagger
 * /api/attendance:
 *   post:
 *     summary: Create a new Attendance record
 *     tags:
 *       - Attendance
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - studentId
 *               - groupId
 *               - date
 *               - isPresent
 *             properties:
 *               studentId:
 *                 type: string
 *                 format: ObjectId
 *                 description: ID of the student
 *               groupId:
 *                 type: string
 *                 format: ObjectId
 *                 description: ID of the group
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Date of the attendance
 *               isPresent:
 *                 type: boolean
 *                 description: Whether the student is present
 *               notes:
 *                 type: string
 *                 description: Additional notes
 *     responses:
 *       201:
 *         description: Attendance record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Attendance'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

const createAttendance = async (req, res) => {
  try {
    // Create a new attendance record
    const attendance = new Attendance(req.body);

    // Save the attendance record to the database
    await attendance.save();

    // Populate the studentId and groupId fields with their respective data
    res.status(201).json(attendance);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all Attendance records
/**
 * @swagger
 * /api/attendance:
 *   get:
 *     summary: Get all Attendance records
 *     tags:
 *       - Attendance
 *     responses:
 *       200:
 *         description: List of Attendance records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Attendance'
 *       500:
 *         description: Internal server error
 */

const getAttendances = async (req, res) => {
  try {
    // Get all attendance records from the database
    const attendances = await Attendance.find()
      .populate("studentId")
      .populate("groupId");

    // Return the list of attendance records
    res.status(200).json(attendances);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Attendance record by ID
/**
 * @swagger
 * /api/attendance/{id}:
 *   get:
 *     summary: Get Attendance record by ID
 *     tags:
 *       - Attendance
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Attendance record ID
 *     responses:
 *       200:
 *         description: Attendance record found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Attendance'
 *       404:
 *         description: Attendance record not found
 *       500:
 *         description: Internal server error
 */

const getAttendance = async (req, res) => {
  try {
    // Get attendance record by ID
    // Populate the studentId and groupId fields with their respective data
    const attendance = await Attendance.findById(req.params.id)
      .populate("studentId")
      .populate("groupId");

    // Check if the attendance record exists
    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    // Return the attendance record
    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Attendances by Group ID
/**
 * @swagger
 * /api/attendance/group/{groupId}:
 *   get:
 *     summary: Get Attendances by Group ID
 *     tags:
 *       - Attendance
 *     parameters:
 *       - in: path
 *         name: groupId
 *         schema:
 *           type: string
 *         required: true
 *         description: Group ID to retrieve attendances for
 *     responses:
 *       200:
 *         description: Attendances found for the specified group
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Attendance' # Assuming you have a schema defined for Attendance
 *       404:
 *         description: No attendances found for the specified group
 *       500:
 *         description: Internal server error
 */

const getAttendanceByGroup = async (req, res) => {
  try {
    const groupId = req.params.groupId;

    // Find attendances for the specified group ID
    const attendances = await Attendance.find({ groupId: groupId }).populate(
      "studentId"
    );

    // Check if any attendances were found
    if (!attendances || attendances.length === 0) {
      return res.status(200).json({ data: [], message: "Not found" });
    }

    // Return the list of attendances for the specified group
    res.status(200).json({ data: attendances, message: "Success" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Attendances by Group ID within a Stake
/**
 * @swagger
 * /api/attendance/stake/{stakeId}:
 *   get:
 *     summary: Get Attendances by Group ID within a Stake
 *     tags:
 *       - Attendance
 *     parameters:
 *       - in: path
 *         name: stakeId
 *         schema:
 *           type: string
 *         required: true
 *         description: Stake ID to retrieve attendances for groups within
 *     responses:
 *       200:
 *         description: Attendances found for groups within the specified stake
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   groupId:
 *                     type: string
 *                     description: The ID of the group
 *                   groupName:
 *                     type: string
 *                     description: The name of the group
 *                   attendances:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Attendance'
 *       404:
 *         description: No attendances found for groups within the specified stake
 *       500:
 *         description: Internal server error
 */

const getAttendanceByGroupByStake = async (req, res) => {
  try {
    // Extract stakeId from request parameters
    const stakeId = req.params.stakeId;

    // Find wards associated with the specified stake ID
    const wards = await Ward.find({ stakeId: stakeId });

    // Check if any wards were found
    if (!wards || wards.length === 0) {
      return res
        .status(200)
        .json({ data: [], message: "No wards found within this stake." });
    }

    // Extract ward IDs from the found wards
    const wardIds = wards.map((ward) => ward._id);

    // Find groups associated with the found ward IDs
    const groups = await Group.find({ wardId: { $in: wardIds } });

    // Check if any groups were found
    if (!groups || groups.length === 0) {
      return res
        .status(200)
        .json({
          data: [],
          message: "No groups found within the wards of this stake.",
        });
    }

    const attendanceData = [];

    // Iterate through each group and fetch attendance records
    for (const group of groups) {
      const attendances = await Attendance.find({ groupId: group._id })
        .populate("studentId")
        .select("date -_id");

      const uniqueDates = [
        ...new Set(
          attendances.map(
            (attendance) => attendance.date.toISOString().split("T")[0]
          )
        ),
      ];
      const numberOfClassesTaken = uniqueDates.length;

      attendanceData.push({
        groupId: group._id,
        groupName: group.name,
        numberOfClassesTaken: numberOfClassesTaken,
      });
    }

    // Check if any attendance records were found
    if (attendanceData.length === 0) {
      return res
        .status(200)
        .json({
          data: [],
          message:
            "No attendance records found for any group within the wards of this stake.",
        });
    }

    res.status(200).json({ data: attendanceData, message: "Success" });
  } catch (error) {
    console.error("Error fetching attendance by group for stake:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// Update Attendance record by ID
/**
 * @swagger
 * /api/attendance/{id}:
 *   put:
 *     summary: Update Attendance record by ID
 *     tags:
 *       - Attendance
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Attendance record ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               studentId:
 *                 type: string
 *                 format: ObjectId
 *                 description: ID of the student
 *               groupId:
 *                 type: string
 *                 format: ObjectId
 *                 description: ID of the group
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Date of the attendance
 *               isPresent:
 *                 type: boolean
 *                 description: Whether the student is present
 *               notes:
 *                 type: string
 *                 description: Additional notes
 *     responses:
 *       200:
 *         description: Updated Attendance record
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Attendance'
 *       404:
 *         description: Attendance record not found
 *       500:
 *         description: Internal server error
 */

const updateAttendance = async (req, res) => {
  try {
    // Find and update the attendance record by ID
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate("studentId")
      .populate("groupId");

    // Check if the attendance record exists
    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    // Return the updated attendance record
    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Attendance record by ID
/**
 * @swagger
 * /api/attendance/{id}:
 *   delete:
 *     summary: Delete Attendance record by ID
 *     tags:
 *       - Attendance
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Attendance record ID
 *     responses:
 *       204:
 *         description: Attendance record deleted
 *       404:
 *         description: Attendance record not found
 *       500:
 *         description: Internal server error
 */

const deleteAttendance = async (req, res) => {
  try {
    // Find and delete the attendance record by ID
    const attendance = await Attendance.findByIdAndDelete(req.params.id);

    // Check if the attendance record exists
    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    // Return a success response
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createAttendance,
  getAttendances,
  getAttendance,
  getAttendanceByGroup,
  getAttendanceByGroupByStake,
  updateAttendance,
  deleteAttendance,
};
