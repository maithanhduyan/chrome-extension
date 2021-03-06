(function() {

    var ERNO = {};
    (function() {
        function a(a, c) {
            c = c || {
                bubbles: !1,
                cancelable: !1,
                detail: void 0
            };
            var d = document.createEvent("CustomEvent");
            d.initCustomEvent(a, c.bubbles, c.cancelable, c.detail);
            return d
        }
        a.prototype = window.Event.prototype;
        window.CustomEvent = a;
        Function.prototype.bind || (Function.prototype.bind = function(a) {
            if ("function" !== typeof this) throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
            var c = Array.prototype.slice.call(arguments, 1),
                d = this,
                e = function() {},
                f = function() {
                    return d.apply(this instanceof e &&
                        a ? this : a, c.concat(Array.prototype.slice.call(arguments)))
                };
            e.prototype = this.prototype;
            f.prototype = new e;
            return f
        })
    })();
    ERNO.extend = function(a, b) {
        if (Object.keys)
            for (var c = Object.keys(b), d = 0, e = c.length; d < e; d++) {
                var f = c[d];
                Object.defineProperty(a, f, Object.getOwnPropertyDescriptor(b, f))
            } else
                for (f in c = {}.hasOwnProperty, b) c.call(b, f) && (a[f] = b[f]);
        return a
    };
    THREE.CSS3DObject = function(a) {
        THREE.Object3D.call(this);
        this.element = a;
        this.done = !1;
        this.element.style.position = "absolute";
        this.addEventListener("removed", function(a) {
            if (null !== this.element.parentNode) {
                this.element.parentNode.removeChild(this.element);
                for (var c = 0, d = this.children.length; c < d; c++) this.children[c].dispatchEvent(a)
            }
        })
    };
    THREE.CSS3DObject.prototype = Object.create(THREE.Object3D.prototype);
    THREE.CSS3DSprite = function(a) {
        THREE.CSS3DObject.call(this, a)
    };
    THREE.CSS3DSprite.prototype = Object.create(THREE.CSS3DObject.prototype);
    THREE.CSS3DRenderer = function() {
        var a, b, c, d, e = new THREE.Matrix4,
            f = document.createElement("div");
        f.style.overflow = "hidden";
        f.style.WebkitTransformStyle = "preserve-3d";
        f.style.MozTransformStyle = "preserve-3d";
        f.style.oTransformStyle = "preserve-3d";
        f.style.transformStyle = "preserve-3d";
        this.domElement = f;
        var h = document.createElement("div");
        h.style.WebkitTransformStyle = "preserve-3d";
        h.style.MozTransformStyle = "preserve-3d";
        h.style.oTransformStyle = "preserve-3d";
        h.style.transformStyle = "preserve-3d";
        f.appendChild(h);
        this.setClearColor = function() {};
        this.setSize = function(e, g) {
            a = e;
            b = g;
            c = a / 2;
            d = b / 2;
            f.style.width = e + "px";
            f.style.height = g + "px";
            h.style.width = e + "px";
            h.style.height = g + "px"
        };
        var g = function(a) {
                return 1E-6 > Math.abs(a) ? 0 : a
            },
            m = function() {
                var a = new THREE.Vector3,
                    b = new THREE.Vector3,
                    c = new THREE.Euler,
                    e = new THREE.Quaternion;
                c._quaternion = e;
                e._euler = c;
                return function(d) {
                    d.decompose(a, e, b);
                    return "translate3d(-50%,-50%,0) translate3d(" + g(a.x) + "px, " + g(a.y) + "px, " + g(a.z) + "px) rotateX(" + g(c.x) + "rad) rotateY(" + g(c.y) +
                        "rad) rotateZ(" + g(c.z) + "rad) scale3d(" + g(b.x) + ", " + g(-b.y) + ", " + g(b.z) + ")"
                }
            }(),
            s = function(a, b) {
                if (a instanceof THREE.CSS3DObject) {
                    var c;
                    a instanceof THREE.CSS3DSprite ? (e.copy(b.matrixWorldInverse), e.transpose(), e.copyPosition(a.matrixWorld), e.scale(a.scale), e.elements[3] = 0, e.elements[7] = 0, e.elements[11] = 0, e.elements[15] = 1, c = m(e)) : c = m(a.matrixWorld);
                    var d = a.element;
                    d.style.WebkitTransformStyle = "preserve-3d";
                    d.style.MozTransformStyle = "preserve-3d";
                    d.style.oTransformStyle = "preserve-3d";
                    d.style.transformStyle =
                        "preserve-3d";
                    d.style.WebkitTransform = c;
                    d.style.MozTransform = c;
                    d.style.oTransform = c;
                    d.style.transform = c;
                    d.parentNode !== h && h.appendChild(d)
                }
                c = 0;
                for (d = a.children.length; c < d; c++) s(a.children[c], b)
            };
        this.render = function(a, e) {
            var k = 0.5 / Math.tan(THREE.Math.degToRad(0.5 * e.fov)) * b;
            f.style.WebkitPerspective = k + "px";
            f.style.MozPerspective = k + "px";
            f.style.oPerspective = k + "px";
            f.style.perspective = k + "px";
            a.updateMatrixWorld();
            void 0 === e.parent && e.updateMatrixWorld();
            e.matrixWorldInverse.getInverse(e.matrixWorld);
            var k = "translate3d(0,0," + k + "px)",
                l;
            l = e.matrixWorldInverse.elements;
            l = "matrix3d(" + g(l[0]) + "," + g(-l[1]) + "," + g(l[2]) + "," + g(l[3]) + "," + g(l[4]) + "," + g(-l[5]) + "," + g(l[6]) + "," + g(l[7]) + "," + g(l[8]) + "," + g(-l[9]) + "," + g(l[10]) + "," + g(l[11]) + "," + g(l[12]) + "," + g(-l[13]) + "," + g(l[14]) + "," + g(l[15]) + ")";
            k = k + l + " translate3d(" + c + "px," + d + "px, 0)";
            h.style.WebkitTransform = k;
            h.style.MozTransform = k;
            h.style.oTransform = k;
            h.style.transform = k;
            s(a, e)
        }
    };
    var _ = {
        isNumeric: function(a) {
            return !isNaN(parseFloat(a)) && isFinite(a)
        },
        cascade: function() {
            var a, b = Array.prototype.slice.call(arguments);
            for (a = 0; a < b.length; a++)
                if (void 0 !== b[a]) return b[a];
            return !1
        },
        hexToRgb: function(a) {
            a = a.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, function(a, c, d, e) {
                return c + c + d + d + e + e
            });
            return (a = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(a)) ? {
                r: parseInt(a[1], 16),
                g: parseInt(a[2], 16),
                b: parseInt(a[3], 16)
            } : null
        }
    };
    ERNO.extend(Number.prototype, {
        absolute: function() {
            return Math.abs(this)
        },
        add: function() {
            var a = this;
            Array.prototype.slice.call(arguments).forEach(function(b) {
                a += b
            });
            return a
        },
        arcCosine: function() {
            return Math.acos(this)
        },
        arcSine: function() {
            return Math.asin(this)
        },
        arcTangent: function() {
            return Math.atan(this)
        },
        constrain: function(a, b) {
            var c, d, e = this;
            b = b || 0;
            c = Math.max(a, b);
            d = Math.min(a, b);
            e = Math.min(e, c);
            return e = Math.max(e, d)
        },
        cosine: function() {
            return Math.cos(this)
        },
        degreesToDirection: function() {
            var a =
                "N NNE NE NEE E SEE SE SSE S SSW SW SWW W NWW NW NNW N".split(" ");
            return a[this.scale(0, 360, 0, a.length - 1).round()]
        },
        degreesToRadians: function() {
            return this * Math.PI / 180
        },
        divide: function() {
            var a = this;
            Array.prototype.slice.call(arguments).forEach(function(b) {
                a /= b
            });
            return a
        },
        isBetween: function(a, b) {
            var c = Math.min(a, b),
                d = Math.max(a, b);
            return c <= this && this <= d
        },
        lerp: function(a, b) {
            return a + (b - a) * this
        },
        log: function(a) {
            return Math.log(this) / (void 0 === a ? 1 : Math.log(a))
        },
        log10: function() {
            return Math.log(this) /
                Math.LN10
        },
        maximum: function(a) {
            return Math.max(this, a)
        },
        minimum: function(a) {
            return Math.min(this, a)
        },
        modulo: function(a) {
            return (this % a + a) % a
        },
        multiply: function() {
            var a = this;
            Array.prototype.slice.call(arguments).forEach(function(b) {
                a *= b
            });
            return a
        },
        normalize: function(a, b) {
            return a == b ? 1 : (this - a) / (b - a)
        },
        raiseTo: function(a) {
            return Math.pow(this, a)
        },
        radiansToDegrees: function() {
            return 180 * this / Math.PI
        },
        rand: function(a) {
            var b;
            return void 0 !== a ? (b = Math.min(this, a), a = Math.max(this, a), b + Math.floor(Math.random() *
                (a - b))) : Math.floor(Math.random() * this)
        },
        random: function(a) {
            var b;
            return void 0 !== a ? (b = Math.min(this, a), a = Math.max(this, a), b + Math.random() * (a - b)) : Math.random() * this
        },
        remainder: function(a) {
            return this % a
        },
        round: function(a) {
            var b;
            a = a || 0;
            b = this * Math.pow(10, a);
            b = Math.round(b);
            return b /= Math.pow(10, a)
        },
        roundDown: function() {
            return Math.floor(this)
        },
        roundUp: function() {
            return Math.ceil(this)
        },
        scale: function(a, b, c, d) {
            a = this.normalize(a, b);
            return c == d ? d : c + a * (d - c)
        },
        sine: function() {
            return Math.sin(this)
        },
        subtract: function() {
            var a =
                this;
            Array.prototype.slice.call(arguments).forEach(function(b) {
                a -= b
            });
            return a
        },
        tangent: function() {
            return Math.tan(this)
        },
        toArray: function() {
            return [this.valueOf()]
        },
        toNumber: function() {
            return this.valueOf()
        },
        toPaddedString: function(a) {
            return ("0000000000000" + String(this)).slice(-a)
        },
        toSignedString: function() {
            var a = "" + this;
            0 <= this && (a = "+" + a);
            return a
        },
        toString: function() {
            return "" + this
        }
    });
    ERNO.extend(String.prototype, {
        capitalize: function() {
            return this.charAt(0).toUpperCase() + this.slice(1)
        },
        invert: function() {
            var a = "",
                b;
            for (b = 0; b < this.length; b++) a = this.charAt(b) === this.charAt(b).toUpperCase() ? a + this.charAt(b).toLowerCase() : a + this.charAt(b).toUpperCase();
            return a
        },
        justifyCenter: function(a) {
            var b = Math.round(this.length / 2),
                c = this.length - b,
                d = Math.round(a / 2),
                b = d - b;
            a = a - d - c;
            c = this;
            if (0 < b)
                for (; b--;) c = " " + c;
            else 0 > b && (c = c.substr(-1 * b));
            if (0 < a)
                for (; a--;) c += " ";
            else 0 > a && (c = c.substr(0, c.length +
                a));
            return c
        },
        justifyLeft: function(a) {
            for (var b = this; b.length < a;) b += " ";
            return b
        },
        justifyRight: function(a) {
            for (var b = this; b.length < a;) b = " " + b;
            return b
        },
        multiply: function(a) {
            var b, c = "";
            a = _.cascade(a, 2);
            for (b = 0; b < a; b++) c += this;
            return c
        },
        reverse: function() {
            var a, b = "";
            for (a = 0; a < this.length; a++) b = this[a] + b;
            return b
        },
        size: function() {
            return this.length
        },
        toEntities: function() {
            var a, b = "";
            for (a = 0; a < this.length; a++) b += "&#" + this.charCodeAt(a) + ";";
            return b
        },
        toCamelCase: function() {
            var a = this.split(/\W+|_+/),
                b =
                a[0],
                c;
            for (c = 1; c < a.length; c++) b += a[c].capitalize();
            return b
        },
        directionToDegrees: function() {
            var a = "N NNE NE NEE E SEE SE SSE S SSW SW SWW W NWW NW NNW N".split(" "),
                b = a.indexOf(this.toUpperCase());
            return 0 <= b ? b.scale(0, a.length - 1, 0, 360) : Number.NaN
        },
        toArray: function() {
            return [this]
        },
        toNumber: function() {
            return parseFloat(this)
        },
        toString: function() {
            return this
        },
        toUnderscoreCase: function() {
            var a = this.replace(/[A-Z]+/g, function(a) {
                return "_" + a
            });
            "_" === a.charAt(0) && (a = a.substr(1));
            return a.toLowerCase()
        },
        toUnicode: function() {
            var a, b, c = "";
            for (a = 0; a < this.length; a++) {
                for (b = this.charCodeAt(a).toString(16).toUpperCase(); 4 > b.length;) b = "0" + b;
                c += "\\u" + b
            }
            return c
        }
    });
    ERNO.extend(Array.prototype, {
        distanceTo: function(a) {
            var b, c = 0;
            0 < arguments.length && (a = Array.prototype.slice.call(arguments));
            if (this.length === a.length) {
                for (b = 0; b < this.length; b++) c += Math.pow(a[b] - this[b], 2);
                return Math.pow(c, 0.5)
            }
            return null
        },
        first: function() {
            return this[0]
        },
        last: function() {
            return this[this.length - 1]
        },
        maximum: function() {
            return Math.max.apply(null, this)
        },
        middle: function() {
            return this[Math.round((this.length - 1) / 2)]
        },
        minimum: function() {
            return Math.min.apply(null, this)
        },
        rand: function() {
            return this[Math.floor(Math.random() *
                this.length)]
        },
        random: function() {
            return this[Math.floor(Math.random() * this.length)]
        },
        shuffle: function() {//Chris this shuffles for us
            var a = this.length,
                b, c, d;
            if (0 == a) return !1;
            for (; --a;) b = Math.floor(Math.random() * (a + 1)), c = this[a], d = this[b], this[a] = d, this[b] = c;
            return this
        },
        toArray: function() {
            return this
        },
        toHtml: function() {
            var a, b = "<ul>";
            for (a = 0; a < this.length; a++) b = this[a] instanceof Array ? b + this[a].toHtml() : b + ("<li>" + this[a] + "</li>");
            return b + "</ul>"
        },
        toText: function(a) {
            var b, c, d;
            a = _.cascade(a, 0);
            c = "\n" + "\t".multiply(a);
            d = "";
            for (b =
                0; b < this.length; b++) d = this[b] instanceof Array ? d + (c + this[b].toText(a + 1)) : d + (c + this[b]);
            return d
        }
    });
    ERNO.Color = function(a, b, c, d, e) {
        this.name = a;
        this.initial = b;
        this.hex = c;
        this.styleF = d;
        this.styleB = e
    };
    var W, O, B, R, G, Y, COLOURLESS;
    W = ERNO.WHITE = new ERNO.Color("white", "W", "#FFF", "font-weight: bold; color: #888", "background-color: #F3F3F3; color: rgba( 0, 0, 0, 0.5 )");
    O = ERNO.ORANGE = new ERNO.Color("orange", "O", "#ffa902", "font-weight: bold; color: #ffa902", "background-color: #ffa902; color: rgba( 255, 255, 255, 0.9 )");
    B = ERNO.BLUE = new ERNO.Color("blue", "B", "#00c1cf", "font-weight: bold; color: #00c1cf", "background-color: #00c1cf; color: rgba( 255, 255, 255, 0.9 )");
    R = ERNO.RED = new ERNO.Color("red", "R", "#f44d9c", "font-weight: bold; color: #f44d9c", "background-color: #f44d9c; color: rgba( 255, 255, 255, 0.9 )");
    G = ERNO.GREEN = new ERNO.Color("green", "G", "#98ff98", "font-weight: bold; color: #98ff98", "background-color: #98ff98; color: rgba( 255, 255, 255, 0.9 )");
    Y = ERNO.YELLOW = new ERNO.Color("yellow", "Y", "#FFE135", "font-weight: bold; color: #FFE135", "background-color: #FFE135; color: rgba( 0, 0, 0, 0.5 )");
    ERNO.COLORLESS = new ERNO.Color("NA", "X", "#DDD", "color: #EEE", "color: #DDD");
    ERNO.Direction = function(a, b, c) {
        this.id = a;
        this.name = b.toLowerCase();
        this.normal = c;
        this.initial = b.substr(0, 1).toUpperCase();
        this.neighbors = [];
        this.opposite = null
    };
    ERNO.Direction.prototype.setRelationships = function(a, b, c, d, e) {
        this.neighbors = [a, b, c, d];
        this.opposite = e
    };
    ERNO.Direction.getNameById = function(a) {
        return "front up right down left back".split(" ")[a]
    };
    ERNO.Direction.getIdByName = function(a) {
        return {
            front: 0,
            up: 1,
            right: 2,
            down: 3,
            left: 4,
            back: 5
        }[a]
    };
    ERNO.Direction.getDirectionById = function(a) {
        return [ERNO.Direction.FRONT, ERNO.Direction.UP, ERNO.Direction.RIGHT, ERNO.Direction.DOWN, ERNO.Direction.LEFT, ERNO.Direction.BACK][a]
    };
    ERNO.Direction.getDirectionByInitial = function(a) {
        return {
            F: ERNO.Direction.FRONT,
            U: ERNO.Direction.UP,
            R: ERNO.Direction.RIGHT,
            D: ERNO.Direction.DOWN,
            L: ERNO.Direction.LEFT,
            B: ERNO.Direction.BACK
        }[a.toUpperCase()]
    };
    ERNO.Direction.getDirectionByName = function(a) {
        return {
            front: ERNO.Direction.FRONT,
            up: ERNO.Direction.UP,
            right: ERNO.Direction.RIGHT,
            down: ERNO.Direction.DOWN,
            left: ERNO.Direction.LEFT,
            back: ERNO.Direction.BACK
        }[a.toLowerCase()]
    };
    ERNO.Direction.getDirectionByNormal = function() {
        var a = new THREE.Vector3;
        return function(b) {
            a.x = Math.round(b.x);
            a.y = Math.round(b.y);
            a.z = Math.round(b.z);
            return a.equals(ERNO.Direction.FRONT.normal) ? ERNO.Direction.FRONT : a.equals(ERNO.Direction.BACK.normal) ? ERNO.Direction.BACK : a.equals(ERNO.Direction.UP.normal) ? ERNO.Direction.UP : a.equals(ERNO.Direction.DOWN.normal) ? ERNO.Direction.DOWN : a.equals(ERNO.Direction.LEFT.normal) ? ERNO.Direction.LEFT : a.equals(ERNO.Direction.RIGHT.normal) ? ERNO.Direction.RIGHT : null
        }
    }();
    ERNO.Direction.prototype.getRotation = function(a, b, c) {
        void 0 === b && (b = this.neighbors[0]);
        if (b === this || b === this.opposite) return null;
        c = void 0 === c ? 1 : c.modulo(4);
        for (var d = 0; 5 > d && this.neighbors[d] !== b; d++);
        return this.neighbors[d.add(c * a).modulo(4)]
    };
    ERNO.Direction.prototype.getClockwise = function(a, b) {
        return this.getRotation(1, a, b)
    };
    ERNO.Direction.prototype.getAnticlockwise = function(a, b) {
        return this.getRotation(-1, a, b)
    };
    ERNO.Direction.prototype.getDirection = function(a, b) {
        return this.getRotation(1, b, a.id - 1)
    };
    ERNO.Direction.prototype.getUp = function(a) {
        return this.getDirection(ERNO.Direction.UP, a)
    };
    ERNO.Direction.prototype.getRight = function(a) {
        return this.getDirection(ERNO.Direction.RIGHT, a)
    };
    ERNO.Direction.prototype.getDown = function(a) {
        return this.getDirection(ERNO.Direction.DOWN, a)
    };
    ERNO.Direction.prototype.getLeft = function(a) {
        return this.getDirection(ERNO.Direction.LEFT, a)
    };
    ERNO.Direction.prototype.getOpposite = function() {
        return this.opposite
    };
    ERNO.Direction.FRONT = new ERNO.Direction(0, "front", new THREE.Vector3(0, 0, 1));
    ERNO.Direction.UP = new ERNO.Direction(1, "up", new THREE.Vector3(0, 1, 0));
    ERNO.Direction.RIGHT = new ERNO.Direction(2, "right", new THREE.Vector3(1, 0, 0));
    ERNO.Direction.DOWN = new ERNO.Direction(3, "down", new THREE.Vector3(0, -1, 0));
    ERNO.Direction.LEFT = new ERNO.Direction(4, "left", new THREE.Vector3(-1, 0, 0));
    ERNO.Direction.BACK = new ERNO.Direction(5, "back", new THREE.Vector3(0, 0, -1));
    ERNO.Direction.FRONT.setRelationships(ERNO.Direction.UP, ERNO.Direction.RIGHT, ERNO.Direction.DOWN, ERNO.Direction.LEFT, ERNO.Direction.BACK);
    ERNO.Direction.UP.setRelationships(ERNO.Direction.BACK, ERNO.Direction.RIGHT, ERNO.Direction.FRONT, ERNO.Direction.LEFT, ERNO.Direction.DOWN);
    ERNO.Direction.RIGHT.setRelationships(ERNO.Direction.UP, ERNO.Direction.BACK, ERNO.Direction.DOWN, ERNO.Direction.FRONT, ERNO.Direction.LEFT);
    ERNO.Direction.DOWN.setRelationships(ERNO.Direction.FRONT, ERNO.Direction.RIGHT, ERNO.Direction.BACK, ERNO.Direction.LEFT, ERNO.Direction.UP);
    ERNO.Direction.LEFT.setRelationships(ERNO.Direction.UP, ERNO.Direction.FRONT, ERNO.Direction.DOWN, ERNO.Direction.BACK, ERNO.Direction.RIGHT);
    ERNO.Direction.BACK.setRelationships(ERNO.Direction.UP, ERNO.Direction.LEFT, ERNO.Direction.DOWN, ERNO.Direction.RIGHT, ERNO.Direction.FRONT);
    ERNO.Queue = function(a) {
        void 0 !== a && a instanceof Function && (this.validate = a);
        this.history = [];
        this.useHistory = !0;
        this.future = [];
        this.isReady = !0;
        this.isLooping = !1
    };
    ERNO.Queue.prototype.add = function() {
        var a = Array.prototype.slice.call(arguments);
        void 0 !== this.validate && this.validate instanceof Function && (a = this.validate(a));
        a instanceof Array && a.forEach(function(a) {
            this.future.push(a)
        }.bind(this));
        return this.future
    };
    ERNO.Queue.prototype.remove = function() {
        var a = Array.prototype.slice.call(arguments);
        a instanceof Array && a.forEach(function(a) {
            this.future = this.future.filter(function(c) {
                return c != a
            })
        }.bind(this));
        return this.future
    };
    ERNO.Queue.prototype.purge = function() {
        var a = Array.prototype.slice.call(arguments);
        a instanceof Array && a.forEach(function(a) {
            this.history = this.history.filter(function(c) {
                return c != a
            })
        }.bind(this));
        return this.history
    };
    ERNO.Queue.prototype.empty = function(a) {
        this.future = [];
        a && (this.history = [])
    };
    ERNO.Queue.prototype.do = function() {
        if (this.future.length) {
            var a = this.future.shift();
            this.useHistory && this.history.push(a);
            return a
        }
        this.isLooping && (this.future = this.history.slice(), this.history = [])
    };
    ERNO.Queue.prototype.undo = function() {
        if (this.history.length) {
            var a = this.history.pop();
            this.future.unshift(a);
            return a
        }
    };
    ERNO.Queue.prototype.redo = function() {
        return this.do()
    };
    ERNO.Twist = function(a, b) {//chris ...key function for movement
        a && this.set(a, b);
    };
    ERNO.Twist.prototype.set = function(a, b) {//chris...key function for movement
        var c = {
            X: "Cube on X",
            L: "Left face",
            M: "Middle slice",
            R: "Right face",
            Y: "Cube on Y",
            U: "Up face",
            E: "Equator slice",
            D: "Down face",
            Z: "Cube on Z",
            F: "Front face",
            S: "Standing slice",
            B: "Back face"
        }[a.toUpperCase()];
        if (void 0 !== c) {
            void 0 != b && 0 > b && (a = a.invert(), b = b.absolute());
            var d = 0,
                e = "unwise";
            a === a.toUpperCase() ? (d = 1, e = "clockwise") : a === a.toLowerCase() && (d = -1, e = "anticlockwise");
            this.command = a;
            this.group = c;
            this.degrees = b;
            this.vector = d;
            this.wise = e;
            this.isShuffle = !1;
            this.getInverse =
                function() {
                    return new ERNO.Twist(a.invert(), b)
                }
        } else return !1
    };
    ERNO.Twist.prototype.equals = function(a) {
        return this.command === a.command && this.degrees === a.degrees
    };
    ERNO.Twist.prototype.copy = function(a) {
        this.command = a.command;
        this.group = a.group;
        this.degrees = a.degrees;
        this.vector = a.vector;
        this.wise = a.wise;
        this.isShuffle = a.isShuffle;
        return this
    };
	
    ERNO.Twist.validate = function() {//Chris...key function for moving cube
		//chris console.log("validate");
        var a = Array.prototype.slice.call(arguments),
            b, c, d, e, f, h;
        for (c = 0; c < a.length; c++)
            if (b = a[c], d = c + 1 < a.length ? a[c + 1] : void 0, !(b instanceof ERNO.Twist))
                if ("string" === typeof b)
                    if (1 === b.length) a[c] = "number" === typeof d ? new ERNO.Twist(b, d) : new ERNO.Twist(b);
                    else {
                        if (1 < b.length) {
                            d = /(-?\d+|[XLMRYUEDZFSB])/gi;
                            b = b.match(d);
                            for (f = 0; f < b.length; f++) e = b[f], _.isNumeric(e) ? b[f] = +e : (d = b.slice(0, f), h = b.slice(f + 1), e = e.split(""), b = d.concat(e, h));
                            d = a.slice(0, c);
                            h = a.slice(c + 1);
                            a = d.concat(b, h);
                            c--
                        }
                    } else b instanceof ERNO.Direction ? a[c] = b.initial : b instanceof Array ? (d = a.slice(0, c), h = a.slice(c + 1), a = d.concat(b, h)) : a.splice(c, 1), c--;
        return a
    };
    ERNO.Cubelet = function(a, b, c) {//Chris coudld be useful
        THREE.Object3D.call(this);
        this.cube = a;
        this.id = b || 0;
        this.setAddress(this.id);
        this.size = a.cubeletSize || 140;
        a = this.addressX * (this.size + 0.1);
        b = this.addressY * (this.size + 0.1);
        var d = this.addressZ * (this.size + 0.1);
        this.position.set(a, b, d);
        this.matrixSlice = (new THREE.Matrix4).makeTranslation(a, b, d);
        this.updateMatrix();
        this.cube.object3D.add(this);
        a = 0;
        void 0 === c && (c = [W, O, , , G]);
        this.faces = [];
        for (b = 0; 6 > b; b++) d = c[b] || ERNO.COLORLESS, this.faces[b] = {}, this.faces[b].id = b, this.faces[b].color =
            d, this.faces[b].normal = ERNO.Direction.getNameById(b), this.faces[b].isIntrovert = d === ERNO.COLORLESS, d !== ERNO.COLORLESS && a++;
        this.type = ["core", "center", "edge", "corner"][a];
        this.front = this.faces[0];
        this.up = this.faces[1];
        this.right = this.faces[2];
        this.down = this.faces[3];
        this.left = this.faces[4];
        this.back = this.faces[5];
        this.colors = (this.faces[0].color ? this.faces[0].color.initial : "-") + (this.faces[1].color ? this.faces[1].color.initial : "-") + (this.faces[2].color ? this.faces[2].color.initial : "-") + (this.faces[3].color ?
            this.faces[3].color.initial : "-") + (this.faces[4].color ? this.faces[4].color.initial : "-") + (this.faces[5].color ? this.faces[5].color.initial : "-");
        this.isStickerCubelet = this.front.color && "white" === this.front.color.name && "center" === this.type;
        this.isTweening = !0;
        this.isTweening = this.isEngagedZ = this.isEngagedY = this.isEngagedX = !1;
        this.opacity = 1;
        this.radius = 0
    };
    ERNO.Cubelet.prototype = Object.create(THREE.Object3D.prototype);
    ERNO.extend(ERNO.Cubelet.prototype, {
        setAddress: function(a) {
            this.address = a || 0;
            this.addressX = a.modulo(3).subtract(1);
            this.addressY = -1 * a.modulo(9).divide(3).roundDown().subtract(1);
            this.addressZ = -1 * a.divide(9).roundDown().subtract(1)
        },
        hasColor: function(a) {
            var b, c, d = _.hexToRgb(a.hex);
            for (a = 0; 6 > a; a++)
                if (c = _.hexToRgb(this.faces[a].color.hex), c.r === d.r && c.g === d.g && c.b === d.b) {
                    b = a;
                    break
                }
            return void 0 !== b ? "front up right down left back".split(" ")[b] : !1
        },
        hasColors: function() {
            var a = this,
                b = !0;
            Array.prototype.slice.call(arguments).forEach(function(c) {
                b =
                    b && !!a.hasColor(c)
            });
            return b
        },
        getRadius: function() {
            return this.radius
        },
        setRadius: function(a, b) {
            if (!1 === this.isTweening && (a = a || 0, void 0 === this.radius && (this.radius = 0), this.radius !== a)) {
                this.isTweening = !0;
				
                var c = (this.radius - a).absolute(),
                    d = {
                        radius: this.radius
                    };
                (new TWEEN.Tween(d)).to({
                    radius: a
                }, c).easing(TWEEN.Easing.Quartic.Out).onUpdate(function() {
                    this.position.set(this.addressX.multiply(this.size + d.radius) + 0.2, this.addressY.multiply(this.size + d.radius) + 0.2, this.addressZ.multiply(this.size + d.radius) +
                        0.2);
                    this.updateMatrix();
                    this.matrixSlice.copy(this.matrix);
                    this.radius = d.radius
                }.bind(this)).onComplete(function() {
                    this.isTweening = !1;
                    this.position.set(this.addressX.multiply(this.size + d.radius) + 0.2, this.addressY.multiply(this.size + d.radius) + 0.2, this.addressZ.multiply(this.size + d.radius) + 0.2);
                    this.updateMatrix();
                    this.matrixSlice.copy(this.matrix);
                    this.radius = d.radius;
                    b instanceof Function && b()
                }.bind(this)).start(this.cube.time)
            }
        }
    });
    ERNO.Group = function() {
        this.cubelets = [];
        this.add(Array.prototype.slice.call(arguments))
    };
    ERNO.extend(ERNO.Group.prototype, THREE.EventDispatcher.prototype);
    ERNO.extend(ERNO.Group.prototype, {
        add: function() {
            var a = this;
            Array.prototype.slice.call(arguments).forEach(function(b) {
                b instanceof ERNO.Group && (b = b.cubelets);
                b instanceof Array ? a.add.apply(a, b) : a.cubelets.push(b)
            });
            return this
        },
        remove: function(a) {
            a instanceof ERNO.Group && (a = a.cubelets);
            if (a instanceof Array) {
                var b = this;
                a.forEach(function(a) {
                    b.remove(a)
                })
            }
            for (var c = this.cubelets.length; 0 < c--;) this.cubelets[c] === a && this.cubelets.splice(c, 1);
            return this
        },
        isFlagged: function(a) {
            var b = 0;
            this.cubelets.forEach(function(c) {
                b +=
                    c[a] ? 1 : 0
            });
            return b
        },
        isTweening: function() {
            return this.isFlagged("isTweening")
        },
        isEngagedX: function() {
            return this.isFlagged("isEngagedX")
        },
        isEngagedY: function() {
            return this.isFlagged("isEngagedY")
        },
        isEngagedZ: function() {
            return this.isFlagged("isEngagedZ")
        },
        isEngaged: function() {
            return this.isEngagedX() + this.isEngagedY() + this.isEngagedZ()
        },
        hasProperty: function(a, b) {
            var c = new ERNO.Group;
            this.cubelets.forEach(function(d) {
                d[a] === b && c.add(d)
            });
            return c
        },
        hasId: function(a) {
            return this.hasProperty("id", a)
        },
        hasAddress: function(a) {
            return this.hasProperty("address", a)
        },
        hasType: function(a) {
            return this.hasProperty("type", a)
        },
        hasColor: function(a) {
            var b = new ERNO.Group;
            this.cubelets.forEach(function(c) {
                c.hasColor(a) && b.add(c)
            });
            return b
        },
        hasColors: function() {
            var a = new ERNO.Group,
                b = Array.prototype.slice.call(arguments);
            this.cubelets.forEach(function(c) {
                c.hasColors.apply(c, b) && a.add(c)
            });
            return a
        },
        isSolved: function(a) {
            if (a) {
                var b = {},
                    c = 0;
                a instanceof ERNO.Direction && (a = a.name);
                this.cubelets.forEach(function(d) {
                    d =
                        d[a].color.name;
                    void 0 === b[d] ? (b[d] = 1, c++) : b[d]++
                });
                return 1 === c ? !0 : !1
            }
            console.warn("A face [String or ERNO.Controls] argument must be specified when using ERNO.Group.isSolved().");
            return !1
        },
        show: function() {
            this.cubelets.forEach(function(a) {
                a.show()
            });
            return this
        },
        hide: function() {
            this.cubelets.forEach(function(a) {
                a.hide()
            });
            return this
        },
        showPlastics: function() {
            this.cubelets.forEach(function(a) {
                a.showPlastics()
            });
            return this
        },
        hidePlastics: function() {
            this.cubelets.forEach(function(a) {
                a.hidePlastics()
            });
            return this
        },
        showExtroverts: function() {
            this.cubelets.forEach(function(a) {
                a.showExtroverts()
            });
            return this
        },
        hideExtroverts: function() {
            this.cubelets.forEach(function(a) {
                a.hideExtroverts()
            });
            return this
        },
        showIntroverts: function(a, b) {
            this.cubelets.forEach(function(c) {
                c.showIntroverts(a, b)
            });
            return this
        },
        hideIntroverts: function(a, b) {
            this.cubelets.forEach(function(c) {
                c.hideIntroverts(a, b)
            });
            return this
        },
        showStickers: function() {
            this.cubelets.forEach(function(a) {
                a.showStickers()
            });
            return this
        },
        hideStickers: function() {
            this.cubelets.forEach(function(a) {
                a.hideStickers()
            });
            return this
        },
        showWireframes: function() {
            this.cubelets.forEach(function(a) {
                a.showWireframes()
            });
            return this
        },
        hideWireframes: function() {
            this.cubelets.forEach(function(a) {
                a.hideWireframes()
            });
            return this
        },
        showIds: function() {
            this.cubelets.forEach(function(a) {
                a.showIds()
            });
            return this
        },
        hideIds: function() {
            this.cubelets.forEach(function(a) {
                a.hideIds()
            });
            return this
        },
        showTexts: function() {
            this.cubelets.forEach(function(a) {
                a.showTexts()
            });
            return this
        },
        hideTexts: function() {
            this.cubelets.forEach(function(a) {
                a.hideTexts()
            });
            return this
        },
        getOpacity: function() {
            var a = 0;
            this.cubelets.forEach(function(b) {
                a += b.getOpacity()
            });
            return a / this.cubelets.length
        },
        setOpacity: function(a, b) {
            this.cubelets.forEach(function(c) {
                c.setOpacity(a, b)
            });
            return this
        },
        getRadius: function() {
            var a = 0;
            this.cubelets.forEach(function(b) {
                a += b.getRadius()
            });
            return a / this.cubelets.length
        },
        setRadius: function(a, b) {
            this.cubelets.forEach(function(c) {
                c.setRadius(a, b)
            });
            return this
        }
    });
    ERNO.Slice = function(a, b) {
        this.axis = new THREE.Vector3;
        this.invertedAxis = new THREE.Vector3;
        this.matrix = new THREE.Matrix4;
        this.axis.rotation = 0;
        this.indices = a;
        this.neighbour = null;
        this.ableToHideInternalFaces = !0;
        this.cube = b;
        this.getCubelet = function(c) {
            return b.cubelets[a[c]]
        };
        this.rotateGroupMappingOnAxis = function() {
            var c = new THREE.Vector3,
                d = new THREE.Vector3(1, 1, 1),
                e = new THREE.Vector3,
                f = new THREE.Vector3,
                h = new THREE.Matrix4,
                g;
            return function(m) {
                m = Math.round(m / (0.25 * Math.PI)) * Math.PI * 0.25;
                c.copy(d);
                c.sub(this.axis);
                var s = b.cubelets.slice();
                h.makeRotationAxis(this.axis, -1 * m);
                for (var q = a.length, p; 0 < q--;) p = b.cubelets[a[q]], e.set(p.addressX, p.addressY, p.addressZ), f.copy(e), e.multiply(c).applyMatrix4(h), e.x = Math.round(e.x), e.y = Math.round(e.y), e.z = Math.round(e.z), e.add(f.multiply(this.axis)), e.add(d), e.y = 2 - e.y, e.z = 2 - e.z, b.cubelets[p.address] = s[9 * e.z + 3 * e.y + e.x];
                for (q = 0; q < b.cubelets.length; q++) b.cubelets[q].setAddress(q);
                h.makeRotationAxis(this.axis, m);
                this.cubelets.forEach(function(a) {
                    g = [];
                    a.faces.forEach(function(a,
                        b) {
                        e.copy(ERNO.Direction.getDirectionByName(a.normal).normal);
                        e.applyMatrix4(h);
                        g[ERNO.Direction.getDirectionByNormal(e).id] = a;
                        a.normal = ERNO.Direction.getDirectionByNormal(e).name
                    });
                    a.faces = g.slice();
                    a.front = a.faces[0];
                    a.up = a.faces[1];
                    a.right = a.faces[2];
                    a.down = a.faces[3];
                    a.left = a.faces[4];
                    a.back = a.faces[5]
                })
            }
        }();
        this.map()
    };
    ERNO.Slice.prototype = Object.create(ERNO.Group.prototype);
    ERNO.extend(ERNO.Slice.prototype, {get origin() {
            return this.cube.cubelets[this.indices[4]]
        },
        get north() {
            return this.cube.cubelets[this.indices[1]]
        },
        get northEast() {
            return this.cube.cubelets[this.indices[2]]
        },
        get east() {
            return this.cube.cubelets[this.indices[5]]
        },
        get southEast() {
            return this.cube.cubelets[this.indices[8]]
        },
        get south() {
            return this.cube.cubelets[this.indices[7]]
        },
        get southWest() {
            return this.cube.cubelets[this.indices[6]]
        },
        get west() {
            return this.cube.cubelets[this.indices[3]]
        },
        get northWest() {
            return this.cube.cubelets[this.indices[0]]
        },
        get cubelets() {
            for (var a = [], b = this.indices.length; 0 < b--;) a.push(this.getCubelet(b));
            return a
        },
        map: function(a, b) {
            for (var c = 0; 6 > c; c++)
                if (this.origin.faces[c].color && this.origin.faces[c].color !== ERNO.COLORLESS) {
                    this.color = this.origin.faces[c].color;
                    this.face = ERNO.Direction.getNameById(c);
                    break
                }
            if (void 0 === this.axis || 0 === this.axis.lengthSq()) {
                var c = this.northEast.position.clone(),
                    d = this.southWest.position.clone(),
                    e = this.northWest.position.clone();
                this.axis = (new THREE.Vector3).crossVectors(d.sub(c), e.sub(c)).normalize();
                this.axis.rotation = 0
            }
            this.up = new ERNO.Group(this.northWest, this.north, this.northEast);
            this.equator = new ERNO.Group(this.west, this.origin, this.east);
            this.down = new ERNO.Group(this.southWest, this.south, this.southEast);
            this.left = new ERNO.Group(this.northWest, this.west, this.southWest);
            this.middle = new ERNO.Group(this.north, this.origin, this.south);
            this.right = new ERNO.Group(this.northEast, this.east, this.southEast);
            (c = this.hasType("center")) && 1 === c.cubelets.length ? (this.center = this.hasType("center"), this.corners =
                new ERNO.Group(this.hasType("corner")), this.cross = new ERNO.Group(this.center, this.hasType("edge")), this.ex = new ERNO.Group(this.center, this.hasType("corner"))) : this.centers = new ERNO.Group(this.hasType("center"));
            this.edges = new ERNO.Group(this.hasType("edge"));
            this.ring = new ERNO.Group(this.northWest, this.north, this.northEast, this.west, this.east, this.southWest, this.south, this.southEast);
            this.dexter = new ERNO.Group(this.northWest, this.origin, this.southEast);
            this.sinister = new ERNO.Group(this.northEast,
                this.origin, this.southWest);
            return this
        },
        set rotation(a) {
            if (this.ableToHideInternalFaces && 0 !== this.cube.isFlagged("showingIntroverts") && this.cube.hideInvisibleFaces) {
                var b = 0 !== a % (0.5 * Math.PI);
                this.invertedAxis.copy(this.axis).negate();
                b ? this.neighbour ? (this.showIntroverts(this.axis, !0), this.neighbour.showIntroverts(this.invertedAxis, !0)) : (this.cube.showIntroverts(this.axis, !0), this.cube.showIntroverts(this.invertedAxis, !0)) : this.neighbour ? (this.hideIntroverts(null, !0), this.neighbour.hideIntroverts(null, !0)) : this.cube.hideIntroverts(null, !0)
            }
            this.matrix.makeRotationAxis(this.axis, a);
            this.axis.rotation = a;
            a = this.indices.length;
            for (var c = new THREE.Matrix4; a--;) b = this.getCubelet(a), b.matrix.multiplyMatrices(this.matrix, b.matrixSlice), b.position.setFromMatrixPosition(b.matrix), b.scale.setFromMatrixScale(b.matrix), c.extractRotation(b.matrix), b.quaternion.setFromRotationMatrix(c)
        },
        get rotation() {
            return this.axis.rotation
        },
        getLocation: function(a) {
            return a === this.origin ? "origin" : a === this.north ? "north" : a ===
                this.northEast ? "northEast" : a === this.east ? "east" : a === this.southEast ? "southEast" : a === this.south ? "south" : a === this.southWest ? "southWest" : a === this.west ? "west" : a === this.northWest ? "northWest" : !1
        },
        isSolved: function(a) {
            if (a) {
                var b = {},
                    c, d = this.indices.length,
                    e = 0;
                a instanceof ERNO.Direction && (a = a.name);
                for (; 0 < d--;) c = this.getCubelet(d), c = c[a].color.name, void 0 === b[c] ? (b[c] = 1, e++) : b[c]++;
                return 1 === e ? !0 : !1
            }
            console.warn("A face [String or ERNO.Controls] argument must be specified when using ERNO.Group.isSolved().");
            return !1
        }
    });
    ERNO.Fold = function(a, b) {
        this.map = [a.northWest[a.face].text, a.north[a.face].text, a.northEast[a.face].text, b.northWest[b.face].text, b.north[b.face].text, b.northEast[b.face].text, a.west[a.face].text, a.origin[a.face].text, a.east[a.face].text, b.west[b.face].text, b.origin[b.face].text, b.east[b.face].text, a.southWest[a.face].text, a.south[a.face].text, a.southEast[a.face].text, b.southWest[b.face].text, b.south[b.face].text, b.southEast[b.face].text]
    };
    ERNO.Fold.prototype.getText = function() {
        var a = "";
        this.map.forEach(function(b) {
            a += b.innerHTML
        });
        return a
    };
    ERNO.Fold.prototype.setText = function(a) {
        var b;
        a = a.justifyLeft(18);
        for (b = 0; 18 > b; b++) this.map[b].innerHTML = a.substr(b, 1)
    };
    ERNO.Projector = function() {
        return function(a, b) {
            function c(a, b) {
                l.getInverse(b.projectionMatrix);
                f.multiplyMatrices(b.matrixWorld, l);
                return a.applyProjection(f)
            }

            function d(d, f, l) {
                var t = b,
                    k = t !== document ? t.getBoundingClientRect() : {
                        left: 0,
                        top: 0,
                        width: window.innerWidth,
                        height: window.innerHeight
                    };
                t !== document && (t = t.ownerDocument.documentElement, k.left += window.pageXOffset - t.clientLeft, k.top += window.pageYOffset - t.clientTop);
                e = k;
                g.x = (f - e.left) / e.width * 2 - 1;
                g.y = (l - e.top) / e.height * -2 + 1;
                g.z = -1;
                m.set(g.x, g.y, 1);
                c(g, d);
                c(m, d);
                m.sub(g).normalize();
                q.set(g, m);
                h.getInverse(a.matrixWorld);
                q.applyMatrix4(h);
                return q
            }
            var e, f = new THREE.Matrix4,
                h = new THREE.Matrix4,
                g = new THREE.Vector3,
                m = new THREE.Vector3(1, 1, 1),
                s = new THREE.Vector3,
                q = new THREE.Ray,
                p = new THREE.Box3,
                k = new THREE.Sphere,
                l = new THREE.Matrix4,
                u = g.distanceTo(m);
            p.min.set(0.5 * -a.size, 0.5 * -a.size, 0.5 * -a.size);
            p.max.set(0.5 * a.size, 0.5 * a.size, 0.5 * a.size);
            k.radius = u * a.size * 0.5;
            return {
                getIntersection: function(b, c, e, f, g) {
                    f = f || new THREE.Vector3;
                    if (null === c || null ===
                        e) return null;
                    d(b, c, e);
                    return q.isIntersectionSphere(k) && null !== q.intersectBox(p, f) ? (g && (b = s || new THREE.Vector3, b.copy(f).set(Math.round(b.x), Math.round(b.y), Math.round(b.z)).multiplyScalar(2 / a.size).set(b.x | 0, b.y | 0, b.z | 0), g.setFromNormalAndCoplanarPoint(s, f)), f) : null
                },
                getIntersectionOnPlane: function(a, b, c, e, f) {
                    if (null === b || null === c) return null;
                    d(a, b, c);
                    return q.intersectPlane(e, f)
                },
                getCubeletAtIntersection: function() {
                    var b = new THREE.Vector3;
                    return function(c) {
                        b.copy(c).add(p.max).multiplyScalar(3 /
                            a.size).set(Math.min(b.x | 0, 2), Math.min(3 - b.y | 0, 2), Math.min(3 - b.z | 0, 2));
                        return a.cubelets[9 * b.z + 3 * b.y + b.x]
                    }
                }()
            }
        }
    }();
	
    ERNO.Interaction = function() {
        return function(a, b, c, d, e) {
            function f(e) {
				//console.log("interaction f");
				//Chris...disabling the following prevents all moves from being made except rotating the entire cube in space
                v.enabled && 2 !== e.button && (l = (e.touches && e.touches[0] || e).clientX, u = (e.touches && e.touches[0] || e).clientY, m.getIntersection(b, l, u, s, w) && (null !== e.touches && e.preventDefault(), 0 === a.isTweening() && (E = "undefined" !== typeof window && void 0 !== window.performance && void 0 !== window.performance.now ? window.performance.now() : Date.now(), v.active = !0, q = m.getCubeletAtIntersection(s), p = [a.slices[q.addressX + 1], a.slices[q.addressY + 4], a.slices[q.addressZ +
                    7]], c.addEventListener("mousemove", h), c.addEventListener("touchmove", h), c.addEventListener("mouseup", g), c.addEventListener("touchcancel", g), c.addEventListener("touchend", g), c.removeEventListener("mousedown", f), c.removeEventListener("touchstart", f))))
            }

            function h(a) {
				//console.log("interaction h");//chris added ... this is triggered when rotating a column
                v.active && (x.x = (a.touches && a.touches[0] || a).clientX, x.y = (a.touches && a.touches[0] || a).clientY);
                v.enabled && (a.preventDefault(), a.stopImmediatePropagation())
            }

            function g(b) {
				
				 //chris added...this is the mouseup when moving rows and columns
				 //console.log("mouseup function g for row and column move");
                var e = (b.touches && b.touches[0] || b).clientX,
                    d = (b.touches && b.touches[0] ||
                        b).clientY;
                v.active = !1;
				//Chris...disabling the line below allows the user to drag a row or column without it snapping into place
                v.enabled && (e !== u || d !== u) && n && (null !== b.touches && b.preventDefault(), b = k.name[0].toUpperCase(), e = Math.round(C / Math.PI * 2) * Math.PI * 0.5, 0.3 < t.length() / (("undefined" !== typeof window && void 0 !== window.performance && void 0 !== window.performance.now ? window.performance.now() : Date.now()) - E) && (e = Math.floor(C / Math.PI * 2) * Math.PI * 0.5, e += 0 < D.dot(t.normalize()) ? 0.5 * Math.PI : 0), a.twist(new ERNO.Twist(b, e.radiansToDegrees())));
                //chris console.log("function g var e:" + e + " e=0 means snap to old space e!=0 means move to a new position");
				//Chris added to update move count in html ...ugly but i'm in a rush
				//...moved from here because it misses rapid tap-to-move moves
				//if(e != 0){
				//	movesCount++;
				//	$(".movescounter").text(movesCount);
				//}
				E = 0;
                x.x = void 0;
                x.y = void 0;
                n = !1;
                k = null;
                c.removeEventListener("mousemove",
                    h);
                c.removeEventListener("touchmove", h);
                c.removeEventListener("mouseup", g);
                c.removeEventListener("touchend", g);
                c.removeEventListener("touchcancel", g);
                c.addEventListener("mousedown", f);
                c.addEventListener("touchstart", f)
            }
            var m = new ERNO.Projector(a, c),
                s = new THREE.Vector3,
                q, p, k, l, u, A = new THREE.Vector3,
                n = !1,
                w = new THREE.Plane,
                t = new THREE.Vector3,
                D = new THREE.Vector3,
                x = new THREE.Vector2;
            new THREE.Vector3;
            var r = new THREE.Vector3,
                C = 0,
                E = 0;
            x.x = void 0;
            x.y = void 0;
            var v = {
                active: !1,
                enabled: !0,
                multiDrag: e || !1,
                multiDragSnapArea: 100,
                dragSpeed: d || 1.3
            };
            THREE.EventDispatcher.prototype.apply(v);
            v.getIntersectionAt = function() {
                var a = new THREE.Vector3,
                    c = new THREE.Plane;
                return function(e, d) {
                    return null === m.getIntersection(b, e, d, a, c) ? null : {
                        cubelet: m.getCubeletAtIntersection(a),
                        face: 1 === c.normal.x ? "RIGHT" : -1 === c.normal.x ? "LEFT" : 1 === c.normal.y ? "UP" : -1 === c.normal.y ? "DOWN" : 1 === c.normal.z ? "FRONT" : "BACK"
                    }
                }
            }();
            v.update = function() {
                var c = x.x,
                    e = x.y;
				//Chris ... disabling the following prevents the user from dragging the rows and columns
                v.enabled && v.active && void 0 !== c && void 0 != e && (l !== c || u !== e) && (m.getIntersectionOnPlane(b, c, e, w, A),
                    t.subVectors(A, s), !n && 5 < t.length() && (k && (k.rotation = 0), n = !0, r.crossVectors(w.normal, t), c = Math.max(Math.abs(r.x), Math.abs(r.y), Math.abs(r.z)), r.x = r.x / c | 0, r.y = 1 === r.x ? 0 : r.y / c | 0, r.z = 1 === r.x || 1 === r.y ? 0 : r.z / c | 0, k = p[Math.abs(3 * r.z + 2 * r.y + r.x) - 1], D.crossVectors(k.axis, w.normal).normalize()), n && (t.subVectors(A, s), C = D.dot(t) / a.size * v.dragSpeed), k && (k.rotation = C))
            };
            c.addEventListener("mousedown", f);
            c.addEventListener("touchstart", f);
            var F = function(a, b) {
                    var c = this.getIntersectionAt(a, b);
                    return c ? (this.dispatchEvent(new CustomEvent("click", {
                        detail: c
                    })), !0) : !1
                }.bind(v),
                y, z;
            c.addEventListener("mousedown", function(a) {
                y = a.clientX;
                z = a.clientY
            });
            c.addEventListener("mouseup", function(a) {
                var b = a.clientX;
                a = a.clientY;
				//Chris...commenting out the following line disables click to rotate row/column function
                !n && Math.abs(Math.sqrt((b - y) * (b - y) + (a - z) * (a - z))) < 10 * (window.devicePixelratio || 1) && F(y, z)
            });
            c.addEventListener("touchstart", function(a) {
                y = a.touches[0].clientX;
                z = a.touches[0].clientY
            });
            c.addEventListener("touchend", function(a) {
				//Chris ... this is only called on touch devices
				console.log("touchend");
                var b = a.changedTouches[0].clientX,
                    c = a.changedTouches[0].clientY;
				
                !n && Math.abs(Math.sqrt((b - y) * (b - y) + (c - z) *
                    (c - z))) < 10 * (window.devicePixelratio || 1) && F(y, z) && a.preventDefault()
            });
            return v
        }
    }();
    ERNO.Controls = function() {
        var a, b;
        a = 0;
        b = 1;
        return function(c, d, e) {
            function f(b) {
                n.enabled && 1 === b.which && null === A.getIntersection(d, b.pageX, b.pageY) && (p = a, k.multiplyScalar(0), w(b.pageX, b.pageY, l), u.copy(l), n.domElement.removeEventListener("mousedown", f), document.addEventListener("mousemove", h), document.addEventListener("mouseup", g))
            }

            function h(b) {
                n.enabled && (b.preventDefault(), p = a, w(b.pageX, b.pageY, l), k.subVectors(l, u), u.copy(l))
            }

            function g(a) {
                document.removeEventListener("mousemove", h);
                document.removeEventListener("mouseup",
                    g);
                n.domElement.addEventListener("mousedown", f);
                n.enabled && (p = b)
            }

            function m(b) {
                n.enabled && null === A.getIntersection(d, b.touches[0].pageX, b.touches[0].pageY) && (p = a, k.multiplyScalar(0), w(b.touches[0].pageX, b.touches[0].pageY, l), u.copy(l), n.domElement.removeEventListener("touchstart", m), document.addEventListener("touchend", q), document.addEventListener("touchmove", s))
            }

            function s(b) {
                n.enabled && (p = a, w(b.changedTouches[0].pageX, b.changedTouches[0].pageY, l), k.subVectors(l, u), u.copy(l))
            }

            function q(a) {
                document.removeEventListener("touchend",
                    q);
                document.removeEventListener("touchmove", s);
                n.domElement.addEventListener("touchstart", m);
                n.enabled && (p = b)
            }
            var p = -1,
                k = new THREE.Vector2,
                l = new THREE.Vector2;
            new THREE.Vector2;
            var u = new THREE.Vector2,
                A = new ERNO.Projector(c, e),
                n = {
                    enabled: !0,
                    domElement: e,
                    rotationSpeed: 4,
                    damping: 0.25
                },
                w = function(a, b, c) {
                    var e;
                    e = n.domElement;
                    e = e !== document ? e.getBoundingClientRect() : {
                        left: 0,
                        top: 0,
                        width: window.innerWidth,
                        height: window.innerHeight
                    };
                    var d = window.devicePixelRatio || 1;
                    return c.set(0.001 * (a * d - e.width - e.left),
                        0.001 * (e.height + e.top - b * d))
                };
            n.update = function() {
                var e = new THREE.Vector3,
                    f = 0,
                    g = new THREE.Matrix4;
                return function() {
                    !1 !== n.enabled && -1 !== p && (e.set(k.y, -1 * k.x, 0).normalize(), g.getInverse(c.matrixWorld), g.multiply(d.matrixWorld), e.transformDirection(g), k.multiplyScalar(1 - Math.max(0, Math.min(1, n.damping))), f = k.length(), c.object3D.rotateOnAxis(e, -f * n.rotationSpeed), p === a ? p = -1 : p === b && 1E-4 <= f ? l.add(k) : p = -1)
                }
            }();
            n.domElement.addEventListener("mousedown", f);
            n.domElement.addEventListener("touchstart", m);
            return n
        }
    }();
    var SceneType = THREE.Scene;
    THREE.Scene = SceneType || function() {};
    ERNO.renderers = ERNO.renderers || {};
    ERNO.renderers.CSS3D = function(a, b) {
        function c(a) {
            a.style.display = "block"
        }

        function d(a) {
            a.style.display = "none"
        }

        function e() {
            return Array.prototype.slice.call(h.domElement.querySelectorAll(".faceLabel"))
        }

        function f() {
            if (b.domElement.parentNode) {
                var a = b.domElement.parentNode.clientWidth,
                    c = b.domElement.parentNode.clientHeight;
                !b.domElement.parentNode || b.domElement.clientWidth === a && b.domElement.clientHeight === c || b.setSize(a, c);
                h.render(g, b.camera)
            }
            requestAnimationFrame(f)
        }
        var h = new THREE.CSS3DRenderer,
            g = new THREE.Object3D;
        h.scene = g;
        g.add(b.autoRotateObj3D);
        g.add(b.camera);
        var m;
        new THREE.Vector3;
        b.faces.forEach(function(a, c) {
            m = b[a.face].label = new THREE.CSS3DObject(document.createElement("div"));
            m.element.classList.add("faceLabel");
            m.position.copy(a.axis).multiplyScalar(b.size);
            m.position.negate();
            m.element.innerHTML = a.face.toUpperCase();
            b.object3D.add(m)
        });
        b.right.label.rotation.y = 0.5 * Math.PI;
        b.left.label.rotation.y = -0.5 * Math.PI;
        b.back.label.rotation.y = Math.PI;
        b.up.label.rotation.x = -0.5 * Math.PI;
        b.down.label.rotation.x = 0.5 * Math.PI;
        b.showFaceLabels = function() {
            e().forEach(c);
            this.showingFaceLabels = !0;
            return this
        };
        b.hideFaceLabels = function() {
            e().forEach(d);
            this.showingFaceLabels = !1;
            return this
        };
        ERNO.extend(ERNO.Cubelet.prototype, ERNO.renderers.CSS3DCubelet.methods);
        a.forEach(ERNO.renderers.CSS3DCubelet);
        requestAnimationFrame(f);
        SceneType && (THREE.Scene = SceneType);
        return h
    };
    ERNO.renderers.CSS3DCubelet = function() {
        return function(a) {
            var b = document.createElement("div");
            b.classList.add("cubelet");
            b.classList.add("cubeletId-" + a.id);
            a.css3DObject = new THREE.CSS3DObject(b);
            a.css3DObject.name = "css3DObject-" + a.id;
            a.add(a.css3DObject);
            var b = a.size / 2,
                c = ["rotateX(   0deg ) translateZ( " + b + "px ) rotateZ(   0deg )", "rotateX(  90deg ) translateZ( " + b + "px ) rotateZ(   0deg )", "rotateY(  90deg ) translateZ( " + b + "px ) rotateZ(   0deg )", "rotateX( -90deg ) translateZ( " + b + "px ) rotateZ(  90deg )",
                    "rotateY( -90deg ) translateZ( " + b + "px ) rotateZ( -90deg )", "rotateY( 180deg ) translateZ( " + b + "px ) rotateZ( -90deg )"
                ],
                d = "axisZ axisY axisX axisY axisX axisZ".split(" ");
            a.faces.forEach(function(b) {
                b.element = document.createElement("div");
                b.element.classList.add("face");
                b.element.classList.add(d[b.id]);
                b.element.classList.add("face" + ERNO.Direction.getNameById(b.id).capitalize());
                a.css3DObject.element.appendChild(b.element);
                var f = document.createElement("div");
                f.classList.add("wireframe");
                b.element.appendChild(f);
                f = document.createElement("div");
                f.classList.add("id");
                b.element.appendChild(f);
                var h = document.createElement("span");
                h.classList.add("underline");
                h.innerText = a.id;
                f.appendChild(h);
                f = b.element.style;
                f.OTransform = f.MozTransform = f.WebkitTransform = f.transform = c[b.id];
                b.isIntrovert ? (b.element.classList.add("faceIntroverted"), b.element.appendChild(document.createElement("div"))) : (b.element.classList.add("faceExtroverted"), f = document.createElement("div"), f.classList.add("sticker"), f.classList.add(b.color.name),
                    b.element.appendChild(f), a.isStickerCubelet && f.classList.add("stickerLogo"), f = document.createElement("div"), f.classList.add("text"), f.innerText = b.id, b.text = f, b.element.appendChild(f))
            });
            a.show();
            a.showIntroverts();
            a.showPlastics();
            a.showStickers();
            a.hideIds();
            a.hideTexts();
            a.hideWireframes()
        }
    }();
    ERNO.renderers.CSS3DCubelet.methods = function() {
        function a(a) {
            a.style.display = "block"
        }

        function b(a) {
            a.style.display = "none"
        }
        return {
            getFaceElements: function(a) {
                return Array.prototype.slice.call(this.css3DObject.element.querySelectorAll(".face" + (a || "")))
            },
            show: function() {
                a(this.css3DObject.element);
                this.showing = !0
            },
            hide: function() {
                b(this.css3DObject.element);
                this.showing = !1
            },
            showExtroverts: function() {
                this.getFaceElements(".faceExtroverted").forEach(a);
                this.showingExtroverts = !0
            },
            hideExtroverts: function() {
                this.getFaceElements(".faceExtroverted").forEach(b);
                this.showingExtroverts = !1
            },
            showIntroverts: function() {
                var b = new THREE.Vector3,
                    d = new THREE.Matrix4,
                    e;
                return function(f, h) {
                    e = "";
                    f && (d.getInverse(this.matrix), b.copy(f).transformDirection(d), e = 1 === Math.abs(Math.round(b.x)) ? ".axisX" : 1 === Math.round(Math.abs(b.y)) ? ".axisY" : ".axisZ");
                    this.getFaceElements(".faceIntroverted" + (void 0 !== f ? e : "")).forEach(a);
                    h || (this.showingIntroverts = !0)
                }
            }(),
            hideIntroverts: function() {
                var a = new THREE.Vector3,
                    d = new THREE.Matrix4,
                    e;
                return function(f, h) {
                    e = "";
                    f && (d.getInverse(this.matrix),
                        a.copy(f).transformDirection(d), e = 1 === Math.abs(Math.round(a.x)) ? ".axisX" : 1 === Math.round(Math.abs(a.y)) ? ".axisY" : ".axisZ");
                    this.getFaceElements(".faceIntroverted" + (void 0 !== f ? e : "")).forEach(b);
                    h || (this.showingIntroverts = !1)
                }
            }(),
            showPlastics: function() {
                this.getFaceElements().forEach(function(a) {
                    a.classList.remove("faceTransparent")
                });
                this.showingPlastics = !0
            },
            hidePlastics: function() {
                this.getFaceElements().forEach(function(a) {
                    a.classList.add("faceTransparent")
                });
                this.showingPlastics = !1
            },
            hideStickers: function() {
                this.getFaceElements(" .sticker").forEach(b);
                this.showingStickers = !1
            },
            showStickers: function() {
                this.getFaceElements(" .sticker").forEach(a);
                this.showingStickers = !0
            },
            showWireframes: function() {
                this.getFaceElements(" .wireframe").forEach(a);
                this.showingWireframes = !0
            },
            hideWireframes: function() {
                this.getFaceElements(" .wireframe").forEach(b);
                this.showingWireframes = !1
            },
            showIds: function() {
                this.getFaceElements(" .id").forEach(a);
                this.showingIds = !0
            },
            hideIds: function() {
                this.getFaceElements(" .id").forEach(b);
                this.showingIds = !1
            },
            showTexts: function() {
                this.getFaceElements(" .text").forEach(a);
                this.showingTexts = !0
            },
            hideTexts: function() {
                this.getFaceElements(" .text").forEach(b);
                this.showingTexts = !1
            },
            getOpacity: function() {
                return this.opacity
            },
            setOpacity: function(a, b) {
                this.opacityTween && this.opacityTween.stop();
                void 0 === a && (a = 1);
                if (a !== this.opacity) {
                    var e = this,
                        f = (a - this.opacity).absolute().scale(0, 1, 0, 200);
                    this.opacityTween = (new TWEEN.Tween({
                        opacity: this.opacity
                    })).to({
                        opacity: a
                    }, f).easing(TWEEN.Easing.Quadratic.InOut).onUpdate(function() {
                        e.css3DObject.element.style.opacity = this.opacity;
                        e.opacity =
                            this.opacity
                    }).onComplete(function() {
                        b instanceof Function && b()
                    }).start()
                }
            },
            getStickersOpacity: function(a) {
                return parseFloat(this.getFaceElements(" .sticker")[0].style.opacity)
            },
            setStickersOpacity: function(a) {
                void 0 === a && (a = 0.2);
                var b = a;
                this.getFaceElements(" .sticker").forEach(function(a) {
                    a.style.opacity = b.toString()
                })
            }
        }
    }();
    ERNO.Cube = function(a) {
        ERNO.Group.call(this);
        a = a || {};
        this.paused = void 0 === a.paused ? !1 : a.paused;
        this.autoRotate = void 0 === a.autoRotate ? !1 : a.autoRotate;
        this.keyboardControlsEnabled = void 0 === a.keyboardControlsEnabled ? !0 : a.keyboardControlsEnabled;
        this.mouseControlsEnabled = void 0 === a.mouseControlsEnabled ? !0 : a.mouseControlsEnabled;
        var b = a.renderer || ERNO.renderers.CSS3D;
        a.textureSize = void 0 === a.textureSize ? 120 : a.textureSize;
        this.isShuffling = !1;//Chris maybe use this to avoid shuffling...no, it just indicates it is shuffling or not
        this.isReady = !0;
        this.undoing = this.isSolving = !1;
        this.render = !0;
        this.finalShuffle = null;
        this.hideInvisibleFaces = void 0 === a.hideInvisibleFaces ? !1 : a.hideInvisibleFaces;
        this.moveCounter = this.time = 0;
        this.taskQueue = new ERNO.Queue;
        this.twistQueue = new ERNO.Queue(ERNO.Twist.validate);
        this.historyQueue = new ERNO.Queue(ERNO.Twist.validate);//Chris...check this for initial randomization
        this.twistDuration = void 0 !== a.twistDuration ? a.twistDuration : 500;
        this.shuffleMethod = this.PRESERVE_LOGO;//Chris...didn't seem to change the shuffle 
        this.size = 3 * a.textureSize;//Chris ... this could allow for a different number of cubes
        this.cubeletSize = this.size / 3;
        this.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight,
            1, 6E3);
        this.camera.position.z = 4 * this.size;
        this.object3D = new THREE.Object3D;
        this.autoRotateObj3D = new THREE.Object3D;
        this.rotation = this.object3D.rotation;
        this.quaternion = this.object3D.quaternion;
        this.position = this.object3D.position;
        this.matrix = this.object3D.matrix;
        this.matrixWorld = this.object3D.matrixWorld;
        this.rotation.set(25 * Math.PI / 180, -30 * Math.PI / 180, 0);
        this.rotationDelta = new THREE.Euler(0.1 * Math.PI / 180, 0.15 * Math.PI / 180, 0);
		//CHRIS...i'm pretty sure this is the initial config
        this.cubelets = [];
        [
            [W, O, , , G],
            [W, O, , , , ],
            [W, O, B, , , ],
            [W, , , , G],
            [W, , , , , ],
            [W, , B, , , ],
            [W, , , R, G],
            [W, , , R, , ],
            [W, , B, R, , ],
            [, O, , , G],
            [, O, , , , ],
            [, O, B, , , ],
            [, , , , G],
            [, , , , , ],
            [, , B, , , ],
            [, , , R, G],
            [, , , R, , ],
            [, , B, R, , ],
            [, O, , , G, Y],
            [, O, , , , Y],
            [, O, B, , , Y],
            [, , , , G, Y],
            [, , , , , Y],
            [, , B, , , Y],
            [, , , R, G, Y],
            [, , , R, , Y],
            [, , B, R, , Y]
        ].forEach(function(a, b) {
            this.cubelets.push(new ERNO.Cubelet(this, b, a))
        }.bind(this));
        this.core = new ERNO.Group;
        this.centers = new ERNO.Group;
        this.edges = new ERNO.Group;
        this.corners = new ERNO.Group;
        this.crosses = new ERNO.Group;
        this.cubelets.forEach(function(a, b) {
            "core" === a.type && this.core.add(a);
            "center" ===
            a.type && this.centers.add(a);
            "edge" === a.type && this.edges.add(a);
            "corner" === a.type && this.corners.add(a);
            "center" !== a.type && "edge" !== a.type || this.crosses.add(a)
        }.bind(this));
        this.left = new ERNO.Slice([24, 21, 18, 15, 12, 9, 6, 3, 0], this);
        this.left.name = "left";
        this.middle = new ERNO.Slice([25, 22, 19, 16, 13, 10, 7, 4, 1], this);
        this.middle.name = "middle";
        this.right = new ERNO.Slice([2, 11, 20, 5, 14, 23, 8, 17, 26], this);
        this.right.name = "right";
        this.right.neighbour = this.middle;
        this.left.neighbour = this.middle;
        this.up = new ERNO.Slice([18,
            19, 20, 9, 10, 11, 0, 1, 2
        ], this);
        this.up.name = "up";
        this.equator = new ERNO.Slice([21, 22, 23, 12, 13, 14, 3, 4, 5], this);
        this.equator.name = "equator";
        this.down = new ERNO.Slice([8, 17, 26, 7, 16, 25, 6, 15, 24], this);
        this.down.name = "down";
        this.down.neighbour = this.equator;
        this.up.neighbour = this.equator;
        this.front = new ERNO.Slice([0, 1, 2, 3, 4, 5, 6, 7, 8], this);
        this.front.name = "front";
        this.standing = new ERNO.Slice([9, 10, 11, 12, 13, 14, 15, 16, 17], this);
        this.standing.name = "standing";
        this.back = new ERNO.Slice([26, 23, 20, 25, 22, 19, 24, 21, 18], this);
        this.back.name = "back";
        this.back.neighbour = this.standing;
        this.front.neighbour = this.standing;
        this.faces = [this.front, this.up, this.right, this.down, this.left, this.back];
        this.slices = [this.left, this.middle, this.right, this.down, this.equator, this.up, this.back, this.standing, this.front];
        var c = function(a) {
            this.dispatchEvent(new CustomEvent("onTwistComplete", {
                detail: {
                    slice: a.target
                }
            }))
        }.bind(this);
        this.slices.forEach(function(a) {
            a.addEventListener("change", c)
        });
        var d = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
            17, 18, 19, 20, 21, 22, 23, 24, 25, 26
        ];
        this.slicesDictionary = {
            f: this.front,
            s: this.standing,
            b: this.back,
            u: this.up,
            e: this.equator,
            d: this.down,
            r: this.right,
            m: this.middle,
            l: this.left,
            x: new ERNO.Slice(d, this),
            y: new ERNO.Slice(d, this),
            z: new ERNO.Slice(d, this)
        };
        this.slicesDictionary.x.ableToHideInternalFaces = !1;
        this.slicesDictionary.y.ableToHideInternalFaces = !1;
        this.slicesDictionary.z.ableToHideInternalFaces = !1;
        this.slicesDictionary.x.axis.set(-1, 0, 0);
        this.slicesDictionary.y.axis.set(0, -1, 0);
        this.slicesDictionary.z.axis.set(0,
            0, -1);
        this.cubelets.forEach(function(a, b) {
            a.setAddress(b)
        });
        this.renderer = b(this.cubelets, this);
        this.domElement = this.renderer.domElement;
        this.domElement.classList.add("cube");
        this.domElement.style.fontSize = this.cubeletSize + "px";
        this.autoRotateObj3D.add(this.object3D);
        this.hideInvisibleFaces && this.hideIntroverts(null, !0);
        this.mouseInteraction = new ERNO.Interaction(this, this.camera, this.domElement);
        this.mouseInteraction.addEventListener("click", function(a) {
            this.dispatchEvent(new CustomEvent("click", {
                detail: a.detail
            }))
        }.bind(this));
        this.controls = new(a.controls || ERNO.Controls)(this, this.camera, this.domElement);
        this.folds = [new ERNO.Fold(this.front, this.right), new ERNO.Fold(this.left, this.up), new ERNO.Fold(this.down, this.back)];
        this.setSize(400, 200);//Chris...
        this.loop = this.loop.bind(this);
        requestAnimationFrame(this.loop);
        document.addEventListener("keypress", function(a) {
            "input" !== a.target.tagName.toLowerCase() && "textarea" !== a.target.tagName.toLowerCase() && !this.mouseInteraction.active && this.keyboardControlsEnabled &&
                (a = String.fromCharCode(a.which), 0 <= "XxRrMmLlYyUuEeDdZzFfSsBb".indexOf(a) && this.twist(a))
        }.bind(this))
    };
    ERNO.Cube.prototype = Object.create(ERNO.Group.prototype);
    ERNO.Cube.prototype.constructor = ERNO.Cube;
    ERNO.extend(ERNO.Cube.prototype, {
        shuffle: function(a, b) {//chris...something to do with shuffle,couldn't figure out what
            a = a || 30;
            b = b || "";
            var c = this.shuffleMethod.slice(),
                d, e = new ERNO.Twist,
                f, h = b.length,
                g = 0;
            this.twistQueue.empty(!0);
            for (this.historyQueue.empty(!0); 0 < a--;) {
                if (b) d.set(b[g]), g = (g + 1) % h;
                else
                    for (f = c.split(""), d = (new ERNO.Twist).copy(e); d.equals(e);) d.set(f.splice(Math.floor(Math.random() * f.length), 1)[0]);
                d.isShuffle = !0;
                this.twist(d);
                e = d.getInverse()
            }
            this.finalShuffle = d
        },
        solve: function() {
            this.isSolving = !0
        },
        isSolved: function() {
            return this.front.isSolved(ERNO.Direction.FRONT) &&
                this.up.isSolved(ERNO.Direction.UP) && this.right.isSolved(ERNO.Direction.RIGHT) && this.down.isSolved(ERNO.Direction.DOWN) && this.left.isSolved(ERNO.Direction.LEFT) && this.back.isSolved(ERNO.Direction.BACK)
        },
        undo: function() {
            0 < this.twistQueue.history.length && (this.historyQueue.add(this.twistQueue.undo().getInverse()), this.undoing = !0)
        },
        redo: function() {
            0 < this.twistQueue.future.length && (this.undoing = !0, this.historyQueue.empty(), this.historyQueue.add(this.twistQueue.redo()))
        },
        twist: function(a) {
			//console.log("Twist:" + JSON.stringify(a));//chris 
			if(a === ""){//chris...errors from trying to twist an empty and it's easiest to just catch the call than have cleaner code
				return;
			}
			
            this.undoing &&
                this.twistQueue.empty();
            this.historyQueue.empty();
            this.undoing = !1;
            this.twistQueue.add(a)
        },
        immediateTwist: function(a) {
			//console.log("ImmedTwist:" + a["command"] );//JSON.stringify(a) chris 
			
			if(a === ""){//chris...errors from trying to twist an empty and it's easiest to just catch the call than have cleaner code
				return;
			}
			
			//Chris added to save moves
			if(initializedSequence){
				//Don't play move sounds until after initialization because this is called many times at once and it creates an awful sound
				playAudio('move');
				
				//If not moving at least 90 degrees then ignore the twist; if moving more than 90, it means multiple turns, so record multiple twists,
				//otherwise the saved state gets completely out of sync with the current state
				lastMove = '';	
				var degs = a.degrees == null ? 90 : a.degrees;//tapping a row or column results in a.degrees=undefined; but we know it is one rotation
				var rotations = degs/90;
				rotatingCube = a["command"] == "x" || a["command"] == "y" || a["command"] == "z" || a["command"] == "X" || a["command"] == "Y" || a["command"] == "Z"? true : false;
								
				for(i = 0; i < rotations; i++){
					lastMove += a["command"];
					if(!rotatingCube){
						//Don't count when we are moving to see different angles						
						movesCount++;		
					}					
				}
				rotatingCube = false;
				chrome.storage.sync.set({'movesCount':movesCount});
				$(".movescounter").text(movesCount);
				console.log("LastMove:"+lastMove+",degs:"+degs);
				console.log("Executing a twist command to rotate the " + a.group + " " + a.wise + " by", a.degrees, "degrees...move:" + JSON.stringify(a));
				
				
				//Chris added to record all twists-on the cube and of the cube; this allows for the previous state to be displayed upon open re-opening the popup
				//Code is here instead of onTwistComplete because that is called after the twist finishes being visualized, which could cause savedSequence
				//to get updated since initializedSequence would have already been set to true
				  if(lastMove != null && lastMove != '' && savedSequence != null && savedSequence != ''){		  
						//This is only called when a twist registered, not just when the cube is tweened back into place
						savedSequence = savedSequence + lastMove;
						chrome.storage.sync.set({'sequenceToRestore':savedSequence});
						console.log("TwistComplete...lastmove..."+lastMove + ",seq:" + savedSequence);
				  }
				
			}		
			
			0.8 <= this.verbosity && console.log("Executing a twist command to rotate the " + a.group + " " + a.wise + " by", a.degrees, "degrees.");
            for (var b = this.slicesDictionary[a.command.toLowerCase()], c = (void 0 === a.degrees ? 90 : a.degrees) * a.vector, d = c.degreesToRadians(), e = Math.abs(d - b.rotation) / (0.5 * Math.PI) * this.twistDuration, f = b.indices.length, h; 0 < f--;) b.getCubelet(f).isTweening = !0;
            (new TWEEN.Tween(b)).to({
                    rotation: d
                },
                e).easing(TWEEN.Easing.Quartic.Out).onComplete(function() {
                b.rotation = d;
                b.axis.rotation = 0;
                for (f = b.indices.length; 0 < f--;) h = b.getCubelet(f), h.isTweening = !1, h.updateMatrix(), h.matrixSlice.copy(h.matrix);
                0 !== c && (b.rotateGroupMappingOnAxis(d), this.dispatchEvent(new CustomEvent("onTwistComplete", {
                    detail: {
                        slice: b,
                        twist: a
                    }
                })));
                a === this.finalShuffle && (this.finalShuffle = null, this.dispatchEvent(new CustomEvent("onShuffleComplete", {
                    detail: {
                        slice: b,
                        twist: a
                    }
                })))
            }.bind(this)).start(this.time)
        },
        getText: function(a) {
            if (void 0 ===
                a) return [this.folds[0].getText(), this.folds[1].getText(), this.folds[2].getText()];
            if (_.isNumeric(a) && 0 <= a && 2 >= a) return this.folds[a].getText()
        },
        setText: function(a, b) {
            void 0 === b ? (this.folds[0].setText(a), this.folds[1].setText(a), this.folds[2].setText(a)) : _.isNumeric(b) && 0 <= b && 2 >= b && this.folds[b].setText(a)
        },
        setSize: function(a, b) {
            this.camera.aspect = a / b;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(a, b)
        },
        PRESERVE_LOGO: "RrLlUuDdSsBb",//Chris ... this is the initial pattern!
        ALL_SLICES: "RrMmLlUuEeDdFfSsBb",//Chris ... this is another option for the initial pattern
        EVERYTHING: "XxRrMmLlYyUuEeDdZzFfSsBb",
		NO_SHUFFLE: "U",//Chris added for no shuffle
        loop: function() {
            var a = 0;
            return function() {
                requestAnimationFrame(this.loop);
                var b = "undefined" !== typeof window && void 0 !== window.performance && void 0 !== window.performance.now ? window.performance.now() : Date.now(),
                    c = b - (a || b);
                a = b;
                this.paused || (this.time += c, TWEEN.update(this.time), this.autoRotate && (this.rotation.x += this.rotationDelta.x, this.rotation.y += this.rotationDelta.y, this.rotation.z += this.rotationDelta.z), this.isReady && 0 === this.isTweening() && (b = this.undoing ? this.historyQueue : this.twistQueue, 0 === b.future.length ?
                        this.isSolving && window.solver ? this.isSolving = window.solver.consider(this) : !0 === this.taskQueue.isReady && (b = this.taskQueue.do(), b instanceof Function && b()) : (c = b.do(), "x" !== c.command.toLowerCase() && "y" !== c.command.toLowerCase() && "z" !== c.command.toLowerCase() && 0 !== c.degrees && (this.moveCounter += this.undoing ? -1 : 1), (0 === c.degrees || c.isShuffle) && b.purge(c), this.immediateTwist(c))), this.mouseInteraction.enabled = this.mouseControlsEnabled && !this.finalShuffle, this.mouseInteraction.update(), this.controls.enabled =
                    this.mouseControlsEnabled && !this.mouseInteraction.active, this.controls.update())
				//chris ... this is where the moves count actually gets updated by original code. Move count does not get updated when rotating the entire cube
				//console.log("Loop...isUndoing:" + this.undoing + " ...cnt" + this.moveCounter);
            }
        }()
    });
    ERNO.Solver = function() {
        this.logic = function(a) {
            return !1
        }
    };
    ERNO.Solver.prototype.consider = function(a) {
        if (void 0 === a) return console.warn("A cube [Cube] argument must be specified for Solver.consider()."), !1;
        if (!1 === a instanceof ERNO.Cube) return console.warn("The cube argument provided is not a valid Cube."), !1;
        a.isShuffling = !1;
        return a.isSolved() ? (ERNO.Solver.prototype.explain("I\u2019ve found that the cube is already solved."), !1) : this.logic(a)
    };
    ERNO.Solver.prototype.hint = function(a) {
        console.log("%c" + a + "%c\n", "background-color: #EEE; color: #333", "")
    };
    ERNO.Solver.prototype.explain = function(a) {
        console.log("Solver says: %c " + a + " %c\n", "color: #080", "")
    };
    window.ERNO = ERNO;
    window._ = _;
    window.TWEEN = window.TWEEN || TWEEN;
    window.THREE = window.THREE || THREE;
}())