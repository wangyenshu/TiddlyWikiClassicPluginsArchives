/%
!info
|Name|MicroBrowser|
|Source|http://www.TiddlyTools.com/#MicroBrowser|
|Version|2.0.1|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|Type|transclusion|
|Description|simplified browser-in-browser with bookmarks|
Usage
<<<
{{{
<<tiddler MicroBrowser>>
<<tiddler MicroBrowser with: TiddlerName>>
}}}
*''TiddlerName'' (optional, default='MiniBrowserList') contains an ~HR-separated list of bookmarks (1st line=list text, 2nd line=URL).  
* For additional features, including support for embedded video and flash players, please see [[MiniBrowserPlugin]].
<<<
Example
<<<
{{{<<tiddler MicroBrowser>>}}}
<<tiddler MicroBrowser##show>>
<<<
!end
!show
{{smallform{<html><nowiki><style>
	#tiddlerMicroBrowser .tagged {display:none;}
</style>
<form style='display:inline;margin:0;padding:0;white-space:nowrap;' onsubmit='return false;'><!--
	--><input type='button' value='<' title='back' style='width:3%'
		onclick='try{this.form.nextSibling.history.go(-1)}catch(e){window.history.go(-1)}'><!--
	--><input type='button' value='>' title='forward' style='width:3%'
		onclick='try{this.form.nextSibling.history.go(+1)}catch(e){window.history.go(+1)}'><!--
	--><input type='button' value='+' title='refresh'style='width:3%'
		onclick='try{this.form.nextSibling.location.reload()}catch(e){;}'><!--
	--><input type='button' value='x' title='stop'style='width:3%'
		onclick='window.stop()'><!--
	--><select name='bookmarks' size='1' style='width:25%'
		onchange='this.form.url.value=this.value; this.form.go.click();'><!--
	--><option value=''>bookmarks...</option><!--
	--></select><!--
	--><input type='button' value='edit' title='edit the bookmarks list' style='width:6%'
		onclick='story.displayTiddler(null,this.form.bookmarks.getAttribute("tiddler"),2)'><!--
	--><input type='text' name='url' size='60' value='' style='width:39%'
		onfocus='this.select()'><!--
	--><input type='button' value='go' name='go' title='view URL' style='width:6%'
		onclick="var f=this.form; var i=this.form.nextSibling;
			var u=f.url.value.replace(/^\s*|\s*$/g,'');
			if (!u.length) u=f.url.value=f.bookmarks.value.replace(/^\s*|\s*$/g,'');
			if (u.length) { f.done.disabled=false; i.style.display='block'; i.src=u; }
			else { f.done.disabled=true; i.style.display='none'; i.src=''; }
		"><!--
	--><input type='button' value='open' title='open a separate tab/window' style='width:6%'
		onclick='if (this.form.url.value.length) window.open(this.form.url.value)'><!--
	--><input type='button' value='done' name='done' disabled title='disconnect from URL' style='width:6%'
		onclick="this.form.done.disabled=true; var i=this.form.nextSibling; i.style.display='none'; i.src='';"><!--
	--></form><iframe src='' width='100%' height='480' 
		style='display:none;background:#fff;border:1px solid;'></iframe>
</html><<tiddler {{
	var list=place.lastChild.getElementsByTagName('form')[0].bookmarks;
	while (list.options[1]) list.options[1]=null;
	var tid='$1'; if(tid=='$'+'1') tid='MiniBrowserList';
	list.setAttribute('tiddler',tid);
	var parts=store.getTiddlerText(tid,'').split('\n----\n');
	for (var p=0; p<parts.length; p++) {
		var lines=parts[p].split('\n');
		var label=lines.shift()||''; // 1st line=display text
		var value=lines.shift()||''; // 2nd line=item value
		var indent=value&&value.length?'\xa0\xa0':'';
		list.options[list.length]=new Option(indent+label,value);
	}
''}}>>}}}
!end
%/<<tiddler {{var src='MicroBrowser'; src+(tiddler&&tiddler.title==src?'##info':'##show');}}
	with: [[$1]]>>