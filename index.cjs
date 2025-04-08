// Replit entry file (CommonJS)
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

console.log('Starting SmileHKGBA application...');

function checkExists(filePath) {
  return fs.existsSync(filePath);
}

// Try to find the server file
if (checkExists('./server.js')) {
  console.log('Found server.js, starting...');
  require('./server.js');
} else if (checkExists('./server.cjs')) {
  console.log('Found server.cjs, starting...');
  require('./server.cjs');
} else {
  console.log('No server file found, trying to start with tsx...');
  if (checkExists('./server/index.ts')) {
    console.log('Found server/index.ts, starting with tsx...');
    const tscProcess = exec('npx tsx server/index.ts', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error running tsx: ${error}`);
        return;
      }
      console.log(stdout);
      console.error(stderr);
    });
    
    tscProcess.stdout.on('data', (data) => {
      console.log(data);
    });
    
    tscProcess.stderr.on('data', (data) => {
      console.error(data);
    });
  } else {
    console.error('No server file found. Please ensure one of the following exists:');
    console.error(' - server.js');
    console.error(' - server.cjs');
    console.error(' - server/index.ts');
  }
}