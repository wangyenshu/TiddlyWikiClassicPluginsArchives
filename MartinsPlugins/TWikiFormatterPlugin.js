/***
|''Name:''|TWikiFormatterPlugin|
|''Description:''|Allows Tiddlers to use [[TWiki|http://twiki.org/cgi-bin/view/TWiki/TextFormattingRules]] text formatting|
|''Author:''|Martin Budden (mjbudden (at) gmail (dot) com)|
|''Source:''|http://www.martinswiki.com/#TWikiFormatterPlugin|
|''CodeRepository:''|http://svn.tiddlywiki.org/Trunk/contributors/MartinBudden/formatters/TWikiFormatterPlugin.js|
|''Version:''|0.2.5|
|''Date:''|Nov 5, 2006|
|''Comments:''|Please make comments at http://groups.google.co.uk/group/TiddlyWikiDev|
|''License:''|[[Creative Commons Attribution-ShareAlike 2.5 License|http://creativecommons.org/licenses/by-sa/2.5/]]|
|''~CoreVersion:''|2.1.3|

|''Display unsupported TWiki variables''|<<option chkDisplayTWikiVariables>>|

This the TWikiFormatterPlugin, which allows you to insert TWiki formated text into a TiddlyWiki.

The aim is not to fully emulate TWiki, but to allow you to work with TWiki content off-line and then resync the content with your TWiki later on, with the expectation that only minor edits will be required.

To use TWiki format in a Tiddler, tag the Tiddler with TWikiFormat or set the tiddler's {{{wikiformat}}} extended field to {{{twiki}}}.

Please report any defects you find at http://groups.google.co.uk/group/TiddlyWikiDev

!!!Issues
There are (at least) the following known issues:
# Table code is incomplete.
## Table headings not yet supported.
# Anchors not yet supported.
# TWiki variables not supported

***/

//{{{
// Ensure that the TWikiFormatter Plugin is only installed once.
if(!version.extensions.TWikiFormatterPlugin) {
version.extensions.TWikiFormatterPlugin = {installed:true};

if(version.major < 2 || (version.major == 2 && version.minor < 1))
	{alertAndThrow('TWikiFormatterPlugin requires TiddlyWiki 2.1 or later.');}

if(config.options.chkDisplayTWikiVariables == undefined)
	{config.options.chkDisplayTWikiVariables = false;}

TWikiFormatter = {}; // 'namespace' for local functions

twDebug = function(out,str)
{
	createTiddlyText(out,str.replace(/\n/mg,'\\n').replace(/\r/mg,'RR'));
	createTiddlyElement(out,'br');
};

TWikiFormatter.Tiddler_changed = Tiddler.prototype.changed;
Tiddler.prototype.changed = function()
{
	if((this.fields.wikiformat==config.parsers.twikiFormatter.format) || this.isTagged(config.parsers.twikiFormatter.formatTag)) {
		this.links = [];
		var tiddlerLinkRegExp = /\[\[(.*?)(?:\]\[(?:.*?))?\]\]/mg;
		tiddlerLinkRegExp.lastIndex = 0;
		var match = tiddlerLinkRegExp.exec(this.text);
		while(match) {
			this.links.pushUnique(match[1]);
			match = tiddlerLinkRegExp.exec(this.text);
		}
	} else if(!this.isTagged('systemConfig')) {
		TWikiFormatter.Tiddler_changed.apply(this,arguments);
		return;
	}
	this.linksUpdated = true;
};

Tiddler.prototype.escapeLineBreaks = function()
{
	var r = this.text.escapeLineBreaks();
	if(this.isTagged(config.parsers.twikiFormatter.formatTag)) {
		r = r.replace(/\x20\x20\x20/mg,'\\b \\b');
		r = r.replace(/\x20\x20/mg,'\\b ');
	}
	return r;
};

config.textPrimitives.twikiLink = '(?:' + 
		config.textPrimitives.upperLetter + '+' + config.textPrimitives.lowerLetter + '+' +
		config.textPrimitives.upperLetter + config.textPrimitives.anyLetter + '*)';

TWikiFormatter.setAttributesFromParams = function(e,p)
{
	var re = /\s*(.*?)=(?:(?:"(.*?)")|(?:'(.*?)')|((?:\w|%|#)*))/mg;
	var match = re.exec(p);
	while(match) {
		var s = match[1].unDash();
		if(s == 'bgcolor') {
			s = 'backgroundColor';
		}
		try {
			if(match[2]) {
				e.setAttribute(s,match[2]);
			} else if(match[3]) {
				e.setAttribute(s,match[3]);
			} else {
				e.setAttribute(s,match[4]);
			}
		}
		catch(ex) {}
		match = re.exec(p);
	}
};

config.formatterHelpers.singleCharFormat = function(w)
{
	this.lookaheadRegExp.lastIndex = w.matchStart;
	var lookaheadMatch = this.lookaheadRegExp.exec(w.source);
	if(lookaheadMatch && lookaheadMatch.index == w.matchStart && lookaheadMatch[0].substr(lookaheadMatch[0].length-2,1) != ' ') {
		w.subWikifyTerm(createTiddlyElement(w.output,this.element),this.termRegExp);
		w.nextMatch = this.lookaheadRegExp.lastIndex;
	} else {
		w.outputText(w.output,w.matchStart,w.nextMatch);
	}
};

config.formatterHelpers.doubleCharFormat = function(w)
{
	this.lookaheadRegExp.lastIndex = w.matchStart;
	var lookaheadMatch = this.lookaheadRegExp.exec(w.source);
//twDebug(w.output,'dcmt:'+w.matchText);
//twDebug(w.output,'lm:'+lookaheadMatch);
//twDebug(w.output,'lm0:'+lookaheadMatch[0]+' lm:'+lookaheadMatch[0].length);
	if(lookaheadMatch && lookaheadMatch.index == w.matchStart &&
			lookaheadMatch[0].substr(lookaheadMatch[0].length-3,1) != ' ') {
		var e = createTiddlyElement(w.output,this.element);
		w.subWikifyTerm(createTiddlyElement(e,this.element2),this.termRegExp);
		w.nextMatch = this.lookaheadRegExp.lastIndex;
	} else {
		w.outputText(w.output,w.matchStart,w.nextMatch);
	}
};

config.twiki = {};
config.twiki.formatters = [
{
	name: 'twikiTable',
	match: '^\\|(?:[^\\n]*)\\|$',
	lookaheadRegExp: /^\|([^\n]*)\|$/mg,
	rowTermRegExp: /(\|$\n?)/mg,
	cellRegExp: /(?:\|([^\n\|]*)\|)|(\|$\n?)/mg,
	cellTermRegExp: /((?:\x20*)\|)/mg,
	handler: function(w)
	{
		var table = createTiddlyElement(w.output,'table');
		var rowContainer = table;//createTiddlyElement(table,'tbody');
		var prevColumns = [];
		var rowCount = 0;
		w.nextMatch = w.matchStart;
		this.lookaheadRegExp.lastIndex = w.nextMatch;
		var lookaheadMatch = this.lookaheadRegExp.exec(w.source);
		while(lookaheadMatch && lookaheadMatch.index == w.nextMatch) {
			var rowClass = (rowCount&1) ? 'TD.odd' : 'TD.even';
			if(rowCount==1) rowClass = 'TD.heading';
			if(rowCount==3) rowClass = 'TD.third';
			this.rowHandler(w,createTiddlyElement(rowContainer,'tr',null,rowClass),prevColumns);
			rowCount++;
			this.lookaheadRegExp.lastIndex = w.nextMatch;
			lookaheadMatch = this.lookaheadRegExp.exec(w.source);
		}
	},
	rowHandler: function(w,e,prevColumns)
	{
		var col = 0;
		var colSpanCount = 1;
		var prevCell = null;
		this.cellRegExp.lastIndex = w.nextMatch;
		var cellMatch = this.cellRegExp.exec(w.source);
		while(cellMatch && cellMatch.index == w.nextMatch) {
			if(cellMatch[1] == '^') {
				// Rowspan
				var last = prevColumns[col];
				if(last) {
					last.rowSpanCount++;
					last.element.setAttribute('rowspan',last.rowSpanCount);
					last.element.setAttribute('rowSpan',last.rowSpanCount); // Needed for IE
					last.element.valign = 'center';
				}
				w.nextMatch = this.cellRegExp.lastIndex-1;
			} else if(cellMatch[1] === '') {
				// Colspan
				colSpanCount++;
				w.nextMatch = this.cellRegExp.lastIndex-1;
			} else if(cellMatch[2]) {
				// End of row
				if(prevCell && colSpanCount > 1) {
					prevCell.setAttribute('colspan',colSpanCount);
					prevCell.setAttribute('colSpan',colSpanCount); // Needed for IE
				}
				w.nextMatch = this.cellRegExp.lastIndex;
				break;
			} else {
				// Cell
				w.nextMatch++;
				var spaceLeft = false;
				var chr = w.source.substr(w.nextMatch,1);
				while(chr == ' ') {
					spaceLeft = true;
					w.nextMatch++;
					chr = w.source.substr(w.nextMatch,1);
				}
				var cell = createTiddlyElement(e,'td');
				prevCell = cell;
				prevColumns[col] = {rowSpanCount:1, element:cell};
				if(colSpanCount > 1) {
					cell.setAttribute('colspan',colSpanCount);
					cell.setAttribute('colSpan',colSpanCount); // Needed for IE
					colSpanCount = 1;
				}
				
				w.subWikifyTerm(cell,this.cellTermRegExp);
				if(w.matchText.substr(w.matchText.length-2,1) == ' ') {
					// spaceRight
					cell.align = spaceLeft ? 'center' : 'left';
				} else if(spaceLeft) {
					cell.align = 'right';
				}
				w.nextMatch--;
			}
			col++;
			this.cellRegExp.lastIndex = w.nextMatch;
			cellMatch = this.cellRegExp.exec(w.source);
		}
	}
},

{
	name: 'twikiRule',
	match: '^---+$\\n?',
	handler: function(w)
	{
		createTiddlyElement(w.output,'hr');
	}
},

{
//<h1><a name='TWiki_Text_Formatting'></a> TWiki Text Formatting </h1>
	name: 'twikiHeading',
	match: '^---[\\+#]{0,5}',
	lookaheadRegExp: /^---[\+#]{0,5}(?:!!)? ?(.*?)\n/mg,
	termRegExp: /(\n)/mg,
	handler: function(w)
	{
		var h = createTiddlyElement(w.output,'h' + (w.matchLength-2));
		this.lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = this.lookaheadRegExp.exec(w.source);
		if(lookaheadMatch && lookaheadMatch.index == w.matchStart) {
			var a = createTiddlyElement(w.output,'a');
			var prefix = w.tiddler ? w.tiddler.title : '';
			var name = '#'+ prefix + lookaheadMatch[1];
			name = name.replace(/ /g,'_');
			a.name = name;
			w.nextMatch = this.lookaheadRegExp.lastIndex - lookaheadMatch[1].length - 1;
			w.subWikifyTerm(h,this.termRegExp);
		}
	}
},

{
	name: 'twikiAnchor',
	match: '^#' + config.textPrimitives.wikiLink + '\\s',
	lookaheadRegExp: /^#(.*?)\s/mg,
	handler: function(w)
	{
		this.lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = this.lookaheadRegExp.exec(w.source);
		if(lookaheadMatch && lookaheadMatch.index == w.matchStart) {
			var a = createTiddlyElement(w.output,'a');
			var prefix = w.tiddler ? w.tiddler.title : '';
			var name = '#'+ prefix + lookaheadMatch[1];
			name = name.replace(/ /g,'_');
			a.name = name;
			w.nextMatch = this.lookaheadRegExp.lastIndex;
		}
	}
},

{
	name: 'twikiDefinitionList',
	match: '^   \\$ .+?:.+?\\n',
	lookaheadRegExp: /^   \$ (.+?):(.+?)\n/mg,
	termRegExp: /(\n)/mg,
	handler: function(w)
	{
		var li = createTiddlyElement(w.output,'dl');
		w.nextMatch = w.matchStart;
		this.lookaheadRegExp.lastIndex = w.nextMatch;
		var lookaheadMatch = this.lookaheadRegExp.exec(w.source);
		while(lookaheadMatch && lookaheadMatch.index == w.nextMatch) {
			w.nextMatch += 5;
			w.subWikifyTerm(createTiddlyElement(li,'dt'),/(:)/mg);
			w.subWikifyTerm(createTiddlyElement(li,'dd'),this.termRegExp);
			lookaheadMatch = this.lookaheadRegExp.exec(w.source);
		}
	}
},

{
	name: 'twikiList',
	match: '^(?:   )+(?:(?:\\*)|(?:[1AaIi](?:\\.)?)) ',
	lookaheadRegExp: /^(?:   )+(?:(\*)|(?:([1AaIi])(\.)?)) /mg,
	//termRegExp: /(\n\n|\n(?=(?:   )+[\\*1AaIi]))/mg,
	termRegExp: /(\n)/mg,
	handler: function(w)
	{
//twDebug(w.output,'mt:'+w.matchText);
		var stack = [w.output];
		var currLevel = 0;
		var currType = null;
		var listLevel, listType;
		var itemType = 'li';
		w.nextMatch = w.matchStart;
		this.lookaheadRegExp.lastIndex = w.nextMatch;
		var lookaheadMatch = this.lookaheadRegExp.exec(w.source);
		while(lookaheadMatch && lookaheadMatch.index == w.nextMatch) {
//twDebug(w.output,'lm0:'+lookaheadMatch[0]);
			listType = 'ol';
			listLevel = (lookaheadMatch[0].length-(lookaheadMatch[3]?3:2))/3;
			var style = null;
			if(lookaheadMatch[1]=='*') {
				listType = 'ul';
			} else if(lookaheadMatch[2]=='1') {
				style = 'decimal';
			} else if(lookaheadMatch[2]=='A') {
				style = 'upper-alpha';
			} else if(lookaheadMatch[2]=='a') {
				style = 'lower-alpha';
			} else if(lookaheadMatch[2]=='I') {
				style = 'upper-roman';
			} else if(lookaheadMatch[2]=='i') {
				style = 'lower-roman';
			}
			w.nextMatch += lookaheadMatch[0].length;
			if(listLevel > currLevel) {
				for(var i=currLevel; i<listLevel; i++) {
					stack.push(createTiddlyElement(stack[stack.length-1],listType));
				}
			} else if(listLevel < currLevel) {
				for(i=currLevel; i>listLevel; i--) {
					stack.pop();
				}
			} else if(listLevel == currLevel && listType != currType) {
				stack.pop();
				stack.push(createTiddlyElement(stack[stack.length-1],listType));
			}
			currLevel = listLevel;
			currType = listType;
			var e = createTiddlyElement(stack[stack.length-1],itemType);
			e.style[config.browser.isIE ? 'list-style-type' : 'listStyleType'] = style;
			w.subWikifyTerm(e,this.termRegExp);
			this.lookaheadRegExp.lastIndex = w.nextMatch;
			lookaheadMatch = this.lookaheadRegExp.exec(w.source);
		}
	}
},

{
	name: 'twikiNoAutoLink',
	match: '^\\s*<noautolink>',
	lookaheadRegExp: /\s*<noautolink>((?:.|\n)*?)<\/noautolink>/mg,
	termRegExp: /(<\/noautolink>)/mg,
	handler: function(w)
	{
		this.lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = this.lookaheadRegExp.exec(w.source);
		if(lookaheadMatch && lookaheadMatch.index == w.matchStart) {
			var autoLinkWikiWords = w.autoLinkWikiWords;
			w.autoLinkWikiWords = false;
			w.subWikifyTerm(w.output,this.termRegExp);
			w.autoLinkWikiWords = autoLinkWikiWords;
			w.nextMatch = this.lookaheadRegExp.lastIndex;
		} else {
			w.outputText(w.output,w.matchStart,w.nextMatch);
		}
	}
},

{
	name: 'macro',
	match: '<<',
	lookaheadRegExp: /<<([^>\s]+)(?:\s*)((?:[^>]|(?:>(?!>)))*)>>/mg,
	handler: function(w)
	{
		this.lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = this.lookaheadRegExp.exec(w.source);
		if(lookaheadMatch && lookaheadMatch.index == w.matchStart && lookaheadMatch[1]) {
			w.nextMatch = this.lookaheadRegExp.lastIndex;
			invokeMacro(w.output,lookaheadMatch[1],lookaheadMatch[2],w,w.tiddler);
		}
	}
},

{
	name: 'twikiNotExplicitLink',
	match: '!\\[\\[',
	handler: function(w)
	{
		w.outputText(w.output,w.matchStart+1,w.nextMatch);
	}
},

//[[WikiWord#NotThere]]
//[[#MyAnchor][Jump]]
//<a href='/cgi-bin/view/Sandbox/WebHome#Sandbox_Web_Site_Tools'> Sandbox Web Site Tools </a>
//<a href='/cgi-bin/view/Sandbox/MeetingMinutes' class='twikiLink'>MeetingMinutes</a>
{
	name: 'twikiAnchorLink',
	match: '\\[\\[(?:'+ config.textPrimitives.twikiLink +')?#',
	lookaheadRegExp: /\[\[(.*?)?#(.*?)(?:\]\[(.*?))?\]\]/mg,
	handler: function(w)
	{
//twDebug(w.output,'al:'+w.matchText);
//twDebug(w.output,'lm:'+lookaheadMatch);
		this.lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = this.lookaheadRegExp.exec(w.source);
		if(lookaheadMatch && lookaheadMatch.index == w.matchStart) {
//twDebug(w.output,'lm0:'+lookaheadMatch[0]);
			var a = createTiddlyElement(w.output,'a');
			var prefix = w.tiddler ? w.tiddler.title : '';
			var href = lookaheadMatch[1] ? lookaheadMatch[1] : '';
			href += '#' + prefix + lookaheadMatch[2];
			href = href.replace(/ /g,'_');
//twDebug(w.output,'hr:'+href);
			a.href = href;
			a.innerHTML = lookaheadMatch[3] ? lookaheadMatch[3] : lookaheadMatch[2];
			w.nextMatch = this.lookaheadRegExp.lastIndex;
		}
	}
},

{
	name: 'twikiExplicitLink',
	match: '\\[\\[',
	lookaheadRegExp: /\[\[(.*?)(?:\]\[(.*?))?\]\]/mg,
	handler: function(w)
	{
		this.lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = this.lookaheadRegExp.exec(w.source);
		if(lookaheadMatch && lookaheadMatch.index == w.matchStart) {
			var e = null;
			var link = lookaheadMatch[1];
			if (lookaheadMatch[2]) {
				// titled bracketted link
				var text = lookaheadMatch[2];
				e = config.formatterHelpers.isExternalLink(link) ? createExternalLink(w.output,link) : createTiddlyLink(w.output,link,false,null,w.isStatic,w.tiddler);
			} else {
				// simple bracketted link
				text = link;
				var s = text.indexOf(' ');
				if(s!=-1) {
					link = text.substring(0,s).trim();
					if(config.formatterHelpers.isExternalLink(link)) {
						e = createExternalLink(w.output,link);
						text = text.substring(s+1).trim();
					} else {
						e = createTiddlyLink(w.output,text,false,null,w.isStatic,w.tiddler);
					}
				} else {
					e = createTiddlyLink(w.output,link,false,null,w.isStatic,w.tiddler);
				}
			}
			createTiddlyText(e,text);
			w.nextMatch = this.lookaheadRegExp.lastIndex;
		}
	}
},

{
	name: 'twikiNotWikiLink',
	match: '(?:!|<nop>)' + config.textPrimitives.wikiLink,
	handler: function(w)
	{
		w.outputText(w.output,w.matchStart+(w.matchText.substr(0,1)=='!'?1:5),w.nextMatch);
	}
},

{
	name: 'twikiWikiLink',
	match: config.textPrimitives.twikiLink,
	handler: function(w)
	{
		if(w.matchStart > 0) {
			var preRegExp = new RegExp(config.textPrimitives.anyLetter,'mg');
			preRegExp.lastIndex = w.matchStart-1;
			var preMatch = preRegExp.exec(w.source);
			if(preMatch.index == w.matchStart-1) {
				w.outputText(w.output,w.matchStart,w.nextMatch);
				return;
			}
		}
		if(w.autoLinkWikiWords == true || store.isShadowTiddler(w.matchText)) {
			var link = createTiddlyLink(w.output,w.matchText,false,null,w.isStatic,w.tiddler);
			w.outputText(link,w.matchStart,w.nextMatch);
		} else {
			w.outputText(w.output,w.matchStart,w.nextMatch);
		}
	}
},

{
	name: 'twikiUrlLink',
	match: config.textPrimitives.urlPattern,
	handler: function(w)
	{
		w.outputText(createExternalLink(w.output,w.matchText),w.matchStart,w.nextMatch);
	}
},

{
	name: 'twikiBoldByChar',
	match: '\\*(?!\\s)',
	lookaheadRegExp: /\*(?!\s)(?:.*?)(?!\s)\*(?=\W)/mg,
	termRegExp: /((?!\s)\*(?=\W))/mg,
	element: 'strong',
	handler: config.formatterHelpers.singleCharFormat
},

{
	name: 'twikiBoldTag',
	match: '<b>',
	termRegExp: /(<\/b>)/mg,
	element: 'b',
	handler: config.formatterHelpers.createElementAndWikify
},

{
	name: 'twikiBoldItalicByChar',
	match: '__(?!\\s)',
	lookaheadRegExp: /__(?!\s)(?:.*?)(?!\s)__(?=\W)/mg,
	termRegExp: /((?!\s)__(?=\W))/mg,
	element: 'strong',
	element2: 'em',
	handler: config.formatterHelpers.doubleCharFormat
},

{
	name: 'twikiItalicByChar',
	match: '_(?![\\s|_])',
	lookaheadRegExp: /_(?!\s)(?:.*?)(?!\s)_(?=\W)/mg,
	termRegExp: /((?!\s)_(?=\W))/mg,
	element: 'em',
	handler: config.formatterHelpers.singleCharFormat
},

{
	name: 'twikiBoldMonoSpacedByChar',
	match: '==(?!\\s)',
	lookaheadRegExp: /==(?!\s)(?:.*?)(?!\s)==(?=\W)/mg,
	termRegExp: /((?!\s)==(?=\W))/mg,
	element: 'strong',
	element2: 'code',
	handler: config.formatterHelpers.doubleCharFormat
},

{
	name: 'twikiMonoSpacedByChar',
	match: '=(?![\\s=])',
	lookaheadRegExp: /=(?!\s)(?:.*?)(?!\s)=(?!\w|\'|\")/mg,
	termRegExp: /((?!\s)=(?!\w|\'|\"))/mg,
	element: 'code',
	handler: config.formatterHelpers.singleCharFormat
},

{
	name: 'twikiPreByChar',
	match: '<pre>',
	lookaheadRegExp: /<pre>((?:.|\n)*?)<\/pre>/mg,
	handler: function(w)
	{
		this.lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = this.lookaheadRegExp.exec(w.source);
		if(lookaheadMatch && lookaheadMatch.index == w.matchStart) {
			createTiddlyElement(w.output,'pre',null,null,lookaheadMatch[1]);
			w.nextMatch = this.lookaheadRegExp.lastIndex;
		}
	}
},

{
	name: 'twikiVerbatimByChar',
	match: '<verbatim>',
	lookaheadRegExp: /\<verbatim>((?:.|\n)*?)<\/verbatim>/mg,
	handler: function(w)
	{
		this.lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = this.lookaheadRegExp.exec(w.source);
		if(lookaheadMatch && lookaheadMatch.index == w.matchStart) {
			createTiddlyElement(w.output,'span',null,null,lookaheadMatch[1]);
			w.nextMatch = this.lookaheadRegExp.lastIndex;
		}
	}
},

{
	name: 'twikiParagraph',
	match: '\\n{2,}',
	handler: function(w)
	{
		createTiddlyElement(w.output,'p');
	}
},

{
	name: 'twikiNop',
	match: '<nop>',
	handler: function(w)
	{
		w.outputText(w.output,w.matchStart+5,w.nextMatch);
	}
},

{
	name: 'twikiExplicitLineBreak',
	match: '%BR%|<br ?/?>|<BR ?/?>',
	handler: function(w)
	{
		createTiddlyElement(w.output,'br');
	}
},

{
	name: 'twikiColorByChar',
	match: '%(?:YELLOW|ORANGE|RED|PINK|PURPLE|TEAL|NAVY|BLUE|AQUA|LIME|GREEN|OLIVE|MAROON|BROWN|BLACK|GRAY|SILVER|WHITE)%',
	lookaheadRegExp: /%(YELLOW|ORANGE|RED|PINK|PURPLE|TEAL|NAVY|BLUE|AQUA|LIME|GREEN|OLIVE|MAROON|BROWN|BLACK|GRAY|SILVER|WHITE)/mg,
	termRegExp: /(%ENDCOLOR%)/mg,
	handler:  function(w)
	{
		this.lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = this.lookaheadRegExp.exec(w.source);
		if(lookaheadMatch && lookaheadMatch.index == w.matchStart) {
			var e = createTiddlyElement(w.output,'span');
			e.style.color = lookaheadMatch[1];
			w.subWikifyTerm(e,this.termRegExp);
		}
	}
},

{
	name: 'twikiVariable',
	match: '(?:!)?%(?:<nop>)?[A-Z]+(?:\\{.*?\\})?%',
	lookaheadRegExp: /(!)?%(<nop>)?([A-Z]+)(?:\{(.*?)\})?%/mg,
	handler: function(w)
	{
		this.lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = this.lookaheadRegExp.exec(w.source);
		if(lookaheadMatch && lookaheadMatch.index == w.matchStart) {
			if(lookaheadMatch[1]) {
				// ! - escape variable
				w.outputText(w.output,w.matchStart+1,w.nextMatch);
			} else if(lookaheadMatch[2]) {
				//nop
				var text = w.matchText.replace(/<nop>/g,'');
				createTiddlyText(w.output,text);
			} else {
				// deal with variables by name here
				if(lookaheadMatch[3]=='BB') {
					createTiddlyElement(w.output,'br');
					createTiddlyElement(w.output,'span').innerHTML = '&bull;';
				} else if(config.options.chkDisplayTWikiVariables) {
					// just output the text of any variables that are not understood
					w.outputText(w.output,w.matchStart,w.nextMatch);
				}
			}
			w.nextMatch = this.lookaheadRegExp.lastIndex;
		}
	}
},

{
	name: 'twikiHtmlEntitiesEncoding',
	match: '&#?[a-zA-Z0-9]{2,8};',
	handler: function(w)
	{
		createTiddlyElement(w.output,'span').innerHTML = w.matchText;
	}
},

{
	name: 'twikiComment',
	match: '<!\\-\\-',
	lookaheadRegExp: /<!\-\-((?:.|\n)*?)\-\->/mg,
	handler: function(w)
	{
		this.lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = this.lookaheadRegExp.exec(w.source);
		if(lookaheadMatch && lookaheadMatch.index == w.matchStart) {
			w.nextMatch = this.lookaheadRegExp.lastIndex;
		}
	}
},

{
	name: 'twikiHtmlTag',
	match: "<(?:[a-zA-Z]{2,}|a)(?:\\s*(?:[a-zA-Z]*?=[\"']?[^>]*?[\"']?))*?>",
	lookaheadRegExp: /<([a-zA-Z]+)((?:\s+[a-zA-Z]*?=["']?[^>\/\"\']*?["']?)*?)?\s*(\/)?>/mg,
	handler: function(w)
	{
		this.lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = this.lookaheadRegExp.exec(w.source);
		if(lookaheadMatch && lookaheadMatch.index == w.matchStart) {
			var e =createTiddlyElement(w.output,lookaheadMatch[1]);
			if(lookaheadMatch[2]) {
				TWikiFormatter.setAttributesFromParams(e,lookaheadMatch[2]);
			}
			if(lookaheadMatch[3]) {
				w.nextMatch = this.lookaheadRegExp.lastIndex;// empty tag
			} else {
				w.subWikify(e,'</'+lookaheadMatch[1]+'>');
			}
		}
	}
}
];

config.parsers.twikiFormatter = new Formatter(config.twiki.formatters);
config.parsers.twikiFormatter.format = 'twiki';
config.parsers.twikiFormatter.formatTag = 'TWikiFormat';
} // end of 'install only once'
//}}}