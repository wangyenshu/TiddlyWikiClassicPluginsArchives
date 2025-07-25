/%
!info
|Name|ToggleAnimations|
|Source|http://www.TiddlyTools.com/#ToggleAnimations|
|Version|2.0.0|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.1|
|Type|transclusion|
|Description|enable/disable animation effects|
Usage
<<<
{{{
<<tiddler ToggleAnimations>>
<<tiddler ToggleAnimations with: label>>
}}}
<<<
Example
<<<
{{{<<tiddler ToggleAnimations with: "click me">>}}}
<<tiddler ToggleAnimations##show with: "click me">>
<<<
!end
!show
<html><nowiki><a href="javascript:;" title="enable/disable animation effects"
onmouseover="
	this.href='javascript:void(eval(decodeURIComponent(%22(function(){try{('
	+encodeURIComponent(encodeURIComponent(this.onclick))
	+')()}catch(e){alert(e.description?e.description:e.toString())}})()%22)))';"
onclick="
	var opt='chkAnimate';
	config.macros.option.propagateOption(opt,'checked',!config.options[opt],'input');
	displayMessage('Animation effects are: '+(config.options[opt]?'ON':'OFF'));
	return false;
">$1</a></html>
!end
%/<<tiddler {{var src='ToggleAnimations'; src+(tiddler&&tiddler.title==src?'##info':'##show')}}
	with: {{'$1'=='$'+'1'?'toggle animations':'$1'}}>>