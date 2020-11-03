import mongoose from 'mongoose';
import bycript from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: [true, 'name is required'] },
    lastName: { type: String, required: [true, 'name is required'] },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: [true, 'email is taken'],
    },
    password: { type: String, required: true },
    address: {
      street: { type: String, default: null },
      apt: { type: String, default: null },
      city: { type: String, default: null },
      state: { type: String, default: null },
      zipcode: { type: String, default: null },
    },
    phone: { type: String, default: null },
    store: {type: mongoose.Types.ObjectId, ref: 'Store', default: null},
  
  },{
  
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (psw) {
  return await bycript.compare(psw, this.password);
};

userSchema.methods.generateToken = function (id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bycript.genSalt(10);
  this.password = await bycript.hash(this.password, salt);
});

export default mongoose.model('User', userSchema);
