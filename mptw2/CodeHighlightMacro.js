/***
|Name|CodeHighlightMacro|
|Created by|ChrisNilsson|
|Location|http://www.slort.org/otherchirps/tiddlywiki/CodeHighlightMacro|
|Version|0.0.1|
|Requires|~TW2.x,dp.SourceHighlight|
!Description


!History

!Examples
//(A bit cramped, since I'm squeezing the example into one table cell...)//
|!Source|!Output|h
|{{{<<codehighlight python def helloWorld(): print "hello world!">>}}}|<<codehighlight python def helloWorld(): print "hello world!">>|

!Notes
Relies on the dp.SyntaxHighlighter library: http://www.dreamprojections.com/SyntaxHighlighter/

Put its files wherever you like, but assuming everything is in the same directory,
add the following to the Markup tiddlers:

MarkupPostHead
> <!-- Code highlighter engine css -->
> <link type="text/css" rel="stylesheet" href="SyntaxHighlighter.css"></link>

MarkupPostBody
> <!-- Syntax highligher engine code -->
> <script language="javascript" src="shCore.js"></script>
> <script language="javascript" src="shBrushDelphi.js"></script>
> <script language="javascript" src="shBrushPython.js"></script>
> <script language="javascript" src="shBrushXml.js"></script>

The dp.SyntaxHighlighter comes with a few of these "brush" libraries, for different
languages. Add the ones you're interested in using.

!Code
***/
//{{{

// this part is not actually required but useful to other people using your plugin
version.extensions.CodeHighlightMacro = { major: 1, minor: 0, revision: 0, date: new Date(2006,06,12),
	source: "http://www.slort.org/otherchirps/tiddlywiki/CodeHighlightMacro"
};


config.macros.codehighlight = {};

// A global to keep track of how many code chunks we've done.
/*** 
  The examples for dp.SyntaxHighlighter show one big "HighlightAll" call
  at the end of the html document. Then if all code areas have the same name, they
  get converted at once.
  
  But as our "real" html doesn't seem to exist until the tiddler is visible (I think...),
  that doesn't seem to work. Alternatively, calling HighlightAll every time this
  macro is invoked will give odd looking results if all the code chunks have the same name.
  (eg. If you have 5 of these macros displayed, the first area will have 5 copies,
    the next 4, the next will have 3 copies... etc.)
    
  So, here we try to enforce a unique name for each chunk. I figure the tiddler title plus 
  a autoincrement id should be unique enough across the entire wiki.
***/
var codeChunkId = 0;

config.macros.codehighlight.handler = function (place,macroName,params,wikifier,paramString,tiddler) {
  var lang = params[0]; // need at least the language
  var payload = paramString.substr(lang.length+1)
  var codeChunkName = "code_" + tiddler.title + "_" + codeChunkId;
  codeChunkId = codeChunkId + 1;

  var contents = createTiddlyElement(place,"textarea",null,lang,paramString.substr(lang.length+1)) // +1 to eat the newline/seperating space
  contents.setAttribute("name", codeChunkName)
  contents.setAttribute("cols", "60")
 
  dp.SyntaxHighlighter.HighlightAll(codeChunkName);
}

// Convenience shortcuts...
config.macros.delphi = {}
config.macros.python = {}

config.macros.delphi.handler = function(place,macroName,params,wikifier,paramString,tiddler) {
  params.unshift("delphi");
  paramString = "delphi\n" + paramString;
  config.macros.codehighlight.handler(place,macroName,params,wikifier,paramString,tiddler);
}

config.macros.delphi.handler = function(place,macroName,params,wikifier,paramString,tiddler) {
  params.unshift("python");
  paramString = "python\n" + paramString;
  config.macros.codehighlight.handler(place,macroName,params,wikifier,paramString,tiddler);
}

// so TW table styles don't get in the way
// can't get the specificity right... :(
// ie stronger than TW styles weaker than dp styles.
// hence redo a couple of dp styles here...
setStylesheet(
 ".viewer .dp-highlighter table { border-collapse:separate; border-style:none; }\n" +
 ".viewer .dp-highlighter td { border-style:none; padding-left:10px; }\n" +
 ".viewer .dp-highlighter .gutter { border-right:1px solid grey; }\n" +
 ".viewer .dp-highlighter tbody .tools-corner { border-right:1px solid grey; }\n" +
 ".viewer .dp-highlighter .tools { border-bottom:1px solid grey; }\n" +
 "","codeHighlight");


//}}}

/***

!Another example
<<codehighlight python

import feedparser
d = feedparser.parse('http://feedparser.org/docs/examples/atom10.xml')
print d.feed.title          # u'Sample feed'
print d.feed.link           # u'http://example.org/'
print d.feed.subtitle       # u'For documentation <em>only</em>'
print d.feed.updated        # u'2005-11-09T11:56:34Z'
print d.feed.updated_parsed # (2005, 11, 9, 11, 56, 34, 2, 313, 0)
print d.feed.id             # u'tag:feedparser.org,2005-11-09:/docs/examples/atom10.xml'

>>

!or the shortcuts...

<<delphi
procedure HelloWorld;
begin
  ShowMessage('Hello world!');
end;
>>


***/
