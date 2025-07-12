/***
<<viewHtml>>
<<viewAsJs>>
***/
//{{{

config.macros.viewHtml = {handler: function (place,macroName,params,wikifier,paramString,tiddler) {
  createTiddlyButton(place,"AsHtml","",function() {
    var divs = document.getElementById("tiddler"+tiddler.title).getElementsByTagName("div");
    for (var i=0;i<divs.length;i++)
      if (divs[i].className == "viewer")
        displayMessage(divs[i].innerHTML);
  });
}};

String.prototype.escapeLineBreaks = function() {
  // from Tiddler.prototype.escapeLineBreaks
  return this.replace(regexpBackSlash,"\\s").replace(regexpNewLine,"\\n").replace(regexpCarriageReturn,"");
}

// this doesn't work right in IE..
setStylesheet("#messageArea {overflow:auto; max-height:95%;}","scrollDisplayAreaCSS");

config.macros.viewAsJs = {handler: function (place,macroName,params,wikifier,paramString,tiddler) {
  createTiddlyButton(place,"AsJs","",function() {
      displayMessage('config.shadowTiddlers["' + tiddler.title + '"] = "' + 
                 store.getTiddlerText(tiddler.title).escapeLineBreaks().replace(/"/g,'\\"') + '";');
  });
}};


//}}}
