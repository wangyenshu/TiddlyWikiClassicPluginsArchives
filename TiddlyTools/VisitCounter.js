/%
!info
|Name|VisitCounter|
|Source|http://www.TiddlyTools.com/#VisitCounter|
|Version|3.0.1|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|Type|transclusion|
|Description|use cookies to track/show private, personal visit counter and timestamp of last visit|
Usage
<<<
Display a personal, ''//private// counter and timestamps'' for your first visit, your most recent visit, and the total number of times you have visited a document.  This data are stored in local cookies that can only be displayed in //your// browser, and are ''never relayed or reported to anyone other than yourself, nor stored or aggregated on-line in any way, __ever__.''
{{{
<<tiddler VisitCounter with: counterID firsttimegreeting>>
}}}
*''counterID'' (optional)<br>specifies a suffix to add to the visit tracking cookies for this document (enables tracking of multiple documents on a single domain, such as file://).  
*''firsttimegreeting'' (optional)<br>message to display upon first visit to the document.  Subsequent visits report last visit timestamp and total visit count.
The following cookies are used to track your visit information:
*txtFirstVisit+id
*txtLastVisit+id
*txtVisitCount+id
The script also defines global javascript run-time variables that may be referenced later in the current session by other scripts and plugins:
*config.firstVisit
*config.lastVisit
*config.visitCount
<<<
Example
<<<
{{{<<tiddler VisitCounter with: TiddlyTools>>}}}
<<tiddler VisitCounter##show with: TiddlyTools>>
<<<
Revisions
<<<
2009.09.30 [3.0.0] converted to pure TW transclusion (no dependencies)
2008.07.01 [2.1.0] simplified to inline script
2007.07.26 [2.0.0] re-written as plugin
2007.05.02 [1.0.0] initial release (as inline script, VisitCounter)
<<<
!end

!outputFormat
This is your <html><nowiki><a href="javascript:;"
title="Reset personal visit counter"
onclick="if (!confirm('Are you sure you want to reset your personal visit counter?')) return false;
	config.visitCount=1; config.firstVisit=config.lastVisit=new Date();
	config.macros.option.propagateOption('txtVisitCount%0','value',config.visitCount,'input');
	config.macros.option.propagateOption('txtFirstVisit%0','value',config.firstVisit,'input');
	config.macros.option.propagateOption('txtLastVisit%0', 'value',config.lastVisit, 'input');
	story.refreshTiddler((story.findContainingTiddler(this)||this).getAttribute('tiddler'),null,true);
"><b>%1 visit</b></a></html> since %2. Your last visit was on %3.
!end

!out
$1
!end
!show
<<tiddler VisitCounter##out with: {{
	var out='';
	var id='$1'!='$'+'1'?'_$1':'';
	var greeting='$2'!='$'+'2'?'$2':'';

	// create the 'first visit' timestamp (if needed)
	if (config.firstVisit==undefined) { // only once per session
		var opt="txtFirstVisit"+id;
		config.firstVisit=config.options[opt]||new Date();
		config.macros.option.propagateOption(opt,'value',new Date(),'input');
	}

	// update 'last visit' and 'visit count'
	if (config.lastVisit==undefined) { // only once per session
		var opt="txtLastVisit"+id;
		config.lastVisit=config.options[opt]||'';
		config.macros.option.propagateOption(opt,'value',new Date(),'input');
		var opt="txtVisitCount"+id;
		config.visitCount=parseInt(config.options[opt]||0)+1;
		config.macros.option.propagateOption(opt,'value',config.visitCount,'input');
	}

	// get and format # of visits
	var count=config.options["txtVisitCount"+id]||1;
	var wordmap=['---','first','second','third','fourth','fifth','sixth','seventh','eighth','ninth'];
	var suffixmap=['th','st','nd','rd','th','th','th','th','th','th'];
	var digits=count.toString().substr(count.toString().length-2,2);
	if (count<10) count=wordmap[count];
	else if (digits>=10&&digits<=13) count=count+'th';
	else count=count+suffixmap[digits.substr(1,1)];

	var out=greeting; // initial greeting for first visit only
	if (config.lastVisit.length) {
		var first=new Date(config.firstVisit).formatString("MMM DDth YYYY");
		var last=new Date(config.lastVisit).formatString("MMM DDth YYYY at 0hh12:0mm:0ss am");
		out=store.getTiddlerText("VisitCounter##outputFormat").format([id,count,first,last]);
	}
	out;
}}>>
!end
%/<<tiddler {{var src='VisitCounter'; src+(tiddler&&tiddler.title==src?'##info':'##show');}}
	with: [[$1]] "$2">>