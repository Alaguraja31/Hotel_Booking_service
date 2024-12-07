const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3001; // Use a different port than json-server
const dbPath = path.join(__dirname, 'db.json');

// Middleware to parse JSON request bodies
app.use(express.json());

// login
const userLogin = (login) => {
  try {
    const dbFile = fs.readFileSync(dbPath, 'utf8');
    const dbContent = JSON.parse(dbFile);

    const userDetails = dbContent.users.find(user => user.email === login.email && user.password === login.password);

    if(userDetails){
      userDetails.login = true;
      dbContent.currentUser = userDetails.name;
      fs.writeFileSync(dbPath, JSON.stringify(dbContent, null, 2), 'utf8');
      return { success: true, message: 'Successfully login in' };
    }

    const isUsername = dbContent.users.some(user => user.email !== login.email)
    const isPassword =  dbContent.users.some(user => user.password !== login.password);

    return { success: false, message: `Your ${isUsername && "User name"} ${isPassword && "Password"} is missmatching!` };
    
  } catch (error) {
    console.error('Error for login:', error);
    return { success: false, message: 'Login Failed' };
  }
};

//user Registration
const userRegistration = (newUser) => {
  try {
    const dbFile = fs.readFileSync(dbPath, 'utf8');
    const dbContent = JSON.parse(dbFile);

    const isUserAlready = dbContent.users.some(user => user.email === newUser.email);

    if(isUserAlready){
      return { success: true, message: 'Your email id is exist!' };
    }

    dbContent.users.push(newData);

    fs.writeFileSync(dbPath, JSON.stringify(dbContent, null, 2), 'utf8');
    console.log('db.json updated successfully!');
    return { success: true, message: 'Data added successfully', data: newData };
  } catch (error) {
    console.error('Error modifying db.json:', error);
    return { success: false, message: 'Error updating db.json' };
  }
};

// get user details
const getUserDetails = () => {
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


app.post('/userLogin', (req, res) => {
  const user = req.body;

  const result = userLogin(user);
  res.status(result.success ? 200 : 500).json(result);
});


app.post('/userRegistration', (req, res) => {
  const newItem = req.body;

  const result = userRegistration(newItem);
  res.status(result.success ? 200 : 500).json(result);
});


app.get('/getUserDetails', (req, res) => {
  // Call modifyDbJson function
  const result = getUserDetails();
  res.status(result.success ? 200 : 500).json(result);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});