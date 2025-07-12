/***
This is a little utility useful for demonstrating markup and macro usage. There are two versions, one puts the example code and the wikified output in two columns of a table. The other puts the example code above the wikified output. Use \ to escape > for closing macros. See ShowClockMacro for another example.

Example usage of the inline version, eg:
{{{
<<eg
Version <<version\>\>
>>
}}}
Does this:
<<eg
Version <<version\>\>
>>
Example usage of the tabular version, egt:
{{{<<egt Version <<version\>\> >>}}}
Shows this:
<<egt Version <<version\>\> >>



***/
//{{{
version.extensions.ExampleMacro = { major: 0, minor: 0, revision: 1, date: new Date(2006,7,12),
	source: "http://tiddlyspot.com/timezones/#ExampleMacro"
};

config.macros.eg = { handler: function (place,macroName,params,wikifier,paramString,tiddler) {
		var p = paramString.replace(/\\>/g,'>');
		wikify("''Markup''\n{{{\n"+p+"\n}}}\n''Result''\n"+p+"\n",place,null,tiddler);
}}

config.macros.egt = { handler: function (place,macroName,params,wikifier,paramString,tiddler) {
		var p = paramString.replace(/\\>/g,'>');
		wikify("|Markup|Result|h\n|{{{"+p+"}}}|"+p+"|\n", place,null,tiddler);
}}


//}}}
