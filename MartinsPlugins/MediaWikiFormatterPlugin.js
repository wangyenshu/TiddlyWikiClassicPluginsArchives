/***
|''Name:''|MediaWikiFormatterPlugin|
|''Description:''|Allows Tiddlers to use [[MediaWiki|http://meta.wikimedia.org/wiki/Help:Wikitext]] ([[WikiPedia|http://meta.wikipedia.org/]]) text formatting|
|''Author:''|Martin Budden (mjbudden (at) gmail (dot) com)|
|''Source:''|http://www.martinswiki.com/#MediaWikiFormatterPlugin |
|''CodeRepository:''|http://svn.tiddlywiki.org/Trunk/contributors/MartinBudden/formatters/MediaWikiFormatterPlugin.js |
|''Version:''|0.4.6|
|''Date:''|Jul 27, 2007|
|''Comments:''|Please make comments at http://groups.google.co.uk/group/TiddlyWikiDev |
|''License:''|[[Creative Commons Attribution-ShareAlike 2.5 License|http://creativecommons.org/licenses/by-sa/3.0/]] |
|''~CoreVersion:''|2.1.0|

|''Display instrumentation''|<<option chkDisplayInstrumentation>>|
|''Display empty template links:''|<<option chkMediaWikiDisplayEmptyTemplateLinks>>|
|''Allow zooming of thumbnail images''|<<option chkMediaWikiDisplayEnableThumbZoom>>|
|''List references''|<<option chkMediaWikiListReferences>>|
|''Display unsupported magic words''|<<option chkDisplayMediaWikiMagicWords>>|

This is the MediaWikiFormatterPlugin, which allows you to insert MediaWiki formated text into a TiddlyWiki.

The aim is not to fully emulate MediaWiki, but to allow you to work with MediaWiki content off-line and then resync the content with your MediaWiki later on, with the expectation that only minor edits will be required.

To use MediaWiki format in a Tiddler, tag the Tiddler with MediaWikiFormat or set the tiddler's {{{wikiformat}}} extended field to {{{mediawiki}}}.

!!!Issues
There are (at least) the following known issues:
# Not all styles from http://meta.wikimedia.org/wiki/MediaWiki:Common.css incorporated
## Styles for tables don't yet match Wikipedia styles.
## Styles for image galleries don't yet match Wikipedia styles.
# Anchors not yet supported.

!!!Not supported
# Template parser functions (also called colon functions) http://meta.wikimedia.org/wiki/ParserFunctions eg &#123;&#123; #functionname: argument 1 | argument 2 | argument 3... &#125;&#125;
# Magic words and variables http://meta.wikimedia.org/wiki/Help:Magic_words eg {{{__TOC__}}}, &#123;&#123;CURRENTDAY&#125;&#125;, &#123;&#123;PAGENAME&#125;&#125;
# {{{^''}}} (italic at start of line) indents, makes italic and quotes with guilmot quote

!!!No plans to support
# Template substitution on save http://meta.wikimedia.org/wiki/Help:Substitution eg &#123;&#123; subst: templatename &#125;&#125;

***/

//{{{
// Ensure that the MediaWikiFormatter Plugin is only installed once.
if(!version.extensions.MediaWikiFormatterPlugin) {
version.extensions.MediaWikiFormatterPlugin = {installed:true};

if(version.major < 2 || (version.major == 2 && version.minor < 1))
	{alertAndThrow('MediaWikiFormatterPlugin requires TiddlyWiki 2.1 or later.');}

if(config.options.chkDisplayInstrumentation == undefined)
	{config.options.chkDisplayInstrumentation = false;}

if(config.options.chkMediaWikiDisplayEmptyTemplateLinks == undefined)
	{config.options.chkMediaWikiDisplayEmptyTemplateLinks = false;}
if(config.options.chkMediaWikiDisplayEnableThumbZoom == undefined)
	{config.options.chkMediaWikiDisplayEnableThumbZoom = false;}
if(config.options.chkMediaWikiListReferences == undefined)
	{config.options.chkMediaWikiListReferences = false;}
if(config.options.chkDisplayMediaWikiMagicWords == undefined)
	{config.options.chkDisplayMediaWikiMagicWords = false;}


//<div class='viewer' macro='view text wikified'></div>;

config.macros.include = {};
config.macros.include.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{
	if((tiddler instanceof Tiddler) && params[0]) {
		var host = store.getValue(tiddler,'server.host');
		if(host && host.indexOf('wikipedia')!=-1) {
			var t = store.fetchTiddler(params[0]);
			var text = store.getValue(t,'text');
			wikify(text,place,highlightHack,tiddler);
		}
	}
};


MediaWikiFormatter = {}; // 'namespace' for local functions

mwDebug = function(out,str)
{
	createTiddlyText(out,str.replace(/\n/mg,'\\n').replace(/\r/mg,'RR'));
	createTiddlyElement2(out,'br');
};

MediaWikiFormatter.Tiddler_changed = Tiddler.prototype.changed;
Tiddler.prototype.changed = function()
{
	if((this.fields.wikiformat==config.parsers.mediawikiFormatter.format) || this.isTagged(config.parsers.mediawikiFormatter.formatTag)) {
		this.links = [];
		var tiddlerLinkRegExp = /\[\[(?::?([A-Za-z]{2,}:)?)(#?)([^\|\]]*?)(?:(\]\])|(\|(.*?)\]\]))/mg;
		tiddlerLinkRegExp.lastIndex = 0;
		var match = tiddlerLinkRegExp.exec(this.text);
		while(match) {
			if(!match[1] && !match[2])
				this.links.pushUnique(match[3]);
			match = tiddlerLinkRegExp.exec(this.text);
		}
	} else if(!this.isTagged('systemConfig')) {
		MediaWikiFormatter.Tiddler_changed.apply(this,arguments);
		return;
	}
	this.linksUpdated = true;
};

TiddlyWiki.prototype.getMediaWikiPagesInNamespace = function(namespace)
{
	var results = [];
	this.forEachTiddler(function(title,tiddler) {
		if(tiddler.title.indexOf(namespace)==0)
			results.push(tiddler);
		});
	results.sort(function(a,b) {return a.title < b.title ? -1 : +1;});
	return results;
};

TiddlyWiki.prototype.getMediaWikiPages = function()
{
	var results = [];
	this.forEachTiddler(function(title,tiddler) {
		if(!tiddler.isTagged('excludeLists') && tiddler.title.indexOf(':')==-1)
			results.push(tiddler);
		});
	results.sort(function(a,b) {return a.title < b.title ? -1 : +1;});
	return results;
};

TiddlyWiki.prototype.getMediaWikiOtherPages = function()
{
	var results = [];
	this.forEachTiddler(function(title,tiddler) {
		if(!tiddler.isTagged('excludeLists') && tiddler.title.indexOf(':')!=-1)
			results.push(tiddler);
		});
	results.sort(function(a,b) {return a.title < b.title ? -1 : +1;});
	return results;
};

config.macros.list.otherpages = {};
config.macros.list.otherpages.handler = function(params)
{
	return store.getMediaWikiOtherPages();
};

config.macros.list.templates = {};
config.macros.list.templates.handler = function(params)
{
	return store.getMediaWikiPagesInNamespace('Template:');
};

config.macros.list.categories = {};
config.macros.list.categories.handler = function(params)
{
	return store.getMediaWikiPagesInNamespace('Category:');
};

function createTiddlyElement2(parent,element)
{
	return parent.appendChild(document.createElement(element));
}

config.formatterHelpers.createElementAndWikify = function(w)
{
	w.subWikifyTerm(createTiddlyElement2(w.output,this.element),this.termRegExp);
};

MediaWikiFormatter.hijackListAll = function ()
{
	MediaWikiFormatter.oldListAll = config.macros.list.all.handler;
	config.macros.list.all.handler = function(params) {
		return store.getMediaWikiPages();
	};
};
MediaWikiFormatter.hijackListAll();

MediaWikiFormatter.normalizedTitle = function(title)
{
	title = title.trim();
	var n = title.charAt(0).toUpperCase() + title.substr(1);
	return n.replace(/\s/g,'_');
};

MediaWikiFormatter.expandVariable = function(w,variable)
{
	switch(variable) {
	case 'PAGENAME':
		createTiddlyText(w.output,w.tiddler.title);
		break;
	case 'PAGENAMEE':
		createTiddlyText(w.output,MediaWikiFormatter.normalizedTitle(w.tiddler.title));
		break;
	case 'REVISIONID':
		var text = w.tiddler.fields['server.revision'];
		if(text)
			createTiddlyText(w.output,text);
		break;
	default:
		return false;
	}
	return true;
};

MediaWikiFormatter.getParserFunctionParams = function(text)
{
	var params = [];
	
//	#if: foo | do if true | do if false

	text += '|';
	//var fRegExp = / ? # ?([a-z]*) ?:/mg;
	//var fRegExp = /#(if) : (foo) :/mg;
	var fRegExp = /(#([a-z]*) *: ([^\|]*))\|/mg;
	fRegExp.lastIndex = 0;
	var match = fRegExp.exec(text);
	var pRegExp = /([^\|]*)\|/mg;
	if(match) {
		pRegExp.lastIndex = fRegExp.lastIndex;
		match = pRegExp.exec(text);
	}
	var i = 1;
	while(match) {
		params[i] = match[1].trim();
		i++;
		match = pRegExp.exec(text);
	}
	return params;
};

MediaWikiFormatter.getTemplateParams = function(text)
{
	var params = {};

	text += '|';
	var pRegExp = /(?:([^\|]*)=)?([^\|]*)\|/mg;
	var match = pRegExp.exec(text);
	if(match) {
		match = pRegExp.exec(text);
	}
	var i = 1;
	while(match) {
		if(match[1]) {
			params[match[1]] = match[2];
		} else {
			params[i] = match[2];
			i++;
		}
		match = pRegExp.exec(text);
	}
	return params;
};








MediaWikiFormatter.expandParserFunction = function(w,text,expr,params)
{
	var fnRegExp = / *#(if) */mg;
	var t = '';//params[0];
	fnRegExp.lastIndex = 0;
	var match = fnRegExp.exec(text);
	if(match) {
		switch(match[1]) {
		case 'if':
			t = expr.trim()=='' ? params[2] : params[1];
			break;
		default:
			break;
		}
	}
	return t;
};

MediaWikiFormatter.expandTemplate = function(w,templateText,params)
{
	var text = templateText;
	text = text.replace(/<noinclude>((?:.|\n)*?)<\/noinclude>/mg,'');// remove text between noinclude tags
	var includeOnlyRegExp = /<includeonly>((?:.|\n)*?)<\/includeonly>/mg;
	var t = '';
	var match = includeOnlyRegExp.exec(text);
	while(match) {
		t += match[1];
		match = includeOnlyRegExp.exec(text);
	}
	text = t == '' ? text : t;

	var paramsRegExp = /\{\{\{(.*?)(?:\|(.*?))?\}\}\}/mg;
	t = '';
	var pi = 0;
	match = paramsRegExp.exec(text);
	while(match) {
		var name = match[1];
		var val = params[name];
		if(!val) {
			val = match[2];
		}
		if(!val) {
			val = '';//val = match[0];
		}
		t += text.substring(pi,match.index) + val;
		pi = paramsRegExp.lastIndex;
		match = paramsRegExp.exec(text);
	}
	t += text.substring(pi);
	return t;
	//return t == '' ? text : t;
/*	//displayMessage("ss:"+text.substring(pi));
	t += text.substring(pi);
	t = MediaWikiFormatter.evaluateTemplateParserFunctions(t);
	//{{#if: {{{perihelion|}}} | <tr><th>[[Perihelion|Perihelion distance]]:</th><td>{{{perihelion}}}</td></tr>}}
	//{{#if:{{{symbol|}}} | {{{symbol}}} | }}
	text = t == '' ? text : t;
	displayMessage("t2:"+text);
	return text;
*/
};

MediaWikiFormatter.endOfParams = function(w,text)
{
	var p = 0;
	var i = text.indexOf('|');
	if(i==-1) {return -1;}
	var n = text.indexOf('\n');
	if(n!=-1 && n<i) {return -1;}
	var b = text.indexOf('[[');
	if(b!=-1 && b<i) {return -1;}
	
	b = text.indexOf('{{');
	while(b!=-1 && b<i) {
		p += b;
		text = text.substr(b);
		var c = text.indexOf('}}');
		p += c;
		text = text.substr(c);
		i = text.indexOf('|');
		if(i==-1) {return -1;}
		n = text.indexOf('\n');
		if(n!=-1 && n<i) {return -1;}
		b = text.indexOf('{{');
		i = -1;
	}
	return i;
};

MediaWikiFormatter.readToDelim = function(w)
//!!! this is a bit rubish, needs doing properly.
{
	var dRegExp = /\|/mg;
	var sRegExp = /\[\[/mg;
	var tRegExp = /\]\]/mg;

	dRegExp.lastIndex = w.startMatch;
	var dMatch = dRegExp.exec(w.source);
	sRegExp.lastIndex = w.startMatch;
	var sMatch = sRegExp.exec(w.source);
	tRegExp.lastIndex = w.startMatch;
	var tMatch = tRegExp.exec(w.source);
	if(!tMatch) {
		return false;
	}

	while(sMatch && sMatch.index<tMatch.index) {
		if(dMatch && dMatch.index<sMatch.index) {
			w.nextMatch = dRegExp.lastIndex;
			w.matchLength = dMatch.index - w.startMatch;
			return true;
		}
		tRegExp.lastIndex = sRegExp.lastIndex;
		tMatch = tRegExp.exec(w.source);
		
		w.nextMatch = tRegExp.lastIndex;
		dRegExp.lastIndex = w.nextMatch;
		dMatch = dRegExp.exec(w.source);
		sRegExp.lastIndex = w.nextMatch;
		sMatch = sRegExp.exec(w.source);
		tRegExp.lastIndex = w.nextMatch;
		tMatch = tRegExp.exec(w.source);
	}
		
	if(dMatch && dMatch.index<tMatch.index) {
		w.nextMatch = dRegExp.lastIndex;
		w.matchLength = dMatch.index - w.startMatch;
		return true;
	}
	if(tMatch) {
		w.nextMatch = tRegExp.lastIndex;
		w.matchLength = tMatch.index - w.startMatch;
		return false;
	}
	w.nextMatch = tRegExp.lastIndex;
	w.matchLength = -1;
	return false;
};

MediaWikiFormatter.getParams = function(w)
{
	var params = [];
	var i = 1;
	w.startMatch = w.nextMatch;
	var read = MediaWikiFormatter.readToDelim(w);
	if(w.matchLength!=-1) {
		params[i] = w.source.substr(w.startMatch,w.matchLength);
	}
	while(read) {
		i++;
		w.startMatch = w.nextMatch;
		read = MediaWikiFormatter.readToDelim(w);
		if(w.matchLength!=-1) {
			params[i] = w.source.substr(w.startMatch,w.matchLength);
		}
	}
	return params;
};

MediaWikiFormatter.setFromParams = function(w,p)
{
	var r = {};
	var re = /\s*(.*?)=(?:(?:"(.*?)")|(?:'(.*?)')|((?:\w|%|#)*))/mg;
	var match = re.exec(p);
	while(match)
		{
		var s = match[1].unDash();
		if(match[2]) {
			r[s] = match[2];
		} else if(match[3]) {
			r[s] = match[3];
		} else {
			r[s] = match[4];
		}
		match = re.exec(p);
	}
	return r;
};

MediaWikiFormatter.setAttributesFromParams = function(e,p)
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

config.mediawiki = {};
config.mediawiki.formatters = [
{
	name: 'mediaWikiHeading',
	match: '^={1,6}(?!=)\\n?',
	termRegExp: /(={1,6}\n?)/mg,
	handler: function(w)
	{
		var output = w.output;
		var e = createTiddlyElement2(output,'h' + w.matchLength);
		var a = createTiddlyElement2(e,'a');
		var t = w.tiddler ? MediaWikiFormatter.normalizedTitle(w.tiddler.title) + ':' : '';
		var len = w.source.substr(w.nextMatch).indexOf('=');
		a.setAttribute('name',t+MediaWikiFormatter.normalizedTitle(w.source.substr(w.nextMatch,len)));
		w.subWikifyTerm(e,this.termRegExp);
	}
},

{
	name: 'mediaWikiTable',
	// see http://www.mediawiki.org/wiki/Help:Tables, http://meta.wikimedia.org/wiki/Help:Table
	match: '^\\{\\|', // ^{|
	tableTerm: '\\n\\|\\}', // |}
	rowStart: '\\n\\|\\-', // \n|-
	cellStart: '\\n!|!!|\\|\\||\\n\\|', //\n! or !! or || or \n|
	caption: '\\n\\|\\+',
	rowTerm: null,
	cellTerm: null,
	inCellTerm: null,
	tt: 0,
	debug: null,
	rowTermRegExp: null,
	handler: function(w)
	{
		if(!this.rowTermRegExp) {
			this.rowTerm = '(' + this.tableTerm +')|(' + this.rowStart + ')';
			this.cellTerm = this.rowTerm + '|(' + this.cellStart + ')';
			this.inCellTerm = '(' + this.match + ')|' + this.rowTerm + '|(' + this.cellStart + ')';
			this.caption = '(' + this.caption + ')|' + this.cellTerm;

			this.rowTermRegExp = new RegExp(this.rowTerm,'mg');
			this.cellTermRegExp = new RegExp(this.cellTerm,'mg');
			this.inCellTermRegExp = new RegExp(this.inCellTerm,'mg');
			this.captionRegExp = new RegExp(this.caption,'mg');
		}
		this.captionRegExp.lastIndex = w.nextMatch;
		var match = this.captionRegExp.exec(w.source);
		if(!match) {return;}
		var output = w.output;
		var table = createTiddlyElement2(output,'table');
		var rowContainer = table;

		var i = w.source.indexOf('\n',w.nextMatch);
		if(i>w.nextMatch) {
			MediaWikiFormatter.setAttributesFromParams(table,w.source.substring(w.nextMatch,i));
			w.nextMatch = i;
		}

		var rowCount = 0;
		var eot = false;
		if(match[1]) {
			var caption = createTiddlyElement2(table,'caption');
			w.nextMatch = this.captionRegExp.lastIndex;
			var captionText = w.source.substring(w.nextMatch);
			var n = captionText.indexOf('\n');
			captionText = captionText.substr(0,n);
			i = MediaWikiFormatter.endOfParams(w,captionText);
			if(i!=-1) {
				captionText = w.source.substr(w.nextMatch,i);
				w.nextMatch += i+1;
			}
			if(caption != table.firstChild) {
				table.insertBefore(caption,table.firstChild);
			}
			w.subWikify(caption,this.cellTerm);
			w.nextMatch -= w.matchLength;
			this.cellTermRegExp.lastIndex = w.nextMatch;
			var match2 = this.cellTermRegExp.exec(w.source);
			if(match2) {
				if(match2[3]) {
					eot = this.rowHandler(w,createTiddlyElement2(rowContainer,'tr'));
					rowCount++;
				}
			}
		} else if(match[3]) {
			w.nextMatch = this.captionRegExp.lastIndex-match[3].length;
		} else if(match[4]) {
			w.nextMatch = this.captionRegExp.lastIndex-match[4].length;
			eot = this.rowHandler(w,createTiddlyElement2(rowContainer,'tr'));
			rowCount++;
		}

		this.rowTermRegExp.lastIndex = w.nextMatch;
		match = this.rowTermRegExp.exec(w.source);
		while(match && eot==false) {
			if(match[1]) {
				w.nextMatch = this.rowTermRegExp.lastIndex;
				if(w.tableDepth==0) {
					return;
				}
			} else if(match[2]) {
				var rowElement = createTiddlyElement2(rowContainer,'tr');
				w.nextMatch += match[2].length;
				i = w.source.indexOf('\n',w.nextMatch);
				if(i>w.nextMatch) {
					MediaWikiFormatter.setAttributesFromParams(rowElement,w.source.substring(w.nextMatch,i));
					w.nextMatch = i;
				}
				eot = this.rowHandler(w,rowElement);
			}
			rowCount++;
			this.rowTermRegExp.lastIndex = w.nextMatch;
			match = this.rowTermRegExp.exec(w.source);
		}//# end while
		if(w.tableDepth==0) {
			w.nextMatch +=3;
		}
	},//# end handler

	rowHandler: function(w,e)
	{
		var cell;
		this.inCellTermRegExp.lastIndex = w.nextMatch;
		var match = this.inCellTermRegExp.exec(w.source);
		while(match) {
			if(match[1]) {
				w.tableDepth++;
				w.subWikify(cell,this.tableTerm);
				w.nextMatch = this.tt;
				w.tableDepth--;
				return false;
			} else if(match[2]) {
				this.tt = this.inCellTermRegExp.lastIndex;
				return true;
			} else if(match[3]) {
				return false;
			} else if(match[4]) {
				var len = match[4].length;
				cell = createTiddlyElement2(e,match[4].substr(len-1)=='!'?'th':'td');
				w.nextMatch += len;

				this.inCellTermRegExp.lastIndex = w.nextMatch;
				var lookahead = this.inCellTermRegExp.exec(w.source);
				if(!lookahead) {
					return false;
				}
				var cellText = w.source.substr(w.nextMatch,lookahead.index-w.nextMatch);
				var oldSource = w.source;
				var i = MediaWikiFormatter.endOfParams(w,cellText);//cellText.indexOf('|');
				if(i!=-1) {
					cellText = cellText.replace(/^\+/mg,'');  //!!hack until I fix this properly
					MediaWikiFormatter.setAttributesFromParams(cell,cellText.substr(0,i-1));
					cellText = cellText.substring(i+1);
				}
				cellText = cellText.replace(/^\s*/mg,'');
				w.source = cellText;
				w.nextMatch = 0;
				w.subWikifyUnterm(cell);
				w.source = oldSource;
				w.nextMatch = lookahead.index;
			}
			this.inCellTermRegExp.lastIndex = w.nextMatch;
			match = this.inCellTermRegExp.exec(w.source);
		}//# end while
		return false;
	}//# end rowHandler
},

{
	name: 'mediaWikiList',
	match: '^[\\*#;:]+',
	lookaheadRegExp: /(?:(?:(\*)|(#)|(;)|(:))+)(?: ?)/mg,
	termRegExp: /(\n)/mg,
	handler: function(w)
	{
		var stack = [w.output];
		var currLevel = 0, currType = null;
		var listType, itemType;
		w.nextMatch = w.matchStart;
		this.lookaheadRegExp.lastIndex = w.nextMatch;
		var lookaheadMatch = this.lookaheadRegExp.exec(w.source);
		while(lookaheadMatch && lookaheadMatch.index == w.nextMatch) {
			if(lookaheadMatch[1]) {
				listType = 'ul';
				itemType = 'li';
			} else if(lookaheadMatch[2]) {
				listType = 'ol';
				itemType = 'li';
			} else if(lookaheadMatch[3]) {
				listType = 'dl';
				itemType = 'dt';
			} else if(lookaheadMatch[4]) {
				listType = 'dl';
				itemType = 'dd';
			}
			var listLevel = lookaheadMatch[0].length;
			w.nextMatch += listLevel;
			if(listLevel > currLevel) {
				for(var i=currLevel; i<listLevel; i++) {
					stack.push(createTiddlyElement2(stack[stack.length-1],listType));
				}
			} else if(listLevel < currLevel) {
				for(i=currLevel; i>listLevel; i--) {
					stack.pop();
				}
			} else if(listLevel == currLevel && listType != currType) {
				stack.pop();
				stack.push(createTiddlyElement2(stack[stack.length-1],listType));
			}
			currLevel = listLevel;
			currType = listType;
			var e = createTiddlyElement2(stack[stack.length-1],itemType);
			var ci = w.source.indexOf(':',w.nextMatch);
			var ni = w.source.indexOf('\n',w.nextMatch);
			if(itemType=='dt' && (ni==-1 || (ci!=-1 && ci<ni))) {
				w.subWikifyTerm(e,/(:)/mg);
				w.nextMatch--;
			} else {
				w.subWikifyTerm(e,this.termRegExp);
			}
			this.lookaheadRegExp.lastIndex = w.nextMatch;
			lookaheadMatch = this.lookaheadRegExp.exec(w.source);
		}
	}
},

{
	name: 'mediaWikiRule',
	match: '^----+$\\n?',
	handler: function(w)
	{
		createTiddlyElement2(w.output,'hr');
	}
},

{
	name: 'mediaWikiLeadingSpaces',
	match: '^ ',
	lookaheadRegExp: /^ /mg,
	termRegExp: /(\n)/mg,
	handler: function(w)
	{
		var e = createTiddlyElement2(w.output,'pre');
		while(true) {
			w.subWikifyTerm(e,this.termRegExp);
			createTiddlyElement2(e,'br');
			this.lookaheadRegExp.lastIndex = w.nextMatch;
			var lookaheadMatch = this.lookaheadRegExp.exec(w.source);
			if(lookaheadMatch && lookaheadMatch.index == w.nextMatch) {
				w.nextMatch += lookaheadMatch[0].length;
			} else {
				break;
			}
		}
	}
},


{
	name: 'mediaWikiImage',
	match: '\\[\\[(?:[Ii]mage|Bild):',
	lookaheadRegExp: /\[\[(?:[Ii]mage|Bild):/mg,
	defaultPx: 180,
	handler: function(w)
	{
		this.lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = this.lookaheadRegExp.exec(w.source);
		if(lookaheadMatch && lookaheadMatch.index == w.matchStart) {
			var params = MediaWikiFormatter.getParams(w);
			var src = params[1];
			src = src.trim().replace(/ /mg,'_');
			src = src.substr(0,1).toUpperCase() + src.substring(1);
			var palign = null;
			var ptitle = null;
			var psrc = false;
			var px = null;
			var pthumb = false;
			var pframed = false;
			for(var i=2;i<params.length;i++) {
				var p = params[i];
				if(p=='right'||p=='left'||p=='center'||p=='none') {
					palign = p;
				} else if(p=='thumbnail'||p=='thumb') {
					pthumb = true;
				} else if(p=='framed') {
					pframed = true;
				} else if(/\d{1,4} ?px/.exec(p)) {
					px = p.substr(0,p.length-2).trim();
				} else {
					ptitle = p;
				}
			}//#end for
			if(pthumb) {
				var output = w.output;
				if(!palign) {
					palign = 'right';
				}
				if(!px) {
					px = 180;
				}
				psrc = px + 'px-' + src;
				var t = createTiddlyElement(output,'div',null,'thumb'+(palign?' t'+palign:''));
				var s = createTiddlyElement2(t,'div');
				s.style['width'] = Number(px) + 2 + 'px';
				var a = createTiddlyElement(s,'a',null,'internal');
				if(config.options.chkMediaWikiDisplayEnableThumbZoom) {
					a.href = src;
				}
				a.title = ptitle;
				var img = createTiddlyElement2(a,'img');
				img.src = 'images/' + psrc;
				img.width = px;
				img.longdesc = 'Image:' + src;
				img.alt = ptitle;

				var tc = createTiddlyElement(s,'div',null,'thumbcaption');
				var oldSource = w.source; var oldMatch = w.nextMatch;
				w.source = ptitle; w.nextMatch = 0;
				w.subWikifyUnterm(tc);
				w.source = oldSource; w.nextMatch = oldMatch;

				if(config.options.chkMediaWikiDisplayEnableThumbZoom) {
					var tm = createTiddlyElement(tc,'div',null,'magnify');
					tm.style['float'] = 'right';
					var ta = createTiddlyElement(tm,'a',null,'internal');
					ta.title = 'Enlarge';
					timg = createTiddlyElement2(ta,'img'); timg.src = 'magnify-clip.png'; timg.alt = 'Enlarge'; timg.width = '15'; timg.height = '11';
					ta.href = src;
				}
			} else {
				a = createTiddlyElement(w.output,'a',null,'image');
				a.title = ptitle;
				img = createTiddlyElement2(a,'img');
				if(palign) {img.align = palign;}
				img.src = px ? 'images/' + px + 'px-' + src : 'images/' + src;
				if(px) {img.width = px;}
				img.longdesc = 'Image:' + src;
				img.alt = ptitle;
			}
		}
	}//#end image handler
},

{
	name: 'mediaWikiExplicitLink',
	match: '\\[\\[',
	lookaheadRegExp: /\[\[(?:([a-z]{2,3}:)?)(#?)([^\|\]]*?)(?:(\]\](\w*))|(\|(.*?)\]\]))/mg,
	handler: function(w)
	{
		this.lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = this.lookaheadRegExp.exec(w.source);
		if(lookaheadMatch && lookaheadMatch.index == w.matchStart) {
			if(!lookaheadMatch[1]) {
				var e;
				var link = lookaheadMatch[3];
				var text = link;
				link = link.substr(0,1).toUpperCase() + link.substring(1);
				if(lookaheadMatch[4]) {
					if(lookaheadMatch[2]) {
						var a = createTiddlyElement(w.output,'a');
						var t = w.tiddler ? MediaWikiFormatter.normalizedTitle(w.tiddler.title) + ':' : '';
						t = '#' + t + MediaWikiFormatter.normalizedTitle(link);
						a.setAttribute('href',t);
						a.title = '#' + MediaWikiFormatter.normalizedTitle(link);
						createTiddlyText(a,'#'+link);
					} else {
						e = createTiddlyLink(w.output,link,false,null,w.isStatic,w.tiddler);
						if(lookaheadMatch[5]) {
							text += lookaheadMatch[5];
						}
						createTiddlyText(e,text);
					}
				} else if(lookaheadMatch[6]) {
					if(link.charAt(0)==':')
						link = link.substring(1);
						e = createTiddlyLink(w.output,link,false,null,w.isStatic,w.tiddler);
					var oldSource = w.source; var oldMatch = w.nextMatch;
					w.source = lookaheadMatch[7].trim(); w.nextMatch = 0;
					w.subWikifyUnterm(e);
					w.source = oldSource; w.nextMatch = oldMatch;
				}
			}
			w.nextMatch = this.lookaheadRegExp.lastIndex;
		}
	}
},

{
	name: 'mediaWikiTemplate',
	match: '\\{\\{[^\\{]',
	lookaheadRegExp: /\{\{((?:.|\n)*?)\}\}/mg,
	handler: function(w)
	{
		this.lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = this.lookaheadRegExp.exec(w.source);
		if(lookaheadMatch && lookaheadMatch.index == w.matchStart) {
			var lastIndex = this.lookaheadRegExp.lastIndex;
			var contents = lookaheadMatch[1];
			if(MediaWikiFormatter.expandVariable(w,contents)) {
				w.nextMatch = lastIndex;
				return;
			}
			var i = contents.indexOf('|');
			var title = i==-1 ? contents : contents.substr(0,i);
			title = title.trim().replace(/_/mg,' ');
			if(title.substr(0,1)=='#') {
				var parserFn = true;
				var j = contents.indexOf(':');
				var expr = contents.substring(j+1,i);
				i = title.indexOf(':');
				title = title.substr(0,i);
			} else {
				title = 'Template:' + title.substr(0,1).toUpperCase() + title.substring(1);
				var tiddler = store.fetchTiddler(title);
			}
			var oldSource = w.source;
			if(tiddler) {
				var params = {};
				if(i!=-1) {
					params = MediaWikiFormatter.getTemplateParams(lookaheadMatch[1]);
				}
				w.source = MediaWikiFormatter.expandTemplate(w,tiddler.text,params);
				w.nextMatch = 0;
				w.subWikifyUnterm(w.output);
			} else if(parserFn) {
				if(i!=-1) {
					params = MediaWikiFormatter.getParserFunctionParams(lookaheadMatch[1]);
				}
				w.source = MediaWikiFormatter.expandParserFunction(w,title,expr,params);
				w.nextMatch = 0;
				w.subWikifyUnterm(w.output);			
			} else {
				if(config.options.chkMediaWikiDisplayEmptyTemplateLinks) {
					w.source = '[['+title+']]';
					w.nextMatch = 0;
					w.subWikifyUnterm(w.output);
				}
			}
			w.source = oldSource;
			w.nextMatch = lastIndex;
		}
	}
},

{
	name: 'mediaWikiParagraph',
	match: '\\n{2,}',
	handler: function(w)
	{
		w.output = createTiddlyElement2(w.output,'p');
	}
},

{
	name: 'mediaWikiExplicitLineBreak',
	match: '<br ?/?>',
	handler: function(w)
	{
		createTiddlyElement2(w.output,'br');
	}
},

{
	name: 'mediaWikiExplicitLineBreakWithParams',
	match: "<br(?:\\s*(?:(?:.*?)=[\"']?(?:.*?)[\"']?))*?\\s*/?>",
	lookaheadRegExp: /<br((?:\s+(?:.*?)=["']?(?:.*?)["']?)*?)?\s*\/?>/mg,
	handler: function(w)
	{
		this.lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = this.lookaheadRegExp.exec(w.source);
		if(lookaheadMatch && lookaheadMatch.index == w.matchStart) {
			var e =createTiddlyElement2(w.output,'br');
			if(lookaheadMatch[1]) {
				MediaWikiFormatter.setAttributesFromParams(e,lookaheadMatch[1]);
			}
			w.nextMatch = this.lookaheadRegExp.lastIndex;// empty tag
		}
	}
},

{
	name: 'mediaWikiTitledUrlLink',
	match: '\\[' + config.textPrimitives.urlPattern + '(?:\\s+[^\\]]+)?' + '\\]',
	handler: function(w)
	{
		var lookaheadRegExp = new RegExp('\\[(' + config.textPrimitives.urlPattern + ')(?:\\s+([^\[]+))?' + '\\]','mg');
		lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = lookaheadRegExp.exec(w.source);
		if(lookaheadMatch && lookaheadMatch.index==w.matchStart) {
			var link = lookaheadMatch[1];
			if(lookaheadMatch[2]) {
				var e = createExternalLink(w.output,link);
				var oldSource = w.source; var oldMatch = w.nextMatch;
				w.source = lookaheadMatch[2].trim(); w.nextMatch = 0;
				w.subWikifyUnterm(e);
				w.source = oldSource; w.nextMatch = oldMatch;
			} else {
				e = createExternalLink(createTiddlyElement2(w.output,'sup'),link);
				w.linkCount++;
				createTiddlyText(e,'['+w.linkCount+']');
			}
			w.nextMatch = lookaheadRegExp.lastIndex;
		}
	}
},

{
	name: 'mediaWikiUrlLink',
	match: config.textPrimitives.urlPattern,
	handler: function(w)
	{
		w.outputText(createExternalLink(w.output,w.matchText),w.matchStart,w.nextMatch);
	}
},

{
	name: "mediaWikiCharacterFormat",
	match: "'{2,5}|(?:<[usbi]>)",
	handler: function(w)
	{
		switch(w.matchText) {
		case "'''''":
			var e = createTiddlyElement(w.output,'strong');
			w.subWikifyTerm(createTiddlyElement(e,'em'),/('''''|(?=\n))/mg);
			break;
		case "'''":
			w.subWikifyTerm(createTiddlyElement(w.output,'strong'),/('''|(?=\n))/mg);
			break;
		case "''":
			w.subWikifyTerm(createTiddlyElement(w.output,'em'),/((?:''(?!'))|(?=\n))/mg);
			break;
		case '<u>':
			w.subWikifyTerm(createTiddlyElement(w.output,'u'),/(<\/u>|(?=\n))/mg);
			break;
		case '<s>':
			w.subWikifyTerm(createTiddlyElement(w.output,'del'),/(<\/s>|(?=\n))/mg);
			break;
		case '<b>':
			w.subWikifyTerm(createTiddlyElement(w.output,'b'),/(<\/b>|(?=\n))/mg);
			break;
		case '<i>':
			w.subWikifyTerm(createTiddlyElement(w.output,'i'),/(<\/i>|(?=\n))/mg);
			break;
		}
	}
},

{
	name: 'mediaWikiTemplateParam',
	match: '\\{\\{\\{',
	lookaheadRegExp: /(\{\{\{(?:.|\n)*?\}\}\})/mg,
	element: 'span',
	handler: config.formatterHelpers.enclosedTextHelper
},

{
	name: 'mediaWikiInsertReference',
	match: '<ref[^/]*>',
	lookaheadRegExp: /<ref(\s+(?:.*?)=["']?(?:.*?)["']?)?>([^<]*?)<\/ref>/mg,
	handler: function(w)
	{
		if(config.browser.isIE) {
			refRegExp = /<ref[^\/]*>((?:.|\n)*?)<\/ref>/mg;
			refRegExp.lastIndex = w.matchStart;
			var refMatch = refRegExp.exec(w.source);
			if(refMatch && refMatch.index == w.matchStart) {
				w.nextMatch = refRegExp.lastIndex;
				return;
			}
		}
		this.lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = this.lookaheadRegExp.exec(w.source);
		if(lookaheadMatch && lookaheadMatch.index == w.matchStart) {
			var x = {id:'',value:''};
			w.nextMatch = this.lookaheadRegExp.lastIndex;
			if(!w.referenceCount) {
				w.referenceCount = 0;
				w.references = {};
			}
			var s = createTiddlyElement(w.output,'sup',null,'reference');
			var a = createTiddlyElement2(s,'a');
			var prefix = w.tiddler ? w.tiddler.title + ':' : '';
			var name;
			if(lookaheadMatch[1]) {
				var r = MediaWikiFormatter.setFromParams(w,lookaheadMatch[1]);
				name = r.name ? r.name.trim() : '';
				name = name.replace(/ /g,'_');
				s.id = prefix + '_ref-' + name;// + '_' + nameCount;(w.referenceCount+1);
				if(!w.references[name]) {
					w.references[name] = x;
					w.references[name].id = w.referenceCount;
					w.references[name].value = lookaheadMatch[2].trim();
				}
			} else {
				w.references[w.referenceCount] = x;
				w.references[w.referenceCount].id = w.referenceCount;
				w.references[w.referenceCount].value = lookaheadMatch[2].trim();
				name = w.referenceCount;
				s.id = prefix + '_ref-' + w.referenceCount;
			}
			w.referenceCount++;
			a.title = lookaheadMatch[2].trim();//mb, extra to wikipedia
			a.href = '#' + prefix + '_note-' + name;
			a.innerHTML = '['+w.referenceCount+']';
		}
	}
},

{
	name: 'mediaWikiListReferences',
	match: '<references ?/>',
	lookaheadRegExp: /<references ?\/>/mg,
	handler: function(w)
	{
		this.lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = this.lookaheadRegExp.exec(w.source);
		if(config.options.chkMediaWikiListReferences && w.referenceCount) {
			var ol = createTiddlyElement(w.output,'ol',null,'references');
			var oldSource = w.source;
			if(w.referenceCount>0) {
				for(var i in w.references) {
					var li = createTiddlyElement2(ol,'li');
					var prefix = w.tiddler ? w.tiddler.title + ':' : '';
					var b = createTiddlyElement2(li,'b');
					var a = createTiddlyElement2(b,'a');
					li.id = prefix + '_note-' + i;
					a.href = '#' + prefix + '_ref-' + i;
					a.innerHTML = '^';
					w.source = w.references[i].value;
					w.nextMatch = 0;
					w.subWikifyUnterm(li);
				}
			}
			w.source = oldSource;
		}
		w.nextMatch = this.lookaheadRegExp.lastIndex;
	}
},

{
	name: 'mediaWikiRepeatReference',
	match: '<ref[^/]*/>',
	lookaheadRegExp: /<ref(\s+(?:.*?)=["'](?:.*?)["'])?\s*\/>/mg,
	handler: function(w)
	{
		if(config.browser.isIE) {
			refRegExp = /<ref.*?\/>/mg;
			refRegExp.lastIndex = w.matchStart;
			var refMatch = refRegExp.exec(w.source);
			if(refMatch && refMatch.index == w.matchStart) {
				w.nextMatch = refRegExp.lastIndex;
				return;
			}
		}
		this.lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = this.lookaheadRegExp.exec(w.source);
		if(lookaheadMatch && lookaheadMatch.index == w.matchStart) {
			var x = {id:'',value:''};
			w.nextMatch = this.lookaheadRegExp.lastIndex;
			var s = createTiddlyElement(w.output,"sup",null,"reference");
			var a = createTiddlyElement2(s,"a");
			var prefix = w.tiddler ? w.tiddler.title : '';
			if(lookaheadMatch[1]) {
				var r = {};
				r = MediaWikiFormatter.setFromParams(w,lookaheadMatch[1]);
				var name = r.name ? r.name.trim() : '';
				name = name.replace(/ /g,'_');
				s.id = prefix + '_ref-' + name +'_' + (w.referenceCount+1);
				var count = w.references && w.references[name] ? (w.references[name].id+1) : '?';
			}
			a.href = '#' + prefix + '_note-' + name;
			a.innerHTML = '['+count+']';
			a.title = name;
		}
	}//# end handler
},

{
	name: 'mediaWikiHtmlEntitiesEncoding',
	match: '&#?[a-zA-Z0-9]{2,8};',
	handler: function(w)
	{
		if(!config.browser.isIE)
			createTiddlyElement(w.output,"span").innerHTML = w.matchText;
	}
},

{
	name: 'mediaWikiComment',
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
	name: 'mediaWikiIncludeOnly',
	match: '<includeonly>',
	lookaheadRegExp: /<includeonly>((?:.|\n)*?)<\/includeonly>/mg,
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
	name: 'mediaWikiNoWiki',
	match: '<nowiki>',
	lookaheadRegExp: /<nowiki>((?:.|\n)*?)<\/nowiki>/mg,
	element: 'span',
	handler: config.formatterHelpers.enclosedTextHelper
},

{
	name: 'mediaWikiPreNoWiki',
	match: '<pre>\s*<nowiki>',
	lookaheadRegExp: /<pre>\s*<nowiki>((?:.|\n)*?)<\/nowiki>\s*<\/pre>/mg,
	element: 'pre',
	handler: config.formatterHelpers.enclosedTextHelper
},

{
	name: 'mediaWikiPre',
	match: '<pre>',
	lookaheadRegExp: /<pre>((?:.|\n)*?)<\/pre>/mg,
	element: 'pre',
	handler: config.formatterHelpers.enclosedTextHelper
},

{
	name: 'mediaWikiMagicWords',
	match: '__',
	lookaheadRegExp: /__([A-Z]*?)__/mg,
	handler: function(w)
	{
		this.lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = this.lookaheadRegExp.exec(w.source);
		if(lookaheadMatch && lookaheadMatch.index == w.matchStart) {
			if(lookaheadMatch[1]=='NOTOC') {
			} else if(config.options.chkDisplayMediaWikiMagicWords) {
				w.outputText(w.output,w.matchStart,w.nextMatch);
			}
			w.nextMatch = this.lookaheadRegExp.lastIndex;
		}
	}
},

{
	name: 'mediaWikiGallery',
	match: '<gallery>',
	lookaheadRegExp: /[Ii]mage:(.*?)\n/mg,
	handler: function(w)
	{
		var table = createTiddlyElement(w.output,'table',null,'gallery');
		table.cellspacing = '0';
		table.cellpadding = '0';
		var rowElem = createTiddlyElement2(table,'tr');
		var col = 0;
		this.lookaheadRegExp.lastIndex = w.matchStart;
		var nM = w.nextMatch;
		var lookaheadMatch = this.lookaheadRegExp.exec(w.source);
		var oldSource = w.source;
		while(lookaheadMatch) {
			nM += lookaheadMatch[1].length;
			w.source = lookaheadMatch[1] +']]';//!! ]] is hack until getParams is working
			w.nextMatch = 0;
			var params = MediaWikiFormatter.getParams(w);
			var src = params[1];
			src = src.trim().replace(/ /mg,'_');
			src = src.substr(0,1).toUpperCase() + src.substring(1);
			var palign = 'right'; 
			var psrc = '120px-'+src;
			var px = 120;
			var pframed = false;
			ptitle = null;
			for(var i=2;i<params.length;i++) {
				var p = params[i];
				if(p=='right'||p=='left'||p=='center'||p=='none') {
					palign = p;
				} else if(p=='framed') {
					pframed = true;
				} else if(/\d{1,4}px/.exec(p)) {
					px = p.substr(0,p.length-2).trim();
					psrc = px + 'px-' + src;
				} else {
					ptitle = p;
				}
			}//#end for
			var td = createTiddlyElement2(rowElem,'td');
			var gb = createTiddlyElement(td,'div',null,'gallerybox');
			var t = createTiddlyElement(gb,'div',null,'thumb');
			t.style['padding'] = '26px 0';

			var a = createTiddlyElement2(t,'a');
			if(config.options.chkMediaWikiDisplayEnableThumbZoom) {
				a.href = src;
			}
			a.title = ptitle;
			var img = createTiddlyElement2(a,'img');
			img.src = psrc;
			img.width = px;
			img.alt = '';

			var gt = createTiddlyElement(gb,'div',null,'gallerytext');
			p = createTiddlyElement2(gt,'p');
			var oldSource2 = w.source; var oldMatch = w.nextMatch;
			w.source = ptitle; w.nextMatch = 0;
			w.subWikifyUnterm(p);
			w.source = oldSource2; w.nextMatch = oldMatch;

			col++;
			if(col>3) {
				rowElem = createTiddlyElement2(table,'tr');
				col = 0;
			}
			w.source = oldSource;
			lookaheadMatch = this.lookaheadRegExp.exec(w.source);
		}
		w.nextMatch = nM + '<gallery>'.length*2+1+'Image:'.length;//!! hack
	}
},

{
	name: 'mediaWikiHtmlTag',
	match: "<[a-zA-Z]{2,}(?:\\s*(?:(?:.*?)=[\"']?(?:.*?)[\"']?))*?>",
	lookaheadRegExp: /<([a-zA-Z]{2,})((?:\s+(?:.*?)=["']?(?:.*?)["']?)*?)?\s*(\/)?>/mg,
	handler: function(w)
	{
		this.lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = this.lookaheadRegExp.exec(w.source);
		if(lookaheadMatch && lookaheadMatch.index == w.matchStart) {
			var e =createTiddlyElement2(w.output,lookaheadMatch[1]);
			if(lookaheadMatch[2]) {
				MediaWikiFormatter.setAttributesFromParams(e,lookaheadMatch[2]);
			}
			if(lookaheadMatch[3]) {
				w.nextMatch = this.lookaheadRegExp.lastIndex;
			} else {
				w.subWikify(e,'</'+lookaheadMatch[1]+'>');
			}
		}
	}
}
];

config.parsers.mediawikiFormatter = new Formatter(config.mediawiki.formatters);
config.parsers.mediawikiFormatter.format = 'mediawiki';
config.parsers.mediawikiFormatter.formatTag = 'MediaWikiFormat';
} //# end of 'install only once'
//}}}