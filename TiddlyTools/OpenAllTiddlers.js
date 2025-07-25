/%
!info
|Name|OpenAllTiddlers|
|Source|http://www.TiddlyTools.com/#OpenAllTiddlers|
|Version|2.0.0|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.1|
|Type|transclusion|
|Description|create a link to open ALL tiddlers in the document|
Usage:
<<<
{{{
<<tiddler OpenAllTiddlers>>
<<tiddler OpenAllTiddlers with: label>>
}}}
<<<
Example
<<<
{{{<<tiddler OpenAllTiddlers with: "click me">>}}}
<<tiddler OpenAllTiddlers##show with: "click me">>
<<<
!end
!show
<html><nowiki><a href='javascript:;' onclick="
	var tids=store.getTiddlers();
	if (confirm('Show all %0 tiddlers?'.format([tids.length]))) {
		var titles=[];
		for (var t=0;t<tid.length; t++)
			titles.push(tiddlers[t].title);
		story.closeAllTiddlers();
		story.displayTiddlers(null,titles);
	}
	return false;
">open all...</a></html>
!end
%/<<tiddler {{var src='OpenAllTiddlers'; src+(tiddler&&tiddler.title==src?'##info':'##show')}}
	with: [[$1]]>>