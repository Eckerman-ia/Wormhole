const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();

// Replace the target URL with the new proxy link
const targetUrl = 'https://www.google.com/?safe=active&ssui=on';

// Create a proxy middleware
const proxyMiddleware = createProxyMiddleware({
  target: targetUrl,
  changeOrigin: true, // Needed for virtual hosted sites
  pathRewrite: {
    [`^/proxy`]: '', // Remove the /proxy prefix when forwarding requests
  },
});

// Use the proxy middleware
app.use('/proxy', proxyMiddleware);

// Serve static files from the public directory
app.use(express.static('public'));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Set up the route for handling search requests
app.get('/search', (req, res) => {
  // Extract the search query from the request parameters
  const searchQuery = req.query.q;

  // Forward the search query as part of the proxy URL
  res.redirect(`/proxy?q=${searchQuery}`);
});

// Set up the default route
app.get('/', (req, res) => {
  res.render('index');
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

