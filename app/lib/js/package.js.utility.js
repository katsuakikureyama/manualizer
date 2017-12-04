/**
PackageJS

Copyright (c) 2017 katsuakikureyama

This software is released under the MIT License.
http://opensource.org/licenses/mit-license.php
*/
if(!package)
  var package = require("./package.js");
if(package.isNode)
   module.exports = package; 

package.utility = {};


package.utility.Strings = (function(){
	return package.lang.object ( function (public){
     public.contain = function ( str,search ) {
	      return ( str.indexOf(search) +1)?true:false;  }
    } )();
})();

package.utility.Arrays = (function(){
	return package.lang.object ( function (public){
     public.unique = function ( array ) {
	return array.filter( function( value, index ) {
		return index === array.indexOf( value ) ;
	} ) ;
}     
      } )();
})();
package.utility.Maps = (function(){
	return package.lang.object ( function (public){	
  
      } )();
})();

package.utility.Objects = (function(){
	return package.lang.object ( function (public){
	    
    public.typeIs = function(o) { return o instanceof Object && !(o instanceof Array); };    
    public.isExsistKey = function(o) { return (Object.keys(o).length) ? true : false;  }; 
    public.isContainKey = function(o,key){ return key in o;  }
    public.dig = function(map,list){
           var temp  = list.shift();
            if(temp){
              if(!public.typeIs(map)){map = {};}
             map[ temp ] = public.dig(map[temp],list);
           }else return {};
            return map;
        }
      } )();
})();


  
