/***
!HelloWorld Macro
Always include Author, Source,and Version in a table so that people know what they have.
|Author: Simon Baird|
|Documentation: Bradley Meck|
|Source: http://bradleymeck.tiddlyspot.com/#HelloWorld|
|Version: 1.0.0|

!Revisions
*10/29/2006 Added documentation to make this more understandable for plugin developers

!example
|Source|Output|
|{{{<<HelloWorld>>}}}|<<HelloWorld>>|
|{{{<<HelloWorld "I am" "the params.">>}}}|<<HelloWorld "I am" "the params.">>|
***/
//{{{
config.macros.HelloWorld = {}; //config.macros["Name of my Macro"]

/**
* handler is called by TW when the macro is seen.
* its arguements are as follows
* place: DOM element where the macro's source was found. (Usually just put stuff here with createTiddlyElement(place,...)).
* macroName: what the macro is called, can be good if macros call each other for some reason.
* params: list of parameters given from the macro source, as an Array
* wikifier: the wikifier that sent this call
* paramString: unparsed version of params as a String
* tiddler: the tiddler that this macro is being called in
**/

config.macros.HelloWorld.handler =
function(place,macroName,params,wikifier,paramString,tiddler)
{
 wikify("Hello World <br>"+params.join("<br>"),place);
};

//}}}
