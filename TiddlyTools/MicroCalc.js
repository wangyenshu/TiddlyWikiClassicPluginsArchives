/%
!info
|Name|MicroCalc|
|Source|http://www.TiddlyTools.com/#MicroCalc|
|Version|2.0.0|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.1|
|Type|transclusion|
|Description|simple calculator using javascript eval() function|
Usage
<<<
{{{
<<tiddler MicroCalc>>
<<tiddler MicroCalc with: width>>
*''width'' (optional) is a CSS measurement (default=auto)
}}}
<<<
Example
>{{{<<tiddler MicroCalc with: 300px>>}}}
><<tiddler MicroCalc##show with: 300px>>
!end
!show
<html><nowiki>
<form action="javascript:;" style="width:$1;display:block;white-space:nowrap;margin:0;padding:0;"><!--
--><input name="input" value="0" style="width:70%;text-align:right;"
	title="INPUT: enter a JavaScript expression, function, or object/variable name"
	onfocus="this.select()"
	onkeyup="if (event.keyCode==13) {this.form.go.click(); return false;}"><!--
--><input name="go" type="button" value="=" style="width:10%"
	title="CALCULATE: evaluate input and display results"
	onclick="var i=this.form.input; var o=this.form.output; var val=i.value; var res='';
		try{res=eval(val);i.value=res}catch(e){res=e.description||e.toString()};
		o.value+=(o.value.length?'\n':'')+val+'\n='+res;
		o.style.display='block'; o.scrollTop=o.scrollHeight;
		i.select();i.focus();"><!--
--><input name="memstore" type="button" value="m" style="width:10%"
	title="MEMORY STORE: save input to temporary memory"
	onclick="var f=this.form; f.memory.value=f.input.value;
		f.memory.parentNode.style.display='block'"><!--
--><input name="clear" type="button" value="c" style="width:10%" 
	title="CLEAR: erase history and reset input"
	onclick="var i=this.form.input; var o=this.form.output;
		o.value='';o.style.display='none';
		i.value='0';i.select();i.focus();"><!--
--><div style="display:none"><!--
--><input name="memory" value="0" style="width:70%;text-align:right;"
	title="MEMORY: temporarily store input during calculations"><!--
--><input name="meminsert" type="button" value="mi" style="width:10%"
	title="MEMORY INSERT: append memory value to current input"
	onclick="var i=this.form.input;
		i.value+=this.form.memory.value; i.select();i.focus();"><!--
--><input name="memrecall" type="button" value="mr" style="width:10%"
	title="MEMORY RECALL: replace current input with memory value "
	onclick="var i=this.form.input;
		i.value=this.form.memory.value; i.select();i.focus();"><!--
--><input name="memclear" type="button" value="mc" style="width:10%"
	title="MEMORY CLEAR: clear temporary memory"
	onclick="var f=this.form; f.memory.value='0';
		f.memory.parentNode.style.display='none';
		f.input.select();f.input.focus();"><!--
--></div><!--
--><textarea name="output" rows=5 style="width:99%;display:none;text-align:right;"
	title="HISTORY: previous inputs and calculated results"></textarea><!--
--></form></html>
!end
%/<<tiddler {{tiddler&&tiddler.title=='MicroCalc'?'MicroCalc##info':'MicroCalc##show'}}
	with: {{'$1'!='$'+'1'?'$1':'auto'}}>>