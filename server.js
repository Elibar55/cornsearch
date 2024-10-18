const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// API endpoint to get all escalations
app.get('/api/escalations', (req, res) => {
    fs.readFile(path.join(__dirname, 'public', 'escalations.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading escalations file' });
        }
        res.json(JSON.parse(data));
    });
});

// API endpoint to get a specific escalation
app.get('/api/escalations/:caseNumber', (req, res) => {
    const caseNumber = req.params.caseNumber;
    fs.readFile(path.join(__dirname, 'public', 'escalations.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading escalations file' });
        }

        const escalations = JSON.parse(data);
        if (escalations[caseNumber]) {
            res.json(escalations[caseNumber]);
        } else {
            res.status(404).json({ error: 'Escalación no encontrada.' });
        }
    });
});

// API endpoint to update or create escalations
app.put('/api/escalations/:caseNumber', (req, res) => {
    const caseNumber = req.params.caseNumber;
    const newEscalationData = req.body;

    fs.readFile(path.join(__dirname, 'public', 'escalations.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading escalations file' });
        }

        let escalations = {};
        try {
            escalations = JSON.parse(data); // Parse existing escalations
        } catch (jsonError) {
            return res.status(500).json({ error: 'Error parsing escalations data' });
        }

        // Update or add the new escalation data
        escalations[caseNumber] = newEscalationData;

        // Write the updated escalations back to the JSON file
        fs.writeFile(path.join(__dirname, 'public', 'escalations.json'), JSON.stringify(escalations, null, 2), 'utf8', (writeError) => {
            if (writeError) {
                return res.status(500).json({ error: 'Error writing escalations file' });
            }

            res.json({ message: 'Escalación guardada correctamente.', caseNumber });
        });
    });
});

// API endpoint to delete an escalation
app.delete('/api/escalations/:caseNumber', (req, res) => {
    const caseNumber = req.params.caseNumber;

    fs.readFile(path.join(__dirname, 'public', 'escalations.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading escalations file' });
        }

        const escalations = JSON.parse(data);
        if (!escalations[caseNumber]) {
            return res.status(404).json({ error: 'Escalación no encontrada.' });
        }

        delete escalations[caseNumber]; // Remove the escalation

        fs.writeFile(path.join(__dirname, 'public', 'escalations.json'), JSON.stringify(escalations, null, 2), 'utf8', (writeError) => {
            if (writeError) {
                return res.status(500).json({ error: 'Error writing escalations file' });
            }

            res.json({ message: 'Escalación eliminada correctamente.' });
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
