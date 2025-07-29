const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const prisma = require("../DB/db");

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

const passportJWT = (passport) => {
  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        const user = await prisma.users.findUnique({
          where: { id: jwt_payload.id },
          select: {
            id: true,
            name: true,
            role: true,
          },
        });

        if (!user) return done(null, false);
        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    })
  );
};

module.exports = passportJWT;
