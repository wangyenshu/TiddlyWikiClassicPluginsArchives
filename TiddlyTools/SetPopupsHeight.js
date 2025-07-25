/%
!info
|Name|SetPopupsHeight|
|Source|http://www.TiddlyTools.com/#SetPopupsHeight|
|Version|2.0.1|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.1|
|Type|transclusion|
|Description|use CSS to set a scrolling, fixed or percentage height for popups (e.g. tags display)|
Usage
<<<
{{{
<<tiddler SetPopupsHeight>>
}}}
Try it:
<<tiddler SetPopupsHeight##show>>
<<<
!end

!show
<<tiddler {{
	if (config.options.txtPopupsHeight===undefined)
		config.options.txtPopupsHeight='auto';
'';}}>>popup height: {{smallform{<<option txtPopupsHeight>><<tiddler {{
	var t=place.lastChild;
	t.style.width='4em'; t.style.textAlign='center';
	t.title='enter height using px, em, in, cm, %, or auto';
	t.onfocus=function(){this.select();};
	t.onblur=function(){this.onchange();}; /* for IE */
	if (!t.coreOnChange) t.coreOnChange=t.onchange;
	t.onchange=function() { // hijack: update CSS when field changes
		if (this.coreOnChange) this.coreOnChange();
		window.setPopupsHeight();
	};
	window.setPopupsHeight=function() {
		var opt='txtPopupsHeight';
		var h=config.options[opt]; if (!h.length) h='auto';
		if (!h.replace(/[0-9]*/,'').length) h+='px';
		config.macros.option.propagateOption(opt,'value',h,'input');
		if (config.options[opt]=='auto') removeCookie(opt);
		var top=findPosY(document.getElementById('tiddlerDisplay'));
		if (h.indexOf('%')!=-1)
			h=((findWindowHeight()-top)*parseInt(h.replace(/[%]/,''))/100)+'px';
		var heightParam=(config.browser.isIE?'height':'max-height')+':'+h;
		var overflowParam='overflow:'+(h!='auto'?'auto':'visible')+' !important'; 
		var css='.popup { '+heightParam+'; '+overflowParam+'; }';
		setStylesheet(css,'popupStyles');
	};
	if (window.addEventListener) // so % height can auto-adjust if window is resized
		window.addEventListener('resize',window.setPopupsHeight,false);
	if (window.removeCookie===undefined) { // if not already defined by TW core...
		window.removeCookie=function(name) {
			document.cookie = name+'=; expires=Thu, 01-Jan-1970 00:00:01 UTC; path=/;'; 
		};
	}
	window.setPopupsHeight(); // apply CSS during startup


'';}}>>}}}
!end

%/<<tiddler {{var src='SetPopupsHeight'; src+(tiddler&&tiddler.title==src?'##info':'##show');}}>>