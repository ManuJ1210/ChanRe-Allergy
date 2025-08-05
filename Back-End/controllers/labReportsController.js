import TestRequest from '../models/TestRequest.js';
import Center from '../models/Center.js';
import Patient from '../models/Patient.js';
import User from '../models/User.js';

// Get all lab reports for superadmin
export const getAllLabReports = async (req, res) => {
  try {
    const reports = await TestRequest.find({
      $or: [
        { status: 'Report_Generated' },
        { status: 'Report_Sent' },
        { status: 'Testing_Completed' }
      ]
    })
    .populate('patientId', 'name phone centerCode')
    .populate('doctorId', 'name email')
    .populate('centerId', 'name centerCode')
    .populate('assignedLabStaffId', 'name')
    .populate('reportGeneratedBy', 'name')
    .populate('reportSentBy', 'name')
    .sort({ createdAt: -1 });

    const formattedReports = reports.map(report => ({
      _id: report._id,
      patientName: report.patientId?.name || report.patientName,
      patientId: report.patientId?.centerCode || report.patientId?._id,
      centerName: report.centerId?.name || report.centerName,
      centerCode: report.centerId?.centerCode || report.centerCode,
      doctorName: report.doctorId?.name || report.doctorName,
      testType: report.testType,
      testDescription: report.testDescription,
      status: report.status,
      urgency: report.urgency,
      reportGeneratedDate: report.reportGeneratedDate,
      reportSentDate: report.reportSentDate,
      reportFile: report.reportFile,
      reportFilePath: report.reportFilePath,
      resultSummary: report.reportSummary,
      clinicalInterpretation: report.clinicalInterpretation,
      resultDetails: report.resultDetails,
      resultValues: report.resultValues,
      notes: report.notes,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt
    }));

    res.status(200).json(formattedReports);
  } catch (error) {
    console.error('Error fetching lab reports:', error);
    res.status(500).json({ message: 'Failed to fetch lab reports', error: error.message });
  }
};

// Get lab reports by center
export const getLabReportsByCenter = async (req, res) => {
  try {
    const { centerId } = req.params;
    
    const reports = await TestRequest.find({
      centerId: centerId,
      $or: [
        { status: 'Report_Generated' },
        { status: 'Report_Sent' },
        { status: 'Testing_Completed' }
      ]
    })
    .populate('patientId', 'name phone centerCode')
    .populate('doctorId', 'name email')
    .populate('centerId', 'name centerCode')
    .populate('assignedLabStaffId', 'name')
    .populate('reportGeneratedBy', 'name')
    .populate('reportSentBy', 'name')
    .sort({ createdAt: -1 });

    const formattedReports = reports.map(report => ({
      _id: report._id,
      patientName: report.patientId?.name || report.patientName,
      patientId: report.patientId?.centerCode || report.patientId?._id,
      centerName: report.centerId?.name || report.centerName,
      centerCode: report.centerId?.centerCode || report.centerCode,
      doctorName: report.doctorId?.name || report.doctorName,
      testType: report.testType,
      testDescription: report.testDescription,
      status: report.status,
      urgency: report.urgency,
      reportGeneratedDate: report.reportGeneratedDate,
      reportSentDate: report.reportSentDate,
      reportFile: report.reportFile,
      reportFilePath: report.reportFilePath,
      resultSummary: report.reportSummary,
      clinicalInterpretation: report.clinicalInterpretation,
      resultDetails: report.resultDetails,
      resultValues: report.resultValues,
      notes: report.notes,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt
    }));

    res.status(200).json(formattedReports);
  } catch (error) {
    console.error('Error fetching lab reports by center:', error);
    res.status(500).json({ message: 'Failed to fetch lab reports by center', error: error.message });
  }
};

// Get single lab report details
export const getLabReportById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const report = await TestRequest.findById(id)
      .populate('patientId', 'name phone centerCode age gender')
      .populate('doctorId', 'name email phone')
      .populate('centerId', 'name centerCode address phone')
      .populate('assignedLabStaffId', 'name email phone')
      .populate('reportGeneratedBy', 'name email')
      .populate('reportSentBy', 'name email');

    if (!report) {
      return res.status(404).json({ message: 'Lab report not found' });
    }

    const formattedReport = {
      _id: report._id,
      patientName: report.patientId?.name || report.patientName,
      patientId: report.patientId?.centerCode || report.patientId?._id,
      patientPhone: report.patientId?.phone || report.patientPhone,
      patientAge: report.patientId?.age,
      patientGender: report.patientId?.gender,
      centerName: report.centerId?.name || report.centerName,
      centerCode: report.centerId?.centerCode || report.centerCode,
      centerAddress: report.centerId?.address,
      centerPhone: report.centerId?.phone,
      doctorName: report.doctorId?.name || report.doctorName,
      doctorEmail: report.doctorId?.email,
      doctorPhone: report.doctorId?.phone,
      testType: report.testType,
      testDescription: report.testDescription,
      status: report.status,
      urgency: report.urgency,
      notes: report.notes,
      reportGeneratedDate: report.reportGeneratedDate,
      reportSentDate: report.reportSentDate,
      reportFile: report.reportFile,
      reportFilePath: report.reportFilePath,
      reportSummary: report.reportSummary,
      clinicalInterpretation: report.clinicalInterpretation,
      resultDetails: report.resultDetails,
      resultValues: report.resultValues,
      conclusion: report.conclusion,
      recommendations: report.recommendations,
      qualityControl: report.qualityControl,
      methodUsed: report.methodUsed,
      equipmentUsed: report.equipmentUsed,
      labTechnicianName: report.assignedLabStaffId?.name || report.labTechnicianName,
      labTechnicianEmail: report.assignedLabStaffId?.email,
      labTechnicianPhone: report.assignedLabStaffId?.phone,
      reportGeneratedByName: report.reportGeneratedBy?.name || report.reportGeneratedByName,
      reportSentByName: report.reportSentBy?.name || report.reportSentByName,
      sendMethod: report.sendMethod,
      sentTo: report.sentTo,
      emailSubject: report.emailSubject,
      emailMessage: report.emailMessage,
      notificationMessage: report.notificationMessage,
      deliveryConfirmation: report.deliveryConfirmation,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt
    };

    res.status(200).json(formattedReport);
  } catch (error) {
    console.error('Error fetching lab report by ID:', error);
    res.status(500).json({ message: 'Failed to fetch lab report', error: error.message });
  }
};

// Get lab reports statistics
export const getLabReportsStats = async (req, res) => {
  try {
    const totalReports = await TestRequest.countDocuments({
      $or: [
        { status: 'Report_Generated' },
        { status: 'Report_Sent' },
        { status: 'Testing_Completed' }
      ]
    });

    const sentReports = await TestRequest.countDocuments({ status: 'Report_Sent' });
    const generatedReports = await TestRequest.countDocuments({ status: 'Report_Generated' });
    const completedTests = await TestRequest.countDocuments({ status: 'Testing_Completed' });

    // Get reports by center
    const reportsByCenter = await TestRequest.aggregate([
      {
        $match: {
          $or: [
            { status: 'Report_Generated' },
            { status: 'Report_Sent' },
            { status: 'Testing_Completed' }
          ]
        }
      },
      {
        $group: {
          _id: '$centerId',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'centers',
          localField: '_id',
          foreignField: '_id',
          as: 'center'
        }
      },
      {
        $unwind: '$center'
      },
      {
        $project: {
          centerName: '$center.name',
          centerCode: '$center.centerCode',
          count: 1
        }
      }
    ]);

    // Get reports by status
    const reportsByStatus = await TestRequest.aggregate([
      {
        $match: {
          $or: [
            { status: 'Report_Generated' },
            { status: 'Report_Sent' },
            { status: 'Testing_Completed' }
          ]
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      totalReports,
      sentReports,
      generatedReports,
      completedTests,
      reportsByCenter,
      reportsByStatus
    });
  } catch (error) {
    console.error('Error fetching lab reports statistics:', error);
    res.status(500).json({ message: 'Failed to fetch lab reports statistics', error: error.message });
  }
}; 