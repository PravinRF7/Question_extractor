 
const express = require('express');
const multer = require('multer');
const path = require('path');
const { processPDF } = require('../utils/processOCR'); // We'll add this soon

const router = express.Router();

// Setup file storage with multer
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

router.post('/', upload.single('file'), async (req, res) => {
  try {
    console.log("📄 File received:", req.file.path);
    const result = await processPDF(req.file.path); // Next step
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
