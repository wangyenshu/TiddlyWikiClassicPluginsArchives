//{{{
config.macros.def ={};
config.macros.def.handler  = function(place,macroName,params,wikifier,paramString,tiddler)
{
    var sliceName = params[1]? params[1].toLowerCase() : params[0].toLowerCase();
    var def = store.getTiddlerSlice("InfoDefinitions",sliceName);
    if (def == undefined)
         {
         wikify(params[0],place);
         return false;
         }
    var theClass = params[2]? params[2] : "info";
    var container = createTiddlyElement(place,"span",null,theClass);
    wikify(params[0],container);
    if (document.all)
        {
        container.onmouseover = function(){addClass(this,"infoover");};
        container.onmouseout = function(){removeClass(this,"infoover");};
        }
    var tooltip = createTiddlyElement(container,"span",null,null);
    wikify(def, tooltip);

}

config.macros.note ={};
config.macros.note.handler  = function(place,macroName,params,wikifier,paramString,tiddler)
{
    var sliceName = params[1]? params[1].toLowerCase() : params[0].toLowerCase();
    var def = store.getTiddlerSlice("InfoDefinitions",sliceName);
    if (def == undefined)
         {
         wikify(params[0],place);
         return false;
         }
    var theClass = params[2]? params[2] : "note";
    var container = createTiddlyElement(place,"span",null,theClass);
    wikify("^^"+params[0]+"^^",container);
    if (document.all)
        {
        container.onmouseover = function(){addClass(this,"noteover");};
        container.onmouseout = function(){removeClass(this,"noteover");};
        }
    var tooltip = createTiddlyElement(container,"span",null,null);
    wikify(def, tooltip);

}

//}}}
