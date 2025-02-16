const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const port = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

app.get('/api/career', (req, res) => {
  res.json({ message: 'Career data' });
});

app.post('/api/career', upload.single('resume'), (req, res) => {
  const { name, email, contact } = req.body;
  const resume = req.file;

  if (!name || !email || !contact || !resume) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Here you can handle the form data and save it to a database if needed
  res.status(200).json({ message: 'Form submitted successfully' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
