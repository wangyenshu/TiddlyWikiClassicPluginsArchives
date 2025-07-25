/%
!info
|Name|RefreshPageDisplay|
|Source|http://www.TiddlyTools.com/#RefreshPageDisplay|
|Version|2.0.0|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.1|
|Type|transclusion|
|Description|create a link to redraw all page elements without restarting|
Usage
<<<
{{{
<<tiddler RefreshPageDisplay>>
<<tiddler RefreshPageDisplay with: label>>
}}}
<<<
Example
<<<
{{{<<tiddler RefreshPageDisplay with: "click me">>}}}
<<tiddler RefreshPageDisplay##show with: "click me">>
<<<
!end
!show
<html><nowiki><a href="javascript:;" title="Redisplay current page content WITHOUT RESTARTING!"
onmouseover="
	this.href='javascript:void(eval(decodeURIComponent(%22(function(){try{('
	+encodeURIComponent(encodeURIComponent(this.onclick))
	+')()}catch(e){alert(e.description?e.description:e.toString())}})()%22)))';"
onclick="
	story.forEachTiddler(function(t,e){story.refreshTiddler(t,null,true)});
	refreshDisplay();
 	return false;"
>$1</a></html>
!end
%/<<tiddler {{var src='RefreshPageDisplay'; src+(tiddler&&tiddler.title==src?'##info':'##show')}}
	with: {{'$1'=='$'+'1'?'refresh page display':'$1'}}>>