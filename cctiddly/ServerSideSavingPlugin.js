/***
|''Name''|ServerSideSavingPlugin|
|''Description''|server-side saving|
|''Author''|FND|
|''Version''|0.3.2|
|''Status''|@@experimental@@|
|''Source''|http://svn.tiddlywiki.org/Trunk/association/plugins/ServerSideSavingPlugin.js|
|''License''|[[Creative Commons Attribution-ShareAlike 3.0 License|http://creativecommons.org/licenses/by-sa/3.0/]]|
|''Requires''|[[ServerConfig]]|
|''Keywords''|serverSide|
!Notes
This plugin relies on a dedicated configuration plugin to be present.
The specific nature of this plugins depends on the respective server.
!Revision History
!!v0.1 (2008-11-24)
* initial release
!!v0.2 (2008-12-01)
* added support for local saving
!!v0.3 (2008-12-03)
* added Save to Web macro for manual synchronization
!To Do
* conflict detection/resolution
* rename to ServerLinkPlugin?
* attempt to determine default adaptor (and defaultCustomFields) from systemServer tiddlers
* handle deleting/renaming (e.g. by hijacking the respective commands and creating a log)
!Code
***/
//{{{
if(!version.extensions.ServerSideSavingPlugin) { //# ensure that the plugin is only installed once
version.extensions.ServerSideSavingPlugin = { installed: true };

if(!config.extensions) { config.extensions = {}; } //# obsolete from v2.4.2

(function(plugin) { //# set up alias

if(!plugin || !plugin.adaptor) {
	throw "Missing dependency: ServerConfig";
}

plugin = {
	adaptor: plugin.adaptor, //# N.B.: expects config.extensions.ServerSideSavingPlugin.adaptor to be set
	locale: {
		saved: "%0 saved successfully",
		saveError: "Error saving %0: %1",
		deleted: "Removed %0",
		deleteError: "Error removing %0: %1",
		deleteLocalError: "Error removing %0 locally",
		removedNotice: "This tiddler has been deleted."
	},

	sync: function() {
		store.forEachTiddler(function(title, tiddler) {
			if(tiddler.fields.deleted) {
				plugin.removeTiddler(tiddler);
			} else if(tiddler.isTouched() && tiddler.getServerType() && tiddler.fields["server.host"]) {
				plugin.saveTiddler(tiddler);
			}
		});
	},

	saveTiddler: function(tiddler) {
		var adaptor = new this.adaptor();
		var context = {
			tiddler: tiddler,
			changecount: tiddler.fields.changecount
		};
		context.workspace = tiddler.fields["server.workspace"];
		var req = adaptor.putTiddler(tiddler, context, {}, this.saveTiddlerCallback);
		return req ? tiddler : false;
	},

	saveTiddlerCallback: function(context, userParams) {
		var tiddler = context.tiddler;
		if(context.status) {
			if(tiddler.fields.changecount == context.changecount) { //# check for changes since save was triggered
				tiddler.clearChangeCount();
			} else if(tiddler.fields.changecount > 0) {
				tiddler.fields.changecount -= context.changecount;
			}
			displayMessage(plugin.locale.saved.format([tiddler.title]));
			store.setDirty(false);
		} else {
			displayMessage(plugin.locale.saveError.format([tiddler.title, context.statusText]));
		}
	},

	removeTiddler: function(tiddler) {
		var adaptor = new this.adaptor();
		context = { tiddler: tiddler };
		context.workspace = tiddler.fields["server.workspace"];
		var req = adaptor.deleteTiddler(tiddler, context, {}, this.removeTiddlerCallback);
		return req ? tiddler : false;
	},

	removeTiddlerCallback: function(context, userParams) {
		var tiddler = context.tiddler;
		if(context.status) {
			if(tiddler.fields.deleted) {
				store.deleteTiddler(tiddler.title);
			} else {
				displayMessage(plugin.locale.deleteError.format([tiddler.title]));
			}
			displayMessage(plugin.locale.deleted.format([tiddler.title]));
			store.setDirty(false);
		} else {
			displayMessage(plugin.locale.deleteLocalError.format([tiddler.title, context.statusText]));
		}
	}
};

config.macros.saveToWeb = { // XXX: hijack existing sync macro?
	locale: {
		btnLabel: "save to web",
		btnTooltip: "synchronize changes",
		btnAccessKey: null
	},

	handler: function(place, macroName, params, wikifier, paramString, tiddler) {
		createTiddlyButton(place, this.locale.btnLabel, this.locale.btnTooltip,
			plugin.sync, null, null, this.locale.btnAccessKey);
	}
};

// hijack saveChanges to trigger remote saving
plugin.saveChanges = saveChanges;
saveChanges = function(onlyIfDirty, tiddlers) {
	if(window.location.protocol == "file:") {
		plugin.saveChanges.apply(this, arguments);
	} else {
		plugin.sync();
	}
};

// override removeTiddler to flag tiddler as deleted
TiddlyWiki.prototype.removeTiddler = function(title) { // XXX: should override deleteTiddler instance method?
	var tiddler = this.fetchTiddler(title);
	if(tiddler) {
		tiddler.tags = ["excludeLists", "excludeSearch", "excludeMissing"];
		tiddler.text = plugin.locale.removedNotice;
		tiddler.fields.deleted = true; // XXX: rename to removed/tiddlerRemoved?
		tiddler.incChangeCount();
		this.notify(title, true);
		this.setDirty(true);
	}
};

})(config.extensions.ServerSideSavingPlugin); //# end of alias

// override saveTiddler to fix core bug (ticket #769) -- XXX: to be fixed in TiddlyWiki v2.4.2
Story.prototype.saveTiddler = function(title,minorUpdate)
{
	var tiddlerElem = this.getTiddler(title);
	if(tiddlerElem) {
		var fields = {};
		this.gatherSaveFields(tiddlerElem,fields);
		var newTitle = fields.title || title;
		if(!store.tiddlerExists(newTitle))
			newTitle = newTitle.trim();
		if(store.tiddlerExists(newTitle) && newTitle != title) {
			if(!confirm(config.messages.overwriteWarning.format([newTitle.toString()])))
				return null;
		}
		if(newTitle != title)
			this.closeTiddler(newTitle,false);
		tiddlerElem.id = this.tiddlerId(newTitle);
		tiddlerElem.setAttribute("tiddler",newTitle);
		tiddlerElem.setAttribute("template",DEFAULT_VIEW_TEMPLATE);
		tiddlerElem.setAttribute("dirty","false");
		if(config.options.chkForceMinorUpdate)
			minorUpdate = !minorUpdate;
		if(!store.tiddlerExists(newTitle))
			minorUpdate = false;
		var newDate = new Date();
		var extendedFields = store.tiddlerExists(newTitle) ? store.fetchTiddler(newTitle).fields : (newTitle!=title && store.tiddlerExists(title) ? store.fetchTiddler(title).fields : merge({},config.defaultCustomFields));
		for(var n in fields) {
			if(!TiddlyWiki.isStandardField(n))
				extendedFields[n] = fields[n];
		}
		var tiddler = store.saveTiddler(title,newTitle,fields.text,minorUpdate ? undefined : config.options.txtUserName,minorUpdate ? undefined : newDate,fields.tags,extendedFields);
		autoSaveChanges(null,[tiddler]);
		return newTitle;
	}
	return null;
};

} //# end of "install only once"
//}}}
