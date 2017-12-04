const use = require("../namespace.js");
const util = require ('util');
const fs = require('fs');
const qs = require('querystring');

const package = use.Library("package.js.node.js");
   use.Library("package.js.utility.js");
   use.Library("package.js.html.js");
   const _class_ = package.lang.class;
    
   const App = package.node.App; 
   const FileManager = package.node.FileManager; 
   const Arrays = package.utility.Arrays; 
   const Strings = package.utility.Strings; 
   const Objects = package.utility.Objects; 
   const Render = package.html.Render; 

(function(){

    return _class_( "DocumentSelectViewController" ,
    function (self,public,static,protected){
        
 public.post = function (req,res,data){ 
        //      App.render(res,view); 
  };

 public.get = function (req,res,data){ 
   //     App.render(res,view); 
  };
    　},/* static = */ true ,/* protected = */ false);
 })();
