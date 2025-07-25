/%
!info
|Name|ToggleTiddlerTitles|
|Source|http://www.TiddlyTools.com/#ToggleTiddlerTitles|
|Version|2.0.1|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.1|
|Type|transclusion|
|Description|command link to show/hide tiddler title display in all tiddlers at once|
Usage:
<<<
in tiddler content:
{{{
<<tiddler ToggleTiddlerTitles>>
<<tiddler ToggleTiddlerTitles with: label>>
}}}
or, in ViewTemplate:
{{{
<span class='toolbar' macro='tiddler ToggleTiddlerTitles'></span>
	OR, if TiddlyTools' CoreTweaks for ticket #610 is installed:
<span class='toolbar' macro='toolbar ... ToggleTiddlerTitles...'></span>
}}}
or, in ToolbarCommands (with CoreTweaks #610 installed):
{{{
| ViewToolbar| ... ToggleTiddlerTitles... |
| EditToolbar| ... ToggleTiddlerTitles... |
}}}
<<<
!end

!show
<html><nowiki><a href='javascript:;' title='show/hide tiddler titles' onclick="
	config.options.chkHideTiddlerTitles=!config.options.chkHideTiddlerTitles;
	var show=config.options.chkHideTiddlerTitles?'none':'block';
	setStylesheet('.tiddler .title, .tiddler .subtitle { display:'+show+'; }','toggleTiddlerTitles')
">$1</a></html>
!end
%/<<tiddler {{'ToggleTiddlerTitles##'+(tiddler&&tiddler.title=='ToggleTiddlerTitles'?'info':'show')}}
	with: {{"$1"=='$'+'1'?'titles':"$1"}}>>