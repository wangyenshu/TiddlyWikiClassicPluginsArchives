/***
|''Name:''|NewsWikiTweaks|
|''Description:''|Some tweaks for NewsWiki|
|''Version:''|0.0.1|
|''Date:''|Jun 11, 2007|
|''Source:''|http://TiddlyWiki.bidix.info/#NewsWikiTweaks|
|''Author:''|BidiX (BidiX (at) bidix (dot) info)|
|''[[License]]:''|[[BSD open source license|http://tiddlywiki.bidix.info/#%5B%5BBSD%20open%20source%20license%5D%5D ]]|
|''~CoreVersion:''|2.2.0|
***/

/***
!Options
***/
//{{{
//Options
config.options.chkAnimate = false;
config.options.txtRssTag = 'toRSS';
//}}}
/***
!tag
***/
//{{{
merge(config.views.wikified.tag,{
 labelNoTags: "",
 labelTags: ""});
/*
merge(config.macros.tagging,{
 label: "",
 labelNotTag: "",
 tooltip: ""});
*/


createTagButton = function(place,tag,excludeTiddler)
{
	var triangle = 	" "+glyph("downTriangle");
	var theTag = createTiddlyButton(place,tag+triangle,config.views.wikified.tag.tooltip.format([tag]),onClickTag);
	theTag.setAttribute("tag",tag);
	if(excludeTiddler)
		theTag.setAttribute("tiddler",excludeTiddler);
	return theTag;
}


onClickTag = function(e)
{
	if(!e) var e = window.event;
	var theTarget = resolveTarget(e);
	var popup = Popup.create(this);
	var tag = this.getAttribute("tag");
	var title = this.getAttribute("tiddler");
	if(popup && tag) {
		var tagged = store.getTaggedTiddlers(tag);
		var titles = [];
		var li,r;
		for(r=0;r<tagged.length;r++) {
			if(tagged[r].title != title)
				titles.push(tagged[r].title);
		}
		var lingo = config.views.wikified.tag;
		if(titles.length > 0) {
			// var openAll = createTiddlyButton(createTiddlyElement(popup,"li"),lingo.openAllText.format([tag]),lingo.openAllTooltip,onClickTagOpenAll);
			// openAll.setAttribute("tag",tag);
			// createTiddlyElement(createTiddlyElement(popup,"li",null,"listBreak"),"div");
			for(r=0; r<titles.length; r++) {
				createTiddlyLink(createTiddlyElement(popup,"li"),titles[r],true);
			}
		} else {
			createTiddlyText(createTiddlyElement(popup,"li",null,"disabled"),lingo.popupNone.format([tag]));
		}
		createTiddlyElement(createTiddlyElement(popup,"li",null,"listBreak"),"div");
		if (!config.options.chkSinglePageMode) {
			var openAll = createTiddlyButton(createTiddlyElement(popup,"li"),lingo.openAllText.format([tag]),lingo.openAllTooltip,onClickTagOpenAll);
			openAll.setAttribute("tag",tag);
		}
		// createTiddlyElement(createTiddlyElement(popup,"li",null,"listBreak"),"div");
		var h = createTiddlyLink(createTiddlyElement(popup,"li"),tag,false);
		createTiddlyText(h,lingo.openTag.format([tag]));
	}
	Popup.show();
	e.cancelBubble = true;
	if(e.stopPropagation) e.stopPropagation();
	return false;
}


config.macros.tagChooser.onClick = function(e)
{
	if(!e) var e = window.event;
	var lingo = config.views.editor.tagChooser;
	var popup = Popup.create(this);
	var tags = store.getTags("[[admin]]");
	if(tags.length == 0)
		createTiddlyText(createTiddlyElement(popup,"li"),lingo.popupNone);
	for(var t=0; t<tags.length; t++) {
		var theTag = createTiddlyButton(createTiddlyElement(popup,"li"),tags[t][0],lingo.tagTooltip.format([tags[t][0]]),config.macros.tagChooser.onTagClick);
		theTag.setAttribute("tag",tags[t][0]);
		theTag.setAttribute("tiddler",this.getAttribute("tiddler"));
	}
	Popup.show();
	e.cancelBubble = true;
	if(e.stopPropagation) e.stopPropagation();
	return false;
};



//}}}
/***
!tabs
***/
//{{{
config.macros.list.user= {};
config.macros.list.user.handler = function(params)
{
	return store.reverseLookup("tags","admin",false,"title");
};

config.macros.userTimeline = {};
config.macros.userTimeline.handler = function(place,macroName,params)
{
	var field = params[0] ? params[0] : "modified";
	var tiddlers = store.reverseLookup("tags","admin",false,field);
	var lastDay = "";
	var last = params[1] ? tiddlers.length-Math.min(tiddlers.length,parseInt(params[1])) : 0;
	for(var t=tiddlers.length-1; t>=last; t--) {
		var tiddler = tiddlers[t];
		var theDay = tiddler[field].convertToLocalYYYYMMDDHHMM().substr(0,8);
		if(theDay != lastDay) {
			var theDateList = document.createElement("ul");
			place.appendChild(theDateList);
			createTiddlyElement(theDateList,"li",null,"listTitle",tiddler[field].formatString(config.macros.timeline.dateFormat));
			lastDay = theDay;
		}
		var theDateListItem = createTiddlyElement(theDateList,"li",null,"listLink");
		theDateListItem.appendChild(createTiddlyLink(place,tiddler.title,true));
	}
};

//}}}
/***
!Shadow tiddlers
***/
//{{{
config.shadowTiddlers.GettingStarted = 
	"To get started with this blank NewsWiki, you'll need to change mode to <<changeMode Author>> or <<changeMode>>\n\n" +
	config.shadowTiddlers.GettingStarted;
//}}}

/***
!others
***/
//{{{
config.macros.version.handler = function(place)
{
	createTiddlyElement(place,"span",null,null,version.major + "." + version.minor + "." + version.revision + (version.beta ? " (beta " + version.beta + ")" : "") + (version.build ? " (build #" + version.build + ")" : ""));
};


//}}}