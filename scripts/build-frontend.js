const path = require('path');
const { execSync } = require('child_process');

execSync('node node_modules/vite/bin/vite.js build', {
  cwd: path.join(__dirname, '..', 'frontend'),
  stdio: 'inherit',
  shell: true
});
