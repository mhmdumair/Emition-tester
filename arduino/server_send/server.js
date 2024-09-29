const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.get('/update_sensor', (req, res) => {
    const temperature = req.query.temperature;

    // Check if temperature is provided
    if (!temperature) {
        return res.status(400).send('Temperature data is missing');
    }

    // Log the data (you can also store it in a database or file)
    const logData = `Temperature: ${temperature} C\n`;
    console.log(logData);

    // Save the temperature data to a file
    fs.appendFile('sensor_data.txt', logData, (err) => {
        if (err) {
            return res.status(500).send('Failed to save data');
        }
    });

    // Respond to the client (Python script) that data was received
    res.send('Data received successfully!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
