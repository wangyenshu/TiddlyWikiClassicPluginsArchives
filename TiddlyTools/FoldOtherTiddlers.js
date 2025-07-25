/%
!info
|Name|FoldOtherTiddlers|
|Source|http://www.TiddlyTools.com/#FoldOtherTiddlers|
|Version|2.0.0|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.1|
|Type|transclusion|
|Description|fold all other tiddlers when a tiddler is viewed|
Usage:
<<<
{{{
<<tiddler FoldOtherTiddlers>>
}}}
<<<
!end
%/<<tiddler {{
	var out='FoldOtherTiddlers##info';
	if (config.commands.collapseTiddler && (!tiddler||tiddler.title!='FoldOtherTiddlers')) {
		var here=story.findContainingTiddler(place);
		if (here) config.commands.collapseOthers.handler(null,here,here.getAttribute('tiddler'));
		out='';
	}
out;}}>>