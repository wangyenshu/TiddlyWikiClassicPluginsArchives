/***
| Name:|AutoCorrectPlugin|
| Created by:|SimonBaird|
| Location:|http://simonbaird.com/mptw/#AutoCorrectPlugin|
| Version:|1.0.0 (06-Apr-2006)|
| Requires:|~TW2.x|
!Description
Auto-corrects a list of mistyped or misspelled words. The list of words can be in any tiddler tagged with autoCorrectWords
!History
* 06-Apr-06, version 1.0.0
** split off from InstantTimestamp
** read translations from a tiddler instead of javascript array
!Notes
* See also InstantTimestamp, BigListForAutoCorrect, MyAutoCorrectWords
!Code
***/
//{{{

version.extensions.AutoCorrectPlugin = { major: 1, minor: 0, revision: 0, date: new Date(2006,4,6),
	source: "http://simonbaird.com/mptw/#AutoCorrectPlugin"
};

config.AutoCorrectPlugin = {
	wordListTag: "autoCorrectWords",
	excludeTags: [
		"noAutoCorrect",
		"CSS",
		"css",
		"systemConfig",
		"zsystemConfig",
		"Plugins",
		"Plugin",
		"plugins",
		"plugin",
		"javascript",
		"code"
	],
	excludeTiddlers: [
		"StyleSheet",
		"StyleSheetLayout",
		"StyleSheetColors",
		"StyleSheetPrint"
	]
}; 

if (!Array.prototype.contains)
	Array.prototype.contains = function(item) {
		return (this.find(item) != null);
	};

if (!Array.prototype.containsAny)
	Array.prototype.containsAny = function(items) {
		for (var i=0;i<items.length;i++)
			if (this.contains(items[i]))
				return true;
		return false;
	};

String.prototype.upperCaseFirst = function() {
	return this.substr(0,1).toUpperCase() + this.substr(1);
}

TiddlyWiki.prototype.saveTiddler_mptw_autocorrect = TiddlyWiki.prototype.saveTiddler;
TiddlyWiki.prototype.saveTiddler = function(title,newTitle,newBody,modifier,modified,tags) {

	tags = (typeof(tags) == "string") ? tags.readBracketedList() : tags;
	var conf = config.AutoCorrectPlugin;

	if ( !tags.containsAny(conf.excludeTags) 
			&& !tags.contains(conf.wordListTag)
					&& !conf.excludeTiddlers.contains(newTitle) ) {

		var wordListTiddlers = store.getTaggedTiddlers(conf.wordListTag);
		for (var i=0;i<wordListTiddlers.length;i++) {
			var lines = wordListTiddlers[i].text.split(/$/m);
			for (var j=0;j<lines.length;j++) {
				if (lines[j].indexOf("->") > 0) {
					var replacer = lines[j].trim().split("->");
					newBody = newBody.replace(new RegExp(
						"\\b"+replacer[0]+"\\b","g"),replacer[1]);
					newBody = newBody.replace(new RegExp(
						"\\b"+replacer[0].upperCaseFirst()+"\\b","g"),replacer[1].upperCaseFirst());
				}
			}
		}
	}

	return this.saveTiddler_mptw_autocorrect(title,newTitle,newBody,modifier,modified,tags);
}

//}}}
