/***
This functionality is already in upcoming 2.1 beta, see http://trac.tiddlywiki.org/tiddlywiki/changeset/205
***/

//{{{

Date.prototype.getHours12 = function()
{
	var h = this.getHours();
	return (h > 12 ? h-12 : ( h > 0 ? h : 12 ));
}

Date.prototype.getAmPm = function()
{
	return (this.getHours() >= 12 ? "pm" : "am");
}

// Substitute date components into a string
// should be a hijack but hopefull this or something like it will go into core...
Date.prototype.formatString = function(template)
{
	template = template.replace(/YYYY/g,this.getFullYear());
	template = template.replace(/YY/g,String.zeroPad(this.getFullYear()-2000,2));
	template = template.replace(/MMM/g,config.messages.dates.months[this.getMonth()]);
	template = template.replace(/0MM/g,String.zeroPad(this.getMonth()+1,2));
	template = template.replace(/MM/g,this.getMonth()+1);
	template = template.replace(/DDD/g,config.messages.dates.days[this.getDay()]);
	template = template.replace(/0DD/g,String.zeroPad(this.getDate(),2));
	template = template.replace(/DDth/g,this.getDate()+this.daySuffix());
	template = template.replace(/DD/g,this.getDate());
	template = template.replace(/0hh12/g,String.zeroPad(this.getHours12(),2));   // <--------- new
	template = template.replace(/hh12/g,this.getHours12());                      // <--------- new
	template = template.replace(/0hh/g,String.zeroPad(this.getHours(),2));
	template = template.replace(/hh/g,this.getHours());
	template = template.replace(/0mm/g,String.zeroPad(this.getMinutes(),2));
	template = template.replace(/mm/g,this.getMinutes());
	template = template.replace(/0ss/g,String.zeroPad(this.getSeconds(),2));
	template = template.replace(/ss/g,this.getSeconds());
	template = template.replace(/[ap]m/g,this.getAmPm().toLowerCase());   // <--------- new
	template = template.replace(/[AP]M/g,this.getAmPm().toUpperCase());   // <--------- new
	return template;
}

//}}}

