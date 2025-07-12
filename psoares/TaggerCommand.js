/***
|''Name:''|TaggerCommand|
|''Description:''|Alternative mechanism for tags management.|
|''Author:''|Paulo Soares|
|''Source:''|http://www.math.ist.utl.pt/~psoares/addons.html|
|''Version:''|1.1|
|''Date:''|Jan 28, 2011|
|''License:''|[[Creative Commons Attribution-ShareAlike 3.0 License|http://creativecommons.org/licenses/by-sa/3.0/ ]]|
|''~CoreVersion:''|2.5|
***/
//{{{
(function($) {

config.commands.tagger = {
  text: 'tags',
  tooltip: 'Manage tags',
  excludeTags: '',
  addTag: 'add tag ',
  removeTag: 'remove tag ',
  newTag: 'new tag',
  newTagPrompt: 'New tag:'
};

config.commands.tagger.handler =  function(ev,src,title) {
  var e = ev || window.event;
  var tagTiddler, target = story.findContainingTiddler(resolveTarget(e));
  var ct = config.commands.tagger;
  var exclude = ct.excludeTags.readBracketedList();
  var tiddler = store.getTiddler(title);
  var popup = Popup.create($(".command_tagger",target)[0],null,"popup tagger");
  var tag, tagsarray = store.getTags();

  for (var i=0; i<tagsarray.length; i++){
    tag = tagsarray[i][0];
    tagTiddler = store.getTiddler(tag);
    if (!(tagTiddler && tagTiddler.isTagged('excludeLists'))){
      if(tiddler.isTagged(tag)){
        createTiddlyButton(createTiddlyElement(popup,"li"),tag,ct.removeTag+" '"+tag+"'",ct.toggle,"button usedTag");
      } else if(!exclude.contains(tag)){
        createTiddlyButton(createTiddlyElement(popup,"li"),tag,ct.addTag+" '"+tag+"'",ct.toggle,"button unusedTag");
      }
    }
  }

  createTiddlyElement(createTiddlyElement(popup,"li"),"hr");
  createTiddlyButton(createTiddlyElement(popup,"li"),ct.newTag,null,ct.toggle);
  Popup.show();
  e.cancelBubble = true;
  if(e.stopPropagation) e.stopPropagation();
  return false;
};


config.commands.tagger.toggle = function(ev) {
  var e = ev || window.event;
  var target = resolveTarget(e);
  if($(target).parent().index() < $(target).parent().parent().children().length-1){
    var tag = $(target).text();
  }
  var title = story.findContainingTiddler(target).getAttribute("tiddler");
  var tiddler = store.getTiddler(title);
  if(!tag){
    var newtag=prompt(config.commands.tagger.newTagPrompt,"");
    if(newtag!='' && newtag!=null)
      {var tag=newtag;}
    else
      {return false;};
  }
  if(!tiddler || !tiddler.tags)
    {store.saveTiddler(title,title,'',config.options.txtUserName,new Date(),tag);}
  else
     {if(!tiddler.isTagged(tag))
        {tiddler.tags.push(tag)}
     else if(!newtag){
       var newtags = [];
       for(var i=0; i<tiddler.tags.length; i++){
         if(tiddler.tags[i]!=tag) newtags.push(tiddler.tags[i]);
       }
       tiddler.tags = newtags;
    };
    store.saveTiddler(tiddler.title,tiddler.title,tiddler.text,tiddler.modifier,tiddler.modified,tiddler.tags);
  };
  if(config.options.chkAutoSave)
    saveChanges();
  return false;
};
})(jQuery);

setStylesheet(
 ".tagger a.button {display:inline; padding:0 2px 0 2px;}\n"+
 ".tagger .usedTag {font-weight: bold;}\n"+
 ".tagger .unusedTag {color: #777;}",
"TaggerStyles");
//}}}