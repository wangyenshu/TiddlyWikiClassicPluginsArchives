/%
!info
|Name|EmbedTiddlers|
|Source|http://www.TiddlyTools.com/#EmbedTiddlers|
|Version|2.0.2|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|Type|transclusion|
|Description|transclude a list of tiddlers in a specific order|
Usage
<<<
{{{
<<tiddler EmbedTiddlers with: "TiddlerName [[TiddlerName with spaces]] TiddlerName ...">>
<<tiddler EmbedTiddlers with: @TiddlerName>>
<<tiddler EmbedTiddlers with: =tagValue sortby>>
}}}
*''"~TiddlerName """[[TiddlerName with spaces]] TiddlerName ...""""''<br>specifies a list of tiddlers to embed
*''@~TiddlerName''<br>specifies a //separate// tiddler containing the space-separated, bracketed list of tiddlers to embed (e.g., like [[DefaultTiddlers]])
*''=tagValue''<br>embeds all tiddlers that are tagged with the indicated value
*''sortby'' (optional)<br> specifies a tiddler field for sorting the results (default="title").  Use "+" or "-" prefix to indicate the sort direction (ascending/descending), e.g., "-modified" sorts by tiddler modification date, most recent first.
Note: if MatchTagsPlugin is installed, you can use //compound Boolean logic expressions// in place of the "tagValue" (following the leading "=").  However, because a boolean expression will always contain spaces, it MUST be enclosed in quotes (or doubled square brackets {{{[[...]]}}}), like this:
{{{
<<tiddler EmbedTiddlers with: "=settings AND NOT systemConfig">>
}}}
<<<
!end
!out
$1
!end
!show
<<tiddler EmbedTiddlers##out with: {{
	var list='$1';
	var sortby='title'; if ('$2'!='$'+'2') sortby='$2';
	var tids=[];
	if (list.substr(0,1)=='=') {
		var fn=store.getMatchingTiddlers||store.getTaggedTiddlers;
		var tagged=store.sortTiddlers(fn.apply(store,[list.substr(1)]),sortby);
		for (var t=0; t<tagged.length; t++) tids.push(tagged[t].title);
	} else {
		if (list.substr(0,1)=='@') list=store.getTiddlerText(list.substr(1),'');
		var tids=list.readBracketedList();
	}
	var out='';
	for (var i=0; i<tids.length; i++) out+='<<tiddler [['+tids[i]+']]>\>';
	out;
}}>>
!end
%/<<tiddler {{var src='EmbedTiddlers'; src+(tiddler&&tiddler.title==src?'##info':'##show');}}
	with: "$1" "$2">>