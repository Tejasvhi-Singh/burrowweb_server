const express = require('express');
const multer = require('multer');
const path = require('path');
const { Pool } = require('pg');
const app = express();
const port = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'D:/Website/burrowweb/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.get('/career', (req, res) => {
  res.json({ message: 'Career data' });
});

app.get('/career/check', async (req, res) => {
  try {
    const client = await pool.connect();
    const result2 = await client.query('SELECT * FROM career_applications');
    client.release();
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/career', upload.single('resume'), async (req, res) => {
  const { name, email, contact } = req.body;
  const resume = req.file;

  if (!name || !email || !contact || !resume) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const client = await pool.connect();
    const queryText = 'INSERT INTO career_applications(name, email, contact, resume_path) VALUES($1, $2, $3, $4)';
    const values = [name, email, contact, resume.path];
    await client.query(queryText, values);
    client.release();
    res.status(200).json({ message: 'Form submitted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
