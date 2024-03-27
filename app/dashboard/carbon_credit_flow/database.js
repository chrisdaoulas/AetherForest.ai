const sqlite3 = require('sqlite3');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());

//npx kill-port 3001
app.get('/', (req, res) => {
  const dbPath = './satellite_data/defrate.db';
  const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY);
  const query = 'SELECT * FROM Deforestation_Rate';

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error executing the query:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const jsonString = JSON.parse(JSON.stringify(rows));
      res.status(200).json(jsonString);
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:3001/`);
});
