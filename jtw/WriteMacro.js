/***
|''Name:''|~WriteMacro|
|''Version:''|0.1|
|''Author:''|[[Jack]]|
|''Type:''|Macro|
!Description
Makes use of evalled parameters to write values to the current tiddler or execute code.
!Usage
{{{<<write {{javascript expression}}>>}}}
!Examples (WriteMacroExamples)
Write today's date:
{{{<<write {{'Today is ' + (new Date()).formatString('DDD')}}>>}}}
<<write {{'Today is ' + (new Date()).formatString('DDD')}}>>
!Code
***/
//{{{
version.extensions.write = {major: 0, minor: 1, revision: 0, date: new Date("Apr 23, 2006")};
config.macros.write = {handler:function(place,macroName,params,wikifier,paramString,tiddler) {
 var parameters = paramString.parseParams("code",null,true);
 var code = parameters[0]['code'][0];
 wikify(code,place,null,tiddler);
}}
config.macros.write.wikify = wikify;
wikify = function(source,output,highlightRegExp,tiddler) {
 window.currentTiddler = tiddler;
 config.macros.write.wikify(source,output,highlightRegExp,tiddler);
}
//}}}