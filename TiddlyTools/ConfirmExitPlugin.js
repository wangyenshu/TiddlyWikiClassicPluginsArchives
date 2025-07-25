/***
|Name|ConfirmExitPlugin|
|Source|http://www.TiddlyTools.com/#ConfirmExitPlugin|
|Version|2.0.0|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.1|
|Type|plugin|
|Description|extra safety when exiting with unsaved changes|
For extra "data safety" when exiting from a TiddlyWiki document, this plugin prompts you to ''//save any tiddlers that are still being actively edited//''.  The plugin then provides an additional option to ''//save the entire TiddlyWiki document//'' before continuing.  Finally, if you do not choose to save the file and there are still unsaved tiddler changes, the standard TiddlyWiki warning message is then displayed as usual, with options to ''//stay on the current page or exit and lose all changes.//''
!!!!!Configuration
<<<
<<option chkAlwaysConfirmExit>> ''//always//'' confirm before exiting (even if no unsaved changes)
<<option chkSaveOnExit>> show save-before-exiting confirmation messages (if unsaved changes)
<<<
!!!!!Revisions
<<<
2008.09.05 2.2.0 renamed plugin ConfirmExitPlugin to better reflect general functionality
2008.09.05 2.1.0 added "always confirm exit" option {{{<<option chkAlwaysConfirmExit>>}}}
2008.04.03 2.0.0 completely re-written to provide checks for active tiddler editors and more consistent warning messages
2007.03.01 1.0.2 use apply() to invoke hijacked core function
2006.08.23 1.0.1 Re-released.  Note default is now to NOT enable second message. (i.e., standard behavior)
2006.02.24 1.0.0 Initial release.  Replaces ConfirmExitPlugin, which is now included in the TW core functionality.
<<<
!!!!!Code
***/
//{{{
version.extensions.ConfirmExitPlugin= {major: 2, minor: 2, revision: 0, date: new Date(2008,9,5)};

if (config.options.chkAlwaysConfirmExit===undefined) config.options.chkAlwaysConfirmExit=true;
if (config.options.chkSaveOnExit===undefined) config.options.chkSaveOnExit=false;

config.messages.activeEditorWarning=
	"Are you sure you want to navigate away from this page?"
	+"\n\n--------------------------------\n\n"
	+"'%0' is currently being edited."
	+"\n\n--------------------------------\n\n"
	+"Press OK to save this tiddler, or Cancel to skip this tiddler and continue.";

config.messages.unsavedChangesWarning=
	"Are you sure you want to navigate away from this page?"
	+"\n\n--------------------------------\n\n"
	+"There are unsaved changes in this TiddlyWiki document."
	+"\n\n--------------------------------\n\n"
	+"Press OK to save the document, or Cancel to continue without saving.";

// for browsers that support onBeforeUnload event handling
window.saveOnExit_coreConfirmExit=window.confirmExit;
window.confirmExit=function() {
	// call core handler (to invoke other hijacked 'on exit' code, e.g., [[StorySaverPlugin]])
	window.saveOnExit_coreConfirmExit.apply(this,arguments);
	// check for tiddlers being edited and offer chance to save/close each
	if (config.options.chkSaveOnExit) story.forEachTiddler(function(tid,elem) {
		if (elem.getAttribute("dirty")!="true") return;
		if (!confirm(config.messages.activeEditorWarning.format([tid]))) return;
		story.saveTiddler(tid);
		story.closeTiddler(tid);
	});
	// check for unsaved changes
	if(store && store.isDirty && store.isDirty()) {
		if (config.options.chkSaveOnExit && confirm(config.messages.unsavedChangesWarning))
			saveChanges(); // save the file
		else
			return config.messages.confirmExit; // 'unsaved changes' confirmation message
	} else if (config.options.chkAlwaysConfirmExit)
		return config.messages.confirmExit_nochanges||""; // 'no changes' confirmation message
}

// for older browsers that only support onUnload event handling
window.checkUnsavedChanges=function() { if(window.hadConfirmExit === false) window.confirmExit(); }
//}}}