/%
!info
|Name|ToggleFullScreen|
|Source|http://www.TiddlyTools.com/#ToggleFullScreen|
|Version|2.1.0|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.1|
|Type|transclusion|
|Description|Create a link that shows/hides sidebars and page headers|
Usage
<<<
{{{
<<tiddler ToggleFullScreen>>
<<tiddler ToggleFullScreen with: label altlabel>>
}}}
embeds a command link into content, where:
*''label'' (optional, default={{{fullscreen}}})<br>command text
*''altlabel'' (optional, default={{{restore}}})<br>alternative command text shown when full screen is enabled
You can also enable/disable full screen immediately (without clicking a command link) by embedding the one of the following directly in your content:
{{{
<<tiddler ToggleFullScreen##ON>>
<<tiddler ToggleFullScreen##OFF>>
}}}
<<<
Example
<<<
{{{<<tiddler ToggleFullScreen with: fullscreen restore>>}}}
<<tiddler ToggleFullScreen##show with: fullscreen restore>>
<<<
Revisions
<<<
2011.05.13 2.1.0 refactored code and restored "##ON" and "#OFF" usage
2010.xx.xx 2.0.1 converted to transclusion
2008.10.13 1.1.3 re-written to support bookmarklet usage
2008.01.20 1.0.0 created (inline script)
<<<
!end

!code
<<tiddler {{
window.setFullScreen = function(fs) {
	var co=config.options; var cm=config.macros;
	cm.option.propagateOption('chkFullScreen','checked',fs,'input');

	var showmm=!fs && co.chkShowLeftSidebar!==false;
	var showsb=!fs && co.chkShowRightSidebar!==false;
	var showcrumbs=!fs && co.chkShowBreadcrumbs!==false
		&& cm.breadcrumbs && cm.breadcrumbs.crumbs.length;
	var showstorymenu=!fs;

	var da=document.getElementById('displayArea');
	var cw=document.getElementById('contentWrapper');
	var mm=document.getElementById('mainMenu');
	var sb=document.getElementById('sidebar');
	var sm=document.getElementById('storyMenu');
	var bc=document.getElementById('breadCrumbs');

	if (cw){ // toggle page header
		var elems=cw.getElementsByTagName('*');
		for (var i=0; i<elems.length; i++) if (hasClass(elems[i],'header')) 
			{ elems[i].style.display=fs?'none':'block'; break; }
	}
	if (mm) { // toggle MainMenu
		mm.style.display=showmm?'block':'none';
		da.style.marginLeft=showmm?(co.txtDisplayAreaLeftMargin||''):'1em';
	}
	if (sb) { // toggle sidebar
		sb.style.display=showsb?'block':'none';
		da.style.marginRight=showsb?(co.txtDisplayAreaRightMargin||''):'1em';
	}
	if (sm) sm.style.display=showstorymenu?'block':'none';	// toggle StoryMenu
	if (bc) bc.style.display=showcrumbs?'block':'none';	// toggle BreadCrumbsPlugin

	var b=document.getElementById('restoreFromFullscreenButton'); if (b) removeNode(b);
	if (fs) { 
		setStylesheet(store.getTiddlerText('ToggleFullScreen##styles'),'fullScreenStyles');
		var b=createTiddlyElement(null,'span','restoreFromFullscreenButton','selected');
		b.innerHTML='&loz;';
		b.title='RESTORE: redisplay page header, menu and sidebar';
		b.onclick=function(ev){return window.setFullScreen(false);};
		document.body.insertBefore(b,null);
	}
	return false;
};
'';}}>>
!end

!styles
#restoreFromFullscreenButton {
	position:fixed; top:.3em; right:.3em; z-index:10001;
	cursor:pointer; font-size:8pt; color:ButtonText !important;
	border:2px outset ButtonFace; padding:0px 3px;
	background-color:ButtonFace; -moz-appearance:button;
}
!end

!ON
<<tiddler ToggleFullScreen##code>><<tiddler {{window.setFullScreen(true);'';}}>>
!end

!OFF
<<tiddler ToggleFullScreen##code>><<tiddler {{window.setFullScreen(false);'';}}>>
!end

!show
<<tiddler ToggleFullScreen##code>><html><nowiki>
<a href='javascript:;' title="FULLSCREEN: toggle sidebars and page header"
onmouseover="
	this.href='javascript:void(eval(decodeURIComponent(%22(function(){try{('
	+encodeURIComponent(encodeURIComponent(this.onclick))
	+')()}catch(e){alert(e.description?e.description:e.toString())}})()%22)))';"
onclick="
	window.setFullScreen(!config.options.chkFullScreen); // toggle setting
	this.innerHTML=!config.options.chkFullScreen?'$1':'$2'; // set command text
	return false;
">$1</a></html>
!end

%/<<tiddler {{var src='ToggleFullScreen'; src+(tiddler&&tiddler.title==src?'##info':'##show');}}
with:	{{'$'+'1'!='$1'?'$1':'fullscreen'}}
	{{'$'+'2'!='$2'?'$2':'restore'}}>>