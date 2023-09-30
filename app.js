// server.js
const express = require('express');
const multer = require('multer');
const shortid = require('shortid');
const { exec } = require('child_process');
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

    // Save the uploaded video to disk (temporarily)
    const videoPath = `uploads/${videoId}.webm`;
    fs.writeFileSync(videoPath, req.file.buffer);

    // Compress the video using fluent-ffmpeg
    const compressedVideoPath = `uploads/${videoId}-compressed.mp4`;
    exec(`ffmpeg -i ${videoPath} -vcodec libx264 ${compressedVideoPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error('Error compressing video:', error);
        return res.status(500).json({ message: 'Error compressing video' });
      }

      // Remove the original video
      fs.unlinkSync(videoPath);

      // Return the path to the compressed video
      res.json({ videoPath: compressedVideoPath });
    });
  } catch (error) {
    console.error('Error uploading video:', error);
    res.status(500).json({ message: 'Error uploading video' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/Dearie-cyber/Chrome-extension.git
git push -u origin main