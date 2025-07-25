// //''Name:'' EmailLink
// //''Author:'' AlanHecht
// //''Type:'' [[Macro|Macros]]

// //''Description:'' email lets you list a "email" address without displaying it as readable text. This helps prevent your email address from being harvested by search engines and other web crawlers that read your page's contents. Using email, you type in the words "at" and "dot" instead of the punctuation symbols and add spaces inbetween words to disguise your address. However, email will display your email address in a web browser so that humans can read it. And email turns the address into a hyperlink that can be clicked to send you an instant email.

// //''Syntax:'' << {{{email yourname at yourdomain dot com "?optional parameters"}}} >>
// //Example 1: <<linkTo email ? sample at nowhere dot com>> (standard)
// //Example 2: <<linkTo email ? sample at nowhere dot com "?subject=Submission&body=Type your message here.">> (with optional parameters)

// //''Directions:'' <<tiddler MacroDirections>>

// //''Notes:'' You can use the optional email parameters to stipulate a subject or message body for the message. Most (not all) email clients will use this information to construct the email message.

// //''Related Links:'' none

// //''Revision History:''
// // v0.1.0 (20 July 2005): initial release
// // v0.1.1 (22 July 2005): renamed the macro from "mailto" to "email" to further thwart email harvesters.

// //''Code section:''
version.extensions.linkTo = {major: 0, minor: 1, revision: 1, date: new Date("Jul 22, 2005")};
config.macros.linkTo = {}
config.macros.linkTo.handler = function(place,macroName,params)
{
var temp = params.join(" ");
var data = temp.split("?");
var protocol =  data[0].replace(/\s/g,"");
if(protocol=='email') protocol = "ma"+"il"+"to:";
else if(protocol=='phone') protocol = "s"+"ip:";
var recipient = data[1];
recipient = recipient.replace(" at ","@").replace(" dot ",".");
recipient = recipient.replace(/\s/g,"");
var optional = data[2] ? "?" + data[2] : "";
var theLink = createExternalLink(place,protocol+recipient+optional);
theLink.appendChild(document.createTextNode(recipient))
}
