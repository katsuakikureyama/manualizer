const use = require ('./namespace.js');
const package = use.Library("package.js.node.js");
const AdminManager = package.node.AdminManager; 

  const command = function(commands){
    let command = commands[2];
     switch (command){
      case "adduser":
           console.log( AdminManager.userAdd(process.argv[3],process.argv[4],process.argv[5],["admin"],"user.txt") );
      break;
      case "userdel":
           console.log( AdminManager.userDel(process.argv[3],process.argv[4],["admin"],"user.txt") );
		break;
    default :
    	console.log("please comand \n example \n useradd");
    break;
  }
}
   module.exports = command;