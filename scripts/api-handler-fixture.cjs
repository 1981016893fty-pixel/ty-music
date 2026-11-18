const { createServer } = require('../server-simple.js');
createServer({ staticFiles: false }).listen(0);
