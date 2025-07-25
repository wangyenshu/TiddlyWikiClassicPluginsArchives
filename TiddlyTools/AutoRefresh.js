/%
!info
|Name|AutoRefresh|
|Source|http://www.TiddlyTools.com/#AutoRefresh|
|Version|2.0.0|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.1|
|Type|transclusion|
|Description|set/clear tiddler refresh flags to force/prevent re-rendering when changes occur|
Usage:
<<<
{{{
<<tiddler AutoRefresh>>
<<tiddler AutoRefresh with: mode id>>
}}}
*''mode'' (optional), one of:
**''off'' or ''disable'' - prevents refresh of rendered content (except when PageTemplate is changed!)
**''on'' or ''enable'' - re-render content whenever corresponding tiddler source is changed (default)
**''force'' - re-render content whenever //''ANY''// tiddler is changed
*''id'' (optional), is a unique DOM element identifier on which to operate (e.g., 'mainMenu').  If omitted, the current tiddler (if any) is implied.
<<<
!end
!show
<<tiddler {{
	var here=story.findContainingTiddler(place);
	var target=document.getElementById('$2')||here||place.parentNode;
	if (target==here) { // in a tiddler, get viewer element
		var elems=target.getElementsByTagName('*');
		for (var i=0;i<elems.length;i++)
			if (hasClass(elems[i],'viewer')) { target=elems[i]; break; }
	}
	if (target) {
		var mode='$1'; if (mode=='$'+'1') mode='on';
		if (['on','enable','force'].contains(mode.toLowerCase())) {
			var title=target.getAttribute('tiddler');
			if (!title&&here) title=here.getAttribute('tiddler');
			if (title) target.setAttribute('tiddler',title);
			target.setAttribute('refresh','content');
			target.setAttribute('force',(mode=='force')?'true':'');
		} else if (['off','disable'].contains(mode.toLowerCase())) {
			target.setAttribute('refresh','');
			target.setAttribute('force','');
		}
	}
'';}}>>
!end
%/<<tiddler {{var src='AutoRefresh'; src+(tiddler&&tiddler.title==src?'##info':'##show');}}
	with: [[$1]] [[$2]]>>