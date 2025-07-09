/***
|''Name:''|AutoWeavePlugin|
|''Description:''|Automatically adds brackets to nonwikiwords on saving a tiddler.|
|''Version:''|0.1 (March 09, 2007)|
|''Source:''|http://weave.tiddlyspot.com/index.html#AutoWeavePlugin|
|''Author:''|laurence man|
|''[[License]]:''|[[BSD open source license]]|
|''~CoreVersion:''|2.1.0|
|''Browser:''|Tested on: Firefox 2.0; InternetExplorer 6.0|
|''Patched:''|*Don't AutoWeave tiddlers tagged 'admin' <br>*changes [[excludeLists]] by [[admin]] in selected tiddlers<br>*don't AutoWeave when in adminMode|


!Description
Inspired by [[this|http://groups.google.com/group/TiddlyWiki/browse_thread/thread/93b8de752492ddc4/b0608ebb1149578c]] post on the tiddlywiki google group, and with helpful comments by Eric Shulman, this plugin automatically adds enclosing double brackets to nonwikiwords (i.e., auto linking them) on saving a tiddler. This does not affect the usual autolinking of wikiword tiddler titles.

A nonwikiword tiddler title will be double bracketed if it is found in the tiddler text, and if the title does not have any letters or numbers around it.

!Usage
By default only the first occurrence of each nonwikiword title in the text is auto-bracketed. To bracket all occurrences, change the following line in the below code:
{{{
var replaceOnlyFirst = false;
}}}
to
{{{
var replaceOnlyFirst = false;
}}}

You can also specify a list of tiddler titles that you do not want to be auto-bracketed. By default, the name of the tiddler containing the titles to exclude is called {{{noAutoLink}}}. That name can be specified by changing the following line in the code below:
{{{
var excludeThese = "noAutoLink";
}}}
to
{{{
var excludeThese = "whatever you want";
}}}

In your "noAutoTag" tiddler, each line should contain only one tiddler title to exclude from auto-bracketing. Don't add any spaces on that line unless they are in the tiddler title itself. For example:
{{{
montypython
xmas list - 2007
culture of capitalism - notes
}}}

!Problems/Limitations/Notes
* Can't handle tiddler titles with square brackets in them so they're ignored.
* Can choose to autolink only first occurrence of title, but if you edit the tiddler later and add that title into the tiddler text before the first occurrence of the title, it will be bracketed.
* Shadowed tiddlers and tiddlers tagged with "[[excludeLists]]" are not auto-bracketed.

!Code
***/
//{{{
TiddlyWiki.prototype.saveTiddler_weaveLinks =
TiddlyWiki.prototype.saveTiddler;
TiddlyWiki.prototype.saveTiddler =
function(title,newTitle,newBody,modifier,modified,tags)
{
/*
 * BidiX : if mode = admin, no AutoWeave
 */
	if ((config.macros.changeMode) &&  (config.macros.changeMode.currentMode == '') )
		return this.saveTiddler_weaveLinks.apply(this, arguments);	 

 // User settings

 var replaceOnlyFirst = true;
 var excludeThese = "noAutoLink";

    // Don't tag the list of tiddler titles to exclude.
    if (title == excludeThese) 
        return this.saveTiddler_weaveLinks.apply(this, arguments);
	var tagArray = tags.readBracketedList();
	if (tagArray && tagArray.contains('admin'))
		return this.saveTiddler_weaveLinks.apply(this, arguments);


    // Helpers
    // ------------------------------------------------------------------------

    // To sort titles into descending length.
    var compareDescLen = function(a, b)
    {
        if (a.length == b.length) return 0;
        return b.length - a.length;
    }


    var isBounded = function(start, end)
    // [[Test]] if tiddler title has a non-alphanum char (or nothing) on each side.
    // Takes both indices of the title match, along with the title itself.
    {
        var reAlphaNum = new RegExp("\[\A-Za-z0-9\]");
        
        return !(start != 0 && reAlphaNum.test(newBody.substr(start - 1, 1)) ||
                 end != newBody.length - 1 && 
                 reAlphaNum.test( newBody.substr(end + 1, 1)));
    }

    var isBracketed = function(start, end)
    // Is matched string within given indices enclosed in pairs of brackets?
    // Assumes brackets aren't allowed in titles (even tiddler text); 
    // bumping into pair of non-enclosing brackets means string isn't enclosed.
    {
        var foundL = false;
        var foundR = false;
    
        // Start from char just before title up to second char in newBody.
        for (var i = start - 1; i > 0; i--)
        {
            if (newBody.charAt(i) == ']' && newBody.charAt(i - 1) == ']') 
                return false;
            if (newBody.charAt(i) == '[' && newBody.charAt(i - 1) == '[')
            {
                foundL = true;
                break;
            }
        }
        
        // Look from next char after title up to second last char.
        for (var i = end + 1; i < newBody.length - 1; i++)
        {
            if (newBody.charAt(i) == '[' && newBody.charAt(i + 1) == '[') 
                return false;
            if (newBody.charAt(i) == ']' && newBody.charAt(i + 1) == ']')
            {
                foundR = true; 
                break;
            }
        }
        return foundL && foundR;
    }
    
     
    var isNonWikiWord = function(word)
    // No brackets though they're allowed in tiddler titles.
    {
        return (word.indexOf(" ") != -1 ||
               word.search(config.textPrimitives.wikiLink) == -1) &&
               word.indexOf("[") == -1 &&
               word.indexOf("]") == -1;
    }
    
    var isUsrExcluded = function(currTitle)
    // Checks given tiddler title against those in the excluded list.
    {
        if (excludeArr)
        {
            for(var i = 0; i < excludeArr.length; i++)
                if (excludeArr[i] == currTitle) return true;
        }
        return false;
    }


//   var tids = store.getTiddlers("title","excludeLists");
	var tids = store.getTiddlers("title","admin");
    var arr = new Array(tids.length); // Titles to use: to be filtered, sorted.
    var arrLen = 0;                   // Number of titles.
    var matchIdx;                     // Index of a matching title.
    var searchIdx;                     // Searching from this index in newBody.
    var excludeArr;

    var titlesToExclude = store.getTiddlerText(excludeThese);
    
    // split(/\n/) might not be ok with IE?
    if (titlesToExclude) excludeArr = titlesToExclude.split('\n');

    // Filter list of titles.
    for (var i = 0; i < arr.length; i++)
    {
        if (isNonWikiWord(tids[i].title) && !isUsrExcluded(tids[i].title))
        {
            arr[arrLen] = tids[i].title;
            arrLen++;
        }
    }

    arr.sort(compareDescLen);

    // Main loop
    for (var i = 0; i < arrLen; i++)
    {
        searchIdx = 0;      // Start search for title at start of newBody.

        // If a match, replace if not bracketed and if it is free of alphanum
        // on either side. Search again from end of matching title in newBody.
        // Should maybe rewrite this using regexp.exec.

        for ( ; ;)
        {
            matchIdx = newBody.indexOf(arr[i], searchIdx);
            if (matchIdx == -1) break;

            var brackets = isBracketed(matchIdx, matchIdx + arr[i].length - 1);
            if (brackets && replaceOnlyFirst) break;
            
            if (isBounded(matchIdx, matchIdx + arr[i].length - 1, arr[i]) 
                && !brackets)
            {
                newBody = newBody.substring(0, matchIdx) + 
                        "[[" + arr[i] + "]]" + 
                        newBody.substring(matchIdx + arr[i].length);

                if (replaceOnlyFirst) break;
            }
            searchIdx = matchIdx + arr[i].length + 1;
        }
    }

return this.saveTiddler_weaveLinks.apply(this, arguments);
}
//}}}