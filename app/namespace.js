const namespace= {
    App:function(res){  return require("./" + res ); },
    Controller:function(res){ return require("./controller/" + res ); },
    Library:function(res){ return require("./lib/js/" + res ); },
    Resource:function(res){  return require("./res/resource.js" )(res);}
 }
module.exports = namespace;
