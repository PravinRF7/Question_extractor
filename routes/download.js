const express = require('express');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const router = express.Router();

router.post('/', (req, res) => {
  const data = req.body;

  if (!data || !Array.isArray(data) || data.length === 0) {
    return res.status(400).send({ error: 'Invalid or empty question data' });
  }

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Questions');

  const filePath = path.join(__dirname, '../uploads/questions.xlsx');
  XLSX.writeFile(workbook, filePath);

  res.download(filePath, 'questions.xlsx', () => {
    fs.unlinkSync(filePath); // delete file after sending
  });
});

module.exports = router;
