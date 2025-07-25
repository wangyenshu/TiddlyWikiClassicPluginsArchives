/%
!info
|Name|OpenTaggedTiddlers|
|Source|http://www.TiddlyTools.com/#OpenTaggedTiddlers|
|Version|2.0.0|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.1|
|Type|transclusion|
|Description|create a link to open a set of tagged tiddlers with a single click|
Usage:
<<<
{{{
<<tiddler OpenTaggedTiddlers with: label tagToMatch sortBy reverse close limit>>
}}}
*''label''<br>is the text of the link
*''tagToMatch''<br>is a single tag value to be matched.  Note: when MatchTagsPlugin is installed, you can also use a boolean tag expression, enclosed in "..."
*''sortBy'' (optional)<br>a tiddler fieldname, (default="title", use "modified" or "created" for tiddler dates)
*''reverse'' (optional)<br>display order for the tiddlers (i.e., descending vs. ascending)
*''close'' (optional)<br>closes all open tiddlers before opening the tagged tiddlers
*''limit'' (optional)<br>maximum number of tiddlers to be opened
Note: use "" as placeholders when omitting optional parameters
<<<
Example
<<<
{{{<<tiddler OpenTaggedTiddlers##show with: "click me..." sample title reverse "" 3>>}}}
<<tiddler OpenTaggedTiddlers##show with: "click me..." sample title reverse "" 3>>
<<<
!end
!show
<html><nowiki><a href='javascript:;' onclick="
	var list=[];
	var match='$2';
	var sortBy='$3'; if ((sortBy=='$'+'3')||(sortBy=='')) sortBy='title';
	var filter='[tag[%0]][sort[%1]]'.format([match,sortBy]);
	var tids=store.filterTiddlers(filter);
	if ('$4'=='reverse') tids=tids.reverse();
	if ('$5'=='close') story.closeAllTiddlers();
	var limit=('$6'!='$'+'6')?parseInt('$6'):tids.length;
	for (var t=0;t<tids.length && t<limit;t++) list.push(tids[t].title);
	if (confirm('Show %0 tiddlers tagged with \x27%1\x27?'.format([tids.length,match]))) {
		var here=story.findContainingTiddler(place);
		story.displayTiddlers(here,list);
		if (here && list.length) { // scroll to top of newly displayed tiddlers
			var cmd='window.scrollTo(0,'+(here.offsetTop+here.offsetHeight)+')';
			var delay=config.options.chkAnimate?config.animDuration+100:0;
			setTimeout(cmd,delay);
		}
	}
	return false;
">$1</a></html>
!end
%/<<tiddler {{var src='OpenTaggedTiddlers'; src+(tiddler&&tiddler.title==src?'##info':'##show')}}
	with: [[$1]] [[$2]] [[$3]] [[$4]] [[$5]] [[$6]]>>