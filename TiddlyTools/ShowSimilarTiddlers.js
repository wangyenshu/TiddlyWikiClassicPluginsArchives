/%
!info
|Name|ShowSimilarTiddlers|
|Source|http://www.TiddlyTools.com/#ShowSimilarTiddlers|
|Version|2.0.0|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|Type|transclusion|
|Description|list tiddlers, by number of shared tags|
Usage
<<<
{{{
<<tiddler ShowSimilarTiddlers>>
<<tiddler ShowSimilarTiddlers with: TiddlerName limit>>
}}}
*''~TiddlerName'' (optional)<br>title of the tiddler whose tags are to be matched (default=current tiddler)
*''limit'' (optional)<br>only report tiddlers if they have //at least// the indicated number of tags in common (default=1)
<<<
Example
<<<
{{{<<tiddler ShowSimilarTiddlers>>}}}
<<tiddler ShowSimilarTiddlers##show>>
<<<
!end
!out
$1
!end
!show
<<tiddler ShowSimilarTiddlers##out with: {{
	var out=[]; var similar={}; var rank=[];
	var here=story.findContainingTiddler(place);
	var title='$1'!='$'+'1'?'$1':here?here.getAttribute('tiddler'):'';
	var limit='$2'!='$'+'2'?'$2':1;
	var tid=store.getTiddler(title);
	var tids=store.reverseLookup('tags','excludeLists');
	if (tid) for (var i=0; i<tids.length; i++) { var t=tids[i];
		if (t.title==tid.title) continue;
		var tags=[]; for (var j=0; j<t.tags.length; j++)
			if (tid.tags.contains(t.tags[j])) tags.push(t.tags[j]);
		if (tags.length >= limit) {
			similar[tids[i].title]=tags;
			if (!rank[tags.length]) rank[tags.length]=new Array();
			rank[tags.length].push(tids[i].title);
		}
	}
	for (var r=rank.length-1; r>=0; r--) { if (!rank[r]) continue;
		out.push('*%0 shared tags:'.format([r,rank[r].length]));
		for (var t=0; t<rank[r].length; t++)
			out.push('##[[%0]] ~~("""%1""")~~'.format([rank[r][t],similar[rank[r][t]].join(', ')]));
	}
	out.join('\n');
}}>>
!end
%/<<tiddler {{var src='ShowSimilarTiddlers'; src+(tiddler&&tiddler.title==src?'##info':'##show');}}
	with: [[$1]]>>