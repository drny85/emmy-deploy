import mongoose from 'mongoose';

const cartSchema = mongoose.Schema({
  items: [],
  quantity: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
});

export default mongoose.model('Cart', cartSchema);
