/***
|Launch Application Plugin|
|Authors: Lyall Pearce, modified by Bradley Meck|
|Bug Finders: HarryC|
|Source: http://bradleymeck.tiddlyspot.com/#LaunchApplicationPlugin|
|License: [[Creative Commons Attribution-ShareAlike 2.5 License|http://creativecommons.org/licenses/by-sa/2.5/]]|
|Version: 1.1.0|
|Description: Launch an application from within TiddlyWiki using a button|
|Usage: {{{<<LaunchApplication "buttonLabel" "tooltip" "application" "argument1" "argument2"...>>}}}|

!Example
@@PLEASE DO NOT USE THIS IF YOU ARE WORRIED ABOUT SECURITY,
TIDDLYSPOT, LYALL PEARCE AND MYSELF ARE NOT RESPONSIBLE FOR ANY MIS-USE OF THIS PLUGIN@@
{{{
<<LaunchApplication "Open Notepad" "Text Editing"
"file:///c:/Windows/notepad.exe">>
}}}
<<LaunchApplication "Open Notepad" "Text Editing"
"file:///c:/Windows/notepad.exe">>

{{{
<<LaunchApplication "C Drive" "Folder" "file:///c:/">>
}}}
<<LaunchApplication "C Drive" "Folder" "file:///c:/">>

!To Do
*Support true XPaths
**relative paths
***{{{..}}} : parent-directory
***{{{/}}} : root-directory
**wild-cards
***{{{*}}} : unknown-name

!Revisions
*11/07/2006 : Problem with application parameters was fixed in IE.
*11/06/2006 : Problem with application parameters appeared again. Fixed in Firefox for now. Thanks to HarryC for bringing up the bug.
*11/04/2006 : Problem with application parameters was fixed so that they work now.
*10/29/2006 : Removed Alert of the address being launched and added support for non-application files in Firefox. Fixed a problem from the current directory being recieved by the W.Shell object by using decodeURI. Added absolute paths if the URL has "file:///" as its beginning. Clicking did not return false and was firing beforeUnLoad(), fixed that.
*10/28/2006 : Added Support for Firefox in Windows (changes how nsILocalFile is recieved) and changes the functions to use decodeURI for more compatibility.

***/
//{{{
version.extensions.LaunchApplication = {major: 1, minor: 1, revision: 0, date: new Date(2006,11,07)};
config.macros.LaunchApplication = {};

function LaunchApplication(appToLaunch,appParams) {
 if(! appToLaunch)
 return;
 if(config.browser.isIE) {
 // want where the tiddly is actually located, excluding tiddly html file
 var tiddlyBaseDir = self.location.pathname.substring(0,self.location.pathname.lastIndexOf("\\")+1);
 if(!tiddlyBaseDir || tiddlyBaseDir == "") {
 tiddlyBaseDir = self.location.pathname.substring(0,self.location.pathname.lastIndexOf("/")+1);
 }
 // if Returns with a leading slash, we don't want that.
 if(tiddlyBaseDir.substring(0,1) == "/") {
 tiddlyBaseDir = tiddlyBaseDir.substring(1);
 }
 var theShell = new ActiveXObject("WScript.Shell");
 if(theShell) {
 // the app name may have a directory component, need that too
 // as we want to start with current working dir as the location
 // of the app.
 if(appToLaunch.indexOf("file:///") == 0)
 {
 tiddlyBaseDir = "";
 appToLaunch = appToLaunch.substring(8);
 }
 var appDir = appToLaunch.substring(0, appToLaunch.lastIndexOf("\\"));
 if(! appDir || appDir == "") {
 appDir = appToLaunch.substring(0, appToLaunch.lastIndexOf("/"));
 }
 appParams = appParams.length>0?" \""+appParams.join("\" \"")+"\"":"";
 theShell.CurrentDirectory = decodeURI(tiddlyBaseDir + appDir);
 var commandString = ('"' +decodeURI(tiddlyBaseDir+appToLaunch) + '" ' + appParams);
 pluginInfo.log.push(commandString);
 theShell.run(commandString);
 } else {
 pluginInfo.log.push("WScript.Shell object not created");
 }
 } else {
 // want where the tiddly is actually located, excluding tiddly html file
 var tiddlyBaseDir = self.location.href.substring(0,self.location.href.lastIndexOf("\\")+1);
 if(!tiddlyBaseDir || tiddlyBaseDir == "") {
 tiddlyBaseDir = self.location.href.substring(0,self.location.href.lastIndexOf("/")+1);
 }
 netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
 var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
 if(appToLaunch.indexOf("file:///") == 0)
 {
 tiddlyBaseDir = "";
 appToLaunch = appToLaunch.substring(8);
 }
 file.initWithPath(decodeURI(tiddlyBaseDir+appToLaunch).replace(/\//g,"\\"))
 if (file.isFile() && file.isExecutable()) {
 var process = Components.classes['@mozilla.org/process/util;1'].createInstance(Components.interfaces.nsIProcess);
 process.init(file);
 process.run(false, appParams, appParams.length);
 }
 else
 {
 file.launch();
 }
 }
};

config.macros.LaunchApplication.handler = function (place,macroName,params,wikifier,paramString,tiddler) {
 // 0=ButtonText, 1=toolTop, 2=AppToLaunch, 3...AppParameters
 if (params[0] && params[1] && params[2]) {
 var theButton = createTiddlyButton(place, params[0], params[1], onClickLaunchApplication);
 theButton.setAttribute("appToLaunch", params[2]);
 var appParams = [];
 for (var i = 3; i <params.length; i++) {
 appParams.push(params[i]);
 }
 theButton.appParameters = appParams;
 return;
 }
}

function onClickLaunchApplication(e) {
 var theAppToLaunch = this.getAttribute("appToLaunch");

 var theAppParams = this.appParameters ;
 LaunchApplication(theAppToLaunch,theAppParams);
 return false;
 }

//}}}
