const use = require("./namespace.js");
const package = use.Library("package.js");

   use.Controller("EditorViewController.class.js");
   const $ = package.defined; 
   
 let routes = function (App){
    let editorViewController = $.class.EditorViewController.new();   
      App.routes.post("/", editorViewController._.post);
      App.routes.get("/",editorViewController._.get);
   }
module.exports = routes;