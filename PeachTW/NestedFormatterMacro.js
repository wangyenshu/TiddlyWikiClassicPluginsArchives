/***
|auth(o(((r)))): Bradley Meck|
|date: 12/03/2006|
|use: config.macros.nestedFormatter.getFormatter|
|params: String name, String openingMatch, String closingMatch, function Handler|

!About
This plugin's purpose is to produce a formatter that will allow for it to have nested structures. Included in this macro is an example at the bottom using parenthesis to give a font size increasing effect.

!Example text source
{{{
((te(s)t (t(hi)s))!)
}}}
!Example result
((te(s)t (t(hi)s))!)

!Example's Code
{{{
config.formatters.push(
 config.macros.nestedFormatter.getFormatter("paren","\\(","\\)",function(w,s){
 var elem = createTiddlyElement(w.output,"span")
 wikify(s[1],elem,null,w.tiddler);
 elem.style.fontSize = "120%";
}));
}}}
the main difference in how the handler for such a handler function works for a nested formatter is that it has a second arguement {{{strArr}}}. {{{strArr}}} has 3 parts, the original tag {{{opening signifier strArr[0]}}} and the middle test {{{what is between the signifiers strArr[1]}}} and the ending tag {{{ending signifier strArr[2]}}}. w.matchText will return the entire string match from the first openning signifier to the last closing signifier {{{inclusive}}}.

!todo
*restructure the code so that wikify is not called because it is such a heavy function call.
*handle improper formatting nicely.
*allow for capturing/bubbling style handler calls.

***/

//{{{
config.macros.nestedFormatter = {};
config.macros.nestedFormatter.getFormatter = function(fname, openTag, closeTag, formattingHandler){
var formatterResult = {};
formatterResult.name = fname;
formatterResult.match = openTag;
formatterResult.openRegex = new RegExp(openTag,"m");
formatterResult.closeRegex = new RegExp(closeTag,"m");
formatterResult.handler = function(w){
 var testString = w.source.substring(w.matchStart+w.matchLength);
 var strArr = [w.source.substring(w.matchStart,w.matchStart+w.matchLength)];
 var depth = 1;
var off = w.matchLength;
var index = true;var endex = true;
 while(depth > 0 && (index || endex) && testString.length > 0){
 index = this.openRegex.exec(testString);
 endex = this.closeRegex.exec(testString);
 //Found New Opening
 if(index && endex && index.index < endex.index)
 {
 depth++;
 off+=index.index+index[0].length;
 testString = testString.substring(index[0].length+index.index);
 }
 else if(!index || endex.index < index.index)
 {
 depth--;
 off+=endex.index+endex[0].length;
 testString = testString.substring(endex[0].length+endex.index);
 }
 }
 if(depth != 0){
 createTiddlyText(w.output,w.matchText);
 }
 else{
 w.matchText = w.source.substring(w.matchStart,w.matchStart+off);
strArr.push(w.matchText.substring(strArr[0].length,w.matchText.length-endex[0].length));
strArr.push(endex[0]);
 w.matchLength = w.matchText.length;
 w.nextMatch = w.matchStart + w.matchLength;
 formattingHandler(w,strArr);
 }
};
return formatterResult;
}
//}}}