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


//let EditorViewController=
(function(){
const cwd = process.cwd()+"/";
const document_path = cwd+"document/";
const document_tree_path =  cwd+"document/app/tree/";
const structure_path = cwd+'document/app/structure.json';
const vs = "var structure = ";
const contents_path = cwd+'document/app/contents.json';
const vc = "var contents = ";
const vt = "var treeLinks =";
const archives_dir = cwd+"archivies";

const head =use.Resource("view/document_header.html");
const foot =  use.Resource("view/document_footer.html");
var map = {};
var treeLinks = [];


    return _class_( "EditorViewController" ,
    function (self,public,static,protected){

 public.post = function (req,res,data){
        let postDataObject = qs.parse(data);
        let contents = FileManager.readIfExsist(contents_path);
        console.log(contents_path);
        console.log(contents);

        var contentsJSON =  (!contents)? {}:JSON.parse(contents.replace(vc,""));
        contentsJSON[postDataObject.path] = postDataObject;
       FileManager.write(contents_path,vc+JSON.stringify(contentsJSON),function(e){if(e)console.log(e);});

        let path = postDataObject.path;

        let dirs = path.split("/"); dirs.pop();
        FileManager.mkdirAll(dirs,document_tree_path);

        let save = head + postDataObject.md + foot;
         FileManager.write(document_tree_path+path,save,function(e){if(e)console.log(e);});

         let view = "<!DOCTYPE html><html><head></head><body><a href='/'>return</a></body></html>";
         App.render(res,view);
};
/*request processing methods end*/

 public.get = function (req,res,data){
          let result =  FileManager.finder(document_tree_path, function(path) {
            path = path.replace( /.DS_St/g , "" ) ; path = path.replace( /.ore/g , "" ) ;
            let p = path.substring(document_tree_path.length-1,path.length)
            let list = p.split('/');
            console.log(Objects.dig({},list));
           map = Object.assign(Objects.dig(map,list));
        });
         let stru= vs + JSON.stringify(map) + ";";
          FileManager.write(structure_path,stru,function(e){if(e)console.log(e);});

         let postDataObject = qs.parse(data);
               FileManager.zip(archives_dir,"/document","document");

        var tmp = "";var tmp_file_name = "";
         var tmp_dirs = []; var tmp_row = 0;
             var ht = Render.createListTree( map,
              {   begin         :  "<ul class='list'>"
                 ,item_begin: "<li>"
                 ,item           : ""
                 ,item_close: "</li>"
                 ,close         :"</ul>" }
              , function(key,current_row,count){

                   console.log(key+"_"+current_row+"_"+count+"_");

                    if( count < tmp_dirs.length-1 )
                           tmp_dirs.splice( count,tmp_dirs.length ) ;
                           tmp_dirs[count] =  key;
                   var tmp_dir =tmp_dirs.join("/");
                   if(!Strings.contain(tmp_dir,".html"))
                        treeLinks.push(tmp_dir );
                   console.log(tmp_dir + "____");
                   ext = '.html';
                   tag = "<a href=' /?url="+tmp_dir.replace(/\/\//g,"/") + " '>" + key.replace(ext,'')  +  "</a>";
                   //tag = key;
                 // if(Strings.contain(key,ext)){ tmp = tmp.split("/"); tmp.pop(); tmp.join('/');  }
                 return tag;


             });
               ht = '<article class ="col-12 col-sm-4 float-left">' + ht + "</article>";
        let header = use.Resource('view/header.html');
        let menu = ht;
        let form = use.Resource('view/editor.html');
        var script="" ;   var txt  = "";
        let au = treeLinks;
             au = Arrays.unique(au);
       let json ="<script> "+ stru + vt +JSON.stringify(au) +";</script>";
       let params = qs.parse(req.url);
       console.log(params);
          if(params["/?url"])
            if(!fs.statSync(document_tree_path+params["/?url"]).isDirectory()){
              txt = fs.readFileSync(document_tree_path+params["/?url"], "utf-8");
              txt = txt.replace(head, '').replace(head,"").replace(foot, '').replace(/\r?\n/g,"<br>");
              console.log(txt);
            script +="<script>document.getElementById('messageArea').innerText='';document.getElementById('editorArea').style.display='block'; load_editor('" +txt+"');</script>";
        } else{script +="<script>document.getElementById('messageArea').innerText='here is directory.';document.getElementById('editorArea').style.display='none';</script>";}
        let footer =use.Resource('view/footer.html');

        let view = header +  menu + json +  form + script + footer;
        App.render(res,view);
  };
    　},/* static = */ true ,/* protected = */ false);
 })();

  //module.exports = EditorViewController;
