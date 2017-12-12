const use = require("../namespace.js");
const util = require ('util');
const fs = require('fs');
const qs = require('querystring');
const request = require('request');
const package = use.Library("package.js.node.js");
   const _class_ = package.lang.class;

   const App = package.node.App;
   const AdminManager = package.node.AdminManager;

   const header =  use.Resource('view/header.html');
   const detail = '<form action="./" method="post">user：<input type="text" name="user" size="40" maxlength="20"></p>password：<input type="text" name="password" size="40" maxlength="20"></p><p><input type="submit" value="login"></p></form>';
   const footer =  use.Resource('view/footer.html');
   const loginView = header + detail + footer;


(function(){
    return _class_( "LoginViewController" ,
    function (self,public,static,protected){

 public.post = function (req,res,data){
    let postDataObject = qs.parse(data);

console.log(req.headers.cookie);


    let isLogin = AdminManager.login(postDataObject.user, postDataObject.password,"/admin/user.txt");
    App.setHeader(res,AdminManager.session(3600,false,"/admin/user.txt"));
    if(!isLogin)
      App.render(res,loginView);
    else
      App.render(res,"loginView");
  };

 public.get = function (req,res,data){
   //     App.render(res,view);
   console.log(req.headers.cookie);
   App.render(res,loginView);
  };
    　},/* static = */ true ,/* protected = */ false);
 })();
