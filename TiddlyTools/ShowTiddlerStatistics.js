/%
!info
|Name|ShowTiddlerStatistics|
|Source|http://www.TiddlyTools.com/#ShowTiddlerStatistics|
|Version|1.0.0|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.1|
|Type|transclusion |
|Description|display document summary / tiddler stats (newest, oldest, largest, smallest, etc.)|
Usage
<<<
{{{
<<tiddler ShowTiddlerStatistics>>
}}}
!end
!show
{{nowrap{
$1
}}}
!end
!summary
{{fine{There are ''%0 tiddlers'', including:''<<tag systemConfig [[%1 plugins]]>>''+''<<tag transclusion [[%2 transclusions]]>>''(%3 total bytes)}}}
!end
!table
|borderless|k
| last change:&nbsp;|[[%0]] {{fine{(updated %1)}}}|
| newest:&nbsp;|[[%2]] {{fine{(created %3)}}}|
| oldest:&nbsp;|[[%4]] {{fine{(created %5)}}}|
| smallest:&nbsp;|[[%6]] {{fine{(%7 bytes)}}}|
| largest:&nbsp;|[[%8]] {{fine{(%9 bytes)}}}|
!end
%/<<tiddler ShowTiddlerStatistics##show with: {{
	var tiddlers=store.getTiddlers("modified","excludeLists");
	var last=tiddlers[tiddlers.length-1];
	var total=oldest=newest=smallest=largest=0;
	for (var i=0; i<tiddlers.length; i++) {
		total+=tiddlers[i].text.length;
		if (!oldest || tiddlers[i].created<oldest)
			{ var oldest=tiddlers[i].created; var oldtid=tiddlers[i]; }
		if (!newest || tiddlers[i].created>newest)
			{ var newest=tiddlers[i].created; var newtid=tiddlers[i]; }
		if (!smallest || tiddlers[i].text.length<smallest)
			{ var smallest=tiddlers[i].text.length; var smalltid=tiddlers[i]; }
		if (!largest || tiddlers[i].text.length>largest)
			 { var largest=tiddlers[i].text.length; var largetid=tiddlers[i]; }
	}
	var out=store.getTiddlerText("ShowTiddlerStatistics##summary").format([
		tiddlers.length,
		store.getTaggedTiddlers("systemConfig").length,
		store.getTaggedTiddlers("transclusion").length,
		total]);
	out+='\n'+store.getTiddlerText("ShowTiddlerStatistics##table").format([
		last.title, last.modified.formatString("MMM DDth YYYY, 0hh:0mm"),
		newtid.title, newtid.created.formatString("MMM DDth YYYY, 0hh:0mm"),
		oldtid.title, oldtid.created.formatString("MMM DDth YYYY, 0hh:0mm"),
		smalltid.title, smalltid.text.length,
		largetid.title, largetid.text.length]);
	out;
}}>>