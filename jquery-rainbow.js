  /***************************************************************
   *
   * rainbow jQuery plugin v1.1
   *
   * $("div").randomColors([options]);
   * default options:
   *    	css:{ height: "1em" },
   *    	timeout:800 ,
   *    	mode:'default', // 'swap'
   *    	sequence:{
   *			randomize:false
   *		//	fwd:true,
   *		//  tolerance: .1,
   *		//	parts: ["r","g", "b"];
   *		},
   *    	elements:3,
   *    	initialize:true,
   *    	ascending:false, //|true|undefined
   *    	colors:{r:[122,255], g:[122,255], b:[122,255], a:[1,1]}
   *
   * ======
   *
   * $("div").randomColors("randomColor", [options]);
   * default options:
   *     timeout:0,
   *		colors:{r:[0,255], g:[0,255], b:[0,255], a:[1,1]},
   *		css:{},
   *		backgroundColor:true, // color, border[(Left,Bottom,Right,Top)]Color, outlineColor
   *		nextColor:methods.nextColor
   *
   *
   * $("div").randomColors("stop");
   * $("div").randomColors("resume");
   * $("div").randomColors("toggleRunning");
   * $("#id").randomColors("running");
   *
   * call any method using $().randomColors("method-name", arguments/options):
   * e.g.  alert($().randomColors("toRGB", {r:100,g:33,b:23})); // prints rgba(100,33,23,1)
   *
   *
   ***************************************************************
   *
   * Copyright 2015 Marco Glur
   * Open source under MIT license
   *
   ***************************************************************/


(function($){

$.rgba=true;

$.fn.randomColors=function(method) {
	
$.extend({
	doTimed:function(timeout, run) {
		return setTimeout(run, timeout);
	}
});

	var methods = {

	  getRandom:function(min, max ) {
		if (min == null) min = 0
		if (max == null) max = min+1
		if ( min > max ) {
			return methods.getRandom(max,min)
		}
		if ( min == max ) {
			return min
		}
		return Math.max(min, Math.min(max, min + ( Math.random() * ( max-min ) ) ) )
	  },
		// Deprecated
		GetRandom: this.getRandom,

	  cleanupColors:function(colors, isA) {
		if ($.isArray(colors) && colors.length == 2) {
	  		colors = [methods.cleanupColors(colors[0], isA),
			  		  methods.cleanupColors(colors[1], isA)];


		} else if (typeof colors === "object") {
	  		colors.r = methods.cleanupColors(colors.r);
	  		colors.g = methods.cleanupColors(colors.g);
	  		colors.b = methods.cleanupColors(colors.b);
	  		colors.a = methods.cleanupColors(colors.a, true);


	  	} else if (typeof colors === "string") {
	  		var match = colors.match(/^#([a-f0-9][a-f0-9]*)$/i);
	  		if (match && match[1]) {
				var hex = match[1];
				if (1 == hex.length) {
					hex = hex + "" + hex;
				}
				switch (hex.length) {
					case 1:
						colors = parseInt(hex, 16)*(isA?1/255:1)
						colors += 16*colors
						break
					case 2:
						colors = parseInt(hex, 16)*(isA?1/255:1)
						break
					case 3:
						colors = methods.cleanupColors(
							{r:"#"+hex.substr(0,1),
							 g:"#"+hex.substr(1,1),
							 b:"#"+hex.substr(2,1)})
						break
					case 6:
						colors = methods.cleanupColors(
							{r:"#"+hex.substr(0,2),
							 g:"#"+hex.substr(2,2),
							 b:"#"+hex.substr(4,2)})
						break
					case 4:
						colors = methods.cleanupColors(
							{r:"#"+hex.substr(1,1),
							 g:"#"+hex.substr(2,1),
							 b:"#"+hex.substr(3,1),
							 a:"#"+hex.substr(0,1)})
						break
					case 8:
						colors = methods.cleanupColors(
							{r:"#"+hex.substr(2,2),
							 g:"#"+hex.substr(4,2),
							 b:"#"+hex.substr(6,2),
							 a:"#"+hex.substr(0,2)})
				}
	  		}
			else if (!isA && !isNaN(parseInt(colors))) {
				colors = parseInt(colors)
			} else if (isA && !isNaN(parseFloat(colors))) {
				colors = parseFloat(colors)
			} else {
				if ("transparent" == colors)
					colors = "rgba(0,0,0,0)"

				var parsed = methods.parseRGB(colors)
				if (parsed) {
					colors = parsed
				} else if (typeof getComputedStyle == "function") {
					var n = $("<color>").css("color", colors)
					colors = methods.parseRGB(getComputedStyle(n.appendTo($("body"))[0]).color)
					n.remove()
				} else {
					colors = isA ? 1 : 0;
				}
			}


	  	} else if (typeof colors === "number") {
			if (isNaN(colors)) {
				colors = isA?1:0;
			}
	  		if (colors > 255) {
	  			colors = 255;
	  		} else if (colors < 0) {
	  			colors = 0;
	  		}
			if (isA && colors > 1) {
 				colors = 1;
 			} else if (!isA) {
 				colors = Math.round(colors);
 			}

	  	} else {
			colors = isA?1:0;
	  	}
	  	return colors;
	  },
	  checkRange: function(fwd, val, clr) {
			if (fwd) {
				if (val > clr[1]) {
					return false;
				}
			} else {
				if (val < clr[0]) {
					return false;
				}	  	
			}
			return true;
	  },
	  stop:function() {
		  return this.each(function(){
			$(this).data("stop", true);
		  });
	  },
	  resume:function() {
		  return this.each(function(){
			$(this).data("stop", false);
		  });
	  },
	  running:function(){
		return !(true===$(this).data("stop"));
	  },
	  toggleRunning:function() {
	  return this.each(function(){
	  	var $this = $(this);
	  	if ($this.randomColors("running")) {
	  		$this.randomColors("stop");
	  	} else {
	  		$this.randomColors("resume");
	  	}
	  });
	  },
	  nextColor: function(options) {
	
	  var sequence,settings,previous,current,color;

	  	settings = {"sequence":{tolerance:0.1,
					  					randomize:false}};
	  	$.extend(true,settings, options);
		sequence = settings.sequence;
		
		if (!(settings.ascending === undefined)) {
			previous=(!settings.ascending)?this.next():this.prev();
		} else {
			previous = this;
		}
		
	  	if (previous.length === 0 || settings.mode==="swap") {
	  		previous = this[0];
		} else {
			previous = previous[0];
		}
		
		if (!$(previous).data("rcContext")) {
			this.data("rcContext",{currentParts:[]});
		} else {
		  	this.data("rcContext", $(previous).data("rcContext"));
		}
	  	
		current = null;
		color = null;
		
		if ((!sequence.randomize) && settings.mode!="swap") {
			current = $(previous).css("backgroundColor");
			current = ( (!current) && !/rgb/.exec(current) )?null:current;
			if (current) {
				var p = methods.parseRGB(current);
				if (p && !p.a) {
					current = null
				}
			}
	  	}
	  	if (current) {
			color = current;
		}
		if (sequence.randomize || settings.mode==="swap" || (!current)) {
			if (settings.startColor && (!current)) {
				color = settings.startColor;
			} else {
				var r = function(p, isA) {
					if ($.isArray(p)) {
						p = methods.getRandom(p[0], p[1])
						if (true!=isA)
							p = Math.round(p)
					}
					return p
				}
				color = methods.toRGB({ r:r(settings.colors.r),
										g:r(settings.colors.g),
										b:r(settings.colors.b),
										a:r(settings.colors.a, true)});
			}
		} else {
			color = current;
			// 1. match rgb
			var parts = methods.parseRGB(color);
			parts = methods.nextParts(parts, $.extend(settings, {rc:this.data("rcContext")}));

			color = methods.toRGB( parts );
		}
		return color;

	  },
	
	  // options.rc is IN/OUT if supplied by caller!!
	  nextParts:function(parts, options) {
	  	var sequence = {fwd:true, flat:false, parts:false, randomize:true, step:20};
	  	var settings = {
	  		colors:{r:[0,255],g:[0,255],b:[0,255], a:1},
	  		rc:{currentParts:[]}};
	  	
	  	
	  	
	  	if (options) {
		  	if (options.sequence) {
			  	$.extend(sequence,
	  				options.sequence);
	  		}
	  		if (options.step > 0) {
	  			sequence.step = options.step;
	  		}
	  		$.extend(settings, options, {sequence:sequence});
			sequence = settings.sequence;

		} else {
			settings = {sequence: sequence};
		}
		
	  	var p = settings.rc.currentParts;
		
	  	var clr = settings.colors;
	  	
		if (settings.rc.rev) {
			sequence.fwd =!sequence.fwd;
		}
	  	

		if (sequence.parts) {
			if (typeof sequence.parts === "string") {
				sequence.parts = [sequence.parts];
			}
			
	  	} else {
			sequence.parts = ["r", "g", "b"];
		}
		
		var validParts = [];
		$(sequence.parts).each(function(i,v){
			if (clr[v][0]!=clr[v][1]) {
				validParts[validParts.length]=v;
			}
		});
		sequence.parts = validParts;
		
		var sqParts = sequence.parts;

	  	if (sqParts.length > 1 && sequence.randomize) {
	  		sqParts = [sqParts[methods.getRandom(0, sqParts.length)]];
	  	} else {
	  	    if (sequence.flat) {
	  	    	sqParts = p;
	  	    } else if (p.length > 0) {
	  	    	$(p).each(function(i,v) {
					var val = parts[v];
					if (sequence.flat && i>0) {
						return;
					}
					if ( !methods.checkRange( sequence.fwd, val+((sequence.fwd?1:-1)*sequence.step), clr[v] ) ) {
					   // next part
					   var x = $.inArray(v,sqParts) + p.length;
					    if (x>=sqParts.length) {
					    	x = x - sqParts.length;
					    }
					    if (p[i] == sqParts[x] || sequence.flat) {
					    	settings.rc.rev =!settings.rc.rev;
					    	sequence.fwd =!sequence.fwd;
					    } else {
		  	    			p[i] = sqParts[x];
		  	    		}
					}
	  	    	});
	  	    	sqParts = p;
	  	    } else {
	  	    	p[0] = sqParts[0];
	  	    }
	  	    if (p.length > 0 && p[0] == null) {
                //all
                p.length = 0;
                $.extend(p, sqParts);

	  	    } else {
    	  	  sqParts = p;
    	  	}
		}
		
	  	var ret = $.extend({}, parts);
	  	$(sqParts).each(function(i) {
	  		var part = sqParts[i];
	  		if (!parts) {
	  			parts = {part:part=="a"?1:0};
	  		}
	  		var current = parts[part]?parts[part]:(part=="a"?1:0);
	  		ret[part]=methods.nextPart($.extend({},
	  									settings.sequence,
	  									{	value: current,
											part: part}));
															
			// reverse colors
			if (sequence.parts.length > sqParts.length) {
				$(sequence.parts).each(function(i, v) {
					if (jQuery.inArray(v, sqParts)==-1) {
	  					current = parts[v]?parts[v]:(part=="a"?1:0);
						ret[v]=methods.nextPart($.extend({},
												settings.sequence,
												{	fwd:!sequence.fwd,
													colors:settings.colors,
													value: current,
													part: v}));
					}
				});
			}
			
	  	});
	  	return ret;
	  },
	    		
	  makeRange: function(current, part, settings) {
		var min=0, max=("a"===part?1:255);
		if (settings.colors && settings.colors[part]) {
			var colors = settings.colors[part];
			min = (colors[0]?colors[0]:min);
			max = (colors[1]?colors[1]:max);
		}
		if (max < current) {
			current = max;
		}
		if (min > current) {
			current = min;
		}
		if (current < 0) {
			current = 0;
		}
		return current;
	  },
	  nextPart:function(options){
	  	var settings = {fwd:true, tolerance:0, step:20};

	  	if (options) {
	  		$.extend(settings, options);
		}

	  	var part = settings.part;
	  	var f = 0;
	  	if (settings.tolerance && settings.tolerance>0) {
	  		if (settings.tolerance > 1) {
	  		  settings.tolerance=.5;
	  		}
	  		if ("a"!=part) {
	  			f = settings.step*settings.tolerance;
	  			if (f > 0 ) {
					f = methods.getRandom(Math.floor(f*-1),
										  Math.ceil(f));
				}
			} else {
				// TODO
				return settings.value;
			}

	  	}
  		var current = settings.value + ( (settings.step + f) * (settings.fwd?1: -1) );

  		current = methods.makeRange(current, part, settings);

  		return current;
	  },
	  toRGB:function(parts) {
		  if (null == parts) {return null}
		  if (typeof parts != "object") {return null}
			if ($.rgba) {
				color = "rgba("+ Math.abs(Math.floor(parts.r))
							  +","+Math.abs(Math.floor(parts.g))
							  +","+Math.abs(Math.floor(parts.b))
							  +","+(parts.a?parts.a:1) +")";
			} else {
				color = "rgb("+ Math.abs(Math.floor(parts.r))
							  +","+Math.abs(Math.floor(parts.g))
							  +","+Math.abs(Math.floor(parts.b)) +")";
			
			}
			return color;
	  },
	  parseRGB:function(rgba) {
		if (null == rgba) {return null}
		if (typeof rgba != "string") {return null}
	  	var parts = rgba.match(/([0-9]{1,3})\D*([0-9]{1,3})\D*([0-9]{1,3})\D*([01]?\.?[\d]*)/)
	  	
		if (parts && parts[1] && parts[2] && parts[3]) {
			var parts = {r:parseInt(parts[1]), g:parseInt(parts[2]), b:parseInt(parts[3]), a:parts[4]?parseFloat(parts[4]):1};
			return parts;
		}
		return null;
	  },
	  randomColor:function(options){
	    var settings = {timeout:0 ,
	    				colors:{r:[0,255], g:[0,255], b:[0,255], a:[1,1]},
	    				css:{},
	    				backgroundColor:true,
	    				nextColor:methods.nextColor};
	
		if ( options ) {
			$.extend( settings, options );
		}

		return this.each(function() {
			$this = $(this);

			if (1 <= settings.timeout) {
				var toThis = $this;
				$.doTimed(settings.timeout, function(){
					toThis.randomColors("randomColor",settings);
				});
		    }

			if ($this.randomColors("running")) {
				settings.colors = methods.cleanupColors(settings.colors);
				$this.css(settings.css);
				var color = settings.nextColor.apply( $this, [settings] );
				$(["backgroundColor", "color", "borderRightColor", "borderLeftColor", "borderTopColor", "borderBottomColor", "borderColor", "outlineColor"]).each(function(i,v)  {
					if (settings[v]) {$this.css(v, color);}
				});
			}
		});
	  },
	  randomColors:function(options) {
	    var settings = {
	    	css:{ height: "1em" },
	    	timeout:800 ,
	    	mode:'default',
	    	sequence:{randomize:false},
	    	elements:3,
	    	intialize:true,
	    	ascending:false,
	    	colors:{r:[122,255], g:[122,255], b:[122,255], a:[1,1]}
	    };
	
		if ( options ) {
			$.extend( settings, options );
		}
		
		return this.each(function() {
			var $this = $(this);
			
			if (1 <= settings.timeout) {
			 var toThis = $this;
			 $.doTimed(settings.timeout, function() {
				toThis.randomColors(settings);
			 });
		    }
			
			if ($this.randomColors("running")) {
			
				var rSettings = $.extend({}, settings, { timeout:0 });
		
				var newDiv =$("<div ></div>");
				if (settings.ascending) {
					newDiv.appendTo($this);
					if ($this.children().size() > settings.elements) {
						$this.children().first().remove();
					}
				} else {
					newDiv.prependTo($this);
					if ($this.children().size() > settings.elements) {
						$this.children().last().remove();
					}
				}
				newDiv.randomColors('randomColor', rSettings);
				
				if (settings.mode == "swap") {
					$this.children("div").each(function() {
						$(this).randomColors("randomColor", rSettings);
					});
				}
				
				if ((settings.intialize || settings.timeout<=0) && $this.children().length < settings.elements) {
				// recursive call until complete
					$this.randomColors($.extend({}, options, {timeout:0}));

				}
			}
			
		});
	  }
	};
	if (methods[method]) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.randomColors.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.randomColors' );
    }
};

})(jQuery);
