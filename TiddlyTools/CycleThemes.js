/%
!info
|Name|CycleThemes|
|Source|http://www.TiddlyTools.com/#CycleThemes|
|Version|2.0.0|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.1|
|Type|transclusion|
|Description|creates command link to cycle through systemThemes|
Usage
<<<
{{{
<<tiddler CycleThemes>>
<<tiddler CycleThemes with: label "theme theme theme">>
}}}
*''label'' (optional)<br>text of command link. default='next theme'
*''"theme theme theme"'' (optional)<br>list of theme tiddlers to cycle through.   default=[[StyleSheet]] plus all tiddlers tagged with<<tag systemTheme>>, except those tagged with<<tag excludeTheme>>or<<tag excludeLists>>
<<<
Examples
<<<
*Cycle through all themes:<br>{{{<<tiddler CycleThemes>>}}}<br><<tiddler CycleThemes##show with: 'next theme' >>
*Toggle between two themes:<br>{{{<<tiddler CycleThemes with: "toggle" "StyleSheet Plain">>}}}<br><<tiddler CycleThemes##show with: "toggle" "StyleSheet Plain">>
*Apply a theme:<br>{{{<<tiddler CycleThemes with: "default" StyleSheet>>}}}<br><<tiddler CycleThemes##show with: "use default StyleSheet" StyleSheet>>
<<<
!end
!show
<html><nowiki><a href="javascript:;"
onmouseover="
	this.title='current theme: '+config.options.txtTheme;
	this.href='javascript:void(eval(decodeURIComponent(%22(function(){try{('
	+encodeURIComponent(encodeURIComponent(this.onclick))
	+')()}catch(e){alert(e.description?e.description:e.toString())}})()%22)))';"
onclick="
	var titles='$2'.readBracketedList();
	if ('$2'=='$'+'2') {
		var tids=store.getTaggedTiddlers('systemTheme');
		titles=tids.map(function(t){return t.tags.contains('excludeTheme','excludeLists')?null:t.title;});
		titles.pushUnique('StyleSheet');
	}
	var curr=titles.indexOf(config.options.txtTheme);
	var next=curr+1>=titles.length?0:curr+1;
	while(!titles[next] && next!=curr) next=next+1>=titles.length?0:next+1;
	story.switchTheme(titles[next]);
	return false;"
>$1</a></html>
!end
%/<<tiddler {{var src='CycleThemes'; src+(tiddler&&tiddler.title==src?'##info':'##show')}}
	with: {{'$1'=='$'+'1'?'next theme':'$1'}} "$2">>