/***
{{{<<writeIt {{'[[Current TW Directory|'+getTiddlyWikiDir()+']]'}}>>}}}
<<writeIt {{'[[Current TW Directory|'+getTiddlyWikiDir()+']]'}}>>

{{{<<writeIt {{"TW Last modified: "+(new Date(document.lastModified)).formatString("DD/MM/YYYY")}}>>}}}
<<writeIt {{"TW Last modified: "+(new Date(document.lastModified)).formatString("DD/MM/YYYY")}}>>


***/
//{{{


config.macros.writeIt = {};
config.macros.writeIt.handler= function(place,macroName,params,wikifier,paramString,tiddler) {
 wikify(params[0],place);

}
//}}}

//{{{
window.getTiddlyWikiDir=getTiddlyWikiDir;
//this function written by Udo
function getTiddlyWikiDir() {
          var path = document.location.toString();
          var i = path.lastIndexOf("/");
          return (i >= 0) ? path.substr(0, i+1) : path;
}

//}}}
   

