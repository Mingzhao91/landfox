const { expressjwt: expressJwt } = require("express-jwt");

function jwtBlock() {
  return expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    isRevoked: adminUsers,
  }).unless({
    path: [
      { url: /\/public\/uploads(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/fox\/api\/item(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/fox\/api\/category(.*)/, methods: ["GET", "OPTIONS"] },
      "/fox/api/user/login",
      "/fox/api/user/register",
    ],
  });
}

async function adminUsers(req, payload, done) {
  if (!payload.isAdmin) {
    done(null, true);
  }

  done();
}

module.exports = jwtBlock;
