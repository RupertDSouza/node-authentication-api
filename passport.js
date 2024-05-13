const passport = require("passport");
const BearerStrategy = require("passport-http-bearer").Strategy;
const jwt = require("jsonwebtoken");

passport.use(
  new BearerStrategy(function (token, done) {
    // Validate the token here, fetch user from DB
    // For simplicity, we'll use jwt.verify
    jwt.verify(token, "secret", function (err, user) {
      if (err) return done(err);
      return done(null, user);
    });
  })
);

module.exports = passport;
