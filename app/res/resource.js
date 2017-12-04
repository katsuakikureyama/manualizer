const fs = require('fs');
 const resource = function (addr){
    return fs.readFileSync(process.cwd()+"/app/res/"+addr, 'utf-8' );
   }
module.exports = resource ;