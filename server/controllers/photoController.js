const { getPhotosByEventId, addPhoto } = require('../models/photoModel');

async function getAll(req, res) {
  try {
      const photos = await getPhotosByEventId(req.params.id);
      res.json(photos);
  } catch (error) {
      res.status(500).json({ error: 'Failed to fetch photos' });
  }
}

async function add(req, res) {
  try {
      const { event_id, photo_url } = req.body;
      const photoId = await addPhoto(event_id, photo_url);
      res.status(201).json({ message: 'Photo added', photoId });
  } catch (error) {
      res.status(500).json({ error: 'Failed to add photo' });
  }
}


module.exports = {
  getAll , add
}