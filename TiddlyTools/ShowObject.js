/%
!info
|Name|ShowObject|
|Source|http://www.TiddlyTools.com/#ShowObject|
|Version|1.5.0|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements<br>and [[Creative Commons Attribution-ShareAlike 2.5 License|http://creativecommons.org/licenses/by-sa/2.5/]]|
|~CoreVersion|2.1|
|Type|transclusion|
|Description|display TiddlyWiki runtime objects|
Usage:
<<<
{{{
<<tiddler ShowObject with: "function, object or DOM element">>
}}}
<<<
Examples:
<<<
*function:<br>{{{<<tiddler ShowObject with: "main">>}}} <<slider
	{{config.options.foo=false;'foo';}}
	ShowObject##Function_example 'view result...'>>
*object:<br>{{{<<tiddler ShowObject with: "config.messages">>}}} <<slider
	{{config.options.foo=false;'foo';}}
	ShowObject##Object_example 'view result...'>>
*DOM element:<br>{{{<<tiddler ShowObject with: "mainMenu">>}}} <<slider
	{{config.options.foo=false;'foo';}}
	ShowObject##DOM_example 'view result...'>>
<<<
!Function_example
<<tiddler ShowObject with: "main">>
!Object_example
<<tiddler ShowObject with: "config.messages">>
!DOM_example
<<tiddler ShowObject with: "mainMenu">>
!end

%/<<tiddler {{

// written 2008 by Eric L Shulman
// re-use outside of TiddlyWiki is permitted
// with proper credit and links to:
// http://www.TiddlyTools.com/#ShowObject
// http://www.TiddlyTools.com/#LegalStatements

window.showObject=function(thing) {
	if (document.getElementById(thing))
		var out=function(id){
			var t=document.getElementById(id).innerHTML
			var t2=''; var indent=''; var level=0;
			for (var i=0;i<t.length;i++) { var c=t.substr(i,1);
				if (c=='<') {
					if (t.substr(i+1,1)=='/')
						indent=indent.substr(0,indent.length-2);
					t2+='\n'+indent;
					if (t.substr(i+1,1)!='/'
						&& t.substr(i+1,3)!='br>'
						&& t.substr(i+1,2)!='p>'
						&& t.substr(i+1,3)!='hr>') indent+='  ';
				}
				t2+=c;
				if (c=='\n') t2+=indent;
				if (c=='>' && t.substr(i+1,1)!='<') t2+='\n'+indent;
			}
			return t2;
		}(thing);
	else if (typeof(thing)=='function')
		var out=function(obj){
			return obj.toSource?obj.toSource(true):obj.toString();
		}(thing);
	else if (typeof(thing)!='undefined') {
		var out=function(obj,indent,level) {
			if (level>10)
				return '...';
			if (obj && obj.exec!==undefined)
				return obj.toString(); 
			if (typeof obj=='function')
				return 'function(...){...}';
			if (typeof obj=='string')
				return '"'+obj+'"';
			if (typeof obj=='object') {
				var t=[]; for(var p in obj) {
					var v=(p=='innerHTML')?
						'...':arguments.callee(obj[p],indent+'  ',level+1);
					t.push(indent+'  '+p+': '+v);
				}
				return '{\n'+t.join(',\n')+'\n'+indent+'}';
			}
			return obj.toString();
		}(thing,'',0);
	} else var out=' ???';
	return out.htmlEncode();
};
// end of portable code

'';}}>><<tiddler {{'$1'=='$'+'1'?'ShowObject##info':'ShowObject##format'}}
	with: $1 {{window.showObject(typeof $1==='undefined'?'$1':$1)}}>>/%

DEFINE OUTPUT FORMAT: $1=name, $2=results from showObject(name)
!format
<html><nowiki><pre>$1 =$2</pre></html>
!end
%/