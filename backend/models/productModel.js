import mongoose from 'mongoose';

const productSchema = mongoose.Schema(
  {
    name: { type: String, required: [true, 'name is required'] },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    available: { type: Boolean, required: true, default: true },
    estimatedDelivery: { type: Number },
    category: {
      type: mongoose.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);
