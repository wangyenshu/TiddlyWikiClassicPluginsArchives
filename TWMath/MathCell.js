/***
<code>
/***
MATHCELL SPREADSHEET
Written by Bradley Meck

***/
config.macros.MathCell = {
	caretPosition: function(element){
		var selelected, range, r2, collapsed = false, i=-1;
		if(typeof element.selectionStart=="number") {
			i=element.selectionStart;
			if(element.selectionStart == element.selectionEnd){collapsed = true};
		}
		else if(document.selection && element.createTextRange) {
			selelected=document.selection;
			if(selelected){
				r2=selelected.createRange();
				if(r2.text.length == 0){collapsed = true;}
				range=element.createTextRange();
				range.setEndPoint("EndToStart", r2);
				i=range.text.length;
			}
		}
		else {
			el.onkeyup=null;
			el.onclick=null;
		}
		return [i,collapsed];
	},
	functions: {
		"PI(": function(){return Math.PI;},
		"E(": function(){return Math.E;},
		"cell(": function(text,cell){
			var parts = text.split(",");
			var size = cell.parentNode.parentNode.className.split(" ");
			parts[0] = config.macros.MathCell.parseMath(parts[0]);
			parts[1] = config.macros.MathCell.parseMath(parts[1]);

			//RULES FOR INVALID CELLS
			if(parts.find(NaN) || // INVALID NUMBER
				parts.length < 2 || // NOT ENOUGH PARAMS
				parts[0] > Number(size[1]) || // NOT A BIG ENOUGH SPREADSHEET
				parts[0] < 1 ||
				parts[1] > Number(size[2]) || 
				parts[1] < 1 ||
				cell == cell.parentNode.parentNode.childNodes[parts[1]].childNodes[parts[0]]){ // CELL IS THIS CELL
				displayMessage("improper cell "+text);
				return NaN;
			}
			//alert("valid cell")
			return cell.parentNode.parentNode.childNodes[parts[1]].childNodes[parts[0]].value;
		},
		"max(": function(text){
			var parts = text.split(",");
			return Math.max(config.macros.MathCell.parseMath(parts[0]),config.macros.MathCell.parseMath(parts[1]));
		},
		"min(": function(text){
			var parts = text.split(",");
			return Math.min(config.macros.MathCell.parseMath(parts[0]),config.macros.MathCell.parseMath(parts[1]));
		},
		"abs(": function(text){
			return Math.abs(config.macros.MathCell.parseMath(text));
		},
		"ceil(": function(text){
			return Math.ceil(config.macros.MathCell.parseMath(text));
		},
		"floor(": function(text){
			return Math.floor(config.macros.MathCell.parseMath(text));
		},
		"round(": function(text){
			return Math.round(config.macros.MathCell.parseMath(text));
		},
		"rand(": function(){
			return Math.random();
		},
		"exp(": function(text){
			return Math.exp(config.macros.MathCell.parseMath(text));
		},
		"sqrt(": function(text){
			return Math.sqrt(config.macros.MathCell.parseMath(text));
		},
		"log(": function(text){
			var parts = text.split(",");
			//Change of base formula
			return Math.log(config.macros.MathCell.parseMath(parts[1])) / Math.log(config.macros.MathCell.parseMath(parts[0]));
		},
		"sin(": function(text){
			return Math.sin(config.macros.MathCell.parseMath(text));
		},
		"cos(": function(text){
			return Math.cos(config.macros.MathCell.parseMath(text));
		},
		"tan(": function(text){
			return Math.tan(config.macros.MathCell.parseMath(text));
		},
		"(": function(text){
			if(text.length == 0) displayMessage("improper math expression");
			return config.macros.MathCell.parseMath(text);
		}
	},
	handler: function(place,macroName,params){
		var row = createTiddlyElement(place,"div");
			createTiddlyButton(row,"save","save spreadsheet data as a tiddler",function(){
				var str = "";
				for(var i = 1; i < this.parentNode.nextSibling.childNodes.length; i++){
					for(var j = 1; j < this.parentNode.nextSibling.childNodes[i].childNodes.length; j++){
						str += this.parentNode.nextSibling.childNodes[i].childNodes[j].title.replace("\\","\\\\").replace(",","\\,")+",";
						}str += "\n";
				}
				var tiddler = prompt("save to which tiddler?");
				store.saveTiddler(tiddler,tiddler,str,config.options.txtUserName,new Date(),["spreadsheet"]);
				return false;
			});
			createTiddlyButton(row,"load","save spreadsheet data as a tiddler",function(){
				var tiddler = store.getTiddler(prompt("load which tiddler?"));
				var rows = tiddler.text.split("\n");
				for(var i = 0; i < rows.length; i++){
					var cells = rows[i].split(",");
					for(var j = 0; j < cells.length-1; j++){
						if(j < cells.length -2 && cells[j].match(/\\{1,1}$/)){
							cells.splice(j,2,cells[j]+","+cells[j+1]); j--;
						}
						cells[j] = cells[j].replace(/\\,/g,",").replace(/\\\\/g,"\\");
						this.parentNode.nextSibling.childNodes[i+1].childNodes[j+1].title = cells[j];
						this.parentNode.nextSibling.childNodes[i+1].childNodes[j+1].focus();
						this.parentNode.nextSibling.childNodes[i+1].childNodes[j+1].blur();
					}rows[i] = cells;
				}
				return false;
			});
		var place = createTiddlyElement(place,"form",null,("mathCellContainer "+params[0]+" "+params[1]));
		row = createTiddlyElement(place,"div");
		var i = document.createElement("input");
		i.type = "text";
		i.className = "MathCellButton";
		i.readOnly = true;
		row.appendChild(i);
		for(var j = 1; j <= Number(params[1]); j++){
			var i = document.createElement("input");
			i.type = "text";
			var letters = j;
			var string = "";
			while(letters >= 26){
				string = String.fromCharCode(65+(letters % 26)) + string;
				letters = Math.floor(letters / 26);
			}
			string = String.fromCharCode(65+((letters-1) % 26)) + string;
			i.value = string;
			i.className = "MathCellButton";
			i.readOnly = true;
			row.appendChild(i);
		}
		for(var i = 1; i <= Number(params[0]); i++){
			row = createTiddlyElement(place,"div");
			if(i % 2 == 0) row.className = "evenRow"; 
			else row.className = "oddRow"; 

			var j = document.createElement("input");
			j.type = "text";
			j.value = i;
			j.className = "MathCellButton";
			j.readOnly = true;
			row.appendChild(j);

			for(var j = 0; j < Number(params[1]); j++){
				var cell = document.createElement('input');
				cell.type = 'text';
				cell.className = "unselected";
				cell.title = "";
				cell.onkeydown = function(event){
					if(!event) var event = window.event;
					var caret = config.macros.MathCell.caretPosition(this)
					switch(event.keyCode){
						case 37:
							if(this.previousSibling && this.previousSibling.previousSibling
								&& this.previousSibling.tagName == "INPUT" && caret[1] && caret[0] == 0)
								this.previousSibling.focus();
							break;
						case 39:
							if(this.nextSibling && this.nextSibling .tagName == "INPUT"
								&& caret[1] && caret[0] == this.value.length)
								this.nextSibling .focus();
							break;
						case 38:
							if(this.parentNode.previousSibling.previousSibling){
								var elem = this;
								var i = 0;
								while((elem = elem.previousSibling)){
									i++;
								}
								if(this.parentNode.previousSibling.childNodes[i].tagName == "INPUT"){
									this.parentNode.previousSibling.childNodes[i].focus();
								}
							}
							break;
						case 40:
							if(this.parentNode.nextSibling){
								var elem = this;
								var i = 0;
								while((elem = elem.previousSibling)){
									i++;
								}
								if(this.parentNode.nextSibling.childNodes[i].tagName == "INPUT"){
									this.parentNode.nextSibling.childNodes[i].focus();
								}
							}
							break;
						return false;
					}
				};
				cell.onfocus = function(){
					this.value = this.title;
					this.className = "selected";
					return false;
				}
				cell.onblur = function(){
					this.title = this.value;
					this.className = "unselected";
					if(this.value.charAt(0) == "'"){
						this.value = this.value.substr(1);
						this.className += " unformatted"
						return;
					}
					if(this.value.charAt(0) == "="){

					/*SEPERATE PARETHESIS WITH FUNCTION NAMES CELL ABBREVIATIONS AND OTHER*/
					var parts = this.value.replace(/\s+/g,"").match(/(?:[a-zA-Z][a-zA-Z0-9]*[\(]|[\(]|[\)]|[0-9\+\-\/\*\^\!\^\%\.\,\:]+|[A-Z]+[0-9]+)/g);


					// DEBUG WITH THIS BEFORE MESSING WITH THE CODE! FOR THE LOVE OF ALL THAT IS HOLY!
					//alert(parts.join("\n"));


					if(parts){
						for(var i = 0; i < parts.length; i++){
						/*HANDLE [A-Z]+[0-9]+ CELL ABBREVIATIONS*/
							if(parts[i].match(/^[A-Z]+[0-9+]$/) && parts[i].indexOf("(") == -1){
								var gobehind = i;var size = 1;var result = "",getRow,number = 0,letters;
								if(i > 0 && !parts[i-1].match(/[\(]/)){
									size ++;
									result = parts[--gobehind];
									if(!parts[gobehind].match(/[\+\-\^\%\*\/][\s]*$/)){result += "*";}
								}
								getRow = parts[i].match(/[0-9]+/)[0];
								if(getRow == "0"){
									break;
								}
								getRow = this.parentNode.parentNode.childNodes[getRow];
								letters = parts[i].match(/[A-Z]+/)[0];
								for(var j = 0; j < letters.length; j++){
									number += (letters.charCodeAt(j) -64)*(Math.pow(26,letters.length-1-j));
								}
								if(getRow.childNodes[number] == this){
									displayMessage("cannot reference self node "+parts[i]);
									return;
								}
								result += getRow.childNodes[number].value;
								if(i < parts.length -1 && parts[i+1] != ")"){
									result += parts[gobehind+(++size)-1];
								}
								i--;
								parts.splice(gobehind,size,result);
							}
						}

						/*HANDLE PARENTHESIS AND FUNCTION CALLS*/

						var index;

						//SHOULD CHANGE THIS TO A FOR LOOP TO IMPROVE PERFOMANCE
						while(parts.length > 1 && (index = parts.find(")")) != null){
							if(index > 0){
								parts[index-1] = parts[index-1].toString();
								if(!parts[index-1].match(/[\(]/) && config.macros.MathCell.functions[parts[index-2]]){							
parts.splice(index-2,3,config.macros.MathCell.functions[parts[index-2]](parts[--index],this));
								}
								else if(config.macros.MathCell.functions[parts[index-1]]){
									parts.splice(index-1,2,config.macros.MathCell.functions[parts[index-1]]("",this));
								}
								else{
									displayMessage("function used in equation does not exist");
									displayMessage("error: malformed mathCell equation.");
									displayMessage("index : "+index);
									return;
								}
								if(index < parts.length && !parts[index].match(/[\)\(]/)){
									if(!parts[index].toString().match(/^[\s]*[\)\*\/\+\-\%\^\!]/))
										parts[index] = "*"+parts[index]
									parts.splice(index-1,2,parts[index-1]+parts[index--]);;
								}
								if(index > 1 &&!parts[index-2].toString().match(/[\(]/) && !parts[index-2].toString().match(/[\+\-\^\%\*\/][\s]*$/) && index <= parts.length){
										parts.splice(index-2,2,parts[index-2]+"*"+parts[index-1]);
								}
							}
							else{
								displayMessage("parenthesis do not match up.");
								displayMessage("error: malformed mathCell equation.");
								return;
							}
						}
						var result = config.macros.MathCell.parseMath(parts.join(""));
						if(!isNaN(result))
							this.value = result;
						else{

							displayMessage("error: malformed mathCell equation.");
						}
						return false;
						}
					}
				}
				row.appendChild(cell);
			}
		}
	},
	parseMath: function(equation){

		// find all the special characters
		var parts = equation.replace(/e([\+\-]*[0-9\.]+)/,"* 10 ^ $1").replace(/\s/g,""), operator;
		if(parts.match(/[a-zA-Z]/g)){return NaN;}
		parts = parts.match(/(?:[\+\-\/\*\^\!\%]|[0-9\.]+)/g);
		if(!parts || parts.length == 0) return "";
		//deal with leading negative problem
		if(parts[0] == "-" && parts.length > 1){
			parts.splice(0,2,parts[0]+parts[1]);
		}
		//factorials
		for(var i = 1; i < parts.length; i++){
			if(parts[i] == "!"){
				var number = 1;
				for(var j = parts[i-1]; j > 0; j--){
					number = number * j;
				}
				parts.splice(operator-1,2,number);
			}
		}
		//exponents
		for(var i = 1; i < parts.length-1; i++){
			if(parts[i] == "^"){
				var power = parts[i+1];
				var size = 3;
				if(power == "-" || power == "+"){
					size++;
					power = Number(parts[i+2]) * Number(power+"1");
				}
				parts.splice(--i,size,Math.pow(Number(parts[i]),Number(power)));
			}
		}
		//multiplication division modulus
		for(var i = 1; i < parts.length; i++){
			if(parts[i] == "*"){
				var multiplicand = parts[i+1];
				var size = 3;
				if(multiplicand == "-" || multiplicand == "+"){
					size++;
					multiplicand= Number(parts[i+2]) * Number(multiplicand+"1");
				}
				parts.splice(--i,size,Number(parts[i])*Number(multiplicand));
			}
			if(parts[i] == "/"){
				var denominator = parts[i+1];
				var size = 3;
				if(denominator == "-" || denominator == "+"){
					size++;
					denominator = Number(parts[i+2]) * Number(denominator +"1");
				}
				parts.splice(--i,size,Number(parts[i])/Number(denominator));
			}
			if(parts[i] == "%"){
				var denominator = parts[i+1];
				var size = 3;
				if(denominator == "-" || denominator == "+"){
					size++;
					denominator = Number(parts[i+2]) * Number(denominator +"1");
				}
				parts.splice(--i,size,Number(parts[i])%Number(denominator));
			}
		}
		//ADDITION AND SUBTRACTION
		for(var i = 1; i < parts.length; i++){
//alert(i+"\n"+parts[i]+"\n"+parts); // For Debugging
			if(parts[i] == "+"){
				var multiplicand = parts[i+1];
				var size = 3;
				if(multiplicand == "-" || multiplicand == "+"){
					size++;
					multiplicand= Number(parts[i+2]) * Number(multiplicand+"1");
				}
				parts.splice(--i,size,Number(parts[i])+Number(multiplicand));
			}
			if(parts[i] == "-"){
				var multiplicand = parts[i+1];
				var size = 3;
				if(multiplicand == "-" || multiplicand == "+"){
					size++;
					multiplicand= Number(parts[i+2]) * Number(multiplicand+"1");
				}
				parts.splice(--i,size,Number(parts[i])-Number(multiplicand));
			}
		}
		return Number(parts[0]); // there could be a space after it so only take the first number, plus it needs to be taken out of the array
	}
}
/***
</code>
***/