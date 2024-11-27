const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  // if (!token) {
  //   return res.status(401).json({ message: 'Unauthorized: No token provided' });
  // }

  try {
    // const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    // req.user = decoded; // Attach user information to the request object
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

module.exports = { protect };