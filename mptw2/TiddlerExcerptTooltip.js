/***
| Name:|TiddlerExcerptTooltip|
| Source:|http://simonbaird.com/mptw/#TiddlerExcerptTooltip|
| Author:|Simon Baird, adapted from original version posted to mailing list by Udo Borkowski|
| Version:|1.0.0|
| Description:|Make tooltip of tiddler links the first line or excerpt of the tiddler content|
***/
//{{{

// adjust the following to your preference
config.TiddlerExcerptTooltip = {
	trimLength: 60,
	dateFormat:"DD-MM-YY"
}

// %0 is title
// %1 is modifier
// %2 is modified date
// %3 is first line
// %4 is first so many characters
// %5 is short modified date
// %6 is short created date

// firefox seems to trim the tooltip if it gets too long...
config.messages.tiddlerLinkTooltip = "%1/%5: %4";

config.messages.tiddlerEmpty = "(empty)";

Tiddler.prototype.getSubtitle = function()
{
	var theModifier = this.modifier;
	if(!theModifier)
		theModifier = config.messages.subtitleUnknown;
	var theModified = this.modified;
	if(theModified)
		theModified = theModified.toLocaleString();
	else
		theModified = config.messages.subtitleUnknown;

	var m = this.text.match(/\s*(.*)/);
	var firstLine = (m != null && m.length >= 1) ? m[1] : "";

	var contentExcerpt = this.text.prettyTrim(config.TiddlerExcerptTooltip.trimLength);
	if (contentExcerpt == "")
		contentExcerpt = config.messages.tiddlerEmpty;

	var shortModified = this.modified.formatString(config.TiddlerExcerptTooltip.dateFormat);
	var shortCreated = this.created.formatString(config.TiddlerExcerptTooltip.dateFormat);


	return config.messages.tiddlerLinkTooltip.format(
		[this.title,theModifier,theModified,firstLine,contentExcerpt,shortModified,shortCreated]);  
}

// this lifted from TagUtils
String.prototype.prettyTrim = function(len,prefix,postfix) {
	var result = this.trim().replace(/\r\n/g,' ').replace(/[\n|\t]/g,' ');
	if (result.length > len - 3)
		return result.trim().substr(0,len) + '...';
	else
		return result;
}

//}}}
