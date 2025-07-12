/***
|Name|FlickrGreetingMacro|
|Created by|PeterKirkland|
|Version|1.0.1|
|Requires|~TW2.x|
!Description
It replicates the random greeting messages from
[[Flickr|http://www.flickr.com/]] in a TiddlyWiki macro.

!History
* 25-Mar-06, version 1.0.1, couple of tweaks by SimonBaird
** added flickrGreetingCookie
** made WelcomeMessage into array literal
** removed ! since I wanted "Hola and welcome to..."
* 24-Mar-06, version 1.0.0, first version

!Examples
|!Source|!Output|h
|{{{<<flickrGreeting>>}}}|<<flickrGreeting>>|
|{{{<<flickrGreetingCookie>>}}}|<<flickrGreetingCookie>>|
|{{{<<flickrGreeting Peter>>}}}|<<flickrGreeting Peter>>|
|{{{<<flickrGreeting 'Peter Kirkland'>>}}}|<<flickrGreeting 'Peter Kirkland'>>|
(You can use (single or double) quotes or double square brackets for
params with spaces)

!Notes
*I created this to re-create the international greetings that Flickr uses.
*I use it in a tiddler linked to my DefaultTiddlers to get a pleasant welcome message!
*To make the macro work you have to give this tiddler a tag of systemConfig then save and reload.
*Thanks to Simon Baird for his HelloWorldMacro which taught me how to use macros, and also for his [[MonkeyPirateTiddlyWiki|http://simonbaird.com/mptw/]]!

!Code
***/
//{{{

// this part is not actually required but useful to other people using your plugin
version.extensions.FlickrGreetingMacro = { major: 1, minor: 0, revision: 1, date: new Date(2006,3,24) };

config.macros.flickrGreetingCookie = {};
config.macros.flickrGreetingCookie.handler = function (place,name,params) {
    wikify("<<flickrGreeting " + config.options.txtUserName + ">>", place);
}

config.macros.flickrGreeting = {};
config.macros.flickrGreeting.handler = function (place,name,params) {
       //List of greetings:
       var WelcomeMessage = [
              "Hola",
              "Hala",
              "Shalom",
              "Ni hao",
              "Kumusta",
              "'Allo",
              "G'day",
              "Hoi",
              "Giorno",
              "Hi",
              "Hej",
              "Olá",
              "Ahoy",
              "Salut",
              "Hello",
              "Hoi",
              "Oi",
              "Hoi",
              "Aloha",
              "Bonjour",
              "Guten Tag",
              "Yo",
              "Shalom",
              "Namaste",
              "Ciao"
       ];
       //randomness:
       var index = Math.floor(Math.random() * WelcomeMessage.length);
       //output:
       var who = params.length > 0 ? (" "+params[0]) : "";
       wikify(WelcomeMessage[index] + who /* + "!" */, place);
}

//}}}
