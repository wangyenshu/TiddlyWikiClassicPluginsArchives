/%
!info
|Name|ToggleTiddlerTags|
|Source|http://www.TiddlyTools.com/#ToggleTiddlerTags|
|Version|2.0.0|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.1|
|Type|transclusion|
|Description|command link to show/hide tiddler tags display in all tiddlers at once|
Usage:
<<<
in tiddler content:
{{{
<<tiddler ToggleTiddlerTags>>
<<tiddler ToggleTiddlerTags with: label>>
}}}
or, in ViewTemplate:
{{{
<span class='toolbar' macro='tiddler ToggleTiddlerTags'></span>
	OR, if TiddlyTools' CoreTweaks for ticket #610 is installed:
<span class='toolbar' macro='toolbar ... ToggleTiddlerTags...'></span>
}}}
or, in ToolbarCommands (with CoreTweaks #610 installed):
{{{
| ViewToolbar| ... ToggleTiddlerTags... |
| EditToolbar| ... ToggleTiddlerTags... |
}}}
<<<
!end

!show
<html><nowiki><a href='javascript:;' title='show/hide tiddler tags' onclick="
	config.options.chkHideTiddlerTags=!config.options.chkHideTiddlerTags;
	var show=config.options.chkHideTiddlerTags?'none':'block';
	setStylesheet('.tiddler .tagged { display:'+show+'; }','toggleTiddlerTags');
">$1</a></html>
!end
%/<<tiddler {{'ToggleTiddlerTags##'+(tiddler&&tiddler.title=='ToggleTiddlerTags'?'info':'show')}}
	with: {{"$1"=='$'+'1'?'tags':"$1"}}>>