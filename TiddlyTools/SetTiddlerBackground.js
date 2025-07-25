/%
!info
|Name|SetTiddlerBackground|
|Source|http://www.TiddlyTools.com/#SetTiddlerBackground|
|Version|2.0.0|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|Type|transclusion|
|Description|set tiddler background and font color CSS attributes|
Usage
<<<
{{{
<<tiddler SetTiddlerBackground with: bgstyle fgstyle matchtag class>>
}}}
*''bgstyle'' and ''fgstyle'' (optional, but specify at least one)<br>are CSS background style attributes (most often color values, e.g., #rgb or #rrggbb)
*''matchtag'' (optional)<br>is a tag value that allows selective control of tiddler background/foreground colors
*''class'' (optional)<br>is the class of the tiddler element to which the fgstyle/bgstyle will be applied Default is 'viewer'.  Use 'title' to set the background of the tiddler's 'title' area instead of its 'viewer' area.
The bgstyle and fgstyle assignments are only performed if the tiddler has the matching tag (or if no matchtag value is specified).  Also, to set either bgstyle or fgstyle (but not both), you can use a dash ('-') as a placeholder for the value you do NOT want to set.  For example:
{{{
<<tiddler SetTiddlerBackground with: #F00 - urgent>>
}}}
sets the bgstyle (but NOT the fgstyle) to RED for only those tiddlers tagged with 'urgent'.  Also, note that in that instead of using #RGB color definitions, you can also use CSS color keywords (i.e., 'red', 'yellow', 'green') or *any* other valid CSS value that can be applied to the 'background' style attribute.  For example, to use a background image for any tiddler tagged with 'wallpaper', you can write:
{{{
<<tiddler SetTiddlerBackground with: url("images/bg.jpg") - wallpaper>>
}}}
You can use this script several times in a row to define a set of tag-to-color mappings, stored in a *single* convenient tiddler (e.g, [[BackgroundColors]]), containing something like this:
{{{
<<tiddler SetTiddlerBackground with: red - urgent>>
<<tiddler SetTiddlerBackground with: yellow - active>>
<<tiddler SetTiddlerBackground with: green - done>>
}}}
To apply the set of tag-based color mappings, embed:
{{{
<<tiddler BackgroundColors>> (in tiddler content) OR
<span macro='tiddler BackgroundColors' style='display:none'></span> (in ViewTemplate, for all tiddlers)
}}}
and then set the desired tag value(s) onto specific tiddlers.  To add more color mappings, just edit the [[BackgroundColors]] tiddler and then start tagging tiddlers accordingly.
<<<
!end
!show
<<tiddler {{
	if ('$1'!='$'+'1' && '$1'!='-') var bg='$1';
	if ('$2'!='$'+'2' && '$2'!='-') var fg='$2';
	if ('$3'!='$'+'3' && '$3'!='-') var tag='$3';
	if ('$4'!='$'+'4' && '$4'!='-') var c='$4'; else var c='viewer';
	var here=story.findContainingTiddler(place);
	var t=store.getTiddler(here?here.getAttribute('tiddler'):'');
	if (!tag||t&&t.isTagged(tag)) {
		var e=here;
		if (c!='tiddler') {
			var elems=e.getElementsByTagName('*');
			for (var i=0; i<elems.length; i++)
				if (hasClass(elems[i],c)) { var e=elems[i]; break; }
		}
		if (e&&bg) { e.style.backgroundImage='none'; e.style.background=bg; }
		if (e&&fg) { e.style.color=fg; }
	}
'';}}>>
!end
%/<<tiddler {{var src='SetTiddlerBackground'; src+(tiddler&&tiddler.title==src?'##info':'##show');}}
	with: [[$1]] [[$2]] [[$3]] [[$4]]>>