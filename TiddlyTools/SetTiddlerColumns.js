/%
!info
|Name|SetTiddlerColumns|
|Source|http://www.TiddlyTools.com/#SetTiddlerColumns|
|Version|2.0.1|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.1|
|Type|transclusion|
|Description|use CSS3 '-moz-column-count' to set single or multi-column tiddler layout|
Usage
<<<
{{{
<<tiddler SetTiddlerColumns>>
}}}
*note: '-moz-column-count' not available in InternetExplorer
Try it:
<<tiddler SetTiddlerColumns##show>>
<<<
!end

!show
<<tiddler {{
	if (config.options.txtTiddlerColumns===undefined)
		config.options.txtTiddlerColumns='1';
'';}}>>tiddler columns: {{smallform{<<option txtTiddlerColumns>><<tiddler {{
	var t=place.lastChild;
	t.style.width='4em'; t.style.textAlign='center';
	t.title='enter number of columns';
	t.onfocus=function(){this.select();};
	t.onblur=function(){this.onchange();}; /* for IE */
	if (!t.coreOnChange) t.coreOnChange=t.onchange;
	t.onchange=function() { // hijack: update CSS when field changes
		if (this.coreOnChange) this.coreOnChange();
		window.setTiddlerColumns();
	};
	window.setTiddlerColumns=function() {
		var opt='txtTiddlerColumns';
		var cols=config.options[opt]||''; if (!cols.length) cols='1';
		config.macros.option.propagateOption(opt,'value',cols,'input');
		if (cols=='1') removeCookie(opt);
		if (!config.browser.isIE)
			document.getElementById('tiddlerDisplay').style.MozColumnCount=cols;
	}
	if (window.removeCookie===undefined) { // if not already defined by TW core...
		window.removeCookie=function(name) {
			document.cookie = name+'=; expires=Thu, 01-Jan-1970 00:00:01 UTC; path=/;'; 
		}
	}
	window.setTiddlerColumns(); // apply CSS during startup

'';}}>>
!end

%/<<tiddler {{var src='SetTiddlerColumns'; src+(tiddler&&tiddler.title==src?'##info':'##show');}}>>