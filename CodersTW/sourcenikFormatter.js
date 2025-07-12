/***
|Name|sourcenikFormatterPlugin|
|Source|http://coderswiki.jenskillus.de/#sourcenikFormatter|
|Version|0.1.0|
|Author|Jens Killus <jens(dot)killus(at)gmx(dot)de>|
|License|http://www.TiddlyTools.com/#LegalStatements <br>and [[Creative Commons Attribution-ShareAlike 3.0 License|http://creativecommons.org/licenses/by-sa/3.0/]]|
|~CoreVersion|2.1|
|Type|plugin|
|Requires|Alex Gorbatchev's SyntaxHighlighter http://alexgorbatchev.com/SyntaxHighlighter/ <br>Steven Levithan's XRegExp http://xregexp.com/|
|Overrides||
|Description|syntax formatting for PHP, Javascript and other languages inside wiki text|
!!!!!Prerequisites
* make a subdirectory ''formatter'' in the directory where your TiddlyWiki html file is
* download and unpack http://alexgorbatchev.com/SyntaxHighlighter/
* copy directories ''scripts'' + ''styles'' into ''formatter''
* copy non-minified contents of ''src'' into ''formatter/scripts''
* download non-minified http://xregexp.com/ and copy ''xregexp.js'' into ''formatter/scripts''
!!!!!Integrate the formatter with TiddlyWiki
* add to ShadowTiddler ''MarkupPostHead'':
{{{
<script type='text/javascript' src='formatter/scripts/xregexp.js'></script>
<script type='text/javascript' src='formatter/scripts/shCore.js'></script>
<script type='text/javascript' src='formatter/scripts/shBrushBash.js'></script>
<script type='text/javascript' src='formatter/scripts/shBrushJScript.js'></script>
<script type='text/javascript' src='formatter/scripts/shBrushPhp.js'></script>
<script type='text/javascript' src='formatter/scripts/shBrushPlain.js'></script>
<link type='text/css' rel='stylesheet' href='formatter/styles/shCoreDefault.css'/>
}}}
* install this plugin
!!!!!Usage
* wrap your text in ''<nowiki><sourcenik></sourcenik></nowiki>'' tags
* select the highlightner by adding a line like ''<nowiki>##php</nowiki>'' to your text
!!!!!Code
***/
//{{{
version.extensions.SourcenikFormatting = {major: 0, minor: 1, revision: 0, date: new Date(2012, 4, 20)};
config.formatters.push(
  {
    name: 'sourcenikText',
    match: '\'{3}|<sourcenik>',
    lookaheadRegExp: /(?:\'{3}|<sourcenik>)((?:.|\n)*?)(?:\'{3}|<\/sourcenik>)/mg,
    handler: function(w)
    {
      this.lookaheadRegExp.lastIndex = w.matchStart;
      var lookaheadMatch = this.lookaheadRegExp.exec(w.source);
      if(lookaheadMatch && lookaheadMatch.index == w.matchStart) {
        var hil_do = lookaheadMatch[1].match(/##(\w+)/);
        if (hil_do != null) {
          var hil_class = 'brush: ' + hil_do[1] + '; toolbar: false;';
          lookaheadMatch[1] = lookaheadMatch[1].replace(hil_do[0], '');
        } else {
          var hil_class = 'brush: plain; toolbar: false;';
        }
        var hil = createTiddlyElement(w.output,'pre',null,hil_class,lookaheadMatch[1]);
        SyntaxHighlighter.highlight(null, hil);
        w.nextMatch = this.lookaheadRegExp.lastIndex;
      }
    }
  }
);
//}}}