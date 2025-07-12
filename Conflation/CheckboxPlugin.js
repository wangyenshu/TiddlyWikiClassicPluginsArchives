/***
''CheckboxPlugin for TiddlyWiki version 2.0''
^^author: Eric Shulman
source: http://www.TiddlyTools.com/#CheckboxPlugin 
license: [[Creative Commons Attribution-ShareAlike 2.5 License|http://creativecommons.org/licenses/by-sa/2.5/]]^^

Add checkboxes to your tiddler content. Checkbox states can be preserved in the document by either automatically modifying the tiddler content or setting/removing tags on specified tiddlers, or they may be saved as local cookies by assigning an optional 'chkID' to the checkbox. Add custom javascript for programmatic initialization and onClick handling for any checkbox. Also provides access to checkbox DOM element data and tracks the checkbox state in TiddlyWiki's config.options[] internal data.

!!!!!Usage
<<<
The checkbox syntax, including all optional parameters, is contained inside a matched set of [ and ] brackets.
{{{ [x=id(title:tag){init_script}{onclick_script}] }}}

An alternative syntax lets you place the optional parameters ''outside'' the [ and ] brackets, and is provided for backward-compatibility with existing content that may include checkbox definitions based on earlier releases of this plugin:
{{{ [x]=id(title:tag){init_script}{onclick_script} }}}

//{{{
[ ]or[_] and [x]or[X]
//}}}
Simple checkboxes. The current unchecked/checked state is indicated by the character between the {{{[}}} and {{{]}}} brackets ("_" means unchecked, "X" means checked). When you click on a checkbox, the current state is retained by directly modifying the tiddler content to place the corresponding "_" or "X" character in between the brackets
//{{{
[x=id]
//}}}
Assign an optional ID to the checkbox so you can use {{{document.getElementByID("id")}}} to manipulate the checkbox DOM element, as well as tracking the current checkbox state in {{{config.options["id"]}}}. If the ID starts with "chk" the checkbox state will also be saved in a cookie, so it can be automatically restored whenever the checkbox is re-rendered (overrides any default {{{[x]}}} or {{{[_]}}} value). If a cookie value is kept, the "_" or "X" character in the tiddler content remains unchanged, and is only applied as the default when a cookie-based value is not currently defined.
//{{{
[x(title:tag)]
//}}}
Initializes and tracks the current checkbox state by setting or removing ("TogglyTagging") a particular tag value from a specified tiddler. If you omit the tiddler title (and the ":" separator), the specified tag is assigned to the current tiddler. If you omit the tag value, as in {{{(title:)}}}, the default tag, {{{checked}}}, is assumed. Omitting both the title and tag, {{{()}}}, tracks the checkbox state by setting the "checked" tag on the current tiddler. When tag tracking is used, the "_" or "X" character in the tiddler content remains unchanged, and is not used to set or track the checkbox state. If a tiddler title named in the tag does not exist, the checkbox state defaults to //unselected//. When the checkbox is subsequently changed to //selected//, it will automatically (and silently) create the missing tiddler and then add the tag to it.
//{{{
[x{javascript}{javascript}]
//}}}
You can define optional javascript code segments to add custom initialization and/or 'onClick' handling to a checkbox. The current checkbox state (and it's other DOM attributes) can be set or read from within these code segments by reference to the default context-object, 'this'.

The first code segment will be executed when the checkbox is initially displayed, so that you can programmatically determine it's starting checked/unchecked state. The second code segment (if present) is executed whenever the checkbox is clicked, so that you can perform programmed responses or intercept and override the checkbox state based on complex logic using the TW core API or custom functions defined in plugins (e.g. testing a particular tiddler title to see if certain tags are set or setting some tags when the checkbox is clicked).

Note: if you want to use the default checkbox initialization processing with a custom onclick function, use this syntax: {{{ [x=id{}{javascript}] }}} 
<<<
!!!!!Configuration
<<<
Normally, when a checkbox state is changed, the affected tiddlers are automatically re-rendered, so that any checkbox-dependent dynamic content can be updated. There are three possible tiddlers to be re-rendered, depending upon where the checkbox is placed, and what kind of storage method it is using.
*''container'': the tiddler in which the checkbox is displayed. (e.g., this tiddler)
*''tagged'': the tiddler that is being tagged (e.g., "~MyTask" when tagging "~MyTask:done")
*''tagging'': the "tag tiddler" (e.g., "~done" when tagging "~MyTask:done")
You can set the default refresh handling for all checkboxes in your document by using the following javascript syntax either in a systemConfig plugin, or as an inline script. (Substitute true/false values as desired):
{{{config.checkbox.refresh = { tagged:true, tagging:true, container:true };}}}

You can also override these defaults for any given checkbox by using an initialization function to set one or more of the refresh options. For example:
{{{[_{this.refresh.container=false}]}}}
<<<
!!!!!Examples
<<<
//{{{
[X] label
[_] label
//}}}
>checked and unchecked static default values
>[X] label
>[_] label
//{{{
[_=demo] label
//}}}
>document-based value (id='demo', no cookie)
>[_=demo] label
//{{{
[_=chkDemo] label
//}}}
>cookie-based value (id='chkDemo')
>[_=chkDemo] label
//{{{
[_(CheckboxPlugin:demotag)]
[_(CheckboxPlugin:demotag){this.refresh.tagged=this.refresh.container=false}]
//}}}
>tag-based value (TogglyTagging)
>[_(CheckboxPlugin:demotag)] toggle 'demotag' (and refresh tiddler display)
>[_(CheckboxPlugin:demotag){this.refresh.tagged=this.refresh.container=false}] toggle 'demotag' (no refresh)
>current tags: <script>return store.getTiddler(story.findContainingTiddler(place).id.substr(7)).tags.toString();</script>
><script label="click to view current tags">alert(store.getTiddler(story.findContainingTiddler(place).id.substr(7)).tags.toString());</script>
//{{{
[X{this.checked=true}{alert(this.checked?"on":"off")}] message box with checkbox state
//}}}
>custom init and onClick functions
>[X{this.checked=true}{alert(this.checked?"on":"off")}] message box with checkbox state
Retrieving option values:
config.options['demo']=<script>return config.options['demo']?"true":"false";</script>
config.options['chkDemo']=<script>return config.options['chkDemo']?"true":"false";</script>

!!!!!Installation
import (or copy/paste) the following tiddlers into your document:
''CheckboxPlugin'' (tagged with <<tag systemConfig>>)
<<<
!!!!!Revision History
<<<
2006.02.25 - 2.1.0
added configuration options to enable/disable forced refresh of tiddlers when toggling tags

2006.02.23 - 2.0.4
when toggling tags, force refresh of the tiddler containing the checkbox.

2006.02.23 - 2.0.3
when toggling tags, force refresh of the 'tagged tiddler' so that tag-related tiddler content (such as "to-do" lists) can be re-rendered.

2006.02.23 - 2.0.2
when using tag-based storage, allow use [[ and ]] to quote tiddler or tag names that contain spaces:
"""[x([[Tiddler with spaces]]:[[tag with spaces]])]"""

2006.01.10 - 2.0.1
when toggling tags, force refresh of the 'tagging tiddler'. For example, if you toggle the "systemConfig" tag on a plugin, the corresponding "systemConfig" TIDDLER will be automatically refreshed (if currently displayed), so that the 'tagged' list in that tiddler will remain up-to-date.

2006.01.04 - 2.0.0
update for ~TW2.0

2005.12.27 - 1.1.2
Fix lookAhead regExp handling for """[x=id]""", which had been including the "]" in the extracted ID. 
Added check for "chk" prefix on ID before calling saveOptionCookie()

2005.12.26 - 1.1.2
Corrected use of toUpperCase() in tiddler re-write code when comparing """[X]""" in tiddler content with checkbox state. Fixes a problem where simple checkboxes could be set, but never cleared.

2005.12.26 - 1.1.0
Revise syntax so all optional parameters are included INSIDE the [ and ] brackets. Backward compatibility with older syntax is supported, so content changes are not required when upgrading to the current version of this plugin. Based on a suggestion by GeoffSlocock

2005.12.25 - 1.0.0
added support for tracking checkbox state using tags ("TogglyTagging")
Revised version number for official post-beta release.

2005.12.08 - 0.9.3
support separate 'init' and 'onclick' function definitions.

2005.12.08 - 0.9.2
clean up lookahead pattern

2005.12.07 - 0.9.1
only update tiddler source content if checkbox state is actually different. Eliminates unnecessary tiddler changes (and 'unsaved changes' warnings)

2005.12.07 - 0.9.0
initial BETA release
<<<
!!!!!Credits
<<<
This feature was created by EricShulman from [[ELS Design Studios|http:/www.elsdesign.com]]
<<<
!!!!!Code
***/
//{{{
version.extensions.CheckboxPlugin = {major: 2, minor: 1, revision:0 , date: new Date(2006,2,25)};
//}}}

// // 1.2.x compatibility
//{{{
if (!window.story) window.story=window;
if (!store.getTiddler) store.getTiddler=function(title){return store.tiddlers[title]}
if (!store.addTiddler) store.addTiddler=function(tiddler){store.tiddlers[tiddler.title]=tiddler}
if (!store.deleteTiddler) store.deleteTiddler=function(title){delete store.tiddlers[title]}
//}}}

//{{{
config.checkbox = { refresh: { tagged:true, tagging:true, container:true } };
config.formatters.push( {
 name: "checkbox",
 match: "\\[[xX_ ][\\]\\=\\(\\{]",
 lookahead: "\\[([xX_ ])(\\])?(=[^\\s\\(\\]{]+)?(\\([^\\)]*\\))?({[^}]*})?({[^}]*})?(\\])?",
 handler: function(w)
 {
 var lookaheadRegExp = new RegExp(this.lookahead,"mg");
 lookaheadRegExp.lastIndex = w.matchStart;
 var lookaheadMatch = lookaheadRegExp.exec(w.source)
 if(lookaheadMatch && lookaheadMatch.index == w.matchStart)
 {
 // get params
 var checked=lookaheadMatch[1];
 var id=lookaheadMatch[3];
 var tag=lookaheadMatch[4];
 var fn_init=lookaheadMatch[5];
 var fn_click=lookaheadMatch[6];
 // create checkbox element
 var c = document.createElement("input");
 c.setAttribute("type","checkbox");
 c.onclick=onClickCheckbox;
 c.srcpos=w.matchStart+1; // remember location of "X"
 c.container=story.findContainingTiddler(w.output).id.substr(7); // tiddler containing checkbox
 c.refresh = { };
 c.refresh.container=config.checkbox.refresh.container;
 c.refresh.tagged=config.checkbox.refresh.tagged;
 c.refresh.tagging=config.checkbox.refresh.tagging;
 w.output.appendChild(c);
 // set default state
 c.checked=(checked.toUpperCase()=="X");
 // get/set state by ID
 if (id) {
 c.id=id.substr(1); // trim off leading "="
 if (config.options[c.id]!=undefined)
 c.checked=config.options[c.id];
 else
 config.options[c.id]=c.checked;
 }
 // get/set state by tag
 if (tag) {
 c.tiddler=c.container;
 c.tag=tag.substr(1,tag.length-2).trim(); // trim off parentheses
 var pos=c.tag.indexOf(":");
 if (pos==0) { c.tag=tag.substr(1); }
 if (pos>0) { c.tiddler=c.tag.substr(0,pos).replace(/\[\[/g,"").replace(/\]\]/g,""); c.tag=c.tag.substr(pos+1); }
 c.tag.replace(/\[\[/g,"").replace(/\]\]/g,"");
 if (!c.tag.length) c.tag="checked";
 var t=store.getTiddler(c.tiddler);
 c.checked = (t && t.tags)?(t.tags.find(c.tag)!=null):false;
 }
 if (fn_init) c.fn_init=fn_init.trim().substr(1,fn_init.length-2); // trim off surrounding { and } delimiters
 if (fn_click) c.fn_click=fn_click.trim().substr(1,fn_click.length-2);
 c.init=true; c.onclick(); c.init=false; // compute initial state and save in tiddler/config/cookie
 w.nextMatch = lookaheadMatch.index + lookaheadMatch[0].length;
 }
 }
 }
)
//}}}

//{{{
function onClickCheckbox()
{
 if (this.fn_init)
 // custom function hook to set initial state (run only once)
 { try { eval(this.fn_init); this.fn_init=null; } catch(e) { displayMessage("Checkbox init error: "+e.toString()); } }
 else if (this.fn_click)
 // custom function hook to override or react to changes in checkbox state
 { try { eval(this.fn_click) } catch(e) { displayMessage("Checkbox click error: "+e.toString()); } }
 if (this.id)
 // save state in config AND cookie (only when ID starts with 'chk')
 { config.options[this.id]=this.checked; if (this.id.substr(0,3)=="chk") saveOptionCookie(this.id); }
 if ((!this.id || this.id.substr(0,3)!="chk") && !this.tag) {
 // save state in tiddler content only if not using cookie or tag tracking
 var t=store.getTiddler(story.findContainingTiddler(this).id.substr(7));
 if (this.checked!=(t.text.substr(this.srcpos,1).toUpperCase()=="X")) { // if changed
 t.set(null,t.text.substr(0,this.srcpos)+(this.checked?"X":"_")+t.text.substr(this.srcpos+1),null,null,t.tags);
 store.setDirty(true);
 }
 }
 if (this.tag) {
 var t=store.getTiddler(this.tiddler);
 if (!t) { t=(new Tiddler()); t.set(this.tiddler,"",config.options.txtUserName,(new Date()),null); store.addTiddler(t); } 
 var tagged=(t.tags && t.tags.find(this.tag)!=null);
 if (this.checked && !tagged) { t.tags.push(this.tag); store.setDirty(true); }
 if (!this.checked && tagged) { t.tags.splice(t.tags.find(this.tag),1); store.setDirty(true); }
 // if tag state has been changed, force a display update
 if (this.checked!=tagged) {
 if (this.refresh.tagged) story.refreshTiddler(this.tiddler,null,true); // the TAGGED tiddler
 if (this.refresh.tagging) story.refreshTiddler(this.tag,null,true); // the TAGGING tiddler
 }
 }
 // refresh containing tiddler (but not during initial rendering, or we get an infinite loop!)
 if (!this.init && this.refresh.container && this.container!=this.tiddler)
 story.refreshTiddler(this.container,null,true); // the tiddler CONTAINING the checkbox
 return true;
}
//}}}