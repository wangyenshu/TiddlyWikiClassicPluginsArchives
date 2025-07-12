/***
|Location|http://visualtw.ouvaton.org/VisualTW.html|
|Version|1.0.4|
|CoreVersion|2.x|
|Browsers|Firefox 2.0.x, IE 6.0+, others|
!Description:
A bar to switch between tiddlers through tabs (like browser tabs bar).
!Demo:
* On [[homepage|http://visualtw.ouvaton.org/VisualTW.html]], open several tiddlers to use the tabs bar.
* See also http://groups.google.com/group/TiddlyWiki/msg/98992b8611d064ab where was posted a link to a "stand alone version" that you can use to test this plugin in any TW pages (by copying and pasting the code in the browser address bar).
!Installation:
*import this tiddler from [[homepage|http://visualtw.ouvaton.org/VisualTW.html]] (tagged as systemConfig)
*add a div named ''tiddlersBar'' in PageTemplate (optionally, adds ondblclick event handler to create new tiddler on this action).
*save and reload
*optionally, adjust StyleSheetTiddlersBar
!Configuration options :
<<option chkDisableTabsBar>> Disable the tabs bar (to print, by example).
<<option chkHideTabsBarWhenSingleTab >> Automatically hide the tabs bar when only one tiddler is displayed. 
<<option txtSelectedTiddlerTabButton>> Optional ''selected'' tab button (as in command bar). Example : editTiddler
!Code
***/
//{{{
config.options.chkDisableTabsBar = config.options.chkDisableTabsBar ? config.options.chkDisableTabsBar : false;
config.options.chkHideTabsBarWhenSingleTab  = config.options.chkHideTabsBarWhenSingleTab  ? config.options.chkHideTabsBarWhenSingleTab  : false;
config.options.txtSelectedTiddlerTabButton = config.options.txtSelectedTiddlerTabButton ? config.options.txtSelectedTiddlerTabButton : "";
config.macros.tiddlersBar = {
	tooltip : "see ",
	tooltipClose : "click here to close this tab",
	promptRename : "Enter tiddler new name",
	currentTiddler : "",
	previousState : false,
	handler: function(place,macroName,params) {
		if (config.macros.tiddlersBar.isShown())
			story.forEachTiddler(function(title,e){
				if (title==config.macros.tiddlersBar.currentTiddler){
					var d = createTiddlyElement(null,"nobr",null,"tab tabSelected");
					if (config.options.txtSelectedTiddlerTabButton && config.commands[config.options.txtSelectedTiddlerTabButton]) {
						var btn = createTiddlyButton(d, title, config.commands[config.options.txtSelectedTiddlerTabButton].tooltip ,config.macros.tiddlersBar.onSelectedTabButtonClick);
						btn.setAttribute("tiddler", title);
					}
					else
						createTiddlyText(d,title);
				}
				else {
					var d = createTiddlyElement(place,"nobr",null,"tab tabUnselected");
					var btn = createTiddlyButton(d,title,config.macros.tiddlersBar.tooltip + title,config.macros.tiddlersBar.onSelectTab);
					btn.setAttribute("tiddler", title);
				}
				var c = createTiddlyButton(d,"x",config.macros.tiddlersBar.tooltipClose,config.macros.tiddlersBar.onTabClose,"tabCloseButton");
				c.setAttribute("tiddler", title);
				if (place.childNodes) {
					place.insertBefore(document.createTextNode(" "),place.firstChild); // to allow break line here when many tiddlers are open
					place.insertBefore(d,place.firstChild); 
				}
				else place.appendChild(d);
			})
	}, 
	refresh: function(place,params){
		removeChildren(place);
		config.macros.tiddlersBar.handler(place,"tiddlersBar",params);
		if (config.macros.tiddlersBar.previousState!=config.macros.tiddlersBar.isShown()) {
			story.refreshAllTiddlers();
			if (config.macros.tiddlersBar.previousState) story.forEachTiddler(function(t,e){e.style.display="";});
			config.macros.tiddlersBar.previousState = !config.macros.tiddlersBar.previousState;
		}
	},
	isShown : function(){
		if (config.options.chkDisableTabsBar) return false;
		if (!config.options.chkHideTabsBarWhenSingleTab) return true;
		var cpt=0;
		story.forEachTiddler(function(){cpt++});
		return (cpt>1);
	},
	selectNextTab : function(){  //used when the current tab is closed (to select another tab)
		var previous="";
		story.forEachTiddler(function(title){
			if (!config.macros.tiddlersBar.currentTiddler) {
				story.displayTiddler(null,title);
				return;
			}
			if (title==config.macros.tiddlersBar.currentTiddler) {
				if (previous) {
					story.displayTiddler(null,previous);
					return;
				}
				else config.macros.tiddlersBar.currentTiddler=""; 	// so next tab will be selected
			}
			else previous=title;
			});		
	},
	onSelectTab : function(e){
		var t = this.getAttribute("tiddler");
		if (t) story.displayTiddler(null,t);
		return false;
	},
	onTabClose : function(e){
		var t = this.getAttribute("tiddler");
		if (t) {
			if(story.hasChanges(t) && !readOnly) {
				if(!confirm(config.commands.cancelTiddler.warning.format([t])))
				return false;
			}
			story.closeTiddler(t);
		}
		return false;
	},
	onSelectedTabButtonClick : function(event,src,title) {
		var t = this.getAttribute("tiddler");
		if (t && config.options.txtSelectedTiddlerTabButton && config.commands[config.options.txtSelectedTiddlerTabButton])
			config.commands[config.options.txtSelectedTiddlerTabButton].handler(event, src, t);
	},
	onTiddlersBarAction: function(event) {
		var source = event.target ? event.target.id : event.srcElement.id; // FF uses target and IE uses srcElement;
		if (source=="tiddlersBar") story.displayTiddler(null,'New Tiddler',DEFAULT_EDIT_TEMPLATE,false,null,null);
	}
}

story.coreCloseTiddler = story.coreCloseTiddler? story.coreCloseTiddler : story.closeTiddler;
story.coreDisplayTiddler = story.coreDisplayTiddler ? story.coreDisplayTiddler : story.displayTiddler;

story.closeTiddler = function(title,animate,unused) {
	if (title==config.macros.tiddlersBar.currentTiddler)
		config.macros.tiddlersBar.selectNextTab();
	story.coreCloseTiddler(title,animate,unused);
	var e=document.getElementById("tiddlersBar");
	if (e) config.macros.tiddlersBar.refresh(e,null);
}

story.displayTiddler = function(srcElement,title,template,animate,unused,customFields,toggle){
	story.coreDisplayTiddler(srcElement,title,template,animate,unused,customFields,toggle);
	if (config.macros.tiddlersBar.isShown()) {
		story.forEachTiddler(function(t,e){
			if (t!=title) e.style.display="none";
			else e.style.display="";
		})
		config.macros.tiddlersBar.currentTiddler=title;
	}
	var e=document.getElementById("tiddlersBar");
	if (e) config.macros.tiddlersBar.refresh(e,null);
}

ensureVisible=function (e) {return 0} //disable bottom scrolling (not useful now)

config.shadowTiddlers.StyleSheetTiddlersBar = "/*{{{*/\n" + "#tiddlersBar .button {border:0}\n" + "#tiddlersBar {padding : 1em 0.5em 0 0.5em}\n"+ "/*}}}*/";
store.addNotification("StyleSheetTiddlersBar", refreshStyles); 

//}}}