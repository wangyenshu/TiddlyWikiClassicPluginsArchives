/***
|Name|FoldHeadingsPlugin|
|Source|http://www.TiddlyTools.com/#FoldHeadingsPlugin|
|Version|1.1.2|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.1|
|Type|plugin|
|Description|automatically turn headings into slider-like panels that can be folded/unfolded with a single click|
This plugin defines a macro that automatically converts heading-formatted content into sliders that let you expand/collapse their content by clicking on individual headings.
!!!!!Usage
<<<
{{{
<<foldHeadings opened|closed tag tag tag...>>
}}}
where: ''opened'' or ''closed'' is a keyword indicating the initial state of the sections (default: opened), and ''tag tag tag...'' is an optional list of tags to match, so that the foldable effect is only applied to tiddlers that contain one (or more) of the indicated tags.  

When you place the macro in a tiddler, any heading-formatted content (i.e, "!" through "!!!!!") in that tiddler will automatically become //'fold-able'//, allowing you to expand/collapse the content that follows each heading simply by clicking on that heading.  Each content section begins with the first element following a heading, and continues until either another heading is found or the end of the tiddler is reached.  For example:
{{{
<<foldHeadings closed>>
}}}
is embedded in ''this'' tiddler in order to make all the headings it contains 'fold-able'.  Note that the macro has been placed at the //end// of the tiddler because it only operates on *rendered* content.  Thus, only headings that //precede// it in the same tiddler will become fold-able, as any headings that //follow// it are not actually rendered until //after// the macro has been processed.

You can further limit the effect of the macro within the tiddler by surrounding several headings in a "CSS class wrapper" ("""{{classname{...}}}""") or other containing DOM element (e.g., """@@display:inline;...@@""") and then embedding the {{{<<foldHeadings>>}}} macro inside that container (at the end)... only those headings that are also within that container will be made fold-able, instead of converting ''all'' the headings in that tiddler.

Conversely, if you want the fold-able ability to apply to the headings in //all// tiddlers, ''without having to alter //any// of those individual tiddlers'', you can add the macro to the end of your [[ViewTemplate]], so that it will be invoked after the content in each tiddler has been rendered, causing all headings they contain to automatically become fold-able.  For example:
{{{
<span macro="foldHeadings closed"></span>
}}}
You can also limit this effect to selected tiddlers by specifying one or more tags as additional macro parameters.  For example:
{{{
<span macro="foldHeadings closed systemConfig"></span>
}}}
is only applied to headings contained in //plugin tiddlers// (i.e., tiddlers tagged with <<tag systemConfig>>), while headings in other tiddlers remain unaffected by the macro, even though it is embedded in the common [[ViewTemplate]] definition.
<<<
!!!!!Revisions
<<<
2009.11.30 [1.1.2] corrected CSS 'text-weight' to 'font-weight'
2009.01.06 [1.1.1] removed hijack of scrollToSection() (see [[SectionLinksPlugin]] for equivalent code)
2008.11.17 [1.1.0] added hijack of 'scrollToSection()' function (see [[CoreTweaks]] and http://trac.tiddlywiki.org/ticket/784)
2007.12.06 [1.0.2] fix handling for empty sections when checking for sliderPanel/floatingPanel
2007.12.02 [1.0.1] fix handling when content following a heading is already a sliderPanel/floatingPanel
2007.12.01 [1.0.0] initial release
<<<
!!!!!Code
***/
//{{{
version.extensions.FoldHeadingsPlugin= {major: 1, minor: 1, revision: 2, date: new Date(2009,11,30)};

config.macros.foldHeadings = {
	guideText: "opened|closed className",
	showtip: "click to show '%0'",
	hidetip: "click to hide '%0'",
	showlabel: "more...",
	hidelabel: "[x]",
	html: "<span style='float:right;font-weight:normal;font-size:80%;' class='TiddlyLinkExisting'>%0&nbsp;</span>",
	handler: function(place,macroName,params) {
		var show=params[0] && params.shift().toLowerCase()!="closed";
		if (params.length) { // if filtering by tag(s)
			var here=story.findContainingTiddler(place);
			if (here) var tid=store.getTiddler(here.getAttribute("tiddler"));
			if (!tid || !tid.tags.containsAny(params)) return; // in a tiddler and not tagged... do nothing...
		}
		var elems=place.parentNode.getElementsByTagName("*");
		var heads=[]; for (var i=0; i<elems.length; i++) { // get non-foldable heading elements
			var n=elems[i].nodeName; var foldable=hasClass(elems[i],"foldable");
			if ((n=="H1"||n=="H2"||n=="H3"||n=="H4"||n=="H5")&&!foldable)
				heads.push(elems[i]);
			}
		for (var i=0; i<heads.length; i++) { var h=heads[i]; // for each heading element...
			// find start/end of section content (up to next heading or end of content)
			var start=end=h.nextSibling; while (end && end.nextSibling) {
				var n=end.nextSibling.nodeName.toUpperCase();
				if (n=="H1"||n=="H2"||n=="H3"||n=="H4"||n=="H5") break;
				end=end.nextSibling;
			}
			if (start && hasClass(start,"sliderPanel")||hasClass(start,"floatingPanel")) continue; // heading is already a slider!
			var span=createTiddlyElement(null,"span",null,"sliderPanel"); // create container
			span.style.display=show?"inline":"none"; // set initial display state
			h.parentNode.insertBefore(span,start); // and insert it following the heading element
			// move section elements into container...
			var e=start; while (e) { var next=e.nextSibling; span.insertBefore(e,null); if (e==end) break; e=next; }
			// set heading label/tip/cursor...
			h.title=(show?this.hidetip:this.showtip).format([h.textContent])
			h.innerHTML=this.html.format([show?this.hidelabel:this.showlabel])+h.innerHTML;
			h.style.cursor='pointer';
			addClass(h,"foldable"); // so we know it been done (and to add extra styles)
			h.onclick=function() {
				var panel=this.nextSibling; var show=panel.style.display=="none";
				// update panel display state
				if (config.options.chkAnimate) anim.startAnimating(new Slider(panel,show));
				else panel.style.display = show?"inline":"none";
				// update heading label/tip
				this.removeChild(this.firstChild); // remove existing label
				var fh=config.macros.foldHeadings; // abbreviation for readability...
				this.title=(show?fh.hidetip:fh.showtip).format([this.textContent])
				this.innerHTML=fh.html.format([show?fh.hidelabel:fh.showlabel])+this.innerHTML;
			}
		}		
	}
}

if (story.scrollToSection) {
Story.prototype.foldheadings_scrollToSection=Story.prototype.scrollToSection;
Story.prototype.scrollToSection=function(title,section) {
	var e=this.foldheadings_scrollToSection.apply(this,arguments);
	// if scrolling to a folded section heading, click to expand it
	if (e && hasClass(e,'foldable') && e.nextSibling.style.display=='none') e.onclick();
}
}
//}}}
// //<<foldHeadings closed>>