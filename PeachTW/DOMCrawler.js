/***
!About
|Author: Bradley Meck|
|Date: Dec 20, 2006|
|Version: 1.0.0|
This object the DOMCrawler is made to simplify crawling through the DOM trying to find a node. Since it can ofter be confusing to write code that does this as well as what you may be testing for this seems like the best route to take by making an iterator to do it for you.

Also since there can be a hassle jumping in and out of nodes to accomplish some tasks going forward and backward, this object might help you out.

!Example Usage
!!!Find First Text Node From A Node And Remove it
{{{

var startNode = element;
var crawler = new DOMCrawler(startNode)
while(crawler.currentNode.nodeType != 3)crawler.getNextNode();
//If a textNode was found and it has a parent
if(crawler.currentNode && crawler.currentNode.parentNode){
	crawler.currentNode.parentNode.removeChild(crawler.currentNode);
}

}}}
!Code
***/
//{{{
config.macros.DOMCrawler = function(startNode){
	this.currentNode = startNode;
	this.state = -1;
	this.lastMovement = STAYED;
	this.STAYED = -1;
	this.JUMP_OUT = 0;
	this.JUMP_IN = 1;
	this.ADJACENT_NODE = 2;
}

config.macros.DOMCrawler.prototype = {
	getNextNode: function(){
		if(this.currentNode.childNodes && this.currentNode.childNodes.length > 0){
			this.currentNode = this.currentNode.firstChild;
			this.state = this.JUMP_IN
		}
		else if(this.currentNode.nextSibling){
			this.currentNode = this.currentNode.nextSibling;
			this.state = this.ADJACENT_NODE;
		}
		else{
			if(this.currentNode.parentNode && this.currentNode.parentNode.nextSibling){
				this.currentNode = this.currentNode.parentNode.nextSibling;
			}
			else{
				this.lastMovement = this.STAYED;
				return;
			}
			this.state = this.JUMP_OUT;
		}
		this.lastMovement = 1;
	},
	getNextInternalNode: function(){
		if(this.currentNode.childNodes && this.currentNode.childNodes.length > 0){
			this.currentNode = this.currentNode.firstChild;
			this.state = this.JUMP_IN
		}
		else if(this.currentNode.nextSibling){
			this.currentNode = this.currentNode.nextSibling;
			this.state = this.ADJACENT_NODE;
		}
		else{
			this.lastMovement = this.STAYED;
			return;
		}
		this.lastMovement = 1;
	},
	getNextOuterNode: function(){
		if(this.currentNode.nextSibling){
			this.currentNode = this.currentNode.nextSibling;
			this.state = this.ADJACENT_NODE;
		}
		else{
			if(this.currentNode.parentNode && this.currentNode.parentNode.nextSibling){
				this.currentNode = this.currentNode.parentNode.nextSibling;
			}
			else{
				this.lastMovement = this.STAYED;
				return;
			}
			this.state = this.JUMP_OUT;
		}
		this.lastMovement = 1;
	},
	getPreviousNode: function(){
		if(this.currentNode.childNodes && this.currentNode.childNodes.length > 0){
			this.currentNode = this.currentNode.lastChild;
			this.state = this.JUMP_IN
		}
		else if(this.currentNode.previousSibling){
			this.currentNode = this.currentNode.previousSibling;
			this.state = this.ADJACENT_NODE;
		}
		else{
			if(this.currentNode.parentNode && this.currentNode.parentNode.previousSibling){
				this.currentNode = this.currentNode.parentNode.previousSibling;
			}
			else{
				this.lastMovement = this.STAYED;
				return;
			}
			this.state = this.JUMP_OUT;
		}
		this.lastMovement = -1;
	},
	getPreviousInternalNode: function(){
		if(this.currentNode.childNodes && this.currentNode.childNodes.length > 0){
			this.currentNode = this.currentNode.lastChild;
			this.state = this.JUMP_IN
		}
		else if(this.currentNode.previousSibling){
			this.currentNode = this.currentNode.previousSibling;
			this.state = this.ADJACENT_NODE;
		}
		else{
			this.lastMovement = this.STAYED;
			return;
		}
		this.lastMovement = -1;
	},
	getPreviousOuterNode: function(){
		if(this.currentNode.previousSibling){
			this.currentNode = this.currentNode.previousSibling;
			this.state = this.ADJACENT_NODE;
		}
		else{
			if(this.currentNode.parentNode && this.currentNode.parentNode.previousSibling){
				this.currentNode = this.currentNode.parentNode.previousSibling;
			}
			else{
				this.lastMovement = this.STAYED;
				return;
			}
			this.state = this.JUMP_OUT;
		}
		this.lastMovement = -1;
	}
}
//}}}