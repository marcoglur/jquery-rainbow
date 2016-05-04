# jquery-rainbow
A simple jQuery plugin for colorful animated or static gradients


## `$("div").randomColors([options])`

### Default Options

	css:{ height: "1em" },
	timeout:800 ,
	mode:'default', // 'swap'
	sequence:{
		randomize:false
	//	fwd:true,
	//  tolerance: .1,
	//	parts: ["r","g", "b"];
	},
	elements:3,
	initialize:true,
	ascending:false, //|true|undefined
	colors:{r:[122,255], g:[122,255], b:[122,255], a:1}


## `$("div").randomColors("randomColor", [options])`

### Default Options

	timeout:0,
	colors:{r:[0,255], g:[0,255], b:[0,255], a:1},
	css:{},
	backgroundColor:true, // color, border[(Left,Bottom,Right,Top)]Color, outlineColor
	nextColor:methods.nextColor

## Methods

	$("div").randomColors("stop")
	$("div").randomColors("resume")
	$("div").randomColors("toggleRunning")
	$("#id").randomColors("running")

 call any method using `$().randomColors("method-name", arguments)` e.g.:
 
    alert($().randomColors("toRGB", {r:100,g:33,b:23})) -> prints `rgba(100,33,23,1)


## Demo

Watch the [demo](http://marcoglur.github.io/jquery-rainbow).

## Tests

Run the [test-suite](http://marcoglur.github.io/jquery-rainbow/SpecRunner.html)..
