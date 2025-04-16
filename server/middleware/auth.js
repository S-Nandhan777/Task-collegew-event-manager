const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).send({ message: 'Unauthorized' });
  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) return res.status(403).send({ message: 'Forbidden' });
    req.user = user;
    next();
    });
}

function authenticateOrganizerToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).send({ message: 'Unauthorized' });

  jwt.verify(token, process.env.JWT_SECRET, (err, organizer) => {
    if (err) return res.status(403).send({ message: 'Forbidden' });
    if (organizer.role !== 'organizer') return res.status(403).send({ message: 'Access restricted to organizers' });
    req.organizer = organizer;
    next();
  });
}

module.exports = authenticateToken;
module.exports = authenticateOrganizerToken;

// const jwt = require('jsonwebtoken');

// function authenticateToken(req, res, next) {
//     const token = req.headers['authorization']?.split(' ')[1];
//     if (!token) return res.status(401).json({ error: 'Access denied, no token provided' });
//     jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//         if (err) return res.status(403).json({ error: 'Invalid token' });
//         req.user = user;
//         next();
//     });
// }

// module.exports = authenticateToken;