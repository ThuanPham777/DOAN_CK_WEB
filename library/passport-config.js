const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../app/users/models/userModel');
module.exports = (passport) => {
  // local strategy
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async (email, password, done) => {
        try {
          // Tìm người dùng bằng email
          const user = await User.findOne({ email });
          if (!user) {
            return done(null, false, { message: 'Email không tồn tại' });
          }

          // So sánh mật khẩu
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return done(null, false, { message: 'Mật khẩu không đúng' });
          }

          // Xác thực thành công
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  // Serialize user
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};
