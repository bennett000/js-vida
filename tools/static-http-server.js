/*global __dirname, require, console */
var connect = require('connect'),
port = 8081,
path = __dirname +'/../src/';

connect(
    connect['static'](path)
).listen(port);

console.log('Serving static files from ', path, 'on port ', port);
