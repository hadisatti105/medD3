const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

const API_URL = "https://communication.onyxplatform.com/api/v1/external/organizations/1333/sources/197/utilization";

app.post('/check-utilization', async (req, res) => {
  const { lead_phone_number, state, zip_code } = req.body;

  const external_id = "hardcoded-lead-id-2025"; // <- hardcoded external_id

  try {
    const response = await axios.post(API_URL, {
      lead_phone_number,
      state,
      zip_code,
      external_id
    }, {
      headers: {
        'Authorization': process.env.API_KEY,
        'Content-Type': 'application/json'
      }
    });

    const result = response.data;

    res.send(`
      <link rel="stylesheet" href="/styles.css">
      <div class="container">
        <h2>✅ Utilization API Response</h2>
        <pre>${JSON.stringify(result, null, 2)}</pre>
        <a href="/" class="back-btn">← Back to Form</a>
      </div>
    `);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send(`
      <link rel="stylesheet" href="/styles.css">
      <div class="container">
        <h2>❌ Error from API</h2>
        <pre>${JSON.stringify(error.response?.data || error.message, null, 2)}</pre>
        <a href="/" class="back-btn">← Back to Form</a>
      </div>
    `);
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
