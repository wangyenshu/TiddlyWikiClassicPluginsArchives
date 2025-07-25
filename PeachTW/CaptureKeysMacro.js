/***
| Name:|CaptureKeysMacro|
| Purpose:|Makes an easy way to capture a key and stop the browser from doing its default action|
| Creator:|BradleyMeck|
| Ideas:|BradleyMeck & SaqImtiaz|
| Source:|http://tiddlyspot.com/BradleyMeck/#CaptureKeysMacro|
| Requires:|Javascript|
| Version|1.0 (July 24, 2006)|

!History
** First release
!Usage
config.macros.captureKey(object,handler,keyCode,SHIFT,ALT,CTRL);
|''object''|Where (element, document, etc.) to try to capture the event at (useful because of stopPropagation).|
|''handler''|Function to execute when this key is captured.|
|''keyCode''|The keyCode to execute this function if this key is depressed.|
|''SHIFT''|Should the Shift key be depressed when this event occurs?|
|''ALT''|Should the Alt key be depressed when this event occurs?|
|''CTRL''|Should the Ctrl key be depressed when this event occurs?|
!Notes
|If something changes the element's onkeydown/press handlers and the browser does not support addEventListener or attachEvent, the key capturing will be ruined.|
|Please use the removeCaptureKey function to remove the capture keys if you dont want them to occur anymore, please? However, removing the 'F1' key does not make onhelp work again.|
|config.macros.captureKeys.preventDefault(), config.macros.captureKeys.stopPropagation(), config.macros.captureKeys.getRealKey(event) are good functions to use in other plugins as well|
!Examples
For 'CTRL'+'S' Saving
{{{
config.macros.captureKeys.captureKey(document,saveChanges,"S",false,false,true);
}}}
!Code
!!!Virtual Keyboard
***/
//{{{
config.macros.captureKeys = {};
config.macros.captureKeys.VK = {
/*KEYS ARE MAPPED FROM TOP LEFT TO BOTTOM RIGHT,
THE NAMES ARE TAKEN FROM THE JAVA VK*/
 "ESCAPE": 27,
 "F1": 112,
 "F2": 113,
 "F3": 114,
 "F4": 115,
 "F5": 116,
 "F6": 117,
 "F7": 118,
 "F8": 119,
 "F9": 120,
 "F10": 121,
 "F11": 122,
 "F12": 123,
 "PRINT_SCREEN": 44,
 "SCROLL_LOCK": 145,
 "PAUSE": 19,
 "BACK_QUOTE": 192,
 "1": 49,
 "2": 50,
 "3": 51,
 "4": 52,
 "5": 53,
 "6": 54,
 "7": 55,
 "8": 56,
 "9": 57,
 "0": 48,
 "MINUS": 109,
 "EQUALS": 61,
 "BACKSPACE": 8,
 "INSERT": 45,
 "HOME": 36,
 "PAGE_UP": 33,
 "NUM_LOCK": 144,
 "NUMPADDIVIDE": 111,
 "MULTIPLY": 106,
 "NUMPADMINUS": 109,
 "TAB": 9,
 "Q": 81,
 "W": 87,
 "E": 69,
 "R": 82,
 "T": 84,
 "Y": 89,
 "U": 85,
 "I": 73,
 "O": 79,
 "P": 80,
 "OPEN_BRACKET": 219,
 "CLOSE_BRACKET": 221,
 "BACK_SLASH": 220,
 "DELETE": 46,
 "END": 35,
 "PAGE_DOWN": 34,
 "NUMPAD7": 103,
 "NUMPAD8": 104,
 "NUMPAD9": 105,
 "PLUS": 107,
 "CAPS_LOCK": 20,
 "A": 65,
 "S": 83,
 "D": 68,
 "F": 70,
 "G": 71,
 "H": 72,
 "J": 74,
 "K": 75,
 "L": 76,
 "SEMICOLON": 59,
 "QUOTE": 222,
 "ENTER": 13,
 "NUMPAD4": 100,
 "NUMPAD5": 101,
 "NUMPAD6": 102,
 "SHIFT": 16,
 "Z": 90,
 "X": 88,
 "C": 67,
 "V": 86,
 "B": 66,
 "N": 78,
 "M": 77,
 "COMMA": 188,
 "PERIOD": 190,
 "DIVIDE": 191,
 "UP": 38,
 "NUMPAD1": 97,
 "NUMPAD2": 98,
 "NUMPAD3": 99,
 "CONTROL": 17,
 "ALT": 18,
 "SPACE": 32,
 "LEFT": 37,
 "DOWN": 40,
 "RIGHT": 39,
 "NUMPAD0": 96,
 "NUMPADPERIOD": 110
}
config.macros.captureKeys.UNICodeToAsciiVK = 
{
 33 : 49,
 34 : 222,
 35 : 51,
 36 : 52,
 37 : 53,
 38 : 55,
 39 : 222,
 40 : 57,
 41 : 48,
 42 : 56,
 43 : 61,
 44 :188,
 45 :109,
 46 :190,
 47 :191,
 48 : 96,
 49 : 97,
 50 : 98,
 51 : 99,
 52 :100,
 53 :101,
 54 :102,
 55 :103,
 56 :104,
 57 :105,
 58 : 59,
 60 :188,
 62 :190,
 63 :191,
 64 : 50,
 91 :219,
 92 :220,
 93 :221,
 94 : 54,
 95 :109,
 96 :192, 
 97 : 65,
 98 : 66,
 99 : 67,
 100: 68,
 101: 69,
 102: 70,
 103: 71,
 104: 72,
 105: 73,
 106: 74,
 107: 75,
 108: 76,
 109: 77,
 110: 78,
 111: 79,
 112: 80,
 113: 81,
 114: 82,
 115: 83,
 116: 84,
 117: 85,
 118: 86,
 119: 87,
 120: 88,
 121: 89,
 122: 90,
 123:219,
 124:220,
 125:221,
 126:192
}
//}}}
/***
!!!!captureKey function
***/
//{{{
window.captureKey = config.macros.captureKeys.captureKey = function(elem,handler,keyCode,shiftButton,altButton,ctrlButton)
{
 if(!elem.captureKeys)
 {
 elem.captureKeys = [];
 }
 var keyEvent = {};
 keyEvent.key = config.macros.captureKeys.VK[keyCode]?config.macros.captureKeys.VK[keyCode]:keyCode;
 keyEvent.shift = shiftButton;
 keyEvent.alt = altButton;
 keyEvent.ctrl = ctrlButton;
 keyEvent.func = handler; 
 elem.captureKeys.push(keyEvent);
 // IE needs onkeyDown
 // moz needs onkeypress
 if(window.event)
 {
 // For some reason cancelling the f1 keypress doesnt stop it from loading the help?
 if(keyCode == 112){document.onhelp = function(event){if(!event)var event=window.event;config.macros.captureKeys.preventDefault(event)}}
 if(!config.macros.captureKeys.hasEventListener(elem,"keydown",config.macros.captureKeys.captureKeyHandler)){
 config.macros.captureKeys.addEventListener(elem,"keydown",config.macros.captureKeys.captureKeyHandler);}
 }
 else
 {
 if(!config.macros.captureKeys.hasEventListener(elem,"keypress",config.macros.captureKeys.captureKeyHandler))
 config.macros.captureKeys.addEventListener(elem,"keypress",config.macros.captureKeys.captureKeyHandler); 
 }
 return keyEvent;
}
config.macros.captureKeys.captureKeyHandler = function(event)
{
 if(!this.captureKeys)return null;
var keyCode = config.macros.captureKeys.getRealKey(event)
 for(var i = 0; i < this.captureKeys.length; i++)
 {
 if(this.captureKeys[i].key == keyCode && this.captureKeys[i].shift == event.shiftKey && this.captureKeys[i].alt == event.altKey && this.captureKeys[i].ctrl == event.ctrlKey)
 {
 this.captureKeys[i].func.call(this,event);
 config.macros.captureKeys.preventDefault(event);
 }
 }
}
config.macros.captureKeys.getRealKey = function(event)
{
var keyCode = event.keyCode;
if(!keyCode || (keyCode && keyCode == 0))
{
 var unicode=event.which? event.which: event.charCode;
 keyCode = (config.macros.captureKeys.UNICodeToAsciiVK[unicode]?config.macros.captureKeys.UNICodeToAsciiVK[unicode]:unicode);
}
return keyCode;
}
config.macros.captureKeys.removeCaptureKey = function(elem,handler,keyCode,shiftButton,altButton,ctrlButton)
{
 if(!elem.captureKeys)return null;
 for(var i = 0; i < elem.captureKeys.length; i++)
 {
 if(elem.captureKeys[i].key == keyCode && elem.captureKeys[i].shift == shiftButton && elem.captureKeys[i].alt == altButton && elem.captureKeys[i].ctrl == ctrlButton && elem.captureKeys[i].func == handler)
 {
 if(!elem.captureKeys || (elem.captureKeys && elem.captureKeys.length == 1))
 {
 elem.captureKeys = null;
 config.macros.captureKeys.removeEventListener(elem,window.event?"keydown":"keypress",config.macros.captureKeys.captureKeyHandler);
 return false;
 }
 else
 {
 elem.captureKeys.splice(i,1)
 }
 }
 }
}
config.macros.captureKeys.addEventListener = function(target,eventType,func,capturing)
{
 if(!target.eventListeners)
 {
 target.eventListeners = {};
 }
 if(!target.eventListeners[eventType])
 {
 target.eventListeners[eventType] = [];
 }
 if(target.addEventListener)
 {
 target.addEventListener(eventType,func,capturing);
 target.eventListeners[eventType].push(func);
 return func;
 }
 else if(target.attachEvent)
 {
 var handler = function(event)
 {
 if(!event)var event = window.event;
 func.call(target,event);
 };
 handler.originalFunction = func;
 target.attachEvent("on"+eventType,handler);
 target.eventListeners[eventType].push(handler);
 return handler;
 }
 else
 {
 if(target.eventListeners[eventType].length == 0)
 {
 if(target["on"+eventType])
 {
 target.eventListeners[eventType].push(target["on"+eventType]);
 }
 target["on"+eventType] = api.event.standardEventHandler;
 }
 target.eventListeners[eventType].push(func);
 }
}
config.macros.captureKeys.standardEventHandler = function(event)
{
 if(!event)var event = window.event;
 if(!this.eventListeners || !this.eventListeners[event.type])return null;
 for(var i = 0; i < this.eventListeners[event.type].length; i++)
 {
 this.eventListeners[event.type][i].call(this,event);
 }
}
config.macros.captureKeys.removeEventListener = function(target,eventType,func,capturing)
{
 if(!target.eventListeners || !target.eventListeners[eventType])
 {
 return null;
 }
 if(target.removeEventListener)
 {
 target.removeEventListener(eventType,func,capturing);
 target.eventListeners[eventType].splice(target.eventListeners[eventType].indexOf(func),1);
 }
 else if(target.detachEvent)
 {
 var trueFunc = null;
 var i = 0;
 for(; i < target.eventListeners.length; i++)
 {
 if(target.eventListeners[i].originalFunction = func)
 {
 trueFunc = target.eventListeners[i];
 break;
 }
 }
 if(trueFunc)
 {
 target.detachEvent("on"+eventType,trueFunc);
 target.eventListeners[eventType].splice(i,1);
 }
 }
 else
 {
 target.eventListeners[eventType].splice(target.eventListeners[eventType].indexOf(func),1);
 if(target.eventListeners[eventType].length == 0)target["on"+eventType] = null;
 }
 if(target.eventListeners[eventType].length == 0)
 {
 delete target.eventListeners[eventType];
 }
 for(var i in target.eventListeners)
 {
 return;
 }
 target.eventListeners = undefined;
}
config.macros.captureKeys.hasEventListener = function(elem,eventType,func)
{
 if(!elem.eventListeners || !elem.eventListeners[eventType]) return false;
 if(elem.eventListeners[eventType].indexOf(func)!=null)return true;
 return false;
}
config.macros.captureKeys.preventDefault = function(event){
 try
 {
 event.keyCode = 0; // Kills old IE
 }
 catch(exeption)
 {
 }
 if(window.event)
 {
 event.returnValue=false;
 }
 if(event.preventDefault)
 {
 event.preventDefault();
 }
 return event;
}

config.macros.captureKeys.stopPropagation = function(event){
 if(event.cancelBubble)
 {
 event.cancelBubble=false;
 }
 if(event.stopPropagation)
 {
 event.stopPropagation();
 }
 return event;
}
//}}}