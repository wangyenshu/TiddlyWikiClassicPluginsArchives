/***
!PopupTips and BookmarksCommand co-worked
***/
//{{{
if (config.commands.bookmarks) {
	config.macros.tips.refreshLocale = function(){
		config.commands.bookmarks.init();
		refreshPageTemplate('PageTemplate');
		if(!readOnly){
			removeChildren(document.getElementById("backstageButton"));
			removeChildren(document.getElementById("backstageToolbar"));
			backstage.init();
		}
		story.forEachTiddler(function(title,e){story.refreshTiddler(title,DEFAULT_VIEW_TEMPLATE,true);});
	}
};
//}}}