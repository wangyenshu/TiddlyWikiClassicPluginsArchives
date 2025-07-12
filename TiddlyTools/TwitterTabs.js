/%
!legal
|Name|TwitterTabs|
|Source|http://www.TiddlyTools.com/#TwitterTabs|
|Version|2.0.1|
|Author|Eric Shulman|
|License|http://www.TiddlyTools.com/#LegalStatements|
|~CoreVersion|2.1|
|Type|transclusion|
|Description|Find recent tweets by keyword or username and show results in tabs|
!end
- - - - - DO NOT EDIT ABOVE THIS LINE - - - - -


- - - - - TABSET SECTION - - - - -
!tabset
<<tabs txtTwitterTabs
'find...'		'find tweets containing...'	[[TwitterTabs##search]]
'from...'		'show tweets from...'		[[TwitterTabs##user]]
'tiddlytools'		'show tweets from @tiddlytools'	[[TwitterTabs##tiddlytools]]
'jermolene'		'show tweets from @jermolene'	[[TwitterTabs##jermolene]]
'TwitterTabsInfo'	'documentation for TwitterTabs' [[TwitterTabs##info]]
>>
!tiddlytools
<<tiddler [[TwitterTabs##showUserResults]] with: tiddlytools>>
!jermolene
<<tiddler [[TwitterTabs##showUserResults]] with: jermolene>>
!end

- - - - - TWEETFORMAT SECTION - - - - -
reminder: %0=image, %1=name, %2=text, %3=timestamp
!tweetformat
@@font-size:8pt;display:block;line-height:110%;
~~[<img[%0]]''[[%1|http://twitter.com/%1]] //%3//:''~~
 %2 {{tagClear{
}}}@@
!end


- - - - - DO NOT EDIT BELOW THIS LINE - - - - -
!info
<<tiddler TwitterTabs##legal>>Usage
<<<
{{{
<<tiddler TwitterTabs>>
}}}
<<<
Configuration
<<<
Copy TwitterTabs into your document. Then, ''edit the tiddler to suit your preferences'' by adding/removing definitions from the ''tabset'' and related sections:<<tiddler TwitterTabs##showcode with: tabset>><<tiddler TwitterTabs##showcode with: tiddlytools>><<tiddler TwitterTabs##showcode with: jermolene>>You can also customize the appearance of the individual tweets by editing the ''tweetformat'' section, which uses //replacement markers// to insert values extracted from each tweet returned by Twitter's search results, where ''%0=user image, %1=user name, %2=tweet content,'' and ''%3=tweet timestamp''<<tiddler TwitterTabs##showcode with: tweetformat>>The most recently entered 'find... and 'from... search terms are automatically saved as TiddlyWiki cookie-based option values.  You can override these values by placing the following statements into a tiddler tagged with 'systemConfig'.  Each time you reload your document, the default inputs will be reset to these hard-coded values, rather than using the last value entered.
{{{
config.options["txtTweetSearch"]="search text";
config.options["txtTweetUser"]="username";
}}}
!showcode
<<tiddler TwitterTabs##out with: {{'!$1\n'+store.getTiddlerText('TwitterTabs##$1').replace(/\n\}\}\}/g,'\n}\}\}')}}>>
!out
{{{
$1
}}}
!end

!search
<<tiddler [[TwitterTabs##showSearchForm]] with: {{config.options.txtTweetSearch||'TiddlyWiki'}}>>
!user
<<tiddler [[TwitterTabs##showUserForm]] with: {{config.options.txtTweetUser||'TiddlyWiki'}}>>
!end

!showSearchForm
{{small smallform{
search for tweets containing: <<option {{config.options.txtTweetSearch='$1';'txtTweetSearch'}}>><html>
<nowiki><input type='button' value='search' onclick="
	var target=this.parentNode.parentNode.parentNode;
	var out='\<\<tiddler [[TwitterTabs##showSearchForm]] with: {{config.options.txtTweetSearch}}\>\>';
	removeChildren(target); wikify(out,target); return false;
"></html>@@display:block;white-space:normal;<<tiddler [[TwitterTabs##showSearchResults]]
	with: {{config.options.txtTweetSearch}}>>@@}}}
!end

!showUserForm
{{small smallform{
show tweets from: <<option {{config.options.txtTweetUser='$1';'txtTweetUser'}}>><html>
<nowiki><input type='button' value='search' onclick="
	var target=this.parentNode.parentNode.parentNode;
	var out='\<\<tiddler [[TwitterTabs##showUserForm]] with: {{config.options.txtTweetUser}}\>\>';
	removeChildren(target); wikify(out,target); return false;
"></html>@@display:block;white-space:normal;<<tiddler [[TwitterTabs##showUserResults]]
	with: {{config.options.txtTweetUser}}>>@@}}}
!end

!showSearchResults
<<tiddler TwitterTabs##callback>>{{toolbar{<html><a href='javascript:;' onclick="
	var target=this.parentNode.parentNode.parentNode;
	var out='<<tiddler [[TwitterTabs##showSearchResults]] with: [[$1]]>>';
	removeChildren(target); wikify(out,target); return false;
">refresh</a><nowiki></html>}}}~~__[[Recent tweets about: "$1"|http://search.twitter.com/search?q=$1]]__~~
<hr>@@display:block;height:20em;overflow:auto;<<tiddler {{
	window.twitterPlace=null;
'';}}>><<tiddler {{
	if (!window.twitterPlace) { window.twitterPlace=place;
		place.innerHTML='connecting to twitter.com...';
		var s=document.createElement("script");
		s.src="http://search.twitter.com/search.json?q=$1&rpp=25&callback=twitterCallback";
		document.body.appendChild(s);
		document.body.removeChild(s);
	}
'';}}>>@@@@display:block;text-align:right;^^scroll for more...^^@@
!end

!showUserResults
<<tiddler TwitterTabs##callback>>{{toolbar{<html><a href='javascript:;' onclick="
	var target=this.parentNode.parentNode.parentNode;
	var out='<<tiddler [[TwitterTabs##showUserResults]] with: [[$1]]>>';
	removeChildren(target); wikify(out,target); return false;
">refresh</a><nowiki></html>}}}~~__[[Recent tweets from $1|http://twitter.com/$1]]__~~
<hr>@@display:block;height:20em;overflow:auto;<<tiddler {{
	window.twitterPlace=null;
'';}}>><<tiddler {{
	if (!window.twitterPlace) { window.twitterPlace=place;
		place.innerHTML='connecting to twitter.com...';
		var s=document.createElement("script");
		s.src="http://twitter.com/statuses/user_timeline/$1.json?callback=twitterCallback";
		document.body.appendChild(s);
		document.body.removeChild(s);
	}
'';}}>>@@@@display:block;text-align:right;^^scroll for more...^^@@
!end

!callback
<<tiddler {{
window.twitterCallback=function(data){ // data object returned from twitter.com
	var fmt=store.getTiddlerText('TwitterTabs##tweetformat');
	if (data.results) data=data.results; // for SEARCH results
	removeChildren(window.twitterPlace);
	for (var i=0; i<data.length; i++) { var item=data[i];
		var img=item.user? item.user.profile_image_url : item.profile_image_url;
		var who=item.user? item.user.screen_name : item.from_user;
		wikify(fmt.format([img,who,item.text,item.created_at]),window.twitterPlace);
	}
}
'';}}>>
!end

%/<<tiddler {{tiddler&&tiddler.title=='TwitterTabs'?'HideTiddlerBackground':''}}>>/%
%/<<tiddler {{tiddler&&tiddler.title=='TwitterTabs'?'HideTiddlerTags':''}}>>/%
%/<<tiddler TwitterTabs##tabset>>