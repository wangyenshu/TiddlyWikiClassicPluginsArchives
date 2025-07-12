/%
!info
@@text-align:left;display:block;white-space:normal;
|Name|TinyChat|
|Source|http://www.TiddlyTools.com/#TinyChat|
|Version|2.0.3|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|Type|transclusion|
|Description|text/video chat service from tinychat.com|
TinyChat is a 3^^rd^^ party web service offered by http://tinychat.com, and provides real-time multi-user video/text chat for up to 12 simultaneous video users and 300 text chat users.  This //free// service is 100% web-based and does //not// install any software on your system, nor does it require any signup/registration for use.

Usage
<<<
{{{
<<tiddler TinyChat with: roomname>>
}}}
*If ''roomname'' is omitted, a droplist control is displayed, allowing you to select from a list of roomnames that can be optionally defined in [[TinyChatList]].
*The droplist also includes a command item to 'enter a roomname...'.  The default value for this input can be defined using a hard-coded value in a 'configuration tiddler' (e.g., {{{config.options.txtTinyChatRoom="roomname"}}}) or set interactively via {{{<<option txtTinyChatRoom>>}}}.
<<<
Example
<<<
{{{<<tiddler TinyChat>>}}}
<<tiddler TinyChat##banner>>
<<<
@@
!end

!banner
@@font-size:200%;''[[TinyChat|http://tinychat.com/]]''@@
^^your own chatroom, simple and easy.^^
<<tiddler TinyChat##select>> <<tiddler TinyChat##help>>
!end

!show
@@font-size:160%;http://tinychat.com/$1@@
$2{{span{$3}}}<<tiddler TinyChat##select>><html>
<input type='button' value="join room" onclick="
	var msg=this.parentNode.previousSibling.previousSibling;
	var target=this.nextSibling;
	var hide=target.style.display=='block';
	if (hide) {
		var here=this; while (!hasClass(here,'tinyChat')) here=here.parentNode;
		removeChildren(here); wikify('<<tiddler TinyChat with: $1>>',here);
	} else {
		this.value='exit room'; msg.style.display='none'; target.style.display='block';
		removeChildren(target); wikify('<<tiddler TinyChat##embed with: $1>>',target);
	}
"><div style="display:none"></div><nowiki></(tml> <<tiddler TinyChat##help>>
!end

!help
<html><nowiki><a href='javascript:;' title='About TinyChat' class='tinyChatHelp' onclick="
	var here=this; while (!hasClass(here,'tinyChat')) here=here.parentNode;
	removeChildren(here); wikify('<<tiddler TinyChat##info>>',here);
	return false;
">?</a></html>
!end

!select
<html><nowiki><select onchange="
	var v=this.value; if (v=='_ask') {
		v=config.options.txtTinyChatRoom||'tiddlytools';
		v=prompt('enter a room name',v)||'';
	}
	config.macros.option.propagateOption('txtTinyChatRoom','value',v,'input');
	var here=this; while (!hasClass(here,'tinyChat')) here=here.parentNode;
	removeChildren(here); wikify('<<tiddler TinyChat with: '+v+'>>',here);
	return false;">
</select></html><<tiddler {{
	var list=place.lastChild.getElementsByTagName('select')[0];
	if (!list.length) {
		list.options[0]=new Option('select a room...','');
		var rooms=store.getTiddlerText('TinyChatList','tiddlytools').split('\n');
		var curr=config.options.txtTinyChatRoom; var found=false; var indent='\xa0\xa0';
		for (var i=0;i<rooms.length;i++) { var r=rooms[i];
			var sel=r==curr; if (sel) found=true;
			list.options[list.length]=new Option(indent+r,r,sel,sel);
		}
		if (curr&&!found) list.options[list.length]=new Option(indent+curr,curr,true,true);
		list.options[list.length]=new Option('or, enter a room name...','_ask');
	}
'';}}>>
!end

!embed
<html><nowiki>
<iframe src="http://tinychat.com/$1" height=1000 width=100%></iframe>
</html>
!TEST_JS_EMBED
<html><nowiki><div id="client">
	<a href="http://tinychat.com">video chat</a> provided by Tinychat
</div></html><script>
	window.tinychat={ room: "$1", colorbk: "0xffffff", join: "auto", api: "list" };
</script><script src="http://tinychat.com/js/embed.js"></script>
!end

!refresh
<html><nowiki><a href="javascript:" title="click to refresh room status" onclick="
	var here=this; while (!hasClass(here,'tinyChat')) here=here.parentNode;
	removeChildren(here); wikify('<<tiddler TinyChat with: %1>\>',here);
	return false;
">%0</a></html>
!end

%/<html><nowiki><style>
	.tinyChat { text-align:center; } 
	.tinyChatHelp { color:ButtonText !important;
		border:2px outset ButtonFace; padding:1px 4px;
		background-color:ButtonFace; -moz-appearance:button;
		-moz-border-radius:.3em; -webkit-border-radius:.3em; 
	}
	#tiddlerTinyChat .tagged { display:none; }
</style></html>{{tinyChat{
<<tiddler {{ var room=('$1'!='$'+'1'?'$1':'').trim();
if (!room.length) {
	delete config.options.txtTinyChatRoom;
	var out="<<tiddler TinyChat##banner>\>";
	var here=place; while (!hasClass(here,'tinyChat')) here=here.parentNode;
	removeChildren(here); wikify(out,here);
} else {
	config.options.txtTinyChatRoom=room;
	var url='http://api.tinychat.com/'+room+'.json';
	var now=new Date().formatString('DDD, MMM DDth YYYY 0hh12:0mm:0ss am');
	now='~~'+store.getTiddlerText('TinyChat##refresh').format([now,room])+'~~\n';
	var callback=function(success,room,txt,src,xhr){
		var head=' '; var msg=now; var data={};
		if (success && xhr.status) {
			eval('data='+txt);
			if (data.topic) head='"""'+data.topic+'"""\n';
			if (data.names) {
				var len=data.names.length;
				msg+="//''There %0 %1 user%2 in the room:''//\n"+'^^"""%3"""^^\n';
				msg=msg.format([len==1?'is':'are',len,len==1?'':'s',data.names.join(', ')]);
			}
			else msg+="//the room is empty//\n";
		}
		else msg+="//room information not available//\n";
		var out='<<tiddler TinyChat##show with: %0 [[%1]] [[%2]]>\>'.format([room,head,msg]);
		var here=place; while (!hasClass(here,'tinyChat')) here=here.parentNode;
		removeChildren(here); wikify(out,here);
	};
	wikify('^^looking for http://tinychat.com/'+room+'...^^',place);
//	if (!httpReq("GET",url,callback,room,null,null,null,null,null,true)) {
		var msg=now+'//room information not available//\n'
		var out='<<tiddler TinyChat##show with: %0 [[%1]] [[%2]]>\>'.format([room,' ',msg]);
		var here=place; while (!hasClass(here,'tinyChat')) here=here.parentNode;
		removeChildren(here); wikify(out,here);
//	}
}
'';}}>>}}}