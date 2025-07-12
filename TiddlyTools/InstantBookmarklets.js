/%
|Name|InstantBookmarklets|
|Source|http://www.TiddlyTools.com/#InstantBookmarklets|
|Version|2.0.0|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.1|
|Type|transclusion bookmarklet|
|Description|instantly create bookmarklets by dragging onclick links to the browser toolbar|

!help
To create a bookmarklet, simply drag-and-drop any command link below directly onto your browser's toolbar or right-click and use 'bookmark this link' (or 'add to favorites') to add the bookmarklet to your browser's bookmarks menu.

Once installed, you can use the bookmarklet with ANY TiddlyWiki document, even if the command script (and InlineJavascriptPlugin) has not been installed in that document!
!end

%/{{nowrap{
__[[InstantBookmarklets:|InstantBookmarklets]]__{{fine{
&nbsp; //drag these links to your browser toolbar!// <html><nowiki><a href='javascript:;' onclick="alert(store.getTiddlerText('InstantBookmarklets##help')); return false;">(help...)</a></html>}}}
//~TiddlyWiklets: {{fine{(TiddlyWiki "tear-off" utilities)}}}///%

========================== TOGGLE SITE TITLES %/
*<html><nowiki><a href="javascript:;"  title="show/hide SiteTitle and SiteSubtitle (header) content"
onmouseover="
	this.href='javascript:void(eval(decodeURIComponent(%22(function(){try{('
	+encodeURIComponent(encodeURIComponent(this.onclick))
	+')()}catch(e){alert(e.description?e.description:e.toString())}})()%22)))';"
onclick="
	var c=document.getElementById('contentWrapper');  if (!c) return;
	for (var i=0; i<c.childNodes.length; i++)
		if (hasClass(c.childNodes[i],'header')) { var h=c.childNodes[i]; break; }
	if (!h) return;
	config.options.chkHideSiteTitles=h.style.display!='none';
	h.style.display=config.options.chkHideSiteTitles?'none':'block';
	saveOptionCookie('chkHideSiteTitles');
	return false;
">&#x25b2; - Toggle site titles</a></html>/%

========================== TOGGLE LEFT SIDEBAR %/
*<<tiddler ToggleLeftSidebar with: "&#x25c4; - Toggle left sidebar">>/%

========================== TOGGLE RIGHT SIDEBAR %/
*<<tiddler ToggleRightSidebar with: "&#x25ba; - Toggle right sidebar">>/%

========================== TOGGLE ANIMATION EFFECTS %/
*<<tiddler ToggleAnimations with: "&infin; - Toggle animation effects">>/%

========================== TOGGLE "FULLSCREEN" (SIDEBARS AND TITLES) %/
*<<tiddler ToggleFullScreen with: "&loz; - Toggle fullscreen ON" "&loz; - Toggle fullscreen OFF">>/%

========================== TOGGLE TIDDLER TITLES (and SUBTITLES) %/
*<<tiddler ToggleTiddlerTitles with: "T - Toggle tiddler titles">>/%

========================== TOGGLE TIDDLER TAGS %/
*<<tiddler ToggleTiddlerTags with: "# - Toggle tiddler tags">>/%

========================== RESTART WITHOUT RELOADING %/
*<html><nowiki><a href="javascript:;"  title="Restart initial page content WITHOUT RELOADING!"
onmouseover="
	this.href='javascript:void(eval(decodeURIComponent(%22(function(){try{('
	+encodeURIComponent(encodeURIComponent(this.onclick))
	+')()}catch(e){alert(e.description?e.description:e.toString())}})()%22)))';"
onclick="
	story.closeAllTiddlers(); restart(); refreshPageTemplate(); 
 	return false;
">&#x2302; - Home</a></html>/%

========================== REFRESH WITHOUT RESTARTING %/
*<<tiddler RefreshPageDisplay with: "&asymp; - Refresh current display">>/%

========================== SHOW CURRENT VERSION, TIMESTAMP, and TIDDLER INFO %/
*<<tiddler ShowDocumentInfo>>/%

========================== RESET TIDDLYWIKI OPTION COOKIES (WITH CONFIRM) %/
*<<tiddler ResetOptionCookies>>/%

========================== CLEAR CHANGE COUNTERS %/
*<<tiddler ResetChangeCounters>>/%

========================== SAVE FROM CLIPBOARD ("rescue storeArea") %/
*<<tiddler SaveToClipboard with: "&sum; - Save current storeArea contents to clipboard">>/%

========================== LOAD REMOTE PLUGINS...%/
[[Load remote plugins|LoadRemotePlugin]]: {{fine{(//load on demand//)}}}
<<tiddler LoadRemotePlugin##Examples>>/%

}}}/%  END NOWRAP %/