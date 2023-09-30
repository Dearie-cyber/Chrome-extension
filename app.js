// server.js
const express = require('express');
const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs-extra');

const app = express();
const port = 5000;

// Configure multer to store uploaded files
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(express.json());

// Define a route to handle video uploads
app.post('/api/upload', upload.single('video'), async (req, res) => {
  try {
    // Generate a unique identifier for the video
    const videoId = shortid.generate();

    // Save the uploaded video to disk
    const videoPath = `uploads/${videoId}.webm`;
    fs.writeFileSync(videoPath, req.file.buffer);

    // Return the path to the uploaded video
    res.json({ videoPath });
  } catch (error) {
    console.error('Error uploading video:', error);
    res.status(500).json({ message: 'Error uploading video' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
