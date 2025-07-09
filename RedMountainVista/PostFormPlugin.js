/***
|''Name:''|PostFormPlugin|
|''Description:''|Post from form, wikify response|
|''Date:''|Oct 24, 2006|
|''Source:''|http://solo.dc3.com/tw/index.html#PostFormPlugin|
|''Author:''|Bob Denny ~DC-3 Dreams, SP|
|''License:''|[[Creative Commons Attribution-ShareAlike 2.5 License|http://creativecommons.org/licenses/by-sa/2.5/]]|
|''Version:''|1.1.3|
|''~CoreVersion:''|2.0.11, 2.1.0|
|''Browser:''|Firefox 1.5; Internet Explorer 6.0; Safari|
|''Require:''|[[DC3.Ajax|http://solo.dc3.com/tw/index.html#DC3.Ajax]] 1.0.5+|
!!Description
This macro replaces the normal submit button for an HTML form contained in a tiddler. More than one form may appear in the tiddler, and this macro may be invoked on any of them. In addition, multiple invocations of this macro may appear in a tiddler, allowing you to provide posting from more than one form in a tiddler. 

The macro invocation is replaced by wikified/styled button. The button's label and tooltip can be optionally specified as macro parameters. Clicking this button causes the contents of the form specified by the first (required) parameter to be ~POSTed to the URI that is the second (required) macro parameter. A standard message appears stating that the form data has been posted, then a second message appears when the response is received.

The macro also supports an optional parameter which causes a "confirm" popup to appear with specified text and one which causes the tiddler to be automatically refreshed following completion of the form post cycle.
!!Form Search Scope
The macro searches for its form within the scope of the macro handler's 'place' parameter. Normally, this is the tiddler viewer area. However, it is possible to include forms within a wikitext object such as a table cell. In this case, only forms within that table cell will be found by the macro (which also needs to be in that same table cell). This has some implications:
# The form invocation must be within the same scope as the form it is controlling.
# If only one form appears within a scope it need not be named, and the first parameter (the form name, see below) may be "".
!!Usage
Create one or more forms in the tiddler, using {{{<html>}}} tags to enclose the form as usual. The form does not need to have {{{action}}} or {{{method}}} attributes, {{{<form>}}} is enough. If you have more than one form in the scope, you must give each one a name, for example, {{{<form name='form1'>}}}. Add form elements (text fields, checkboxes, etc.). each with a name and a value, per HTML. 

At the location you want the post button to appear, invoke the PostForm macro. Remember the invocation must be in the same scope as the form! The macro has several parameters. If you need to include a parameter as a placeholder, use "":

|!Param|!Description|
|''1''|The name of the form, or "". If "" is given, the first form in the scope is posted even though there may be multiple forms in the scope.|
|''2''|The URI of the remote form processor (typically a PHP, ASP, or CGI page). See the URI Formats section below.|
|''3''|(optional) The label of the submit button, default "Submit"|
|''4''|(optional) The tooltip of the submit button, default "Submit form to server"|
|''5''|(optional) The text for a yes/no "confirm" popup that will be displayed after clicking the submit button and before posting the form to the server, default "" (no popup). Use this for an "Are you sure", for example.|
|''6''|(optional) If given and not "false", the tiddler will be refreshed after the server has responded to the post. This can be very useful when combined with the RefreshTiddlerPlugin!|
!!URI Formats
The second parameter is the URI of the remote form perocessor. If the ~TiddlyWiki itself is being read via HTTP from that same server and folder, then only the name of the form processor need be given. This approach makes it possible to move the ~TiddlyWiki and its form processors from one place to another on the net, without having to edit the URI parameter(s) of form post buttons. If the ~TiddlyWiki is being read from local disk, then you'll need to give the complete URI to the remote form processor. If you are unsure, just give the complete URI of the form processor.
!!Security Issues
You may encounter security issues when using this plugin. Suppose you are reading the ~TiddlyWiki from one server, yet the ~PostForm macro specifies a form processor on a different server (different domain name). By default, most browsers will reject this cross-site operation. You may be able to override it, but in general this sort of thing is best avoided!
!!Remote Form Processor
The remote form processor (e.g. PHP, ASP, CGI) is expected to return nothing or wikitext with content type text/plain. If any text is returned, it is wikified and inserted //temporarily// at the end of the tiddler. If the tiddler is closed and reopened, the response text will be gone. If the form is submitted more than once without closing the tiddler, multiple responses will be appended to the tiddler display. If the auto-refresh parameter is supplied, the tiddler will be refreshed after the post and any response text will be discarded.
!!Examples
Here's a simple form which is set to post to a mythical PHP page.
{{{
<html><form>
<input type="text" name = "txt" width="40" value="Yo Mama!"></input>
<input type="checkbox" name="ckbox" checked>Check this!</input>
</form></html><<PostForm "" "formtest.php">>
}}}
<html><form>
<input type="text" name = "txt" width="40" value="Yo Mama!"></input>
<input type="checkbox" name="ckbox" checked>Check this!</input>
</form></html><<PostForm "" "formtest.php">>
!!Revision History
<<<
''2006.09.20 [1.0.1]'' Initial creation
''2006.09.26 [1.1.1]'' Support multiple forms in a tiddler, ask, auto-refresh, Lint checked. Add documentation.
''2006.10.03 [1.1.2]'' Validate with TW 2.1.0. No changes needed.
''2006.10.24 [1.1.3]'' Comment out debugging displayMessage() calls
<<<
!!Code
***/
//{{{
version.extensions.PostForm = {
 major: 1, minor: 1, revision: 2,
 date: new Date(2006, 10, 3), 
 type: 'macro',
 source: "http://solo.dc3.com/tw/index.html#PostFormPlugin"
};

config.macros.PostForm = 
{
	onComplete: function(text, params) 
	{
		//displayMessage("Post completed successfully.");
		text = text.replace(/(^\s*)|(\s*$)/g, ""); // Trim off l/t junk!
		if(text)
			wikify(text, params.place);
		if(params.refresh)
			story.refreshTiddler(params.tiddler.title, null, true);
	},
	
	handler: function(place, macroName, params, wikifier, paramString, tiddler) 
	{
		var label = params[2] ? params[2] : "Submit";
		var prompt = params[3] ? params[3] : "Submit form to server";
		var ask = params[4] ? params[4] : "";
		var refresh = params[5] ? true : false;
		var complParams = { 
			place: place,
			tiddler: tiddler,
			refresh: refresh
		};
		var forms = place.getElementsByTagName("form");
		if(forms.length === 0) {
			displayMessage("PostForm: No form in tiddler!");
 			return;
 		}
 		var form = null;
 		if(forms.length == 1 || param[0] === "") {	// Only 1 or unspecified
 			form = forms[0];						// First form in the tiddler
 		} else {
 			for(var i = 0; i < forms.length; i++) {
 				if(form[i].name == params[0]) {
 					form = forms[i];				// Named form
 					break;
 				}
 			}
 			if(form === null) {						// Not found by name
				displayMessage("PostForm: No form \"" + param[0] + "\"in tiddler!");
 				return;
 			}
 		}
		createTiddlyButton(place, label, prompt, 
			function () {
				if(ask) { if(!confirm(ask)) return false; }
				//displayMessage("Posting data to server...");
				DC3.Ajax.postForm(form, params[1], 
						config.macros.PostForm.onComplete, complParams);
				return false;
			} );
	}
};
//}}}
