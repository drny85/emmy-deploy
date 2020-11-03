import mongoose from 'mongoose';

const storeSchema = mongoose.Schema({
  name: {type: String, required: true},
 
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  address: {
    street: { type: String, default: null },
    apt: { type: String, default: null },
    city: { type: String, default: null },
    state: { type: String, default: null },
    zipcode: { type: String, default: null },
  },
  phone: { type: String, default: null },
  email: {type: String},
storeInfo: {type: String}
},
{
  timestamps: true,
}
);

export default mongoose.model('Store', storeSchema);
