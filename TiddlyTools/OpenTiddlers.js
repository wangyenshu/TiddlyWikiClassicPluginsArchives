/%
!info
|Name|OpenTiddlers|
|Source|http://www.TiddlyTools.com/#OpenTiddlers|
|Version|2.0.0|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.1|
|Type|transclusion|
|Description|command link to open multiple tiddlers with a single click|
Usage:
<<<
in tiddler content:
{{{
<<tiddler OpenTiddlers with: label
	"tiddler tiddler [[tiddler with spaces]] tiddler..." template>>
}}}
note: ''template'' is optional and defaults to ViewTemplate
<<<
!end

!show
<html><nowiki><a href='javascript:;' onclick='
	var tidlist="$2";
	if ("$3"!="$"+"3") var template="$3";
	story.displayTiddlers(story.findContainingTiddler(place),tidlist.readBracketedList(),template);
	return false;
'>$1</a></html>
!end
%/<<tiddler {{'OpenTiddlers##'+("$1"=='$'+'1'?'info':'show')}}
	with: [[$1]] {{"$2"}} [[$3]]>>