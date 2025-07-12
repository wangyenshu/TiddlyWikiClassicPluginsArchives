/***
|''Name:''|betterFormatterPlugin|
|''Version:''|2006-04-10 - 1.0.4|
|''Source:''|http://knighjm.googlepages.com/knightnet-default-tw.html#betterFormatterPlugin|
|''Author:''|[[Julian Knight]]|
|''Type:''|Formatter Extension|
|''Requires:''|TiddlyWiki 2.0.0 or higher|
!Description
Make the formatters more flexible:
* Allows white-space before the block formatters
* Allows more than 4 dashes to make an HR
* Handles number lists pasted from the web - these have " 1." etc. at the start of each line and this changes that into a level 1 ordered list.
* Allows a leading dash as an unordered list (only 1 level though to avoid clash with HR rule
!Revisions
|!2006-04-10 - 1.0.4|Minor improvements to versioning & improve description. No code changes|
|!2006-04-07 - 1.0.3|Moved to my Google web site|
|!2006-04-03 - 1.0.2|Add leading dash (unordered list)|
|!2006-03-30 - 1.0.1|Changed alt num list to prevent lines starting "1GB" from being lists|
!To Do
* Leading dash handling only returns a level 1 list at present. Not sure of the best way to handle this.
>  Could simply do 3 tests
!Tests
!!Standard heading 2
  !!!Heading 3 with leading spaces
*Standard list entry
  *With leading spaces
  ** sub-list with leading spaces
 - Dashed list
-- Dashed sub-list
--- Dashed sub-sub-list
----Not a list (4 leading dashes with text after)
HR with leading spaces and >4 dashes:
  -------------------------------------------
Number list as pasted from HTML:
   1. One
   2. Two
!Code
***/
//{{{
version.extensions.betterFormatterPlugin = {
   major: 1, minor: 0, revision: 4, date: new Date("Apr 10, 2006"), type: 'macro',
   source: 'http://knighjm.googlepages.com/knightnet-default-tw.html#betterFormatterPlugin'
};

oldWikify = wikify;
wikify = function(text,parent,highlightText,highlightCaseSensitive) {
  text = text.replace( /^\s*(!{1,5})/mg, "$1" ); // Allow leading white-space in headings
  text = text.replace( /^\s*\*/mg, "*" ); // Allow leading white-space in unordered lists
  text = text.replace( /^\s*\-{1,3}(?!\>+)(?!\-+)/mg, "*" ); // Allow leading dash to be an unordered list (max 3 levels to avoid HR clash)
  text = text.replace( /^\s*\#/mg, "#" ); // Allow leading white-space in ordered lists
  text = text.replace( /^\s*----+$/mg, "----" ); // Allow leading white-space and more dashes in HRs
  text = text.replace( /^\s*(>+)/mg, "$1" ); // Allow leading white-space in block quotes
  text = text.replace( /^\s*\d+\){0,1}\.+/mg, "#" ); // Alt num list (as pasted from html page to txt)
  oldWikify(text,parent,highlightText,highlightCaseSensitive);
}
//}}}
/***
!Note
I've tried the following to override the formatter object but the \s* doesn't seem to work for some reason?
{{{
//config.formatters[1].match = "^\s*----*$\\n?"; // h rule
//config.formatters[2].match = "^\s*!{1,5}"; // heading
//config.formatters[10].match = "^\s*>+"; // block quote by line
//config.formatters[11].match = "^\s*(?:(?:\\*+)|(?:#+))"; // lists
//config.formatters[11].lookahead = "^\s*(?:(\\*+)|(#+))"; // lists

// --- Not part of default ---
// config.formatters[29].match = "^\s*(?:(?:\?+)|(?:\++))"; // definition list
// config.formatters[29].lookahead = "^\s*(?:(\?+)|(\++))"; // definition list
}}}
***/
/***
!License
This plugin is released under the "Do whatever you like at your own risk" license.
***/
