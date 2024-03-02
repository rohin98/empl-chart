const express = require('./ROOT/node_modules/express');
const path = require('path'); // Corrected path import

const app = express();
const PORT = process.env.PORT || 3000; // Use port 3000 or the one provided by the environment

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Route for the homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});