import mongoose from 'mongoose';

const couponSchema = mongoose.Schema({
  code: { type: String, required: true },
  value: { type: Number, required: true },
  expires: { type: String, required: true },
});

export default mongoose.model('Coupon', couponSchema);
