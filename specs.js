var customMatchers = {
    "toBeWithinPrecision": function () {
        return {
            compare: function (actual, expected, precision) {

                if (typeof precision == "number") {
                    precision = [precision]
                } else if (!Array.isArray(precision) || !precision.length) {
                    precision = [.005]
                }
                var d = Math.abs(expected - actual).toFixed(16);

                var upper = Math.abs(precision[0]);
                var lower = Math.abs(precision[1] || precision[0]);
                return {
                    pass: ( expected == actual )
                       || ( expected > actual && d <= upper )
                       || ( expected < actual && d <= lower )

                }
            }
        };
    }
};

beforeEach(function () {
    jasmine.addMatchers(customMatchers)
});

describe("randomColors.parseRGB", function () {
    it("called with no arg gives null", function () {
        expect($().randomColors("parseRGB")).toBeNull();
    })
    it("called with 0 gives null", function () {
        expect($().randomColors("parseRGB", 0)).toBeNull();
    })
    it("called with {} gives null", function () {
        expect($().randomColors("parseRGB", 0)).toBeNull();
    })
    it("called with null gives null", function () {
        expect($().randomColors("parseRGB", null)).toBeNull();
    })
    it("called with empty gives null", function () {
        expect($().randomColors("parseRGB", "")).toBeNull();
    })
    it("called with transparent gives null", function () {
        expect($().randomColors("parseRGB", "transparent")).toBeNull();
    })
    it("called with rgb(1,1,1) gives { r: 1, g: 1, b: 1, a: 1 }", function () {
        expect($().randomColors("parseRGB", "rgb(1,1,1)")).toEqual({r: 1, g: 1, b: 1, a: 1});
    })
    it("called with rgba(1,1,1,1) gives { r: 1, g: 1, b: 1, a: 1 }", function () {
        expect($().randomColors("parseRGB", "rgba(1,1,1,1)")).toEqual({r: 1, g: 1, b: 1, a: 1});
    })
})

describe("randomColors.getRandom", function () {
    it("called with no arg gives between 0 and 1", function () {
        expect($().randomColors("getRandom")).toBeWithinPrecision(.5, .5);
    })
    it("called with 1 gives number between 1 and 2", function () {
        expect($().randomColors("getRandom", 1)).toBeWithinPrecision(1.5, .5);
    })
    it("called with 1,1 gives 1", function () {
        expect($().randomColors("getRandom", 1, 1)).toBe(1);
    })
    it("called with 1,1.1 within 1.05,.05", function () {
        expect($().randomColors("getRandom", 1, 1.1)).toBeWithinPrecision(1.05, .05);
    })
})


describe("randomColors.toRGB", function () {
    it("called with no arg gives null", function () {
        expect($().randomColors("toRGB")).toBeNull();
    })
    it("called with { r: 1, g: 1, b: 1 } gives rgba(1,1,1,1)", function () {
        expect($().randomColors("toRGB", {r: 1, g: 1, b: 1})).toEqual("rgba(1,1,1,1)");
    })
    it("called with { r: 1, g: 1, b: 1, a: 1 } gives rgba(1,1,1,1)", function () {
        expect($().randomColors("toRGB", {r: 1, g: 1, b: 1, a: 1})).toEqual("rgba(1,1,1,1)");
    })
})


describe("randomColors.cleanupColors", function () {
    it("called with no arg gives 0", function () {
        expect($().randomColors("cleanupColors")).toBe(0);
    })
    it("called with {} gives { r: 0, g: 0, b: 0, a: 1 }", function () {
        expect($().randomColors("cleanupColors", {})).toEqual({r: 0, g: 0, b: 0, a: 1});
    })
    it("called with #A gives 170", function () {
        expect($().randomColors("cleanupColors", "#A")).toBe(170);
    })
    it("called with #AA gives 170", function () {
        expect($().randomColors("cleanupColors", "#AA")).toBe(170);
    })
    it("called with #A (alpha) gives 2/3", function () {
        expect($().randomColors("cleanupColors", "#A", true)).toBe(2 / 3);
    })
    it("called with #AA (alpha) gives 2/3", function () {
        expect($().randomColors("cleanupColors", "#AA", true)).toBe(2 / 3);
    })
    it("called with #ACD (RGB) gives {r:170, g:204, b: 221, a:1}", function () {
        expect($().randomColors("cleanupColors", "#ACD")).toEqual({r: 170, g: 204, b: 221, a: 1});
    })
    it("called with #AACCDD (RGB) gives {r:170, g:204, b: 221, a:1}", function () {
        expect($().randomColors("cleanupColors", "#AACCDD")).toEqual({r: 170, g: 204, b: 221, a: 1});
    })
    it("called with #9ACD (ARGB) gives {r:170, g:204, b: 221, a:.6}", function () {
        expect($().randomColors("cleanupColors", "#9ACD")).toEqual({r: 170, g: 204, b: 221, a: .6});
    })
    it("called with #99AACCDD (ARGB) gives {r:170, g:204, b: 221, a:.6}", function () {
        expect($().randomColors("cleanupColors", "#99AACCDD")).toEqual({r: 170, g: 204, b: 221, a: .6});
    })
    it("called with 170 gives 170", function () {
        expect($().randomColors("cleanupColors", 170)).toBe(170);
    })
    it("called with 170 (alpha) gives 1", function () {
        expect($().randomColors("cleanupColors", 170, true)).toBe(1);
    })

    it("called with {r: -1, g: -1, b: -1, a: -.6} (alpha) gives {r: 0, g: 0, b: 0, a: 0}", function () {
        expect($().randomColors("cleanupColors", {r: -1, g: -1, b: -1, a: -.6}))
            .toEqual({r: 0, g: 0, b: 0, a: 0});
    })

    it("called with {r: 256, g: 256, b: 256, a: 1.1} gives {r: 255, g: 255, b: 255, a: 1}", function () {
        expect($().randomColors("cleanupColors", {r: 256, g: 256, b: 256, a: 1.1}))
            .toEqual({r: 255, g: 255, b: 255, a: 1});
    })

    it("called with rgb(255,0,0) gives {r: 255, g: 0, b: 0, a: 1}", function () {
        expect($().randomColors("cleanupColors", "rgb(255,0,0)"))
            .toEqual({r: 255, g: 0, b: 0, a: 1});

    })
    it("called with rgba(255,0,0,1) gives {r: 255, g: 0, b: 0, a: 1}", function () {
        expect($().randomColors("cleanupColors", "rgba(255,0,0,1)"))
            .toEqual({r: 255, g: 0, b: 0, a: 1});

    })
    it("called with rgba(0,0,0,0) gives {r: 0, g: 0, b: 0, a: 0}", function () {
        expect($().randomColors("cleanupColors", "rgba(0,0,0,0)"))
            .toEqual({r: 0, g: 0, b: 0, a: 0});
    })
    it("called with rgba(0,0,0,0) gives {r: 0, g: 0, b: 0, a: 0}", function () {
        expect($().randomColors("cleanupColors", "rgba(0,0,0,0)"))
            .toEqual({r: 0, g: 0, b: 0, a: 0});
    })

    it("called with {r: '0', g:'0', b:'0', a:'0'} gives {r: 0, g: 0, b: 0, a: 0}", function () {
        expect($().randomColors("cleanupColors", {r: "0", g: "0", b: "0", a: "0"}))
            .toEqual({r: 0, g: 0, b: 0, a: 0});
    })
    it("called with {r: '#0', g:'#0', b:'#0', a:'#0'} gives {r: 0, g: 0, b: 0, a: 0}", function () {
        expect($().randomColors("cleanupColors", {r: "#0", g: "#0", b: "#0", a: "#0"}))
            .toEqual({r: 0, g: 0, b: 0, a: 0});
    })
    it("called with {r: '22', g: '33', b: '44', a: '.2'} gives {r: 22, g: 33, b: 44, a:.2}", function () {
        expect($().randomColors("cleanupColors", {r: "22", g: "33", b: "44", a: ".2"}))
            .toEqual({r: 22, g: 33, b: 44, a: .2});
    })
    it("called with {r: '#22', g:'#33', b:'#44', a:'#55'} gives {r: 34, g: 51, b: 68, a:1/3}", function () {
        expect($().randomColors("cleanupColors", {r: "#22", g: "#33", b: "#44", a: "#55"}))
            .toEqual({r: 34, g: 51, b: 68, a: 1 / 3});
    })

    it("called with transparent gives color with {a:0}", function () {
        expect($().randomColors("cleanupColors", "transparent", true).a).toBe(0);
    })

    it("called with red gives a red color", function () {
        var red = $().randomColors("cleanupColors", "red")
        expect(red.r).toBeGreaterThan(127);
        expect(red.g).toBeLessThan(127);
        expect(red.b).toBeLessThan(127);
        expect(red.a).toBe(1);
    })
    it("called with green gives a green color", function () {
        var green = $().randomColors("cleanupColors", "green")
        expect(green.g).toBeGreaterThan(127);
        expect(green.r).toBeLessThan(127);
        expect(green.b).toBeLessThan(127);
        expect(green.a).toBe(1);
    })
    it("called with blue gives a blue color", function () {
        var blue = $().randomColors("cleanupColors", "blue")
        //describe("hi")
        expect(blue.b).toBeGreaterThan(127);
        expect(blue.r).toBeLessThan(127);
        expect(blue.g).toBeLessThan(127);
        expect(blue.a).toBe(1);
    })
})

describe("randomColor", function() {
	it("randomColor is rgb(95, 0, 255, [0.3,0.4])", function() {
	var div1 = $("<div>");
	$("body").append(div1);
		div1.randomColors("randomColor", {colors:{r:95, g:0, b:255, a:[0.3,0.4]}});
		var bg = div1.randomColors("parseRGB", div1.css("backgroundColor"));
		expect(bg.r).toBe(95)
		expect(bg.g).toBe(0)
		expect(bg.b).toBe(255)
		expect(bg.a).toBeWithinPrecision(.35,.05)
	})
	it("randomColor is rgb([120,125], 0, 255, 1)", function() {
	var div1 = $("<div>");
	$("body").append(div1);
		div1.randomColors("randomColor", {colors:{r:[130,140], g:0, b:255, a:1}});
		var bg = div1.randomColors("parseRGB", div1.css("backgroundColor"));

		expect(bg.r).toBeWithinPrecision(130,[0,10])
		expect(bg.g).toBe(0)
		expect(bg.b).toBe(255)
		expect(bg.a).toBe(1)		
	})
})


describe("toBeWithinPrecision()", function () {

    it("some basic reference checks on toBeWithinPrecision precision", function () {
        expect(0.5).toBeWithinPrecision(.5);
        expect(0.495).toBeWithinPrecision(.5);
        expect(0.494).not.toBeWithinPrecision(.5);
        expect(0.505).toBeWithinPrecision(.5);
        expect(0.506).not.toBeWithinPrecision(.5);

        expect(0.5).toBeWithinPrecision(.5, []);
        expect(0.495).toBeWithinPrecision(.5, []);
        expect(0.494).not.toBeWithinPrecision(.5, []);
        expect(0.505).toBeWithinPrecision(.5, []);
        expect(0.506).not.toBeWithinPrecision(.5, []);

        expect(0.5).toBeWithinPrecision(.5, 0);
        expect(0.45).toBeWithinPrecision(.5,.05);
        expect(0.449).not.toBeWithinPrecision(.5, .05);
        expect(0.501).toBeWithinPrecision(.5, .001);
        expect(0.5011).not.toBeWithinPrecision(.5, .001);

        expect(0.1).toBeWithinPrecision(.5, [.5, .1]);
        expect(0.8).not.toBeWithinPrecision(.5, [.5, .1]);
        expect(0.1).not.toBeWithinPrecision(.5, [.1, .5]);
        expect(0.8).toBeWithinPrecision(.5, [.1, .5]);
    })
})
