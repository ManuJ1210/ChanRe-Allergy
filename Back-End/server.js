// server.js (ES Module version)
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import centerRoutes from './routes/centerRoutes.js';
import centerAdminRoutes from './routes/centerAdminRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import historyRoutes from './routes/historyRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import receptionistRoutes from './routes/receptionistRoutes.js';
import medicationRoutes from './routes/medicationRoutes.js';
import followUpRoutes from './routes/followUpRoutes.js';
import allergicRhinitisRoutes from './routes/allergicRhinitisRoutes.js';
import atopicDermatitisRoutes from './routes/atopicDermatitisRoutes.js';
import allergicConjunctivitisRoutes from './routes/allergicConjunctivitisRoutes.js';
import allergicBronchitisRoutes from './routes/allergicBronchitisRoutes.js';
import gpeRoutes from './routes/gpeRoutes.js';
import prescriptionRoutes from './routes/prescriptionRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import labStaffRoutes from './routes/labStaffRoutes.js';
import testRequestRoutes from './routes/testRequestRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/centers', centerRoutes);
app.use('/api/center-admins', centerAdminRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/receptionists', receptionistRoutes);
app.use('/api/medications', medicationRoutes);
app.use('/api/followups', followUpRoutes);
app.use('/api/allergic-rhinitis', allergicRhinitisRoutes);
app.use('/api/atopic-dermatitis', atopicDermatitisRoutes);
app.use('/api/allergic-conjunctivitis', allergicConjunctivitisRoutes);
app.use('/api/allergic-bronchitis', allergicBronchitisRoutes);
app.use('/api/gpe', gpeRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/lab-staff', labStaffRoutes);
app.use('/api/test-requests', testRequestRoutes);

// Use environment variable or fallback to local MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/chenre-allergy';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection failed:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
