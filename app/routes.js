const use = require("./namespace.js");
const package = use.Library("package.js");

   use.Controller("EditorViewController.class.js");
   use.Controller("DocumentSelectViewController.class.js");
   use.Controller("LoginViewController.class.js");

   const $ = package.defined;
    let routes = function (App){
       let editorViewController = $.class.EditorViewController.new();
       let documentSelectViewController = $.class.DocumentSelectViewController.new();
       let loginViewController = $.class.LoginViewController.new();


         App.routes.post("/admin/",loginViewController._.post);
         App.routes.get("/admin/",loginViewController._.get);

         App.routes.post("/", editorViewController._.post);
         App.routes.get("/",editorViewController._.get);

         App.routes.post("/admin/select/", documentSelectViewController._.post);
         App.routes.get("/admin/select/",documentSelectViewController._.get);

   }
module.exports = routes;
