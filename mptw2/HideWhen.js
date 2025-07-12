/***
For use in ViewTemplate 
***/
//{{{

config.macros.hideWhen = {};
config.macros.hideWhen.handler = function (place,macroName,params,wikifier,paramString,tiddler) {
 if (eval(params[0]))
 place.style["display"] = 'none';
}

config.macros.hideUnless = {};
config.macros.hideUnless.handler = function (place,macroName,params,wikifier,paramString,tiddler) {
 if (!eval(params[0]))
 place.style["display"] = 'none';
}


//}}}