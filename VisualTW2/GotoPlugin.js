/***
|Name|GotoPlugin|
|Source|http://www.TiddlyTools.com/#GotoPlugin|
|Version|1.4.3|
|Author|Eric Shulman - ELS Design Studios|
|License|http://www.TiddlyTools.com/#LegalStatements <br>and [[Creative Commons Attribution-ShareAlike 2.5 License|http://creativecommons.org/licenses/by-sa/2.5/]]|
|~CoreVersion|2.1|
|Type|plugin|
|Requires||
|Overrides||
|Description|view any tiddler by entering it's title - displays list of possible matches|

''View a tiddler by typing its title and pressing //enter//.''  Input just enough to uniquely match a single tiddler title and ''press //enter// to auto-complete the title for you!!''  If multiple titles match your input, a list is displayed.  You can scroll-and-click (or use arrows+enter) to select/view a tiddler, or press //escape// to close the listbox to resume typing.  When the listbox is ''//not//'' being displayed, press //escape// to clear the current text input and start over.

Note: ''At any time, you can move the focus directly to the text input field by using the ~ALT-G keyboard shortcut.''
!!!!!Examples
<<<
| //IMPORTANT NOTE:// ''As of version 1.4.0 (2007.04.25),<br>to avoid conflict with javascript reserved keywords<br>the {{{<<goto>>}}} macro has been renamed to {{{<<gotoTiddler>>}}}'' |
syntax: {{{<<gotoTiddler quiet insert inputstyle liststyle>>}}}
All parameters are optional.
* ''quiet'' prevents //automatic// display of the list as each character is typed.  To view the list when ''quiet'', use //down// or //enter//.
* ''insert'' causes the selected tiddler title to be inserted into the tiddler source currently being edited (use with EditTemplate)
* ''inputstyle'' and ''liststyle'' are CSS declarations that modify the default input and listbox styles.  Note: styles containing spaces must be surrounded by ({{{"..."}}} or {{{'...'}}}) or ({{{[[...]]}}}).
{{{<<gotoTiddler>>}}}
<<gotoTiddler>>
{{{<<gotoTiddler quiet>>}}}
<<gotoTiddler quiet>>
{{{<<goto width:20em width:20em>>}}}
<<gotoTiddler width:20em width:20em>>

You can also invoke the macro with the "insert" keyword.  When used in the [[EditTemplate]], like this:
{{{
<span macro="gotoTiddler insert"></span>
}}}
it allows you to type/select a tiddler title, and instantly insert a link to that title (e.g. {{{[[TiddlerName]]}}}) into the tiddler source being edited.
<<<
!!!!!Configuration
<<<
You can create a tiddler tagged with <<tag systemConfig>> to control the maximum height of the listbox of tiddlers/shadows/tags. //The default values are shown below://
//{{{
config.macros.gotoTiddler.listMaxSize=10;
//}}}
<<<
!!!!!Installation
<<<
import (or copy/paste) the following tiddlers into your document:
''GotoPlugin'' (tagged with <<tag systemConfig>>)
<<<
!!!!!Revisions
<<<
''2007.10.31 [1.4.3]'' removed extra trailing comma on last property of config.macros.gotoTiddler object.  This fixes an error under InternetExplorer that was introduced 6 days ago... sure, I should have found it sooner, but... ''WHY DON'T PEOPLE TELL ME WHEN THINGS ARE BROKEN!!!!''
''2007.10.25 [1.4.2]'' added onclick handler for input field, so that clicking in field hides the listbox.
''2007.10.25 [1.4.1]'' re-wrote getItems() to cache list of tiddlers/shadows/tags and use case-folded simple text match instead of regular expression to find matching tiddlers.  This *vastly* reduces processing overhead between keystrokes, especially for documents with many (>1000) tiddlers.  Also, removed local definition of replaceSelection(), now supported directly by the TW2.2+ core, as well as via backward-compatible plugin (see [[CoreTweaksArchive]]).
''2007.04.25 [1.4.0]'' renamed macro from "goto" to "gotoTiddler".  This was necessary to avoid a fatal syntax error in Opera (and other browsers) that require strict adherence to ECMAScript 1.5 standards which defines the identifier "goto" as "reserved for FUTURE USE"... *sigh*
''2007.04.21 [1.3.2]'' in html definition, removed DIV around droplist (see 1.2.6 below).  It created more layout problems then it solved. :-(
''2007.04.01 [1.3.1]'' in processItem(), ensure that correct textarea field is found by checking for edit=="text" attribute
''2007.03.30 [1.3.0]'' tweak SideBarOptions shadow to automatically add {{{<<goto>>}}} when using default sidebar content
''2007.03.30 [1.2.6]'' in html definition, added DIV around droplist to fix IE problem where list appears next to input field instead of below it.  
''2007.03.28 [1.2.5]'' in processItem(), set focus to text area before setting selection (needed for IE to get correct selection 'range')
''2007.03.28 [1.2.4]'' added prompt for 'pretty text' when inserting a link into tiddler content
''2007.03.28 [1.2.3]'' added local copy of core replaceSelection() and modified for different replace logic
''2007.03.27 [1.2.2]'' in processItem(), use story.getTiddlerField() to retrieve textarea control
''2007.03.26 [1.2.1]'' in html, use either 'onkeydown' (IE) or 'onkeypress' (Moz) event to process <esc> key sooner, to prevent <esc> from 'bubbling up' to the tiddler (which will close the current editor).
''2007.03.26 [1.2.0]'' added support for optional "insert" keyword param. When used in [[EditTemplate]], (e.g. {{{<span macro="goto insert"></span>}}}) it triggers alternative processing: instead of displaying the selected tiddler, that tiddler's title is inserted into a tiddler's textarea edit field surrounded by {{{[[...]]}}}.
''2006.05.10 [1.1.2]'' when filling listbox, set selection to 'heading' item... auto-select first tiddler title when down/enter moves focus into listbox
''2006.05.08 [1.1.1]'' added accesskey ("G") to input field html (also set when field gets focus).  Also, inputKeyHandler() skips non-printing/non-editing keys. 
''2006.05.08 [1.1.0]'' added heading to listbox for better feedback (also avoids problems with 1-line droplist)
''2006.05.07 [1.0.0]'' list matches against tiddlers/shadows/tags.  input field auto-completion... 1st enter=complete matching input (or show list)... 2nd enter=view tiddler.  optional "quiet" param controls when listbox appears.
''2006.05.06 [0.5.0]'' added handling for enter (13), escape(27), and down(40) keys.   Change 'ondblclick' to 'onclick' for list handler to view tiddlers (suggested by Florian Cauvin - prevents unintended trigger of tiddler editor).  shadow titles inserted into list instead of appended to the end.
''2006.05.05 [0.0.0]'' started
<<<
!!!!!Credits
>This feature was developed by EricShulman from [[ELS Design Studios|http:/www.elsdesign.com]]
!!!!!Code
***/
//{{{
version.extensions.gotoTiddler = {major: 1, minor: 4, revision: 3, date: new Date(2007,10,31)};

// automatically tweak shadow SideBarOptions to add <<gotoTiddler>> macro above <<search>>
config.shadowTiddlers.SideBarOptions=config.shadowTiddlers.SideBarOptions.replace(/<<search>>/,"{{button{goto}}}\n<<gotoTiddler>><<search>>");

config.macros.gotoTiddler= { 
	handler:
	function(place,macroName,params) {
		var quiet=(params[0] && params[0]=="quiet"); if (quiet) params.shift();
		var insert=(params[0] && params[0]=="insert"); if (insert) params.shift();
		var instyle=params.shift(); if (!instyle) instyle="";
		var liststyle=params.shift(); if (!liststyle) liststyle="";
		var keyevent=window.event?"onkeydown":"onkeypress";
		createTiddlyElement(place,"span").innerHTML
			=this.html.replace(/%keyevent%/g,keyevent).replace(/%insert%/g,insert).replace(/%quiet%/g,quiet).replace(/%instyle%/g,instyle).replace(/%liststyle%/g,liststyle);
	},

	html:
	'<form onsubmit="return false" style="display:inline;margin:0;padding:0">\
		<input name=gotoTiddler type=text autocomplete="off" accesskey="G" style="%instyle%"\
			title="enter a tiddler title"\
			onclick="this.form.list.style.display=\'none\';"\
			onfocus="this.select(); this.setAttribute(\'accesskey\',\'G\');"\
			%keyevent%="return config.macros.gotoTiddler.inputEscKeyHandler(event,this,this.form.list);"\
			onkeyup="return config.macros.gotoTiddler.inputKeyHandler(event,this,this.form.list,%quiet%,%insert%);">\
		<select name=list style="%liststyle%;display:none;position:absolute"\
			onchange="if (!this.selectedIndex) this.selectedIndex=1;"\
			onblur="this.style.display=\'none\';"\
			%keyevent%="return config.macros.gotoTiddler.selectKeyHandler(event,this,this.form.gotoTiddler,%insert%);"\
			onclick="return config.macros.gotoTiddler.processItem(this.value,this.form.gotoTiddler,this,%insert%);">\
		</select>\
	</form>',

	getItems:
	function(val) {
		if (!this.items.length || val.length<2) { // starting new search, refresh cached list of tiddlers/shadows/tags
			this.items=new Array();
			var tiddlers=store.getTiddlers("title","excludeLists");
			for(var t=0; t<tiddlers.length; t++) this.items.push(tiddlers[t].title);
			for (var t in config.shadowTiddlers) this.items.pushUnique(t);
			var tags=store.getTags();
			for(var t=0; t<tags.length; t++) this.items.pushUnique(tags[t][0]);
		}
		var found = [];
		var match=val.toLowerCase();
		for(var i=0; i<this.items.length; i++)
			if (this.items[i].toLowerCase().indexOf(match)!=-1) found.push(this.items[i]);
		return found;
	},
	items: [], // cached list of tiddlers/shadows/tags

	getItemSuffix:
	function(t) {
		if (store.tiddlerExists(t)) return "";  // tiddler
		if (store.isShadowTiddler(t)) return " (shadow)"; // shadow
		return " (tag)"; // tag 
	},

	keyProcessed:
	function(ev) { // utility function: exits handler and prevents browser from processing the keystroke
		ev.cancelBubble=true; // IE4+
		try{event.keyCode=0;}catch(e){}; // IE5
		if (window.event) ev.returnValue=false; // IE6
		if (ev.preventDefault) ev.preventDefault(); // moz/opera/konqueror
		if (ev.stopPropagation) ev.stopPropagation(); // all
		return false;
	},

	inputEscKeyHandler:
	function(event,here,list) {
		var key=event.keyCode;
		// escape... hide list (2nd esc=clears input)
		if (key==27) {
			if (list.style.display=="none")
				here.value=here.defaultValue;
			list.style.display="none";
			return this.keyProcessed(event);
		}
		return true; // key bubbles up
	},

	inputKeyHandler:
	function(event,here,list,quiet,insert) {
		var key=event.keyCode;
		// non-printing chars... bubble up, except: backspace=8, enter=13, space=32, down=40, delete=46
		if (key<48) switch(key) { case 8: case 13: case 32: case 40: case 46: break; default: return true; }
		// blank input... if down/enter... fall through (list all)... else, and hide list
		if (!here.value.length && !(key==40 || key==13))
			{ list.style.display="none"; return this.keyProcessed(event); }
		// find matching items...
		var found = this.getItems(here.value);
		// matched one item using enter key, but not an *exact* match... autocomplete input field
		if (found.length==1 && quiet && key==13 && here.value!=found[0])
			{ list.style.display="none"; here.value=found[0]; return this.keyProcessed(event); }
		// no match or exact match using enter key, create/show tiddler
		if (found.length<2 && key==13)
			return this.processItem(found.length?found[0]:here.value,here,list,insert);
		// quiet/no match, make sure list is hidden
		list.style.display=(!quiet && found.length)?"block":"none";
		// no matches, key bubbles up
		if (!found.length) return true;
		// using down/enter key shows/moves to list...
		if (key==40 || key==13)  { list.style.display="block"; list.focus(); }
		// finally, if list is showing, fill it with found results...
		if (list.style.display!="none") {
			while (list.length > 0) list.options[0]=null; // clear list
			found.sort(); // alpha by title
			var hdr=found.length==1?this.listMatchMsg:this.listHeading.format([found.length]); // list 'heading'
			list.options[0]=new Option(hdr,"",false,false);
			for (var t=0; t<found.length; t++)  // fill list...
				list.options[list.length]=new Option(found[t]+this.getItemSuffix(found[t]),found[t],false,false);
			list.size=(found.length<this.listMaxSize?found.length:this.listMaxSize)+1; // resize list...
			list.selectedIndex=(key==40 || key==13)?1:0;
		}
		return true; // key bubbles up
	},
	listMaxSize: 10,
	listHeading: 'Found %0 matching titles:',
	listMatchMsg: 'Press enter to open tiddler...',

	selectKeyHandler:
	function(event,list,editfield,insert) {
		if (event.keyCode==27) // escape... hide list, move to edit field
			{ editfield.focus(); list.style.display="none"; return this.keyProcessed(event); }
		if (event.keyCode==13 && list.value.length) // enter... view selected item
			{ this.processItem(list.value,editfield,list,insert); return this.keyProcessed(event); }
		return true; // key bubbles up
	},

	processItem:
	function(title,here,list,insert) {
		if (!title.length) return; here.value=title; list.style.display='none';
		if (insert) {
			var tidElem=story.findContainingTiddler(here); if (!tidElem) { here.focus(); return false; }
			var e=story.getTiddlerField(tidElem.getAttribute("tiddler"),"text");
			if (!e||e.getAttribute("edit")!="text") return false;
			var txt=prompt(this.askForText,title); if (!txt||!txt.length) { here.focus(); return false; }
			e.focus(); // put focus on target field before setting selection
			replaceSelection(e,"[["+txt+"|"+title+"]]"); // insert selected tiddler as a PrettyLink
		}
		else
			story.displayTiddler(null,title); // show selected tiddler
		return false;
	},
	askForText: "Enter the text to display for this link"
}
//}}}