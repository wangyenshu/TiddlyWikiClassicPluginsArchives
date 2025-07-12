//{{{
config.formatters.push( {
	name: "customClasses",
	match: "{{",
	lookahead: "{{[\\s]*([\\w]+[\\s\\w]*)[\\s]*{((?:[^}]|(?:}(?!}))|(?:}}(?!})))*)}}}",
	handler: function(w){
		var lookaheadRegExp = new RegExp(this.lookahead,"mg");
		lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = lookaheadRegExp.exec(w.source);
		var p = createTiddlyElement(w.output,"span",null,lookaheadMatch[1]);
		wikify( lookaheadMatch[2], p, null, w.tiddler);
		w.nextMatch = lookaheadMatch.index + lookaheadMatch[0].length;
	}
});

config.formatters.push( {
	name: "customClasses2",
	match: "{div{",
	lookahead: "{div{[\\s]*([\\w]+[\\s\\w]*)[\\s]*{((?:[^}]|(?:}(?!}))|(?:}}(?!})))*)}}}",
	handler: function(w){
		var lookaheadRegExp = new RegExp(this.lookahead,"mg");
		lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = lookaheadRegExp.exec(w.source);
		var p = createTiddlyElement(w.output,"div",null,lookaheadMatch[1]);
		wikify( lookaheadMatch[2], p, null, w.tiddler);
		w.nextMatch = lookaheadMatch.index + lookaheadMatch[0].length;
	}
});


//}}}