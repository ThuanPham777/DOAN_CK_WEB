const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    avatarUrl: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    phoneNumber: { type: String },
    address: { type: String },
    province: { type: String },
    city: { type: String },
    country: { type: String, default: 'Vietnam' },
    password: {
      type: String,
      required: [true, 'User password is required'],
      minlength: 6,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        validator: function (value) {
          return this.password === value;
        },
        message: 'Passwords do not match',
      },
    },
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpiresAt: Date,
  },
  {
    timestamps: true,
  }
);

// Hash the password before saving to the database
userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

// Middleware để mã hóa mật khẩu trước khi lưu vào DB
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  // Lưu thời gian thay đổi mật khẩu
  this.passwordChangedAt = Date.now() - 1000; // Giả sử mật khẩu thay đổi ngay trước khi lưu vào DB

  next();
});

// candidatePassword: password are input from client(not bcrypt)
// userPassword: password are hashed which are stored in the database
userSchema.methods.correctPassword = async (
  candidatePassword,
  userPassword
) => {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Phương thức để kiểm tra xem mật khẩu đã thay đổi sau khi token được phát hành chưa
userSchema.methods.changedPasswordAfter = function (JWTTime) {
  if (this.passwordChangedAt) {
    const changedTimestamp = this.passwordChangedAt.getTime() / 1000; // Chuyển sang giây
    return JWTTime < changedTimestamp; // Nếu thời gian token phát hành nhỏ hơn thời gian thay đổi mật khẩu, trả về true
  }

  // Nếu không có thông tin về thời gian thay đổi mật khẩu, mặc định là chưa thay đổi
  return false;
};

module.exports = mongoose.model('User', userSchema);
