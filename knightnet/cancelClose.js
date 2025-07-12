/***
|''Name:''|cancelClose |
|''Version:''|Revision: 1.0.0, 2007-02-06|
|''Source:''|http://knighjm.googlepages.com/knightnet-default-tw.html|
|''Author:''|[[Julian Knight]]|
|''Type:''|Toolbar Macro Extension|
|''Requires:''|TiddlyWiki 2.0.0 or higher|
!Description
Extends the TiddlyWiki commands for the toolbar macro by adding a button to cancel changes and then close the tiddler immediately.
It simply duplicates and mashes the code from the two pre-defined commands cancelTiddler and closeTiddler.
I put this one together in response to a request from Mel C.
WARNING: You are not asked for a confirmation before any changes are discarded!
!History
|!2007-02-06 - 1.0|First release|
!Useage
Add to your EditTemplate, e.g.:
{{{
<!--                                             *********                -->
<div class='toolbar' macro='toolbar +saveTiddler cancelClose -cancelTiddler deleteTiddler closeTiddler'></div>
}}}
It does a cancel followed by a close.

!Code
***/
//{{{
version.extensions.cancelClose = {
   major: 1, minor: 0, revision: 0, date: new Date("Feb 06, 2007"), type: 'macro',
   source: 'http://knighjm.googlepages.com/knightnet-default-tw.html#saveClose'
};

config.commands.cancelClose = {
	text: "cancel/close", tooltip: "Cancel changes then close this tiddler"
}

config.commands.cancelClose.handler = function(event,src,title) {
	//var newTitle = story.cancelTiddler(title,event.shiftKey);
	story.setDirty(title,false);
	story.displayTiddler(null,title);
	story.closeTiddler(title,true,event.shiftKey || event.altKey);
	// story.displayTiddler(null,newTitle);
	return false;
}
//}}}
/***
This plugin is released under the "Do whatever you like at your own risk" license.
***/
