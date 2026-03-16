const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3005;

// Serve static files from the root directory (where the HTML files are)
// In a Docker environment, we will mount the HTML files or copy them
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'ondas_crm.html'));
});

app.listen(port, () => {
  console.log(`Frontend server running at http://localhost:${port}`);
});
