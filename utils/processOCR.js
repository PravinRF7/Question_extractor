const Tesseract = require('tesseract.js');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

async function processPDF(filePath) {
  const outputPath = filePath.replace('.pdf', '');
  const imagePath = outputPath + '-1.png'; // Expected output by pdftoppm

  // Step 0: Log file input
  if (!fs.existsSync(filePath)) {
    throw new Error("❌ PDF file not found at path: " + filePath);
  } else {
    console.log("📄 PDF file exists at:", filePath);
  }

  const convertPDF = () => {
    return new Promise((resolve, reject) => {
      const cmd = `pdftoppm "${filePath}" "${outputPath}" -png -r 300`;
      console.log("📸 Running command:", cmd); // <-- Debug command

      exec(cmd, (error, stdout, stderr) => {
        if (error) {
          console.error("❌ pdftoppm error:", stderr); // <-- Show actual error
          return reject(`PDF to PNG failed: ${stderr}`);
        }

        console.log("✅ PDF converted to image");
        resolve();
      });
    });
  };

  try {
    await convertPDF();

    // Debug: show final image path
    console.log("🔍 Looking for image at:", imagePath);

    if (!fs.existsSync(imagePath)) {
      throw new Error(`❌ Image not found at ${imagePath}`);
    }

    console.log("🧠 Starting OCR...");
    const result = await Tesseract.recognize(imagePath, 'eng');
    const text = result.data.text;

    const question_blocks = text.split(/\n?\s*\d+\.\s/).filter(q => q.trim().length > 0);
    const final_questions = [];
    let question_counter = 1;

    for (let block of question_blocks) {
      const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
      const question_lines = [];
      const options = [];
      let correct_answer = '';

      for (let line of lines) {
        if (line.startsWith('@')) {
          const option = line.replace(/^@+/, '').trim();
          options.push(option);
          correct_answer = option;
        } else if (/^[O©]/.test(line)) {
          options.push(line.replace(/^[O©]+/, '').trim());
        } else {
          question_lines.push(line);
        }
      }

      const question_text = question_lines.join(' ');
      if (question_text && options.length >= 2) {
        final_questions.push({
          section_name: '1',
          question_type: '1',
          question_name: `Q${question_counter}`,
          question: question_text,
          options: `[${options.join(', ')}]`,
          answer: `[${correct_answer || options[0]}]`
        });
        question_counter++;
      }
    }

    return final_questions;
  } catch (err) {
    console.error('❌ OCR Failed:', err);
    throw err;
  }
}

module.exports = { processPDF };
