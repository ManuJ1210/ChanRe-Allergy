import History from '../models/historyModel.js';
import asyncHandler from 'express-async-handler';

// @desc    Add patient history
// @route   POST /api/history
// @access  Private
export const addHistory = asyncHandler(async (req, res) => {
  const {
    patientId,
    sectionOne,
    sectionTwo,
    sectionThree,
    sectionFour,
    sectionFive,
    sectionSix,
  } = req.body;

  const history = await History.create({
    patientId,

    // Section One
    ...sectionOne,

    // Section Two
    complaints: sectionTwo?.complaints || [],

    // Section Three
    ...sectionThree,

    // Section Four
    skinAllergy: sectionFour?.skinAllergy || {},
    medicalHistory: sectionFour?.medicalHistory || {},

    // Section Five
    drugs: sectionFive?.drugs || {},
    exposure: sectionFive?.exposure || {},

    // Section Six
    examination: sectionSix?.examination || {},
    reportFile: sectionSix?.reportFile || '',
  });

  res.status(201).json({ success: true, history });
});
