/***
|''Name:''|BibTeXPlugin|
|''Description:''|Very incomplete BibTeX implementation to work with bibliographic references|
|''Author:''|Paulo Soares|
|''Version:''|1.5|
|''Date:''|2010-11-11|
|''Source:''|http://www.math.ist.utl.pt/~psoares/addons.html|
|''Overrides''|Story.prototype.refreshTiddler|
|''Documentation:''|[[BibTeXPlugin Documentation|BibTeXPluginDoc]]|
|''License:''|[[Creative Commons Attribution-Share Alike 3.0 License|http://creativecommons.org/licenses/by-sa/3.0/]]|
|''~CoreVersion:''|2.5.0|
***/
//{{{
if(!version.extensions.BibTeXPlugin) { //# ensure that the plugin is only installed once
version.extensions.BibTeXPlugin = {installed: true};

(function($) {
config.macros.cite = {
  noReference: "(??)",
  refreshTiddler: Story.prototype.refreshTiddler
};

config.macros.cite.handler = function(place,macroName,params,wikifier,paramString,tiddler) {
  var pos, cmb = config.macros.bibliography;
  if(params.length==0) return;
  var entry = params[0];
  var args = paramString.parseParams(null,null,false);
  var title = getParam(args,"bibliography",null);
  if(title) {
    this.biblioTiddler = title;
  } else {title = this.biblioTiddler;}
  title = getParam(args,"thisBibliography",title);
  var format = getParam(args,"format",null);
  if(format) {
    this.format = format;
  } else {format = this.format;}
  format = getParam(args,"thisFormat",format);
  var argsArray = paramString.readMacroParams();
  var showAll = ($.inArray('showAll',argsArray) > -1);
  if(title && store.tiddlerExists(title)) var bib = cmb.extractEntry(title, entry);
  if(bib.content) {
    var entries = this.entries;
    if($.inArray(entry, entries)==-1) this.entries.push(entry);
    entries = this.entries;
    pos = $.inArray(entry, entries)+1;
    var author = cmb.processNames(bib.content.extract("author"), showAll);
    var year = bib.content.extract("year");
    var citation = format.replace("author", author);
    citation = citation.replace("year", year);
    citation = citation.replace("number", pos);
    wikify(citation, place);
  } else {
    wikify(this.noReference, place);
  }
}

Story.prototype.refreshTiddler = function(title,template,force){
  config.macros.cite.biblioTiddler = null;
  config.macros.cite.format = "author (year)";
  config.macros.cite.entries = [];
  var tiddler = config.macros.cite.refreshTiddler.apply(this,arguments);
  return tiddler;
}

config.macros.bibliography = {
   article: {fields: ["author", "year", "title", "journal", "volume", "pages"], format: "author (year). title. //journal// ''volume'', pages."},
   book: {fields: ["author", "year", "title", "publisher"], format: "author (year). //title//. publisher."},
   inproceedings: {fields: ["author", "year", "title", "editor", "booktitle", "pages", "publisher"], format: "author (year). title. In editor //booktitle//, pages. publisher."},
   incollection: {fields: ["author", "year", "title", "editor", "booktitle", "pages", "publisher"], format: "author (year). title. In editor //booktitle//, pages. publisher."},
   techreport: {fields: ["author", "year", "title", "institution"], format: "author (year). title. Technical report, institution."},
   manual: {fields: ["author", "year", "title", "organization"], format: "author (year). //title//. organization."},
   unpublished: {fields: ["author", "year", "title"], format: "author (year). //title//. Unpublished."}
};

config.macros.bibliography.handler = function(place,macroName,params,wikifier,paramString,tiddler) {
        var cmc = config.macros.cite;
	var title = (cmc.biblioTiddler) ? cmc.biblioTiddler : params[0];
	if(!title || !store.tiddlerExists(title)) return;
        var argsArray = paramString.readMacroParams();
	var i, entryText;
	var entries = [];
	if($.inArray('showAll',argsArray) > -1) {
		entryText = this.extractAllEntries(title);
		for(i=0; i<entryText.length; i++) {
			entries[entries.length] = this.processEntry(entryText[i], i);
		}
	} else {
		for(i=0; i<cmc.entries.length; i++){
			entryText = this.extractEntry(title, cmc.entries[i]);
			if(entryText) {
                                entries[entries.length] = this.processEntry(entryText, i);
			}
		}
	}
	entries.sort();
        wikify(entries[0] , place);
	for (i=1; i < entries.length; i++) {
		wikify("\n\n" + entries[i] , place);
	}
	return true;
}

config.macros.bibliography.processNames = function(names, showAll) {
	var i, authors = names.split(" and ");
	var entry = authors[0];
	var numAuthors = authors.length;
	var fullEntry = entry;
	if (numAuthors==2) {
		entry += " and " + authors[1];
		fullEntry = entry;
	}
	if (numAuthors>2) {
		fullEntry = entry;
		for (i=1; i < numAuthors; i++) {
			if (i==numAuthors-1) {fullEntry += " and "} else {fullEntry += ", "};
			fullEntry += authors[i];
		}
		if(showAll) {entry = fullEntry;} else {entry += " et al.";}
	}
	return entry;
}

config.macros.bibliography.processEntry = function(entry, pos) {
  var field, text=entry.content;
  var fields={};
  fields.number = pos+1;
  var type = this[entry.type];
  var output = type.format;
  for(var i=0; i<type.fields.length; i++){
    field = type.fields[i];
    switch(field){
    case "author":
      fields.author = this.processNames(text.extract("author"), true);
      break;
    case "title":
      var url = text.extract("url");
      fields.title = text.extract("title");
      fields.title = (url=='') ? fields.title : "[[" + fields.title + "|" + url + "]]";
      break;
    case "editor":
      var editor = text.extract("editor");
      fields.editor = (editor=='') ? editor : this.processNames(editor,true) + " (Eds.), ";
      break;
    default:
      fields[field] = text.extract(field);
    }
    output = output.replace(field, fields[field]);
  }
  return output;
}

config.macros.bibliography.extractEntry = function(title,entry) {
    var bib = {type: null, content: null};
    var text = store.getTiddlerText(title);
    var re = new RegExp('\\s*@(\\w+?)\\{\\s*' + entry + '\\s*,\\s*(.[^@]+)\\}','mi');
    var field = text.match(re);
    if(field) {
        bib.type = field[1].toLowerCase();
        bib.content = field[2];
    }
    return bib;
}

config.macros.bibliography.extractAllEntries = function(title) {
    var bib, field, entries = [];
    var text = store.getTiddlerText(title);
    var bibs = text.match(/\s*@(\w+?)\{\s*(.[^@]+)\}/mgi);
    for(var i=0; i<bibs.length; i++){
        field=bibs[i].match(/\s*@(\w+?)\{\s*(.[^@]+)\}/mi);
        bib = {type: null, content: null};
        if(field) {
            bib.type = field[1].toLowerCase();
            bib.content = field[2];
            if(bib.type!='string' && bib.type!='preamble' && bib.type!='comment') entries.push(bib);
        }
    }
    return entries;
}

config.macros.bibliography.extractField = function(field) {
    var text = "";
    var re = new RegExp('\\s*'+field+'\\s*=\\s*[\\{|"]\\s*(.+?)\\s*[\\}|"]','mi');
    var fieldText = this.match(re);
    if(fieldText){
        text = fieldText[1].replace(/\{|\}/g,'');
        if(field!='url') text = text.replace(/-+/g,"—");
    }
    return text;
}

String.prototype.extract = config.macros.bibliography.extractField;

config.shadowTiddlers.BibTeXPluginDoc="The documentation is available [[here.|http://www.math.ist.utl.pt/~psoares/addons.html#BibTeXPluginDoc]]";
})(jQuery)
}
//}}}