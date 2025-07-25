/%
!info
|Name|WordCount|
|Source|http://www.TiddlyTools.com/#WordCount|
|Version|2.0.1|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.1|
|Type|transclusion|
|Description|display a count of the number of white-space separated words in a tiddler|
Usage:
<<<
{{{
<<tiddler WordCount>>
<<tiddler WordCount with: TiddlerTitle>>
}}}
<<<
!end
!out
$1
!end
!show
<<tiddler WordCount##out with: {{
	var title="$1"; if (title=='$'+'1')
		title=(story.findContainingTiddler(place)||place).getAttribute('tiddler')||'';
	var txt=store.getTiddlerText(title,'');
	(txt.match(/\S+/g)||[]).length.toString();
'';}}>>
%/<<tiddler {{
	var src='WordCount';
	src+(tiddler&&tiddler.title==src?'##info':'##show');
}} with: [[$1]]>>