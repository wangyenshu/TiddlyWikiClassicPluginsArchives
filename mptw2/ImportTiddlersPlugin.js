/***
''Import Tiddlers Plugin for TiddlyWiki version 1.2.x and 2.0''
^^author: Eric Shulman - ELS Design Studios
source: http://www.TiddlyTools.com/#ImportTiddlersPlugin
license: [[Creative Commons Attribution-ShareAlike 2.5 License|http://creativecommons.org/licenses/by-sa/2.5/]]^^

When many people share and edit copies of the same TiddlyWiki document, the ability to quickly collect all these changes back into a single, updated document that can then be redistributed to the entire group is very important. This plugin lets you selectively combine tiddlers from any two TiddlyWiki documents. It can also be very useful when moving your own tiddlers from document to document (e.g., when upgrading to the latest version of TiddlyWiki, or 'pre-loading' your favorite stylesheets into a new 'empty' TiddlyWiki document.)

!!!!!Inline interface (live)
<<<
<<importTiddlers inline>>
<<<
!!!!!Macro Syntax
<<<
{{{<<importTiddlers>>}}}
creates "import tiddlers" link. click to show/hide import control panel

{{{<<importTiddlers inline>>}}}
creates import control panel directly in tiddler content

{{{<<importTiddlers filter source quiet ask>>}}}
non-interactive 'automatic' import.
''filter'' determines which tiddlers will be automatically selected for importing. Use one of the following keywords:
>''"new"'' retrieves only tiddlers that are found in the import source document, but do not yet exist in the destination document
>''"changes"'' retrieves only tiddlers that exist in both documents for which the import source tiddler is newer than the existing tiddler
>''"updates"'' retrieves both ''new'' and ''changed'' tiddlers (this is the default action when none is specified)
>''"all"'' retrieves ALL tiddlers from the import source document, even if they have not been changed.
''source'' is the location of the imported document. It can be either a local document or an URL:
>filename is any local path/file, in whatever format your system requires
>URL is any remote web location that starts with "http://" or "https://"
''"quiet"'' (optional)
>supresses all status message during the import processing (e.g., "opening local file...", "found NN tiddlers..." etc). Note that if ANY tiddlers are actualy imported, a final information message will still be displayed (along with the ImportedTiddlers report), even when 'quiet' is specified. This ensures that changes to your document cannot occur without any visible indication at all.
''"ask"'' (optional)
>adds interactive confirmation. A browser message box (OK/Cancel) is displayed for each tiddler that will be imported, so that you can manually bypass any tiddlers that you do not want to import.

''Special tag values: importReplace and importPublic''

By adding these special tags to an existing tiddler, you can precisely control whether or not to allow updates to that tiddler as well as decide which tiddlers in your document can be automatically imported by others.
*''For maximum safety, the default action is to prevent existing tiddlers from being unintentionally overwritten by incoming tiddlers.'' To allow an existing tiddler to be overwritten by an imported tiddler, you must tag the existing tiddler with ''<<tag importReplace>>''
*''For maximum privacy, the default action for //outgoing// tiddlers is to NOT automatically share your tiddlers with others.'' To allow a tiddler in your document to be shared via auto-import actions by others, you must tag it with ''<<tag importPublic>>''
//Note: these tags are only applied when using the auto-import processing. When using the interactive control panel, all tiddlers in the imported document are available in the listbox, regardless of their tag values.//
<<<
!!!!!Interactive Usage
<<<
When used interactively, a control panel is displayed consisting of an "import source document" filename input (text field plus a ''[Browse...]'' button), a listbox of available tiddlers, a "differences only" checkbox, an "add tags" input field and four push buttons: ''[open]'', ''[select all]'', ''[import]'' and ''[close]''.

Press ''[browse]'' to select a TiddlyWiki document file to import. You can also type in the path/filename or a remote document URL (starting with http://)and press ''[open]''. //Note: There may be some delay to permit the browser time to access and load the document before updating the listbox with the titles of all tiddlers that are available to be imported.//

Select one or more titles from the listbox (hold CTRL or SHIFT while clicking to add/remove the highlight from individual list items). You can press ''[select all]'' to quickly highlight all tiddler titles in the list. Use the ''[-]'', ''[+]'', or ''[=]'' links to adjust the listbox size so you can view more (or less) tiddler titles at one time. When you have chosen the tiddlers you want to import and entered any extra tags, press ''[import]'' to begin copying them to the current TiddlyWiki document.

''select: all, new, changes, or differences''

You can click on ''all'', ''new'', ''changes'', or ''differences'' to automatically select a subset of tiddlers from the list. This makes it very quick and easy to find and import just the updated tiddlers you are interested in:
>''"all"'' selects ALL tiddlers from the import source document, even if they have not been changed.
>''"new"'' selects only tiddlers that are found in the import source document, but do not yet exist in the destination document
>''"changes"'' selects only tiddlers that exist in both documents but that are newer in the source document
>''"differences"'' selects all new and existing tiddlers that are different from the destination document (even if destination tiddler is newer)

''Import Tagging:''

Tiddlers that have been imported can be automatically tagged, so they will be easier to find later on, after they have been added to your document. New tags are entered into the "add tags" input field, and then //added// to the existing tags for each tiddler as it is imported.

''Skip, Rename, Merge, or Replace:''

When importing a tiddler whose title is identical to one that already exists, the import process pauses and the tiddler title is displayed in an input field, along with four push buttons: ''[skip]'', ''[rename]'', ''[merge]'' and ''[replace]''.

To bypass importing this tiddler, press ''[skip]''. To import the tiddler with a different name (so that both the tiddlers will exist when the import is done), enter a new title in the input field and then press ''[rename]''. Press ''[merge]'' to combine the content from both tiddlers into a single tiddler. Press ''[replace]'' to overwrite the existing tiddler with the imported one, discarding the previous tiddler content.

//Note: if both the title ''and'' modification date/////time match, the imported tiddler is assumed to be identical to the existing one, and will be automatically skipped (i.e., not imported) without asking.//

''Import Report History''

When tiddlers are imported, a report is generated into ImportedTiddlers, indicating when the latest import was performed, the number of tiddlers successfully imported, from what location, and by whom. It also includes a list with the title, date and author of each tiddler that was imported.

When the import process is completed, the ImportedTiddlers report is automatically displayed for your review. If more tiddlers are subsequently imported, a new report is //added// to ImportedTiddlers, above the previous report (i.e., at the top of the tiddler), so that a reverse-chronological history of imports is maintained.

If a cumulative record is not desired, the ImportedTiddlers report may be deleted at any time. A new ImportedTiddlers report will be created the next time tiddlers are imported.

Note: You can prevent the ImportedTiddlers report from being generated for any given import activity by clearing the "create a report" checkbox before beginning the import processing.

<<<
!!!!!Installation
<<<
copy/paste the following tiddlers into your document:
''ImportTiddlersPlugin'' (tagged with <<tag systemConfig>>)

create/edit ''SideBarOptions'': (sidebar menu items) 
^^Add "< < ImportTiddlers > >" macro^^

''Quick Installation Tip #1:''
If you are using an unmodified version of TiddlyWiki (core release version <<version>>), you can get a new, empty TiddlyWiki with the Import Tiddlers plugin pre-installed (''[[download from here|TW+ImportExport.html]]''), and then simply import all your content from your old document into this new, empty document.
<<<
!!!!!Revision History
<<<
''2006.02.17 [2.6.0]''
Removed "differences only" listbox display mode, replaced with selection filter 'presets': all/new/changes/differences. Also fixed initialization handling for "add new tags" so that checkbox state is correctly tracked when panel is first displayed.
''2006.02.16 [2.5.4]''
added checkbox options to control "import remote tags" and "keep existing tags" behavior, in addition to existing "add new tags" functionality.
''2006.02.14 [2.5.3]''
FF1501 corrected unintended global 't' (loop index) in importReport() and autoImportTiddlers()
''2006.02.10 [2.5.2]''
corrected unintended global variable in importReport().
''2006.02.05 [2.5.1]''
moved globals from window.* to config.macros.importTiddlers.* to avoid FireFox 1.5.0.1 crash bug when referencing globals
''2006.01.18 [2.5.0]''
added checkbox for "create a report". Default is to create/update the ImportedTiddlers report. Clear the checkbox to skip this step.
''2006.01.15 [2.4.1]''
added "importPublic" tag and inverted default so that auto sharing is NOT done unless tagged with importPublic
''2006.01.15 [2.4.0]''
Added support for tagging individual tiddlers with importSkip, importReplace, and/or importPrivate to control which tiddlers can be overwritten or shared with others when using auto-import macro syntax. Defaults are to SKIP overwriting existing tiddlers with imported tiddlers, and ALLOW your tiddlers to be auto-imported by others.
''2006.01.15 [2.3.2]''
Added "ask" parameter to confirm each tiddler before importing (for use with auto-importing)
''2006.01.15 [2.3.1]''
Strip TW core scripts from import source content and load just the storeArea into the hidden IFRAME. Makes loading more efficient by reducing the document size and by preventing the import document from executing its TW initialization (including plugins). Seems to resolve the "Found 0 tiddlers" problem. Also, when importing local documents, use convertUTF8ToUnicode() to convert the file contents so support international characters sets.
''2006.01.12 [2.3.0]''
Reorganized code to use callback function for loading import files to support event-driven I/O via an ASYNCHRONOUS XMLHttpRequest. Let's processing continue while waiting for remote hosts to respond to URL requests. Added non-interactive 'batch' macro mode, using parameters to specify which tiddlers to import, and from what document source. Improved error messages and diagnostics, plus an optional 'quiet' switch for batch mode to eliminate //most// feedback.
''2006.01.11 [2.2.0]''
Added "[by tags]" to list of tiddlers, based on code submitted by BradleyMeck
''2006.01.09 [2.1.1]''
When a URL is typed in, and then the "open" button is pressed, it generates both an onChange event for the file input and a click event for open button. This results in multiple XMLHttpRequest()'s which seem to jam things up quite a bit. I removed the onChange handling for file input field. To open a file (local or URL), you must now explicitly press the "open" button in the control panel.
''2006.01.08 [2.1.0]''
IMPORT FROM ANYWHERE!!! re-write getImportedTiddlers() logic to either read a local file (using local I/O), OR... read a remote file, using a combination of XML and an iframe to permit cross-domain reading of DOM elements. Adapted from example code and techniques courtesy of Jonny LeRoy.
''2006.01.06 [2.0.2]''
When refreshing list contents, fixed check for tiddlerExists() when "show differences only" is selected, so that imported tiddlers that don't exist in the current file will be recognized as differences and included in the list.
''2006.01.04 [2.0.1]''
When "show differences only" is NOT checked, import all tiddlers that have been selected even when they have a matching title and date.
''2005.12.27 [2.0.0]''
Update for TW2.0
Defer initial panel creation and only register a notification function when panel first is created
''2005.12.22 [1.3.1]''
tweak formatting in importReport() and add 'discard report' link to output
''2005.12.03 [1.3.0]''
Dynamically create/remove importPanel as needed to ensure only one instance of interface elements exists, even if there are multiple instances of macro embedding. Also, dynamically create/recreate importFrame each time an external TW document is loaded for importation (reduces DOM overhead and ensures a 'fresh' frame for each document)
''2005.11.29 [1.2.1]''
fixed formatting of 'detail info' in importReport()
''2005.11.11 [1.2.0]''
added 'inline' param to embed controls in a tiddler
''2005.11.09 [1.1.0]''
only load HTML and CSS the first time the macro handler is called. Allows for redundant placement of the macro without creating multiple instances of controls with the same ID's.
''2005.10.25 [1.0.5]''
fixed typo in importReport() that prevented reports from being generated
''2005.10.09 [1.0.4]''
combined documentation with plugin code instead of using separate tiddlers
''2005.08.05 [1.0.3]''
moved CSS and HTML definitions into plugin code instead of using separate tiddlers
''2005.07.27 [1.0.2]''
core update 1.2.29: custom overlayStyleSheet() replaced with new core setStylesheet()
''2005.07.23 [1.0.1]''
added parameter checks and corrected addNotification() usage
''2005.07.20 [1.0.0]''
Initial Release
<<<
!!!!!Credits
<<<
This feature was developed by EricShulman from [[ELS Design Studios|http:/www.elsdesign.com]]
<<<
!!!!!Code
***/

// // Version
//{{{
version.extensions.importTiddlers = {major: 2, minor: 6, revision: 0, date: new Date(2006,2,17)};
//}}}

// // 1.2.x compatibility
//{{{
if (!window.story) window.story=window;
if (!store.getTiddler) store.getTiddler=function(title){return store.tiddlers[title]}
if (!store.addTiddler) store.addTiddler=function(tiddler){store.tiddlers[tiddler.title]=tiddler}
if (!store.deleteTiddler) store.deleteTiddler=function(title){delete store.tiddlers[title]}
//}}}

// // IE needs explicit global scoping for functions/vars called from browser events
//{{{
window.onClickImportButton=onClickImportButton;
window.loadImportFile=loadImportFile;
window.refreshImportList=refreshImportList;
//}}}

// // default cookie/option values
//{{{
if (!config.options.chkImportReport) config.options.chkImportReport=true;
//}}}


// // ''MACRO DEFINITION''

//{{{
config.macros.importTiddlers = { };
config.macros.importTiddlers = {
 label: "import tiddlers",
 prompt: "Copy tiddlers from another document",
 countMsg: "%0 tiddlers selected for import",
 src: "", // path/filename or URL of document to import
 inbound: null, // hash-indexed array of tiddlers from other document
 newTags: "", // text of tags added to imported tiddlers
 addTags: true, // add new tags to imported tiddlers
 listsize: 8, // # of lines to show in imported tiddler list
 importTags: true, // include tags from remote source document when importing a tiddler
 keepTags: true, // retain existing tags when replacing a tiddler
 index: 0, // current processing index in import list
 sort: "" // sort order for imported tiddler listbox
};

config.macros.importTiddlers.handler = function(place,macroName,params) {
 // LINK WITH FLOATING PANEL
 if (!params[0]) {
 createTiddlyButton(place,this.label,this.prompt,onClickImportMenu);
 return;
 }
 // INLINE TIDDLER CONTENT
 if (params[0]=="inline") {
 createImportPanel(place);
 document.getElementById("importPanel").style.position="static";
 document.getElementById("importPanel").style.display="block";
 return;
 }
 // NON-INTERACTIVE BATCH MODE
 switch (params[0]) {
 case 'all':
 case 'new':
 case 'changes':
 case 'updates':
 var filter=params.shift();
 break;
 default:
 var filter="updates";
 break;
 } 
 if (!params[0]||!params[0].length) return; // filename is required
 config.macros.importTiddlers.src=params.shift();
 var quiet=(params[0]=="quiet"); if (quiet) params.shift();
 var ask=(params[0]=="ask"); if (ask) params.shift();
 config.macros.importTiddlers.inbound=null; // clear the imported tiddler buffer
 // load storeArea from a hidden IFRAME, then apply import rules and add/replace tiddlers
 loadImportFile(config.macros.importTiddlers.src,filter,quiet,ask,autoImportTiddlers);
}
//}}}

// // ''READ TIDDLERS FROM ANOTHER DOCUMENT''

//{{{
function loadImportFile(src,filter,quiet,ask,callback) {
 if (!quiet) clearMessage();
 // LOCAL FILE
 if ((src.substr(0,7)!="http://")&&(src.substr(0,8)!="https://")) {
 if (!quiet) displayMessage("Opening local document: "+ src);
 var txt=loadFile(src);
 if(!txt) { if (!quiet) displayMessage("Could not open local document: "+src); }
 else {
 var s="<html><body>"+txt.substr(txt.indexOf('<div id="storeArea">'));
 if (!quiet) displayMessage(txt.length+" bytes in document. ("+s.length+" bytes used for tiddler storage)");
 config.macros.importTiddlers.inbound = readImportedTiddlers(convertUTF8ToUnicode(s));
 var count=config.macros.importTiddlers.inbound?config.macros.importTiddlers.inbound.length:0;
 if (!quiet) displayMessage("Found "+count+" tiddlers in "+src);
 if (callback) callback(src,filter,quiet,ask);
 }
 return;
 }
 // REMOTE FILE
 var x; // XML object
 try {x = new XMLHttpRequest()}
 catch(e) {
 try {x = new ActiveXObject("Msxml2.XMLHTTP")}
 catch (e) {
 try {x = new ActiveXObject("Microsoft.XMLHTTP")}
 catch (e) { return }
 }
 }
 x.onreadystatechange = function() {
 if (x.readyState == 4) {
 if (x.status == 200) {
 var sa="<html><body>"+x.responseText.substr(x.responseText.indexOf('<div id="storeArea">'));
 if (!quiet) displayMessage(x.responseText.length+" bytes in document. ("+sa.length+" bytes used for tiddler storage)");
 config.macros.importTiddlers.inbound = readImportedTiddlers(sa);
 var count=config.macros.importTiddlers.inbound?config.macros.importTiddlers.inbound.length:0;
 if (!quiet) displayMessage("Found "+count+" tiddlers in "+src);
 if (callback) callback(src,filter,quiet,ask);
 }
 else
 if (!quiet) displayMessage("Could not open remote document:"+ src+" (error="+x.status+")");
 }
 }
 if (document.location.protocol=="file:") { // UniversalBrowserRead only works from a local file context
 try {netscape.security.PrivilegeManager.enablePrivilege('UniversalBrowserRead')}
 catch (e) { if (!quiet) displayMessage(e.description?e.description:e.toString()); }
 }
 if (!quiet) displayMessage("Opening remote document: "+ src);
 try {
 var url=src+(src.indexOf('?')<0?'?':'&')+'nocache='+Math.random();
 x.open("GET",url,true);
 x.overrideMimeType('text/html');
 x.send(null);
 }
 catch (e) {
 if (!quiet) {
 displayMessage("Could not open remote document: "+src);
 displayMessage(e.description?e.description:e.toString());
 }
 }
}

function readImportedTiddlers(txt)
{
 var importedTiddlers = [];
 // create frame
 var f=document.getElementById("importFrame");
 if (f) document.body.removeChild(f);
 f=document.createElement("iframe");
 f.id="importFrame";
 f.style.width="0px"; f.style.height="0px"; f.style.border="0px";
 document.body.appendChild(f);
 // get document
 var d=f.document;
 if (f.contentDocument) d=f.contentDocument; // For NS6
 else if (f.contentWindow) d=f.contentWindow.document; // For IE5.5 and IE6
 // load source into document
 d.open(); d.writeln(txt); d.close();
 // read tiddler DIVs from storeArea DOM element 
 var importStore = [];
 var importStoreArea = d.getElementById("storeArea");
 if (!importStoreArea || !(importStore=importStoreArea.childNodes) || (importStore.length==0)) { return null; }
 importStoreArea.normalize();
 for(var t = 0; t < importStore.length; t++) {
 var e = importStore[t];
 var title = null;
 if(e.getAttribute)
 title = e.getAttribute("tiddler");
 if(!title && e.id && (e.id.substr(0,5) == "store"))
 title = e.id.substr(5);
 if(title && title != "") {
 var theImported = new Tiddler();
 theImported.loadFromDiv(e,title);
 importedTiddlers.push(theImported);
 }
 }
 return importedTiddlers;
}
//}}}

// // ''NON-INTERACTIVE IMPORT''

// // import all/new/changed tiddlers into store, replacing or adding tiddlers as needed
//{{{
function autoImportTiddlers(src,filter,quiet,ask)
{
 var count=0;
 if (config.macros.importTiddlers.inbound) for (var t=0;t<config.macros.importTiddlers.inbound.length;t++) {
 var theImported = config.macros.importTiddlers.inbound[t];
 var theExisting = store.getTiddler(theImported.title);

 // only import tiddlers if tagged with "importPublic"
 if (theImported.tags && theImported.tags.find("importPublic")==null)
 { config.macros.importTiddlers.inbound[t].status=""; continue; } // status=="" means don't show in report

 // never import the "ImportedTiddlers" history from the other document...
 if (theImported.title=='ImportedTiddlers')
 { config.macros.importTiddlers.inbound[t].status=""; continue; } // status=="" means don't show in report

 // check existing tiddler for importReplace, or systemConfig tags
 config.macros.importTiddlers.inbound[t].status="added"; // default - add any tiddlers not filtered out
 if (store.tiddlerExists(theImported.title)) {
 config.macros.importTiddlers.inbound[t].status="replaced";
 if (!theExisting.tags||(theExisting.tags.find("importReplace")==null))
 { config.macros.importTiddlers.inbound[t].status="not imported - tiddler already exists (use importReplace to allow changes)"; continue; }
 if ((theExisting.tags.find("systemConfig")!=null)||(theImported.tags.find("systemConfig")!=null))
 config.macros.importTiddlers.inbound[t].status+=" - WARNING: an active systemConfig plugin has been added or updated";
 }

 // apply the all/new/changes/updates filter 
 if (filter!="all") {
 if ((filter=="new") && store.tiddlerExists(theImported.title))
 { config.macros.importTiddlers.inbound[t].status="not imported - tiddler already exists"; continue; }
 if ((filter=="changes") && !store.tiddlerExists(theImported.title))
 { config.macros.importTiddlers.inbound[t].status="not imported - new tiddler"; continue; }
 if (store.tiddlerExists(theImported.title) && ((theExisting.modified.getTime()-theImported.modified.getTime())>=0))
 { config.macros.importTiddlers.inbound[t].status="not imported - tiddler is unchanged"; continue; }
 }

 // get confirmation if required
 if (ask && !confirm("Import "+(theExisting?"updated":"new")+" tiddler '"+theImported.title+"'\nfrom "+src))
 { config.macros.importTiddlers.inbound[t].status="skipped - cancelled by user"; continue; }

 // DO THE IMPORT!!
 store.addTiddler(theImported); count++;
 }
 importReport(quiet); // generate a report (as needed) and display it if not 'quiet'
 if (count) store.setDirty(true); 
 // always show final message when tiddlers were actually imported
 if (!quiet||count) displayMessage("Imported "+count+" tiddler"+(count!=1?"s":"")+" from "+src);
}
//}}}

// // ''REPORT GENERATOR''

//{{{
function importReport(quiet)
{
 if (!config.macros.importTiddlers.inbound) return;
 // DEBUG alert('importReport: start');

 // if import was not completed, the Ask panel will still be open... close it now.
 var askpanel=document.getElementById('importAskPanel'); if (askpanel) askpanel.style.display='none'; 
 // get the alphasorted list of tiddlers
 var tiddlers = config.macros.importTiddlers.inbound;
 tiddlers.sort(function (a,b) {if(a['title'] == b['title']) return(0); else return (a['title'] < b['title']) ? -1 : +1; });
 // gather the statistics
 var count=tiddlers.length;
 var added=0; var replaced=0; var renamed=0; var skipped=0; var merged=0;
 for (var t=0; t<count; t++)
 if (tiddlers[t].status)
 {
 if (tiddlers[t].status=='added') added++;
 if (tiddlers[t].status.substr(0,7)=='skipped') skipped++;
 if (tiddlers[t].status.substr(0,6)=='rename') renamed++;
 if (tiddlers[t].status.substr(0,7)=='replace') replaced++;
 if (tiddlers[t].status.substr(0,6)=='merged') merged++;
 }
 var omitted=count-(added+replaced+renamed+skipped+merged);
 // DEBUG alert('stats done: '+count+' total, '+added+' added, '+skipped+' skipped, '+renamed+' renamed, '+replaced+' replaced, '+merged+' merged');
 // skip the report if nothing was imported
 if (added+replaced+renamed+merged==0) return;
 // skip the report if not desired by user
 if (!config.options.chkImportReport) {
 // reset status flags
 for (var t=0; t<count; t++) config.macros.importTiddlers.inbound[t].status="";
 // refresh display since tiddlers have been imported
 store.notifyAll();
 // quick message area summary report
 var msg=(added+replaced+renamed+merged)+' of '+count+' tiddler'+((count!=1)?'s':"");
 msg+=' imported from '+config.macros.importTiddlers.src.replace(/\\/g,'/')
 displayMessage(msg);
 return;
 }
 // create the report tiddler (if not already present)
 var tiddler = store.getTiddler('ImportedTiddlers');
 if (!tiddler) // create new report tiddler if it doesn't exist
 {
 tiddler = new Tiddler();
 tiddler.title = 'ImportedTiddlers';
 tiddler.text = "";
 }
 // format the report header
 var now = new Date();
 var newText = "";
 newText += "On "+now.toLocaleString()+", "+config.options.txtUserName+" imported tiddlers from\n";
 newText += "[["+config.macros.importTiddlers.src+"|"+config.macros.importTiddlers.src+"]]:\n";
 newText += "<"+"<"+"<\n";
 newText += "Out of "+count+" tiddler"+((count!=1)?"s ":" ")+" in {{{"+config.macros.importTiddlers.src.replace(/\\/g,'/')+"}}}:\n";
 if (added+renamed>0)
 newText += (added+renamed)+" new tiddler"+(((added+renamed)!=1)?"s were":" was")+" added to your document.\n";
 if (merged>0)
 newText += merged+" tiddler"+((merged!=1)?"s were":" was")+" merged with "+((merged!=1)?"":"an ")+"existing tiddler"+((merged!=1)?"s":"")+".\n"; 
 if (replaced>0)
 newText += replaced+" existing tiddler"+((replaced!=1)?"s were":" was")+" replaced.\n"; 
 if (skipped>0)
 newText += skipped+" tiddler"+((skipped!=1)?"s were":" was")+" skipped after asking.\n"; 
 if (omitted>0)
 newText += omitted+" tiddler"+((omitted!=1)?"s":"")+((omitted!=1)?" were":" was")+" not imported.\n";
 if (config.macros.importTiddlers.addTags && config.macros.importTiddlers.newTags.trim().length)
 newText += "imported tiddlers were tagged with: \""+config.macros.importTiddlers.newTags+"\"\n";
 // output the tiddler detail and reset status flags
 for (var t=0; t<count; t++)
 if (tiddlers[t].status!="")
 {
 newText += "#["+"["+tiddlers[t].title+"]"+"]";
 newText += ((tiddlers[t].status!="added")?("^^\n"+tiddlers[t].status+"^^"):"")+"\n";
 config.macros.importTiddlers.inbound[t].status="";
 }
 newText += "<"+"<"+"<\n";
 // output 'discard report' link
 newText += "<html><input type=\"button\" href=\"javascript:;\" ";
 newText += "onclick=\"story.closeTiddler('"+tiddler.title+"'); store.deleteTiddler('"+tiddler.title+"');\" ";
 newText += "value=\"discard report\"></html>";
 // update the ImportedTiddlers content and show the tiddler
 tiddler.text = newText+((tiddler.text!="")?'\n----\n':"")+tiddler.text;
 tiddler.modifier = config.options.txtUserName;
 tiddler.modified = new Date();
 store.addTiddler(tiddler);
 if (!quiet) story.displayTiddler(null,"ImportedTiddlers",1,null,null,false);
 story.refreshTiddler("ImportedTiddlers",1,true);
 // refresh the display
 store.notifyAll();
}
//}}}

// // ''INTERFACE DEFINITION''

// // Handle link click to create/show/hide control panel
//{{{
function onClickImportMenu(e)
{
 if (!e) var e = window.event;
 var parent=resolveTarget(e).parentNode;
 var panel = document.getElementById("importPanel");
 if (panel==undefined || panel.parentNode!=parent)
 panel=createImportPanel(parent);
 var isOpen = panel.style.display=="block";
 if(config.options.chkAnimate)
 anim.startAnimating(new Slider(panel,!isOpen,e.shiftKey || e.altKey,"none"));
 else
 panel.style.display = isOpen ? "none" : "block" ;
 e.cancelBubble = true;
 if (e.stopPropagation) e.stopPropagation();
 return(false);
}
//}}}

// // Create control panel: HTML, CSS, register for notification
//{{{
function createImportPanel(place) {
 var panel=document.getElementById("importPanel");
 if (panel) { panel.parentNode.removeChild(panel); }
 setStylesheet(config.macros.importTiddlers.css,"importTiddlers");
 panel=createTiddlyElement(place,"span","importPanel",null,null)
 panel.innerHTML=config.macros.importTiddlers.html;
 store.addNotification(null,refreshImportList); // refresh listbox after every tiddler change
 refreshImportList();
 return panel;
}
//}}}

// // CSS
//{{{
config.macros.importTiddlers.css = '\
#importPanel {\
 display: none; position:absolute; z-index:11; width:35em; right:105%; top:3em;\
 padding: 0.5em; margin:0em; text-align:left; font-size: 8pt;\
 background-color: #eee; color:#000000; \
 border:1px solid black; border-bottom-width: 3px; border-right-width: 3px; -moz-border-radius:1em;\
}\
#importPanel a { color:#009; }\
#importPanel input { width: 98%; margin: 1px; font-size:8pt; }\
#importPanel select { width: 98%; margin: 1px; font-size:8pt; }\
#importPanel .importButton { padding: 0em; margin: 0px; font-size:8pt; }\
#importPanel .importListButton { padding:0em 0.25em 0em 0.25em; color: #000000; display:inline }\
#importAskPanel { display:none; margin:0.5em 0em 0em 0em; }\
';
//}}}

// // HTML
//{{{
config.macros.importTiddlers.html = '\
<span style="float:left; padding:1px; white-space:nowrap">\
 import from source document\
</span>\
<span style="float:right; padding:1px; white-space:nowrap">\
 <input type=checkbox id="chkImportReport" checked style="height:1em; width:auto"\
 onClick="config.options[\'chkImportReport\']=this.checked;">create a report\
</span>\
<input type="file" id="fileImportSource" size=56\
 onKeyUp="config.macros.importTiddlers.src=this.value"\
 onChange="config.macros.importTiddlers.src=this.value;">\
<span style="float:left; padding:1px; white-space:nowrap">\
 select:\
 <a href="JavaScript:;" id="importSelectAll"\
 onclick="onClickImportButton(this)" title="select all tiddlers">\
 &nbsp;all&nbsp;</a>\
 <a href="JavaScript:;" id="importSelectNew"\
 onclick="onClickImportButton(this)" title="select tiddlers not already in destination document">\
 &nbsp;added&nbsp;</a> \
 <a href="JavaScript:;" id="importSelectChanges"\
 onclick="onClickImportButton(this)" title="select tiddlers that have been updated in source document">\
 &nbsp;changes&nbsp;</a> \
 <a href="JavaScript:;" id="importSelectDifferences"\
 onclick="onClickImportButton(this)" title="select tiddlers that have been added or are different from existing tiddlers">\
 &nbsp;differences&nbsp;</a> \
 <a href="JavaScript:;" id="importToggleFilter"\
 onclick="onClickImportButton(this)" title="show/hide selection filter">\
 &nbsp;filter&nbsp;</a> \
</span>\
<span style="float:right; padding:1px; white-space:nowrap">\
 <a href="JavaScript:;" id="importListSmaller"\
 onclick="onClickImportButton(this)" title="reduce list size">\
 &nbsp;&#150;&nbsp;</a>\
 <a href="JavaScript:;" id="importListLarger"\
 onclick="onClickImportButton(this)" title="increase list size">\
 &nbsp;+&nbsp;</a>\
 <a href="JavaScript:;" id="importListMaximize"\
 onclick="onClickImportButton(this)" title="maximize/restore list size">\
 &nbsp;=&nbsp;</a>\
</span>\
<select id="importList" size=8 multiple\
 onchange="setTimeout(\'refreshImportList(\'+this.selectedIndex+\')\',1)">\
 <!-- NOTE: delay refresh so list is updated AFTER onchange event is handled -->\
</select>\
<input type=checkbox id="chkAddTags" checked style="height:1em; width:auto"\
 onClick="config.macros.importTiddlers.addTags=this.checked;">add new tags &nbsp;\
<input type=checkbox id="chkImportTags" checked style="height:1em; width:auto"\
 onClick="config.macros.importTiddlers.importTags=this.checked;">import source tags &nbsp;\
<input type=checkbox id="chkKeepTags" checked style="height:1em; width:auto"\
 onClick="config.macros.importTiddlers.keepTags=this.checked;">keep existing tags\
<input type=text id="txtNewTags" size=15 onKeyUp="config.macros.importTiddlers.newTags=this.value" autocomplete=off>\
<div align=center>\
 <input type=button id="importOpen" class="importButton" style="width:32%" value="open"\
 onclick="onClickImportButton(this)">\
 <input type=button id="importStart" class="importButton" style="width:32%" value="import"\
 onclick="onClickImportButton(this)">\
 <input type=button id="importClose" class="importButton" style="width:32%" value="close"\
 onclick="onClickImportButton(this)">\
</div>\
<div id="importAskPanel">\
 tiddler already exists:\
 <input type=text id="importNewTitle" size=15 autocomplete=off">\
 <div align=center>\
 <input type=button id="importSkip" class="importButton" style="width:23%" value="skip"\
 onclick="onClickImportButton(this)">\
 <input type=button id="importRename" class="importButton" style="width:23%" value="rename"\
 onclick="onClickImportButton(this)">\
 <input type=button id="importMerge" class="importButton" style="width:23%" value="merge"\
 onclick="onClickImportButton(this)">\
 <input type=button id="importReplace" class="importButton" style="width:23%" value="replace"\
 onclick="onClickImportButton(this)">\
 </div>\
</div>\
';
//}}}

// // refresh listbox
//{{{
function refreshImportList(selectedIndex)
{
 var theList = document.getElementById("importList");
 if (!theList) return;
 // if nothing to show, reset list content and size
 if (!config.macros.importTiddlers.inbound) 
 {
 while (theList.length > 0) { theList.options[0] = null; }
 theList.options[0]=new Option('please open a document...',"",false,false);
 theList.size=config.macros.importTiddlers.listsize;
 return;
 }
 // get the sort order
 if (!selectedIndex) selectedIndex=0;
 if (selectedIndex==0) config.macros.importTiddlers.sort='title'; // heading
 if (selectedIndex==1) config.macros.importTiddlers.sort='title';
 if (selectedIndex==2) config.macros.importTiddlers.sort='modified';
 if (selectedIndex==3) config.macros.importTiddlers.sort='tags';
 if (selectedIndex>3) {
 // display selected tiddler count
 for (var t=0,count=0; t < theList.options.length; t++) count+=(theList.options[t].selected&&theList.options[t].value!="")?1:0;
 clearMessage(); displayMessage(config.macros.importTiddlers.countMsg.format([count]));
 return; // no refresh needed
 }

 // get the alphasorted list of tiddlers (optionally, filter out unchanged tiddlers)
 var tiddlers=config.macros.importTiddlers.inbound;
 tiddlers.sort(function (a,b) {if(a['title'] == b['title']) return(0); else return (a['title'] < b['title']) ? -1 : +1; });
 // clear current list contents
 while (theList.length > 0) { theList.options[0] = null; }
 // add heading and control items to list
 var i=0;
 var indent=String.fromCharCode(160)+String.fromCharCode(160);
 theList.options[i++]=new Option(tiddlers.length+' tiddler'+((tiddlers.length!=1)?'s are':' is')+' in the document',"",false,false);
 theList.options[i++]=new Option(((config.macros.importTiddlers.sort=="title" )?">":indent)+' [by title]',"",false,false);
 theList.options[i++]=new Option(((config.macros.importTiddlers.sort=="modified")?">":indent)+' [by date]',"",false,false);
 theList.options[i++]=new Option(((config.macros.importTiddlers.sort=="tags")?">":indent)+' [by tags]',"",false,false);
 // output the tiddler list
 switch(config.macros.importTiddlers.sort)
 {
 case "title":
 for(var t = 0; t < tiddlers.length; t++)
 theList.options[i++] = new Option(tiddlers[t].title,tiddlers[t].title,false,false);
 break;
 case "modified":
 // sort descending for newest date first
 tiddlers.sort(function (a,b) {if(a['modified'] == b['modified']) return(0); else return (a['modified'] > b['modified']) ? -1 : +1; });
 var lastSection = "";
 for(var t = 0; t < tiddlers.length; t++) {
 var tiddler = tiddlers[t];
 var theSection = tiddler.modified.toLocaleDateString();
 if (theSection != lastSection) {
 theList.options[i++] = new Option(theSection,"",false,false);
 lastSection = theSection;
 }
 theList.options[i++] = new Option(indent+indent+tiddler.title,tiddler.title,false,false);
 }
 break;
 case "tags":
 var theTitles = {}; // all tiddler titles, hash indexed by tag value
 var theTags = new Array();
 for(var t=0; t<tiddlers.length; t++) {
 var title=tiddlers[t].title;
 var tags=tiddlers[t].tags;
 for(var s=0; s<tags.length; s++) {
 if (theTitles[tags[s]]==undefined) { theTags.push(tags[s]); theTitles[tags[s]]=new Array(); }
 theTitles[tags[s]].push(title);
 }
 }
 theTags.sort();
 for(var tagindex=0; tagindex<theTags.length; tagindex++) {
 var theTag=theTags[tagindex];
 theList.options[i++]=new Option(theTag,"",false,false);
 for(var t=0; t<theTitles[theTag].length; t++)
 theList.options[i++]=new Option(indent+indent+theTitles[theTag][t],theTitles[theTag][t],false,false);
 }
 break;
 }
 theList.selectedIndex=selectedIndex; // select current control item
 if (theList.size<config.macros.importTiddlers.listsize) theList.size=config.macros.importTiddlers.listsize;
 if (theList.size>theList.options.length) theList.size=theList.options.length;
}
//}}}

// // Control interactions
//{{{
function onClickImportButton(which)
{
 // DEBUG alert(which.id);
 var theList = document.getElementById('importList');
 if (!theList) return;
 var thePanel = document.getElementById('importPanel');
 var theAskPanel = document.getElementById('importAskPanel');
 var theNewTitle = document.getElementById('importNewTitle');
 var count=0;
 switch (which.id)
 {
 case 'fileImportSource':
 case 'importOpen': // load import source into hidden frame
 importReport(); // if an import was in progress, generate a report
 config.macros.importTiddlers.inbound=null; // clear the imported tiddler buffer
 refreshImportList(); // reset/resize the listbox
 if (config.macros.importTiddlers.src=="") break;
 // Load document into hidden iframe so we can read it's DOM and fill the list
 loadImportFile(config.macros.importTiddlers.src,"all",null,null,function(src,filter,quiet,ask){window.refreshImportList(0);});
 break;
 case 'importSelectAll': // select all tiddler list items (i.e., not headings)
 importReport(); // if an import was in progress, generate a report
 for (var t=0,count=0; t < theList.options.length; t++) {
 if (theList.options[t].value=="") continue;
 theList.options[t].selected=true;
 count++;
 }
 clearMessage(); displayMessage(config.macros.importTiddlers.countMsg.format([count]));
 break;
 case 'importSelectNew': // select tiddlers not in current document
 importReport(); // if an import was in progress, generate a report
 for (var t=0,count=0; t < theList.options.length; t++) {
 theList.options[t].selected=false;
 if (theList.options[t].value=="") continue;
 theList.options[t].selected=!store.tiddlerExists(theList.options[t].value);
 count+=theList.options[t].selected?1:0;
 }
 clearMessage(); displayMessage(config.macros.importTiddlers.countMsg.format([count]));
 break;
 case 'importSelectChanges': // select tiddlers that are updated from existing tiddlers
 importReport(); // if an import was in progress, generate a report
 for (var t=0,count=0; t < theList.options.length; t++) {
 theList.options[t].selected=false;
 if (theList.options[t].value==""||!store.tiddlerExists(theList.options[t].value)) continue;
 for (var i=0; i<config.macros.importTiddlers.inbound.length; i++) // find matching inbound tiddler
 { var inbound=config.macros.importTiddlers.inbound[i]; if (inbound.title==theList.options[t].value) break; }
 theList.options[t].selected=(inbound.modified-store.getTiddler(theList.options[t].value).modified>0); // updated tiddler
 count+=theList.options[t].selected?1:0;
 }
 clearMessage(); displayMessage(config.macros.importTiddlers.countMsg.format([count]));
 break;
 case 'importSelectDifferences': // select tiddlers that are new or different from existing tiddlers
 importReport(); // if an import was in progress, generate a report
 for (var t=0,count=0; t < theList.options.length; t++) {
 theList.options[t].selected=false;
 if (theList.options[t].value=="") continue;
 if (!store.tiddlerExists(theList.options[t].value)) { theList.options[t].selected=true; count++; continue; }
 for (var i=0; i<config.macros.importTiddlers.inbound.length; i++) // find matching inbound tiddler
 { var inbound=config.macros.importTiddlers.inbound[i]; if (inbound.title==theList.options[t].value) break; }
 theList.options[t].selected=(inbound.modified-store.getTiddler(theList.options[t].value).modified!=0); // changed tiddler
 count+=theList.options[t].selected?1:0;
 }
 clearMessage(); displayMessage(config.macros.importTiddlers.countMsg.format([count]));
 break;
 case 'importToggleFilter': // show/hide filter
 case 'importFilter': // apply filter
 alert("coming soon!");
 break;
 case 'importStart': // initiate the import processing
 importReport(); // if an import was in progress, generate a report
 config.macros.importTiddlers.index=0;
 config.macros.importTiddlers.index=importTiddlers(0);
 importStopped();
 break;
 case 'importClose': // unload imported tiddlers or hide the import control panel
 // if imported tiddlers not loaded, close the import control panel
 if (!config.macros.importTiddlers.inbound) { thePanel.style.display='none'; break; }
 importReport(); // if an import was in progress, generate a report
 config.macros.importTiddlers.inbound=null; // clear the imported tiddler buffer
 refreshImportList(); // reset/resize the listbox
 break;
 case 'importSkip': // don't import the tiddler
 var theItem = theList.options[config.macros.importTiddlers.index];
 for (var j=0;j<config.macros.importTiddlers.inbound.length;j++)
 if (config.macros.importTiddlers.inbound[j].title==theItem.value) break;
 var theImported = config.macros.importTiddlers.inbound[j];
 theImported.status='skipped after asking'; // mark item as skipped
 theAskPanel.style.display='none';
 config.macros.importTiddlers.index=importTiddlers(config.macros.importTiddlers.index+1); // resume with NEXT item
 importStopped();
 break;
 case 'importRename': // change name of imported tiddler
 var theItem = theList.options[config.macros.importTiddlers.index];
 for (var j=0;j<config.macros.importTiddlers.inbound.length;j++)
 if (config.macros.importTiddlers.inbound[j].title==theItem.value) break;
 var theImported = config.macros.importTiddlers.inbound[j];
 theImported.status = 'renamed from '+theImported.title; // mark item as renamed
 theImported.set(theNewTitle.value,null,null,null,null); // change the tiddler title
 theItem.value = theNewTitle.value; // change the listbox item text
 theItem.text = theNewTitle.value; // change the listbox item text
 theAskPanel.style.display='none';
 config.macros.importTiddlers.index=importTiddlers(config.macros.importTiddlers.index); // resume with THIS item
 importStopped();
 break;
 case 'importMerge': // join existing and imported tiddler content
 var theItem = theList.options[config.macros.importTiddlers.index];
 for (var j=0;j<config.macros.importTiddlers.inbound.length;j++)
 if (config.macros.importTiddlers.inbound[j].title==theItem.value) break;
 var theImported = config.macros.importTiddlers.inbound[j];
 var theExisting = store.getTiddler(theItem.value);
 var theText = theExisting.text+'\n----\n^^merged from: [['+config.macros.importTiddlers.src+'#'+theItem.value+'|'+config.macros.importTiddlers.src+'#'+theItem.value+']]^^\n^^'+theImported.modified.toLocaleString()+' by '+theImported.modifier+'^^\n'+theImported.text;
 var theDate = new Date();
 var theTags = theExisting.getTags()+' '+theImported.getTags();
 theImported.set(null,theText,null,theDate,theTags);
 theImported.status = 'merged with '+theExisting.title; // mark item as merged
 theImported.status += ' - '+theExisting.modified.formatString("MM/DD/YYYY hh:mm:ss");
 theImported.status += ' by '+theExisting.modifier;
 theAskPanel.style.display='none';
 config.macros.importTiddlers.index=importTiddlers(config.macros.importTiddlers.index); // resume with this item
 importStopped();
 break;
 case 'importReplace': // substitute imported tiddler for existing tiddler
 var theItem = theList.options[config.macros.importTiddlers.index];
 for (var j=0;j<config.macros.importTiddlers.inbound.length;j++)
 if (config.macros.importTiddlers.inbound[j].title==theItem.value) break;
 var theImported = config.macros.importTiddlers.inbound[j];
 var theExisting = store.getTiddler(theItem.value);
 theImported.status = 'replaces '+theExisting.title; // mark item for replace
 theImported.status += ' - '+theExisting.modified.formatString("MM/DD/YYYY hh:mm:ss");
 theImported.status += ' by '+theExisting.modifier;
 theAskPanel.style.display='none';
 config.macros.importTiddlers.index=importTiddlers(config.macros.importTiddlers.index); // resume with THIS item
 importStopped();
 break;
 case 'importListSmaller': // decrease current listbox size, minimum=5
 if (theList.options.length==1) break;
 theList.size-=(theList.size>5)?1:0;
 config.macros.importTiddlers.listsize=theList.size;
 break;
 case 'importListLarger': // increase current listbox size, maximum=number of items in list
 if (theList.options.length==1) break;
 theList.size+=(theList.size<theList.options.length)?1:0;
 config.macros.importTiddlers.listsize=theList.size;
 break;
 case 'importListMaximize': // toggle listbox size between current and maximum
 if (theList.options.length==1) break;
 theList.size=(theList.size==theList.options.length)?config.macros.importTiddlers.listsize:theList.options.length;
 break;
 }
}
//}}}

// // re-entrant processing for handling import with interactive collision prompting
//{{{
function importTiddlers(startIndex)
{
 if (!config.macros.importTiddlers.inbound) return -1;

 var theList = document.getElementById('importList');
 if (!theList) return;
 var t;
 // if starting new import, reset import status flags
 if (startIndex==0)
 for (var t=0;t<config.macros.importTiddlers.inbound.length;t++)
 config.macros.importTiddlers.inbound[t].status="";
 for (var i=startIndex; i<theList.options.length; i++)
 {
 // if list item is not selected or is a heading (i.e., has no value), skip it
 if ((!theList.options[i].selected) || ((t=theList.options[i].value)==""))
 continue;
 for (var j=0;j<config.macros.importTiddlers.inbound.length;j++)
 if (config.macros.importTiddlers.inbound[j].title==t) break;
 var theImported = config.macros.importTiddlers.inbound[j];
 var theExisting = store.getTiddler(theImported.title);
 // avoid redundant import for tiddlers that are listed multiple times (when 'by tags')
 if (theImported.status=="added")
 continue;
 // don't import the "ImportedTiddlers" history from the other document...
 if (theImported.title=='ImportedTiddlers')
 continue;
 // if tiddler exists and import not marked for replace or merge, stop importing
 if (theExisting && (theImported.status.substr(0,7)!="replace") && (theImported.status.substr(0,5)!="merge"))
 return i;
 // assemble tags (remote + existing + added)
 var newTags = "";
 if (config.macros.importTiddlers.importTags)
 newTags+=theImported.getTags() // import remote tags
 if (config.macros.importTiddlers.keepTags && theExisting)
 newTags+=" "+theExisting.getTags(); // keep existing tags
 if (config.macros.importTiddlers.addTags && config.macros.importTiddlers.newTags.trim().length)
 newTags+=" "+config.macros.importTiddlers.newTags; // add new tags
 theImported.set(null,null,null,null,newTags.trim());
 // set the status to 'added' (if not already set by the 'ask the user' UI)
 theImported.status=(theImported.status=="")?'added':theImported.status;
 // do the import!
 store.addTiddler(theImported);
 store.setDirty(true);
 }
 return(-1); // signals that we really finished the entire list
}
//}}}

//{{{
function importStopped()
{
 var theList = document.getElementById('importList');
 var theNewTitle = document.getElementById('importNewTitle');
 if (!theList) return;
 if (config.macros.importTiddlers.index==-1)
 importReport(); // import finished... generate the report
 else
 {
 // DEBUG alert('import stopped at: '+config.macros.importTiddlers.index);
 // import collision... show the ask panel and set the title edit field
 document.getElementById('importAskPanel').style.display='block';
 theNewTitle.value=theList.options[config.macros.importTiddlers.index].value;
 }
}
//}}}
