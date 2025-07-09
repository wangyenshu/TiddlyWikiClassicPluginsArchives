var title = new Date( );
title = title.formatString("[[DD MMM YYYY]]");
store.saveTiddler( "DefaultTiddlers", "DefaultTiddlers", title );
