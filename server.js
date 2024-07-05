const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.static('public'));

const attendancesFilePath = path.join(__dirname, 'data', 'attendances.json');

// Read attendances from JSON file
const getAttendances = () => {
  const data = fs.readFileSync(attendancesFilePath);
  return JSON.parse(data);
};

// Write attendances to JSON file
const saveAttendances = (attendances) => {
  fs.writeFileSync(attendancesFilePath, JSON.stringify(attendances, null, 2));
};

// API endpoint to get all attendances
app.get('/api/attendances', (req, res) => {
  const attendances = getAttendances();
  res.json(attendances);
});

// API endpoint to add a new attendance
app.post('/api/attendances', (req, res) => {
  const newAttendance = req.body;
  const attendances = getAttendances();
  newAttendance.id = attendances.length ? attendances[attendances.length - 1].id + 1 : 1; // Set unique ID
  attendances.push(newAttendance);
  saveAttendances(attendances);
  res.json(newAttendance);
});

// API endpoint to delete an attendance by ID
app.delete('/api/attendances/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  let attendances = getAttendances();
  attendances = attendances.filter(att => att.id !== id);
  saveAttendances(attendances);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
