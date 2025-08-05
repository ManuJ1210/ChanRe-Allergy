import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export const generateLabReportPDF = async (testRequest, reportData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `lab-report-${testRequest._id}-${timestamp}.pdf`;
      const filepath = path.join('uploads', 'reports', filename);
      const dir = path.dirname(filepath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const stream = fs.createWriteStream(filepath);
      doc.pipe(stream);
      doc.fontSize(24).text('LABORATORY TEST REPORT', { align: 'center' }).moveDown(2);
      doc.fontSize(12).text(`Patient: ${testRequest.patientName || ''}`);
      doc.text(`Doctor: ${testRequest.doctorName || ''}`);
      doc.text(`Test: ${testRequest.testType || ''}`);
      doc.text(`Date: ${new Date().toLocaleDateString()}`);
      doc.moveDown();
      doc.text(reportData.reportSummary || 'No summary provided.');
      doc.end();
      stream.on('finish', () => resolve({ filename, filepath }));
      stream.on('error', (error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
}; 