const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const cors = require('cors');

// Use CORS to allow requests from Angular (localhost:4200)
app.use(cors());

// Make sure the gallery folder exists
const galleryDir = path.join(__dirname, 'src/assets/gallery');
if (!fs.existsSync(galleryDir)) {
  fs.mkdirSync(galleryDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, galleryDir);
  },
  filename: function (req, file, cb) {
    // Add a timestamp to the filename to avoid conflicts
    const uniqueFilename = Date.now() + '-' + file.originalname.replace(/\s+/g, '-');
    cb(null, uniqueFilename);
  }
});
const upload = multer({ storage: storage });

// Static files - it is important to specify the correct path
app.use('/assets', express.static(path.join(__dirname, 'src/assets')));
app.use('/src/assets', express.static(path.join(__dirname, 'src/assets')));

app.use(express.static(path.join(__dirname, 'dist/pixel-sonya-landing-new')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/pixel-sonya-landing-new/index.html'));
});

// Route for file uploads
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded' });
  }
  
  // Form a public URL to the file (relative path for the browser)
  const filePath = '/assets/gallery/' + req.file.filename;
  
  console.log('File uploaded:', req.file.filename);
  console.log('File path for client:', filePath);
  
  res.json({
    success: true,
    filePath: filePath,
    originalName: req.file.originalname,
    fileName: req.file.filename
  });
});

// List of files in the gallery
app.get('/api/gallery', (req, res) => {
  fs.readdir(galleryDir, (err, files) => {
    if (err) {
      return res.status(500).json({ success: false, error: 'Error reading directory' });
    }
    
    const images = files
      .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file))
      .map(file => ({
        filename: file,
        path: `/assets/gallery/${file}`
      }));
    
    console.log('Found images in gallery:', images.length);
    
    res.json({
      success: true,
      images: images
    });
  });
});

const slideshowJson = path.join(galleryDir, 'slideshow.json');

// Get list of ids for slideshow
app.get('/api/slideshow', (req, res) => {
  fs.readFile(slideshowJson, (err, data) => {
    if (err) return res.json({ success: true, ids: [] });
    res.json({ success: true, ids: JSON.parse(data) });
  });
});

// Update list of ids for slideshow
app.post('/api/slideshow', express.json(), (req, res) => {
  const { ids } = req.body;
  fs.writeFile(slideshowJson, JSON.stringify(ids), (err) => {
    if (err) return res.status(500).json({ success: false });
    res.json({ success: true });
  });
});

// Port setup - start with 4200
const PORT = process.env.PORT || 4200;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    const newPort = PORT + 1;
    console.log(`Port ${PORT} occupied, trying ${newPort}`);
    app.listen(newPort, () => {
      console.log(`Server started on port ${newPort}`);
    }).on('error', (err) => {
      console.error('Server start error:', err);
    });
  } else {
    console.error('Server start error:', err);
  }
}); 