/***
|Name|MessageLogPlugin|
|Source|http://www.TiddlyTools.com/#MessageLogPlugin|
|Documentation|http://www.TiddlyTools.com/#MessageLogPlugin|
|Version|1.1.1|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.4|
|Type|plugin|
|Description|automatically log TW messages to a [[MessageLog]] tiddler|
This plugin uses a tiddler to store the text/link for each message that is displayed during a TiddlyWiki session.
!!!!!Documentation
<<<
This plugin automatically appends TiddlyWiki messages to a //shadow// tiddler, [[MessageLog]], to provide a short-term, per-session record of messages without altering any 'real' tiddlers in your document.  You can also suppress the //display// of messages that are recorded to the [[MessageLog]].  You can view the shadow [[MessageLog]] tiddler at any time to review the previous messages.  If you edit the MessageLog (making it a 'real' tiddler') it will then be saved with the rest of your TW document when you save the file, allowing you to keep a persistent, inter-session log rather than a short-term, per-session log.
<<<
!!!!!Configuration
<<<
<<option chkMessageLog>> log messages to <<option txtMessageLogName>>
<<option chkMessageLogFade>> fade message display after {{threechar{<<option txtMessageLogFade>>}}} seconds
<<option chkMessageLogQuiet>> hide all messages (when logging is enabled)
Date format (for log entries): <<option txtMessageLogDateFormat>>
<<<
!!!!!Revisions
<<<
2012.05.22 1.2.0 added chkMessageLogFade/txtMessageLogFade for timed hiding of messages
2012.01.29 1.1.1 in displayMessage(), added noLog param (bypass logging while still showing message)
2012.01.22 1.1.0 added chkMessageLogQuiet option.  Misc code cleanup
2008.12.24 1.0.2 hijack getMessageDiv() to add 'view log' command to message box
2008.12.23 1.0.1 defined ResetMessageLogCommand section and embedded command in default shadow message log.  Also, prevent refresh of log display if tiddler is currently being edited.
2008.12.23 1.0.0 initial release
<<<
!!!!!MessageLogControls
<<option chkMessageLog>> enable logging | <<option chkMessageLogFade>> fade message display after {{threechar{<<option txtMessageLogFade>>}}} seconds | <<option chkMessageLogQuiet>> hide all messages while logging | <html><a href='javascript:;' title='clear stored message log' onclick='var log=config.options.txtMessageLogName; if (!confirm(this.title+"?")) return false; config.shadowTiddlers[log]="\<\<tiddler [[MessageLogPlugin##MessageLogControls]]\>\>\n"; store.removeTiddler(log); story.refreshTiddler(log,null,true);'>clear message log</a></html>
!!!!!Code
***/
//{{{
version.extensions.MessageLogPlugin= {major: 1, minor: 2, revision: 0, date: new Date(2012,5,22)};

// SETTINGS
var defaults={
	chkMessageLog:		true,
	chkMessageLogQuiet:	false,
	chkMessageLogFade:	false,
	txtMessageLogFade:	'3',
	txtMessageLogName:	'MessageLog',
	txtMessageLogDateFormat:'YYYY.0MM.0DD 0hh:0mm:0ss'
}; for (var opt in defaults) config.options[opt]=defaults[opt];

// SHADOW LOG
config.shadowTiddlers[config.options.txtMessageLogName]=
	'<<tiddler [[MessageLogPlugin##MessageLogControls]]>>\n'

if (window.displayMessage_MessageLogHijack===undefined) { // only once
	window.displayMessage_MessageLogHijack=window.displayMessage;
	window.displayMessage=function(text,linkText,noLog) {
		var co=config.options; // abbrev
		this.displayMessage_MessageLogHijack.apply(this,arguments);
		if (noLog || !co.chkMessageLog) return;
		var log=co.txtMessageLogName;
		var fmt='>%0 '+(linkText?'[[%1|%2]]':'%1');
		var now=new Date().formatString(co.txtMessageLogDateFormat);
		var cmd='<<tiddler [[MessageLogPlugin##MessageLogControls]]>>\n';
		var out=store.getTiddlerText(log,cmd)+fmt.format([now,text,linkText])+'\n';
		config.shadowTiddlers[log]=out; // update shadow log
		var tid=store.getTiddler(log); if (tid) { // update real tiddler log, if present
			var who=co.chkForceMinorUpdate?tid.modifier:co.txtUserName;
			var when=co.chkForceMinorUpdate?tid.modified:new Date();
			store.saveTiddler(log,log,out,who,when,tid.tags,tid.fields);
		}
		if (!story.isDirty(log)) story.refreshTiddler(log,null,true); // only if log is not being edited
		if (co.chkMessageLogFade && co.txtMessageLogFade>0)
			setTimeout("jQuery('#messageArea').fadeOut('slow',clearMessage)",co.txtMessageLogFade*1000); 
	}
}

if (window.getMessageDiv_MessageLogHijack===undefined) { // only once
	window.getMessageDiv_MessageLogHijack=window.getMessageDiv;
	window.getMessageDiv=function() { // add 'view log' command to message box
		var co=config.options; // abbrev
		var msgArea=document.getElementById("messageArea"); if(!msgArea) return null;
		var addLogBtn=!msgArea.hasChildNodes();
		var r=this.getMessageDiv_MessageLogHijack.apply(this,arguments);
		if (co.chkMessageLog && co.chkMessageLogQuiet) msgArea.style.display="none";
		if(addLogBtn) {
			createTiddlyText(msgArea.firstChild,'|');
			createTiddlyButton(msgArea.firstChild,'log','view '+co.txtMessageLogName,
				function(ev) { story.displayTiddler(null,config.options.txtMessageLogName); });
		}
		return r;
	}
}
//}}}