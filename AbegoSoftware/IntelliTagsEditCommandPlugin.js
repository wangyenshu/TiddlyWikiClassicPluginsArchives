/***
|''Name:''|IntelliTagsEditCommandPlugin|
|''Version:''|1.0.0 (2007-10-03)|
|''Type:''|plugin|
|''Description:''|A command for your tiddler's toolbar to directly edit the tiddler's tags using the IntelliTaggerPlugin, without switching to "edit mode".|
|''Source:''|http://tiddlywiki.abego-software.de/#IntelliTagsEditCommandPlugin|
|''Requires:''|IntelliTaggerPlugin http://tiddlywiki.abego-software.de/#IntelliTaggerPlugin|
|''Author:''|Udo Borkowski (ub [at] abego-software [dot] de)|
|''Licence:''|[[BSD open source license (abego Software)]]|
|''~CoreVersion:''|2.0.8|
|''Browser:''|Firefox 1.5.0.2 or better|
***/
/***
!Using the "IntelliTagsEditCommandPlugin"
Add the command {{{intelliTagsEdit}}} into the 'macro' attribute of the 'toolbar' {{{<div...>}}} in your ViewTemplate.

''Example:''
{{{
<div class='toolbar'
        macro='toolbar -closeTiddler closeOthers +editTiddler intelliTagsEdit permalink references jump'>
</div>
}}}

This adds a "tags" button to the toolbar of the tiddlers (next to the ''edit'' button). Pressing the "tags" button will open the input field for the tiddler's tags and let you edit the tags with all the [[IntelliTaggerPlugin|http://tiddlywiki.abego-software.de/#IntelliTaggerPlugin]] features.
***/
/***
!Source Code
***/
//{{{
(function(){

if (!version.extensions.IntelliTaggerPlugin)
    throw Error("IntelliTagsEditCommandPlugin requires the IntelliTaggerPlugin (http://tiddlywiki.abego-software.de/#IntelliTaggerPlugin)");

if (config.commands.intelliTagsEdit)
    return;

config.commands.intelliTagsEdit = {
	text: "tags",
	tooltip: "edit the tags"
};

config.commands.intelliTagsEdit.handler = function(event,src,title) {
	var button = abego.IntelliTagger.createEditTagsButton(title, null, "tags", "edit the tags");
	button.onclick(event);
	return false;
};

})();
//}}}
