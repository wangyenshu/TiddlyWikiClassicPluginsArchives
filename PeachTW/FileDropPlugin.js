/***
|FileDropPlugin|h
|author : BradleyMeck|
|version : 0.1.1|
|date : Nov 13 2006|
|usage : drag a file onto the TW to have it be made into a tiddler|
|browser(s) supported : Mozilla|

!Trouble Shooting
*If the plugin does not seem to work, open up the page "about:config" (just type it in the address bar) and make sure @@color(blue):signed.applets.codebase_principal_support@@ is set to @@color(blue):true@@

!Revisions
*Multiple File Dropping API updated, to end all capturing events after yours return a value that makes if(myFunctionsReturnValue) evaluate to true
*Added support for multiple file drop handlers
**Use the config.macros.fileDrop.addEventListener(@@color(green):String Flavor@@, @@color(green):Function handler(nsiFile){}@@, @@color(green):Boolean addToFront@@) function
***Standard Flavor is "application/x-moz-file"
***addToFront gives your handler priority over all others at time of add
*Old plugin would disallow drops of text vetween applications because it didn't check if the transfer was a file.

!Example Handler
*Adds simple file import control, add this to a tiddler tagged {{{systemConfig}}} to make file dropping work
{{{
config.macros.fileDrop.addEventListener("application/x-moz-file",function(nsiFile)
{
 if(
 confirm("You have dropped the file \""+nsiFile.path+"\" onto the page, it will be imported as a tiddler. Is that ok?")
 )
 {
 var newDate = new Date();
 var title = prompt("what would you like to name the tiddler?");
 store.saveTiddler(title,title,loadFile(nsiFile.path),config.options.txtUserName,newDate,[]);
 }
 return true;
})
}}}

!Example Handler without popups and opening the tiddler on load
*Adds simple file import control, add this to a tiddler tagged {{{systemConfig}}} to make file dropping work
{{{
config.macros.fileDrop.addEventListener("application/x-moz-file",function(nsiFile)
{
 var newDate = new Date();
 store.saveTiddler(nsiFile.path,nsiFile.path,loadFile(nsiFile.path),config.options.txtUserName,newDate,[]);
 story.displayTiddler(null,nsiFile.path)
 return true;
})
}}}

***/

//{{{
config.macros.fileDrop = {varsion : {major : 0, minor : 0, revision: 1}};
config.macros.fileDrop.customDropHandlers = [];

config.macros.fileDrop.dragDropHandler = function(evt) {

 netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
 // Load in the native DragService manager from the browser.
 var dragService = Components.classes["@mozilla.org/widget/dragservice;1"].getService(Components.interfaces.nsIDragService);

 // Load in the currently-executing Drag/drop session.
 var dragSession = dragService.getCurrentSession();

 // Create an instance of an nsITransferable object using reflection.
 var transferObject = Components.classes["@mozilla.org/widget/transferable;1"].createInstance();

 // Bind the object explicitly to the nsITransferable interface. We need to do this to ensure that
 // methods and properties are present and work as expected later on.
 transferObject = transferObject.QueryInterface(Components.interfaces.nsITransferable);

 // I've chosen to add only the x-moz-file MIME type. Any type can be added, and the data for that format
 // will be retrieved from the Drag/drop service.
 transferObject.addDataFlavor("application/x-moz-file");

 // Get the number of items currently being dropped in this drag/drop operation.
 var numItems = dragSession.numDropItems;
 for (var i = 0; i < numItems; i++)
 {
 // Get the data for the given drag item from the drag session into our prepared
 // Transfer object.
 dragSession.getData(transferObject, i);

 // We need to pass in Javascript 'Object's to any XPConnect method which
 // requires OUT parameters. The out value will then be saved as a new
 // property called Object.value.
 var dataObj = {};
 var dropSizeObj = {};

for(var ind = 0; ind < config.macros.fileDrop.customDropHandlers.length; ind++)
{
 var item = config.macros.fileDrop.customDropHandlers[ind];
 if(dragSession.isDataFlavorSupported(item.flavor))
 {
 transferObject.getTransferData(item.flavor, dataObj, dropSizeObj);
 var droppedFile = dataObj.value.QueryInterface(Components.interfaces.nsIFile);
 // Display all of the returned parameters with an Alert dialog.
 var result = item.handler.call(item,droppedFile);
 // Since the event is handled, prevent it from going to a higher-level event handler.
 evt.stopPropagation();
 evt.preventDefault();
 if(result){break;}
 }
}
 }
}

if(!window.event)
{
 // Register the event handler, and set the 'capture' flag to true so we get this event
 // before it bubbles up through the browser.
 window.addEventListener("dragdrop", config.macros.fileDrop.dragDropHandler , true);
}

config.macros.fileDrop.addEventListener = function(paramflavor,func,inFront)
{
var obj = {};
obj.flavor = paramflavor;
obj.handler = func;
if(!inFront)
{config.macros.fileDrop.customDropHandlers.push(obj);}
else{config.macros.fileDrop.customDropHandlers.shift(obj);}
}
//}}}