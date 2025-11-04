const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT ? Number(process.env.PORT) : 4173;
const rootDir = path.resolve(__dirname);

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.txt': 'text/plain; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return mimeTypes[ext] || 'application/octet-stream';
}

function sendError(res, statusCode, message) {
  res.writeHead(statusCode, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end(message);
}

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  const requestedPath = urlPath === '/' ? '/index.html' : urlPath;
  const resolvedPath = path.normalize(path.join(rootDir, requestedPath));

  if (!resolvedPath.startsWith(rootDir)) {
    sendError(res, 403, 'Forbidden');
    return;
  }

  fs.stat(resolvedPath, (err, stats) => {
    if (err) {
      if (err.code === 'ENOENT') {
        sendError(res, 404, 'Not Found');
        return;
      }
      sendError(res, 500, 'Internal Server Error');
      return;
    }

    const filePath = stats.isDirectory()
      ? path.join(resolvedPath, 'index.html')
      : resolvedPath;

    const stream = fs.createReadStream(filePath);
    stream.on('open', () => {
      res.writeHead(200, { 'Content-Type': getContentType(filePath) });
      stream.pipe(res);
    });
    stream.on('error', () => {
      sendError(res, 500, 'Internal Server Error');
    });
  });
});

server.listen(port, () => {
  console.log(`Hikari Markets is running at http://localhost:${port}`);
});
