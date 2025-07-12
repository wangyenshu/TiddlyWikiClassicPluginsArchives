//Timeline plugin
if(!version.extensions.twtimeline){ //Ensure that is only installed once.
version.extensions.twtimeline={
 major: 0, 
 minor: 2, 
 revision: 0, 
 date: new Date("Apr 23, 2007"), 
 code: "http://project.dahukanna.net/tiddlywiki/twextensions.htm#_timeline", 
 doc: "http://project.dahukanna.net/tiddlywiki/twextensions.htm#_timelineDoc", 
 author:"DawnAhukanna dawn[at]dahukanna[dot]net", 
 name:"SimileTimelineCoreAPI",
 summary:"Core Simile Timeline API for TiddlyWiki version 2.2.0 or above.", 
 description: "Simile timeline plugin.", 
 coreVersion: "2.2.0",
 license: "http://creativecommons.org/licenses/by-sa/2.5/",
 installed: true
}

if(version.major < 2 || (version.major == 2 && version.minor < 2)){
 alertAndThrow('twtimeline requires TiddlyWiki 2.2 or newer.');
}

Tiddler.prototype.genTimelineEventData=function(){
 return {
 start:this.created.convertToTimelineDate(),
 end:this.modified.convertToTimelineDate(),
 title:this.title.encodeString(),
 description:("<a href=javascript:story.displayTiddler(null,'"+this.title+"')>open "+this.title+"</a>").encodeString()
 //image
 //link
 };
}

// Convert a date to local "mmm DD YYYY HH:MM:SS GMT" string format
Date.prototype.convertToTimelineDate=function(){
 return config.messages.dates.shortMonths[this.getMonth()] +" "+ String.zeroPad(this.getDate(),2) +" "+String.zeroPad(this.getFullYear(),4)+" "+String.zeroPad(this.getHours(),2)+":"+String.zeroPad(this.getMinutes(),2)+":"+String.zeroPad(this.getSeconds(),2)+" GMT";
}

// encode "'", "<", ">" and """ in a string.
String.prototype.encodeString=function(){
 //return this.replace(/\'/mg,"&apos;").replace(/</mg,"&").replace(/>/mg,">").replace(/\"/mg,""");
 //return this.replace(/\'/mg,"&apos;").replace(/\"/mg,""");
 
 return this.replace(/</mg,"&#38;&#108;&#116;&#59;").replace(/>/mg,"&#38;&#103;&#116;&#59;");
}

Timeline.loadTiddlers = function(tag,duration,fn){
 fn(tag,duration);
};

Timeline.DefaultEventSource.prototype.loadTiddlers = function(tag,duration){
 //Initialisation.
 var eventOrder=TwTimeline.config.order;
 var eventTag=tag||TwTimeline.config.tag;
 var eventDuration = duration||TwTimeline.config.duration;
 
 //Sort this out.
 var url = "dummy";
 var base = this._getBaseURL(url);
 var wikiUrl=null;
 var wikiSection=null;
 
 //straight copy
 var dateTimeFormat = null;
 var parseDateTimeFunction = this._events.getUnit().getParser(dateTimeFormat);
 
 var added = false;
 //Get tiddlers
 if (eventTag==TwTimeline.config.tag){
 tiddlers = store.getTiddlers(eventOrder,"excludeLists");
 }else{
 tiddlers = store.getTaggedTiddlers(eventTag,eventOrder);
 }
 for(var i=0; i<tiddlers.length; i++) {
 var eventData = tiddlers[i].genTimelineEventData();
 var event = new Timeline.DefaultEventSource.Event(
 parseDateTimeFunction(eventData.start),
 parseDateTimeFunction(eventData.end),
 parseDateTimeFunction(eventData.latestStart),
 parseDateTimeFunction(eventData.earliestEnd),
 eventData.isDuration || false,
 eventData.title,
 eventData.description,
 this._resolveRelativeURL(eventData.image,base),
 this._resolveRelativeURL(eventData.link,base),
 this._resolveRelativeURL(eventData.icon,base),
 eventData.color,
 eventData.textColor);
 
 event._obj = eventData;
 event.getProperty = function(name){
 return this._obj[name];
 };
 event.setWikiInfo(wikiURL,wikiSection);

 this._events.add(event);
 added = true; 
 }
 
 if (added) {
 this._fire('onAddMany',[]);
 }
}

//Static Data class
var TwData={
 generateTimelineXML: function (tag,order,duration){ 
 //Generate Timeline XML file.
 var timeline = [];
 var twTag = tag||TwTimeline.config.tag; 
 var twOrder = order||TwTimeline.config.order;
 var twDuration = duration||TwTimeline.config.duration;
 
 timeline.push("<data>");
 if (twTag === TwTimeline.config.tag) {
 tiddlers = store.getTiddlers(twOrder,"excludeLists");
 }else{
 tiddlers = store.getTaggedTiddlers(twTag,twOrder);
 }
 for (var i=0; i<tiddlers.length; i++) {
 //var eventData=tiddlers[i].genTimelineEventData();
 var currentTiddlerTitle = tiddlers[i].title.encodeString();
 timeline.push("<event ");
 if (duration) { 
 timeline.push("start='"+ tiddlers[i].created.convertToTimelineDate()+"'"); 
 timeline.push("end='"+ tiddlers[i].modified.convertToTimelineDate()+"'");
 timeline.push("isDuration='true'");
 }else{
 timeline.push("start='"+ tiddlers[i].modified.convertToTimelineDate()+"'"); 
 }
 timeline.push("title='"+currentTiddlerTitle+"'>");
 //timeline.push("link='"+tiddlers[i].title.encodeString()+"'>");
 //Add image
 //add URL
 //var twText = "<a href=javascript:story.displayTiddler(null,'"+tiddlers[i].title+"')>open "+tiddlers[i].title+"</a>";
 var twText = '<a href="' + "javascript:story.displayTiddler(null,'"+tiddlers[i].title+"')" + '">open ' +tiddlers[i].title+"</a>";
 //timeline.push(escape(twText.encodeString()));
 timeline.push(twText.encodeString());
 timeline.push("</event>");
 }
 // Close open tags
 timeline.push("</data>");
 
 // Output xml.
 return timeline.join("\n"); 
 },
 generateTimelineJSON: function(){
 
 }
}

window.TwTimeline=function(elementDom, timelineXML, bandInfo){
 return this.init(elementDom, timelineXML, bandInfo);
}

//Static settings.
TwTimeline.config = {
 tag: "all",
 elementDom: "mytimeline",
 timelineXML:"example1.xml",
 duration:false,
 order:"modified",
 bandInfo:{
 date:new Date().convertToTimelineDate(), 
 width:"100%", 
 intervalUnit: Timeline.DateTime.DAY, 
 intervalPixels: 50,
 showEventText:true,
 trackHeight:1.5,
 trackGap:1.0
 }
}

//Timeline class, created in plugin
TwTimeline.prototype.init=function(elementDom, timelineXML, bandInfo) {
 this.elementDom=elementDom||TwTimeline.config.elementDom;
 this.timelineXML=timelineXML||TwTimeline.config.timelineXML; 
 this.bandInfo=bandInfo||TwTimeline.config.bandInfo;
 this.tl=null;
 this.resizeTimerID=null;
 this.onLoad();
 return this;
}

TwTimeline.prototype.onLoad= function(){
 var eventSource = new Timeline.DefaultEventSource();
 var bandInfos = [];
 
 for (var i=0; i<this.bandInfo.length; i++) {
 if (("showEventText" in this.bandInfo[i])&&("trackHeight" in this.bandInfo[i])&&("trackGap" in this.bandInfo[i])){ 
 bandInfos.push(Timeline.createBandInfo({
 eventSource: eventSource, 
 date: this.bandInfo[i].date, 
 width: this.bandInfo[i].width, 
 intervalUnit: this.bandInfo[i].intervalUnit, 
 intervalPixels: this.bandInfo[i].intervalPixels, 
 showEventText: this.bandInfo[i].showEventText, 
 trackHeight: this.bandInfo[i].trackHeight, 
 trackGap: this.bandInfo[i].trackGap})
 );
 }else{
 bandInfos.push(Timeline.createBandInfo({
 eventSource: eventSource, 
 date: this.bandInfo[i].date, 
 width: this.bandInfo[i].width, 
 intervalUnit: this.bandInfo[i].intervalUnit, 
 intervalPixels: this.bandInfo[i].intervalPixels})
 );
 }
 if(this.bandInfo[i].highlight){
 bandInfos[i].highlight = this.bandInfo[i].highlight;
 }
 if(i>0) {
 if (this.bandInfo[i].synch >= 0){
 bandInfos[i].syncWith = this.bandInfo[i].synch;
 }
 }
 }
 this.tl = Timeline.create(document.getElementById(this.elementDom), bandInfos);
 //this.tl = Timeline.create(document.getElementById(this.elementDom), bandInfos, Timeline.VERTICAL);
 Timeline.loadXML(this.timelineXML, function(xml, url) {eventSource.loadXML(xml, url);});
//Timeline.loadTiddlers(tag,duration,function(tag,duration){eventSource.loadTiddlers(tag,duration);}
}

TwTimeline.prototype.onResize=function() {
 if (resizeTimerID == null) {
 resizeTimerID = window.setTimeout(function() {
 resizeTimerID = null;
 this.tl.layout();
 }, 500);
 }
}

//Options
merge(config.options,{txtTimelineXMLTag:TwTimeline.config.tag, txtTimelineXMLfile:TwTimeline.config.timelineXML, txtTimelineDom:TwTimeline.config.elementDom, chkTimelineDuration:TwTimeline.config.duration, txtTimelineTag:TwTimeline.config.tag});
//=== Set options shadow Tiddler.
//Macro
config.macros.twtimeline={
 label:{saveXML:"Save %0."},
 prompt:{saveXML:"Save %0 file for current TiddlyWiki."},
 messages:{XMLError:"XML error%0- select xml file.", XMLSaved:"Saved %0 file.",XMLSavedError:"Failed to save %0 file."},
 handler: function(place,macroName,params) {
 /*
 params[0] - function to run.
 params[1] - Use tiddlers with this tag for the timeline. "All" or specific tag.
 params[2] - the name of the xml file to load/save.
 params[3] - use modified date for timeline duration.
 params[4] - the name of the DOM element.
 params[5] - bandinfo array - bandId, date, width, intervalUnit, intervalPixels, <synch>, <highlight>, <showEventText>,<trackHeight>,<trackGap>. 
 "," = band parameter seperator and "$" = band seperator.
 [0]:date - format = now or <mmm dd, yyyy>
 [1]:width - format = <integer number>%
 [2]:intervalUnit - format = m or h or D or W or M or Y
 [3]:intervalPixels - format = <integer number>
 [4]:synch - format = <band id> to synch with
 [5]:highlight - format = true or false
 [6]:showEventText - format = true or false
 [7]:trackHeight - format = <fraction>
 [8]:trackGap - format = <fraction>
 e.g. now,50%,D,50,0,true$now,35%,M,100,0,true$now,15%,Y,200,0,true,false,0.5,0.2 
 */
 var param={FXN:0, TAG:1, XML:2, MODIFIED:3, DOM:4, BAND:5}; 
 var elementDom,timelineXML, tag, duration;
 
 // Set event xml file.
 timelineXML=params[param.XML]||config.options.txtTimelineXMLfile;
 // Set duration flag.
 duration=params[param.MODIFIED]||config.options.chkTimelineDuration;
 //Set DOM element used to display the timeline.
 elementDom=params[param.DOM]||config.options.txtTimelineDom;
 //Set the tag used to filter tiddlers for timeline.
 tag=params[param.TAG]||config.options.txtTimelineTag;
 
 //Execute instruction in params[0]
 switch(params[param.FXN]) {
 case "saveXML":
 if(!readOnly) {
 createTiddlyButton(place,this.label.saveXML.format([timelineXML]), this.prompt.saveXML.format([timelineXML]), function(){saveXML(tag, timelineXML, "modified", duration); return false;});
 }
 break;
 
 default: 
 var bandInfo=[];
 if (params[param.BAND]==undefined|| params[param.BAND]==null || params[param.BAND].trim()===""){
 /*
 bandInfo[0]={date: new Date("Jun 28, 2006").convertToTimelineDate(), width: "50%", intervalUnit: Timeline.DateTime.DAY, intervalPixels: 50, synch:0, highlight:true};
 bandInfo[1]={date: new Date("Jun 28, 2006").convertToTimelineDate(), width: "45%", intervalUnit: Timeline.DateTime.MONTH, intervalPixels: 100, synch:0, highlight:true};
 bandInfo[2]={date: new Date("Jun 28, 2006").convertToTimelineDate(), width: "5%", intervalUnit: Timeline.DateTime.YEAR, intervalPixels: 200, synch:0, highlight:true, showEventText:false, trackHeight:0.5, trackGap:0.2};
 */
 bandInfo[0]={date: new Date().convertToTimelineDate(), width: "50%", intervalUnit: Timeline.DateTime.DAY, intervalPixels: 50, synch:0, highlight:true};
 bandInfo[1]={date: new Date().convertToTimelineDate(), width: "45%", intervalUnit: Timeline.DateTime.MONTH, intervalPixels: 100, synch:0, highlight:true};
 bandInfo[2]={date: new Date().convertToTimelineDate(), width: "5%", intervalUnit: Timeline.DateTime.YEAR, intervalPixels: 200, synch:0, highlight:true, showEventText:false, trackHeight:0.5, trackGap:0.2};

 }else{
 var bandInfoParts = params[param.BAND].split("$");
 for (var i=0; i<bandInfoParts.length; i++){
 var bandInfoSubParts = bandInfoParts[i].split(",");
 var bandInfoDate, bandInfoInterval;
 if (bandInfoSubParts.length >0){
 if (bandInfoSubParts[0]=="now"){
 bandInfoDate = new Date().convertToTimelineDate();
 }else{
 bandInfoDate = new Date(bandInfoSubParts[0]).convertToTimelineDate();
 }
 switch(bandInfoParts[2]){
 case "m": bandInfoInterval=Timeline.DateTime.MINUTE; break;
 case "h": bandInfoInterval=Timeline.DateTime.HOUR; break;
 case "W": bandInfoInterval=Timeline.DateTime.WEEK; break;
 case "M": bandInfoInterval=Timeline.DateTime.MONTH; break;
 case "Y": bandInfoInterval=Timeline.DateTime.YEAR; break;
 default: bandInfoInterval=Timeline.DateTime.DAY; break;
 }
 if (bandInfoSubParts.length>7){ 
 bandInfo.push({date:bandInfoDate, width:bandInfoSubParts[1], intervalUnit:bandInfoInterval, intervalPixels:bandInfoSubParts[3],synch:bandInfoSubParts[4],highlight:bandInfoSubParts[5], showEventText:bandInfoSubParts[6], trackHeight:bandInfoSubParts[7],trackGap:bandInfoSubParts[8]});
 }else if (bandInfoSubParts.length>5){ 
 bandInfo.push({date:bandInfoDate, width:bandInfoSubParts[1], intervalUnit:bandInfoInterval, intervalPixels:bandInfoSubParts[3],synch:bandInfoSubParts[4], highlight:bandInfoSubParts[5], showEventText:bandInfoSubParts[6]});
 }else{
 bandInfo.push({date:bandInfoDate, width:bandInfoSubParts[1], intervalUnit:bandInfoInterval, intervalPixels:bandInfoSubParts[3],synch:bandInfoSubParts[4], highlight:bandInfoSubParts[5]});
 //bandInfo.push({strJSON}); 
 //eval('(' + strJSON + ')');
 }
 } 
 }
 }
 var mytimeline = createTiddlyElement(place,"div",elementDom,"twtimeline","Timeline Macro Text."); 
 var twtimeline = new TwTimeline(elementDom,timelineXML,bandInfo);
 }
 
//Helper functions 
 function getXMLFilePath () {
 var originalPath = document.location.toString();
 // Remove any location part of the URL
 var hashPos = originalPath.indexOf("#");
 if(hashPos != -1)
 originalPath = originalPath.substr(0,hashPos);
 // Convert to a native file format assuming
 // "file:///x:/path/path/path..." - pc local file --> "x:\path\path\path..."
 // "file://///server/share/path/path/path..." - FireFox pc network file --> "\\server\share\path\path\path..."
 // "file:///path/path/path..." - mac/unix local file --> "/path/path/path..."
 // "file://server/share/path/path/path..." - pc network file --> "\\server\share\path\path\path..."
 var localPath;
 var finalPath;
 if(originalPath.charAt(9) == ":"){ // pc local file
 localPath = unescape(originalPath.substr(8)).replace(new RegExp("/","g"),"\\");
 finalPath = localPath.substr(0,localPath.lastIndexOf("\\")) + "\\";
 }else if(originalPath.indexOf("file://///") == 0){ // FireFox pc network file
 localPath = "\\\\" + unescape(originalPath.substr(10)).replace(new RegExp("/","g"),"\\");
 finalPath = localPath.substr(0,localPath.lastIndexOf("\\"))+ "\\";
 }else if(originalPath.indexOf("file:///") == 0) {// mac/unix local file
 localPath = unescape(originalPath.substr(7));
 finalPath = localPath.substr(0,localPath.lastIndexOf("/"))+ "/";
 }else if(originalPath.indexOf("file:/") == 0){ // mac/unix local file
 localPath = unescape(originalPath.substr(5));
 finalPath = localPath.substr(0,localPath.lastIndexOf("/"))+ "/";
 }else{ // pc network file
 localPath = "\\\\" + unescape(originalPath.substr(7)).replace(new RegExp("/","g"),"\\");
 finalPath = localPath.substr(0,localPath.lastIndexOf("\\"))+ "\\";
 }
 return finalPath;
 }
 
 function saveXML(tag, timelineXML,order,duration) {
 if(!readOnly) {
 var localPath = getXMLFilePath();
 var xmlFile = timelineXML||TwTimeline.config.timelineXML;
 var localXMLFile = "";
 
 //If config.options.txtTimelineXMLfile starts with './' remove and use result.
 if (config.options.txtTimelineXMLfile.indexOf("./") >= 0 ) {
 localXMLFile = config.options.txtTimelineXMLfile.replace(new RegExp("./","i"),"");
 if (localPath.lastIndexOf("\\") >= 0) {
 xmlFile = localXMLFile.replace(new RegExp("/","g"),"\\");
 } 
 }
 var xmlPath = localPath + xmlFile;
 //var xmlSave = saveFile(xmlPath,convertUnicodeToUTF8(generateTimelineXML()));
 var xmlSave = saveFile(xmlPath,convertUnicodeToUTF8(TwData.generateTimelineXML(tag,order,duration)));
 if(xmlSave){
 displayMessage(config.macros.twtimeline.messages.XMLSaved,xmlPath);
 if(!startingUp)
 refreshAll();
 } else {
 alert(this.messages.XMLSavedError);
 }
 }
 } 
 } //end handler
 } //Macro
}//Load once. 