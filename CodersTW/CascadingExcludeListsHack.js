//{{{
TiddlyWiki.prototype.getCascadingTaggedTiddlers = function(lookupValue,lookupMatch,sortField)
{
	var candidates =[];
	store.forEachTiddler(function(title,tiddler) {if (tiddler.isTagged(lookupValue)) candidates.push(title)})
	var results = [];
	this.forEachTiddler(function(title,tiddler) {
		var f = !lookupMatch;
		for(var lookup=0; lookup<tiddler.tags.length; lookup++) {
			if((tiddler.tags[lookup]== lookupValue)|| (candidates.indexOf(tiddler.tags[lookup])>=0))
				f = lookupMatch;
		}
		if(f)
			results.push(tiddler);
	});
	if(!sortField)
		sortField = "title";
	results.sort(function(a,b) {return a[sortField] < b[sortField] ? -1 : (a[sortField] == b[sortField] ? 0 : +1);});
	return results;
};

config.macros.timeline.handler = function(place,macroName,params)
{
	var field = params[0] ? params[0] : "modified";
	var tiddlers = store.getCascadingTaggedTiddlers("excludeLists",false,field);
	var lastDay = "";
	var last = params[1] ? tiddlers.length-Math.min(tiddlers.length,parseInt(params[1])) : 0;
	var dateFormat = params[2] ? params[2] : this.dateFormat;
	for(var t=tiddlers.length-1; t>=last; t--) {
		var tiddler = tiddlers[t];
		var theDay = tiddler[field].convertToLocalYYYYMMDDHHMM().substr(0,8);
		if(theDay != lastDay) {
			var ul = document.createElement("ul");
			place.appendChild(ul);
			createTiddlyElement(ul,"li",null,"listTitle",tiddler[field].formatString(dateFormat));
			lastDay = theDay;
		}
		createTiddlyElement(ul,"li",null,"listLink").appendChild(createTiddlyLink(place,tiddler.title,true));
	}
};

config.macros.list.all.handler = function(params)
{
	return store.getCascadingTaggedTiddlers("excludeLists",false,"title");
};
//}}}