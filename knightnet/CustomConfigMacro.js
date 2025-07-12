/***
Override internal configuration settings
JK: 2006-04-20
***/
//{{{
// Shorten/clarify command names and add drop-down icons on appropriate commands
config.commands.references.text = "refs" + (document.all?"▼":"▾"); // default is "references"
config.commands.permalink.text = "link"; // default is "permalink"
config.commands.closeOthers.text = "close-others"; // default is "close others"
config.commands.jump.text = "jump" + (document.all?"▼":"▾"); // default is "permalink"
// Get rid of the default edit text for new tiddlers
config.views.editor.defaultText = "" // default is "Type the text for '%0'"
// Add drop-down to tag chooser
config.views.editor.tagChooser.text = "tags" + (document.all?"▼":"▾"); // default is "tags"
//}}}