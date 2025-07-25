/%
!info
|Name|ShowAge|
|Source|http://www.TiddlyTools.com/#ShowAge|
|Version|1.0.0|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|Type|transclusion|
|Description|show elapsed years/months/days between two dates|
Usage
<<<
{{{
<<tiddler ShowAge with: startdate enddate>>
}}}
*''startdate''<br>starting date, using any javascript-recognized date format, such as ''YYYY/MM/DD'' ("1962/07/24"), or ''MM/DD/YYY'' ("07/24/1962"), or ''Month DD, YYY'' ("July 24, 1962").  Use keyword ''today'' for the current date.
*''enddate'' (optional, default=''"today"'')<br>ending date, using javascript-recognized date format
Note: the elapsed date calculation uses an //averaged// 30.4 days/month.  For dates greater than one month apart, the resulting number of elapsed //days// may be only approximate.
<<<
Examples
<<<
*{{{This tiddler is <<tiddler ShowAge with: "2009/10/23">> old}}}<br>This tiddler is <<tiddler ShowAge##show with: "2009/10/23">> old
*{{{Eric is <<tiddler ShowAge with: "July 24, 1962">> old}}}<br>Eric is <<tiddler ShowAge##show with: "July 24, 1962">> old
*{{{There are <<tiddler ShowAge with: "today" "January 1, 2100">> until the next century}}}<br>There are <<tiddler ShowAge##show with: "today" "January 1, 2100">> until the next century
<<<
!end

!show
<<tiddler ShowAge##out with: {{
	var out=[];
	var start=new Date(); if ('$1'!='$'+'1' && '$1'!='today') start=new Date('$1');
	var end  =new Date(); if ('$2'!='$'+'2' && '$2'!='today') end  =new Date('$2');
	var hs=3600000; var ds=24*hs; var ms=30.4*ds; var ys=365*ds;
	var age=end.getTime()-start.getTime();
	var y=Math.floor(age/ys);
	var m=Math.floor((age-y*ys)/ms);
	var d=Math.floor((age-y*ys-m*ms)/ds)+1;
	if (y) out.push(y+' year' +(y>1?'s':''));
	if (m) out.push(m+' month'+(m>1?'s':''));
	if (d) out.push(d+' day'  +(d>1?'s':''));
	if (!out.length) out.push('0 days');
out.join(', ');}}>>
!out
$1
!end

%/<<tiddler {{var src='ShowAge'; src+(tiddler&&tiddler.title==src?'##info':'##show');}}
	with: [[$1]] [[$2]]>>