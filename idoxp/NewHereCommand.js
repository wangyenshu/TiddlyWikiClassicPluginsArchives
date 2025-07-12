/***
|Name|NewHereCommand|
|Source|http://simonbaird.com/mptw/#NewHereCommand|
|Version|1.0|

Code originally by ArphenLin. Small tweak by SimonBaird
http://aiddlywiki.sourceforge.net/NewHere_demo.html#NewHereCommand
To use this you must edit your ViewTemplate and add newHere to the toolbar div, eg
{{{<div class='toolbar' macro='toolbar ... newHere'></div>}}}
***/

//{{{

config.commands.newHere = {
	text: 'child',
	tooltip: 'Create a new tiddler tagged as this tiddler',
	handler: function(e,src,title) {
		if (!readOnly) {
			clearMessage();
			var t=document.getElementById('tiddler'+title);
			story.displayTiddler(t,config.macros.newTiddler.title,DEFAULT_EDIT_TEMPLATE);
			story.setTiddlerTag(config.macros.newTiddler.title, title, 0);
			story.focusTiddler(config.macros.newTiddler.title,"title");
			return false;
		}
	}
};

//}}}