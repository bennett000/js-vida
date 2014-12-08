var connect = require('connect'),
port = 8080,
path = __dirname +'/../src/';

connect(
    connect['static'](path)
).listen(port);

console.log('Serving static files from ', path, 'on port ', port);
