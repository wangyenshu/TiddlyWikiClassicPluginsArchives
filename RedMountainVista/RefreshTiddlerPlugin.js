/***
|''Name:''|RefreshTiddlerPlugin|
|''Description:''|Refresh an entire tiddler with optional periodic re-refresh|
|''Date:''|Oct 3, 2006|
|''Source:''|http://solo.dc3.com/tw/index.html#RefreshTiddlerPlugin|
|''Author:''|Bob Denny ~DC-3 Dreams, SP|
|''License:''|[[Creative Commons Attribution-ShareAlike 2.5 License|http://creativecommons.org/licenses/by-sa/2.5/]]|
|''Version:''|1.0.4|
|''~CoreVersion:''|2.0.11, 2.1.0|
|''Browser:''|Firefox 1.5; Internet Explorer 6.0; Safari|
|''Require:''|CheckboxPlugin (http://www.TiddlyTools.com/#CheckboxPlugin)|
This macro provides a tiddler with refresh control. Why would you want this?  Perhaps for a webcam feed which is updated every 15, 30, 60 secs etc... or RSS feed from an active news site etc.

At a minimum, a refresh button appears at the location of the macro invocation. Clicking this button causes the contents of the tiddler to be refreshed. Optionally, a checkbox may also be displayed with which the user can enable and disable automatic periodic refresh of  the tiddler at a specified interval.

There are three optional parameters
|!Parameter|!Description|
|''1''|Button label, default "Refresh"|
|''2''|Button tooltip, default "Refresh this tiddler"|
|''3''|Periodic refresh interval, sec., default 0 (no periodic refresh checkbox)|
!!Revision History
<<<
''2006.09.13 [1.0.1]'' Initial creation, several days
''2006.09.22 [1.0.2]'' Make periodic refresh checkbox optional
''2006.09.29 [1.0.3]'' Refresh checkbox cookie names different from RefreshIframe.
''2006.10.03 [1.0.4]'' Lint check, validate on TW 2.1.0.
<<<
!!Code
***/
//{{{
version.extensions.RefreshTiddler = {
 major: 1, minor: 0, revision: 4,
 date: new Date(2006, 10, 3), 
 type: 'macro',
 source: "#RefreshTiddlerPlugin"
};

config.macros.RefreshTiddler = 
{
	states: { },													// Associative array of refresh states indexed by tiddler name
    
	handler: function(place, macroName, params, wikifier, paramString, tiddler)
	{
		var tidTitle = tiddler.title;								// Shortcut
		if(!this.states[tidTitle]) this.states[tidTitle] = {		// Array of state objects for refreshed tiddlers
				butLabel: "",
				butTooltip: "",
				refInterval: 0,
				doRefresh: false,
				initPerRef: false,
				timerId: 0,
				chkBox: null
				};
		var state = this.states[tidTitle];							// Shortcut
		state.butLabel = params[0] ? params[0] : "Refresh"; 		// Make these react to edits
		state.butTooltip = params[1] ? params[1] : "Refresh this tiddler";
		state.refInterval = params[2] ? params[2] : 0;				// 0 = no periodic refresh checkbox
		var btn = createTiddlyButton(place, state.butLabel, state.butTooltip, this.onButClick);
		btn.name = tidTitle;										// Set button name to tiddler name (see onButClick())
		if(state.refInterval > 0) 									// If periodic refresh wanted
		{
			wikify(" [ =chkPerRefTid" + tiddler.created.convertToYYYYMMDDHHMM() + // Uniquify chkbox ID
				"{config.macros.RefreshTiddler.states[\"" + tidTitle + "\"].chkBox = this;}" +
				"{config.macros.RefreshTiddler.onChkClick(\"" +  tidTitle + "\");}] " + 
				state.butLabel + " every " + state.refInterval + " seconds", place);
			state.timerId = 0;
			if(!state.initPerRef) this.onChkClick(tidTitle);		// Simulate checkbox click (state already from cookie)
		}
	},
    
	onButClick: function(e) 
	{
		if(!e) e = window.event;
		var tidTitle = resolveTarget(e).name;						// Name is the tiddler name!
		//displayMessage("but " + tidTitle);
		story.refreshTiddler(tidTitle, null, true);
		return false;
	},
    
	onChkClick: function(tidTitle) 
	{
		var state = this.states[tidTitle];
		if(state.chkBox.checked) {
			if(state.timerId) clearTimeout(state.timerId);
			this.startRefresh(tidTitle); 
		} else { 
			state.doRefresh = false;
		}
		state.initPerRef = true;
	},
    
	startRefresh: function(tidTitle) 
	{
		var state = this.states[tidTitle];
		state.doRefresh = true;
		//displayMessage("st " + tidTitle + " " + state.refInterval);
		state.timerId = setTimeout("config.macros.RefreshTiddler.reRefresh(\"" + 
						tidTitle + "\")", state.refInterval * 1000);
	},
    
	reRefresh: function(tidTitle)
	{
		var state = this.states[tidTitle];
		state.timerId = 0;
		if(!state.doRefresh) return;
		// Kill re-refresh cycle if tiddler closed or edited
		var tidElem = document.getElementById(story.idPrefix + tidTitle);  // DON'T GET CUTE! THIS IS CORRECT!
		//**BUGBUG** Hardwired to EditTemplate!
		if(!tidElem || tidElem.attributes['template'].value == "EditTemplate") // Prevent hidden or editing
		{
			state.initPerRef = false;
			return;
		}
		//displayMessage("re " + tidTitle + " " + state.refInterval);
		story.refreshTiddler(tidTitle, null, true);
		state.timerId = setTimeout("config.macros.RefreshTiddler.reRefresh(\"" + 
						tidTitle + "\")", state.refInterval * 1000);
	}
};
//}}}
