import mongoose from 'mongoose';

const orderSchema = mongoose.Schema(
  {
    customer: {
      name: { type: String },
      phone: { type: String },
      email: { type: String },
    },
    shippingAddress: { type: Object },
    paymentDetails: { type: Object },
    orderItems: { type: Array },
    placedOn: { type: String },
    isDelivered: { type: Boolean },
    isPaid: { type: Boolean },
    orderTotal: { type: Number },
    trackingNumber: { type: String, dafault: null },
    deliveredOn: { type: String, dafault: null },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    coupon: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
