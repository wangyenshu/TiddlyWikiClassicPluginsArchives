/***
|Name|BlogUserPlugin|
|Created by|Simon Baird|
|Location|http://groups.google.com/group/TiddlyWiki/browse_thread/thread/c61b9b0e2f639684/655c866fbd66f511?lnk=gst&q=tsuser&rnum=1#655c866fbd66f511|
|Version|1.0|
|Requires|~TW2.x|
!Description:
Provides a quick way to create a pretty link to a ~TiddlySpot, ~LiveJournal, Xanga or ~MySpace site.
Samples below should enable anyone to add new blog portals as they need them.

!Demo:
|''~TiddlySpot:'' |  {{{<<tsUser monkeygtd>>}}} | <<tsUser monkeygtd>> |
|Extended use: |{{{<<tsUser monkeygtd [[Sell My Bagpipes]]>>}}} | <<tsUser monkeygtd [[Sell My Bagpipes]]>> |
|''~LiveJournal:'' | {{{<<ljUser bradhicks>>}}} | <<ljUser bradhicks>> |
|''~MySpace:'' | {{{<<msUser humiliation_network>>}}} | <<msUser humiliation_network>> |
|''Xanga:'' | {{{<<xaUser kelagon>>}}} | <<xaUser kelagon>> |


!Installation:
Copy the contents of this tiddler to a new tiddler in your TW, tag with systemConfig, save and reload your TW.

!Code

!!!~TiddlySpot
***/
//{{{
config.macros.tsUser = { handler: function(place,name,params) {
  wikify('[[' + params[0] + '|http://' + params[0] +'.tiddlyspot.com/' +
    (params[1] ? '#'+params[1] : "") + ']]',
      place);
}}; 
//}}}

/***
!!!~LJUser
***/
//{{{
config.macros.ljUser = { handler: function(place,name,params) {
  wikify('[[' + params[0] + '|http://' + params[0] +'.livejournal.com/' +
    (params[1] ? '#'+params[1] : "") + ']]',
      place);
}}; 
//}}}

/***
!!!~MySpace
***/
//{{{
config.macros.msUser = { handler: function(place,name,params) {
  wikify('[[' + params[0] + '|http://myspace.com/' + params[0] + '/' +
    (params[1] ? '#'+params[1] : "") + ']]',
      place);
}}; 
//}}}

/***
!!!Xanga
***/
//{{{
config.macros.xaUser = { handler: function(place,name,params) {
  wikify('[[' + params[0] + '|http://xanga.com/' + params[0] + 
    (params[1] ? '#'+params[1] : "") + ']]',
      place);
}}; 
//}}}
