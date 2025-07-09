/***
!Conditional Display Formatter
!!About
|Author : Bradley Meck|
|Date : Dec 24, 2006|
!!Usage
{{{
<cond expression>
	content...
</cond>
}}}
!!Code
***/
//{{{
config.macros.conditionalDisplay = { };
config.macros.conditionalDisplay.lookaheadRegExp = /\<cond[\s]*([^>]*)\>/m
config.formatters.push(
	config.macros.nestedFormatter.getFormatter("ConditionalDisplay","<cond\\s*[^>]*\\>","<\\/cond>",function(w,s){
		var lookaheadMatch = config.macros.conditionalDisplay.lookaheadRegExp.exec( s [ 0 ] );
		if(lookaheadMatch ) {
			if( window.eval( lookaheadMatch [ 1 ] ) ) {
				wikify( s [ 1 ], w.output, null, w.tiddler );
			}
		}
}));
//}}}