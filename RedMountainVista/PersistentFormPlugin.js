/***
|''Name:''|PersistentFormPlugin|
|''Description:''|Save HTML form states in cookies|
|''Date:''|Oct 18, 2006|
|''Source:''|http://solo.dc3.com/tw/index.html#PersistentFormPlugin|
|''Author:''|Bob Denny ~DC-3 Dreams, SP|
|''License:''|[[Creative Commons Attribution-ShareAlike 2.5 License|http://creativecommons.org/licenses/by-sa/2.5/]]|
|''Version:''|1.1.0|
|''~CoreVersion:''|2.0.11, 2.1.0|
|''Browser:''|Firefox 1.5; Internet Explorer 6.0; Safari|
This macro adds field persistence to HTML forms embedded in tiddlers, and an optional reset button to clear the form and erase any persisted field values. See the [[PostFormPlugin]]. Persistence is done using the same scheme that ~TiddlyWiki's options use, cookies. 
!Usage
If you have only one HTML form in your tiddler and don't need a reset button, simply include the macro call {{{<<PersistentForm>>}}}. 

If you want to include a reset button, which will clear the form and the saved values //for that form only//, specify the third parameter, which is the label for the button and the fourth parameter, which is its tooltip, for example:

{{{<<PersistentForm "formId" "1" "Forget" "Reset and forget saved form values">>}}}

This will cause a button labeled "Forget" to appear at the macro invocation location, apply to form "formId, and it will keep the saved form values for 1 day.
!!Parameters
# (optional) ID of form to be persisted (default is first or only form in tiddler)
# (optional) lifetime of persistence cookies, days (default = 7)
# (optional) Label of reset button for the form (default = no reset button)
# (optional) Tooltip for reset button (if specified in param 3)
!Notes
The value names are //not// uniquified to each form, //on purpose//. Thus, it is possible for a TiddlyWiki with several forms to share the same information. When someone fills out one of those forms, the same info will appear in the other forms as long as the form field names in both are the same. You are responsible for choosing form field names that are unique to each form if you want this isolation.

A single cookie is baked by this plugin. It is named {{{pfc}}} and has a value that is the concatenation of all persisted form field name/value pairs as {{{name:value&name:value...}}}
!!Example
Change some of the fields, close and reopen this tiddler. See that the fields are restored. Then click the forget button, see the form clear. Close and reopen this tiddler again and see that the form is still cleared.
<html><form id="myForm">
Text: <input type="text" name = "txt" width="40" value=""></input>
<input type="checkbox" name="ckbox">Check this!</input><br>
Password: <input type="password" name="pass" value=""></input><br>
Single select:&nbsp;<select name="sel">
<option value="a">Type A</option>
<option value="b">Type B</option>
<option value="c">Type C</option>
</select>&nbsp;&nbsp;Multiple select:&nbsp;
<select multiple size="3" name="selmult">
<option value="1">Type 1</option>
<option value="2">Type 2</option>
<option value="3">Type 3</option>
</select><br>
<input type="radio" name="rbtn" value="rb1">Button 1</input><br>
<input type="radio" name="rbtn" value="rb2">Button 2</input><br>
<input type="radio" name="rbtn" value="rb3">Button 3</input><br>
<textarea name=bigtext rows="5" cols="10"></textarea><br>
</form></html><<PersistentForm "myForm" "1" "Forget" "Forget saved values">>
!!Revision History
<<<
''2006.09.20 [1.0.1]'' Initial creation
''2006.09.29 [1.0.2]'' Unsupported elements just skipped, allows submit etc. to be present.
''2006.09.29 [1.0.3]'' Optional param form id to support multiple forms. Optional param to set expiry, now defaults to 7 days. New reset() method to delete all cookies for the target form.
''2006.10.03 [1.0.4]'' Fix initialization of select-multiple fields, add optional button for resetting form and forgetting cookies, validate on TW 2.1.0, improve doc.
''2006.10.18 [1.1.0]'' Embed all form data into a single cookie.
<<<
!!Code
***/
//{{{
version.extensions.PersistentForm = {
 major: 1, minor: 1, revision: 0,
 date: new Date(2006, 10, 3), 
 type: 'macro',
 source: "http://solo.dc3.com/tw/index.html#PersistentFormPlugin"
};

config.macros.PersistentForm = 
{
	expiry: 7,														// Expiry, days (used in onChange())
	
	persistDict: { },												// Persistence data cache
	
	//
	// Turn PersistentForm cookie data into an associative array
	//
	loadPersistDict: function()
	{
 		// Find pfc cookie
		var cookies = document.cookie.split(";");
		for(var i = 0; i < cookies.length; i++)
		{
			var p = cookies[i].indexOf("=");
			if(p != -1)
			{
				var name = cookies[i].substr(0, p).trim();
				if(name.substr(0, 3) == "pfc")						// Found the 'pfc' cookie
				{
					var value = cookies[i].substr(p + 1).trim();	// This has the form contents
					var fc = value.split("&");
					for(i = 0; i < fc.length; i++)
					{
						p = fc[i].indexOf(":");
						name = fc[i].substr(0, p).trim();
						if(name !== "") {
							value = fc[i].substr(p + 1).trim();
							this.persistDict[name] = value;
						}
					}
					return;
				}
			}
		}
	},
	
	storePersistDict: function()
	{
		var c = "pfc=";
		var empty = true;
		for(var name in this.persistDict) 
			c += name + ":" + this.persistDict[name] + "&";
		if(c.length > 4) {
			c = c.substr(0, c.length - 1);							// Remove trailing '&'
			empty = false;
		}
		c += "; expires=" +
				new Date(new Date().getTime() + (86400000 * this.expiry)).toGMTString() +
				"; path=/";
		document.cookie = c;
		if(empty) 											// Don't save empty cookie
			document.cookie = "pfc=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/";
	},
	
	getTargetForm: function(formId, place)
	{
		var forms = place.getElementsByTagName("form");
		if(forms.length === 0) {
			displayMessage("PersistentForm: No form in tiddler!");
 			return null;
 		}
 		var form = null;											// Find the target form
 		if(formId === "") {
			form = forms[0];
		} else {
			for(var i = 0; i < forms.length; i++) {
				if(forms[i].id == formId) {
					form = forms[i];
					break;
				}
			}
		}
		if(form === null) {
			displayMessage("PersistentForm: No form '" + formId + "' in tiddler.");
 			return null;
 		}
 		return form;
	},
	
	handler: function(place, macroName, params, wikifier, paramString, tiddler) 
	{
		var formId = params[0] ? params[0] : "";					// Empty means 1st/only form
		this.expiry = params[1] ? params[1] : 7;					// Default to 7 day
		var label = params[2] ? params[2] : "";						// Default to no forget button
		var prompt = params[3] ? params[3] : "";					// Empty tooltip
		
		var form = this.getTargetForm(formId, place);
		if(form === null) return;
		this.loadPersistDict();
		// Enumerate form elements and set values as possible
		var nElem = form.elements.length;
		for(var i = 0; i < nElem; i++) {
 			var elem = form.elements[i];
 			var elemPersistVal = this.persistDict ? this.persistDict[elem.name] : "";	// Handle no cookie case
 			switch(elem.type) {
 				case "text":
 				case "password":
 				case "textarea":
 					if(elemPersistVal) elem.value = unescape(elemPersistVal);
 					elem.onkeyup = this.onChange;
 					break;
 				case "select-one":
 					if(elemPersistVal) elem.value = unescape(elemPersistVal);
 					elem.onchange = this.onChange;
 					break;
 				case "radio":
 					elem.checked = (elemPersistVal == elem.value);
 					elem.onclick = this.onChange;
 					break;
 				case "checkbox":
 					if(elemPersistVal) elem.checked = (elemPersistVal == "true");
 					elem.onclick = this.onChange;
 					break;
 				case "select-multiple":
 					if(elemPersistVal) {
	 					var sels = elemPersistVal.split(",");		// Array of selected option #s
 						for(var j = 0; j < elem.options.length; j++)
	 						elem.options[j].selected = sels.contains(j.toString());
	 				}
 					elem.onchange = this.onChange;
 					break;
 				default:											// Others unsupported 
					//displayMessage("PersistentForm: " + elem.type + " form elements not supported.");
					break;											// Keep going
			}
		}
		
		if(label !== "")
			createTiddlyButton(place, label, prompt, 
							function() {
								config.macros.PersistentForm.reset(place, form);
								return false;
							} );
	},
	
	onChange: function(e)
	{
		if (!e) e = window.event;			// Ugh!
		var elem = e.target;
		if(!elem) elem = e.srcElement;		// Ugh Ugh!
		var val;
		switch(elem.type)
		{
			case "text":
			case "password":
			case "select-one":
			case "radio":
			case "textarea":
				val = escape(elem.value);
				break;
			case "checkbox":
				val = elem.checked ? "true" : "false";
				break;
			case "select-multiple":									// "i,l,n" #s of sel'd items
				var sels = "";
				for(var j = 0; j < elem.options.length; j++) {
					if(elem.options[j].selected)					// Encode only selected (may be none!)
						sels += j + ",";
				}
				if(sels) sels = sels.substr(0, sels.length -1);		// Remove trailing comma
				val = sels;
				break;
		}
		config.macros.PersistentForm.persistDict[elem.name] = val;
		config.macros.PersistentForm.storePersistDict();
	},
	
	//
	// Delete cookies for given form/owner, clear the form
	//
	reset: function(place, form)
	{
		if(form === null) return;
		var nElem = form.elements.length;
		for(var i = 0; i < nElem; i++)
 			delete this.persistDict[form.elements[i].name];
 		this.storePersistDict();
		form.reset();
	}
};
//}}}
