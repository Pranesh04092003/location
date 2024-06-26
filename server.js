const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 8000; 

app.use(bodyParser.json());
app.use(express.static('public'));

// MongoDB connection URI
const uri = process.env.MONGODB_URI;
const dbName = 'locationTracker';

// Function to generate Google Maps link
function generateGoogleMapsLink(latitude, longitude) {
    return `https://www.google.com/maps?q=${latitude},${longitude}`;
}

// Connect to MongoDB
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect().then(() => console.log('Connected to MongoDB'))
                .catch(err => console.error('Error connecting to MongoDB:', err));

// Endpoint to serve the index.html page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Endpoint to serve the tracking link
app.get('/track', (req, res) => {
    res.sendFile(__dirname + '/public/track.html');
});

// Endpoint to receive location data and store in MongoDB
app.post('/location', async (req, res) => {
    const location = req.body;
    console.log('Location data received:', location);

    try {
        const db = client.db(dbName);
        const collection = db.collection('locations');
        const result = await collection.insertOne(location);
        console.log('Location data saved to MongoDB:', result.insertedId);

        // Generate Google Maps link
        const googleMapsLink = generateGoogleMapsLink(location.latitude, location.longitude);

        // Send response
        res.json({
            message: 'Location data received and saved successfully',
            googleMapsLink: googleMapsLink
        });
    } catch (err) {
        console.error('Error saving location data to MongoDB:', err);
        res.status(500).json({ error: 'Error saving location data to MongoDB' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
