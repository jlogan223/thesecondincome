const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const mimeTypes = {
  '.html': 'text/html',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.svg':  'image/svg+xml',
};

const server = http.createServer((req, res) => {
  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
  const ext = path.extname(filePath);
  const contentType = mimeTypes[ext] || 'text/plain';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h2>Page not found</h2>');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'unknown';
}

server.listen(3002, '0.0.0.0', () => {
  const localIP = getLocalIP();
  console.log('========================================');
  console.log('  Extra Income UK is running!');
  console.log('========================================');
  console.log('');
  console.log('  On this PC:');
  console.log('  http://localhost:3002');
  console.log('');
  console.log('  On other devices (phone, tablet, laptop');
  console.log('  on the same WiFi):');
  console.log('  http://' + localIP + ':3002');
  console.log('');
  console.log('  Press Ctrl+C to stop.');
  console.log('========================================');
});
