//{{{
// for use in templates
config.macros.wikifyContents = {};
config.macros.wikifyContents.handler = function (place,macroName,params,wikifier,paramString,tiddler) {
	var contents = place.innerHTML;
	// to avoid CSS complications change the xmp to a div
	var newDiv = document.createElement("div");
	newDiv.className = place.className;
	newDiv.setAttribute("style",place.getAttribute("style"));
	place.parentNode.insertBefore(newDiv,place);
	place.parentNode.removeChild(place);
	// the replace is a hack that allows non-br-ing line breaks. \r\n for IE, \n for FF.
	wikify(contents.replace(/\\\r\n/mg,'').replace(/\\\n/mg,'').trim(), newDiv, null, tiddler);
}
//}}}
