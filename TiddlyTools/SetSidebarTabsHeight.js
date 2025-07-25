/%
!info
|Name|SetSidebarTabsHeight|
|Source|http://www.TiddlyTools.com/#SetSidebarTabsHeight|
|Version|2.0.1|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.1|
|Type|transclusion|
|Description|use CSS to set a fixed, scrolling or percentage height for the sidebar tabs area|
Usage
<<<
{{{
<<tiddler SetSidebarTabsHeight>>
}}}
Try it:
<<tiddler SetSidebarTabsHeight##show>>
<<<
!end

!show
<<tiddler {{
	if (config.options.txtSidebarTabsHeight===undefined)
		config.options.txtSidebarTabsHeight='auto';
'';}}>>tabs height: {{smallform{<<option txtSidebarTabsHeight>><<tiddler {{
	var t=place.lastChild;
	t.style.width='4em'; t.style.textAlign='center';
	t.title='enter height using px, em, in, cm, %, or auto';
	t.onfocus=function(){this.select();};
	t.onblur=function(){this.onchange();}; /* for IE */
	if (!t.coreOnChange) t.coreOnChange=t.onchange;
	t.onchange=function() { // hijack: update CSS when field changes
		if (this.coreOnChange) this.coreOnChange();
		window.setSidebarTabsHeight();
	};
	window.setSidebarTabsHeight=function() {
		var opt='txtSidebarTabsHeight';
		var h=config.options[opt]; if (!h.length) h='auto';
		if (!h.replace(/[0-9]*/,'').length) h+='px';
		config.macros.option.propagateOption(opt,'value',h,'input');
		if (config.options[opt]=='auto') removeCookie(opt);
		var top=findPosY(document.getElementById("sidebarTabs"));
		if (h.indexOf('%')!=-1)
			h=((findWindowHeight()-top)*parseInt(h.replace(/[%]/,''))/100)+'px';
		var heightParam=(config.browser.isIE?"height":"max-height")+":"+h;
		var overflowParam='overflow:'+(h!='auto'?'auto':'hidden')+' !important'; 
		var css='#sidebarTabs { '+heightParam+'; '+overflowParam+'; }';
		setStylesheet(css,"sidebarTabsStyles");
	};
	if (window.addEventListener) // so % height can auto-adjust if window is resized
		window.addEventListener('resize',window.setSidebarTabsHeight,false);
	if (window.removeCookie===undefined) { // if not already defined by TW core...
		window.removeCookie=function(name) {
			document.cookie = name+'=; expires=Thu, 01-Jan-1970 00:00:01 UTC; path=/;'; 
		};
	}
	window.setSidebarTabsHeight(); // apply CSS during startup
'';}}>>}}}
!end

%/<<tiddler {{var src='SetSidebarTabsHeight'; src+(tiddler&&tiddler.title==src?'##info':'##show');}}>>