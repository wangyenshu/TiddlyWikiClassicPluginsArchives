/%
!info
|Name|MoveTiddlerToTop|
|Source|http://www.TiddlyTools.com/#MoveTiddlerToTop|
|Version|2.0.0|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.1|
|Type|transclusion|
|Description|reposition the current tiddler to top of the story column|
Usage:
<<<
{{{
<<tiddler MoveTiddlerToTop>>
}}}
<<<
!end
%/<<tiddler {{
	var out='MoveTiddlerToTop##info';
	if (!tiddler||tiddler.title!='MoveTiddlerToTop') {
		var here=story.findContainingTiddler(place);
		if (here) here.parentNode.insertBefore(here,here.parentNode.firstChild);
		out='';
	}
out;}}>>