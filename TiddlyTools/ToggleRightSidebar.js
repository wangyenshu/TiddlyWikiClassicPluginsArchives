/%
!info
|Name|ToggleRightSidebar|
|Source|http://www.TiddlyTools.com/#ToggleRightSidebar|
|Version|2.0.0|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.1|
|Type|transclusion|
|Description|show/hide right sidebar (SideBarOptions)|
Usage
<<<
{{{
<<tiddler ToggleRightSidebar>>
<<tiddler ToggleRightSidebar with: label tooltip>>
}}}
Try it: <<tiddler ToggleRightSidebar##show
	with: {{config.options.chkShowRightSidebar?'►':'◄'}}>>
<<<
Configuration:
<<<
copy/paste the following settings into a tiddler tagged with <<tag systemConfig>> and then modify the values to suit your preferences:
{{{
config.options.chkShowRightSidebar=true;
config.options.txtToggleRightSideBarLabelShow="◄";
config.options.txtToggleRightSideBarLabelHide="►";
}}}
<<<
!end
!show
<<tiddler {{
	var co=config.options;
	if (co.chkShowRightSidebar===undefined) co.chkShowRightSidebar=true;
	var sb=document.getElementById('sidebar');
	var da=document.getElementById('displayArea');
	if (sb) {
		sb.style.display=co.chkShowRightSidebar?'block':'none';
		da.style.marginRight=co.chkShowRightSidebar?'':'1em';
	}
'';}}>><html><nowiki><a href='javascript:;' title="$2"
onmouseover="
	this.href='javascript:void(eval(decodeURIComponent(%22(function(){try{('
	+encodeURIComponent(encodeURIComponent(this.onclick))
	+')()}catch(e){alert(e.description?e.description:e.toString())}})()%22)))';"
onclick="
	var co=config.options;
	var opt='chkShowRightSidebar';
	var show=co[opt]=!co[opt];
	var sb=document.getElementById('sidebar');
	var da=document.getElementById('displayArea');
	if (sb) {
		sb.style.display=show?'block':'none';
		da.style.marginRight=show?'':'1em';
	}
	saveOptionCookie(opt);
	var labelShow=co.txtToggleRightSideBarLabelShow||'&#x25C4;';
	var labelHide=co.txtToggleRightSideBarLabelHide||'&#x25BA;';
	if (this.innerHTML==labelShow||this.innerHTML==labelHide) 
		this.innerHTML=show?labelHide:labelShow;
	this.title=(show?'hide':'show')+' right sidebar';
	var sm=document.getElementById('storyMenu');
	if (sm) config.refreshers.content(sm);
	return false;
">$1</a></html>
!end
%/<<tiddler {{
	var src='ToggleRightSidebar';
	src+(tiddler&&tiddler.title==src?'##info':'##show');
}} with: {{
	var co=config.options;
	var labelShow=co.txtToggleRightSideBarLabelShow||'&#x25C4;';
	var labelHide=co.txtToggleRightSideBarLabelHide||'&#x25BA;';
	'$1'!='$'+'1'?'$1':(co.chkShowRightSidebar?labelHide:labelShow);
}} {{
	var tip=(config.options.chkShowRightSidebar?'hide':'show')+' right sidebar';
	'$2'!='$'+'2'?'$2':tip;
}}>>