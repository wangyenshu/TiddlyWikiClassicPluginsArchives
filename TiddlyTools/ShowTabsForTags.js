/%
!info
|Name|ShowTabsForTags|
|Source|http://www.TiddlyTools.com/#ShowTabsForTags|
|Version|2.0.0|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.1|
|Type|transclusion|
|Description|generate a tabbed display for tiddlers with a specified set of tags|
Usage
<<<
{{{
<<tiddler ShowTabsForTags with: "tag tag ...">>
}}}
*''"tag tag..."''<br>is a space-separated list of tag values, ALL of which must be present on the tiddlers that are to be displayed.
<<<
Example
<<<
{{{<<tiddler ShowTabsForTags with: package>>}}}
<<tiddler ShowTabsForTags##show with: package>>
<<<
!end
!out
{{left wrap{$1}}}
!end
!show
<<tiddler ShowTabsForTags##out with: {{
	var tags="$1".readBracketedList();
	// get matching tiddlers in date order (newest first) and add params to tabs macro output
	var out="";
	if (tags.length) {
		var tids=store.getTaggedTiddlers(tags[0],'modified').reverse();
		for (var t=0; t<tids.length; t++)
			if (tids[t].tags.containsAll(tags))
				out+='[[%0 ]] "view %0" [[%0]]'.format([tids[t].title]); 
	}
	out.length?"<<tabs tabTabsForTags "+out+">\>"
		:"There are no tiddlers tagged with <<tag "+tags.join(">\> and <<tag ")+">\>";
}}>>
!end
%/<<tiddler {{var src='ShowTabsForTags'; src+(tiddler&&tiddler.title==src?'##info':'##show');}}
	with: [[$1]]>>