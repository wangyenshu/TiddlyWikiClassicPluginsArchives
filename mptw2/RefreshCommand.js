/***
***/

//{{{

config.commands.refresh = {
 text: 'refresh',
 tooltip: 'Refresh this tiddler',
 handler: function(e,src,title) {
  clearMessage();
  story.refreshTiddler(title,false,true); // force=true
  return false;
 }
};

//}}}