/***
DropDownTagChooser
http://simonbaird.com/mptw/#DropDownTagChooser
Requires TagUtils
Example:
{{{<<selectUniqueTag Priority>>}}}
<<selectUniqueTag Priority>>
See also ExampleTask (uses ViewTemplate to put a couple of these in the toolbar).
***/
//{{{
var selectUniqueTagOnChange = function(tiddler,newTag,tagGroup) {

	// can I do this a better way, ie not have to use store.getTiddler???
	// just use macro handler scope ???

	var t = store.getTiddler(tiddler);
	t.setUniqueTagFromGroup(newTag,tagGroup);

	// refresh visible tiddlers
	story.forEachTiddler(function(title,element) {
		if (element.getAttribute("dirty") != "true") 
			story.refreshTiddler(title,false,true);
	});

	return false;
}

config.macros.selectUniqueTag = {};
config.macros.selectUniqueTag.handler =
 function(place,macroName,params,wikifier,paramString,tiddler) {

	var tagGroup = params[0];
	var label = params[1]?params[1]:params[0]+":";

	var tagsInGroup = getTitles(store.getTaggedTiddlers(params[0]));

	var select = document.createElement("select");

	/*
	// dont know how to make this work..
	var update = function(e) {
		if (!e) var e = window.event;
		alert("here");
		return false;
	};
	select.onchange = update;
	*/

	select.setAttribute("onchange","selectUniqueTagOnChange('"+
			tiddler.title+"',this.options[this.selectedIndex].text,'"+tagGroup+"');");

	select.setAttribute("style","font-size:90%;"); // evil. should use a class!

	// in case there is currently none of them
	if (!tiddler.hasAnyTag(tagsInGroup)) {
		var opt = document.createElement("option");
		opt.text = "-";
		opt.selected = true;
		try {
			// for IE
			select.add(opt);
		}
		catch(e) {
			select.appendChild(opt)
		};
	}

	for (var i=0;i<tagsInGroup.length;i++) {
		var opt = document.createElement("option");
		opt.text = tagsInGroup[i];
		if (tiddler.hasTag(tagsInGroup[i]))
			opt.selected = true;
		try {
			// for IE
			select.add(opt);
		}
		catch(e) {
			select.appendChild(opt)
		};
	}

	wikify(label,place,null,tiddler);
	place.appendChild(select);
}

//}}}

