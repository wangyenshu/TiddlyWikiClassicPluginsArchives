/***
!Metadata:
|''Name:''|InstallTheme|
|''Description:''|Automatically install specified theme pack and backup the old|
|''Version:''|1.0.1|
|''Date:''|May 25, 2007|
|''Source:''|http://sourceforge.net/project/showfiles.php?group_id=150646|
|''Author:''|BramChen (bram.chen (at) gmail (dot) com)|
|''License:''|[[Creative Commons Attribution-ShareAlike 2.5 License]]|
|''~CoreVersion:''|2.2.0|
|''Browser:''|Firefox 1.5+; InternetExplorer 6.0|

!Usage:
|{{{<<installTheme themeName>>}}}|
!Revision History:
|''Version''|''Date''|''Note''|
|1.0.1|May 25, 2007|Removed tagging with themeName+title for StyleStyle, PageTemplate, ColorPalette|
|1.0.0|May 14, 2007|Initial release|

!Code section:
***/
//{{{
config.macros.installTheme = {
	label: "Install Theme: ",
	tooltip:"Automatically install specified theme pack.",
	copyOf: "Copy of ",
	themeName: "YourThemeName",
	themeTitles: 'StyleSheet,PageTemplate,ColorPalette'
};
config.macros.installTheme.handler = function(place,macroName,params){
	var themeName = params[0]?params[0]:this.themeName;
	var titles = params[1]?params[1]:this.themeTitles;
	var btn = createTiddlyButton(place,this.label+themeName,this.tooltip,this.doInstall,"installThemeBtn");
		btn.setAttribute("titles",titles);
		btn.setAttribute("themeName",themeName);
		btn.setAttribute("copyOf",this.copyOf);
};

config.macros.installTheme.doInstall = function(e){
	if(!e) var e = window.event;
	var t = this.getAttribute("titles");
	var titles = t.split(',');
	var themeName = this.getAttribute("themeName");
	var modifier = themeName +'InstallScript';
//	var tag = themeName+'Theme';
	var copyOf = this.getAttribute("copyOf");
	store.suspendNotifications(); 
	for (var i=0;i<titles.length; i++){
		var title = titles[i];
		var newTitle = copyOf+title;
		var newTheme = themeName+title;
		if (store.tiddlerExists(title)){
			var copyTiddler = store.saveTiddler(title,newTitle);
			var tiddler = store.getTiddler(title);
			store.setValue(tiddler,'modifier',modifier);
		};
		//var text = config.shadowTiddlers[newTheme];
		var text = '[['+newTheme+']]';
		if (title=='ColorPalette'){
			text = store.getTiddlerText(newTheme);
			if(!text)
				text = config.shadowTiddlers[title];
		}
		var tiddler = store.saveTiddler(title,title,text,modifier,new Date());
	}
	store.resumeNotifications();
	refreshAll();
	return false;
};
//}}}
