/***
Intended for use in ViewTemplate
!Examples
|{{{<<runMacroIfTagged [[Groceries]] toggleTag Buy>>}}}|<<runMacroIfTagged [[Groceries]] toggleTag Buy>>|
|{{{<<runMacroIfTagged Plugins toggleTag systemConfig>>}}}|<<runMacroIfTagged Plugins toggleTag systemConfig>>|
***/
//{{{

// This function contributed by Eric Shulman
function toggleTag(title,tag) {
 var t=store.getTiddler(title); if (!t || !t.tags) return;
 if (t.tags.find(tag)==null) t.tags.push(tag)
 else t.tags.splice(t.tags.find(tag),1)
}

// This function contributed by Eric Shulman
function isTagged(title,tag) {
 var t=store.getTiddler(title); if (!t) return false;
 return (t.tags.find(tag)!=null);
}

config.macros.runMacroIfTagged = {};
config.macros.runMacroIfTagged.handler = function(place,macroName,params,wikifier,paramString,tiddler) {
 if (isTagged(tiddler.title,params[0]))
 config.macros[params[1]].handler(place,params[1],params.slice(2),wikifier,paramString/*fixme*/,tiddler);
}

//}}}
/***
!Todo
* paramString needs to have the first word removed from the front of it at fixme above


***/

