/%
!info
|Name|ReplaceDoubleClick|
|Source|http://www.TiddlyTools.com/#ReplaceDoubleClick|
|Version|2.0.0|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.1|
|Type|transclusion|
|Description|disable doubleclick-to-edit-tiddler or replace doubleclick with shift/ctrl/alt+singleclick|
Usage:
<<<
{{{
<<tiddler ReplaceDoubleClick>> or
<<tiddler ReplaceDoubleClick with: key trigger>>
}}}
*''key'' (optional)
**''none'' (default=disables double-click)
**''ctrl, shift,'' or ''alt'' invokes the action only when the indicated key is used in combination with the mouse.
*''trigger'' (optional)<br>is either 'click' or 'doubleclick' (default).
<<<
Example:
<<<
{{{<<tiddler ReplaceDoubleClick with: shift click>>}}}
<<tiddler ReplaceDoubleClick with: shift click>>//(use shift+click to edit this tiddler)//
<<<
!end
!show
<<tiddler {{
	var here=story.findContainingTiddler(place);
	if (here && here.ondblclick) {
		here.setAttribute('editKey','none');
		var key='$1'; if (key=='$'+'1') key='none'
		if (['shift','ctrl','alt'].contains(key))
			here.setAttribute('editKey',key+'Key');
		var trigger=('$2'=='click')?'onclick':'ondblclick';
		here.save_dblclick=here.ondblclick;
		here.ondblclick=null;
		if (here.getAttribute('editKey')!='none')
			here[trigger]=function(e) {
				var ev=e?e:window.event;
				if (ev[this.getAttribute('editKey')])
					this.save_dblclick.apply(this,arguments);
			}
	}'';}}>>
!end
%/<<tiddler {{var src='ReplaceDoubleClick';src+(tiddler&&tiddler.title==src?'##info':'##show')}} with: [[$1]] [[$2]]>>