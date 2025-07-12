//<<saveToDefault>>
config.macros.saveToDefault = {}
config.macros.saveToDefault.handler = function(place){
 createTiddlyButton(place,"save to default","save open tiddlers as default tiddlers",function(){
   store.getTiddler("DefaultTiddlers").text = "";
   story.forEachTiddler(function(tiddler){store.getTiddler("DefaultTiddlers").text +="[["+tiddler+"]]\n"})
   store.setDirty(true);
 });
}