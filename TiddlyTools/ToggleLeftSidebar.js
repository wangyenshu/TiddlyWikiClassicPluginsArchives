/%
!info
|Name|ToggleLeftSidebar|
|Source|http://www.TiddlyTools.com/#ToggleLeftSidebar|
|Version|2.0.0|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.1|
|Type|transclusion|
|Description|show/hide left sidebar (MainMenu)|
Usage
<<<
{{{
<<tiddler ToggleLeftSidebar>>
<<tiddler ToggleLeftSidebar with: label tooltip>>
}}}
Try it: <<tiddler ToggleLeftSidebar##show
	with: {{config.options.chkShowLeftSidebar?'◄':'►'}}>>
<<<
Configuration:
<<<
{{{
config.options.chkShowLeftSidebar (true)
config.options.txtToggleLeftSideBarLabelShow (►)
config.options.txtToggleLeftSideBarLabelHide (◄)
}}}
<<<
!end
!show
<<tiddler {{
	var co=config.options;
	if (co.chkShowLeftSidebar===undefined) co.chkShowLeftSidebar=true;
	var mm=document.getElementById('mainMenu');
	var da=document.getElementById('displayArea');
	if (mm) {
		mm.style.display=co.chkShowLeftSidebar?'block':'none';
		da.style.marginLeft=co.chkShowLeftSidebar?'':'1em';
	}
'';}}>><html><nowiki><a href='javascript:;' title="$2"
onmouseover="
	this.href='javascript:void(eval(decodeURIComponent(%22(function(){try{('
	+encodeURIComponent(encodeURIComponent(this.onclick))
	+')()}catch(e){alert(e.description?e.description:e.toString())}})()%22)))';"
onclick="
	var co=config.options;
	var opt='chkShowLeftSidebar';
	var show=co[opt]=!co[opt];
	var mm=document.getElementById('mainMenu');
	var da=document.getElementById('displayArea');
	if (mm) {
		mm.style.display=show?'block':'none';
		da.style.marginLeft=show?'':'1em';
	}
	saveOptionCookie(opt);
	var labelShow=co.txtToggleLeftSideBarLabelShow||'&#x25BA;';
	var labelHide=co.txtToggleLeftSideBarLabelHide||'&#x25C4;';
	if (this.innerHTML==labelShow||this.innerHTML==labelHide) 
		this.innerHTML=show?labelHide:labelShow;
	this.title=(show?'hide':'show')+' left sidebar';
	var sm=document.getElementById('storyMenu');
	if (sm) config.refreshers.content(sm);
	return false;
">$1</a></html>
!end
%/<<tiddler {{
	var src='ToggleLeftSidebar';
	src+(tiddler&&tiddler.title==src?'##info':'##show');
}} with: {{
	var co=config.options;
	var labelShow=co.txtToggleLeftSideBarLabelShow||'&#x25BA;';
	var labelHide=co.txtToggleLeftSideBarLabelHide||'&#x25C4;';
	'$1'!='$'+'1'?'$1':(co.chkShowLeftSidebar?labelHide:labelShow);
}} {{
	var tip=(config.options.chkShowLeftSidebar?'hide':'show')+' left sidebar';
	'$2'!='$'+'2'?'$2':tip;
}}>>