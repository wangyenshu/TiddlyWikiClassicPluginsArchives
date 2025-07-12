/***
|''Name:''|AutoTaggerPlugin|
|''Source:''|http://www.TiddlyTools.com/#AutoTaggerPlugin|
|''Author:''|Eric Shulman - ELS Design Studios|
|''License:''|[[Creative Commons Attribution-ShareAlike 2.5 License|http://creativecommons.org/licenses/by-sa/2.5/]]|
|''~CoreVersion:''|2.0.10|

Automatically tag tiddlers with their original creation date and author and optionally scan the tiddler content for any tags that are embedded as text.  Makes cross-referencing your tiddlers a snap!

!!!!!Usage
<<<
When ~AutoTagger is present, it automatically ''generates 'creation date' and 'creator' tag values'' for all newly created tiddlers, so that this information is retained even after a tiddler has been updated many times.  In addition, if you enter ''//auto//'' as a tiddler tag value, ~AutoTagger ''scans the tiddler content'' (including title) for all existing tags, and ''automatically adds any embedded tags that it finds''.

After they have been added to the tiddler, the new tags are treated just as if you had entered them by hand and can be edited to make any changes you want.  Of course, as long as the "auto" tag is still present on a tiddler, ~AutoTagger will re-scan that tiddler's content each time it is edited.  If you DO edit the generated tags, you can remove the "auto" tag from the tiddler to prevent it from being re-scanned when you press 'done' to finish editing.

//Note: the special-purpose ''"systemConfig" tag is not added automatically, even if matched in the tiddler content'', since this tag should be added manually to ensure it is always used appropriately.//

//Note: if you have set the "auto" tag on a tiddler, and then add several tags to your document, those tags will ''not'' be automatically added to the tiddler until you actually edit that tiddler and press 'done' to trigger an AutoTagger scan.//
<<<
!!!!!Configuration
<<<
The ~AutoTagger plugin comes with a ''self-contained control panel''.  Use these controls to enable or disable automatic 'creation date' or 'creator' tagging, modify the default date formatting, or redefine the special 'scan trigger' tag value (so you can use "auto" as a normal tag value in your document).

<<option chkAutoTagAuthor>> add 'created by' tag //(when a tiddler is first created)//
<<option chkAutoTagDate>> add 'creation date' tag, using date format: <<option txtAutoTagFormat>>
<<option chkAutoTagEditor>> add 'edited by' tag //(when a tiddler is updated)//
scan tiddler content for new tags when tagged with: <<option txtAutoTagTrigger>>
----
//date formatting syntax://
^^//''DDD'' - day of week in full (eg, "Monday"), ''DD'' - day of month, ''0DD'' - adds leading zero//^^
^^//''MMM'' - month in full (eg, "July"), ''MM'' - month number, ''0MM'' - adds leading zero//^^
^^//''YYYY'' - full year, ''YY'' - two digit year//^^
<<<
!!!!!Installation
<<<
import (or copy/paste) the following tiddlers into your document:
''AutoTaggerPlugin'' (tagged with <<tag systemConfig>>)
<<<
!!!!!Revision History
<<<
''2006.08.29 [1.3.3]'' use newTags.contains() instead of newTags.find() to check for 'auto' tag
''2006.06.15 [1.3.2]'' hijack TiddlyWiki.prototype.saveTiddler instead of store.saveTiddler.  Permits other plugins to also hijack the function (thanks to Simon Baird for finding this!)
''2006.05.31 [1.3.1]'' Re-assemble tags into a space-separated string (use encodeTiddlyLink to add {{{[[...]]}}} as needed) before passing it on to core (or other hijacked function)
''2005.10.09 [1.3.0]'' Added 'edited by' tagging. Combined documentation and code into a single tiddler
''2005.08.16 [1.2.0]'' Added optional scanning for tags in tiddler content (based on suggestion from Jacques Turbé)
''2005.08.15 [1.1.0]'' Added 'created by' tag generation (based on suggestion from Elise Springer). Renamed from DateTag to AutoTagger
''2005.08.15 [1.0.0]'' Initial Release
<<<
!!!!!Credits
<<<
This feature was developed by EricShulman from [[ELS Design Studios|http:/www.elsdesign.com]].
<<<
!!!!!Code
***/
//{{{
version.extensions.autoTagger = {major: 1, minor: 3, revision: 3, date: new Date(2006,8,29)};

if (config.options.chkAutoTagDate==undefined)
	config.options.chkAutoTagDate=false;
if (config.options.chkAutoTagEditor==undefined)
	config.options.chkAutoTagEditor=false;
if (config.options.chkAutoTagAuthor==undefined)
	config.options.chkAutoTagAuthor=false;
if (config.options.txtAutoTagTrigger==undefined)
	config.options.txtAutoTagTrigger="auto";
if (config.options.txtAutoTagFormat==undefined)
	config.options.txtAutoTagFormat="YYYY.0MM.0DD";

// hijack saveTiddler()
TiddlyWiki.prototype.coreSaveTiddler=TiddlyWiki.prototype.saveTiddler;
TiddlyWiki.prototype.saveTiddler=function(title,newTitle,newBody,modifier,modified,tags)
{
	// get the tags as passed from the tiddler editor
	var newTags = [];
	if (tags) newTags = (typeof tags == "string") ? tags.readBracketedList() : tags;

	// if saving a new tiddler, add 'creation date' tag
	if (config.options.chkAutoTagDate && (store.getTiddler(title)==undefined))
		newTags.pushUnique(new Date().formatString(config.options.txtAutoTagFormat));
	// if saving a new tiddler, add 'created by' tag
	if (config.options.chkAutoTagAuthor && (store.getTiddler(title)==undefined))
		newTags.pushUnique(config.options.txtUserName);
	// if saving an existing tiddler, add 'edited by' tag
	if (config.options.chkAutoTagEditor && (store.getTiddler(title)))
		newTags.pushUnique(config.options.txtUserName);

	// if tagged for scanning, find tags embedded in text of tiddler title/body
	var allTags = store.getTags();
	if (config.options.txtAutoTagTrigger && newTags.contains(config.options.txtAutoTagTrigger))
		for (var t=0; t<allTags.length; t++)
			{
			// note: don't automatically tag a tiddler with 'systemConfig' or 'systemTiddler'
			if ((allTags[t][0]=='systemConfig') || (allTags[t][0]=='systemTiddler'))
				continue;
			if ((newBody.indexOf(allTags[t][0])!=-1) || (newTitle.indexOf(allTags[t][0])!=-1))
				newTags.pushUnique(allTags[t][0]);
			}

	// encode tags with [[...]] (as needed)
	for (var t=0; t<newTags.length; t++) newTags[t]=String.encodeTiddlyLink(newTags[t]);

	//  reassemble tags into a string (for other plugins that require a string) and pass it all on
	return this.coreSaveTiddler(title,newTitle,newBody,modifier,modified,newTags.join(" "));
}
//}}}