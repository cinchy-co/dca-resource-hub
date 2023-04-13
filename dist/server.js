const express = require('express');
const path = require('path');
const redirects = {};

const app = express();

let failedRoute = '';
const baseHref = '/hub';

// Function to handle 404 errors
const handle404 = (req, res) => {
  console.log('1111 REQ UR, handle404', req.url)
  failedRoute = req.url;
  let filePath = path.join(__dirname, 'static', 'index.html');
  res.sendFile(filePath)
}

app.use((req, res, next) => {
  if (req.url.startsWith(baseHref)) {
    req.url = req.url.substr(baseHref.length);
  }
  next();
});

app.get('/get-failed-route', (req, res) => {
  res.json({ failedRoute });
});

// Route handler for static files
app.get('*.:ext', (req, res) => {
  let url = req.url;
  let ext = req.params.ext;
  let filePath = path.join(__dirname, 'static', url);
  res.sendFile(filePath, (err) => {
    if (err) {
      handle404(req, res);
    }
  });
});

// Route handler for index.html
app.get('*', (req, res) => {
  let url = req.url;
  let filePath = path.join(__dirname, 'static', url, 'index.html');
  const newUrl = redirects[req.url];
  console.log('1111 REQ URL', url, newUrl);
  if (newUrl) {
    let updatedUrlWithBase = newUrl;
    if (!newUrl.startsWith('http')) {
       updatedUrlWithBase = `${baseHref}${newUrl}`;
    }
    res.redirect(301, updatedUrlWithBase);
  } else {
    res.sendFile(filePath, (err) => {
      if (err) {
        console.log('1111 REQ URL in error', req.url);
        handle404(req, res);
      } else {
        console.log('1111 REQ URL in  error ELSE', req.url);
        failedRoute = '';
      }
    });
  }
});

// Serve static files
app.use(express.static(path.join(__dirname, 'static')));

// Start server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
