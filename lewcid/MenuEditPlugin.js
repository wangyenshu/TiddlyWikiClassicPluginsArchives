/***

|Name|MenuEditPlugin|
|Created by|SaqImtiaz|
|Location|http://tw.lewcid.org/#MenuEditPlugin|
|Version|0.2|
|Requires|~TW2.x|
!Description:
Adds 'doubleclick to edit source' to the MainMenu, SideBarOptions, and SideBarTabs

!History
*20-07-06: version 0.2: hijacked restart, no need to put a macro in the mainMenu anymore.
*28-04-06: version 0.1: working.

!Code
***/
//{{{

window.restart_lewcid_menuedit = restart;
window.restart = function () {
         window.restart_lewcid_menuedit();
var menus = new Array("topMenu","sidebarOptions","sidebarTabs","contentFooter","mainMenu");
for(var t=0; t<menus.length; t++){
         if (document.getElementById(menus[t]))
              {var menu = document.getElementById(menus[t]);
               menu.ondblclick = window.onMenuDblClick;}}
}



window.onMenuDblClick = function(e){
if (!e) var e = window.event;
story.displayTiddler(null,this.getAttribute("tiddler"),2,false,null)
e.cancelBubble = true;
if (e.stopPropagation) e.stopPropagation();
return false;
}
//}}}