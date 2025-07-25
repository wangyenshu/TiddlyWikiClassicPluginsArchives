/%
!info
|Name|ToggleSliders|
|Source|http://www.TiddlyTools.com/#ToggleSliders|
|Version|2.0.0|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.1|
|Type|transclusion|
|Description|toggle (expand/collapse) all sliders in a tiddler (or ID'd DOM element)|
Usage
<<<
{{{
<<tiddler ToggleSliders with: elementID expandlabel collapselabel>>
}}}
*''elementID'' is one of:
**"" (empty quotes) = the current tiddler
**''here'' = the current container
**''ID'' = specific DOM element ID (e.g., "mainMenu")
*''expandlabel/collapselabel'' (optional)<br>are alternative link text to display when sliders are closed (expandlabel) or opened (collapselabel)
<<<
Example
<<<
{{{
<<tiddler ToggleSliders with: "" "open all" "close all">>
}}}
with sample sliders:
{{{
<<slider chkExample ToggleSliders::slider1 Example1 Example1>>
<<slider chkExample ToggleSliders::slider2 Example2 Example2>>
Example1: |This is example slider 1|
Example2: |This is example slider 2|
}}}
<<tiddler ToggleSliders##show with: "" "open all" "close all">>
<<slider chkExample1 ToggleSliders::Example1 Example1 Example1>>
<<slider chkExample2 ToggleSliders::Example2 Example2 Example2>>
<<<
!end

!show
<html><a href="javascript:;" class="TiddlyLink" title="toggle sliders"
onclick="
	if ('$1'=='here') var here=this.parentNode.parentNode.parentNode.parentNode; // container
	else if ('$1'!='$'+'1' && '$1'.length) here=document.getElementById('$1'); // ID
	else var here=story.findContainingTiddler(this); // tiddler
	if (!here) return false;
	var elems=here.getElementsByTagName('*');
	var state=(this.innerHTML.toLowerCase()=='$2')?'none':'block';
	for (var e=0; e<elems.length; e++) { var p=elems[e];
		if (p.className!='sliderPanel' || p.style.display!=state) continue;
		if (p.button) window.onClickNestedSlider({target:p.button}); // see NestedSlidersPlugin
		else p.previousSibling.onclick();
	}
	this.innerHTML=state=='none'?'$3':'$2';
	return false;
">$2</a><nowiki></html>
!end
%/<<tiddler {{ var src='ToggleSliders'; src+(tiddler&&tiddler.title==src?'##info':'##show')}}
	with:	[[$1]]
		{{'$2'!='$'+'2'?'$2':'expand'}}
		{{'$3'!='$'+'3'?'$3':'collapse'}}
		{{'$4'!='$'+'4'?'$4':'toggle sliders'}}
>>