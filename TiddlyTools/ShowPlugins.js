/%
!info
|Name|ShowPlugins|
|Source|http://www.TiddlyTools.com/#ShowPlugins|
|Version|2.0.0|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.1|
|Type|transclusion|
|Description|generates a report of all installed plugins in a [[PluginInfo]] shadow tiddler|
Usage
<<<
{{{
<<tiddler ShowPlugins>>
<<tiddler ShowPlugins with: label>>
}}}
<<<
Example
<<<
{{{<<tiddler ShowPlugins with: "click me">>}}}
<<tiddler ShowPlugins##show with: "click me">>
<<<
!end
!show
<html><nowiki><a href="javascript:;" title="view a list of all installed plugins"
onmouseover="
	this.href='javascript:void(eval(decodeURIComponent(%22(function(){try{('
	+encodeURIComponent(encodeURIComponent(this.onclick))
	+')()}catch(e){alert(e.description?e.description:e.toString())}})()%22)))';"
onclick="
	var plugins=window.store.getTaggedTiddlers('systemConfig','title');
	var out='|Title|Date|Size|Author|Version|~CoreVersion|h\n|sortable|k\n';
	out+=plugins.map(function(t) {
		return '|'+'[['+t.title+']]'
		+'|'+t.modified.formatString('YYYY.0MM.0DD')
		+'|'+t.text.length
		+'|'+store.getTiddlerSlice(t.title,'Author')
		+'|'+store.getTiddlerSlice(t.title,'Version')
		+'|'+store.getTiddlerSlice(t.title,'CoreVersion')+'|';
	}).join('\n');
	config.shadowTiddlers.PluginInfo=out;
	story.displayTiddler(null,'PluginInfo');"
>$1</a></html>
!end
%/<<tiddler {{var src='ShowPlugins'; src+(tiddler&&tiddler.title==src?'##info':'##show')}}
	with: {{'$1'=='$'+'1'?'PluginInfo':'$1'}}>>