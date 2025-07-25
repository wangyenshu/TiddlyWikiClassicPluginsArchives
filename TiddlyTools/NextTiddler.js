/%
!info
|Name|NextTiddler|
|Source|http://www.TiddlyTools.com/#NextTiddler|
|Version|2.0.0|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.1|
|Type|transclusion|
|Description|create a link to close the current tiddler and open another in its place|
Usage:
<<<
{{{
<<tiddler NextTiddler with: NextTiddlerTitle linktext>>
}}}
<<<
Example
<<<
{{{<<tiddler NextTiddler with: About "About TiddlyTools">>}}}
<<tiddler NextTiddler with: About "About TiddlyTools">>
<<<
!end
!show
[[$2|$1]]<<tiddler {{
	place.lastChild.onclick=function() {
		var here=story.findContainingTiddler(this);
		story.displayTiddler(here,"$1"); // open next
		story.closeTiddler(here.getAttribute('tiddler')); // close self
	}
'';}}>>
!end
%/<<tiddler {{'NextTiddler##'+('$1'=='$'+'1'?'info':'show')}} with: [[$1]] [[$2]]>>