//adds a "copy" option to duplicate a tiddler//

{{{
config.commands.copyTiddler = {
  text: 'copy',
  tooltip: 'Make a copy of this tiddler',
  handler: function(event,src,title) {
    story.displayTiddler(null,title,DEFAULT_VIEW_TEMPLATE);
    var tiddler = store.fetchTiddler(title);
    var newTitle = title + ' copy';
    var newTiddler = store.createTiddler(newTitle);
    newTiddler.text = tiddler.text;
    newTiddler.tags = tiddler.tags;
    story.displayTiddler(null,newTitle,DEFAULT_EDIT_TEMPLATE);
    story.focusTiddler(newTitle,"title");
    return false;
  }
};
}}}