/%
!info
|Name|HideTiddlerSubtitle|
|Source|http://www.TiddlyTools.com/#HideTiddlerSubtitle|
|Version|2.0.1|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.1|
|Type|transclusion|
|Description|hide a tiddler's subtitle (date and author)|
Usage:
<<<
{{{
<<tiddler HideTiddlerSubtitle>>
<<tiddler HideTiddlerSubtitle with: TiddlerTitle>>
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
			if (hasClass(e[i],'subtitle')) e[i].style.display='none';
	}
'';}}>>
!end
%/<<tiddler {{
	var src='HideTiddlerSubtitle';
	src+(tiddler&&tiddler.title==src?'##info':'##show');}}
with: [[$1]]>>