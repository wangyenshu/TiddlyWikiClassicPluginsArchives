/***
|''Name:''|abego.editIncludedTiddlerCommand|
|''Version:''|experimental|
|''SourceCode:''|http://tiddlywiki.abego-software.de/experimental/abego.editIncludedTiddlerCommand-src.js|
|''Author:''|Udo Borkowski (ub [at] abego-software [dot] de)|
|''Copyright:''|&copy; 2007 [[abego Software|http://www.abego-software.de]]|
|''Licence:''|[[BSD open source license (abego Software)|http://www.abego-software.de/legal/apl-v10.html]]|
|''~CoreVersion:''|2.1.3|
|''Browser:''|Firefox 1.5.0.9 or better; Internet Explorer 6.0|
***/
//{{{
(function(){


//================================================================================
// The "editIncludedTiddler" command
//
// allows editing tiddlers from "included TiddlyWikis"
//
// (see IncludePlugin (http://tiddlywiki.abego-software.de/#IncludePlugin))

var fixUpURL = function(url) {
	// Make sure the URL is a real URL, with protocol prefix etc.
	if (url.search(/^((http(s)?)|(file)):/) != 0) {

		// no protocol specified.
		if (url.search(/^((.\:\\)|(\\\\)|(\/))/) == 0) {
			// "url" is an "absolute" path to a local file. Prefix it with file://
			url = "file://"+url;

		} else {
			// "url" is a "relative" URL. Make it absolute

			// prefix the url with the directory containing the current document
			// (This also includes the protocol prefix)
			var documentPath = document.location.toString();
			var i = documentPath.lastIndexOf("/");
			url = documentPath.substr(0,i+1)+url;
		}
		// replace every \ by a /, to cover Windows style pathes
		url = url.replace(/\\/mg,"/");
	}
	return url;
};

// @return [may be null/undefined]
var getIncludedTiddlerURL = function(title) {
	var t = store.fetchTiddler(title);
	if (!t) return;
	var url = t["includeURL"];
	if (!url) return;
	return fixUpURL(url)+"#"+encodeURIComponent(String.encodeTiddlyLink(title));
};

config.commands.editIncludedTiddler = {
	text: "goto",
	tooltip: "Open tiddler from an included TiddlyWiki in a separate window. e.g. to edit it"
};

var editIncludedTiddlerWindow;

config.commands.editIncludedTiddler.handler = function(event,src,title) {
	var url = getIncludedTiddlerURL(title);
	if (url) {
		if (editIncludedTiddlerWindow) editIncludedTiddlerWindow.close();
		editIncludedTiddlerWindow = window.open(url,"editIncludedTiddlerWindow");
	} else {
		displayMessage("Tiddler is not from an included TiddlyWiki");
	}
};

var orig_getValue = TiddlyWiki.prototype.getValue;
// see 'Applications of "getValue"' below
TiddlyWiki.prototype.getValue = function(tiddler,fieldName) {
	var result = orig_getValue.apply(this,arguments);
	if (result === undefined) {
		var t = this.resolveTiddler(tiddler);
		if (t)
			result = t[fieldName];
	}
	return result;
};

// Applications of "getValue"
//
// Display the name of the TW containing the included tiddler in the ViewTemplate:
//
// 		in the "ViewTemplate" (shadow) tiddler add:
//
// 			<div class='subtitle' macro='view includeURL'></div>
//	 	(e.g. below the "title" div)
//
// In the YourSearch result also display the name of the TW containing the included tiddler
//
// 		in the "YourSearchItemTemplate" (shadow) tiddler add:
//
// 			<span macro='foundTiddler field includeURL'/></span>&nbsp;-&nbsp;
//
//		(e.g. behind the "title" span)


})();
//}}}
