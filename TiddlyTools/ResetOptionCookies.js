/%
!info
|Name|ResetOptionCookies|
|Source|http://www.TiddlyTools.com/#ResetOptionCookies|
|Version|2.0.0|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.1|
|Type|transclusion|
|Description|Reset all TiddlyWiki option cookies (with confirmation)|
Usage
<<<
{{{
<<tiddler ResetOptionCookies>>
<<tiddler ResetOptionCookies with: label>>
}}}
<<<
Example
<<<
{{{<<tiddler ResetOptionCookies with: "reset cookies">>}}}
<<tiddler ResetOptionCookies##show with: "reset cookies">>
<<<
!end
!show
<html><nowiki><a href="javascript:;" title="$2"
onmouseover="
	this.href='javascript:void(eval(decodeURIComponent(%22(function(){try{('
	+encodeURIComponent(encodeURIComponent(this.onclick))
	+')()}catch(e){alert(e.description?e.description:e.toString())}})()%22)))';"
onclick="
	// if removeCookie() function is not defined by TW core, define it here.
	if (window.removeCookie===undefined) {
		window.removeCookie=function(name) {
			document.cookie = name+'=; expires=Thu, 01-Jan-1970 00:00:01 UTC; path=/;'; 
		}
	}
	var opts=new Array(); var p=document.cookie.split('; ');
	for (var i=0;i<p.length;i++){
		var c=p[i]; var v=''; var pos=p[i].indexOf('=');
		if (pos!=-1) { c=p[i].substr(0,pos); v=unescape(p[i].slice(pos+1)); }
		if (config.options[c]!==undefined) opts.push(c);
	} opts.sort();
	var msg='There are '+opts.length+' option cookies:\n\n'+opts.join(', ');
	msg+='\n\nPress OK to proceed, or press CANCEL to keep options unchanged';
	if (!confirm(msg)) return false;
	var msg='OK: reset all options at once, CANCEL: confirm each option, one at a time';
	var quiet=confirm(msg);
	for (var i=0;i<opts.length;i++)
		if (quiet || confirm('Press OK to reset option: '+opts[i])) 
			removeCookie(opts[i]);
 	return false;
">$1</a></html>
!end
%/<<tiddler {{var src='ResetOptionCookies'; src+(tiddler&&tiddler.title==src?'##info':'##show')}}
with:	{{'$1'!='$'+'1'?'$1':'&lowast; - Reset all cookie options...'}}
	{{'$2'!='$'+'2'?'$2':'Clear all TiddlyWiki options stored in browser cookies (w/confirmation)'}}
>>