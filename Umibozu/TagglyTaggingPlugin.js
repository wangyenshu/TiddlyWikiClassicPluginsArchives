/***
| Name:|TagglyTaggingPlugin|
| Description:|tagglyTagging macro is a replacement for the builtin tagging macro in your ViewTemplate|
| Version:|6.1.5|
| Date:|05-Oct-2006|
| Source:|http://mptw.tiddlyspot.com/#TagglyTaggingPlugin|
| Author:|Simon Baird <simon.baird@gmail.com>|
| CoreVersion:|2.1.x|
!Notes
See http://mptw.tiddlyspot.com/#TagglyTagging
***/
//{{{
config.taggly = {

	// for translations
	lingo: {
		labels: {
			asc:      "\u2191", // down arrow
			desc:     "\u2193", // up arrow
			title:    "title",
			modified: "modified",
			created:  "created",
			show:     "+",
			hide:     "-",
			normal:   "normal",
			group:    "group",
			commas:   "commas",
			sitemap:  "sitemap",
			numCols:  "cols\u00b1", // plus minus sign
			label:    "Tagged as '%0':"
		},

		tooltips: {
			title:    "Click to sort by title",
			modified: "Click to sort by modified date",
			created:  "Click to sort by created date",
			show:     "Click to show tagging list",
			hide:     "Click to hide tagging list",
			normal:   "Click to show a normal ungrouped list",
			group:    "Click to show list grouped by tag",
			sitemap:  "Click to show a sitemap style list",
			commas:   "Click to show a comma separated list",
			numCols:  "Click to change number of columns"
		}
	},

	config: {
		showTaggingCounts: true,
		listOpts: {
			// the first one will be the default
			sortBy:     ["title","modified","created"],
			sortOrder:  ["asc","desc"],
			hideState:  ["show","hide"],
			listMode:   ["normal","group","sitemap","commas"],
			numCols:    ["1","2","3","4","5","6"]
		},
		valuePrefix: "taggly."
	},

	getTagglyOpt: function(title,opt) {
		var val = store.getValue(title,this.config.valuePrefix+opt);
		return val ? val : this.config.listOpts[opt][0];
	},

	setTagglyOpt: function(title,opt,value) {
		if (!store.tiddlerExists(title))
			// create it silently
			store.saveTiddler(title,title,config.views.editor.defaultText.format([title]),config.options.txtUserName,new Date(),null);
		// if value is default then remove it to save space
		return store.setValue(title,
			this.config.valuePrefix+opt,
			value == this.config.listOpts[opt][0] ? null : value);
	},

	getNextValue: function(title,opt) {
		var current = this.getTagglyOpt(title,opt);
		var pos = this.config.listOpts[opt].indexOf(current);
		// a little usability enhancement. actually it doesn't work right for grouped or sitemap
		var limit = (opt == "numCols" ? store.getTaggedTiddlers(title).length : this.config.listOpts[opt].length);
		var newPos = (pos + 1) % limit;
		return this.config.listOpts[opt][newPos];
	},

	toggleTagglyOpt: function(title,opt) {
		var newVal = this.getNextValue(title,opt);
		this.setTagglyOpt(title,opt,newVal);
	}, 

	createListControl: function(place,title,type) {
		var lingo = config.taggly.lingo;
		var label;
		var tooltip;
		var onclick;

		if ((type == "title" || type == "modified" || type == "created")) {
			// "special" controls. a little tricky. derived from sortOrder and sortBy
			label = lingo.labels[type];
			tooltip = lingo.tooltips[type];

			if (this.getTagglyOpt(title,"sortBy") == type) {
				label += lingo.labels[this.getTagglyOpt(title,"sortOrder")];
				onclick = function() {
					config.taggly.toggleTagglyOpt(title,"sortOrder");
					return false;
				}
			}
			else {
				onclick = function() {
					config.taggly.setTagglyOpt(title,"sortBy",type);
					config.taggly.setTagglyOpt(title,"sortOrder",config.taggly.config.listOpts.sortOrder[0]);
					return false;
				}
			}
		}
		else {
			// "regular" controls, nice and simple
			label = lingo.labels[type == "numCols" ? type : this.getNextValue(title,type)];
			tooltip = lingo.tooltips[type == "numCols" ? type : this.getNextValue(title,type)];
			onclick = function() {
				config.taggly.toggleTagglyOpt(title,type);
				return false;
			}
		}

		// hide button because commas don't have columns
		if (!(this.getTagglyOpt(title,"listMode") == "commas" && type == "numCols"))
			createTiddlyButton(place,label,tooltip,onclick,type == "hideState" ? "hidebutton" : "button");
	},

	makeColumns: function(orig,numCols) {
		var listSize = orig.length;
		var colSize = listSize/numCols;
		var remainder = listSize % numCols;

		var upperColsize = colSize;
		var lowerColsize = colSize;

		if (colSize != Math.floor(colSize)) {
			// it's not an exact fit so..
			upperColsize = Math.floor(colSize) + 1;
			lowerColsize = Math.floor(colSize);
		}

		var output = [];
		var c = 0;
		for (var j=0;j<numCols;j++) {
			var singleCol = [];
			var thisSize = j < remainder ? upperColsize : lowerColsize;
			for (var i=0;i<thisSize;i++) 
				singleCol.push(orig[c++]);
			output.push(singleCol);
		}

		return output;
	},

	drawTable: function(place,columns,theClass) {
		var newTable = createTiddlyElement(place,"table",null,theClass);
		var newTbody = createTiddlyElement(newTable,"tbody");
		var newTr = createTiddlyElement(newTbody,"tr");
		for (var j=0;j<columns.length;j++) {
			var colOutput = "";
			for (var i=0;i<columns[j].length;i++) 
				colOutput += columns[j][i];
			var newTd = createTiddlyElement(newTr,"td",null,"tagglyTagging"); // todo should not need this class
			wikify(colOutput,newTd);
		}
		return newTable;
	},

	createTagglyList: function(place,title) {
		switch(this.getTagglyOpt(title,"listMode")) {
			case "group":  return this.createTagglyListGrouped(place,title); break;
			case "normal": return this.createTagglyListNormal(place,title,false); break;
			case "commas": return this.createTagglyListNormal(place,title,true); break;
			case "sitemap":return this.createTagglyListSiteMap(place,title); break;
		}
	},

	getTaggingCount: function(title) {
		// thanks to Doug Edmunds
		if (this.config.showTaggingCounts) {
			var tagCount = store.getTaggedTiddlers(title).length;
			if (tagCount > 0)
				return " ("+tagCount+")";
		}
		return "";
	},

	// this is for normal and commas mode
	createTagglyListNormal: function(place,title,useCommas) {

		var list = store.getTaggedTiddlers(title,this.getTagglyOpt(title,"sortBy"));

		if (this.getTagglyOpt(title,"sortOrder") == "desc")
			list = list.reverse();

		var output = [];
		for (var i=0;i<list.length;i++) {
			var countString = this.getTaggingCount(list[i].title);
			if (useCommas)
				output.push((i > 0 ? ", " : "") + "[[" + list[i].title + "]]" + countString);
			else
				output.push("*[[" + list[i].title + "]]" + countString + "\n");
		}

		return this.drawTable(place,
			this.makeColumns(output,useCommas ? 1 : parseInt(this.getTagglyOpt(title,"numCols"))),
			useCommas ? "commas" : "normal");
	},

	// this is for the "grouped" mode
	createTagglyListGrouped: function(place,title) {
		var sortBy = this.getTagglyOpt(title,"sortBy");
		var sortOrder = this.getTagglyOpt(title,"sortOrder");

		var list = store.getTaggedTiddlers(title,sortBy);

		if (sortOrder == "desc")
			list = list.reverse();

		var leftOvers = []
		for (var i=0;i<list.length;i++)
			leftOvers.push(list[i].title);

		var allTagsHolder = {};
		for (var i=0;i<list.length;i++) {
			for (var j=0;j<list[i].tags.length;j++) {

				if (list[i].tags[j] != title) { // not this tiddler

					if (!allTagsHolder[list[i].tags[j]])
						allTagsHolder[list[i].tags[j]] = "";

					allTagsHolder[list[i].tags[j]] += "**[["+list[i].title+"]]"
									+ this.getTaggingCount(list[i].title) + "\n";
					leftOvers.setItem(list[i].title,-1); // remove from leftovers. at the end it will contain the leftovers
				}
			}
		}

		var allTags = [];
		for (var t in allTagsHolder)
			allTags.push(t);

		var sortHelper = function(a,b) {
			if (a == b) return 0;
			if (a < b) return -1;
			return 1;
		};

		allTags.sort(function(a,b) {
			var tidA = store.getTiddler(a);
			var tidB = store.getTiddler(b);
			if (sortBy == "title") return sortHelper(a,b);
			else if (!tidA && !tidB) return 0;
			else if (!tidA) return -1;
			else if (!tidB) return +1;
			else return sortHelper(tidA[sortBy],tidB[sortBy]);
		});

		var leftOverOutput = "";
		for (var i=0;i<leftOvers.length;i++)
			leftOverOutput += "*[["+leftOvers[i]+"]]" + this.getTaggingCount(leftOvers[i]) + "\n";

		var output = [];

		if (sortOrder == "desc")
			allTags.reverse();
		else if (leftOverOutput != "")
			// leftovers first...
			output.push(leftOverOutput);

		for (var i=0;i<allTags.length;i++)
			output.push("*[["+allTags[i]+"]]" + this.getTaggingCount(leftOvers[i]) + "\n" + allTagsHolder[allTags[i]]);

		if (sortOrder == "desc" && leftOverOutput != "")
			// leftovers last...
			output.push(leftOverOutput);

		return this.drawTable(place,
				this.makeColumns(output,parseInt(this.getTagglyOpt(title,"numCols"))),
				"grouped");

	},

	// used to build site map
	treeTraverse: function(title,depth,sortBy,sortOrder) {

		var list = store.getTaggedTiddlers(title,sortBy);
		if (sortOrder == "desc")
			list.reverse();

		var indent = "";
		for (var j=0;j<depth;j++)
			indent += "*"

		var childOutput = "";
		for (var i=0;i<list.length;i++)
			if (list[i].title != title)
				childOutput += this.treeTraverse(list[i].title,depth+1,sortBy,sortOrder);

		if (depth == 0)
			return childOutput;
		else
			return indent + "[["+title+"]]" + this.getTaggingCount(title) + "\n"+childOutput;
	},

	// this if for the site map mode
	createTagglyListSiteMap: function(place,title) {
		var output = this.treeTraverse(title,0,this.getTagglyOpt(title,"sortBy"),this.getTagglyOpt(title,"sortOrder"));
		return this.drawTable(place,
				this.makeColumns(output.split(/(?=^\*\[)/m),parseInt(this.getTagglyOpt(title,"numCols"))), // regexp magic
				"sitemap"
				);
	},

	macros: {
		tagglyTagging: {
			handler: function (place,macroName,params,wikifier,paramString,tiddler) {
				var refreshContainer = createTiddlyElement(place,"div");
				// do some refresh magic to make it keep the list fresh - thanks Saq
				refreshContainer.setAttribute("refresh","macro");
				refreshContainer.setAttribute("macroName",macroName);
        			refreshContainer.setAttribute("title",tiddler.title);
				this.refresh(refreshContainer);
			},

			refresh: function(place) {
				var title = place.getAttribute("title");
				removeChildren(place);
				if (store.getTaggedTiddlers(title).length > 0) {
					var lingo = config.taggly.lingo;
					config.taggly.createListControl(place,title,"hideState");
					if (config.taggly.getTagglyOpt(title,"hideState") == "show") {
						createTiddlyElement(place,"span",null,"tagglyLabel",lingo.labels.label.format([title]));
						config.taggly.createListControl(place,title,"title");
						config.taggly.createListControl(place,title,"modified");
						config.taggly.createListControl(place,title,"created");
						config.taggly.createListControl(place,title,"listMode");
						config.taggly.createListControl(place,title,"numCols");
						config.taggly.createTagglyList(place,title);
					}
				}
			}
		}
	},

	// todo fix these up a bit
	styles: 
"/*{{{*/\n"+
"/* created by TagglyTaggingPlugin */\n"+
".tagglyTagging { padding-top:0.5em; }\n"+
".tagglyTagging li.listTitle { display:none; }\n"+
".tagglyTagging ul {\n"+
"	margin-top:0px; padding-top:0.5em; padding-left:2em;\n"+
"	margin-bottom:0px; padding-bottom:0px;\n"+
"}\n"+
".tagglyTagging { vertical-align: top; margin:0px; padding:0px; }\n"+
".tagglyTagging table { margin:0px; padding:0px; }\n"+
".tagglyTagging .button { display:none; margin-left:3px; margin-right:3px; }\n"+
".tagglyTagging .button, .tagglyTagging .hidebutton {\n"+
"	color:[[ColorPalette::TertiaryLight]]; font-size:90%;\n"+
"	border:0px; padding-left:0.3em;padding-right:0.3em;\n"+
"}\n"+
".tagglyTagging .button:hover, .hidebutton:hover {\n"+
"	background:[[ColorPalette::TertiaryPale]]; color:[[ColorPalette::TertiaryDark]];\n"+
"}\n"+
".selected .tagglyTagging .button {\n"+
"	display:inline;\n"+
"}\n"+
".tagglyTagging .hidebutton { color:[[ColorPalette::Background]]; }\n"+
".selected .tagglyTagging .hidebutton { color:[[ColorPalette::TertiaryLight]] }\n"+
".tagglyLabel { color:[[ColorPalette::TertiaryMid]]; font-size:90%; }\n"+
".tagglyTagging ul {padding-top:0px; padding-bottom:0.5em; margin-left:1em; }\n"+
".tagglyTagging ul ul {list-style-type:disc; margin-left:-1em;}\n"+
".tagglyTagging ul ul li {margin-left:0.5em; }\n"+
".editLabel { font-size:90%; padding-top:0.5em; }\n"+
".tagglyTagging .commas { padding-left:1.8em; }\n"+
"/*}}}*/\n"+
		"",

	init: function() {
		merge(config.macros,this.macros);
		config.shadowTiddlers["TagglyTaggingStyles"] = this.styles;
		if (store)
			store.addNotification("TagglyTaggingStyles",refreshStyles);
		else
			config.notifyTiddlers.push({name:"TagglyTaggingStyles", notify: refreshStyles});
	}
};

config.taggly.init();

//}}}

