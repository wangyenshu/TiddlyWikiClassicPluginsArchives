/%
!info
|Name|HideTiddlerTags|
|Source|http://www.TiddlyTools.com/#HideTiddlerTags|
|Version|2.0.1|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.1|
|Type|transclusion|
|Description|hide a tiddler's 'tagged' and 'tagging' displays (if any)|
Usage:
<<<
{{{
<<tiddler HideTiddlerTags>>
<<tiddler HideTiddlerTags with: TiddlerTitle>>
}}}
<<<
!end
!show
<<tiddler {{
	var title="$1";
	if (title=='$'+'1') {
		var here=story.findContainingTiddler(place);
		if (here) title=here.getAttribute('tiddler');
	}
	var t=story.getTiddler(title); if (t) {
		var e=t.getElementsByTagName('*');
		for (var i=0; i<e.length; i++)
			if (hasClass(e[i],'tagging')||hasClass(e[i],'tagged'))
				e[i].style.display='none';
	}
'';}}>>
!end
%/<<tiddler {{
	var src='HideTiddlerTags';
	src+(tiddler&&tiddler.title==src?'##info':'##show');}}
with: [[$1]]>>