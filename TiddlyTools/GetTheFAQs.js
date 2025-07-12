/%
!info
|Name|GetTheFAQs|
|Source|http://www.TiddlyTools.com/#GetTheFAQs|
|Version|2.0.0|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.1|
|Type|transclusion |
|Requires|LoadTiddlersPlugin, FAQViewerPlugin|
|Description|autoload FAQ articles from external document|
Usage
<<<
{{{
<<tiddler GetTheFAQs>>
<<tiddler GetTheFAQs with: location tag tiddlername>>
}}}
*''location'' (optional)<br>is a URL, a relative path/file, or a TiddlerName that refers to a TiddlyWiki document. If omitted (use {{{[[]]}}} as a placeholder), the contents of [[SiteFAQ]] (if any) will be used.  If [[SiteFAQ]] doesnt exist, a default of 'faq.html' will be used.
*''tag'' (optional)<br>indicates the tag to match when retrieving tiddlers (default="faq").
*''tiddlername'' (optional)<br>specifies a desired 'target' tiddler title (default=none).
Tiddlers are loaded only if the specified target tiddler or tag value is not present in the current document.  If suitable tiddlers are already present, the [[FAQViewer]] is automatically displayed.
<<<
Example
<<<
{{{<<tiddler GetTheFAQs>>}}}
{{smallform{<<tiddler GetTheFAQs##show>>}}}
<<<
!end

!notloaded
//There are no ''%0'' tiddlers currently loaded.//
''Please <html><nowiki><a href="javascript:;" onclick="
	var here=story.findContainingTiddler(this);
	if (here) story.refreshTiddler(here.getAttribute('tiddler'),null,true);
	return false;
">refresh this tiddler</a></html> to import the %0 archive...''
//To view the archive directly, please visit://
{{indent{[[%1|%1]]}}}
!end

!show
<<tiddler {{
	var out='';
	var src='$1'!='$'+'1'?'$1':'';
	var tag='$2'!='$'+'2'?'$2':'faq';
	var target='$3'!='$'+'3'?'$3':'';
	var defaultsrc	='faq.html';
	var askmsg	="Enter the location of a TiddlyWiki document containing '%0' tiddlers";
	var confirmmsg	="Press OK to import '%0' tiddlers from:";
	var loadingmsg	="'%0' tiddlers are being imported... please wait...";

	// if target or tagged tiddlers already exists, just show the viewer
	if (store.tiddlerExists(target)||store.getTaggedTiddlers(tag,'excludeLists').length)
		out='<<faqViewer %0 %2 outline -modified [[YYYY.0MM.0DD - ]]>\>';
	else {
		src=store.getTiddlerText(src,src); // get src from tiddler (if any)
		if (!src.length) // fallback: use [[SiteFAQ]] or default (faq.html)
			src=store.getTiddlerText('SiteFAQ',defaultsrc);
		var s=prompt(confirmmsg.format([tag]),src); // ask for permission (or change src)
		if (!s||!s.length) // cancelled
			out=store.getTiddlerText('GetTheFAQs##notloaded');
		else {
			src=store.getTiddlerText(s,s); // get src from tiddler (if any)
			// show 'please wait' message if remote async load
			var async=document.location.protocol!='file:'||src.substr(0,4)=='http'; 
			if (async) setTimeout('displayMessage("'+loadingmsg.format([tag])+'")',1);
			out='<<loadTiddlers [[tag:%0]] [[%1]] quiet nodirty noreport temporary>\>';
		}
	}
	wikify(out.format([tag,src,target.length?'startwith:'+target:'']),place);
'';}}>>
!end
%/<<tiddler {{var src='GetTheFAQs'; src+(tiddler&&tiddler.title==src?'##info':'##show')}}
	with: [[$1]] [[$2]] [[$3]]>>