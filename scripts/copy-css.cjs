const fs = require('node:fs');
const path = require('node:path');
fs.copyFileSync(path.join(__dirname, '../lab2/styles.css'), path.join(__dirname, '../lab3/styles.css'));
