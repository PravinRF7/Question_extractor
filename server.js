const express = require('express');
const bodyParser = require('body-parser');
const uploadRoute = require('./routes/upload');

const downloadRoute = require('./routes/download');


const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// 👇 Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

app.use('/download', downloadRoute);

// 👇 Route to handle PDF upload
app.use('/upload', uploadRoute);

// 👇 Redirect root / to index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
});

