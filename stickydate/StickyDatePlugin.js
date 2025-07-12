/***
| Name:|StickyDate|
| Created by:|Rodrigo Fonseca|
| Location:|http://paularodrigo.homeip.net/stickydate.html|
| Version:|0.1.0 (01-Aug-2006)|
| Requires:|~TW2.x|
!Description
This is a simple plugin and a macro that allow you to set an arbitrary and permanent modified date to a Tiddler.
To use it, insert the macro
{{{
<<sd "Aug 1, 2010 10:12:22">>
}}}
anywhere in the text of the Tiddler. If there are more than one occurrences, only the first will be considered. The date can be well in the future (as in the example) or in the past. The plugin actually uses the date in the macro to set as the modified date (that's why it's sticky). This is done when saving the Tiddler. The macro makes sure the content does not appear when rendering, but is still editable. (The plugin will not change the date of some tiddlers, mostly system and configuration ones. See the source code for what is filtered).

Why would you want that? I wanted to create a page with Tiddlers for helping me plan an upcoming trip. By setting the modified date in the Tiddlers to the date at which I wanted my notes to appear, I got a very cool way of listing all tiddlers for a particular day in my trip: flight info, hotel info, notes on what to do, etc.

I hope you find this useful.
!Installation
* Copy the code to a new Tiddler and add the systemConfig tag to it. Save and reload the wiki.
!Notes
* The format of the string within the quotes is that of a javascript date string, which is accepted by the Date.parse() method. In other words, use something like "Aug 1, 2006 12:34:12". Don't forget the double quotes.
!History
* 01-Aug-06, version 1.0.0
** intitial release
!Code
***/
//{{{
/* With code from the InstantTimestamp from http://simonbaird.com/mptw/#InstantTimestamp */

version.extensions.StickyDatePlugin = {major: 0, minor: 1, revision: 0, date: new Date(2006,8,1), 
                                     source: "http://paularodrigo.homeip.net/stickydate.html"};

/* Create a macro that does nothing with the <<sd "Date">> tag */
config.macros.sd = {};
config.macros.sd.handler = function (place, macroName, params, wikifier, paramString, tiddler) {};

config.StickyDate = {
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

TiddlyWiki.prototype.saveTiddler_sd_saveTiddler = TiddlyWiki.prototype.saveTiddler;
TiddlyWiki.prototype.saveTiddler = function(title,newTitle,newBody,modifier,modified,tags) {

	tags = (typeof(tags) == "string") ? tags.readBracketedList() : tags;
	var conf = config.StickyDate;

	if ( !tags.containsAny(conf.excludeTags) 
			&& !conf.excludeTiddlers.contains(newTitle) ) {

            var regex = /\<\<\s*sd\s+"([^"]+)"\s*\>\>/;
            var matches = regex.exec(newBody);
            var date;
            if (matches != null && matches.length > 1) {
                //alert('Found  '+ matches[1]);
                date = new Date(matches[1]);
                if (date.toLocaleString().indexOf('Invalid') == -1) {
                    //We have a valid date. Use this instead of the modified date.
                    modified = date;
                }
            }
	}

	return this.saveTiddler_sd_saveTiddler(title,newTitle,newBody,modifier,modified,tags);
}



//}}}
