const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    next();
  } catch (error) {
    // console.log(error.message);
    console.log(error);
    return res.status(401).json({
      message: 'Auth failed'
    })
  }

}

function authenticateOrganizerToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).send({ message: 'Unauthorized' });

  jwt.verify(token, process.env.JWT_SECRET, (err, organizer) => {
    if (err) return res.status(403).send({ message: 'Forbidden' });
    if (organizer.role !== 'organizer') return res.status(403).send({ message: 'Access restricted to organizers' });
    console.log("Organizer from token:", organizer);
    console.log("Decoded token:", organizer);
    req.organizer = organizer.organizerId;
    next();
  });
}

module.exports = {
  authenticateToken,
  authenticateOrganizerToken
};


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