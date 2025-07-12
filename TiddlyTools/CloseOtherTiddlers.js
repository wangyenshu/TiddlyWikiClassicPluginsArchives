/%
!info
|Name|CloseOtherTiddlers|
|Source|http://www.TiddlyTools.com/#CloseOtherTiddlers|
|Version|2.0.0|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.1|
|Type|transclusion|
|Description|close all other tiddlers when a specific tiddler is viewed|
Usage:
<<<
{{{
<<tiddler CloseOtherTiddlers>>
}}}
<<<
!end
%/<<tiddler {{
	var out='CloseOtherTiddlers##info';
	if (!tiddler||tiddler.title!='CloseOtherTiddlers') {
		var here=story.findContainingTiddler(place);
		story.closeAllTiddlers(here?here.getAttribute("tiddler"):null);
		out='';
	}
out;}}>>