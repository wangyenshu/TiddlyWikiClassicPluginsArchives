/***
|''Name:''|LoadRemoteFileThroughProxy (previous LoadRemoteFileHijack)|
|''Description:''|When the TiddlyWiki file is located on the web (view over http) the content of [[SiteProxy]] tiddler is added in front of the file url. If [[SiteProxy]] does not exist "/proxy/" is added. |
|''Version:''|1.1.0|
|''Date:''|mar 17, 2007|
|''Source:''|http://tiddlywiki.bidix.info/#LoadRemoteFileHijack|
|''Author:''|BidiX (BidiX (at) bidix (dot) info)|
|''License:''|[[BSD open source license|http://tiddlywiki.bidix.info/#%5B%5BBSD%20open%20source%20license%5D%5D ]]|
|''~CoreVersion:''|2.2.0|
***/
//{{{
	
version.extensions.LoadRemoteFileThroughProxy = {
 major: 1, minor: 1, revision: 0, 
 date: new Date("mar 17, 2007"), 
 source: "http://tiddlywiki.bidix.info/#LoadRemoteFileThroughProxy"};

if (!window.bidix) window.bidix = {}; // bidix namespace
if (!bidix.core) bidix.core = {};

bidix.core.loadRemoteFile = loadRemoteFile;
loadRemoteFile = function(url,callback,params)
{
 if ((document.location.toString().substr(0,4) == "http") && (url.substr(0,4) == "http")){ 
 url = store.getTiddlerText("SiteProxy", "/proxy/") + url;
 }

 return bidix.core.loadRemoteFile(url,callback,params);
}
//}}}
