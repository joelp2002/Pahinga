import mongoose from 'mongoose';

const paxRateSchema = new mongoose.Schema(
  {
    minPax: { type: Number, required: true },
    maxPax: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const serviceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, required: true, enum: ['swimming_pool', 'cottage', 'event_hall'] },
  capacity: { type: Number, required: true },
  pricePerDay: { type: Number, required: true },
  available: { type: Boolean, default: true },
  amenities: { type: [String], default: [] },
  image: { type: String },
  paxRates: { type: [paxRateSchema], default: undefined },
  inclusions: { type: [String], default: undefined },
  notes: { type: [String], default: undefined },
  lightsAndSoundsFee: { type: Number, default: undefined },
  entranceFeeAdult: { type: Number, default: undefined },
  entranceFeeChildSenior: { type: Number, default: undefined },
});

const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);
export default Service;
