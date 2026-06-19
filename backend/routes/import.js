
const express = require('express');
const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');
const router = express.Router();
const { pool } = require('../config/db');

const upload = multer({ dest: 'uploads/' });

const detectAnomalies = (row, rowNumber) => {
  const issues = [];

  if (!row.payer || !row.amount || !row.date) {
    issues.push({
      type: 'missing_required',
      description: 'Missing required field (payer, amount, date)',
      action: 'flagged_for_review'
    });
  }

  const amount = parseFloat(row.amount);
  if (isNaN(amount)) {
    issues.push({
      type: 'invalid_amount',
      description: 'Invalid amount format',
      action: 'flagged_for_review'
    });
  } else if (amount < 0) {
    issues.push({
      type: 'negative_amount',
      description: 'Amount is negative',
      action: 'treat_as_settlement'
    });
  }

  return issues.map(i => ({ ...i, rowNumber }));
};

router.post('/', upload.single('csv'), async (req, res) => {
  try {
    const importReportResult = await pool.query('INSERT INTO import_reports DEFAULT VALUES RETURNING id');
    const importReportId = importReportResult.rows[0].id;
    const anomalies = [];
    const rows = [];
    let rowNumber = 1;

    fs.createReadStream(req.file.path)
      .pipe(csvParser())
      .on('data', (row) => {
        rows.push(row);
        const rowAnomalies = detectAnomalies(row, rowNumber);
        if (rowAnomalies.length > 0) anomalies.push(...rowAnomalies);
        rowNumber++;
      })
      .on('end', async () => {
        fs.unlinkSync(req.file.path);

        for (const anomaly of anomalies) {
          await pool.query(`
            INSERT INTO import_anomalies (import_report_id, row_number, issue_type, description, action_taken, status)
            VALUES ($1, $2, $3, $4, $5, $6)
          `, [importReportId, anomaly.rowNumber, anomaly.type, anomaly.description, anomaly.action, 'pending']);
        }

        res.json({
          importReportId,
          anomalies,
          totalRows: rowNumber - 1
        });
      });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
