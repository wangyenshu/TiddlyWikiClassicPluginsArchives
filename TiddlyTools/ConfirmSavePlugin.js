/***
|Name|ConfirmSavePlugin|
|Source|http://www.TiddlyTools.com/#ConfirmSavePlugin|
|Documentation|http://www.TiddlyTools.com/#ConfirmSavePlugin|
|Version|1.1.0|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.1|
|Type|plugin|
|Description|if tiddlers are being edited, or there are no unsaved changes, ask before saving|
When <<saveChanges>> command link is clicked, if there are tiddlers still being edited or there are no changes unsaved changes, then ask for confirmation before saving the document to the file.
!!!!!Configuration
<<<
:
<<option chkConfirmSaveIfEditing>> confirm saving if tiddlers are still being edited
<<option chkConfirmSaveIfNoChanges>> confirm saving if there are no unsaved tiddler changes
<<<
!!!!!Revisions
<<<
2008.03.15 [1.1.0] added option settings and check for 'no unsaved changes'
2008.03.15 [1.0.0] Initial Release.
<<<
!!!!!Code
***/
//{{{
version.extensions.ConfirmSavePlugin= {major: 1, minor: 1, revision: 0, date: new Date(2008,3,15)};
//}}}
//{{{
if (config.options.chkConfirmSaveIfEditing==undefined) config.options.chkConfirmSaveIfEditing=true;
if (config.options.chkConfirmSaveIfNoChanges==undefined) config.options.chkConfirmSaveIfNoChanges=true;
//}}}
//{{{
if (config.macros.saveChanges.confirmSave_onClick==undefined) 
	config.macros.saveChanges.confirmSave_onClick=config.macros.saveChanges.onClick
config.macros.saveChanges.onClick=function(e) {
	var msg="";
	var editing=[];	// check for tiddlers being edited
	if (config.options.chkConfirmSaveIfEditing)
		story.forEachTiddler(function(tid,elem) { if (elem.getAttribute("dirty")=="true") editing.push(tid);});
	if (editing.length) {
		msg+="There "+(editing.length>1?"are ":"is ")+editing.length;
		msg+=" tiddler"+(editing.length>1?"s":"")+" currently being edited:\n\n";
		msg+=editing.join(", ")+"\n\n";
		msg+="Changes to "+(editing.length>1?"these tiddlers":"this tiddler");
		msg+=" will not be saved until editing is completed.";
	} else if (config.options.chkConfirmSaveIfNoChanges && !store.isDirty())
		msg+="There are no unsaved tiddler changes";
	if (msg.length) {
		msg+="\n\nPress OK to save the document anyway.";
		if (!confirm(msg)) return false;
	}
	return config.macros.saveChanges.confirmSave_onClick.apply(this,arguments); // let core save
}
//}}}