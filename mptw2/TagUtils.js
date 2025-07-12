/***
TagUtils
http://simonbaird.com/mptw/#TagUtils
Doesn't do anything except provide functions for use in other plugins
Sorry no documentation! RTFC  :)

!Update
Added some macros. See Examples.

!Todo
Sorting is next

!Example
Note: you must have spaces between every element including brackets and logical operators
{{{<<listByTagExpr '( Todo || Tasks ) && ! Done'>>}}}
<<listByTagExpr '( Todo || Tasks ) && ! Done'>>

{{{<<listByTagExprWithExcerpt '( Todo || Tasks ) && Urgent && ! Done'>>}}}
<<listByTagExprWithExcerpt '( Todo || Tasks ) && ! Done'>>

***/
//{{{

// Array methods originally written by Udo

if (!Array.prototype.indexOf)
	Array.prototype.indexOf = function(item) {
		for (var i=0;i<this.length;i++)
			if (this[i] == item)
				return i;
		return -1;
	};

if (!Array.prototype.contains)
	Array.prototype.contains = function(item) {
		return (this.indexOf(item) >= 0);
	};

if (!Array.prototype.containsAny)
	Array.prototype.containsAny = function(items) {
		for (var i=0;i<items.length;i++)
			if (this.contains(items[i]))
				return true;
		return false;
	};

if (!Array.prototype.containsAll)
	Array.prototype.containsAll = function(items) {
		for (var i = 0; i < items.length; i++)
			if (!this.contains(items[i]))
				return false;
		return true;
	};


var allowBracketedList = function(tags) {
	return (typeof(tags) == "string") ? tags.readBracketedList() : tags;
}

var getTitles = function(tiddlers) {
	var titles = [];
	for (var i=0;i<tiddlers.length;i++)
		titles[i] = tiddlers[i].title;
	return titles;
}

Tiddler.prototype.hasTag = function(tag) {
	return this.tags.contains(tag)
}

Tiddler.prototype.hasAnyTag = function(tags) {
	return this.tags.containsAny(allowBracketedList(tags));
}

Tiddler.prototype.hasAllTags = function(tags) {
	return this.tags.containsAll(allowBracketedList(tags));
}

Tiddler.prototype.addTag = function(tag) {
	if (!this.hasTag(tag))
		this.tags.push(tag);
}

Tiddler.prototype.addTags = function(tags) {
	var newTags = allowBracketedList(tags);
	for (var i=0;i<newTags.length;i++)
		this.addTag(newTags[i]);
}

Tiddler.prototype.removeTag = function(tag) {
	if (this.hasTag(tag))
		this.tags.splice(this.tags.indexOf(tag),1);
}

Tiddler.prototype.removeTags = function(tags) {
	var deadTags = allowBracketedList(tags);
	for (var i=0;i<deadTags.length;i++)
		this.removeTag(deadTags[i]);
}

Tiddler.prototype.removeTagsFromGroup = function(tagGroup) {
	// the tags are tagged with tagGroup, taggly style
	var tagsInGroup = getTitles(store.getTaggedTiddlers(tagGroup));
	for (var i=0;i<tagsInGroup.length;i++)
		this.removeTag(tagsInGroup[i]);
}

Tiddler.prototype.setUniqueTagFromGroup = function(tag,tagGroup) {
	// used for a single value dropdown
	this.removeTagsFromGroup(tagGroup);
	this.addTag(tag);
}

Tiddler.prototype.setUniqueTagFromList = function(tag,tagList) {
	// will probably never use this since I like setUniqueTagFromGroup
	this.removeTags(tagList);
	this.addTag(tag);
}

TiddlyWiki.prototype.getTiddlersByTag = function(includeTags,excludeTags,includeMode,excludeMode) {
	includeTags = allowBracketedList(includeTags);
	excludeTags = allowBracketedList(excludeTags);
	if (!includeMode) includeMode = 'all';
	if (!excludeMode) excludeMode = 'any';
	var results = [];
	this.forEachTiddler(function(title,tiddler) {
		var included = (includeMode == 'any') ?
				tiddler.hasAnyTag(includeTags) :
				tiddler.hasAllTags(includeTags);
		var excluded = (excludeMode == 'any') ?
				tiddler.hasAnyTag(excludeTags):
				tiddler.hasAllTags(excludeTags);
		if (included && !excluded)
			results.push(tiddler);
	});
	return results;
}

TiddlyWiki.prototype.getTiddlersByTagExpression = function(expression) {
	// example expression
	// "( [[A Tag]] || Tag2 ) && ! Tag3"
	// must have spaces between everything
	var splitExpression = expression.readBracketedList(false); // false means not unique. thanks Jeremy!!
	var asIs = ['(',')','||','&&','!']; // better not have any tags called those!
	var translatedExpression = "";
	for (var i=0;i<splitExpression.length;i++)
		if (asIs.contains(splitExpression[i]))
			translatedExpression += splitExpression[i];
		else
			translatedExpression += "tiddler.hasTag('"+splitExpression[i]+"')";
	// alert(translatedExpression);
	var results = [];
	this.forEachTiddler(function(title,tiddler) {
		if (eval('('+translatedExpression+')'))
			results.push(tiddler);
	});
	return results;
}

Array.prototype.tiddlerList = function(listFormat) {
	var output = "";
	if (!listFormat) listFormat = "'*[['+tiddler.title+']]\\n'";
	if (this.length > 0 && this[0] instanceof Tiddler) {
		for (var i=0;i<this.length;i++) {
			var tiddler = this[i];
			output += eval(listFormat);
		}
	}
	return output;
}
	
Array.prototype.tiddlerListWithExcerpt = function(listFormat) {
	return this.tiddlerList("'*[['+tiddler.title+']] tiddler.text.trim().substr(20)...\\n'");
}

String.prototype.prettyTrim = function(len,prefix,postfix) {
	var result = this.trim().replace(/\r\n/g,' ').replace(/[\n|\t]/g,' ');
	if (result.length > len - 3)
		return result.trim().substr(0,len) + '...';
	else
		return result;
}

String.prototype.prettyTrim2 = function(len,prefix,postfix) {
	if (!prefix) prefix = '';
	if (!postfix) postfix = '';
	return prefix + this.prettyTrim(len) + postfix;
}

	
Array.prototype.tiddlerListWithExcerpt = function(listFormat) {
	return this.tiddlerList("'*[['+tiddler.title+']] ' + tiddler.text.prettyTrim2(60,' - ') + '\\n'");
}

config.macros.listByTag = {};
config.macros.listByTag.handler =
 function(place,macroName,params,wikifier,paramString,tiddler) {
	wikify(store.getTiddlersByTag(params[0],params[1],params[2],params[3]).tiddlerList(),place,null,tiddler);
};

config.macros.listByTagWithExcerpt = {};
config.macros.listByTagWithExcerpt.handler =
 function(place,macroName,params,wikifier,paramString,tiddler) {
	wikify(store.getTiddlersByTag(params[0],params[1],params[2],params[3]).tiddlerListWithExcerpt(),place,null,tiddler);
};

config.macros.listByTagExpr = {};
config.macros.listByTagExpr.handler =
 function(place,macroName,params,wikifier,paramString,tiddler) {
	wikify(store.getTiddlersByTagExpression(params[0]).tiddlerList(),place,null,tiddler);
};

config.macros.listByTagExprWithExcerpt = {};
config.macros.listByTagExprWithExcerpt.handler =
 function(place,macroName,params,wikifier,paramString,tiddler) {
	wikify(store.getTiddlersByTagExpression(params[0]).tiddlerListWithExcerpt(),place,null,tiddler);
};



//}}}
