/***
| Name:|Clock2|
| Author:|Simon Baird|
| Description:|A skinnable, sizeable analog clock|
| Source:|http://tiddlyspot.com/mptw/#Clock2|
| Requires:|Firefox 1.5.x or maybe Safari|
| Version:|1.0.6|
| Date:|8-Jul-2008|
!!Note
* Does not work in IE or Opera due to lack of canvas support.
* If you make a nice skin send it to me and I will include it here.
*I'm not actively maintaining this plugin
* See also http://randomibis.com/coolclock/
!!Ideas
* Can we support IE with this? http://sourceforge.net/projects/excanvas
* Skin should specify order of drawing so things can be on top of other things
* Fix it so we can have filled and/or stroked elements
* Skin should allow any number of moving and static elements
* Make download and example for non-TW use
* Make floating draggable?
!!Examples
{{{
<<clock2 fancy>><<clock2 120>>
<<clock2 chunkySwiss>> <<clock2 60 chunkySwiss noSeconds>><<clock2 '{
	outerBorder: { lineWidth: 60, radius:55, color: "#dd8877", alpha: 1 },
	smallIndicator: { lineWidth: 4, startAt: 80, endAt: 95, color: "white", alpha: 1 },
	largeIndicator: { lineWidth: 12, startAt: 77, endAt: 89, color: "#dd8877", alpha: 1 },
	hourHand: { lineWidth: 15, startAt: -15, endAt: 50, color: "white", alpha: 1 },
	minuteHand: { lineWidth: 10, startAt: 24, endAt: 200, color: "#771100", alpha: 0.6 },
	secondHand: { lineWidth: 3, startAt: 22, endAt: 83, color: "green", alpha: 0 },
	secondDecoration: { lineWidth: 1, startAt: 52, radius: 26, fillColor: "white", color: "red", alpha: 0.2 }
}'>>

}}}
<<clock2 fancy>><<clock2 120>>
<<clock2 chunkySwiss>> <<clock2 60 chunkySwiss noSeconds>><<clock2 '{
	outerBorder: { lineWidth: 60, radius:55, color: "#dd8877", alpha: 1 },
	smallIndicator: { lineWidth: 4, startAt: 80, endAt: 95, color: "white", alpha: 1 },
	largeIndicator: { lineWidth: 12, startAt: 77, endAt: 89, color: "#dd8877", alpha: 1 },
	hourHand: { lineWidth: 15, startAt: -15, endAt: 50, color: "white", alpha: 1 },
	minuteHand: { lineWidth: 10, startAt: 24, endAt: 200, color: "#771100", alpha: 0.6 },
	secondHand: { lineWidth: 3, startAt: 22, endAt: 83, color: "green", alpha: 0 },
	secondDecoration: { lineWidth: 1, startAt: 52, radius: 26, fillColor: "white", color: "red", alpha: 0.2 }
}'>>

See also BigClock.
!!Code
***/
//{{{

window.CoolClock = function(canvasId,displayRadius,skinId,showSecondHand) {
	return this.init(canvasId,displayRadius,skinId,showSecondHand);
}

CoolClock.config = {
	clockTracker: {},
	tickDelay: 1000,
	longTickDelay: 15000,
	defaultRadius: 85,
	renderRadius: 100,
	defaultSkin: "swissRail",
	skins:	{
		// try making your own...
		swissRail: {
			outerBorder: { lineWidth: 1, radius:95, color: "black", alpha: 1 },
			smallIndicator: { lineWidth: 2, startAt: 89, endAt: 93, color: "black", alpha: 1 },
			largeIndicator: { lineWidth: 4, startAt: 80, endAt: 93, color: "black", alpha: 1 },
			hourHand: { lineWidth: 8, startAt: -15, endAt: 50, color: "black", alpha: 1 },
			minuteHand: { lineWidth: 7, startAt: -15, endAt: 75, color: "black", alpha: 1 },
			secondHand: { lineWidth: 1, startAt: -20, endAt: 85, color: "red", alpha: 1 },
			secondDecoration: { lineWidth: 1, startAt: 70, radius: 4, fillColor: "red", color: "red", alpha: 1 }
		},
		chunkySwiss: {
			outerBorder: { lineWidth: 5, radius:97, color: "black", alpha: 1 },
			smallIndicator: { lineWidth: 4, startAt: 89, endAt: 93, color: "black", alpha: 1 },
			largeIndicator: { lineWidth: 8, startAt: 80, endAt: 93, color: "black", alpha: 1 },
			hourHand: { lineWidth: 12, startAt: -15, endAt: 60, color: "black", alpha: 1 },
			minuteHand: { lineWidth: 10, startAt: -15, endAt: 85, color: "black", alpha: 1 },
			secondHand: { lineWidth: 4, startAt: -20, endAt: 85, color: "red", alpha: 1 },
			secondDecoration: { lineWidth: 2, startAt: 70, radius: 8, fillColor: "red", color: "red", alpha: 1 }
		},
		fancy: {
			outerBorder: { lineWidth: 5, radius:95, color: "green", alpha: 0.7 },
			smallIndicator: { lineWidth: 1, startAt: 80, endAt: 93, color: "black", alpha: 0.4 },
			largeIndicator: { lineWidth: 1, startAt: 30, endAt: 93, color: "black", alpha: 0.5 },
			hourHand: { lineWidth: 8, startAt: -15, endAt: 50, color: "blue", alpha: 0.7 },
			minuteHand: { lineWidth: 7, startAt: -15, endAt: 92, color: "red", alpha: 0.7 },
			secondHand: { lineWidth: 10, startAt: 80, endAt: 85, color: "blue", alpha: 0.3 },
			secondDecoration: { lineWidth: 1, startAt: 30, radius: 50, fillColor: "blue", color: "red", alpha: 0.15 }
		}
	}
};

CoolClock.prototype = {
	init: function(canvasId,displayRadius,skinId,showSecondHand) {
		this.canvasId = canvasId;
		this.displayRadius = displayRadius || CoolClock.config.defaultRadius;
		this.skinId = skinId || CoolClock.config.defaultSkin;
		this.showSecondHand = typeof showSecondHand == "boolean" ? showSecondHand : true;
		this.tickDelay = CoolClock.config[ this.showSecondHand ? "tickDelay" : "longTickDelay"];

		this.canvas = document.getElementById(canvasId);
		this.canvas.setAttribute("width",this.displayRadius*2);
		this.canvas.setAttribute("height",this.displayRadius*2);

		this.renderRadius = CoolClock.config.renderRadius; 

		var scale = this.displayRadius / this.renderRadius;
		this.ctx = this.canvas.getContext("2d");
		this.ctx.scale(scale,scale);

		CoolClock.config.clockTracker[canvasId] = this;
		this.tick();
		return this;
	},

	fullCircle: function(skin) {
		this.fullCircleAt(this.renderRadius,this.renderRadius,skin);
	},

	fullCircleAt: function(x,y,skin) {
		with (this.ctx) {
			save();
			globalAlpha = skin.alpha;
			lineWidth = skin.lineWidth;
			if (!document.all)
				beginPath();
			arc(x, y, skin.radius, 0, 2*Math.PI, false);
			if (skin.fillColor) {
				fillStyle = skin.fillColor
				fill();
			}
			else {
				// XXX why not stroke and fill
				strokeStyle = skin.color;
				stroke();
			}
			restore();
		}
	},

	radialLineAtAngle: function(angleFraction,skin) {
		with (this.ctx) {
			save();
			translate(this.renderRadius,this.renderRadius);
			rotate(Math.PI * (2 * angleFraction - 0.5));
			globalAlpha = skin.alpha;
			strokeStyle = skin.color;
			lineWidth = skin.lineWidth;
			if (skin.radius) {
				this.fullCircleAt(skin.startAt,0,skin)
			}
			else {
				beginPath();
				moveTo(skin.startAt,0)
				lineTo(skin.endAt,0);
				stroke();
			}
			restore();
		}
	},

	render: function(hour,min,sec) {
		var skin = CoolClock.config.skins[this.skinId];
		this.ctx.clearRect(0,0,this.renderRadius*2,this.renderRadius*2);

		this.fullCircle(skin.outerBorder);

		for (var i=0;i<60;i++)
			this.radialLineAtAngle(i/60,skin[ i%5 ? "smallIndicator" : "largeIndicator"]);
				
		this.radialLineAtAngle((hour+min/60)/12,skin.hourHand);
		this.radialLineAtAngle((min+sec/60)/60,skin.minuteHand);
		if (this.showSecondHand) {
			this.radialLineAtAngle(sec/60,skin.secondHand);
			this.radialLineAtAngle(sec/60,skin.secondDecoration);
		}
	},


	nextTick: function() {
		setTimeout("CoolClock.config.clockTracker['"+this.canvasId+"'].tick()",this.tickDelay);
	},

	stillHere: function() {
		return document.getElementById(this.canvasId) != null;
	},

	refreshDisplay: function() {
		var now = new Date();
		this.render(now.getHours(),now.getMinutes(),now.getSeconds());
	},

	tick: function() {
		if (this.stillHere()) {
			this.refreshDisplay()
			this.nextTick();
		}
	}
}



config.macros.clock2 = {
	counter: 0,
	handler: function (place,macroName,params,wikifier,paramString,tiddler) {
		var size,skin,seconds,skinData;
		for (var i=0;i<params.length;i++)
			if (/^\d+$/.exec(params[i]))
				size = params[i];
			else if (params[i] == "noSeconds")
				seconds = false;
			else if (/^\{/.exec(params[i]))
				eval("skinData = " + params[i]);
			else
				skin = params[i];
		if (skinData) {
			CoolClock.config.skins.customSkin = skinData;
			skin = "customSkin";
		}
		var canvas = createTiddlyElement(place,"canvas","clockcanvas"+this.counter);
		var clock = new CoolClock("clockcanvas"+this.counter,size,skin,seconds);
		this.counter++;
	}
}

//}}}
