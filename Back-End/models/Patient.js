import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female'], required: true },
  age: { type: Number, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  address: { type: String },
  centerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Center',
    required: true,
  },
}, { timestamps: true });

const Patient = mongoose.model('Patient', patientSchema);
export default Patient;
