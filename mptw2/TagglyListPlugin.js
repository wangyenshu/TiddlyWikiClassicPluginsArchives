/***
|Name|TagglyListPlugin|
|Created by|SimonBaird|
|Location|http://simonbaird.com/mptw/#TagglyListPlugin|
|Version|1.1.2 25-Apr-06|
|Requires|See TagglyTagging|

!History
* 1.1.2 (25-Apr-2006) embedded TagglyTaggingStyles. No longer need separated tiddler for styles.
* 1.1.1 (6-Mar-2006) fixed bug with refreshAllVisible closing tiddlers being edited. Thanks Luke Blanshard.

***/

/***
!Setup and config
***/
//{{{

version.extensions.TagglyListPlugin = {
	major: 1, minor: 1, revision: 2,
	date: new Date(2006,4,25),
	source: "http://simonbaird.com/mptw/#TagglyListPlugin"
};

config.macros.tagglyList = {};
config.macros.tagglyListByTag = {};
config.macros.tagglyListControl = {};
config.macros.tagglyListWithSort = {};
config.macros.hideSomeTags = {};

// change this to your preference
config.macros.tagglyListWithSort.maxCols = 6;

config.macros.tagglyList.label = "Tagged as %0:";

// the default sort options. set these to your preference
config.macros.tagglyListWithSort.defaults = {
 sortBy:"title", // title|created|modified
 sortOrder: "asc", // asc|desc
 hideState: "show", // show|hide
 groupState: "nogroup", // nogroup|group
 numCols: 1
};

// these tags will be ignored by the grouped view
config.macros.tagglyListByTag.excludeTheseTags = [
 "systemConfig",
 "TiddlerTemplates"
];

config.macros.tagglyListControl.tags = {
 title:"sortByTitle", 
 modified: "sortByModified", 
 created: "sortByCreated",
 asc:"sortAsc", 
 desc:"sortDesc",
 hide:"hideTagged", 
 show:"showTagged",
 nogroup:"noGroupByTag",
 group:"groupByTag",
 cols1:"list1Cols",
 cols2:"list2Cols",
 cols3:"list3Cols",
 cols4:"list4Cols",
 cols5:"list5Cols",
 cols6:"list6Cols",
 cols7:"list7Cols",
 cols8:"list8Cols",
 cols9:"list9Cols" 
}

// note: should match config.macros.tagglyListControl.tags
config.macros.hideSomeTags.tagsToHide = [
 "sortByTitle",
 "sortByCreated",
 "sortByModified",
 "sortDesc",
 "sortAsc",
 "hideTagged",
 "showTagged",
 "noGroupByTag",
 "groupByTag",
 "list1Cols",
 "list2Cols",
 "list3Cols",
 "list4Cols",
 "list5Cols",
 "list6Cols",
 "list7Cols",
 "list8Cols",
 "list9Cols"
];


//}}}
/***

!Utils
***/
//{{{
// from Eric
function isTagged(title,tag) {
 var t=store.getTiddler(title); if (!t) return false;
 return (t.tags.find(tag)!=null);
}

// from Eric
function toggleTag(title,tag) {
 var t=store.getTiddler(title); if (!t || !t.tags) return;
 if (t.tags.find(tag)==null) t.tags.push(tag);
 else t.tags.splice(t.tags.find(tag),1);
}

function addTag(title,tag) {
 var t=store.getTiddler(title); if (!t || !t.tags) return;
 t.tags.push(tag);
}

function removeTag(title,tag) {
 var t=store.getTiddler(title); if (!t || !t.tags) return;
 if (t.tags.find(tag)!=null) t.tags.splice(t.tags.find(tag),1);
}

// from Udo
Array.prototype.indexOf = function(item) {
 for (var i = 0; i < this.length; i++) {
 if (this[i] == item) {
 return i;
 }
 }
 return -1;
};
Array.prototype.contains = function(item) {
 return (this.indexOf(item) >= 0);
}
//}}}
/***

!tagglyList
displays a list of tagged tiddlers. 
parameters are sortField and sortOrder
***/
//{{{

// not used at the moment...
function sortedListOfOtherTags(tiddler,thisTag) {
 var list = tiddler.tags.concat(); // so we are working on a clone..
 for (var i=0;i<config.macros.hideSomeTags.tagsToHide.length;i++) {
 if (list.find(config.macros.hideSomeTags.tagsToHide[i]) != null)
 list.splice(list.find(config.macros.hideSomeTags.tagsToHide[i]),1); // remove hidden ones
 }
 for (var i=0;i<config.macros.tagglyListByTag.excludeTheseTags.length;i++) {
 if (list.find(config.macros.tagglyListByTag.excludeTheseTags[i]) != null)
 list.splice(list.find(config.macros.tagglyListByTag.excludeTheseTags[i]),1); // remove excluded ones
 }
 list.splice(list.find(thisTag),1); // remove thisTag
 return '[[' + list.sort().join("]] [[") + ']]';
}

function sortHelper(a,b) {
 if (a == b) return 0;
 else if (a < b) return -1;
 else return +1;
}

config.macros.tagglyListByTag.handler = function (place,macroName,params,wikifier,paramString,tiddler) {

 var sortBy = params[0] ? params[0] : "title"; 
 var sortOrder = params[1] ? params[1] : "asc";

 var result = store.getTaggedTiddlers(tiddler.title,sortBy);

 if (sortOrder == "desc")
 result = result.reverse();

 var leftOvers = []
 for (var i=0;i<result.length;i++) {
 leftOvers.push(result[i].title);
 }

 var allTagsHolder = {};
 for (var i=0;i<result.length;i++) {
 for (var j=0;j<result[i].tags.length;j++) {

 if ( 
 result[i].tags[j] != tiddler.title // not this tiddler
 && config.macros.hideSomeTags.tagsToHide.find(result[i].tags[j]) == null // not a hidden one
 && config.macros.tagglyListByTag.excludeTheseTags.find(result[i].tags[j]) == null // not excluded
 ) {
 if (!allTagsHolder[result[i].tags[j]])
 allTagsHolder[result[i].tags[j]] = "";
 allTagsHolder[result[i].tags[j]] += "**[["+result[i].title+"]]\n";

 if (leftOvers.find(result[i].title) != null)
 leftOvers.splice(leftOvers.find(result[i].title),1); // remove from leftovers. at the end it will contain the leftovers...
 }
 }
 }


 var allTags = [];
 for (var t in allTagsHolder)
 allTags.push(t);

 allTags.sort(function(a,b) {
 var tidA = store.getTiddler(a);
 var tidB = store.getTiddler(b);
 if (sortBy == "title") return sortHelper(a,b);
 else if (!tidA && !tidB) return 0;
 else if (!tidA) return -1;
 else if (!tidB) return +1;
 else return sortHelper(tidA[sortBy],tidB[sortBy]);
 });

 var markup = "";

 if (sortOrder == "desc") {
 allTags.reverse();
 }
 else {
 // leftovers first...
 for (var i=0;i<leftOvers.length;i++)
 markup += "*[["+leftOvers[i]+"]]\n";
 } 

 for (var i=0;i<allTags.length;i++)
 markup += "*[["+allTags[i]+"]]\n" + allTagsHolder[allTags[i]];

 if (sortOrder == "desc") {
 // leftovers last...
 for (var i=0;i<leftOvers.length;i++)
 markup += "*[["+leftOvers[i]+"]]\n";
 }

 wikify(markup,place);
}

config.macros.tagglyList.handler = function (place,macroName,params,wikifier,paramString,tiddler) {
 var sortBy = params[0] ? params[0] : "title"; 
 var sortOrder = params[1] ? params[1] : "asc";
 var numCols = params[2] ? params[2] : 1;

 var result = store.getTaggedTiddlers(tiddler.title,sortBy);
 if (sortOrder == "desc")
 result = result.reverse();

 var listSize = result.length;
 var colSize = listSize/numCols;
 var remainder = listSize % numCols;

 var upperColsize;
 var lowerColsize;
 if (colSize != Math.floor(colSize)) {
 // it's not an exact fit so..
 lowerColsize = Math.floor(colSize);
 upperColsize = Math.floor(colSize) + 1;
 }
 else {
 lowerColsize = colSize;
 upperColsize = colSize;
 }

 var markup = "";
 var c=0;

 var newTaggedTable = createTiddlyElement(place,"table");
 var newTaggedBody = createTiddlyElement(newTaggedTable,"tbody");
 var newTaggedTr = createTiddlyElement(newTaggedBody,"tr");

 for (var j=0;j<numCols;j++) {
 var foo = "";
 var thisSize;

 if (j<remainder)
 thisSize = upperColsize;
 else
 thisSize = lowerColsize;

 for (var i=0;i<thisSize;i++) 
 foo += ( "*[[" + result[c++].title + "]]\n"); // was using splitList.shift() but didn't work in IE;

 var newTd = createTiddlyElement(newTaggedTr,"td",null,"tagglyTagging");
 wikify(foo,newTd);

 }

};

/* snip for later.....
 //var groupBy = params[3] ? params[3] : "t.title.substr(0,1)";
 //var groupBy = params[3] ? params[3] : "sortedListOfOtherTags(t,tiddler.title)";
 //var groupBy = params[3] ? params[3] : "t.modified";
 var groupBy = null; // for now. groupBy here is working but disabled for now.

 var prevGroup = "";
 var thisGroup = "";

 if (groupBy) {
 result.sort(function(a,b) {
 var t = a; var aSortVal = eval(groupBy); var aSortVal2 = eval("t".sortBy);
 var t = b; var bSortVal = eval(groupBy); var bSortVal2 = eval("t".sortBy);
 var t = b; var bSortVal2 = eval(groupBy);
 return (aSortVal == bSortVal ?
 (aSortVal2 == bSortVal2 ? 0 : (aSortVal2 < bSortVal2 ? -1 : +1)) // yuck
 : (aSortVal < bSortVal ? -1 : +1));
 });
 }

 if (groupBy) {
 thisGroup = eval(groupBy);
 if (thisGroup != prevGroup)
 markup += "*[["+thisGroup+']]\n';
 markup += "**[["+t.title+']]\n';
 prevGroup = thisGroup;
 }



*/


//}}}

/***

!tagglyListControl
Use to make the sort control buttons
***/
//{{{

function getSortBy(title) {
 var tiddler = store.getTiddler(title);
 var defaultVal = config.macros.tagglyListWithSort.defaults.sortBy;
 if (!tiddler) return defaultVal;
 var usetags = config.macros.tagglyListControl.tags;
 if (tiddler.tags.contains(usetags["title"])) return "title";
 else if (tiddler.tags.contains(usetags["modified"])) return "modified";
 else if (tiddler.tags.contains(usetags["created"])) return "created";
 else return defaultVal;
}

function getSortOrder(title) {
 var tiddler = store.getTiddler(title);
 var defaultVal = config.macros.tagglyListWithSort.defaults.sortOrder;
 if (!tiddler) return defaultVal;
 var usetags = config.macros.tagglyListControl.tags;
 if (tiddler.tags.contains(usetags["asc"])) return "asc";
 else if (tiddler.tags.contains(usetags["desc"])) return "desc";
 else return defaultVal;
}

function getHideState(title) {
 var tiddler = store.getTiddler(title);
 var defaultVal = config.macros.tagglyListWithSort.defaults.hideState;
 if (!tiddler) return defaultVal;
 var usetags = config.macros.tagglyListControl.tags;
 if (tiddler.tags.contains(usetags["hide"])) return "hide";
 else if (tiddler.tags.contains(usetags["show"])) return "show";
 else return defaultVal;
}

function getGroupState(title) {
 var tiddler = store.getTiddler(title);
 var defaultVal = config.macros.tagglyListWithSort.defaults.groupState;
 if (!tiddler) return defaultVal;
 var usetags = config.macros.tagglyListControl.tags;
 if (tiddler.tags.contains(usetags["group"])) return "group";
 else if (tiddler.tags.contains(usetags["nogroup"])) return "nogroup";
 else return defaultVal;
}

function getNumCols(title) {
 var tiddler = store.getTiddler(title);
 var defaultVal = config.macros.tagglyListWithSort.defaults.numCols; // an int
 if (!tiddler) return defaultVal;
 var usetags = config.macros.tagglyListControl.tags;
 for (var i=1;i<=config.macros.tagglyListWithSort.maxCols;i++)
 if (tiddler.tags.contains(usetags["cols"+i])) return i;
 return defaultVal;
}


function getSortLabel(title,which) {
 // TODO. the strings here should be definable in config
 var by = getSortBy(title);
 var order = getSortOrder(title);
 var hide = getHideState(title);
 var group = getGroupState(title);
 if (which == "hide") return (hide == "show" ? "−" : "+"); // 0x25b8;
 else if (which == "group") return (group == "group" ? "normal" : "grouped");
 else if (which == "cols") return "cols±"; // &plusmn;
 else if (by == which) return which + (order == "asc" ? "↓" : "↑"); // &uarr; &darr;
 else return which;
}

function handleSortClick(title,which) {
 var currentSortBy = getSortBy(title);
 var currentSortOrder = getSortOrder(title);
 var currentHideState = getHideState(title);
 var currentGroupState = getGroupState(title);
 var currentNumCols = getNumCols(title);

 var tags = config.macros.tagglyListControl.tags;

 // if it doesn't exist, lets create it..
 if (!store.getTiddler(title))
 store.saveTiddler(title,title,"",config.options.txtUserName,new Date(),null);

 if (which == "hide") {
 // toggle hide state
 var newHideState = (currentHideState == "hide" ? "show" : "hide");
 removeTag(title,tags[currentHideState]);
 if (newHideState != config.macros.tagglyListWithSort.defaults.hideState)
 toggleTag(title,tags[newHideState]);
 }
 else if (which == "group") {
 // toggle hide state
 var newGroupState = (currentGroupState == "group" ? "nogroup" : "group");
 removeTag(title,tags[currentGroupState]);
 if (newGroupState != config.macros.tagglyListWithSort.defaults.groupState)
 toggleTag(title,tags[newGroupState]);
 }
 else if (which == "cols") {
 // toggle num cols
 var newNumCols = currentNumCols + 1; // confusing. currentNumCols is an int
 if (newNumCols > config.macros.tagglyListWithSort.maxCols || newNumCols > store.getTaggedTiddlers(title).length)
 newNumCols = 1;
 removeTag(title,tags["cols"+currentNumCols]);
 if (("cols"+newNumCols) != config.macros.tagglyListWithSort.defaults.groupState)
 toggleTag(title,tags["cols"+newNumCols]);
 }
 else if (currentSortBy == which) {
 // toggle sort order
 var newSortOrder = (currentSortOrder == "asc" ? "desc" : "asc");
 removeTag(title,tags[currentSortOrder]);
 if (newSortOrder != config.macros.tagglyListWithSort.defaults.sortOrder)
 toggleTag(title,tags[newSortOrder]);
 }
 else {
 // change sortBy only
 removeTag(title,tags["title"]);
 removeTag(title,tags["created"]);
 removeTag(title,tags["modified"]);

 if (which != config.macros.tagglyListWithSort.defaults.sortBy)
 toggleTag(title,tags[which]);
 }

 store.setDirty(true); // save is required now.
 story.refreshTiddler(title,false,true); // force=true
}

config.macros.tagglyListControl.handler = function (place,macroName,params,wikifier,paramString,tiddler) {
 var onclick = function(e) {
 if (!e) var e = window.event;
 handleSortClick(tiddler.title,params[0]);
 e.cancelBubble = true;
 if (e.stopPropagation) e.stopPropagation();
 return false;
 };
 createTiddlyButton(place,getSortLabel(tiddler.title,params[0]),"Click to change sort options",onclick,params[0]=="hide"?"hidebutton":"button");
}
//}}}
/***

!tagglyListWithSort
put it all together..
***/
//{{{
config.macros.tagglyListWithSort.handler = function (place,macroName,params,wikifier,paramString,tiddler) {
 if (tiddler && store.getTaggedTiddlers(tiddler.title).length > 0)
  // todo make this readable
 wikify(
 "<<tagglyListControl hide>>"+
 (getHideState(tiddler.title) != "hide" ? 
 '<html><span class="tagglyLabel">'+config.macros.tagglyList.label.format([tiddler.title])+' </span></html>'+
 "<<tagglyListControl title>><<tagglyListControl modified>><<tagglyListControl created>><<tagglyListControl group>>"+(getGroupState(tiddler.title)=="group"?"":"<<tagglyListControl cols>>")+"\n" + 
 "<<tagglyList" + (getGroupState(tiddler.title)=="group"?"ByTag ":" ") + getSortBy(tiddler.title)+" "+getSortOrder(tiddler.title)+" "+getNumCols(tiddler.title)+">>" // hacky
 // + \n----\n" +
 //"<<tagglyList "+getSortBy(tiddler.title)+" "+getSortOrder(tiddler.title)+">>"
 : ""),
 place,null,tiddler);
}

config.macros.tagglyTagging = { handler: config.macros.tagglyListWithSort.handler };


//}}}
/***

!hideSomeTags
So we don't see the sort tags.
(note, they are still there when you edit. Will that be too annoying?
***/
//{{{

// based on tags.handler
config.macros.hideSomeTags.handler = function(place,macroName,params,wikifier,paramString,tiddler) {
 var theList = createTiddlyElement(place,"ul");
 if(params[0] && store.tiddlerExists[params[0]])
 tiddler = store.getTiddler(params[0]);
 var lingo = config.views.wikified.tag;
 var prompt = tiddler.tags.length == 0 ? lingo.labelNoTags : lingo.labelTags;
 createTiddlyElement(theList,"li",null,"listTitle",prompt.format([tiddler.title]));
 for(var t=0; t<tiddler.tags.length; t++)
 if (!this.tagsToHide.contains(tiddler.tags[t])) // this is the only difference from tags.handler...
 createTagButton(createTiddlyElement(theList,"li"),tiddler.tags[t],tiddler.title);

}

//}}}
/***

!Refresh everything when we save a tiddler. So the tagged lists never get stale. Is this too slow???
***/
//{{{

function refreshAllVisible() {
 story.forEachTiddler(function(title,element) {
   if (element.getAttribute("dirty") != "true") 
     story.refreshTiddler(title,false,true);
 });
}

story.saveTiddler_orig_mptw = story.saveTiddler;
story.saveTiddler = function(title,minorUpdate) {
 var result = this.saveTiddler_orig_mptw(title,minorUpdate);
 refreshAllVisible();
 return result;
}

store.removeTiddler_orig_mptw = store.removeTiddler;
store.removeTiddler = function(title) {
 this.removeTiddler_orig_mptw(title);
 refreshAllVisible();
}

config.shadowTiddlers.TagglyTaggingStyles = "/***\nTo use, add {{{[[TagglyTaggingStyles]]}}} to your StyleSheet tiddler, or you can just paste the CSS in directly. See also ViewTemplate, EditTemplate and TagglyTagging.\n***/\n/*{{{*/\n.tagglyTagged li.listTitle { display:none;}\n.tagglyTagged li { display: inline; font-size:90%; }\n.tagglyTagged ul { margin:0px; padding:0px; }\n.tagglyTagging { padding-top:0.5em; }\n.tagglyTagging li.listTitle { display:none;}\n.tagglyTagging ul { margin-top:0px; padding-top:0.5em; padding-left:2em; margin-bottom:0px; padding-bottom:0px; }\n\n/* .tagglyTagging .tghide { display:inline; } */\n\n.tagglyTagging { vertical-align: top; margin:0px; padding:0px; }\n.tagglyTagging table { margin:0px; padding:0px; }\n\n\n.tagglyTagging .button { display:none; margin-left:3px; margin-right:3px; }\n.tagglyTagging .button, .tagglyTagging .hidebutton { color:#aaa; font-size:90%; border:0px; padding-left:0.3em;padding-right:0.3em;}\n.tagglyTagging .button:hover, .hidebutton:hover { background:#eee; color:#888; }\n.selected .tagglyTagging .button { display:inline; }\n\n.tagglyTagging .hidebutton { color:white; } /* has to be there so it takes up space. tweak if you're not using a white tiddler bg */\n.selected .tagglyTagging .hidebutton { color:#aaa }\n\n.tagglyLabel { color:#aaa; font-size:90%; }\n\n.tagglyTagging ul {padding-top:0px; padding-bottom:0.5em; margin-left:1em; }\n.tagglyTagging ul ul {list-style-type:disc; margin-left:-1em;}\n.tagglyTagging ul ul li {margin-left:0.5em; }\n\n.editLabel { font-size:90%; padding-top:0.5em; }\n/*}}}*/\n";

refreshStyles("TagglyTaggingStyles");


//}}}

// // <html>&#x25b8;&#x25be;&minus;&plusmn;</html>