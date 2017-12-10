/**
PackageJS

Copyright (c) 2017 katsuakikureyama

This software is released under the MIT License.
http://opensource.org/licenses/mit-license.php
*/

/*  you should use ES6 notation  */

const package = require("./package.js");

package.node = package.node|| {};
package.node.FileManager = (function(){
	return package.lang.object ( function (public){
        const fs = require('fs');
        const path = require("path");
        public.mkdirAll = function(dirarr,base){
            if(!dirarr){ return false; }
               var temp = "";
               var i = 0;while(i < dirarr.length) {
               var d = base+temp+dirarr[i];
            if(!fs.existsSync(d))
                  fs.mkdirSync(d);
              temp += dirarr[i]+"/";
              i=(i+1)|0; }
            }
     public.readIfExsist = function(file_path){
        return (fs.existsSync(file_path))?fs.readFileSync(file_path, 'utf-8' ) : false;
     }

     public.write = function(file_path,text,callback){
          fs.writeFile(file_path , text , (err) => {
              if(callback)callback(err);
         });
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
    const archiver = require('archiver');

     let dirs = dir_str.split("/");
     public.mkdirAll(dirs,"/");
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

package.node.Crypto = (function(){
     return package.lang.object ( function (public){
    const crypto = require("crypto");
    public.encryptAES256 = (text) => {
       let cipher = crypto.createCipher('aes-256-ctr' ,key)
       return crypted = cipher.update(text,'utf8','hex') + cipher.final('hex');
    }
    public.decryptAES256 = (text) => {
      let decipher = crypto.createDecipher('aes-256-ctr',key);
      return decipher.update(text,'hex','utf8') + decipher.final('utf8');
    };
   public.sha256 = (seed) =>{
       let hash = crypto.createHash('sha256');
       hash.update(seed)
       return hash.digest('base64')
   }
   public.randStr = () =>{
		  return crypto.randomBytes(8).toString('hex');
	 }

 })();
})();
package.node.AdminManager = (function(){
	return package.lang.object ( function (public){
	      const Crypto = package.node.Crypto;
	      const FileManager = package.node.FileManager;
        const currentpath = "./";

				public.session = function (time,isSecure){
					 let option =	['name='+Crypto.randStr(),'max-age='+time];
					 if(isSecure) option.push('Secure');
					 return {'Set-Cookie':option,'session':true};
				}

        public.login = function(user,password,file_path){
					if(!user || user == "")return false;

					var save_obj = {};
					let file = FileManager.readIfExsist(currentpath+file_path);
					if(file){  try {  save_obj  = JSON.parse(file); }
											 catch (e) { save_obj = {}; cosole.log(e);} }
						else return false;

					if(!save_obj[user]) return;

					let hashed_pass = Crypto.sha256(password);
					if( save_obj[user].password === hashed_pass ) return true;

						return false;
				}

	      public.userAdd = function(user,pass,auth,path,filename){
	           if(!user || !pass || !auth || !path || !filename ) return false;
	           console.log(user+pass+auth);
	           if(auth !== "author" && auth !== "subscriber")
	             {  console.log("i'm sorry. you must be select author or subscriber .");  return false; }
	            let hashed_pass = Crypto.sha256(pass);
	            var save_obj = {};
	            let p = path.join("/");
	            let file_path =currentpath+p+"/"+filename;
	            let file = FileManager.readIfExsist(file_path);

	            if(file){  try {  save_obj  = JSON.parse(file); }
                           catch (e) { save_obj = {}; cosole.log(e);} }
               else FileManager.mkdirAll(path,currentpath);

                if( save_obj[user] )
                     console.log(" user was exsists");
                else{ save_obj[user] = {password:hashed_pass,authority:auth};
                     console.log(file_path);
                          FileManager.write(file_path, JSON.stringify( save_obj ));
                          return true; }
               return false;
	        }
	      public.userDel = function(user,pass,path,filename){
	           if(!user || !pass || !path || !filename ) return false;

	            let hashed_pass = Crypto.sha256(pass);
	            var save_obj = {};
	            let currentpath = "./";  let p = path.join("/");
	            let file_path =currentpath+p+"/"+filename;
	            let file = FileManager.readIfExsist(file_path);

	            if(file){
	            try {  save_obj  = JSON.parse(file);
                        if( save_obj[user].password === hashed_pass )  {
                            delete save_obj[user];
                            FileManager.write(file_path, JSON.stringify( save_obj ));
                              return true;  }
	            } catch (e) { cosole.log(e);} }

                   console.log("user was now exsists")
               return false;
	        }


  	   })();
})();

package.node.App = (function(){
	return package.lang.object ( function (public){
  	const http = require('http');

		public.setHeader = function(res,header){
			if(header){
				 if(header.session){
						session = header.session;
						delete header.session; }
			 for( var key in header)
					 res.setHeader(key , header[key]);
			 }
		 }

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

   public.start = function(req,res,header){
       if(req.url != '/favicon.ico') {
				 let url = req.url;

				//var url = req.url.substring(0,req.url.indexOf("?"));
				//if(!url)url = "/";
         if(req.method === 'GET' && null != public.routes.get_methods[url] )
             loaded(req,res,public.routes.get_methods[url],header) ;
    else if(req.method==='POST' && null != public.routes.post_methods[url])
              loaded(req,res,public.routes.post_methods[url],header) ;
         else  public.render(res,"page not found .")
				}
			 };
   let loaded = function(req,res,callback){
      let data = "";
			let session;
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

  if(package.inNodeJS)
    module.exports = package;
