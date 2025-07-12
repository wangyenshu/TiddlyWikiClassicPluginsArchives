//{{{
Story.prototype.tiddlerHistory= [];
Story.prototype.maxTiddlers = 3;
Story.prototype.closedHistory=[];
Story.prototype.closedHistoryMax = 10;

Array.prototype.moveToEnd = function(item)
{
    this.remove(item);
    this.push(item);
}

Story.prototype.old_history_displayTiddler = Story.prototype.displayTiddler;
Story.prototype.displayTiddler = function(srcElement,title,template,animate,slowly)
{
    this.tiddlerHistory.moveToEnd(title);
    this.closedHistory.remove(title);
    var closeCount = this.tiddlerHistory.length - this.maxTiddlers;
    if (closeCount > 0)
        {
        var count = this.tiddlerHistory.splice (0,closeCount);
        for (var i=0; i<count.length;i++)
            {
            story.closeTiddler(count[i],false);
            }
        }
    story.old_history_displayTiddler(null,title,template,animate,slowly);
}

Story.prototype.old_history_closeTiddler = Story.prototype.closeTiddler;
Story.prototype.closeTiddler = function(title,animate,slowly)
{
    this.tiddlerHistory.remove(title);
    this.closedHistory.remove(title);
    this.closedHistory.unshift(title);
    story.old_history_closeTiddler.apply(this,arguments);
}

Story.prototype.displayTiddlers = function(srcElement,titles,template,animate,slowly)
{
	for(var t = titles.length-1;t>=0;t--)
	    {
        this.tiddlerHistory.moveToEnd(titles[t]);
        this.closedHistory.remove(titles[t]);
		this.old_history_displayTiddler(srcElement,titles[t],template,animate,slowly);
        }
}

config.commands.history={
	text: "history",
	tooltip: "re-open a closed tiddler"};

config.commands.history.handler = function(event,src,title)
{
	var popup = Popup.create(src);
	if(popup)
		{
        if (!story.closedHistory.length)
            createTiddlyText(popup,"No history");
        else
           {
           var c = Math.min(story.closedHistory.length,story.closedHistoryMax);
		   for (i=0; i<c;i++ )
               {
			   createTiddlyLink(createTiddlyElement(popup,"li"),story.closedHistory[i],true);
		       }
           }
        }
	Popup.show(popup,false);
	event.cancelBubble = true;
	if (event.stopPropagation) event.stopPropagation();
	return false;
}
//}}}