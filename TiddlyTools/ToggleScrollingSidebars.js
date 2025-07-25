/%
!info
|Name|ToggleScrollingSidebars|
|Source|http://www.TiddlyTools.com/#ToggleScrollingSidebars|
|Version|2.0.0|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.1|
|Type|transclusion|
|Description|enable/disable 'fixed' positioning of left and right sidebars|
Usage
<<<
{{{
<<tiddler ToggleScrollingSidebars>>
<<tiddler ToggleScrollingSidebars with: label tip>>
}}}
<<<
Example
<<<
{{{<<tiddler ToggleScrollingSidebars>>}}}
<<tiddler ToggleScrollingSidebars##show with: "sidebars scroll with page">>
<<<
!end
!show
<<tiddler {{
	if (config.options.chkScrollSidebars==undefined)
		config.options.chkScrollSidebars=true;
	if (!config.options.txtOuterTabHeight||!config.options.txtOuterTabHeight.length)
		config.options.txtOuterTabHeight="25em";
	if (!config.options.txtInnerTabHeight||!config.options.txtInnerTabHeight.length)
		config.options.txtInnerTabHeight="21em";
	window.ToggleScrollingSidebars_setscroll = function() {
		var co=config.options;
		var scroll=co.chkScrollSidebars?'':'fixed';
		document.getElementById('mainMenu').style.position=scroll;
		document.getElementById('sidebar').style.position=scroll;
		var outer=co.chkScrollSidebars?'auto':co.txtOuterTabHeight;
		var inner=co.chkScrollSidebars?'auto':co.txtInnerTabHeight;
		var css= '#sidebarTabs .tabContents {height:%0;overflow:%1;width:92.5%;}'
			+'#sidebarTabs .tabContents .tabContents {height:%2 !important;}';
		css=css.format([outer,outer!='auto'?'auto':'visible',inner]);
		setStylesheet(css,'shortSidebarTabs');
	}
'';}}>><<option chkScrollSidebars>><<tiddler {{
	var chk=place.lastChild;
	if (!chk.coreOnChange) { // only once
		chk.coreOnChange=chk.onchange;
		chk.onchange=function() {
			if (this.coreOnChange) this.coreOnChange.apply(this,arguments);
			this.checked=config.options.chkScrollSidebars;
			window.ToggleScrollingSidebars_setscroll();
		};
	}
	window.ToggleScrollingSidebars_setscroll();
'';}}>> $1
!end

%/<<tiddler {{var src='ToggleScrollingSidebars'; src+(tiddler&&tiddler.title==src?'##info':'##show');}}
with:	{{'$1'!='$'+'1'?'$1':'sidebars scroll with page'}}
	{{'$2'!='$'+'2'?'$2':'sidebars scroll with page'}}>>