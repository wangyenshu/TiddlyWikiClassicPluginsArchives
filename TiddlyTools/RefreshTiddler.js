/%
!info
|Name|RefreshTiddler|
|Source|http://www.TiddlyTools.com/#RefreshTiddler|
|Version|2.0.0|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.1|
|Type|transclusion|
|Description|create a link to force an immediate refresh of the current tiddler|
Usage
<<<
{{{
<<tiddler RefreshTiddler>>
<<tiddler RefreshTiddler with: label tip>>
}}}
<<<
Example
<<<
{{{<<tiddler RefreshTiddler with: "click me">>}}}
<<tiddler RefreshTiddler##show with: "click me">>
content displayed at <<today 0hh:0mm:0ss>>
<<<
!end
!show
<html><nowiki><a href="javascript:;" title="$2"
onclick="
	var here=story.findContainingTiddler(this);
	if (here) story.refreshTiddler(here.getAttribute('tiddler'),null,true);
	return false;
">$1</a></html>
!end
%/<<tiddler {{var src='RefreshTiddler'; src+(tiddler&&tiddler.title==src?'##info':'##show')}}
	with:	{{'$1'!='$'+'1'?'$1':'refresh'}}
		{{'$2'!='$'+'2'?'$2':'redisplay current tiddler content'}}
>>