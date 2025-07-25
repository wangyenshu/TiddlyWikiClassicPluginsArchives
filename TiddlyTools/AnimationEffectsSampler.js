/%
|Name|AnimationEffectsSampler|
|Source|http://www.TiddlyTools.com/#AnimationEffectsSampler|
|Version|2.0.0|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.1|
|Type|sample|
|Requires|AnimationEffectsPlugin, StyleSheetShortcuts, CloseOtherTiddlers, RefreshTiddler, ReplaceTiddlerTitle|
|Description|demonstrates techniques for animating wiki-formatted content|

SET SPEED MULTIPLIER (global variable) [0:00]
%/<<tiddler {{ 
	window.sec=config.options.txtAnimationEffectsRate||1000; // global abbreviation/default multiplier
	config.options.txtAnimationEffectsRate=window.sec; // user option value initialization
	""; // return blank tiddlername so macro doesn't produce output
}}>>/%

HIDE TIDDLER ELEMENTS [0:00]
%/<html><style>
#tiddlerAnimationEffectsSampler .subtitle,
#tiddlerAnimationEffectsSampler .tagged
	{ display:none !important; }
#tiddlerAnimationEffectsSampler .viewer {
	background-image:none !important;
	background-color:transparent;
	border:0; margin:0; padding:0;
}
</style></html>/%

CLOSE OTHER TIDDLERS [0:00]
%/<<tiddler CloseOtherTiddlers>>/%

HIDE PAGE ELEMENTS BEFORE ANIMATION [0:00]
%/<<animate =mainMenu     save  display       {{0*sec}}>>/%
%/<<animate =mainMenu     set   display none  {{0*sec}}>>/%
%/<<animate =sidebar      save  display       {{0*sec}}>>/%
%/<<animate =sidebar      set   display none  {{0*sec}}>>/%
%/<<animate =storyMenu    save  display       {{0*sec}}>>/%
%/<<animate =storyMenu    set   display none  {{0*sec}}>>/%
%/<<animate =siteTitle    save  display       {{0*sec}}>>/%
%/<<animate =siteTitle    set   display none  {{0*sec}}>>/%
%/<<animate =siteSubtitle save  display       {{0*sec}}>>/%
%/<<animate =siteSubtitle set   display none  {{0*sec}}>>/%
%/<<animate =displayArea  save  marginLeft    {{0*sec}}>>/%
%/<<animate =displayArea  set   marginLeft 0  {{0*sec}}>>/%
%/<<animate =displayArea  save  marginRight   {{0*sec}}>>/%
%/<<animate =displayArea  set   marginRight 0 {{0*sec}}>>/%
%/<<animate =siteMenu     save  visibility        {{0*sec}}>>/%
%/<<animate =siteMenu     set   visibility hidden {{0*sec}}>>/%
%/<<animate =breadCrumbs  save  visibility        {{0*sec}}>>/%
%/<<animate =breadCrumbs  set   visibility hidden {{0*sec}}>>/%

CONTAINER FOR SHOWING TIDDLER VIEWER BACKGROUND AT END OF ANIMATION
%/{{block{/%

LEFT/RIGHT SLIDING TEXT EFFECT [0:00 - 0:10]
%/@@position:absolute;width:100%;{{nowrap italic{/%
	%/<<animate div "{{red{Are you}}}"
		left %0% 0 50 {{0*sec}} {{1.5*sec}} 7>>/%
	%/<<animate div "{{blue{getting dizzy?}}}"
		left %0% 50 0 {{0*sec}} {{1.5*sec}} 7>>/%
	%/<<animate = fontSize    %0% 0 400 {{0*sec}} {{2.5*sec}} 4>>/%
	%/<<animate = +marginTop  %0% 0 10  {{0*sec}} {{1*sec}}   6>>/%
%/}}}@@/%

UP/DOWN SPINNING TEXT EFFECT [0:00 - 0:09]
%/{{big italic{
	<<animate "{{floatleft right green{Are<br>you}}}"
		fontSize %0% 0 300 {{0*sec}}   {{1.5*sec}} 6>>/%
	%/<<animate div "getting<br>dizzy?"
		fontSize %0% 0 300 {{1.5*sec}} {{1.5*sec}} 6>>/%
	%/<<animate = left       %0% 20 35 {{0*sec}} {{1*sec}} 6>>/%
	%/<<animate = +marginTop %0% 0  15 {{0*sec}} {{1*sec}} 6>>/%
	%/<<animate = +right     %0% 0  30 {{5*sec}} {{1*sec}} 6>>/%
%/}}}/%

ALMOST DONE MESSAGE [0:08 - 0:16.5]
%/{{big floatleft green{/%
	%/''//almost done...//''/%
	%/<<animate = set display none {{0*sec}}>>/%
	%/<<animate = set display inline {{8*sec}}>>/%
	%/<<animate = letterSpacing %0px  25 0 {{8*sec}}  {{8*sec}}>>/%
	%/<<animate = +fontSize     %0%  100 0 {{16*sec}} {{.5*sec}}>>/%
%/}}}/%

SIDE-TO-SIDE "SWING" EFFECT (ALL TIDDLER CONTENT) [0:00 - 0:11.2]
%/<<animate = left %0% 45 0 {{0*sec}} {{1.6*sec}} 7>>/%

FINAL COUNTDOWN [0:11.5 - 0:16.5]
%/{{floatleft bold italic{/%
	%/<<animate "5" fontSize %0% 0 400 {{11.5*sec}} {{.5*sec}} 2>>/%
	%/<<animate "4" fontSize %0% 0 350 {{12.5*sec}} {{.5*sec}} 2>>/%
	%/<<animate "3" fontSize %0% 0 300 {{13.5*sec}} {{.5*sec}} 2>>/%
	%/<<animate "2" fontSize %0% 0 250 {{14.5*sec}} {{.5*sec}} 2>>/%
	%/<<animate "1" fontSize %0% 0 200 {{15.5*sec}} {{.5*sec}} 2>>/%
%/}}}/%

RESTORE PAGE ELEMENTS AFTER PRIMARY ANIMATION [0:17]
%/<<animate =mainMenu     reset display     {{17*sec}}>>/%
%/<<animate =sidebar      reset display     {{17*sec}}>>/%
%/<<animate =storyMenu    reset display     {{17*sec}}>>/%
%/<<animate =siteTitle    reset display     {{17*sec}}>>/%
%/<<animate =siteSubtitle reset display     {{17*sec}}>>/%
%/<<animate =displayArea  reset marginLeft  {{17*sec}}>>/%
%/<<animate =displayArea  reset marginRight {{17*sec}}>>/%
%/<<animate =siteMenu     reset visibility  {{17*sec}}>>/%
%/<<animate =breadCrumbs  reset visibility  {{17*sec}}>>/%

SHOW CONTROL PANEL AND SOURCE DISPLAY [0:17 - 0:18.5] (END)
%/{{small{/%
	%/<<animate = set display none {{0*sec}}>>/%
	%/<<animate = set display inline {{17*sec}}>>/%
	%/{{selected{{{toolbar{/%
		%/{{fine{speed: }}}{{threechar smallform{<<option txtAnimationEffectsRate>>}}}/%
		%/{{medium{<<tiddler RefreshTiddler with: "replay" "restart animation sequence">>}}}/%
		%/<<animate = top %0px 200 0 {{17*sec}} {{1.5*sec}}>>/%
	%/}}}}}}/%
	%/{{block{/%
		%/{{green{''animation sequence completed''}}}
		//(see //[[AnimationEffectsPlugin]]// for macro definition/usage)// /%
		%/<<animate = left %0% 100 0 {{17*sec}} {{1.5*sec}}>>/%
	%/}}}/%
	%/{{smallform stretch center clear{/%
		%/<<tiddler AnimationEffectsSampler##showText
			with: {{store.getValue('AnimationEffectsSampler','text').htmlEncode()}}>>/%
!showText
<html><nowiki><div class='editor'><textarea readonly rows='20'>$1</textarea></div></html>
!end
		%/<<animate = left %0% -100 0 {{17*sec}} {{1.5*sec}}>>/%
	%/}}}/%
%/}}}/%

SHOW TIDDLER TITLE [0:17 - 0:18.5] (END)
%/<<tiddler ReplaceTiddlerTitle with:
   "~AnimationEffectsSampler\<\<animate div = left %0% -100 0 {{17*sec}\} {{1.5*sec}\}\>\>">>/%

SHOW VIEWER BACKGROUND [0:18]
%/<<animate = add viewer {{17.5*sec}}>>/%

%/}}}/% END OF CONTAINER FOR VIEWER BACKGROUND %/