/***
| Name:|RenameTagsPlugin|
| Purpose:|Allows you to easily rename tags|
| Creator:|SimonBaird|
| Source:|http://simonbaird.com/mptw/#RenameTagsPlugin|
| Version:|1.0.1 (5-Mar-06)|

!Description
If you rename a tiddler/tag that is tagging other tiddlers this plugin will ask you if you want to rename the tag in each tiddler where it is used. This is essential if you use tags and ever want to rename them. To use it, open the tag you want to rename as a tiddler (it's the last option in the tag popup menu), edit it, rename it and click done. You will asked if you want to rename the tag. Click OK to rename the tag in the tiddlers that use it. Click Cancel to not rename the tag.

!Example
Try renaming [[Plugins]] or [[CSS]] on this site.

!History
* 1.0.1 (5-Mar-06) - Added feature to allow renaming of tags without side-effect of creating a tiddler
* 1.0.0 (5-Mar-06) - First working version

!Code
***/
//{{{

version.extensions.RenameTagsPlugin = {
	major: 1, minor: 0, revision: 0,
	date: new Date(2006,3,5),
	source: "http://simonbaird.com/mptw/#RenameTagsPlugin"
};

config.macros.RenameTagsPlugin = {};
config.macros.RenameTagsPlugin.prompt = "Rename the tag '%0' to '%1' in %2 tidder%3?";

// these are very useful, perhaps they should be in the core
if (!store.addTag) {
	store.addTag = function(title,tag) {
		var t=this.getTiddler(title); if (!t || !t.tags) return;
		t.tags.push(tag);
	};
};

if (!store.removeTag) {
	store.removeTag = function(title,tag) {
		var t=this.getTiddler(title); if (!t || !t.tags) return;
		if (t.tags.find(tag)!=null) t.tags.splice(t.tags.find(tag),1);
	};
};

store.saveTiddler_orig_tagrename = store.saveTiddler;
store.saveTiddler = function(title,newTitle,newBody,modifier,modified,tags) {
	if (title != newTitle && this.getTaggedTiddlers(title).length > 0) {
		// then we are renaming a tag
		var tagged = this.getTaggedTiddlers(title);
		if (confirm(config.macros.RenameTagsPlugin.prompt.format([title,newTitle,tagged.length,tagged.length>1?"s":""]))) {
			for (var i=0;i<tagged.length;i++) {
				store.removeTag(tagged[i].title,title);
				store.addTag(tagged[i].title,newTitle);
				// if tiddler is visible refresh it to show updated tag
				story.refreshTiddler(tagged[i].title,false,true);
			}
		}
		if (!this.tiddlerExists(title) && newBody == "") {
			// dont create unwanted tiddler
			return null;
		}
	}
	return this.saveTiddler_orig_tagrename(title,newTitle,newBody,modifier,modified,tags);
}

//}}}

