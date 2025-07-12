/***
| Name:|QuickOpenTagPlugin|
| Purpose:|Makes tag links into a Taggly style open tag plus a normal style drop down menu|
| Creator:|SimonBaird|
| Source:|http://simonbaird.com/mptw/#QuickOpenTagPlugin|
| Requires:|TW 2.x|
| Version|1.1.1 (19-May-06)|

!History
* Version 1.1.1 (19/05/2006)
** Added a little more CSS so the tags look good in standard main menus and normal tiddlers
* Version 1.1 (07/02/2006)
** Fix Firefox 1.5.0.1 crashes
** Updated by ~BidiX[at]~BidiX.info
* Version 1.0 (?/01/2006)
** First release

***/
//{{{

//⊻ ⊽ ⋁ ▼ 

window.createTagButton_orig_mptw = createTagButton;
window.createTagButton = function(place,tag,excludeTiddler) {
 var sp = createTiddlyElement(place,"span",null,"quickopentag");
 createTiddlyLink(sp,tag,true,"button");
 var theTag = createTiddlyButton(sp,config.macros.miniTag.dropdownchar,config.views.wikified.tag.tooltip.format([tag]),onClickTag);
 theTag.setAttribute("tag",tag);
 if(excludeTiddler)
 theTag.setAttribute("tiddler",excludeTiddler);
 return(theTag);
};

config.macros.miniTag = {handler:function(place,macroName,params,wikifier,paramString,tiddler) {
 var tagged = store.getTaggedTiddlers(tiddler.title);
 if (tagged.length > 0) {
 var theTag = createTiddlyButton(place,config.macros.miniTag.dropdownchar,config.views.wikified.tag.tooltip.format([tiddler.title]),onClickTag);
 theTag.setAttribute("tag",tiddler.title);
 theTag.className = "miniTag";
 }
}};

config.macros.miniTag.dropdownchar = (document.all?"▼":"▾"); // the fat one is the only one that works in IE

config.macros.allTags.handler = function(place,macroName,params)
{
 var tags = store.getTags();
 var theDateList = createTiddlyElement(place,"ul",null,null,null);
 if(tags.length === 0)
 createTiddlyElement(theDateList,"li",null,"listTitle",this.noTags);
 for (var t=0; t<tags.length; t++)
 {
 var theListItem =createTiddlyElement(theDateList,"li",null,null,null);
 var theLink = createTiddlyLink(theListItem,tags[t][0],true);
 var theCount = " (" + tags[t][1] + ")";
 theLink.appendChild(document.createTextNode(theCount));

 var theDropDownBtn = createTiddlyButton(theListItem," "+config.macros.miniTag.dropdownchar,this.tooltip.format([tags[t][0]]),onClickTag);
 theDropDownBtn.setAttribute("tag",tags[t][0]);
 }
};


// probably could redo these styles a bit cleaner..
setStylesheet(
 ".tagglyTagged .quickopentag, .tagged .quickopentag \n"+
 "     { margin-right:1.2em; border:1px solid #eee; padding:2px; padding-right:0px; padding-left:1px; }\n"+
 ".quickopentag .tiddlyLink { padding:2px; padding-left:3px; }\n"+
 ".quickopentag a.button { padding:1px; padding-left:2px; padding-right:2px;}\n"+
// extra specificity to make it work?
 "#displayArea .viewer .quickopentag a.button, \n"+
 "#displayArea .viewer .quickopentag a.tiddyLink, \n"+
 "#mainMenu .quickopentag a.tiddyLink, \n"+
 "#mainMenu .quickopentag a.tiddyLink \n"+
         " { border:0px solid black; }\n"+
 "#displayArea .viewer .quickopentag a.button, \n"+
 "#mainMenu .quickopentag a.button \n"+
    "{ margin-left:0px; padding-left:2px; }\n"+
 "#displayArea .viewer .quickopentag a.tiddlyLink, \n"+
 "#mainMenu .quickopentag a.tiddlyLink \n"+
   " { margin-right:0px; padding-right:0px; padding-left:0px; margin-left:0px; }\n"+
 "a.miniTag {font-size:150%;} \n"+
 "#mainMenu .quickopentag a.button \n"+
    "{ margin-left:0px; padding-left:2px; margin-right:0px; padding-right:0px; }\n"+ // looks better in right justified main menus
 "",
"QuickOpenTagStyles");

//}}}

/***
<html>&#x22bb; &#x22bd; &#x22c1; &#x25bc; &#x25be;</html>
***/
