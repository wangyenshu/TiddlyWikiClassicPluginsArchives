/***
|Macro|redirect (alias)|
|Author|[[Clint Checketts]] and Paul Petterson|
|Version|1.1 Jan 26, 2006|
|Location|http://checkettsweb.com/styles/themes.htm#RedirectMacro|
|Description|This macro tells TW to find all instances of a word and makes it point to a different link. For example, whenever I put the word 'Clint' in a tiddler I want TiddlyWiki to turn it into a link that points to a tiddler titled 'Clint Checketts' Or the word 'TW' could point to a tiddler called 'TiddlyWiki' It even matches clint (which is lowercase) [[Clint]] leet lEEt LEET|
|Usage|{{{<<redirect TW TiddlyWiki>>}}} |
|Example|<<redirect TW "TiddlyWiki">> <<redirect Clint "Clint Checketts">> (Nothing should appear, its just setting it all up)<<redirectExact lEEt Elite>>|

!Revisions
1.1- Fixed tiddler refresh so a tiddler declaring a redirect will also render the redirect
1.0- Updated to work with TiddlyWiki 2.0 (thanks to Udo Borkowski)
0.9- Original release October 2005

!Code
***/
//{{{
version.extensions.redirectExact = {major: 1, minor: 2, revision: 0, date: new Date(2005,10,24)};
config.macros.redirectExact = {label: "Pickles Rock!"};
config.macros.redirectExact.handler = function(place,macroName,params,wikifier,paramString,tiddler){
 config.macros.redirect.handler(place,macroName,params,wikifier,paramString,tiddler);
}

version.extensions.redirect = {major: 1, minor: 2, revision: 0, date: new Date(2005,10,24)};
config.macros.redirect = {label: "Pickles Rock!"};

config.macros.redirect.handler = function(place,macroName,params,wikifier,paramString,tiddler){

var redirectExists = false
// Check to see if the wikifier exists
for (var i=0;i<config.formatters.length;i++)
 if (config.formatters[i].name == "redirect"+params[0])
 redirectExists = true;

//If it doesn't exist, add it!
if (!redirectExists){
 for( var i=0; i<config.formatters.length; i++ )
 if ( config.formatters[i].name=='wikiLink') break ;

 if ( i >= config.formatters.length ) {
 var e = "Can't find formatter for wikiLink!" ;
 displayMessage( e ) ;
 throw( e ) ;
 }

var pattern;
 if (macroName == 'redirect'){pattern=params[0].escapeRegExp().replace(/([A-Z])/img, function($1) {return("["+$1.toUpperCase()+$1.toLowerCase()+"]");});
 } else {
 pattern=params[0].escapeRegExp();
 }

 config.formatters.splice( i, 0, {
 name: "redirect"+params[0],
 match: "(?:\\b)(?:\\[\\[)?"+pattern+"(?:\\]\\])?(?:\\b)",
 subst: params[1],
 handler: function(w) {
 var link = createTiddlyLink(w.output,this.subst,false);
 w.outputText(link,w.matchStart,w.nextMatch);
 }
 });
 formatter = new Formatter(config.formatters); //update the tiddler
 if(tiddler) story.refreshTiddler(tiddler.title,null,true); //refresh tiddler so the new rule is applied
} // End if
}
//}}}