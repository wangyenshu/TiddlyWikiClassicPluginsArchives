/%
!info
|Name|PaletteMaker|
|Source|http://www.TiddlyTools.com/#PaletteMaker|
|Version|1.2.2|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|Type|transclusion|
|Description|edit/create ColorPalette using interactive grid/list|
Usage
<<<
{{{
<<tiddler PaletteMaker with: PaletteName GridName noList noGrid allowOther>>
}}}
*''~PaletteName'' (default=ColorPalette)<br>specifies a tiddler containing {{{name:value}}} slices that assign names to color values
*''~GridName'' (default=[[216-color 'web safe' grid|http://en.wikipedia.org/wiki/Web_colors#Web-safe_colors]])<br>specifies a tiddler (or section) that defines a table, where each table cell contains one of:
**a 3-digit #RGB or 6-digit #RRGGBB color value
**an [[X11 Color Name|http://en.wikipedia.org/wiki/X11_color_names]]
**another valid CSS attribute value (see ''allowOther'', below)
*''noList'' //or// ''noGrid''<br>omits the palette listbox or color grid to provide a more compact layout
*''allowOther''<br>permit non-color CSS attribute values to be entered/selected, e.g., {{{url('images/somefile.jpg')}}}
<<<
Notes:
<<<
*{{block{
You can use "-" as placeholders for the default values of ''~PaletteName'' and/or ''~GridName'':
{{{
<<tiddler PaletteMaker with: - - nogrid>>
}}}
}}}
*{{block{
The grid/list are rendered with 'float:left' styles so content that follows will be rendered next to them.  To show your content below the grid/list display, embed an //empty// 'tagClear' CSS wrapper after the PaletteMaker:
{{{
<<tiddler PaletteMaker ...>>{{tagClear{
}}} 
}}}
You can also customize the default styles contained in [[PaletteMakerStyles]]:
<<tiddler PaletteMaker##showcode with: styles>>
}}}
*The default color grid definition is:<br><<tiddler PaletteMaker##showcode with: colorgrid>>
<<<
Examples
<<<
Edit ColorPalette (allow non-color values to be entered):
{{{<<tiddler PaletteMaker with: - - allowOther>>}}}
<<tiddler PaletteMaker##show with: - - allowOther>>{{tagClear{
}}}
Create/edit NewPalette using a 16-color 'rainbow' and/or shades of gray (no list):
{{{<<tiddler PaletteMaker with: NewPalette PaletteMaker##grayscale noList>>}}}
<<tiddler PaletteMaker##show with: NewPalette PaletteMaker##grayscale noList>>
{{{<<tiddler PaletteMaker with: NewPalette PaletteMaker##rainbow noList>>}}}
<<tiddler PaletteMaker##show with: NewPalette PaletteMaker##rainbow noList>>
<<<
!showcode
<<tiddler PaletteMaker##out with: {{store.getTiddlerText('PaletteMaker##$1')}}>>
!out
{{{
$1
}}}
!end

!colorgrid
|white		||   |   |   |   |   |   |FC0|F90|F60|F30|   |   |   |   |   |   ||FFF|
|black		||9C0|   |   |   |   |C90|FC3|FC6|F96|F63|C30|   |   |   |   |C03||EEE|
|red		||CF0|CF3|330|660|990|CC0|FF0|C93|C63|300|600|900|C00|F00|F36|F03||DDD|
|orange		||9F0|CF6|9C3|663|993|CC3|FF3|960|930|633|933|C33|F33|C36|F69|F06||CCC|
|yellow		||6F0|9F6|6C3|690|996|CC6|FF6|963|630|966|C66|F66|903|C39|F6C|F09||BBB|
|green		||3F0|6F3|390|6C0|9F3|CC9|FF9|C96|C60|C99|F99|F39|C06|906|F3C|F0C||AAA|
|blue		||0C0|3C0|360|693|9C6|CF9|FFC|FC9|F93|FCC|F9C|C69|936|603|C09|303||999|
|darkmagenta	||3C3|6C6|0F0|3F3|6F6|9F9|CFC|   |   |   |C9C|969|939|909|636|606||888|
|violet		||060|363|090|393|696|9C9|   |   |   |FCF|F9F|F6F|F3F|F0F|C6C|C3C||777|
|darkred	||030|0C3|063|396|6C9|9FC|CFF|39F|9CF|CCF|C9F|96C|639|306|90C|C0C||666|
|darkorange	||0F3|3F6|093|0C6|3F9|9FF|9CC|06C|69C|99F|99C|93F|60C|609|C3F|C0F||555|
|gold		||0F6|6F9|3C6|096|6FF|6CC|699|036|369|66F|66C|669|309|93C|C6F|90F||444|
|darkgreen	||0F9|6FC|3C9|3FF|3CC|399|366|069|039|33F|33C|339|336|63C|96F|60F||333|
|darkblue	||0FC|3FC|0FF|0CC|099|066|033|39C|36C|00F|00C|009|006|003|63F|30F||222|
|indigo		||0C9|   |   |   |   |09C|3CF|6CF|69F|36F|03C|   |   |   |   |30C||111|
|darkviolet	||   |   |   |   |   |   |0CF|09F|06F|03F|   |   |   |   |   |   ||000|
!grayscale
|FFF|EEE|DDD|CCC|BBB|AAA|999|888|777|666|555|444|333|222|111|000|
!rainbow
|black|white|red|orange|yellow|green|blue|darkmagenta|violet|darkred|darkorange|gold|darkgreen|darkblue|indigo|darkviolet|
!end

!styles
/*{{{*/
.colorgrid table
	{ float:left; margin:0 !important; border:0 !important; }
.colorgrid table, .colorgrid tr, .colorgrid th, .colorgrid tbody
	{ color:black; border:0 !important; }
.colorgrid td
	{ height:16px; width:16px; text-align:center; padding:0; line-height:100%; }
.colorgrid select
	{ float:left; margin-left:16px; font-size:80%; height:255px; }
/*}}}*/
!end

!code
<<tiddler {{
config.shadowTiddlers.PaletteMakerStyles=store.getTiddlerText('PaletteMaker##styles');
setStylesheet(store.getTiddlerText('PaletteMakerStyles'),'paletteMakerStyles');
window.paletteMaker = {
	getColor: function(t){ if (!t||!t.length) return null;
		var s=document.createElement('span').style;
		try { s.color='#'+t; if (s.color.length) return '#'+t; }
		catch(e) { try{ s.color=t; } catch(e){ return null; } return t; } // IE 
		s.color=t; return s.color.length?t:null; // FF
	},
	getTextColor: function(t){ 
		t=this.getColor(t);
		if (!t||!t.length||!t.startsWith('#')) return 'black'; // BAD COLOR or X11 COLOR NAME
		var rgb=t.substr(1).split(''); var long=t.length>=6;
		function h2d(h){return '0123456789ABCDEF'.indexOf(h?h.toUpperCase():'');};
		var r=h2d(rgb[0]); var g=h2d(rgb[long?2:1]); var b=h2d(rgb[long?4:2]);
		if (r<0||g<0||b<0||r+g+b>=15) return 'black'; // BAD RGB or BRIGHT COLOR
		return 'white'; // DARK COLOR
	},
	getPalette: function(palette) {
		var pal={};
		var slices=store.calcAllSlices(palette);
		for (var s in slices) {
			var color=slices[s].toUpperCase().replace(/#/,'');
			if (!pal[color]) pal[color]=new Array();
			pal[color].push(s);
		}
		return pal;
	},
	drawGrid: function(place,grid,palette,opts) {
		var pm=window.paletteMaker; // abbrev
		removeChildren(place);
		if (!opts.contains('NOGRID')) wikify(store.getTiddlerText(grid,''),place);
		if (!opts.contains('NOLIST')) var s=pm.drawList(place,
			{ palette:palette,min:0,max:0,edit:true,callback:pm.callback,place:place,opts:opts });
		var pal=pm.getPalette(palette);
		var cells=place.getElementsByTagName('td');
		for (var i=0; i<cells.length; i++) { var td=cells[i];
			td.style.border=0;
			var txt=getPlainText(td).trim(); if (!txt.length) continue;
			var c=pm.getColor(txt); if (!c && !opts.contains('ALLOWOTHER')) continue;
			if (c) { td.style.backgroundColor=c; td.innerHTML=''; td.style.fontSize='70%'; }
			td.title=c||txt;
			td.style.cursor=c?'crosshair':'pointer';
			td.params={ palette:palette, min:0, max:15, edit:true, callback:pm.callback,
				place:place, grid:grid,	opts:opts, pick:c||txt };
			if (pal[txt.toUpperCase()]) {
				td.params.names=pal[txt.toUpperCase()];
				td.title+='='+td.params.names.join(', ');
				if (c) { td.style.color=pm.getTextColor(c); td.innerHTML='&radic;'; }
			}
			td.onclick=function(ev) { ev=ev||window.event;
				var p=Popup.create(this); if(!p)return false;
				p.className+=' sticky smallform';
				var s=window.paletteMaker.drawList(p,this.params);
				s.style.fontSize='80%'; Popup.show(); s.focus();
				ev.cancelBubble=true; if(ev.stopPropagation)ev.stopPropagation();
				return false;
			};
		}
	},
	drawList: function(here,p) {
		var pm=window.paletteMaker; // abbrev
		var s=createTiddlyElement(here,'select');
		s.params=p;
		s.options[s.length]=new Option(p.palette+':','_view');
		s.options[s.length-1].title='open '+p.palette;
		if (p.edit && p.pick!==undefined) {
			var c=pm.getColor(p.pick);
			s.options[s.length]=new Option('+Add this color...','_add');
			if (c) s.options[s.length-1].style.backgroundColor=c;
			if (c) s.options[s.length-1].style.color=pm.getTextColor(c);
			s.options[s.length-1].title=p.pick;
		}
		var colors=store.calcAllSlices(p.palette);
		for (var x in colors) {
			var c=pm.getColor(colors[x]);
			var prefix=p.names&&p.names.contains(x)?'=':'\xA0\xA0';
			s.options[s.length]=new Option(prefix+x,colors[x]);
			if (c) s.options[s.length-1].style.backgroundColor=c;
			if (c) s.options[s.length-1].style.color=pm.getTextColor(c)
			s.options[s.length-1].title=(!c?'other: "':'')+colors[x]+(!c?'"':'');
		}
		s.size=p.min&&s.length<p.min?p.min:p.max&&s.length>p.max?p.max:s.length;
		s.onclick=function(ev){ ev=ev||window.event;
			var name=this.options[this.selectedIndex].text.replace(/[\xA0=]+/,'').trim();
			if (this.params.callback) this.params.callback(this,name,this.value,this.params);
			return false;
		};
		s.onkeyup=function(ev){ ev=ev||window.event;
			if (ev.keyCode==13) { this.onclick(); Popup.remove(); }
			if (ev.keyCode==27) Popup.remove();
			return false;
		};
		return s;
	},
	callback: function(here,name,val,p){
		var pm=window.paletteMaker; // abbrev
		if (!val.length) return;
		var pick=p.pick!==undefined?p.pick:val;
		if (val=='_view') {
			story.displayTiddler(story.findContainingTiddler(this.place),p.palette);
			Popup.remove();
			return false;
		} else if (val=='_add') {
			var msg='Enter a new name for "'+pick+'"';
			name=prompt(msg,'');
			var slices=store.calcAllSlices(p.palette);
			while (name && slices[name])
				name=prompt('"'+name+'" is already in use\n'+msg,name);
		} else if (p.edit) {
			var allow=p.opts.contains('ALLOWOTHER');
			var msg='Change "'+name+'" from "'+val+'" to:';
			pick=prompt(msg,pick);
			while (pick && !pm.getColor(pick)) {
				var err='"'+pick+'" is not a recognized color\n\xa0';
				if (!allow) err+='Please try again\n\n';
				else err+='Press OK to use this value anyway\n\n';
				var pre=pick; pick=prompt(err+msg,pick);
				if (pre==pick && allow) break;
			}
		} else {
			// TBD: callback without editing
			Popup.remove();	return false;
		}
		here.selectedIndex=0;
		if (!name||!pick) return false;
		pm.set(p.palette,name.replace(/ /g,''),pick);
		pm.drawGrid(p.place,p.grid,p.palette,p.opts);
		Popup.remove();
		return false;
	},
	set: function(palette,name,newval) {
		var tid=store.getTiddler(palette);
		if (!tid) { var tid=new Tiddler(); tid.text=store.getTiddlerText(palette,''); }
		var oldval=store.getTiddlerSlice(palette,name)||'';
		var pattern="((?:^|\\n)(?:[\\'\\/]{0,2})~?(?:"
			+name.escapeRegExp()
			+")\\1\\:[\\t\\x20]*)(?:"
			+oldval.escapeRegExp()
			+")([\\t\\x20]*(?:\\n|$))";
		var t=tid.text; var match=t.match(new RegExp(pattern));
		if (match) {
			var pos=t.indexOf(match[0]);
			var newText=t.substr(0,pos)+
				match[1]+newval+match[2]+
				t.substr(pos+match[0].length);
		} else { // place new slice at top of list or start of tiddler
			var match=t.match(store.slicesRE);
			var pos=t.indexOf(match?match[0]:'');
			var newText=t.substr(0,pos)
				+name+': '+newval+(t.length?'\n':'')
				+t.substr(pos);
		}
		var who=config.options.txtUserName; var when=new Date();
		if (config.options.chkForceMinorUpdate)
			{ var who=tid.modifier; var when=tid.modified; }
		displayMessage('setting "'+palette+'::'+name+'" to "'+newval+'"');
		store.saveTiddler(palette,palette,newText,who,when,tid.tags,tid.fields);
		story.refreshTiddler(palette,null,true);
	}
};
'';}}>>
!end

!show
<<tiddler {{
	var opts=[]
	var palette=('$1'!='$'+'1' && '$1'!='-')?'$1':'ColorPalette';
	var grid   =('$2'!='$'+'2' && '$2'!='-')?'$2':'PaletteMaker##colorgrid';
	opts.push('$3'.toUpperCase());
	opts.push('$4'.toUpperCase());
	opts.push('$5'.toUpperCase());
	if (!place.lastChild||!hasClass(place.lastChild,'colorgrid')) {
		var wrapper=createTiddlyElement(place,'span',null,'colorgrid');
		window.paletteMaker.drawGrid(wrapper,grid,palette,opts);
	}
'';}}>>
!end

%/<<tiddler PaletteMaker##code>>/%
%/<<tiddler {{var src='PaletteMaker'; src+(tiddler&&tiddler.title==src?'##info':'##show');}}
	with: [[$1]] [[$2]] [[$3]] [[$4]] [[$5]]>>