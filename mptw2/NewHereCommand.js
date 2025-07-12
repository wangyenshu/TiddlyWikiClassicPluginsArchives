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
	text: 'new here',
	tooltip: 'Create a new tiddler tagged as this tiddler',
	hideReadOnly: true,
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

config.commands.newJournalHere = {
	//text: 'new journal here',  // too long
	text: 'new journal',
	hideReadOnly: true,
	dataFormat: 'YYYY-0MM-0DD 0hh:0mm', // adjust to your preference
	tooltip: 'Create a new journal tiddler tagged as this tiddler',
	handler: function(e,src,title) {
		if (!readOnly) {
			clearMessage();
			var now = new Date();
			var t=document.getElementById('tiddler'+title);
			var newtitle = now.formatString(this.dataFormat)
			story.displayTiddler(t,newtitle,DEFAULT_EDIT_TEMPLATE);
			story.setTiddlerTag(newtitle, title, 0);
			story.focusTiddler(newtitle,"title");
			return false;
		}
	}
};


//}}}