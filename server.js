const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const dataFilePath = path.join(__dirname, 'data', 'attendances.json');

// Leggi le presenze dal file JSON
const readAttendances = () => {
    try {
        const data = fs.readFileSync(dataFilePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

// Scrivi le presenze nel file JSON
const writeAttendances = (attendances) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(attendances, null, 2));
};

// API endpoint per ottenere tutte le presenze
app.get('/api/attendances', (req, res) => {
    const attendances = readAttendances();
    res.json(attendances);
});

// API endpoint per aggiungere una nuova presenza
app.post('/api/attendances', (req, res) => {
    const attendances = readAttendances();
    const newAttendance = req.body;
    newAttendance.id = Date.now(); // assegna un ID univoco basato sull'ora corrente
    attendances.push(newAttendance);
    writeAttendances(attendances);
    res.status(201).json(newAttendance);
});

// API endpoint per cancellare una presenza per ID
app.delete('/api/attendances/:id', (req, res) => {
    const attendances = readAttendances();
    const attendanceId = parseInt(req.params.id, 10);
    const updatedAttendances = attendances.filter((attendance) => attendance.id !== attendanceId);
    writeAttendances(updatedAttendances);
    res.status(204).send();
});

// Avvio del server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
