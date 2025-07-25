/%
!info
|Name|ResetChangeCounters|
|Source|http://www.TiddlyTools.com/#ResetChangeCounters|
|Version|2.0.1|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.1|
|Type|transclusion|
|Description|Reset all TiddlyWiki option cookies (with confirmation)|
Usage
<<<
{{{
<<tiddler ResetChangeCounters>>
<<tiddler ResetChangeCounters with: label>>
}}}
<<<
Example
<<<
{{{<<tiddler ResetChangeCounters with: 'reset counters'>>}}}
<<tiddler ResetChangeCounters##show with: 'reset counters'>>
<<<
!end
!show
<html><nowiki><a href="javascript:;" title="$2"
onmouseover="
	this.href='javascript:void(eval(decodeURIComponent(%22(function(){try{('
	+encodeURIComponent(encodeURIComponent(this.onclick))
	+')()}catch(e){alert(e.description?e.description:e.toString())}})()%22)))';"
onclick="
	var msg='Are you sure you want to remove the change counters from these tiddlers:\n\n';
	var t=store.getTiddlers('title'); var tids=[];
	for (var i=0;i<t.length;i++) {
		var v=store.getValue(t[i],'changecount');
		if (v) { msg+=t[i].title+' ('+v+')\n'; tids.push(t[i]); }
	}
	msg+='\nPress OK to proceed';
	if (!confirm(msg)) return false;
	for (var i=0;i<tids.length;i++) tids[i].clearChangeCount();
	displayMessage('Change counters have been reset to 0');
	displayMessage('Don\'t forget to save your document!');
	return false;
">$1</a></html>
!end
%/<<tiddler {{var src='ResetChangeCounters'; src+(tiddler&&tiddler.title==src?'##info':'##show')}}
with:	{{'$1'!='$'+'1'?'$1':'&empty; - Reset tiddler change counters...'}}
	{{'$2'!='$'+'2'?'$2':'remove change counters from all tiddlers in this document'}}
>>