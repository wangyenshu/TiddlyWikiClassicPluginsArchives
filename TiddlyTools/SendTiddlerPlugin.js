/***
|Name|SendTiddlerPlugin|
|Source|http://www.TiddlyTools.com/#SendTiddlerPlugin|
|Version|0.8.0|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.1|
|Type|plugin,toolbar|
|Requires|[[SendTiddlerConfig]]|
|Description|send tiddler source content or raw storeArea DIVs to remote URLs for server-side storage/processing|
|Status| ALPHA DEVELOPMENT - USE WITH CARE - SUBJECT TO CHANGE |
''sendTiddler'' toolbar command submits tiddler source content to remote URLs for server-side processing.  Useful for posting tiddler content to on-line blog services or custom-built server-side storage mechanisms.
!!!!!Usage
<<<
Select ''send'' tiddler toolbar command to view a popup list of destinations servers.

When you select a server, a separate browser window (or popup) will open, containing a server-specific HTML form for sending the tiddler content along with extra input fields as needed to enter additional information to be sent (e.g., account, username, keywords, options, etc.).  Review/enter information as desired, and then press the ''send'' button.  A separate window will be opened to display the response from the remote server.
<<<
!!!!!Configuration
<<<
Destination servers are defined in the [[SendTiddlerConfig]] tiddler.  Each definition is separated by a {{{----}}} (horizontal rule).  The first line of each definition is the text that will appear in the ''send'' toolbar popup menu.  The remaining lines of each contain an HTML form, beginning with <form method="..." action="..."> appropriate for that destination server, followed by form input fields (and possibly hidden fields) to contain the specific values needed for processing the form on the server.

Some tiddler values can be automatically inserted into the form, based on the tiddler being sent.  To insert these values, you can embed any of the following ''field markers'' into your custom-defined form definition (using a {{{%marker%}}} format). When the form is displayed, these markers will be automatically replaced by the corresponding tiddler field value.
* content - the current contents of the current tiddler
* source - the URL of the current TiddlyWiki document
* title - the title of the current tiddler
* created - the date the tiddler was initially created
* modified - the date the tiddler was last modified
* author - the TiddlyWiki username of the last person to edit the tiddler
* tags - a (space-separated) list of tags for the tiddler
* alltiddlers - all tiddlers, encoded as TW "storeArea" DIVs
* SHA1 - cryto-encoded value corresponding to current tiddler  or alltiddlers content
<<<
!!!!!Installation Notes
<<<
If you are using the default (shadow) ViewTemplate, the plugin automatically updates the template to include the ''sendTiddler'' toolbar command.  If you have created a custom ViewTemplate tiddler, you will need to manually add the ''sendTiddler'' toolbar command to your existing template:
{{{
<!-- add 'sendTiddler' command to existing editor toolbar definition -->
<div class='toolbar' macro='toolbar ... sendTiddler ... '>
}}}
<<<
!!!!!Revisions
<<<
2008.01.05 [0.8.0] added support for 'SHA1' replacement marker (uses Crypto functions to generate hashcode based on content (single tiddler or all tiddlers).  Used by SharedRecords.org.
2007.06.05 [0.7.2] 'edit server list' onclick handler now returns false to prevent IE page transition
2007.02.15 [0.7.0] use split/join for replacing marker text in content (avoids regexp problem with handling of $ in target string)
2007.02.09 [0.6.0] added support for 'alltiddlers' replacement marker
2006.11.05 [0.5.0] alpha test - user-defined forms
2006.11.04 [0.1.0] alpha test - static form definition
2006.11.03 [0.0.0] started
<<<
!!!!!Code
***/
//{{{
version.extensions.SendTiddlerPlugin= {major: 0, minor: 8, revision: 0, date: new Date(2008,1,5)};

config.commands.sendTiddler = {
	text: 'send',
	tooltip: 'send this tiddler\'s source content to a server',
	hideReadOnly: false,
	dateFormat: 'DDD, MMM DDth YYYY hh:0mm:0ss',
	serverList: 'SendTiddlerConfig', // tiddler containing server form definitions
	html: '<html><head><title>Send tiddler to: %description%</title></head>\
		<body style="background:#eee;font-family:arial,helvetica">%form%</body></html>',
	handler: function(event,src,title) {
		config.commands.sendTiddler.showpopup(src);
		event.cancelBubble = true;
		if (event.stopPropagation) event.stopPropagation();
		return false;
	},
	showpopup: function(place) {
		var here=story.findContainingTiddler(place);
		var popup=Popup.create(place); if (!popup) return;
		createTiddlyText(popup,"select a destination:");
		var t=store.getTiddlerText(config.commands.sendTiddler.serverList);
		if (t && t.trim().length) {
			var parts=t.split("\n----\n");
			for (var p=0; p<parts.length; p++) {
				var lines=parts[p].split("\n");
				var label=lines.shift(); // 1st line=popup display text
				var form=lines.join("\n") // remaining lines=form to use
				var a=createTiddlyButton(createTiddlyElement(popup,'li'),
					label, "", config.commands.sendTiddler.invokeForm);
				a.setAttribute("description",label); // server description
				a.setAttribute("tiddler",here?here.getAttribute('tiddler'):null); // send this tiddler
				a.setAttribute("form",form); // form to use
			}
		}
		createTiddlyButton(createTiddlyElement(popup,'li'), 'edit server list...', '',
			function(){story.displayTiddler(null,config.commands.sendTiddler.serverList,2);return false;});
		Popup.show(popup,false);
	},
	invokeForm: function() {
		var id=this.getAttribute('tiddler'); if (!id) return;
		var tid=store.getTiddler(id);
		var html=config.commands.sendTiddler.html;
		html=html.split("%"+"form%").join(this.getAttribute("form"));
		html=html.split("%"+"description%").join(this.getAttribute("description"));
		html=html.split("%"+"source%").join(document.location.href);
		html=html.split("%"+"title%").join(tid.title);
		html=html.split("%"+"author%").join(tid.modifier);
		html=html.split("%"+"created%").join(tid.created.formatString(config.commands.sendTiddler.dateFormat));
		html=html.split("%"+"modified%").join(tid.modified.formatString(config.commands.sendTiddler.dateFormat));
		html=html.split("%"+"tags%").join(tid.tags.join(" "));
		
		var txt=tid.text;
		html=html.split("%"+"content%").join(txt.htmlEncode());
		if (html.indexOf("%"+"alltiddlers%")!=-1) { // only if needed (for efficiency)
			var txt=store.allTiddlersAsHtml();
			html=html.split("%"+"alltiddlers%").join(txt.htmlEncode());
		}
		if (Crypto && (html.indexOf("%"+"SHA1%")!=-1)) { // only if needed (for efficiency)
			var sha1=Crypto.hexSha1Str(txt).toLowerCase();
			html=html.split("%"+"SHA1%").join(sha1);
		}
		// create and submit hidden form
		var f=document.getElementById("sendTiddlerFrame");
		if (f) document.body.removeChild(f);
		var f=createTiddlyElement(document.body,"iframe","sendTiddlerFrame");
		f.style.width="0px"; f.style.height="0px"; f.style.border="0px";
		var d=f.document;
		if (f.contentDocument) d=f.contentDocument; // For NS6
		else if (f.contentWindow) d=f.contentWindow.document; // For IE5.5 and IE6
		d.open(); d.writeln(html); d.close();
		d.getElementsByTagName("form")[0].submit();
		return false;
	}
};

// tweak shadow ViewTemplate to add "sendTiddler" command (following "editTiddler")
config.shadowTiddlers.ViewTemplate=config.shadowTiddlers.ViewTemplate.replace(/editTiddler/,"editTiddler sendTiddler");
//}}}