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

package.html = {};

package.html.Dom = (function(){
return package.lang.object ( function (public){	
      } )();
})();
package.html.Tag = (function(){
package.html = {};
return package.lang.object ( function (public){	    
      })();
})();

package.html.Render = (function(){
	return package.lang.object ( function (public){	
	/* tag =  {begin:"<ul>" ,item_begin:"<li>",item:"here is detail.",item_close:"</li>",close:"</ul>"}*/
	/*callback = function(key,row,count,option){}*/
	 var current_row = 0;
     public.createListTree =  function(map,tag,callback,option,count){
        var result = tag.begin;
        var row = 0;
         count = (!count)?0 : count;
          Object.keys(map).forEach(function (key) {
           if(current_row !== row ) current_row = row;
              var ht = callback(key,current_row,count,option);
              ht = (!ht)?"":ht;
             result += tag.item_begin + tag.item + ht + tag.item_close;
           if(package.utility.Objects.isExsistKey(map[key])){
              count ++;
              result += tag.item_begin + public.createListTree(map[key],tag,callback,option,count) + tag.item_close;  
              count --;
            row ++;
            }
         }); 

        return  result += tag.close; }      
     })();
})();
