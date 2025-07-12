/***
|''Name:''|NewerTiddlerPlugin|
|''Version:''|$Revision: 13 $ |
|''Source:''|http://thePettersons.org/tiddlywiki.html#NewerTiddlerPlugin |
|''Author:''|[[Paul Petterson]] |
|''Type:''|Macro Extension |
|''Requires:''|TiddlyWiki 1.2.33 or higher |
!Description
Create a 'new tiddler' button with lots more options! Specify the text to show on the button, the name of the new tiddler (with date macro expansion), one or more tags for the new tiddlers, and what text if any to include in the new tiddler body! Uses a named parameter format, simalar to the reminder plugin.

Also - if the tiddler already exists it won't replace any of it's existing data (like tags).

!Syntax
* {{{<<newerTiddler button:"Inbox" name:"Inbox YYYY/MM/DD" tags:"Journal, inbox" text:"New stuff for today:">>}}}
* {{{<<newerTiddler button:"@Action" name:"Action: what" tags:"@Action" text:"Add project and describe action">>}}}
* {{{<<newerTiddler button:"New Project" name:"Project Name?" tags:"My Projects, My Inbox, Journal" template:"MyTemplate">>}}}
!!Parameters
* name:"Name of Tiddler"
* tags:"Tag1, Tag2, Tag3" - tags for new tiddler, comma seperated //don't use square brackets //({{{[[}}})// for tags!//
* button:"name for button" - the name to display instead of "new tiddler"
* body:"what to put in the tiddler body"
* template:"Name of a tiddler containing the text to use as the body of the new tiddler"

''Note:'' if you sepecify both body and template parameters, then template parameter will be used and the body parameter overridden.

!Sample Output
* <<newerTiddler button:"Inbox" name:"Inbox YYYY/MM/DD" tags:"Journal inbox" text:"New stuff for today:">>
* <<newerTiddler button:"@Action" name:"Action: what" tags:"@Action" text:"Add project and describe action">>
* <<newerTiddler button:"New Project" name:"Project Name?" tags:"[[My Projects]] [[My Inbox]] Journal" template:"MyTemplate">>

!Todo
<<projectTemplate>>

!Known issues
* Must use double quotes (") around parameter values if they contain a space, can't use single quotes (').
* can't use standard bracketted style tags, ust type in the tags space and all and put a comma between them. For example tags:"one big tag, another big tag" uses 2 tags ''one big tag'' and ''another big tag''.

!Notes
* It works fine, and I use it daily, however I haven't really tested edge cases or multiple platforms. If you run into bugs or problems, let me know!

!Requests
* Have delta-date specifiers on the name: name:"Inbox YYY/MM/DD+1" ( ceruleat@gmail.com )
* Option to just open the tiddler instead of immediately edit it ( ceruleat@gmail.com )
* Have date formatters in tags as well as in name (me)

!Revision history
$History: PaulsNotepad.html $
 * 
 * ***************** Version 2 *****************
 * User: paulpet Date: 2/26/06 Time: 7:25p
 * Updated in $/PaulsNotepad3.0.root/PaulsNotepad3.0/PaulsPlugins/systemConfig
 * Port to tw2.0, bug fixes, and simplification!
v1.0.2 (not released) - fixed small documentation issues.
v1.0.1 October 13th - fixed a bug occurring only in FF
v1.0 October 11th - Initial public release
v0.8 October 10th - Feature complete... 
v0.7 Initial public preview

!Code
***/
//{{{
config.macros.newerTiddler = { 
name:"New(er) Tiddler",
tags:"",
text:"Type Tiddler Contents Here.",
button:"new(er) tiddler",

reparse: function( params ) {
 var re = /([^:\'\"\s]+)(?::([^\'\":\s]+)|:[\'\"]([^\'\"\\]*(?:\\.[^\'\"\\]*)*)[\'\"])?(?=\s|$)/g;
 var ret = new Array() ;
 var m ;

 while( (m = re.exec( params )) != null )
 ret[ m[1] ] = m[2]?m[2]:m[3]?m[3]:true ;

 return ret ;
},
handler: function(place,macroName,params,wikifier,paramString,tiddler) {
 if ( readOnly ) return ;

 var input = this.reparse( paramString ) ;
 var tiddlerName = input["name"]?input["name"].trim():config.macros.newerTiddler.name ;
 var tiddlerTags = input["tags"]?input["tags"]:config.macros.newerTiddler.tags ;
 var tiddlerBody = input["text"]?input["text"]:config.macros.newerTiddler.text ;
 var buttonText = input["button"]?input["button"]:config.macros.newerTiddler.button ;
 var template = input["template"]?input["template"]:null;

 // if there is a template, use it - otherwise use the tiddlerBody text
 if ( template ) {
 tiddlerBody = store.getTiddlerText( template );
 }
 if ( tiddlerBody == null || tiddlerBody.length == 0 )
 tiddlerBody = config.macros.newerTiddler.text ;

 // mptw hack
 tiddlerBody = tiddlerBody.replace(/\$\)\)/g,">>");
 tiddlerBody = tiddlerBody.replace(/\$\}\}/g,">>");

 var now = new Date() ;
 tiddlerName = now.formatString( tiddlerName ) ;
 
 createTiddlyButton( place, buttonText, "", function() {
 var exists = store.tiddlerExists( tiddlerName );
 var t = store.createTiddler( tiddlerName );
 if ( ! exists )
 t.assign( tiddlerName, tiddlerBody, config.views.wikified.defaultModifier, now, tiddlerTags.readBracketedList() );
 
 story.displayTiddler(null,tiddlerName,DEFAULT_EDIT_TEMPLATE);
 story.focusTiddler(tiddlerName,"title");
 return false;
 });
}}
//}}}
/***
This plugin is released under the [[Creative Commons Attribution 2.5 License|http://creativecommons.org/licenses/by/2.5/]]
***/

