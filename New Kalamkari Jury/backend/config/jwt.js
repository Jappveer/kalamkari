const jwt = require('jsonwebtoken');

class JWTService {
  static generateToken(payload, expiresIn = '1h') {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
  }

  static verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return null;
    }
  }

  static decodeToken(token) {
    return jwt.decode(token);
  }

  static generateRefreshToken(payload) {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  }
}

module.exports = JWTService;    