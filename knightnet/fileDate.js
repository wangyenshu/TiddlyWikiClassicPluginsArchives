/***
|''Name:''|fileDate|
|''Version:''|Revision: 1.0.1, 2006-04-20|
|''Source:''|http://knighjm.googlepages.com/knightnet-default-tw.html#fileDate|
|''Author:''|[[Julian Knight]]|
|''Type:''|Plugin|
|''Requires:''|TiddlyWiki 2.0.0 or higher|
!Description
Returns the date/time that the current TiddlyWiki file was saved.
!History
|!2006-04-20 - 1.0.1|Update default format to include leading zeros|
|!2006-04-20 - 1.0.0|First release, thanks to [[Eric Shulman|http://www.TiddlyTools.com]] for the starting code. See his DatePlugin for a comprehensive date plugin|
!Useage
<<fileDate "DateFormatString">>
Where "DateFormatString" is optional and formats the output - default format is "YYYY-MM-DD hh:mm".
!Code
***/
//{{{
version.extensions.fileDate = {
   major: 1, minor: 0, revision: 1, date: new Date("Apr 20, 2006"), type: 'macro',
   source: 'http://knighjm.googlepages.com/knightnet-default-tw.html#fileDate'
};

config.macros.fileDate = {
   defaultFmt: "YYYY-0MM-0DD 0hh:0mm"
};
config.macros.fileDate.handler = function(place,macroName,params,wikifier,paramString,callingTiddler) {
  var format=params[0];
  if (!format)
    format=config.macros.fileDate.defaultFmt;
  wikify((new Date(document.lastModified)).formatString(format),place);
}
//}}}
/***
This plugin is released under the "Do whatever you like at your own risk" license.
***/
