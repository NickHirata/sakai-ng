const jsonServer = require('json-server');
const fs = require('fs');
const path = require('path');

const server = jsonServer.create();
const dbFile = path.join(__dirname, 'src', 'assets', 'demo', 'data', 'db.json');
const router = jsonServer.router(JSON.parse(fs.readFileSync(dbFile, 'utf-8')));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Middleware para evitar a gravação no arquivo
router.render = (req, res) => {
  res.jsonp(res.locals.data);
};

server.use(router);

server.listen(3000, () => {
  console.log('JSON Server is running');
});
