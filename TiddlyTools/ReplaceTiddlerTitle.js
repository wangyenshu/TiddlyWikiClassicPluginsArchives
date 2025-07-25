/%
!info
|Name|ReplaceTiddlerTitle|
|Source|http://www.TiddlyTools.com/#ReplaceTiddlerTitle|
|Version|2.0.0|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.1|
|Type|transclusion|
|Description|replace tiddler's title text with other content - may include wiki syntax|
Usage:
<<<
{{{
<<tiddler ReplaceTiddlerTitle with: [[new title text]]>>
}}}
*text can include wiki-syntax formatting (even links and macros!)
*all double-quotes must be preceded by backslash (e.g., {{{[[He said, \"like this\"]]}}})
*if the text contains any macros that use //evaluated parameters//, the closing {{{}} }}}sequence in those parameters must be backslash-quoted (e.g., {{{[[<<someMacro {{...eval param...}\}>>]]}}})
<<<
!end
!show
<<tiddler {{
	var here=story.findContainingTiddler(place); if (here) {
		var nodes=here.getElementsByTagName("*");
		for (var i=0; i<nodes.length; i++) if (hasClass(nodes[i],"title"))
			{ removeChildren(nodes[i]); wikify("$1",nodes[i]); break; }
	}
'';}}>>
!end
%/<<tiddler {{'ReplaceTiddlerTitle##'+('$1'=='$'+'1'?'info':'show')}} with: [[$1]]>>