/*global __dirname, require, console */
var connect = require('connect'),
port = 8080,
path = __dirname +'/../release/';

connect(
    connect['static'](path)
).listen(port);

console.log('Serving static files from ', path, 'on port ', port);
