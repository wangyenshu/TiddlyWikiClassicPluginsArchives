/%
!info
|Name|HideTiddlerToolbar|
|Source|http://www.TiddlyTools.com/#HideTiddlerToolbar|
|Version|2.0.2|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.1|
|Type|transclusion|
|Description|hide a tiddler's toolbar (menu commands)|
Usage:
<<<
{{{
<<tiddler HideTiddlerToolbar>>
<<tiddler HideTiddlerToolbar with: TiddlerTitle>>
}}}
<<<
!end

!show
<<tiddler {{
	var title="$1";
	if (title=='$'+'1')
		title=(story.findContainingTiddler(place)||place).getAttribute('tiddler')||'';
	var t=story.getTiddler(title); if (t) {
		var e=t.getElementsByTagName('*');
		for (var i=0; i<e.length; i++)
			if (hasClass(e[i],'toolbar')) e[i].style.display='none';
	}
'';}}>>
!end
%/<<tiddler {{
	var src='HideTiddlerToolbar';
	src+(tiddler&&tiddler.title==src?'##info':'##show');
}} with [[$1]]>>