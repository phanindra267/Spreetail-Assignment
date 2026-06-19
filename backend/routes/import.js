
const express = require('express');
const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');
const router = express.Router();
const { pool } = require('../config/db');

const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('csv'), async (req, res) => {
  try {
    const importReportResult = await pool.query('INSERT INTO import_reports DEFAULT VALUES RETURNING id');
    const importReportId = importReportResult.rows[0].id;
    const anomalies = [];

    fs.createReadStream(req.file.path)
      .pipe(csvParser())
      .on('data', async (row) => {
        // TODO: Implement anomaly detection here
      })
      .on('end', () => {
        fs.unlinkSync(req.file.path);
        res.json({
          importReportId,
          anomalies
        });
      });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
