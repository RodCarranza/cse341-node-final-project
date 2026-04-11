const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const { getDB } = require('./db');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/auth/google/callback`
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const db = getDB();
        const usersCollection = db.collection('users');

        const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;

        let user = await usersCollection.findOne({ googleId: profile.id });

        if (!user) {
          const newUser = {
            googleId: profile.id,
            name: profile.displayName,
            email,
            role: 'customer',
            createdAt: new Date()
          };

          const result = await usersCollection.insertOne(newUser);

          user = {
            _id: result.insertedId,
            ...newUser
          };
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id.toString());
});

passport.deserializeUser(async (id, done) => {
  try {
    const db = getDB();
    const user = await db.collection('users').findOne({
      _id: new (require('mongodb').ObjectId)(id)
    });

    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
