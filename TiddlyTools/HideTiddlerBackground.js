/%
!info
|Name|HideTiddlerBackground|
|Source|http://www.TiddlyTools.com/#HideTiddlerBackground|
|Version|2.0.1|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.1|
|Type|transclusion|
|Description|hide a tiddler's background and border (if any)|
Usage:
<<<
{{{
<<tiddler HideTiddlerBackground>>
<<tiddler HideTiddlerBackground with: TiddlerTitle>>
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
		for (var i=0; i<e.length; i++) if (hasClass(e[i],'viewer')) {
			var s=e[i].style;
			s.backgroundImage='none';
			s.backgroundColor='transparent';
			s.border=s.margin=s.padding='0px';
			break;
		}
	}
'';}}>>
!end
%/<<tiddler {{
	var src='HideTiddlerBackground';
	src+(tiddler&&tiddler.title==src?'##info':'##show');}}
with: [[$1]]>>