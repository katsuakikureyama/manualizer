/**
PackageJS

Copyright (c) 2017 katsuakikureyama

This software is released under the MIT License.
http://opensource.org/licenses/mit-license.php
*/

/*  you should use ES6 notation  */

const http = require('http');
const fs = require('fs');
const archiver = require('archiver');
const path = require("path");
const package = require("./package.js");

package.node = {};
package.node.FileManager = (function(){
	return package.lang.object ( function (public){

        public.mkdir_all = function(dirs,base){
            if(!dirs){ return false; }
               var temp = "";
               var i = 0;while(i < dirs.length) {
               var d = base+temp+dirs[i];
            if(!fs.existsSync(d))
                  fs.mkdirSync(d);
              temp += dirs[i]+"/";
              i=(i+1)|0; }
            }
     public.readIfExsist = function(path){
        return (fs.existsSync(path))?fs.readFileSync(path, 'utf-8' ) : false;
     }
     public.finder = function(p,success) {
       let files = fs.readdirSync(p);
       files.filter(function(f){
            var fp = path.join(p, f); 
            if(fs.statSync(fp).isDirectory())  public.finder(fp, success); 
            else success(fp); 
        });
    };
    public.zip = function(dir_str,filename,to){
     let dirs = dir_str.split("/");
     public.mkdir_all(dirs,"/");
     var output = fs.createWriteStream(dir_str+filename+'.zip');
     var archive = archiver('zip');
        output.on('close', function () {
         console.log(archive.pointer() + ' total bytes');
         console.log('archiver has been finalized and the output file descriptor has closed.');
     });
       archive.on('error', function(err){ throw err; });
       archive.pipe(output);
       archive.directory(to, true, { date: new Date() });
       archive.finalize();
   }
      } )();
})();

package.node.App = (function(){
	return package.lang.object ( function (public){
  	    
   public.routes = function (){
      let get_methods = {};let post_methods = {};
      let get = function ( dir ,callback){ get_methods[dir] = callback; } 
      let post = function ( dir ,callback){ post_methods[dir] = callback; }
         return {  get: get
                      ,post: post 
                      ,get_methods: get_methods
                      ,post_methods: post_methods };
   }();
    public.render = function (res,view){
        res.writeHead(200, {'Content-Type': 'text/html'}); 
        res.write(view);
        res.end();
    }
   public.start = function(req,res){
       if(req.url != '/favicon.ico') {
        var url = req.url.substring(0,req.url.indexOf("?"));  if(!url)url = "/";
         if(req.method === 'GET')
             loaded(req,res,public.routes.get_methods[url]) ;
         if(req.method==='POST')
              loaded(req,res,public.routes.post_methods[url]) ;
        } };
   var loaded = function(req,res,callback){
      var data = "";
         req.setEncoding('utf8');
        req.on('data',function (chunk){
           data  += chunk;
        }).on('end',function(){
            var respose_data = '';
        callback(req,res,data); });
      }

  public.server = function(hostname,port){ 
     let start =  http.createServer(function (req, res){
        public.start(req,res);
        } ).listen(port, hostname, () => {   
           console.log(`Server running at http://${hostname}:${port}/`);
        })
      return {start:start}; 
   };       
   })();
})();

  if(package.isNode)
    module.exports = package;