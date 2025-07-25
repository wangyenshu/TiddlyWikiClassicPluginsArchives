/%
!info
|Name|BookmarkList|
|Source|http://www.TiddlyTools.com/#BookmarkList|
|Version|2.0.0|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|Type|transclusion|
|Description|generate ~HR-separated list of tiddlers tagged with bookmark for use with MiniBrowser|
Usage
<<<
{{{
<<tiddler BookmarkList>>
<<miniBrowser BookmarkList>>
}}}
@@display:block;height:15em;overflow:auto;<<tiddler BookmarkList##show>>@@
<<<
!end

!out
$1
!end

!show
<<tiddler BookmarkList##out with: {{
	var out=["TiddlyWiki Servers\n"];
	var tids=store.getTaggedTiddlers("bookmark");
	for (var i=0; i<tids.length; i++) {
		var t=tids[i].title;
		var d=store.getTiddlerSlice(t,"Description");
		var u=store.getTiddlerSlice(t,"URL")
		out.push("[[%0]] - %1\n%2".format([t,d,u]));
	}
	out.join("\n----\n");
}}>>
!end

%/<<tiddler {{var src='BookmarkList'; src+(tiddler&&tiddler.title==src?'##info':'##show');}}>>