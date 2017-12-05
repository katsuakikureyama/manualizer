/**
PackageJS

Copyright (c) 2017 katsuakikureyama

This software is released under the MIT License.
http://opensource.org/licenses/mit-license.php
*/
/*  function printProperty(p) {
		for(var propName in p) {
    		propValue = p[propName]
    	console.log(propName,propValue);
		}
}*/	 

var package = package || (function (use){ 
var PackageJS = PackageJS ||  function (js){
	if( js.inNodeJS === undefined )
     try{
     	    if( module )
                if(module.exports ) js.inNodeJS = true;
   } catch( err ){ js.inNodeJS = false; } 

js.lang = js.lang || {}; js.lib = js.lib || {};
js.lang.object = function(body){return function(){ var _={}; body(_); return _; }; }
js.instance = function(){
	var ins = [] ; var protected =[];
	return js.lang.object ( function (public){
 		public.entry = function(instance,p){
 			if(!instance.$){ delete instance.$;}
 			if(p){
 			  var n = ins.push(instance)-1;
 			  if (!protected[n])protected[n]={}; 
 			  return protected[n];
 			 }else ins.push(instance); 
 		  return false;
 		 }
 		public.is = function(instance){ return ins[ins.indexOf(instance)]; }
 		public.get_protected = function(a){
 			var i = 0; var len = ins.length;
 			while(i < len) {
 				var temp = JSON. stringify(ins[i]);
  				if( JSON. stringify(a)==temp)
  				 if(protected[i]) return protected[i];
  				 else break;
 			   i=(i+1)|0;
			}
 			
 		}
  }); }()(); 
js.defined = function(){
	var clas = {} ,impl = {};
	return js.lang.object ( function (public){
 		public.entry = function(type,obj){ 
 		 		 if(!clas[type]){
 		 	Object.freeze(obj);clas[type]=obj; }
 		else throw new Error ( type +" was already exsist ." );  
 		public.class =  clas ;
 	}
 	 public.entryImpl = function( type,obj){ 
 		 if(!impl[type]){Object.freeze(obj);impl[type]=obj; }
 		  else throw new Error ( type +" was already exsist ." );  
 	  	 public.interface =  impl ;
	 	}
 	} );
}()();

js.lang.class = (function(type,body,s,pr){ 
    if(s)s={}||undefined;
    if(pr)pr=true||undefined;
     js.defined.entry( type,{$:s,hasProtected:pr,new: 
	function(c){  
	    var pu = {};
		var instance = {}; instance._ = pu;
		    instance.$= instance.$|| this.$;
		  		 var pr = js.instance.entry( instance,this.hasProtected);
		 var  _ = {_:pu};  _.$ = this.$; body(_,pu,s,pr,c);
		 	 return _; },Type:function(){return type}}); });
 
js.lang.extends=function(type,extend,body,s,pr){ 
	 js.defined.entry(type,{$:s,hasProtected:pr,new:
	function(c){
		var ext=extend.new();
	 	var pr = this.hasProtected;
		if(pr)pr=js.instance.get_protected(ext);
	 	if(this.$)ext.$=(ext.$!==false)?ext.$:{};
		  body(ext,ext._,pr,ext.$,c);
	  return ext; },ext:Type=function(){return type}}); }

js.lang.interface = function(type,body){
     var type = type; 
     return function(){	js.defined.entryImpl( type,body); }; }

js.lang.implements = function(acceser,impl){
      Object.keys(impl).forEach(function (key) {
            acceser[key] = impl[key];
    });
} 
js.lang.struct = function() { var args = arguments , len = args.length; if((len % 2)!=0) throw new Error( Object.keys(this)[0] + "argument nunber is invalid");	var obj = {}; for(var i=0;i < len ; i += 2) obj[args[i]] = args[i+1];return function(){ return obj; }; }

js.loader  = (function(){
return js.lang.object ( function (public){    
      var ext = ".js";
     public.import = function(name){
         if ( js[name] === undefined)
            if ( ! js.inNodeJS) scriptTag(name);
           else imports(name);
      }
      this.imports = function(name){ module.exports =  name + ext; }
      this.scriptTag = function(name){
        var scripts = document.getElementsByTagName( 'script' );
         var i = 0 ;while( i < scripts.length){ 
             if(li = scripts[i].src.lastIndexOf("package.js"))
                  {  name = scripts[i].src + "." + name + ".js";  break; } 
          i=(i+1)|0;}
         var script = document.createElement( 'script' );
         script.type = 'text/javascript';  script.src = name;
         var packageTag = document.getElementsByTagName( 'script' )[ i ];
         packageTag.parentNode.insertBefore( script, null);
       }
      
      })();
})();


return js; }({});
PackageJS.lib = PackageJS.lib || 
{ accessor : { final: Object.freeze }}; return PackageJS; })();

  if(package.inNodeJS)
    module.exports = package;
  