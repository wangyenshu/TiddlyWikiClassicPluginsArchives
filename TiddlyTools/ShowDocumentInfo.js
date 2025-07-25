/%
!info
|Name|ShowDocumentInfo|
|Source|http://www.TiddlyTools.com/#ShowDocumentInfo|
|Version|2.0.0|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.1|
|Type|transclusion|
|Description|show TiddlyWiki version, document timestamp, and plugin info|
Usage
<<<
{{{
<<tiddler ShowDocumentInfo>>
<<tiddler ShowDocumentInfo with: label>>
}}}
<<<
Example
<<<
{{{<<tiddler ShowDocumentInfo with: "info">>}}}
<<tiddler ShowDocumentInfo##show with: "info">>
<<<
<<tiddler ShowDocumentInfo##code with: {{store.getTiddlerText('ShowDocumentInfo##show')}}>>
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
<html><nowiki><a href="javascript:;" title="Show TiddlyWiki version, filedate and tiddler summary"
onmouseover="
	this.href='javascript:void(eval(decodeURIComponent(%22(function(){try{('
	+encodeURIComponent(encodeURIComponent(this.onclick))
	+')()}catch(e){alert(e.description?e.description:e.toString())}})()%22)))';"
onclick="
	if(typeof version==undefined||version.title!='TiddlyWiki')
		{alert(document.location.href+'\n\nis not a TiddlyWiki document');return false;}
	var ver=version.major+'.'+version.minor+'.'+version.revision;
	var tids=window.store.getTiddlers('modified').reverse();
	var plugins=window.store.getTaggedTiddlers('systemConfig','modified').reverse();
	var msg='TiddlyWiki version: '+ver
		+'\nDocument modified: '+document.lastModified
		+'\nLast tiddler changed: '+tids[0].title
		+'\n\nThere are a total of '+tids.length+' tiddlers,'
		+' including '+plugins.length+' plugins:\n\n';
	var fmt='YYYY.0MM.0DD 0hh:0mm:0ss'
	msg+=plugins.map(function(t){return t.modified.formatString(fmt)+' | '+t.title;}).join('\n');
	alert(msg);
 	return false;
">$1</a></html>
!end
%/<<tiddler {{var src='ShowDocumentInfo'; src+(tiddler&&tiddler.title==src?'##info':'##show')}}
	with: {{'$1'!='$'+'1'?'$1':'[i] - Show TiddlyWiki document info...'}}>>