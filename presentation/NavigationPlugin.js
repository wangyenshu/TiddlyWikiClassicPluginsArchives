// Resolves a Tiddler reference or tiddler title into a tiddler title string, or null if it doesn't exist
resolveTitle = function(t)
{
    if (t instanceof Tiddler) t = t.title;
    return store.tiddlerExists(t) ? t : null;
}

config.macros.navigation = {};
config.macros.navigation.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{

        if (!store.tiddlerExists(tiddler.title))
             return false;
	var e = createTiddlyElement(place,"span",null,"nav");
	e.setAttribute("refresh","macro");
	e.setAttribute("macroName",macroName);
	e.setAttribute("params",paramString);
        e.setAttribute("tiddler",tiddler.title)
	this.refresh(e,paramString);
}

config.macros.navigation.refresh = function(place,params)
{
    var tiddler = store.getTiddler(place.getAttribute("tiddler"));
    removeChildren(place);


    var params = place.getAttribute("params").parseParams("tiddlers",null,true);
//alert(store.getTiddlerText(getParam(params,"index",undefined)).parseParams("tiddlers",null,false))
    var tiddlers = getParam(params,"tiddlers",undefined);
if (typeof tiddlers == 'string')
        tiddlers = tiddlers.readBracketedList();
    if (tiddlers == undefined)
        alert("no source tiddlers defined for navigation");
   var contents = [];
   for (var i=0;i<tiddlers.length;i++)
       {
       var title = resolveTitle(tiddlers[i]);
       contents.push(title);
}
    var navIndex = contents.indexOf(tiddler.title);
    if (navIndex == -1)
        return false;
        
    if (contents[navIndex-1])
        {
        wikify("[[<< Previous|"+contents[navIndex-1]+"]]",place);
        place.lastChild.className += " navPrev";
        }
    if (contents[navIndex+1])
        {
        wikify("[[Next >>|"+contents[navIndex+1]+"]]",place);
        place.lastChild.className += " navNext";
        }

    var theTable = createTiddlyElement(place,"table",null,"nav");
    var theBody = createTiddlyElement(theTable,"tbody");
    var theRow = createTiddlyElement(theBody,"tr");
    for (var i=0; i<contents.length; i++)
        {
        var box = createTiddlyElement(theRow,"td",null,"navlinkcell"," ");
        box.onclick = onClickTiddlerLink;
	    box.setAttribute("tiddlyLink",contents[i]);
        box.title = (contents[i]);
        if (contents[i] ==tiddler.title)
           box.className += " activenav";
        }
}

setStylesheet(
".navNext {float:right;}\n"+
".navPrev, .navPrevious{float:left;}\n"+
".nav .tiddlyLink  {color:#000; background:transparent;border:none;padding:0;margin:0;}\n"+
".nav {padding:0;margin:0;}\n"+
".nav table {margin:0 auto !important; border:0px solid #000;padding:0;border-collapse:separate;}\n"+
".nav table tr{padding:0; margin:0;border-spacing: 1px;}\n"+
".nav table td {padding:4px; border:1px solid #000; border-spacing: 0px;cursor:pointer;cursor:hand}\n"+
".nav .activenav{background:#000 !important;}\n","NavigationPluginStyles");