/***
|W3CRange / W3CSelection for IE|h
!examples
[[SelectTest]]

|Constructors|h

|config.macros.W3CSelection|
|arguments : none|

|config.macros.W3CRange|
|arguments : oldRange or null|

!Basic Methods
*http://developer.mozilla.org/en/docs/DOM:range without
{{{
comparePoint

createContextualFragment

isPointInRange
}}}
!Extra
|method|selectInput |
|arguments|TextArea , startOffset , endOffset |
|usage|grabs the selection from a "TextArea" or "Input" tag and sets the start and end offsets |

!Todo
*add custom method '''range.applyFunctionToRangeElements(func)''' that will do basically a function call on all the nodes in the range with arguements (node,isleaf,range)

***/

//{{{
config.macros.W3CSelection = function(){
 this.oldSelection = window.getSelection?window.getSelection():document.getSelection?document.getSelection():document.selection;
 return this;
}

config.macros.W3CSelection.prototype = {
 getRangeAt: function(n){
 if(this.oldSelection.getRangeAt){
 if(n >= this.oldSelection.rangeCount) return null;
 var oldRange = this.oldSelection.getRangeAt(n);
 return oldRange?(new config.macros.W3CRange(oldRange)):null;
 }
 else{
 var s = this.oldSelection.createRange();
 return s?(new config.macros.W3CRange(s)):null; 
 }
 },
 collapse: function(node,offset){
 if(this.oldSelection.collapse){
 this.oldSelection.collapse();
 }
 else{
 this.oldSelection.clear();
 var rang = new config.macros.W3CRange();
 rang.setStart(node,offset);
 rang.collapse(true);
 this.addRange(rang);
 }
 },
 getRanges: function(){
 var rangs = [];
 if(this.oldSelection.getRanges){
 var stuff = this.oldSelection.getRanges();
 for(var i = 0; i < stuff.length; i++){
 rangs.push(new config.macros.W3CRange(stuff[i]));
 }
 }
 else{
 var stuff= this.oldSelection.createRangeCollection();
 for(var i = 0; i < stuff.count; i++){
 rangs.push(new config.macros.W3CRange(stuff.item(i)))
 }
 }
 return rangs;
 },
 extend: function(node,offset){
 if(this.oldSelection.extend){
 this.oldSelection.extend(node,offset);
 }
 else{
 var rang = new config.macros.W3CRange();
 rang.setStart(node,offset);
 rang.collapse(true);
 ranges = this.getRanges();
 var hasBefore = false, hasAfter = false;
 for(var i = 0; i < ranges.length;i++){
 if(ranges[i].compareBoundaryPoint(ranges[i].START_TO_START,rang.oldRange) == -1){
 hadBefore = true;
 }
 if(ranges[i].compareBoundaryPoint(ranges[i].END_TO_END,rang.oldRange) == 1){
 hasAfter = true;
 }
 }
 if(!hasBefore && hasAfter){
 (new config.macros.W3CRange(this.oldSelection.createRange())).setStart(node,offset);
 }
 else if(hasBefore && !hasAfter){
 (new config.macros.W3CRange(this.oldSelection.createRange())).setEnd(node,offset);
 }
 else if(!hasBefore && !hasAfter){
 this.oldSelection.createRangeCollection().add(rang.oldRange);
 }
 }
 },
 addRange: function(rang){
 if(this.oldSelection.addRange){
 this.oldSelection.addRange(rang.oldRange);
 }
 else{
 this.oldSelection.createRangeCollection().add(rang.oldRange);
 }
 },
 removeRange: function(rang){
 if(this.oldSelection.removeRange){
 this.oldSelection.removeRange(rang.oldRange);
 }
 else{
 this.oldSelection.createRangeCollection().remove(rang.oldRange);
 }
 },
 removeAllRanges: function(){
 if(this.oldSelection.removeAllRanges){
 this.oldSelection.removeAllRanges();
 }
 else{
 this.oldSelection.clear();
 }
 }
}

config.macros.W3CRange = function(oldRangeObj){
 if(oldRangeObj){
 this.oldRange = oldRangeObj
 }
 else if(document.createRange){
 this.oldRange = document.createRange();
 }
 else{
 this.oldRange = document.body.createTextRange();
 this.oldRange.collapse();
 }
 var hasAncestor = false;
 if(this.oldRange.commonAncestorContainer){
 this.commonAncestorContainer = this.oldRange.commonAncestorContainer
 hasAncestor = true;
 }
 else if(this.oldRange.parentElement){
 this.commonAncestorContainer = this.oldRange.parentElement();
 hasAncestor = true;
 }
 if(hasAncestor){
 this.collapsed = this.oldRange.collapsed!=null?this.oldRange.collapsed:(this.oldRange.text.length == 0);
 if(this.oldRange.startContainer){
 this.startContainer = this.oldRange.startContainer
 }
 else{
 var rang = this.oldRange.duplicate();
 rang.setEndPoint("StartToStart",this.oldRange);
 rang.setEndPoint("EndToStart",this.oldRange);
 this.oldRange.startContainer = rang.parentElement();
 }
 if(this.oldRange.startOffset != null){
 this.startOffset = this.oldRange.startOffset;
 }
 else if(this.startContainer){
 var compareRange = this.oldRange.duplicate();
 compareRange.moveToElementText(this.startContainer);
 compareRange.setEndPoint("EndToStart",this.oldRange);
 this.startOffset = compareRange.text.length;
 }
 if(this.oldRange.endContainer){
 this.endContainer = this.oldRange.endContainer
 }
 else{
 var rang = this.oldRange.duplicate();
 rang.setEndPoint("EndToEnd",this.oldRange);
 rang.setEndPoint("StartToEnd",this.oldRange);
 this.oldRange.endContainer = rang.parentElement();
 }
 if(this.oldRange.endOffset != null){
 this.endOffset = this.oldRange.endOffset;
 }
 else if(this.endContainer){
 var compareRange = this.oldRange.duplicate();
 compareRange.moveToElementText(this.endContainer);
 compareRange.setEndPoint("StartToEnd",this.oldRange);
 this.endOffset = compareRange.text.length;
 }
 }
 this.START_TO_END = 1
 this.START_TO_START = 2
 this.END_TO_START = 3
 this.END_TO_END = 4

 return this;
}

config.macros.W3CRange.prototype = {
 selectInput : function(node,start,end){
 if(node.setSelectionRange)
 {
 this.oldRange = node.setSelectionRange(start?start:0,end?end:node.value.length);
 }
 else if(node.createTextRange){ 
 this.oldRange = node.createTextRange(); 
 this.oldRange.moveStart("character",start?start:0); 
 var endOffset = end?-(node.value.length-end)+1:0;
 this.oldRange.moveEnd("character",endOffset);
 this.oldRange.select();
 }
 else{
 this.selectNode(node);
 }
 config.macros.W3CRange.call(this,this.oldRange)
 },
 setStart : function(startNode,startOffset){
 if(this.oldRange.setStart){
 this.oldRange.setStart(startNode,startOffset);
 }
 else{
 var startRange = this.oldRange.duplicate();
 startRange.moveToElementText(startNode);
 startRange.moveStart("character",startOffset);
 this.oldRange.setEndPoint("StartToStart",startRange);
 }
 config.macros.W3CRange.call(this,this.oldRange)
 },
 setEnd : function(endNode,endOffset){
 if(this.oldRange.setEnd){
 this.oldRange.setEnd(endNode,endOffset);
 }
 else{
 var endRange = this.oldRange.duplicate();
 endRange.moveToElementText(endNode);
 endRange.moveEnd("character",endOffset);
 this.oldRange.setEndPoint("EndToEnd",endRange);
 }
 config.macros.W3CRange.call(this,this.oldRange)
 },
 setStartBefore: function(node){
 if(this.oldRange.setStartBefore){
 this.oldRange.setStartBefore(node);
 }
 else{
 var startRange = this.oldRange.duplicate();
 startRange.moveToElementText(node);
 this.oldRange.setEndPoint("StartToStart",startRange);
 }
 config.macros.W3CRange.call(this,this.oldRange)
 },
 setStartAfter: function(node){
 if(this.oldRange.setStartAfter){
 this.oldRange.setStartAfter(node);
 }
 else{
 var startRange = this.oldRange.duplicate();
 startRange.moveToElementText(node);
 this.oldRange.setEndPoint("StartToEnd",startRange);
 }
 config.macros.W3CRange.call(this,this.oldRange)
 },
 setEndBefore: function(node){
 if(this.oldRange.setEndBefore){
 this.oldRange.setEndBefore(node);
 }
 else{
 var endRange = this.oldRange.duplicate();
 endRange.moveToElementText(node);
 this.oldRange.setEndPoint("EndToStart",endRange);
 }
 config.macros.W3CRange.call(this,this.oldRange)
 },
 setEndAfter: function(node){
 if(this.oldRange.setEndAfter){
 this.oldRange.setEndAfter(node);
 }
 else{
 var endRange = this.oldRange.duplicate();
 endRange.moveToElementText(node);
 this.oldRange.setEndPoint("EndToEnd",endRange);
 }
 config.macros.W3CRange.call(this,this.oldRange)
 },
 selectNode: function(node){
 this.oldRange.selectNode?this.oldRange.selectNode(node):this.oldRange.moveToElementText(node);
 config.macros.W3CRange.call(this,this.oldRange)
 },
 selectNodeContents: function(node){
 this.oldRange.selectNodeContents?this.oldRange.selectNodeContents(node):this.oldRange.moveToElementText(node);
 config.macros.W3CRange.call(this,this.oldRange)
 },
 collapse: function(toStart){this.oldRange.collapse(toStart);/*IE AND W3C! AMAZING!*/},
 cloneContents: function(){
 if(this.oldRange.cloneContents){
	return this.oldRange.cloneContents();
 }
 else{
	var range = this.oldRange.duplicate();
	var deleter = this.oldRange.duplicate();
	var result = this.commonAncestorContainer.cloneNode(true);
	document.body.appendChild(result);
	range.moveToElementText(this.commonAncestorContainer);
	range.setEndPoint("EndToStart",this.oldRange);
	var n = range.text.length;
	var startClip = n>0?true:false;
	deleter.moveToElementText(result);
	deleter.collapse(true);
	deleter.moveEnd("character",n);
	deleter.text = ""; // Delete beginning
	range.moveToElementText(this.commonAncestorContainer);
	range.setEndPoint("StartToEnd",this.oldRange);
	var n = range.text.length;
	var endClip = n>0?true:false;
	deleter.moveToElementText(result);
	deleter.collapse(false);
	deleter.moveStart("character",-n);
	deleter.text = ""; // Delete end
	document.body.removeChild(result);
	var docFrag = document.createDocumentFragment();
	for(var i = 0; i < result.childNodes.length; i++){
		docFrag.appendChild(result.childNodes[i]);
	}
	return docFrag;
 }
 },
 deleteContents: function(){
 this.oldRange.deleteContents?this.oldRange.deleteContents():(this.oldRange.text = "");
 config.macros.W3CRange.call(this,this.oldRange)
 },
 extractContents: function(){
 if(this.oldRange.extractContents){
 return this.oldRange.extractContents();
 }
 else{
 var e = this.cloneContents();
 this.deleteContents();
 return e;
 }
 },
/*insertNode: function(node){
 if(this.oldRange.insertNode){
	return this.oldRange.insertNode(node);
 }
 else{
	var range = this.oldRange.duplicate();
	var parent = this.commonAncestorContainer;
	var i = 0;
	range.moveToElementText(parent);
	range.setEndPoint("EndToStart",this.oldRange);
	var targetOffset = range.text.length;
	var offset = 0;
	for(; i < parent.childNodes.length; i++){
		if(parent.childNodes[i].nodeType == 1){//DOM Element
			offset += parent.childNodes[i].innerText.length;
		}
		else{//TEXT NODE
			offset += parent.childNodes[i].length;
		}
		if(offset > targetOffset){
			if(parent.childNodes[i].nodeType == 1){//DOM Element
				offset -= parent.childNodes[i].innerText.length;
				parent = parent.childNodes[i];
			}
			else{//TEXT NODE
				offset -= parent.childNodes[i].length;
				parent.splitText(targetOffset - offset);
				parent.parentNode.insertBefore(node,parent.nextSibling);
				return;
			}
		}
		else if(offset == targetOffset){
			if(parent.childNodes && parent.childNodes[i].nextSibling){
				parent.insertBefore(node,parent.childNodes[i].nextSibling);
				return;
			}
			else{
				break;
			}
		}
	}
	if(i == 0){
		if(parent.childNodes.length > 0){
			parent.insertBefore(node,parent.firstChild);
		}
		else{
			parent.appendChild(node);
		}
	}
	else if(i == parent.childNodes.length){
		parent.appendChild(node);
	}
 }
}*/
 insertNode: function(node){
 if(this.oldRange.insertNode){
	return this.oldRange.insertNode(node);
 }
 else{
	 var range = this.oldRange.duplicate();
	 range.collapse();
	 var parent = range.parent();
	 range.moveToElementText(parent);
	 range.moveEndPoint("EndToStart",this.oldRange);
	 var offset = range.text.length
	 var position = 0;
	 var i = 0;
	 for(; position < offset; i++){
		if(parent.childNodes[i].innerText){
			position += parent.childNodes[i].innerText.length
		}
		else if(parent.childNodes[i].text){
			position += parent.childNodes[i].text.length
		}
	 }
	 var elem = parent.childNodes[i]?parent.childNodes[i]:parent;
	 range.moveToElementText(elem);
	 var dir = range.compareEndPoints("StartToStart",this.oldRange);
	 if( dir < 0){
		while( dir < 0 )
		{
			elem = elem.previousSibling;
			range.moveToElementText(elem);
			dir = range.compareEndPoints("StartToStart",this.oldRange);
		}
	 }
	 else if( dir > 0){
		while( dir > 0 )
		{
			elem = elem.nextSibling;
			range.moveToElementText(elem);
			dir = range.compareEndPoints("StartToStart",this.oldRange);
		}
	 }
	 elem.parentNode.insertBefore( node, elem );
	}
 },
 surroundContents: function(nodeToInsertInto){
 if(this.oldRange.surroundContents){
 this.oldRange.surroundContents(nodeToInsertInto);
 }
 else{
 nodeToInsertInto.appendChild(this.extractContents());
 this.insertNode(nodeToInsertInto);
 }
 },
 detach: function(){
 if(this.oldRange.detach){
 this.oldRange.detach();
 }
 else{
 this.oldRange = null;
 }
 },
 toString: function(){
 if(this.oldRange.text==null){
 return this.oldRange.toString();
 }
 else{
 if(this.oldRange.text){
 return this.oldRange.text;
 }
 else{
 var par = this.oldRange.parentElement();
 if(par){
 if(par.tagName == "INPUT" || par.tagName == "TEXTAREA"){
 return par.value;
 }
 else{
 return par.innerHTML
 }
 }
 else{
 return "";
 }
 }
 }
 },
 cloneRange: function(){
 return (new config.macros.W3CRange(
 this.oldRange.cloneRange?this.oldRange.cloneRange():this.oldRange.duplicate()
 ));
 },
 compareBoundaryPoints: function(how,otherRange){
 if(how == this.START_TO_START){
 return (this.oldRange.compareBoundaryPoints?
 this.oldRange.compareBoundaryPoints(this.oldRange.START_TO_START,otherRange.oldRange):
 this.oldRange.compareEndPoints("StartToStart",otherRange.oldRange))
 }
 else if(how == this.START_TO_END){
 return (this.oldRange.compareBoundaryPoints?
 this.oldRange.compareBoundaryPoints(this.oldRange.START_TO_END,otherRange.oldRange):
 this.oldRange.compareEndPoints("StartToEnd",otherRange.oldRange))
 }
 else if(how == this.END_TO_START){
 return (this.oldRange.compareBoundaryPoints?
 this.oldRange.compareBoundaryPoints(this.oldRange.END_TO_START,otherRange.oldRange):
 this.oldRange.compareEndPoints("EndToEnd",otherRange.oldRange))
 }
 else if(how == this.END_TO_END){
 return (this.oldRange.compareBoundaryPoints?
 this.oldRange.compareBoundaryPoints(this.oldRange.END_TO_END,otherRange.oldRange):
 this.oldRange.compareEndPoints("EndToEnd",otherRange.oldRange))
 }
 }
}
//}}}