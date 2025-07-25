/%
!info
|Name|SetStoryHeight|
|Source|http://www.TiddlyTools.com/#SetStoryHeight|
|Version|2.0.1|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.1|
|Type|transclusion|
|Description|set a scrolling, fixed or percentage height for the central story|
Usage
<<<
{{{
<<tiddler SetStoryHeight>>
}}}
Try it:
<<tiddler SetStoryHeight##show>>
<<<
!end

!show
<<tiddler {{
	if (config.options.txtStoryHeight===undefined)
		config.options.txtStoryHeight='auto';
'';}}>>story height: {{smallform{<<option txtStoryHeight>><<tiddler {{
	var t=place.lastChild;
	t.style.width='4em'; t.style.textAlign='center';
	t.title='enter height using CSS px, em, in, cm, % or auto';
	t.onfocus=function(){this.select();};
	t.onblur=function(){this.onchange();};
	if (!t.coreOnChange) t.coreOnChange=t.onchange;
	t.onchange=function() { // hijack: update CSS when field changes
		if (this.coreOnChange) this.coreOnChange();
		window.setStoryHeight();
	};
	window.setStoryHeight=function() {
		var opt='txtStoryHeight';
		var h=config.options[opt]; if (!h.length) h='auto';
		if (!h.replace(/[0-9]*/,'').length) h+='px';
		config.macros.option.propagateOption(opt,'value',h,'input');
		if (h=='auto') removeCookie(opt);
		var top=findPosY(document.getElementById('tiddlerDisplay'));
		if (h.indexOf('%')!=-1)
			h=((findWindowHeight()-top)*parseInt(h.replace(/[%]/,''))/100)+'px';
		var heightParam=(config.browser.isIE?'height':'max-height')+':'+h;
		var overflowParam='overflow:'+(h!='auto'?'auto':'visible')+' !important'; 
		var css='#tiddlerDisplay { '+heightParam+'; '+overflowParam+'; }';
		setStylesheet(css,'storyHeightStyles');
	};
	if (window.addEventListener) // so % height can auto-adjust if window is resized
		window.addEventListener('resize',window.setStoryHeight,false);
	if (window.removeCookie===undefined) { // if not already defined by TW core...
		window.removeCookie=function(name) {
			document.cookie = name+'=; expires=Thu, 01-Jan-1970 00:00:01 UTC; path=/;'; 
		};
	}
'';}}>>
!end

%/<<tiddler {{var src='SetStoryHeight'; src+(tiddler&&tiddler.title==src?'##info':'##show');}}>>