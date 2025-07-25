/***
|Name|HideTiddlersPlugin|
|Source|http://www.TiddlyTools.com/#HideTiddlersPlugin|
|Documentation|http://www.TiddlyTools.com/#HideTiddlersPlugin|
|Version|1.0.0|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.1|
|Type|plugin|
|Description|hide/show tiddlers instead of closing/re-opening them|
|Status|ALPHA EXPERIMENTAL - use with caution|
!!!!!Documentation
<<<
This plugin hijacks the core's displayTiddler() and closeTiddler() functions so that closing a tiddler //hides// it rather than removing it from the story column.  When the tiddler is re-opened, it is made visible again without needing to be re-rendered, which can significantly reduce the processing required by tiddlers that generate their content through use of complex macros or scripts.

Notes:
*hidden tiddlers are still re-rendered as needed when underlying information is changed or other page-wide refresh events occur, so that they will still be up-to-date if re-displayed.  This can, in some cases, trigger side-effect actions associated with those tiddlers that would normally not occur had they actually been closed, rather than merely hidden from view
*Using <<closeAll>> (or invoking the core {{{restart()}}} function) will always //close// the tiddlers rather than hiding them, regardless of the current plugin settings or tiddler tags
<<<
!!!!!Configuration
<<<
hide tiddlers instead of closing them:
<<option chkNoClose>>tiddlers tagged with <<option txtNoCloseTag>>
<<option chkNoCloseAll>>all tiddlers, regardless of tags
<<<
!!!!!Revisions
<<<
2009.10.04 [1.0.0] initial release.  Much thanks to Shviller for original concept.
<<<
!!!!!Code
***/
//{{{
version.extensions.HideTiddlersPlugin= {major: 1, minor: 0, revision: 0, date: new Date(2009,10,4)};

var co=config.options; //abbrev
if (co.chkNoClose===undefined)	  co.chkNoClose=true;
if (co.txtNoCloseTag===undefined) co.txtNoCloseTag='noClose';

if (Story.prototype.displayTiddler_save===undefined)
	Story.prototype.displayTiddler_save=Story.prototype.displayTiddler;
Story.prototype.displayTiddler=function(place,title) {
	var here=story.getTiddler(title);
	if (here) here.style.display='block';
	this.displayTiddler_save.apply(this,arguments);
}

if (Story.prototype.closeTiddler_save===undefined)
	Story.prototype.closeTiddler_save=Story.prototype.closeTiddler;
Story.prototype.closeTiddler=function(title) {
	var co=config.options; //abbrev
	var t=store.getTiddler(title);
	if (co.chkNoCloseAll || co.chkNoClose&&t&&t.isTagged(co.txtNoCloseTag)) {
		var here=story.getTiddler(title);
		if (here) here.style.display='none';
		forceReflow();
	} else this.closeTiddler_save.apply(this,arguments);
}

if (Story.prototype.closeAllTiddlers_save===undefined)
	Story.prototype.closeAllTiddlers_save=Story.prototype.closeAllTiddlers;
Story.prototype.closeAllTiddlers=function(title) {
	var co=config.options; //abbrev
	var t=co.chkNoClose;
	co.chkNoClose=false;
	this.closeAllTiddlers_save.apply(this,arguments);
	co.chkNoClose=t;
}
//}}}