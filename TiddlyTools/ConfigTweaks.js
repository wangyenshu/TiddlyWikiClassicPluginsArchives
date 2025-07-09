//{{{
// re-label default text for some standard UI elements
config.commands.permalink.text="link";
config.commands.references.text="references";
merge(config.macros.toolbar,{ moreLabel: 'more\u25BC', lessLabel: '\u25C4less' });

// allows custom response when tiddler does not exist (e.g. redirection to alternative tiddler)
config.shadowTiddlers.MissingTiddler=config.views.wikified.defaultText.replace(/%0/,'$1'); // default to standard message
config.views.wikified.defaultText='<<tiddler MissingTiddler with: [[%0]]>>';

// wrap AdvancedOptions and PluginManager default content in a groupbox (and use a smaller font)
config.shadowTiddlers.AdvancedOptions=
	config.shadowTiddlers.AdvancedOptions.replace(
		/<<options>>/,
		"{{small groupbox{<<options>>}}}");

config.shadowTiddlers.PluginManager=
	config.shadowTiddlers.PluginManager.replace(
		/<<plugins>>/,
		"{{small groupbox{<<plugins>>}}}");

// message used by ConfirmExitPlugin when no changes have been made
config.messages.confirmExit_nochanges='\tTiddlyTools... Small Tools for Big Ideas™\n\t'
	+store.getTiddlerText("SiteUrl",document.location.protocol=="http"?document.location.href:"");
//}}}