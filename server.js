const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3001; // Use a different port than json-server
const dbPath = path.join(__dirname, 'db.json');

// Middleware to parse JSON request bodies
app.use(express.json());

// Function to modify db.json
const modifyUserDetails = (newData) => {
  try {
    const dbFile = fs.readFileSync(dbPath, 'utf8');
    const dbContent = JSON.parse(dbFile);

    // Modify the data (e.g., add new item)
    dbContent.users.push(newData);

    // Write updated content back to db.json
    fs.writeFileSync(dbPath, JSON.stringify(dbContent, null, 2), 'utf8');
    console.log('db.json updated successfully!');
    return { success: true, message: 'Data added successfully', data: newData };
  } catch (error) {
    console.error('Error modifying db.json:', error);
    return { success: false, message: 'Error updating db.json' };
  }
};

// Function to modify db.json
const getDbJson = () => {
  try {
    // Read the db.json file
    const dbFile = fs.readFileSync(dbPath, 'utf8');
    const dbContent = JSON.parse(dbFile);
    return { success: true, data: dbContent };
  } catch (error) {
    console.error('Error reading db.json:', error);
    return { success: false, message: 'Error reading db.json' };
  }
};

// API endpoint to handle db modification
app.post('/add-item', (req, res) => {
  const newItem = req.body;

  // Call modifyDbJson function
  const result = modifyUserDetails(newItem);
  res.status(result.success ? 200 : 500).json(result);
});

// API endpoint to handle db modification
app.get('/items', (req, res) => {

  // Call modifyDbJson function
  const result = getDbJson();
  res.status(result.success ? 200 : 500).json(result);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});