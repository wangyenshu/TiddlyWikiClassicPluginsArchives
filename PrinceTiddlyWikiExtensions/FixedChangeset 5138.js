//{{{
TiddlyWiki.prototype.slicesRE = /(?:[\'\/]*~?([\.\w]+)[\'\/]*\:[\'\/]*\s*(.*?)\s*$)|(?:\|[\'\/]*~?([\.\w]+)\:?[\'\/]*\|\s*(.*?)\s*\|)/gm;

// @internal
TiddlyWiki.prototype.calcAllSlices = function(title)
{
	var slices = {};
	var text = this.getTiddlerText(title,"");
	this.slicesRE.lastIndex = 0;
	do {
		var m = this.slicesRE.exec(text);
		if(m) {
			if(m[1])
				slices[m[1]] = m[2];
			else
				slices[m[3]] = m[4];
		}
	} while(m);

	return slices;
};
//}}}