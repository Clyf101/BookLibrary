const jwt = require('jsonwebtoken');

const secret = 'mysecretsshhhhh';
const expiration = '2h';

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'You have no token!' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, secret, { maxAge: expiration });
    req.user = decoded;
    next();
  } catch (err) {
    console.log('Invalid token:', err);
    return res.status(401).json({ message: 'Invalid token!' });
  }
}

function signToken(user) {
  const payload = { username: user.username, email: user.email, _id: user._id };
  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
}

module.exports = { authMiddleware, signToken };
