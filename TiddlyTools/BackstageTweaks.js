/***
!!!Adjustments to Backstage appearances
***/
//{{{
if (config.tasks!=undefined) { // TW2.2B3 or above

// hide "backstage/close" text, use alternative glyphs
config.messages.backstage.open.text="";
config.messages.backstage.close.text="";
config.glyphs.codes.bentArrowLeft=["\u00ab","\u00ab"]; // left double-angle quote (&laquo;)
config.glyphs.codes.bentArrowRight=["\u00bb","\u00bb"]; // right double-angle quote (&raquo;)
// config.glyphs.codes.downTriangle=["\u25bc","\u25bc"]; // down triangle

// adjust backstage panel styles
setStylesheet("\
	#backstagePanel \
		{ background:#eee !important; padding:.5em; \
		border:2px solid; border-width-top:0px; \
		-moz-border-radius-bottomleft:1em; -moz-border-radius-bottomright:1em} \
		-webkit-border-bottom-left-radius:1em; -webkit-border-bottom-right-radius:1em} \
	#backstageButton \
		{ font-size:9pt; } \
	#backstageArea \
		{ font-size:7pt; } \
	","BackstageTweaks");

// Hijack backstage.init() to add "mouseover" class to backstage button
backstage.save_init=backstage.init;
backstage.init=function() {
	this.save_init.apply(this,arguments);
	var btn=document.getElementById("backstageShow");
	if (btn && (addClass instanceof Function)) addClass(btn,"mouseover");
}

} // end if (config.tasks)
//}}}