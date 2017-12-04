const routes = require ('./app/routes.js');
const use = require ('./app/namespace.js');
const package = use.Library("package.js.node.js");
   const App = package.node.App; 

const hostname = '127.0.0.1';
const port = 3000;

routes(App);
App.server(hostname,port).start;