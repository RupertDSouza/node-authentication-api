const passport = require("passport");
const BearerStrategy = require("passport-http-bearer").Strategy;
const jwt = require("jsonwebtoken");

const User = require("./models/user");

passport.use(
  new BearerStrategy(async (token, done) => {
    try {
      const decoded = jwt.verify(token, "secret_key");
      const user = await User.findById(decoded.userId);
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

module.exports = passport;
