/%
!info
|Name|SaveToClipboard|
|Source|http://www.TiddlyTools.com/#SaveToClipboard|
|Version|1.3.0|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.1|
|Type|transclusion, bookmarklet|
|Description|save current document to clipboard|
|Browsers|FireFox, IE, Safari, Chrome, Opera (fallback)|
Usage
<<<
{{{
<<tiddler SaveToClipboard>>
<<tiddler SaveToClipboard with: label>>
}}}
Some browsers lack direct file I/O functions and/or do not currently support use of the [[tiddlysaver.jar|http://www.tiddlywiki.com/#TiddlySaver]] Java extension, preventing use of the normal <<saveChanges>> command to update the stored document.  As a workaround, the <<tiddler SaveToClipboard##show with: "save to clipboard">> command ''copies the source for the current document, including all tiddler changes, directly to the system clipboard'', so you can paste the clipboard contents into a new, empty file (using a text editor), save it to your local filesystem with an '.html' extension, and then open it in your browser to continue working locally.  

To construct the new file content, the previously saved file is first read in, and then merged with the current set of tiddlers (including all new/revised content).  If the saved file is not available (e.g., it was renamed/deleted after it was opened, or it is stored on a remote server that is not currently accessible), only the TiddlyWiki 'storeArea' is output to the clipboard (i.e., TiddlyWiki "~PureStore" format).  Tiddlers saved in PureStore-formatted files can be imported into an empty TiddlyWiki document using the ''backstage>import'' feature (or TiddlyTools' [[ImportTiddlersPlugin|http://www.TiddlyTools.com#ImportTiddlersPlugin]]).  You can [[obtain an empty TiddlyWiki document from http://www.TiddlyWiki.com|http://www.TiddlyWiki.com/empty.html]].

Note: some browsers do not permit program-controlled access to the system clipboard.  In this case, the clipboard output is instead ''displayed as plain text in a new browser tab/window'', so you can manually select and copy that text to the clipboard before pasting it to a new, empty file as described above.
<<<
Example
<<<
{{{<<tiddler SaveToClipboard with: "save to clipboard">>}}}
<<tiddler SaveToClipboard##show with: "save to clipboard">>
^^Note: drag this command link to your browser toolbar to create an [[InstantBookmarklet|InstantBookmarklets]]^^
<<<
<<tiddler SaveToClipboard##code with: {{store.getTiddlerText('SaveToClipboard##show')}}>>
!end
!code
Code
<<<
{{{
$1
}}}
<<<
!end
!show
<html><nowiki><a href="javascript:;" title="save current document to clipboard"
onmouseover="
	this.href='javascript:void(eval(decodeURIComponent(%22(function(){try{('
	+encodeURIComponent(encodeURIComponent(this.onclick))
	+')()}catch(e){alert(e.description?e.description:e.toString())}})()%22)))';"
onclick="
	if(typeof version==undefined||version.title!='TiddlyWiki')
		{alert(document.location.href+'\n\nis not a TiddlyWiki document');return false;}

	window.saveToClipboard=function(success,params,txt,url,xhr) {
		function copy(out) {
			if(window.Components) { // FIREFOX
				netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
				var id='@mozilla.org/widget/clipboardhelper;1';
				var clip=Components.classes[id].getService(Components.interfaces.nsIClipboardHelper);
				clip.copyString(out);
			} else if(window.clipboardData) { // IE
				window.clipboardData.setData('text',out);
			} else if(document.execCommand) { // CHROME, SAFARI, IE6
				var ta=document.createElement('textarea');
				ta.style.position='absolute';
				ta.style.left='-100%';
				document.body.appendChild(ta);
				ta.value=out; ta.select();
				document.execCommand('Copy',false,null);
				document.body.removeChild(ta);
			} else throw('cannot access clipboard');
		}
		var pos=locateStoreArea(txt||'');
		if(success&&pos) {
			displayMessage(txt.length+' bytes read, adding new/revised tiddlers...');
			var out=updateOriginal(txt,pos,url);
		} else {
			if (!confirm('cannot load source file.\ncopy tiddler \x22store area\x22 only?')) return;
			var pre='<!--POST-SHADOWAREA-->\n<div id=\x22storeArea\x22>\n';
			var post='</div>/n<!--POST-STOREAREA-->\n';
			var out=pre+store.allTiddlersAsHtml()+post;
		}
		var msg=out.length+' bytes copied to ';
		try	 { copy(out); msg+='clipboard'; }
		catch(e) { // FALLBACK
			alert('Sorry, direct clipboard access is not currently available.\n\n'
				+'The output will be displayed in another browser tab/window.\n'
				+'Select the entire text there and copy/paste into a local file');
			var t='<html><body><pre>'+out.htmlEncode()+'</pre></body></'+'html>';
			var w=window.open(); var d=w.document; d.open(); d.write(t); d.close();
			msg+='another tab/window';
		}
		displayMessage(msg);
	}
	var url=document.location.href;
	clearMessage(); displayMessage('loading TiddlyWiki code from'); displayMessage(url);
	if (document.location.protocol!='file:') loadRemoteFile(url, window.saveToClipboard);
	else window.saveToClipboard(true,null,loadOriginal(getLocalPath(url)),url,null);
 	return false;
">$1</a></html>
!end
%/<<tiddler {{var src='SaveToClipboard'; src+(tiddler&&tiddler.title==src?'##info':'##show')}}
	with: {{'$1'!='$'+'1'?'$1':'[+] - copy entire document to clipboard'}}>>