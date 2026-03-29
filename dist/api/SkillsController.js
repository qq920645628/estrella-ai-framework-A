var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/logform/format.js
var require_format = __commonJS({
  "node_modules/logform/format.js"(exports2, module2) {
    "use strict";
    var InvalidFormatError = class _InvalidFormatError extends Error {
      constructor(formatFn) {
        super(`Format functions must be synchronous taking a two arguments: (info, opts)
Found: ${formatFn.toString().split("\n")[0]}
`);
        Error.captureStackTrace(this, _InvalidFormatError);
      }
    };
    module2.exports = (formatFn) => {
      if (formatFn.length > 2) {
        throw new InvalidFormatError(formatFn);
      }
      function Format(options = {}) {
        this.options = options;
      }
      Format.prototype.transform = formatFn;
      function createFormatWrap(opts) {
        return new Format(opts);
      }
      createFormatWrap.Format = Format;
      return createFormatWrap;
    };
  }
});

// node_modules/@colors/colors/lib/styles.js
var require_styles = __commonJS({
  "node_modules/@colors/colors/lib/styles.js"(exports2, module2) {
    var styles = {};
    module2["exports"] = styles;
    var codes = {
      reset: [0, 0],
      bold: [1, 22],
      dim: [2, 22],
      italic: [3, 23],
      underline: [4, 24],
      inverse: [7, 27],
      hidden: [8, 28],
      strikethrough: [9, 29],
      black: [30, 39],
      red: [31, 39],
      green: [32, 39],
      yellow: [33, 39],
      blue: [34, 39],
      magenta: [35, 39],
      cyan: [36, 39],
      white: [37, 39],
      gray: [90, 39],
      grey: [90, 39],
      brightRed: [91, 39],
      brightGreen: [92, 39],
      brightYellow: [93, 39],
      brightBlue: [94, 39],
      brightMagenta: [95, 39],
      brightCyan: [96, 39],
      brightWhite: [97, 39],
      bgBlack: [40, 49],
      bgRed: [41, 49],
      bgGreen: [42, 49],
      bgYellow: [43, 49],
      bgBlue: [44, 49],
      bgMagenta: [45, 49],
      bgCyan: [46, 49],
      bgWhite: [47, 49],
      bgGray: [100, 49],
      bgGrey: [100, 49],
      bgBrightRed: [101, 49],
      bgBrightGreen: [102, 49],
      bgBrightYellow: [103, 49],
      bgBrightBlue: [104, 49],
      bgBrightMagenta: [105, 49],
      bgBrightCyan: [106, 49],
      bgBrightWhite: [107, 49],
      // legacy styles for colors pre v1.0.0
      blackBG: [40, 49],
      redBG: [41, 49],
      greenBG: [42, 49],
      yellowBG: [43, 49],
      blueBG: [44, 49],
      magentaBG: [45, 49],
      cyanBG: [46, 49],
      whiteBG: [47, 49]
    };
    Object.keys(codes).forEach(function(key) {
      var val = codes[key];
      var style = styles[key] = [];
      style.open = "\x1B[" + val[0] + "m";
      style.close = "\x1B[" + val[1] + "m";
    });
  }
});

// node_modules/@colors/colors/lib/system/has-flag.js
var require_has_flag = __commonJS({
  "node_modules/@colors/colors/lib/system/has-flag.js"(exports2, module2) {
    "use strict";
    module2.exports = function(flag, argv) {
      argv = argv || process.argv || [];
      var terminatorPos = argv.indexOf("--");
      var prefix = /^-{1,2}/.test(flag) ? "" : "--";
      var pos = argv.indexOf(prefix + flag);
      return pos !== -1 && (terminatorPos === -1 ? true : pos < terminatorPos);
    };
  }
});

// node_modules/@colors/colors/lib/system/supports-colors.js
var require_supports_colors = __commonJS({
  "node_modules/@colors/colors/lib/system/supports-colors.js"(exports2, module2) {
    "use strict";
    var os = require("os");
    var hasFlag = require_has_flag();
    var env = process.env;
    var forceColor = void 0;
    if (hasFlag("no-color") || hasFlag("no-colors") || hasFlag("color=false")) {
      forceColor = false;
    } else if (hasFlag("color") || hasFlag("colors") || hasFlag("color=true") || hasFlag("color=always")) {
      forceColor = true;
    }
    if ("FORCE_COLOR" in env) {
      forceColor = env.FORCE_COLOR.length === 0 || parseInt(env.FORCE_COLOR, 10) !== 0;
    }
    function translateLevel(level) {
      if (level === 0) {
        return false;
      }
      return {
        level,
        hasBasic: true,
        has256: level >= 2,
        has16m: level >= 3
      };
    }
    function supportsColor(stream) {
      if (forceColor === false) {
        return 0;
      }
      if (hasFlag("color=16m") || hasFlag("color=full") || hasFlag("color=truecolor")) {
        return 3;
      }
      if (hasFlag("color=256")) {
        return 2;
      }
      if (stream && !stream.isTTY && forceColor !== true) {
        return 0;
      }
      var min = forceColor ? 1 : 0;
      if (process.platform === "win32") {
        var osRelease = os.release().split(".");
        if (Number(process.versions.node.split(".")[0]) >= 8 && Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
          return Number(osRelease[2]) >= 14931 ? 3 : 2;
        }
        return 1;
      }
      if ("CI" in env) {
        if (["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI"].some(function(sign) {
          return sign in env;
        }) || env.CI_NAME === "codeship") {
          return 1;
        }
        return min;
      }
      if ("TEAMCITY_VERSION" in env) {
        return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
      }
      if ("TERM_PROGRAM" in env) {
        var version = parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
        switch (env.TERM_PROGRAM) {
          case "iTerm.app":
            return version >= 3 ? 3 : 2;
          case "Hyper":
            return 3;
          case "Apple_Terminal":
            return 2;
        }
      }
      if (/-256(color)?$/i.test(env.TERM)) {
        return 2;
      }
      if (/^screen|^xterm|^vt100|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
        return 1;
      }
      if ("COLORTERM" in env) {
        return 1;
      }
      if (env.TERM === "dumb") {
        return min;
      }
      return min;
    }
    function getSupportLevel(stream) {
      var level = supportsColor(stream);
      return translateLevel(level);
    }
    module2.exports = {
      supportsColor: getSupportLevel,
      stdout: getSupportLevel(process.stdout),
      stderr: getSupportLevel(process.stderr)
    };
  }
});

// node_modules/@colors/colors/lib/custom/trap.js
var require_trap = __commonJS({
  "node_modules/@colors/colors/lib/custom/trap.js"(exports2, module2) {
    module2["exports"] = function runTheTrap(text, options) {
      var result = "";
      text = text || "Run the trap, drop the bass";
      text = text.split("");
      var trap = {
        a: ["@", "\u0104", "\u023A", "\u0245", "\u0394", "\u039B", "\u0414"],
        b: ["\xDF", "\u0181", "\u0243", "\u026E", "\u03B2", "\u0E3F"],
        c: ["\xA9", "\u023B", "\u03FE"],
        d: ["\xD0", "\u018A", "\u0500", "\u0501", "\u0502", "\u0503"],
        e: [
          "\xCB",
          "\u0115",
          "\u018E",
          "\u0258",
          "\u03A3",
          "\u03BE",
          "\u04BC",
          "\u0A6C"
        ],
        f: ["\u04FA"],
        g: ["\u0262"],
        h: ["\u0126", "\u0195", "\u04A2", "\u04BA", "\u04C7", "\u050A"],
        i: ["\u0F0F"],
        j: ["\u0134"],
        k: ["\u0138", "\u04A0", "\u04C3", "\u051E"],
        l: ["\u0139"],
        m: ["\u028D", "\u04CD", "\u04CE", "\u0520", "\u0521", "\u0D69"],
        n: ["\xD1", "\u014B", "\u019D", "\u0376", "\u03A0", "\u048A"],
        o: [
          "\xD8",
          "\xF5",
          "\xF8",
          "\u01FE",
          "\u0298",
          "\u047A",
          "\u05DD",
          "\u06DD",
          "\u0E4F"
        ],
        p: ["\u01F7", "\u048E"],
        q: ["\u09CD"],
        r: ["\xAE", "\u01A6", "\u0210", "\u024C", "\u0280", "\u042F"],
        s: ["\xA7", "\u03DE", "\u03DF", "\u03E8"],
        t: ["\u0141", "\u0166", "\u0373"],
        u: ["\u01B1", "\u054D"],
        v: ["\u05D8"],
        w: ["\u0428", "\u0460", "\u047C", "\u0D70"],
        x: ["\u04B2", "\u04FE", "\u04FC", "\u04FD"],
        y: ["\xA5", "\u04B0", "\u04CB"],
        z: ["\u01B5", "\u0240"]
      };
      text.forEach(function(c) {
        c = c.toLowerCase();
        var chars = trap[c] || [" "];
        var rand = Math.floor(Math.random() * chars.length);
        if (typeof trap[c] !== "undefined") {
          result += trap[c][rand];
        } else {
          result += c;
        }
      });
      return result;
    };
  }
});

// node_modules/@colors/colors/lib/custom/zalgo.js
var require_zalgo = __commonJS({
  "node_modules/@colors/colors/lib/custom/zalgo.js"(exports2, module2) {
    module2["exports"] = function zalgo(text, options) {
      text = text || "   he is here   ";
      var soul = {
        "up": [
          "\u030D",
          "\u030E",
          "\u0304",
          "\u0305",
          "\u033F",
          "\u0311",
          "\u0306",
          "\u0310",
          "\u0352",
          "\u0357",
          "\u0351",
          "\u0307",
          "\u0308",
          "\u030A",
          "\u0342",
          "\u0313",
          "\u0308",
          "\u034A",
          "\u034B",
          "\u034C",
          "\u0303",
          "\u0302",
          "\u030C",
          "\u0350",
          "\u0300",
          "\u0301",
          "\u030B",
          "\u030F",
          "\u0312",
          "\u0313",
          "\u0314",
          "\u033D",
          "\u0309",
          "\u0363",
          "\u0364",
          "\u0365",
          "\u0366",
          "\u0367",
          "\u0368",
          "\u0369",
          "\u036A",
          "\u036B",
          "\u036C",
          "\u036D",
          "\u036E",
          "\u036F",
          "\u033E",
          "\u035B",
          "\u0346",
          "\u031A"
        ],
        "down": [
          "\u0316",
          "\u0317",
          "\u0318",
          "\u0319",
          "\u031C",
          "\u031D",
          "\u031E",
          "\u031F",
          "\u0320",
          "\u0324",
          "\u0325",
          "\u0326",
          "\u0329",
          "\u032A",
          "\u032B",
          "\u032C",
          "\u032D",
          "\u032E",
          "\u032F",
          "\u0330",
          "\u0331",
          "\u0332",
          "\u0333",
          "\u0339",
          "\u033A",
          "\u033B",
          "\u033C",
          "\u0345",
          "\u0347",
          "\u0348",
          "\u0349",
          "\u034D",
          "\u034E",
          "\u0353",
          "\u0354",
          "\u0355",
          "\u0356",
          "\u0359",
          "\u035A",
          "\u0323"
        ],
        "mid": [
          "\u0315",
          "\u031B",
          "\u0300",
          "\u0301",
          "\u0358",
          "\u0321",
          "\u0322",
          "\u0327",
          "\u0328",
          "\u0334",
          "\u0335",
          "\u0336",
          "\u035C",
          "\u035D",
          "\u035E",
          "\u035F",
          "\u0360",
          "\u0362",
          "\u0338",
          "\u0337",
          "\u0361",
          " \u0489"
        ]
      };
      var all = [].concat(soul.up, soul.down, soul.mid);
      function randomNumber(range) {
        var r = Math.floor(Math.random() * range);
        return r;
      }
      function isChar(character) {
        var bool = false;
        all.filter(function(i) {
          bool = i === character;
        });
        return bool;
      }
      function heComes(text2, options2) {
        var result = "";
        var counts;
        var l;
        options2 = options2 || {};
        options2["up"] = typeof options2["up"] !== "undefined" ? options2["up"] : true;
        options2["mid"] = typeof options2["mid"] !== "undefined" ? options2["mid"] : true;
        options2["down"] = typeof options2["down"] !== "undefined" ? options2["down"] : true;
        options2["size"] = typeof options2["size"] !== "undefined" ? options2["size"] : "maxi";
        text2 = text2.split("");
        for (l in text2) {
          if (isChar(l)) {
            continue;
          }
          result = result + text2[l];
          counts = { "up": 0, "down": 0, "mid": 0 };
          switch (options2.size) {
            case "mini":
              counts.up = randomNumber(8);
              counts.mid = randomNumber(2);
              counts.down = randomNumber(8);
              break;
            case "maxi":
              counts.up = randomNumber(16) + 3;
              counts.mid = randomNumber(4) + 1;
              counts.down = randomNumber(64) + 3;
              break;
            default:
              counts.up = randomNumber(8) + 1;
              counts.mid = randomNumber(6) / 2;
              counts.down = randomNumber(8) + 1;
              break;
          }
          var arr = ["up", "mid", "down"];
          for (var d in arr) {
            var index = arr[d];
            for (var i = 0; i <= counts[index]; i++) {
              if (options2[index]) {
                result = result + soul[index][randomNumber(soul[index].length)];
              }
            }
          }
        }
        return result;
      }
      return heComes(text, options);
    };
  }
});

// node_modules/@colors/colors/lib/maps/america.js
var require_america = __commonJS({
  "node_modules/@colors/colors/lib/maps/america.js"(exports2, module2) {
    module2["exports"] = function(colors) {
      return function(letter, i, exploded) {
        if (letter === " ") return letter;
        switch (i % 3) {
          case 0:
            return colors.red(letter);
          case 1:
            return colors.white(letter);
          case 2:
            return colors.blue(letter);
        }
      };
    };
  }
});

// node_modules/@colors/colors/lib/maps/zebra.js
var require_zebra = __commonJS({
  "node_modules/@colors/colors/lib/maps/zebra.js"(exports2, module2) {
    module2["exports"] = function(colors) {
      return function(letter, i, exploded) {
        return i % 2 === 0 ? letter : colors.inverse(letter);
      };
    };
  }
});

// node_modules/@colors/colors/lib/maps/rainbow.js
var require_rainbow = __commonJS({
  "node_modules/@colors/colors/lib/maps/rainbow.js"(exports2, module2) {
    module2["exports"] = function(colors) {
      var rainbowColors = ["red", "yellow", "green", "blue", "magenta"];
      return function(letter, i, exploded) {
        if (letter === " ") {
          return letter;
        } else {
          return colors[rainbowColors[i++ % rainbowColors.length]](letter);
        }
      };
    };
  }
});

// node_modules/@colors/colors/lib/maps/random.js
var require_random = __commonJS({
  "node_modules/@colors/colors/lib/maps/random.js"(exports2, module2) {
    module2["exports"] = function(colors) {
      var available = [
        "underline",
        "inverse",
        "grey",
        "yellow",
        "red",
        "green",
        "blue",
        "white",
        "cyan",
        "magenta",
        "brightYellow",
        "brightRed",
        "brightGreen",
        "brightBlue",
        "brightWhite",
        "brightCyan",
        "brightMagenta"
      ];
      return function(letter, i, exploded) {
        return letter === " " ? letter : colors[available[Math.round(Math.random() * (available.length - 2))]](letter);
      };
    };
  }
});

// node_modules/@colors/colors/lib/colors.js
var require_colors = __commonJS({
  "node_modules/@colors/colors/lib/colors.js"(exports2, module2) {
    var colors = {};
    module2["exports"] = colors;
    colors.themes = {};
    var util = require("util");
    var ansiStyles = colors.styles = require_styles();
    var defineProps = Object.defineProperties;
    var newLineRegex = new RegExp(/[\r\n]+/g);
    colors.supportsColor = require_supports_colors().supportsColor;
    if (typeof colors.enabled === "undefined") {
      colors.enabled = colors.supportsColor() !== false;
    }
    colors.enable = function() {
      colors.enabled = true;
    };
    colors.disable = function() {
      colors.enabled = false;
    };
    colors.stripColors = colors.strip = function(str) {
      return ("" + str).replace(/\x1B\[\d+m/g, "");
    };
    var stylize = colors.stylize = function stylize2(str, style) {
      if (!colors.enabled) {
        return str + "";
      }
      var styleMap = ansiStyles[style];
      if (!styleMap && style in colors) {
        return colors[style](str);
      }
      return styleMap.open + str + styleMap.close;
    };
    var matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;
    var escapeStringRegexp = function(str) {
      if (typeof str !== "string") {
        throw new TypeError("Expected a string");
      }
      return str.replace(matchOperatorsRe, "\\$&");
    };
    function build(_styles) {
      var builder = function builder2() {
        return applyStyle.apply(builder2, arguments);
      };
      builder._styles = _styles;
      builder.__proto__ = proto;
      return builder;
    }
    var styles = (function() {
      var ret = {};
      ansiStyles.grey = ansiStyles.gray;
      Object.keys(ansiStyles).forEach(function(key) {
        ansiStyles[key].closeRe = new RegExp(escapeStringRegexp(ansiStyles[key].close), "g");
        ret[key] = {
          get: function() {
            return build(this._styles.concat(key));
          }
        };
      });
      return ret;
    })();
    var proto = defineProps(function colors2() {
    }, styles);
    function applyStyle() {
      var args = Array.prototype.slice.call(arguments);
      var str = args.map(function(arg) {
        if (arg != null && arg.constructor === String) {
          return arg;
        } else {
          return util.inspect(arg);
        }
      }).join(" ");
      if (!colors.enabled || !str) {
        return str;
      }
      var newLinesPresent = str.indexOf("\n") != -1;
      var nestedStyles = this._styles;
      var i = nestedStyles.length;
      while (i--) {
        var code = ansiStyles[nestedStyles[i]];
        str = code.open + str.replace(code.closeRe, code.open) + code.close;
        if (newLinesPresent) {
          str = str.replace(newLineRegex, function(match) {
            return code.close + match + code.open;
          });
        }
      }
      return str;
    }
    colors.setTheme = function(theme) {
      if (typeof theme === "string") {
        console.log("colors.setTheme now only accepts an object, not a string.  If you are trying to set a theme from a file, it is now your (the caller's) responsibility to require the file.  The old syntax looked like colors.setTheme(__dirname + '/../themes/generic-logging.js'); The new syntax looks like colors.setTheme(require(__dirname + '/../themes/generic-logging.js'));");
        return;
      }
      for (var style in theme) {
        (function(style2) {
          colors[style2] = function(str) {
            if (typeof theme[style2] === "object") {
              var out = str;
              for (var i in theme[style2]) {
                out = colors[theme[style2][i]](out);
              }
              return out;
            }
            return colors[theme[style2]](str);
          };
        })(style);
      }
    };
    function init() {
      var ret = {};
      Object.keys(styles).forEach(function(name) {
        ret[name] = {
          get: function() {
            return build([name]);
          }
        };
      });
      return ret;
    }
    var sequencer = function sequencer2(map2, str) {
      var exploded = str.split("");
      exploded = exploded.map(map2);
      return exploded.join("");
    };
    colors.trap = require_trap();
    colors.zalgo = require_zalgo();
    colors.maps = {};
    colors.maps.america = require_america()(colors);
    colors.maps.zebra = require_zebra()(colors);
    colors.maps.rainbow = require_rainbow()(colors);
    colors.maps.random = require_random()(colors);
    for (map in colors.maps) {
      (function(map2) {
        colors[map2] = function(str) {
          return sequencer(colors.maps[map2], str);
        };
      })(map);
    }
    var map;
    defineProps(colors, init());
  }
});

// node_modules/@colors/colors/safe.js
var require_safe = __commonJS({
  "node_modules/@colors/colors/safe.js"(exports2, module2) {
    var colors = require_colors();
    module2["exports"] = colors;
  }
});

// node_modules/triple-beam/config/cli.js
var require_cli = __commonJS({
  "node_modules/triple-beam/config/cli.js"(exports2) {
    "use strict";
    exports2.levels = {
      error: 0,
      warn: 1,
      help: 2,
      data: 3,
      info: 4,
      debug: 5,
      prompt: 6,
      verbose: 7,
      input: 8,
      silly: 9
    };
    exports2.colors = {
      error: "red",
      warn: "yellow",
      help: "cyan",
      data: "grey",
      info: "green",
      debug: "blue",
      prompt: "grey",
      verbose: "cyan",
      input: "grey",
      silly: "magenta"
    };
  }
});

// node_modules/triple-beam/config/npm.js
var require_npm = __commonJS({
  "node_modules/triple-beam/config/npm.js"(exports2) {
    "use strict";
    exports2.levels = {
      error: 0,
      warn: 1,
      info: 2,
      http: 3,
      verbose: 4,
      debug: 5,
      silly: 6
    };
    exports2.colors = {
      error: "red",
      warn: "yellow",
      info: "green",
      http: "green",
      verbose: "cyan",
      debug: "blue",
      silly: "magenta"
    };
  }
});

// node_modules/triple-beam/config/syslog.js
var require_syslog = __commonJS({
  "node_modules/triple-beam/config/syslog.js"(exports2) {
    "use strict";
    exports2.levels = {
      emerg: 0,
      alert: 1,
      crit: 2,
      error: 3,
      warning: 4,
      notice: 5,
      info: 6,
      debug: 7
    };
    exports2.colors = {
      emerg: "red",
      alert: "yellow",
      crit: "red",
      error: "red",
      warning: "red",
      notice: "yellow",
      info: "green",
      debug: "blue"
    };
  }
});

// node_modules/triple-beam/config/index.js
var require_config = __commonJS({
  "node_modules/triple-beam/config/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "cli", {
      value: require_cli()
    });
    Object.defineProperty(exports2, "npm", {
      value: require_npm()
    });
    Object.defineProperty(exports2, "syslog", {
      value: require_syslog()
    });
  }
});

// node_modules/triple-beam/index.js
var require_triple_beam = __commonJS({
  "node_modules/triple-beam/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "LEVEL", {
      value: /* @__PURE__ */ Symbol.for("level")
    });
    Object.defineProperty(exports2, "MESSAGE", {
      value: /* @__PURE__ */ Symbol.for("message")
    });
    Object.defineProperty(exports2, "SPLAT", {
      value: /* @__PURE__ */ Symbol.for("splat")
    });
    Object.defineProperty(exports2, "configs", {
      value: require_config()
    });
  }
});

// node_modules/logform/colorize.js
var require_colorize = __commonJS({
  "node_modules/logform/colorize.js"(exports2, module2) {
    "use strict";
    var colors = require_safe();
    var { LEVEL, MESSAGE } = require_triple_beam();
    colors.enabled = true;
    var hasSpace = /\s+/;
    var Colorizer = class _Colorizer {
      constructor(opts = {}) {
        if (opts.colors) {
          this.addColors(opts.colors);
        }
        this.options = opts;
      }
      /*
       * Adds the colors Object to the set of allColors
       * known by the Colorizer
       *
       * @param {Object} colors Set of color mappings to add.
       */
      static addColors(clrs) {
        const nextColors = Object.keys(clrs).reduce((acc, level) => {
          acc[level] = hasSpace.test(clrs[level]) ? clrs[level].split(hasSpace) : clrs[level];
          return acc;
        }, {});
        _Colorizer.allColors = Object.assign({}, _Colorizer.allColors || {}, nextColors);
        return _Colorizer.allColors;
      }
      /*
       * Adds the colors Object to the set of allColors
       * known by the Colorizer
       *
       * @param {Object} colors Set of color mappings to add.
       */
      addColors(clrs) {
        return _Colorizer.addColors(clrs);
      }
      /*
       * function colorize (lookup, level, message)
       * Performs multi-step colorization using @colors/colors/safe
       */
      colorize(lookup, level, message) {
        if (typeof message === "undefined") {
          message = level;
        }
        if (!Array.isArray(_Colorizer.allColors[lookup])) {
          return colors[_Colorizer.allColors[lookup]](message);
        }
        for (let i = 0, len = _Colorizer.allColors[lookup].length; i < len; i++) {
          message = colors[_Colorizer.allColors[lookup][i]](message);
        }
        return message;
      }
      /*
       * function transform (info, opts)
       * Attempts to colorize the { level, message } of the given
       * `logform` info object.
       */
      transform(info, opts) {
        if (opts.all && typeof info[MESSAGE] === "string") {
          info[MESSAGE] = this.colorize(info[LEVEL], info.level, info[MESSAGE]);
        }
        if (opts.level || opts.all || !opts.message) {
          info.level = this.colorize(info[LEVEL], info.level);
        }
        if (opts.all || opts.message) {
          info.message = this.colorize(info[LEVEL], info.level, info.message);
        }
        return info;
      }
    };
    module2.exports = (opts) => new Colorizer(opts);
    module2.exports.Colorizer = module2.exports.Format = Colorizer;
  }
});

// node_modules/logform/levels.js
var require_levels = __commonJS({
  "node_modules/logform/levels.js"(exports2, module2) {
    "use strict";
    var { Colorizer } = require_colorize();
    module2.exports = (config) => {
      Colorizer.addColors(config.colors || config);
      return config;
    };
  }
});

// node_modules/logform/align.js
var require_align = __commonJS({
  "node_modules/logform/align.js"(exports2, module2) {
    "use strict";
    var format = require_format();
    module2.exports = format((info) => {
      info.message = `	${info.message}`;
      return info;
    });
  }
});

// node_modules/logform/errors.js
var require_errors = __commonJS({
  "node_modules/logform/errors.js"(exports2, module2) {
    "use strict";
    var format = require_format();
    var { LEVEL, MESSAGE } = require_triple_beam();
    module2.exports = format((einfo, { stack, cause }) => {
      if (einfo instanceof Error) {
        const info = Object.assign({}, einfo, {
          level: einfo.level,
          [LEVEL]: einfo[LEVEL] || einfo.level,
          message: einfo.message,
          [MESSAGE]: einfo[MESSAGE] || einfo.message
        });
        if (stack) info.stack = einfo.stack;
        if (cause) info.cause = einfo.cause;
        return info;
      }
      if (!(einfo.message instanceof Error)) return einfo;
      const err4 = einfo.message;
      Object.assign(einfo, err4);
      einfo.message = err4.message;
      einfo[MESSAGE] = err4.message;
      if (stack) einfo.stack = err4.stack;
      if (cause) einfo.cause = err4.cause;
      return einfo;
    });
  }
});

// node_modules/logform/pad-levels.js
var require_pad_levels = __commonJS({
  "node_modules/logform/pad-levels.js"(exports2, module2) {
    "use strict";
    var { configs, LEVEL, MESSAGE } = require_triple_beam();
    var Padder = class _Padder {
      constructor(opts = { levels: configs.npm.levels }) {
        this.paddings = _Padder.paddingForLevels(opts.levels, opts.filler);
        this.options = opts;
      }
      /**
       * Returns the maximum length of keys in the specified `levels` Object.
       * @param  {Object} levels Set of all levels to calculate longest level against.
       * @returns {Number} Maximum length of the longest level string.
       */
      static getLongestLevel(levels) {
        const lvls = Object.keys(levels).map((level) => level.length);
        return Math.max(...lvls);
      }
      /**
       * Returns the padding for the specified `level` assuming that the
       * maximum length of all levels it's associated with is `maxLength`.
       * @param  {String} level Level to calculate padding for.
       * @param  {String} filler Repeatable text to use for padding.
       * @param  {Number} maxLength Length of the longest level
       * @returns {String} Padding string for the `level`
       */
      static paddingForLevel(level, filler, maxLength) {
        const targetLen = maxLength + 1 - level.length;
        const rep = Math.floor(targetLen / filler.length);
        const padding = `${filler}${filler.repeat(rep)}`;
        return padding.slice(0, targetLen);
      }
      /**
       * Returns an object with the string paddings for the given `levels`
       * using the specified `filler`.
       * @param  {Object} levels Set of all levels to calculate padding for.
       * @param  {String} filler Repeatable text to use for padding.
       * @returns {Object} Mapping of level to desired padding.
       */
      static paddingForLevels(levels, filler = " ") {
        const maxLength = _Padder.getLongestLevel(levels);
        return Object.keys(levels).reduce((acc, level) => {
          acc[level] = _Padder.paddingForLevel(level, filler, maxLength);
          return acc;
        }, {});
      }
      /**
       * Prepends the padding onto the `message` based on the `LEVEL` of
       * the `info`. This is based on the behavior of `winston@2` which also
       * prepended the level onto the message.
       *
       * See: https://github.com/winstonjs/winston/blob/2.x/lib/winston/logger.js#L198-L201
       *
       * @param  {Info} info Logform info object
       * @param  {Object} opts Options passed along to this instance.
       * @returns {Info} Modified logform info object.
       */
      transform(info, opts) {
        info.message = `${this.paddings[info[LEVEL]]}${info.message}`;
        if (info[MESSAGE]) {
          info[MESSAGE] = `${this.paddings[info[LEVEL]]}${info[MESSAGE]}`;
        }
        return info;
      }
    };
    module2.exports = (opts) => new Padder(opts);
    module2.exports.Padder = module2.exports.Format = Padder;
  }
});

// node_modules/logform/cli.js
var require_cli2 = __commonJS({
  "node_modules/logform/cli.js"(exports2, module2) {
    "use strict";
    var { Colorizer } = require_colorize();
    var { Padder } = require_pad_levels();
    var { configs, MESSAGE } = require_triple_beam();
    var CliFormat = class {
      constructor(opts = {}) {
        if (!opts.levels) {
          opts.levels = configs.cli.levels;
        }
        this.colorizer = new Colorizer(opts);
        this.padder = new Padder(opts);
        this.options = opts;
      }
      /*
       * function transform (info, opts)
       * Attempts to both:
       * 1. Pad the { level }
       * 2. Colorize the { level, message }
       * of the given `logform` info object depending on the `opts`.
       */
      transform(info, opts) {
        this.colorizer.transform(
          this.padder.transform(info, opts),
          opts
        );
        info[MESSAGE] = `${info.level}:${info.message}`;
        return info;
      }
    };
    module2.exports = (opts) => new CliFormat(opts);
    module2.exports.Format = CliFormat;
  }
});

// node_modules/logform/combine.js
var require_combine = __commonJS({
  "node_modules/logform/combine.js"(exports2, module2) {
    "use strict";
    var format = require_format();
    function cascade(formats) {
      if (!formats.every(isValidFormat)) {
        return;
      }
      return (info) => {
        let obj = info;
        for (let i = 0; i < formats.length; i++) {
          obj = formats[i].transform(obj, formats[i].options);
          if (!obj) {
            return false;
          }
        }
        return obj;
      };
    }
    function isValidFormat(fmt) {
      if (typeof fmt.transform !== "function") {
        throw new Error([
          "No transform function found on format. Did you create a format instance?",
          "const myFormat = format(formatFn);",
          "const instance = myFormat();"
        ].join("\n"));
      }
      return true;
    }
    module2.exports = (...formats) => {
      const combinedFormat = format(cascade(formats));
      const instance = combinedFormat();
      instance.Format = combinedFormat.Format;
      return instance;
    };
    module2.exports.cascade = cascade;
  }
});

// node_modules/safe-stable-stringify/index.js
var require_safe_stable_stringify = __commonJS({
  "node_modules/safe-stable-stringify/index.js"(exports2, module2) {
    "use strict";
    var { hasOwnProperty } = Object.prototype;
    var stringify = configure();
    stringify.configure = configure;
    stringify.stringify = stringify;
    stringify.default = stringify;
    exports2.stringify = stringify;
    exports2.configure = configure;
    module2.exports = stringify;
    var strEscapeSequencesRegExp = /[\u0000-\u001f\u0022\u005c\ud800-\udfff]/;
    function strEscape(str) {
      if (str.length < 5e3 && !strEscapeSequencesRegExp.test(str)) {
        return `"${str}"`;
      }
      return JSON.stringify(str);
    }
    function sort(array, comparator) {
      if (array.length > 200 || comparator) {
        return array.sort(comparator);
      }
      for (let i = 1; i < array.length; i++) {
        const currentValue = array[i];
        let position = i;
        while (position !== 0 && array[position - 1] > currentValue) {
          array[position] = array[position - 1];
          position--;
        }
        array[position] = currentValue;
      }
      return array;
    }
    var typedArrayPrototypeGetSymbolToStringTag = Object.getOwnPropertyDescriptor(
      Object.getPrototypeOf(
        Object.getPrototypeOf(
          new Int8Array()
        )
      ),
      Symbol.toStringTag
    ).get;
    function isTypedArrayWithEntries(value) {
      return typedArrayPrototypeGetSymbolToStringTag.call(value) !== void 0 && value.length !== 0;
    }
    function stringifyTypedArray(array, separator, maximumBreadth) {
      if (array.length < maximumBreadth) {
        maximumBreadth = array.length;
      }
      const whitespace = separator === "," ? "" : " ";
      let res = `"0":${whitespace}${array[0]}`;
      for (let i = 1; i < maximumBreadth; i++) {
        res += `${separator}"${i}":${whitespace}${array[i]}`;
      }
      return res;
    }
    function getCircularValueOption(options) {
      if (hasOwnProperty.call(options, "circularValue")) {
        const circularValue = options.circularValue;
        if (typeof circularValue === "string") {
          return `"${circularValue}"`;
        }
        if (circularValue == null) {
          return circularValue;
        }
        if (circularValue === Error || circularValue === TypeError) {
          return {
            toString() {
              throw new TypeError("Converting circular structure to JSON");
            }
          };
        }
        throw new TypeError('The "circularValue" argument must be of type string or the value null or undefined');
      }
      return '"[Circular]"';
    }
    function getDeterministicOption(options) {
      let value;
      if (hasOwnProperty.call(options, "deterministic")) {
        value = options.deterministic;
        if (typeof value !== "boolean" && typeof value !== "function") {
          throw new TypeError('The "deterministic" argument must be of type boolean or comparator function');
        }
      }
      return value === void 0 ? true : value;
    }
    function getBooleanOption(options, key) {
      let value;
      if (hasOwnProperty.call(options, key)) {
        value = options[key];
        if (typeof value !== "boolean") {
          throw new TypeError(`The "${key}" argument must be of type boolean`);
        }
      }
      return value === void 0 ? true : value;
    }
    function getPositiveIntegerOption(options, key) {
      let value;
      if (hasOwnProperty.call(options, key)) {
        value = options[key];
        if (typeof value !== "number") {
          throw new TypeError(`The "${key}" argument must be of type number`);
        }
        if (!Number.isInteger(value)) {
          throw new TypeError(`The "${key}" argument must be an integer`);
        }
        if (value < 1) {
          throw new RangeError(`The "${key}" argument must be >= 1`);
        }
      }
      return value === void 0 ? Infinity : value;
    }
    function getItemCount(number) {
      if (number === 1) {
        return "1 item";
      }
      return `${number} items`;
    }
    function getUniqueReplacerSet(replacerArray) {
      const replacerSet = /* @__PURE__ */ new Set();
      for (const value of replacerArray) {
        if (typeof value === "string" || typeof value === "number") {
          replacerSet.add(String(value));
        }
      }
      return replacerSet;
    }
    function getStrictOption(options) {
      if (hasOwnProperty.call(options, "strict")) {
        const value = options.strict;
        if (typeof value !== "boolean") {
          throw new TypeError('The "strict" argument must be of type boolean');
        }
        if (value) {
          return (value2) => {
            let message = `Object can not safely be stringified. Received type ${typeof value2}`;
            if (typeof value2 !== "function") message += ` (${value2.toString()})`;
            throw new Error(message);
          };
        }
      }
    }
    function configure(options) {
      options = { ...options };
      const fail = getStrictOption(options);
      if (fail) {
        if (options.bigint === void 0) {
          options.bigint = false;
        }
        if (!("circularValue" in options)) {
          options.circularValue = Error;
        }
      }
      const circularValue = getCircularValueOption(options);
      const bigint = getBooleanOption(options, "bigint");
      const deterministic = getDeterministicOption(options);
      const comparator = typeof deterministic === "function" ? deterministic : void 0;
      const maximumDepth = getPositiveIntegerOption(options, "maximumDepth");
      const maximumBreadth = getPositiveIntegerOption(options, "maximumBreadth");
      function stringifyFnReplacer(key, parent, stack, replacer, spacer, indentation) {
        let value = parent[key];
        if (typeof value === "object" && value !== null && typeof value.toJSON === "function") {
          value = value.toJSON(key);
        }
        value = replacer.call(parent, key, value);
        switch (typeof value) {
          case "string":
            return strEscape(value);
          case "object": {
            if (value === null) {
              return "null";
            }
            if (stack.indexOf(value) !== -1) {
              return circularValue;
            }
            let res = "";
            let join = ",";
            const originalIndentation = indentation;
            if (Array.isArray(value)) {
              if (value.length === 0) {
                return "[]";
              }
              if (maximumDepth < stack.length + 1) {
                return '"[Array]"';
              }
              stack.push(value);
              if (spacer !== "") {
                indentation += spacer;
                res += `
${indentation}`;
                join = `,
${indentation}`;
              }
              const maximumValuesToStringify = Math.min(value.length, maximumBreadth);
              let i = 0;
              for (; i < maximumValuesToStringify - 1; i++) {
                const tmp2 = stringifyFnReplacer(String(i), value, stack, replacer, spacer, indentation);
                res += tmp2 !== void 0 ? tmp2 : "null";
                res += join;
              }
              const tmp = stringifyFnReplacer(String(i), value, stack, replacer, spacer, indentation);
              res += tmp !== void 0 ? tmp : "null";
              if (value.length - 1 > maximumBreadth) {
                const removedKeys = value.length - maximumBreadth - 1;
                res += `${join}"... ${getItemCount(removedKeys)} not stringified"`;
              }
              if (spacer !== "") {
                res += `
${originalIndentation}`;
              }
              stack.pop();
              return `[${res}]`;
            }
            let keys = Object.keys(value);
            const keyLength = keys.length;
            if (keyLength === 0) {
              return "{}";
            }
            if (maximumDepth < stack.length + 1) {
              return '"[Object]"';
            }
            let whitespace = "";
            let separator = "";
            if (spacer !== "") {
              indentation += spacer;
              join = `,
${indentation}`;
              whitespace = " ";
            }
            const maximumPropertiesToStringify = Math.min(keyLength, maximumBreadth);
            if (deterministic && !isTypedArrayWithEntries(value)) {
              keys = sort(keys, comparator);
            }
            stack.push(value);
            for (let i = 0; i < maximumPropertiesToStringify; i++) {
              const key2 = keys[i];
              const tmp = stringifyFnReplacer(key2, value, stack, replacer, spacer, indentation);
              if (tmp !== void 0) {
                res += `${separator}${strEscape(key2)}:${whitespace}${tmp}`;
                separator = join;
              }
            }
            if (keyLength > maximumBreadth) {
              const removedKeys = keyLength - maximumBreadth;
              res += `${separator}"...":${whitespace}"${getItemCount(removedKeys)} not stringified"`;
              separator = join;
            }
            if (spacer !== "" && separator.length > 1) {
              res = `
${indentation}${res}
${originalIndentation}`;
            }
            stack.pop();
            return `{${res}}`;
          }
          case "number":
            return isFinite(value) ? String(value) : fail ? fail(value) : "null";
          case "boolean":
            return value === true ? "true" : "false";
          case "undefined":
            return void 0;
          case "bigint":
            if (bigint) {
              return String(value);
            }
          // fallthrough
          default:
            return fail ? fail(value) : void 0;
        }
      }
      function stringifyArrayReplacer(key, value, stack, replacer, spacer, indentation) {
        if (typeof value === "object" && value !== null && typeof value.toJSON === "function") {
          value = value.toJSON(key);
        }
        switch (typeof value) {
          case "string":
            return strEscape(value);
          case "object": {
            if (value === null) {
              return "null";
            }
            if (stack.indexOf(value) !== -1) {
              return circularValue;
            }
            const originalIndentation = indentation;
            let res = "";
            let join = ",";
            if (Array.isArray(value)) {
              if (value.length === 0) {
                return "[]";
              }
              if (maximumDepth < stack.length + 1) {
                return '"[Array]"';
              }
              stack.push(value);
              if (spacer !== "") {
                indentation += spacer;
                res += `
${indentation}`;
                join = `,
${indentation}`;
              }
              const maximumValuesToStringify = Math.min(value.length, maximumBreadth);
              let i = 0;
              for (; i < maximumValuesToStringify - 1; i++) {
                const tmp2 = stringifyArrayReplacer(String(i), value[i], stack, replacer, spacer, indentation);
                res += tmp2 !== void 0 ? tmp2 : "null";
                res += join;
              }
              const tmp = stringifyArrayReplacer(String(i), value[i], stack, replacer, spacer, indentation);
              res += tmp !== void 0 ? tmp : "null";
              if (value.length - 1 > maximumBreadth) {
                const removedKeys = value.length - maximumBreadth - 1;
                res += `${join}"... ${getItemCount(removedKeys)} not stringified"`;
              }
              if (spacer !== "") {
                res += `
${originalIndentation}`;
              }
              stack.pop();
              return `[${res}]`;
            }
            stack.push(value);
            let whitespace = "";
            if (spacer !== "") {
              indentation += spacer;
              join = `,
${indentation}`;
              whitespace = " ";
            }
            let separator = "";
            for (const key2 of replacer) {
              const tmp = stringifyArrayReplacer(key2, value[key2], stack, replacer, spacer, indentation);
              if (tmp !== void 0) {
                res += `${separator}${strEscape(key2)}:${whitespace}${tmp}`;
                separator = join;
              }
            }
            if (spacer !== "" && separator.length > 1) {
              res = `
${indentation}${res}
${originalIndentation}`;
            }
            stack.pop();
            return `{${res}}`;
          }
          case "number":
            return isFinite(value) ? String(value) : fail ? fail(value) : "null";
          case "boolean":
            return value === true ? "true" : "false";
          case "undefined":
            return void 0;
          case "bigint":
            if (bigint) {
              return String(value);
            }
          // fallthrough
          default:
            return fail ? fail(value) : void 0;
        }
      }
      function stringifyIndent(key, value, stack, spacer, indentation) {
        switch (typeof value) {
          case "string":
            return strEscape(value);
          case "object": {
            if (value === null) {
              return "null";
            }
            if (typeof value.toJSON === "function") {
              value = value.toJSON(key);
              if (typeof value !== "object") {
                return stringifyIndent(key, value, stack, spacer, indentation);
              }
              if (value === null) {
                return "null";
              }
            }
            if (stack.indexOf(value) !== -1) {
              return circularValue;
            }
            const originalIndentation = indentation;
            if (Array.isArray(value)) {
              if (value.length === 0) {
                return "[]";
              }
              if (maximumDepth < stack.length + 1) {
                return '"[Array]"';
              }
              stack.push(value);
              indentation += spacer;
              let res2 = `
${indentation}`;
              const join2 = `,
${indentation}`;
              const maximumValuesToStringify = Math.min(value.length, maximumBreadth);
              let i = 0;
              for (; i < maximumValuesToStringify - 1; i++) {
                const tmp2 = stringifyIndent(String(i), value[i], stack, spacer, indentation);
                res2 += tmp2 !== void 0 ? tmp2 : "null";
                res2 += join2;
              }
              const tmp = stringifyIndent(String(i), value[i], stack, spacer, indentation);
              res2 += tmp !== void 0 ? tmp : "null";
              if (value.length - 1 > maximumBreadth) {
                const removedKeys = value.length - maximumBreadth - 1;
                res2 += `${join2}"... ${getItemCount(removedKeys)} not stringified"`;
              }
              res2 += `
${originalIndentation}`;
              stack.pop();
              return `[${res2}]`;
            }
            let keys = Object.keys(value);
            const keyLength = keys.length;
            if (keyLength === 0) {
              return "{}";
            }
            if (maximumDepth < stack.length + 1) {
              return '"[Object]"';
            }
            indentation += spacer;
            const join = `,
${indentation}`;
            let res = "";
            let separator = "";
            let maximumPropertiesToStringify = Math.min(keyLength, maximumBreadth);
            if (isTypedArrayWithEntries(value)) {
              res += stringifyTypedArray(value, join, maximumBreadth);
              keys = keys.slice(value.length);
              maximumPropertiesToStringify -= value.length;
              separator = join;
            }
            if (deterministic) {
              keys = sort(keys, comparator);
            }
            stack.push(value);
            for (let i = 0; i < maximumPropertiesToStringify; i++) {
              const key2 = keys[i];
              const tmp = stringifyIndent(key2, value[key2], stack, spacer, indentation);
              if (tmp !== void 0) {
                res += `${separator}${strEscape(key2)}: ${tmp}`;
                separator = join;
              }
            }
            if (keyLength > maximumBreadth) {
              const removedKeys = keyLength - maximumBreadth;
              res += `${separator}"...": "${getItemCount(removedKeys)} not stringified"`;
              separator = join;
            }
            if (separator !== "") {
              res = `
${indentation}${res}
${originalIndentation}`;
            }
            stack.pop();
            return `{${res}}`;
          }
          case "number":
            return isFinite(value) ? String(value) : fail ? fail(value) : "null";
          case "boolean":
            return value === true ? "true" : "false";
          case "undefined":
            return void 0;
          case "bigint":
            if (bigint) {
              return String(value);
            }
          // fallthrough
          default:
            return fail ? fail(value) : void 0;
        }
      }
      function stringifySimple(key, value, stack) {
        switch (typeof value) {
          case "string":
            return strEscape(value);
          case "object": {
            if (value === null) {
              return "null";
            }
            if (typeof value.toJSON === "function") {
              value = value.toJSON(key);
              if (typeof value !== "object") {
                return stringifySimple(key, value, stack);
              }
              if (value === null) {
                return "null";
              }
            }
            if (stack.indexOf(value) !== -1) {
              return circularValue;
            }
            let res = "";
            const hasLength = value.length !== void 0;
            if (hasLength && Array.isArray(value)) {
              if (value.length === 0) {
                return "[]";
              }
              if (maximumDepth < stack.length + 1) {
                return '"[Array]"';
              }
              stack.push(value);
              const maximumValuesToStringify = Math.min(value.length, maximumBreadth);
              let i = 0;
              for (; i < maximumValuesToStringify - 1; i++) {
                const tmp2 = stringifySimple(String(i), value[i], stack);
                res += tmp2 !== void 0 ? tmp2 : "null";
                res += ",";
              }
              const tmp = stringifySimple(String(i), value[i], stack);
              res += tmp !== void 0 ? tmp : "null";
              if (value.length - 1 > maximumBreadth) {
                const removedKeys = value.length - maximumBreadth - 1;
                res += `,"... ${getItemCount(removedKeys)} not stringified"`;
              }
              stack.pop();
              return `[${res}]`;
            }
            let keys = Object.keys(value);
            const keyLength = keys.length;
            if (keyLength === 0) {
              return "{}";
            }
            if (maximumDepth < stack.length + 1) {
              return '"[Object]"';
            }
            let separator = "";
            let maximumPropertiesToStringify = Math.min(keyLength, maximumBreadth);
            if (hasLength && isTypedArrayWithEntries(value)) {
              res += stringifyTypedArray(value, ",", maximumBreadth);
              keys = keys.slice(value.length);
              maximumPropertiesToStringify -= value.length;
              separator = ",";
            }
            if (deterministic) {
              keys = sort(keys, comparator);
            }
            stack.push(value);
            for (let i = 0; i < maximumPropertiesToStringify; i++) {
              const key2 = keys[i];
              const tmp = stringifySimple(key2, value[key2], stack);
              if (tmp !== void 0) {
                res += `${separator}${strEscape(key2)}:${tmp}`;
                separator = ",";
              }
            }
            if (keyLength > maximumBreadth) {
              const removedKeys = keyLength - maximumBreadth;
              res += `${separator}"...":"${getItemCount(removedKeys)} not stringified"`;
            }
            stack.pop();
            return `{${res}}`;
          }
          case "number":
            return isFinite(value) ? String(value) : fail ? fail(value) : "null";
          case "boolean":
            return value === true ? "true" : "false";
          case "undefined":
            return void 0;
          case "bigint":
            if (bigint) {
              return String(value);
            }
          // fallthrough
          default:
            return fail ? fail(value) : void 0;
        }
      }
      function stringify2(value, replacer, space) {
        if (arguments.length > 1) {
          let spacer = "";
          if (typeof space === "number") {
            spacer = " ".repeat(Math.min(space, 10));
          } else if (typeof space === "string") {
            spacer = space.slice(0, 10);
          }
          if (replacer != null) {
            if (typeof replacer === "function") {
              return stringifyFnReplacer("", { "": value }, [], replacer, spacer, "");
            }
            if (Array.isArray(replacer)) {
              return stringifyArrayReplacer("", value, [], getUniqueReplacerSet(replacer), spacer, "");
            }
          }
          if (spacer.length !== 0) {
            return stringifyIndent("", value, [], spacer, "");
          }
        }
        return stringifySimple("", value, []);
      }
      return stringify2;
    }
  }
});

// node_modules/logform/json.js
var require_json = __commonJS({
  "node_modules/logform/json.js"(exports2, module2) {
    "use strict";
    var format = require_format();
    var { MESSAGE } = require_triple_beam();
    var stringify = require_safe_stable_stringify();
    function replacer(key, value) {
      if (typeof value === "bigint")
        return value.toString();
      return value;
    }
    module2.exports = format((info, opts) => {
      const jsonStringify = stringify.configure(opts);
      info[MESSAGE] = jsonStringify(info, opts.replacer || replacer, opts.space);
      return info;
    });
  }
});

// node_modules/logform/label.js
var require_label = __commonJS({
  "node_modules/logform/label.js"(exports2, module2) {
    "use strict";
    var format = require_format();
    module2.exports = format((info, opts) => {
      if (opts.message) {
        info.message = `[${opts.label}] ${info.message}`;
        return info;
      }
      info.label = opts.label;
      return info;
    });
  }
});

// node_modules/logform/logstash.js
var require_logstash = __commonJS({
  "node_modules/logform/logstash.js"(exports2, module2) {
    "use strict";
    var format = require_format();
    var { MESSAGE } = require_triple_beam();
    var jsonStringify = require_safe_stable_stringify();
    module2.exports = format((info) => {
      const logstash = {};
      if (info.message) {
        logstash["@message"] = info.message;
        delete info.message;
      }
      if (info.timestamp) {
        logstash["@timestamp"] = info.timestamp;
        delete info.timestamp;
      }
      logstash["@fields"] = info;
      info[MESSAGE] = jsonStringify(logstash);
      return info;
    });
  }
});

// node_modules/logform/metadata.js
var require_metadata = __commonJS({
  "node_modules/logform/metadata.js"(exports2, module2) {
    "use strict";
    var format = require_format();
    function fillExcept(info, fillExceptKeys, metadataKey) {
      const savedKeys = fillExceptKeys.reduce((acc, key) => {
        acc[key] = info[key];
        delete info[key];
        return acc;
      }, {});
      const metadata = Object.keys(info).reduce((acc, key) => {
        acc[key] = info[key];
        delete info[key];
        return acc;
      }, {});
      Object.assign(info, savedKeys, {
        [metadataKey]: metadata
      });
      return info;
    }
    function fillWith(info, fillWithKeys, metadataKey) {
      info[metadataKey] = fillWithKeys.reduce((acc, key) => {
        acc[key] = info[key];
        delete info[key];
        return acc;
      }, {});
      return info;
    }
    module2.exports = format((info, opts = {}) => {
      let metadataKey = "metadata";
      if (opts.key) {
        metadataKey = opts.key;
      }
      let fillExceptKeys = [];
      if (!opts.fillExcept && !opts.fillWith) {
        fillExceptKeys.push("level");
        fillExceptKeys.push("message");
      }
      if (opts.fillExcept) {
        fillExceptKeys = opts.fillExcept;
      }
      if (fillExceptKeys.length > 0) {
        return fillExcept(info, fillExceptKeys, metadataKey);
      }
      if (opts.fillWith) {
        return fillWith(info, opts.fillWith, metadataKey);
      }
      return info;
    });
  }
});

// node_modules/ms/index.js
var require_ms = __commonJS({
  "node_modules/ms/index.js"(exports2, module2) {
    var s = 1e3;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var w = d * 7;
    var y = d * 365.25;
    module2.exports = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse(val);
      } else if (type === "number" && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error(
        "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
      );
    };
    function parse(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        str
      );
      if (!match) {
        return;
      }
      var n = parseFloat(match[1]);
      var type = (match[2] || "ms").toLowerCase();
      switch (type) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return n * y;
        case "weeks":
        case "week":
        case "w":
          return n * w;
        case "days":
        case "day":
        case "d":
          return n * d;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return n * h;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return n * m;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return n * s;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return n;
        default:
          return void 0;
      }
    }
    function fmtShort(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return Math.round(ms / d) + "d";
      }
      if (msAbs >= h) {
        return Math.round(ms / h) + "h";
      }
      if (msAbs >= m) {
        return Math.round(ms / m) + "m";
      }
      if (msAbs >= s) {
        return Math.round(ms / s) + "s";
      }
      return ms + "ms";
    }
    function fmtLong(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return plural(ms, msAbs, d, "day");
      }
      if (msAbs >= h) {
        return plural(ms, msAbs, h, "hour");
      }
      if (msAbs >= m) {
        return plural(ms, msAbs, m, "minute");
      }
      if (msAbs >= s) {
        return plural(ms, msAbs, s, "second");
      }
      return ms + " ms";
    }
    function plural(ms, msAbs, n, name) {
      var isPlural = msAbs >= n * 1.5;
      return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
    }
  }
});

// node_modules/logform/ms.js
var require_ms2 = __commonJS({
  "node_modules/logform/ms.js"(exports2, module2) {
    "use strict";
    var format = require_format();
    var ms = require_ms();
    module2.exports = format((info) => {
      const curr = +/* @__PURE__ */ new Date();
      exports2.diff = curr - (exports2.prevTime || curr);
      exports2.prevTime = curr;
      info.ms = `+${ms(exports2.diff)}`;
      return info;
    });
  }
});

// node_modules/logform/pretty-print.js
var require_pretty_print = __commonJS({
  "node_modules/logform/pretty-print.js"(exports2, module2) {
    "use strict";
    var inspect = require("util").inspect;
    var format = require_format();
    var { LEVEL, MESSAGE, SPLAT } = require_triple_beam();
    module2.exports = format((info, opts = {}) => {
      const stripped = Object.assign({}, info);
      delete stripped[LEVEL];
      delete stripped[MESSAGE];
      delete stripped[SPLAT];
      info[MESSAGE] = inspect(stripped, false, opts.depth || null, opts.colorize);
      return info;
    });
  }
});

// node_modules/logform/printf.js
var require_printf = __commonJS({
  "node_modules/logform/printf.js"(exports2, module2) {
    "use strict";
    var { MESSAGE } = require_triple_beam();
    var Printf = class {
      constructor(templateFn) {
        this.template = templateFn;
      }
      transform(info) {
        info[MESSAGE] = this.template(info);
        return info;
      }
    };
    module2.exports = (opts) => new Printf(opts);
    module2.exports.Printf = module2.exports.Format = Printf;
  }
});

// node_modules/logform/simple.js
var require_simple = __commonJS({
  "node_modules/logform/simple.js"(exports2, module2) {
    "use strict";
    var format = require_format();
    var { MESSAGE } = require_triple_beam();
    var jsonStringify = require_safe_stable_stringify();
    module2.exports = format((info) => {
      const stringifiedRest = jsonStringify(Object.assign({}, info, {
        level: void 0,
        message: void 0,
        splat: void 0
      }));
      const padding = info.padding && info.padding[info.level] || "";
      if (stringifiedRest !== "{}") {
        info[MESSAGE] = `${info.level}:${padding} ${info.message} ${stringifiedRest}`;
      } else {
        info[MESSAGE] = `${info.level}:${padding} ${info.message}`;
      }
      return info;
    });
  }
});

// node_modules/logform/splat.js
var require_splat = __commonJS({
  "node_modules/logform/splat.js"(exports2, module2) {
    "use strict";
    var util = require("util");
    var { SPLAT } = require_triple_beam();
    var formatRegExp = /%[scdjifoO%]/g;
    var escapedPercent = /%%/g;
    var Splatter = class {
      constructor(opts) {
        this.options = opts;
      }
      /**
         * Check to see if tokens <= splat.length, assign { splat, meta } into the
         * `info` accordingly, and write to this instance.
         *
         * @param  {Info} info Logform info message.
         * @param  {String[]} tokens Set of string interpolation tokens.
         * @returns {Info} Modified info message
         * @private
         */
      _splat(info, tokens) {
        const msg = info.message;
        const splat = info[SPLAT] || info.splat || [];
        const percents = msg.match(escapedPercent);
        const escapes = percents && percents.length || 0;
        const expectedSplat = tokens.length - escapes;
        const extraSplat = expectedSplat - splat.length;
        const metas = extraSplat < 0 ? splat.splice(extraSplat, -1 * extraSplat) : [];
        const metalen = metas.length;
        if (metalen) {
          for (let i = 0; i < metalen; i++) {
            Object.assign(info, metas[i]);
          }
        }
        info.message = util.format(msg, ...splat);
        return info;
      }
      /**
        * Transforms the `info` message by using `util.format` to complete
        * any `info.message` provided it has string interpolation tokens.
        * If no tokens exist then `info` is immutable.
        *
        * @param  {Info} info Logform info message.
        * @param  {Object} opts Options for this instance.
        * @returns {Info} Modified info message
        */
      transform(info) {
        const msg = info.message;
        const splat = info[SPLAT] || info.splat;
        if (!splat || !splat.length) {
          return info;
        }
        const tokens = msg && msg.match && msg.match(formatRegExp);
        if (!tokens && (splat || splat.length)) {
          const metas = splat.length > 1 ? splat.splice(0) : splat;
          const metalen = metas.length;
          if (metalen) {
            for (let i = 0; i < metalen; i++) {
              Object.assign(info, metas[i]);
            }
          }
          return info;
        }
        if (tokens) {
          return this._splat(info, tokens);
        }
        return info;
      }
    };
    module2.exports = (opts) => new Splatter(opts);
  }
});

// node_modules/fecha/lib/fecha.umd.js
var require_fecha_umd = __commonJS({
  "node_modules/fecha/lib/fecha.umd.js"(exports2, module2) {
    (function(global2, factory) {
      typeof exports2 === "object" && typeof module2 !== "undefined" ? factory(exports2) : typeof define === "function" && define.amd ? define(["exports"], factory) : factory(global2.fecha = {});
    })(exports2, (function(exports3) {
      "use strict";
      var token = /d{1,4}|M{1,4}|YY(?:YY)?|S{1,3}|Do|ZZ|Z|([HhMsDm])\1?|[aA]|"[^"]*"|'[^']*'/g;
      var twoDigitsOptional = "\\d\\d?";
      var twoDigits = "\\d\\d";
      var threeDigits = "\\d{3}";
      var fourDigits = "\\d{4}";
      var word = "[^\\s]+";
      var literal = /\[([^]*?)\]/gm;
      function shorten(arr, sLen) {
        var newArr = [];
        for (var i = 0, len = arr.length; i < len; i++) {
          newArr.push(arr[i].substr(0, sLen));
        }
        return newArr;
      }
      var monthUpdate = function(arrName) {
        return function(v, i18n) {
          var lowerCaseArr = i18n[arrName].map(function(v2) {
            return v2.toLowerCase();
          });
          var index = lowerCaseArr.indexOf(v.toLowerCase());
          if (index > -1) {
            return index;
          }
          return null;
        };
      };
      function assign(origObj) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
          args[_i - 1] = arguments[_i];
        }
        for (var _a = 0, args_1 = args; _a < args_1.length; _a++) {
          var obj = args_1[_a];
          for (var key in obj) {
            origObj[key] = obj[key];
          }
        }
        return origObj;
      }
      var dayNames = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ];
      var monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];
      var monthNamesShort = shorten(monthNames, 3);
      var dayNamesShort = shorten(dayNames, 3);
      var defaultI18n = {
        dayNamesShort,
        dayNames,
        monthNamesShort,
        monthNames,
        amPm: ["am", "pm"],
        DoFn: function(dayOfMonth) {
          return dayOfMonth + ["th", "st", "nd", "rd"][dayOfMonth % 10 > 3 ? 0 : (dayOfMonth - dayOfMonth % 10 !== 10 ? 1 : 0) * dayOfMonth % 10];
        }
      };
      var globalI18n = assign({}, defaultI18n);
      var setGlobalDateI18n = function(i18n) {
        return globalI18n = assign(globalI18n, i18n);
      };
      var regexEscape = function(str) {
        return str.replace(/[|\\{()[^$+*?.-]/g, "\\$&");
      };
      var pad = function(val, len) {
        if (len === void 0) {
          len = 2;
        }
        val = String(val);
        while (val.length < len) {
          val = "0" + val;
        }
        return val;
      };
      var formatFlags = {
        D: function(dateObj) {
          return String(dateObj.getDate());
        },
        DD: function(dateObj) {
          return pad(dateObj.getDate());
        },
        Do: function(dateObj, i18n) {
          return i18n.DoFn(dateObj.getDate());
        },
        d: function(dateObj) {
          return String(dateObj.getDay());
        },
        dd: function(dateObj) {
          return pad(dateObj.getDay());
        },
        ddd: function(dateObj, i18n) {
          return i18n.dayNamesShort[dateObj.getDay()];
        },
        dddd: function(dateObj, i18n) {
          return i18n.dayNames[dateObj.getDay()];
        },
        M: function(dateObj) {
          return String(dateObj.getMonth() + 1);
        },
        MM: function(dateObj) {
          return pad(dateObj.getMonth() + 1);
        },
        MMM: function(dateObj, i18n) {
          return i18n.monthNamesShort[dateObj.getMonth()];
        },
        MMMM: function(dateObj, i18n) {
          return i18n.monthNames[dateObj.getMonth()];
        },
        YY: function(dateObj) {
          return pad(String(dateObj.getFullYear()), 4).substr(2);
        },
        YYYY: function(dateObj) {
          return pad(dateObj.getFullYear(), 4);
        },
        h: function(dateObj) {
          return String(dateObj.getHours() % 12 || 12);
        },
        hh: function(dateObj) {
          return pad(dateObj.getHours() % 12 || 12);
        },
        H: function(dateObj) {
          return String(dateObj.getHours());
        },
        HH: function(dateObj) {
          return pad(dateObj.getHours());
        },
        m: function(dateObj) {
          return String(dateObj.getMinutes());
        },
        mm: function(dateObj) {
          return pad(dateObj.getMinutes());
        },
        s: function(dateObj) {
          return String(dateObj.getSeconds());
        },
        ss: function(dateObj) {
          return pad(dateObj.getSeconds());
        },
        S: function(dateObj) {
          return String(Math.round(dateObj.getMilliseconds() / 100));
        },
        SS: function(dateObj) {
          return pad(Math.round(dateObj.getMilliseconds() / 10), 2);
        },
        SSS: function(dateObj) {
          return pad(dateObj.getMilliseconds(), 3);
        },
        a: function(dateObj, i18n) {
          return dateObj.getHours() < 12 ? i18n.amPm[0] : i18n.amPm[1];
        },
        A: function(dateObj, i18n) {
          return dateObj.getHours() < 12 ? i18n.amPm[0].toUpperCase() : i18n.amPm[1].toUpperCase();
        },
        ZZ: function(dateObj) {
          var offset = dateObj.getTimezoneOffset();
          return (offset > 0 ? "-" : "+") + pad(Math.floor(Math.abs(offset) / 60) * 100 + Math.abs(offset) % 60, 4);
        },
        Z: function(dateObj) {
          var offset = dateObj.getTimezoneOffset();
          return (offset > 0 ? "-" : "+") + pad(Math.floor(Math.abs(offset) / 60), 2) + ":" + pad(Math.abs(offset) % 60, 2);
        }
      };
      var monthParse = function(v) {
        return +v - 1;
      };
      var emptyDigits = [null, twoDigitsOptional];
      var emptyWord = [null, word];
      var amPm = [
        "isPm",
        word,
        function(v, i18n) {
          var val = v.toLowerCase();
          if (val === i18n.amPm[0]) {
            return 0;
          } else if (val === i18n.amPm[1]) {
            return 1;
          }
          return null;
        }
      ];
      var timezoneOffset = [
        "timezoneOffset",
        "[^\\s]*?[\\+\\-]\\d\\d:?\\d\\d|[^\\s]*?Z?",
        function(v) {
          var parts = (v + "").match(/([+-]|\d\d)/gi);
          if (parts) {
            var minutes = +parts[1] * 60 + parseInt(parts[2], 10);
            return parts[0] === "+" ? minutes : -minutes;
          }
          return 0;
        }
      ];
      var parseFlags = {
        D: ["day", twoDigitsOptional],
        DD: ["day", twoDigits],
        Do: ["day", twoDigitsOptional + word, function(v) {
          return parseInt(v, 10);
        }],
        M: ["month", twoDigitsOptional, monthParse],
        MM: ["month", twoDigits, monthParse],
        YY: [
          "year",
          twoDigits,
          function(v) {
            var now = /* @__PURE__ */ new Date();
            var cent = +("" + now.getFullYear()).substr(0, 2);
            return +("" + (+v > 68 ? cent - 1 : cent) + v);
          }
        ],
        h: ["hour", twoDigitsOptional, void 0, "isPm"],
        hh: ["hour", twoDigits, void 0, "isPm"],
        H: ["hour", twoDigitsOptional],
        HH: ["hour", twoDigits],
        m: ["minute", twoDigitsOptional],
        mm: ["minute", twoDigits],
        s: ["second", twoDigitsOptional],
        ss: ["second", twoDigits],
        YYYY: ["year", fourDigits],
        S: ["millisecond", "\\d", function(v) {
          return +v * 100;
        }],
        SS: ["millisecond", twoDigits, function(v) {
          return +v * 10;
        }],
        SSS: ["millisecond", threeDigits],
        d: emptyDigits,
        dd: emptyDigits,
        ddd: emptyWord,
        dddd: emptyWord,
        MMM: ["month", word, monthUpdate("monthNamesShort")],
        MMMM: ["month", word, monthUpdate("monthNames")],
        a: amPm,
        A: amPm,
        ZZ: timezoneOffset,
        Z: timezoneOffset
      };
      var globalMasks = {
        default: "ddd MMM DD YYYY HH:mm:ss",
        shortDate: "M/D/YY",
        mediumDate: "MMM D, YYYY",
        longDate: "MMMM D, YYYY",
        fullDate: "dddd, MMMM D, YYYY",
        isoDate: "YYYY-MM-DD",
        isoDateTime: "YYYY-MM-DDTHH:mm:ssZ",
        shortTime: "HH:mm",
        mediumTime: "HH:mm:ss",
        longTime: "HH:mm:ss.SSS"
      };
      var setGlobalDateMasks = function(masks) {
        return assign(globalMasks, masks);
      };
      var format = function(dateObj, mask, i18n) {
        if (mask === void 0) {
          mask = globalMasks["default"];
        }
        if (i18n === void 0) {
          i18n = {};
        }
        if (typeof dateObj === "number") {
          dateObj = new Date(dateObj);
        }
        if (Object.prototype.toString.call(dateObj) !== "[object Date]" || isNaN(dateObj.getTime())) {
          throw new Error("Invalid Date pass to format");
        }
        mask = globalMasks[mask] || mask;
        var literals = [];
        mask = mask.replace(literal, function($0, $1) {
          literals.push($1);
          return "@@@";
        });
        var combinedI18nSettings = assign(assign({}, globalI18n), i18n);
        mask = mask.replace(token, function($0) {
          return formatFlags[$0](dateObj, combinedI18nSettings);
        });
        return mask.replace(/@@@/g, function() {
          return literals.shift();
        });
      };
      function parse(dateStr, format2, i18n) {
        if (i18n === void 0) {
          i18n = {};
        }
        if (typeof format2 !== "string") {
          throw new Error("Invalid format in fecha parse");
        }
        format2 = globalMasks[format2] || format2;
        if (dateStr.length > 1e3) {
          return null;
        }
        var today = /* @__PURE__ */ new Date();
        var dateInfo = {
          year: today.getFullYear(),
          month: 0,
          day: 1,
          hour: 0,
          minute: 0,
          second: 0,
          millisecond: 0,
          isPm: null,
          timezoneOffset: null
        };
        var parseInfo = [];
        var literals = [];
        var newFormat = format2.replace(literal, function($0, $1) {
          literals.push(regexEscape($1));
          return "@@@";
        });
        var specifiedFields = {};
        var requiredFields = {};
        newFormat = regexEscape(newFormat).replace(token, function($0) {
          var info = parseFlags[$0];
          var field2 = info[0], regex = info[1], requiredField = info[3];
          if (specifiedFields[field2]) {
            throw new Error("Invalid format. " + field2 + " specified twice in format");
          }
          specifiedFields[field2] = true;
          if (requiredField) {
            requiredFields[requiredField] = true;
          }
          parseInfo.push(info);
          return "(" + regex + ")";
        });
        Object.keys(requiredFields).forEach(function(field2) {
          if (!specifiedFields[field2]) {
            throw new Error("Invalid format. " + field2 + " is required in specified format");
          }
        });
        newFormat = newFormat.replace(/@@@/g, function() {
          return literals.shift();
        });
        var matches = dateStr.match(new RegExp(newFormat, "i"));
        if (!matches) {
          return null;
        }
        var combinedI18nSettings = assign(assign({}, globalI18n), i18n);
        for (var i = 1; i < matches.length; i++) {
          var _a = parseInfo[i - 1], field = _a[0], parser = _a[2];
          var value = parser ? parser(matches[i], combinedI18nSettings) : +matches[i];
          if (value == null) {
            return null;
          }
          dateInfo[field] = value;
        }
        if (dateInfo.isPm === 1 && dateInfo.hour != null && +dateInfo.hour !== 12) {
          dateInfo.hour = +dateInfo.hour + 12;
        } else if (dateInfo.isPm === 0 && +dateInfo.hour === 12) {
          dateInfo.hour = 0;
        }
        var dateTZ;
        if (dateInfo.timezoneOffset == null) {
          dateTZ = new Date(dateInfo.year, dateInfo.month, dateInfo.day, dateInfo.hour, dateInfo.minute, dateInfo.second, dateInfo.millisecond);
          var validateFields = [
            ["month", "getMonth"],
            ["day", "getDate"],
            ["hour", "getHours"],
            ["minute", "getMinutes"],
            ["second", "getSeconds"]
          ];
          for (var i = 0, len = validateFields.length; i < len; i++) {
            if (specifiedFields[validateFields[i][0]] && dateInfo[validateFields[i][0]] !== dateTZ[validateFields[i][1]]()) {
              return null;
            }
          }
        } else {
          dateTZ = new Date(Date.UTC(dateInfo.year, dateInfo.month, dateInfo.day, dateInfo.hour, dateInfo.minute - dateInfo.timezoneOffset, dateInfo.second, dateInfo.millisecond));
          if (dateInfo.month > 11 || dateInfo.month < 0 || dateInfo.day > 31 || dateInfo.day < 1 || dateInfo.hour > 23 || dateInfo.hour < 0 || dateInfo.minute > 59 || dateInfo.minute < 0 || dateInfo.second > 59 || dateInfo.second < 0) {
            return null;
          }
        }
        return dateTZ;
      }
      var fecha = {
        format,
        parse,
        defaultI18n,
        setGlobalDateI18n,
        setGlobalDateMasks
      };
      exports3.assign = assign;
      exports3.default = fecha;
      exports3.format = format;
      exports3.parse = parse;
      exports3.defaultI18n = defaultI18n;
      exports3.setGlobalDateI18n = setGlobalDateI18n;
      exports3.setGlobalDateMasks = setGlobalDateMasks;
      Object.defineProperty(exports3, "__esModule", { value: true });
    }));
  }
});

// node_modules/logform/timestamp.js
var require_timestamp = __commonJS({
  "node_modules/logform/timestamp.js"(exports2, module2) {
    "use strict";
    var fecha = require_fecha_umd();
    var format = require_format();
    module2.exports = format((info, opts = {}) => {
      if (opts.format) {
        info.timestamp = typeof opts.format === "function" ? opts.format() : fecha.format(/* @__PURE__ */ new Date(), opts.format);
      }
      if (!info.timestamp) {
        info.timestamp = (/* @__PURE__ */ new Date()).toISOString();
      }
      if (opts.alias) {
        info[opts.alias] = info.timestamp;
      }
      return info;
    });
  }
});

// node_modules/logform/uncolorize.js
var require_uncolorize = __commonJS({
  "node_modules/logform/uncolorize.js"(exports2, module2) {
    "use strict";
    var colors = require_safe();
    var format = require_format();
    var { MESSAGE } = require_triple_beam();
    module2.exports = format((info, opts) => {
      if (opts.level !== false) {
        info.level = colors.strip(info.level);
      }
      if (opts.message !== false) {
        info.message = colors.strip(String(info.message));
      }
      if (opts.raw !== false && info[MESSAGE]) {
        info[MESSAGE] = colors.strip(String(info[MESSAGE]));
      }
      return info;
    });
  }
});

// node_modules/logform/index.js
var require_logform = __commonJS({
  "node_modules/logform/index.js"(exports2) {
    "use strict";
    var format = exports2.format = require_format();
    exports2.levels = require_levels();
    function exposeFormat(name, requireFormat) {
      Object.defineProperty(format, name, {
        get() {
          return requireFormat();
        },
        configurable: true
      });
    }
    exposeFormat("align", function() {
      return require_align();
    });
    exposeFormat("errors", function() {
      return require_errors();
    });
    exposeFormat("cli", function() {
      return require_cli2();
    });
    exposeFormat("combine", function() {
      return require_combine();
    });
    exposeFormat("colorize", function() {
      return require_colorize();
    });
    exposeFormat("json", function() {
      return require_json();
    });
    exposeFormat("label", function() {
      return require_label();
    });
    exposeFormat("logstash", function() {
      return require_logstash();
    });
    exposeFormat("metadata", function() {
      return require_metadata();
    });
    exposeFormat("ms", function() {
      return require_ms2();
    });
    exposeFormat("padLevels", function() {
      return require_pad_levels();
    });
    exposeFormat("prettyPrint", function() {
      return require_pretty_print();
    });
    exposeFormat("printf", function() {
      return require_printf();
    });
    exposeFormat("simple", function() {
      return require_simple();
    });
    exposeFormat("splat", function() {
      return require_splat();
    });
    exposeFormat("timestamp", function() {
      return require_timestamp();
    });
    exposeFormat("uncolorize", function() {
      return require_uncolorize();
    });
  }
});

// node_modules/winston/lib/winston/common.js
var require_common = __commonJS({
  "node_modules/winston/lib/winston/common.js"(exports2) {
    "use strict";
    var { format } = require("util");
    exports2.warn = {
      deprecated(prop) {
        return () => {
          throw new Error(format("{ %s } was removed in winston@3.0.0.", prop));
        };
      },
      useFormat(prop) {
        return () => {
          throw new Error([
            format("{ %s } was removed in winston@3.0.0.", prop),
            "Use a custom winston.format = winston.format(function) instead."
          ].join("\n"));
        };
      },
      forFunctions(obj, type, props) {
        props.forEach((prop) => {
          obj[prop] = exports2.warn[type](prop);
        });
      },
      forProperties(obj, type, props) {
        props.forEach((prop) => {
          const notice = exports2.warn[type](prop);
          Object.defineProperty(obj, prop, {
            get: notice,
            set: notice
          });
        });
      }
    };
  }
});

// node_modules/winston/package.json
var require_package = __commonJS({
  "node_modules/winston/package.json"(exports2, module2) {
    module2.exports = {
      name: "winston",
      description: "A logger for just about everything.",
      version: "3.19.0",
      author: "Charlie Robbins <charlie.robbins@gmail.com>",
      maintainers: [
        "David Hyde <dabh@alumni.stanford.edu>"
      ],
      repository: {
        type: "git",
        url: "https://github.com/winstonjs/winston.git"
      },
      keywords: [
        "winston",
        "logger",
        "logging",
        "logs",
        "sysadmin",
        "bunyan",
        "pino",
        "loglevel",
        "tools",
        "json",
        "stream"
      ],
      dependencies: {
        "@dabh/diagnostics": "^2.0.8",
        "@colors/colors": "^1.6.0",
        async: "^3.2.3",
        "is-stream": "^2.0.0",
        logform: "^2.7.0",
        "one-time": "^1.0.0",
        "readable-stream": "^3.4.0",
        "safe-stable-stringify": "^2.3.1",
        "stack-trace": "0.0.x",
        "triple-beam": "^1.3.0",
        "winston-transport": "^4.9.0"
      },
      devDependencies: {
        "@babel/cli": "^7.23.9",
        "@babel/core": "^7.24.0",
        "@babel/preset-env": "^7.24.0",
        "@dabh/eslint-config-populist": "^4.4.0",
        "@types/node": "^20.11.24",
        "abstract-winston-transport": "^0.5.1",
        assume: "^2.2.0",
        "cross-spawn-async": "^2.2.5",
        eslint: "^8.57.0",
        hock: "^1.4.1",
        jest: "^29.7.0",
        rimraf: "5.0.10",
        split2: "^4.1.0",
        "std-mocks": "^2.0.0",
        through2: "^4.0.2",
        "winston-compat": "^0.1.5"
      },
      main: "./lib/winston.js",
      browser: "./dist/winston",
      types: "./index.d.ts",
      scripts: {
        lint: "eslint lib/*.js lib/winston/*.js lib/winston/**/*.js --resolve-plugins-relative-to ./node_modules/@dabh/eslint-config-populist",
        test: "jest",
        "test:unit": "jest -c test/jest.config.unit.js",
        "test:integration": "jest -c test/jest.config.integration.js",
        "test:typescript": "npx --package typescript tsc --project test",
        build: "babel lib -d dist",
        prebuild: "rimraf dist",
        prepublishOnly: "npm run build"
      },
      engines: {
        node: ">= 12.0.0"
      },
      license: "MIT"
    };
  }
});

// node_modules/util-deprecate/node.js
var require_node = __commonJS({
  "node_modules/util-deprecate/node.js"(exports2, module2) {
    module2.exports = require("util").deprecate;
  }
});

// node_modules/readable-stream/lib/internal/streams/stream.js
var require_stream = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/stream.js"(exports2, module2) {
    module2.exports = require("stream");
  }
});

// node_modules/readable-stream/lib/internal/streams/destroy.js
var require_destroy = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/destroy.js"(exports2, module2) {
    "use strict";
    function destroy(err4, cb) {
      var _this = this;
      var readableDestroyed = this._readableState && this._readableState.destroyed;
      var writableDestroyed = this._writableState && this._writableState.destroyed;
      if (readableDestroyed || writableDestroyed) {
        if (cb) {
          cb(err4);
        } else if (err4) {
          if (!this._writableState) {
            process.nextTick(emitErrorNT, this, err4);
          } else if (!this._writableState.errorEmitted) {
            this._writableState.errorEmitted = true;
            process.nextTick(emitErrorNT, this, err4);
          }
        }
        return this;
      }
      if (this._readableState) {
        this._readableState.destroyed = true;
      }
      if (this._writableState) {
        this._writableState.destroyed = true;
      }
      this._destroy(err4 || null, function(err5) {
        if (!cb && err5) {
          if (!_this._writableState) {
            process.nextTick(emitErrorAndCloseNT, _this, err5);
          } else if (!_this._writableState.errorEmitted) {
            _this._writableState.errorEmitted = true;
            process.nextTick(emitErrorAndCloseNT, _this, err5);
          } else {
            process.nextTick(emitCloseNT, _this);
          }
        } else if (cb) {
          process.nextTick(emitCloseNT, _this);
          cb(err5);
        } else {
          process.nextTick(emitCloseNT, _this);
        }
      });
      return this;
    }
    function emitErrorAndCloseNT(self2, err4) {
      emitErrorNT(self2, err4);
      emitCloseNT(self2);
    }
    function emitCloseNT(self2) {
      if (self2._writableState && !self2._writableState.emitClose) return;
      if (self2._readableState && !self2._readableState.emitClose) return;
      self2.emit("close");
    }
    function undestroy() {
      if (this._readableState) {
        this._readableState.destroyed = false;
        this._readableState.reading = false;
        this._readableState.ended = false;
        this._readableState.endEmitted = false;
      }
      if (this._writableState) {
        this._writableState.destroyed = false;
        this._writableState.ended = false;
        this._writableState.ending = false;
        this._writableState.finalCalled = false;
        this._writableState.prefinished = false;
        this._writableState.finished = false;
        this._writableState.errorEmitted = false;
      }
    }
    function emitErrorNT(self2, err4) {
      self2.emit("error", err4);
    }
    function errorOrDestroy(stream, err4) {
      var rState = stream._readableState;
      var wState = stream._writableState;
      if (rState && rState.autoDestroy || wState && wState.autoDestroy) stream.destroy(err4);
      else stream.emit("error", err4);
    }
    module2.exports = {
      destroy,
      undestroy,
      errorOrDestroy
    };
  }
});

// node_modules/readable-stream/errors.js
var require_errors2 = __commonJS({
  "node_modules/readable-stream/errors.js"(exports2, module2) {
    "use strict";
    var codes = {};
    function createErrorType(code, message, Base) {
      if (!Base) {
        Base = Error;
      }
      function getMessage(arg1, arg2, arg3) {
        if (typeof message === "string") {
          return message;
        } else {
          return message(arg1, arg2, arg3);
        }
      }
      class NodeError extends Base {
        constructor(arg1, arg2, arg3) {
          super(getMessage(arg1, arg2, arg3));
        }
      }
      NodeError.prototype.name = Base.name;
      NodeError.prototype.code = code;
      codes[code] = NodeError;
    }
    function oneOf(expected, thing) {
      if (Array.isArray(expected)) {
        const len = expected.length;
        expected = expected.map((i) => String(i));
        if (len > 2) {
          return `one of ${thing} ${expected.slice(0, len - 1).join(", ")}, or ` + expected[len - 1];
        } else if (len === 2) {
          return `one of ${thing} ${expected[0]} or ${expected[1]}`;
        } else {
          return `of ${thing} ${expected[0]}`;
        }
      } else {
        return `of ${thing} ${String(expected)}`;
      }
    }
    function startsWith(str, search, pos) {
      return str.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
    }
    function endsWith(str, search, this_len) {
      if (this_len === void 0 || this_len > str.length) {
        this_len = str.length;
      }
      return str.substring(this_len - search.length, this_len) === search;
    }
    function includes(str, search, start) {
      if (typeof start !== "number") {
        start = 0;
      }
      if (start + search.length > str.length) {
        return false;
      } else {
        return str.indexOf(search, start) !== -1;
      }
    }
    createErrorType("ERR_INVALID_OPT_VALUE", function(name, value) {
      return 'The value "' + value + '" is invalid for option "' + name + '"';
    }, TypeError);
    createErrorType("ERR_INVALID_ARG_TYPE", function(name, expected, actual) {
      let determiner;
      if (typeof expected === "string" && startsWith(expected, "not ")) {
        determiner = "must not be";
        expected = expected.replace(/^not /, "");
      } else {
        determiner = "must be";
      }
      let msg;
      if (endsWith(name, " argument")) {
        msg = `The ${name} ${determiner} ${oneOf(expected, "type")}`;
      } else {
        const type = includes(name, ".") ? "property" : "argument";
        msg = `The "${name}" ${type} ${determiner} ${oneOf(expected, "type")}`;
      }
      msg += `. Received type ${typeof actual}`;
      return msg;
    }, TypeError);
    createErrorType("ERR_STREAM_PUSH_AFTER_EOF", "stream.push() after EOF");
    createErrorType("ERR_METHOD_NOT_IMPLEMENTED", function(name) {
      return "The " + name + " method is not implemented";
    });
    createErrorType("ERR_STREAM_PREMATURE_CLOSE", "Premature close");
    createErrorType("ERR_STREAM_DESTROYED", function(name) {
      return "Cannot call " + name + " after a stream was destroyed";
    });
    createErrorType("ERR_MULTIPLE_CALLBACK", "Callback called multiple times");
    createErrorType("ERR_STREAM_CANNOT_PIPE", "Cannot pipe, not readable");
    createErrorType("ERR_STREAM_WRITE_AFTER_END", "write after end");
    createErrorType("ERR_STREAM_NULL_VALUES", "May not write null values to stream", TypeError);
    createErrorType("ERR_UNKNOWN_ENCODING", function(arg) {
      return "Unknown encoding: " + arg;
    }, TypeError);
    createErrorType("ERR_STREAM_UNSHIFT_AFTER_END_EVENT", "stream.unshift() after end event");
    module2.exports.codes = codes;
  }
});

// node_modules/readable-stream/lib/internal/streams/state.js
var require_state = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/state.js"(exports2, module2) {
    "use strict";
    var ERR_INVALID_OPT_VALUE = require_errors2().codes.ERR_INVALID_OPT_VALUE;
    function highWaterMarkFrom(options, isDuplex, duplexKey) {
      return options.highWaterMark != null ? options.highWaterMark : isDuplex ? options[duplexKey] : null;
    }
    function getHighWaterMark(state, options, duplexKey, isDuplex) {
      var hwm = highWaterMarkFrom(options, isDuplex, duplexKey);
      if (hwm != null) {
        if (!(isFinite(hwm) && Math.floor(hwm) === hwm) || hwm < 0) {
          var name = isDuplex ? duplexKey : "highWaterMark";
          throw new ERR_INVALID_OPT_VALUE(name, hwm);
        }
        return Math.floor(hwm);
      }
      return state.objectMode ? 16 : 16 * 1024;
    }
    module2.exports = {
      getHighWaterMark
    };
  }
});

// node_modules/inherits/inherits_browser.js
var require_inherits_browser = __commonJS({
  "node_modules/inherits/inherits_browser.js"(exports2, module2) {
    if (typeof Object.create === "function") {
      module2.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          ctor.prototype = Object.create(superCtor.prototype, {
            constructor: {
              value: ctor,
              enumerable: false,
              writable: true,
              configurable: true
            }
          });
        }
      };
    } else {
      module2.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          var TempCtor = function() {
          };
          TempCtor.prototype = superCtor.prototype;
          ctor.prototype = new TempCtor();
          ctor.prototype.constructor = ctor;
        }
      };
    }
  }
});

// node_modules/inherits/inherits.js
var require_inherits = __commonJS({
  "node_modules/inherits/inherits.js"(exports2, module2) {
    try {
      util = require("util");
      if (typeof util.inherits !== "function") throw "";
      module2.exports = util.inherits;
    } catch (e) {
      module2.exports = require_inherits_browser();
    }
    var util;
  }
});

// node_modules/readable-stream/lib/internal/streams/buffer_list.js
var require_buffer_list = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/buffer_list.js"(exports2, module2) {
    "use strict";
    function ownKeys(object, enumerableOnly) {
      var keys = Object.keys(object);
      if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        enumerableOnly && (symbols = symbols.filter(function(sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        })), keys.push.apply(keys, symbols);
      }
      return keys;
    }
    function _objectSpread(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = null != arguments[i] ? arguments[i] : {};
        i % 2 ? ownKeys(Object(source), true).forEach(function(key) {
          _defineProperty(target, key, source[key]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
      return target;
    }
    function _defineProperty(obj, key, value) {
      key = _toPropertyKey(key);
      if (key in obj) {
        Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
      } else {
        obj[key] = value;
      }
      return obj;
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return typeof key === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (typeof input !== "object" || input === null) return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (typeof res !== "object") return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var _require = require("buffer");
    var Buffer2 = _require.Buffer;
    var _require2 = require("util");
    var inspect = _require2.inspect;
    var custom = inspect && inspect.custom || "inspect";
    function copyBuffer(src, target, offset) {
      Buffer2.prototype.copy.call(src, target, offset);
    }
    module2.exports = /* @__PURE__ */ (function() {
      function BufferList() {
        _classCallCheck(this, BufferList);
        this.head = null;
        this.tail = null;
        this.length = 0;
      }
      _createClass(BufferList, [{
        key: "push",
        value: function push(v) {
          var entry = {
            data: v,
            next: null
          };
          if (this.length > 0) this.tail.next = entry;
          else this.head = entry;
          this.tail = entry;
          ++this.length;
        }
      }, {
        key: "unshift",
        value: function unshift(v) {
          var entry = {
            data: v,
            next: this.head
          };
          if (this.length === 0) this.tail = entry;
          this.head = entry;
          ++this.length;
        }
      }, {
        key: "shift",
        value: function shift() {
          if (this.length === 0) return;
          var ret = this.head.data;
          if (this.length === 1) this.head = this.tail = null;
          else this.head = this.head.next;
          --this.length;
          return ret;
        }
      }, {
        key: "clear",
        value: function clear() {
          this.head = this.tail = null;
          this.length = 0;
        }
      }, {
        key: "join",
        value: function join(s) {
          if (this.length === 0) return "";
          var p = this.head;
          var ret = "" + p.data;
          while (p = p.next) ret += s + p.data;
          return ret;
        }
      }, {
        key: "concat",
        value: function concat(n) {
          if (this.length === 0) return Buffer2.alloc(0);
          var ret = Buffer2.allocUnsafe(n >>> 0);
          var p = this.head;
          var i = 0;
          while (p) {
            copyBuffer(p.data, ret, i);
            i += p.data.length;
            p = p.next;
          }
          return ret;
        }
        // Consumes a specified amount of bytes or characters from the buffered data.
      }, {
        key: "consume",
        value: function consume(n, hasStrings) {
          var ret;
          if (n < this.head.data.length) {
            ret = this.head.data.slice(0, n);
            this.head.data = this.head.data.slice(n);
          } else if (n === this.head.data.length) {
            ret = this.shift();
          } else {
            ret = hasStrings ? this._getString(n) : this._getBuffer(n);
          }
          return ret;
        }
      }, {
        key: "first",
        value: function first() {
          return this.head.data;
        }
        // Consumes a specified amount of characters from the buffered data.
      }, {
        key: "_getString",
        value: function _getString(n) {
          var p = this.head;
          var c = 1;
          var ret = p.data;
          n -= ret.length;
          while (p = p.next) {
            var str = p.data;
            var nb = n > str.length ? str.length : n;
            if (nb === str.length) ret += str;
            else ret += str.slice(0, n);
            n -= nb;
            if (n === 0) {
              if (nb === str.length) {
                ++c;
                if (p.next) this.head = p.next;
                else this.head = this.tail = null;
              } else {
                this.head = p;
                p.data = str.slice(nb);
              }
              break;
            }
            ++c;
          }
          this.length -= c;
          return ret;
        }
        // Consumes a specified amount of bytes from the buffered data.
      }, {
        key: "_getBuffer",
        value: function _getBuffer(n) {
          var ret = Buffer2.allocUnsafe(n);
          var p = this.head;
          var c = 1;
          p.data.copy(ret);
          n -= p.data.length;
          while (p = p.next) {
            var buf = p.data;
            var nb = n > buf.length ? buf.length : n;
            buf.copy(ret, ret.length - n, 0, nb);
            n -= nb;
            if (n === 0) {
              if (nb === buf.length) {
                ++c;
                if (p.next) this.head = p.next;
                else this.head = this.tail = null;
              } else {
                this.head = p;
                p.data = buf.slice(nb);
              }
              break;
            }
            ++c;
          }
          this.length -= c;
          return ret;
        }
        // Make sure the linked list only shows the minimal necessary information.
      }, {
        key: custom,
        value: function value(_, options) {
          return inspect(this, _objectSpread(_objectSpread({}, options), {}, {
            // Only inspect one level.
            depth: 0,
            // It should not recurse.
            customInspect: false
          }));
        }
      }]);
      return BufferList;
    })();
  }
});

// node_modules/safe-buffer/index.js
var require_safe_buffer = __commonJS({
  "node_modules/safe-buffer/index.js"(exports2, module2) {
    var buffer = require("buffer");
    var Buffer2 = buffer.Buffer;
    function copyProps(src, dst) {
      for (var key in src) {
        dst[key] = src[key];
      }
    }
    if (Buffer2.from && Buffer2.alloc && Buffer2.allocUnsafe && Buffer2.allocUnsafeSlow) {
      module2.exports = buffer;
    } else {
      copyProps(buffer, exports2);
      exports2.Buffer = SafeBuffer;
    }
    function SafeBuffer(arg, encodingOrOffset, length) {
      return Buffer2(arg, encodingOrOffset, length);
    }
    SafeBuffer.prototype = Object.create(Buffer2.prototype);
    copyProps(Buffer2, SafeBuffer);
    SafeBuffer.from = function(arg, encodingOrOffset, length) {
      if (typeof arg === "number") {
        throw new TypeError("Argument must not be a number");
      }
      return Buffer2(arg, encodingOrOffset, length);
    };
    SafeBuffer.alloc = function(size, fill, encoding) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      var buf = Buffer2(size);
      if (fill !== void 0) {
        if (typeof encoding === "string") {
          buf.fill(fill, encoding);
        } else {
          buf.fill(fill);
        }
      } else {
        buf.fill(0);
      }
      return buf;
    };
    SafeBuffer.allocUnsafe = function(size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return Buffer2(size);
    };
    SafeBuffer.allocUnsafeSlow = function(size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return buffer.SlowBuffer(size);
    };
  }
});

// node_modules/string_decoder/lib/string_decoder.js
var require_string_decoder = __commonJS({
  "node_modules/string_decoder/lib/string_decoder.js"(exports2) {
    "use strict";
    var Buffer2 = require_safe_buffer().Buffer;
    var isEncoding = Buffer2.isEncoding || function(encoding) {
      encoding = "" + encoding;
      switch (encoding && encoding.toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
        case "raw":
          return true;
        default:
          return false;
      }
    };
    function _normalizeEncoding(enc) {
      if (!enc) return "utf8";
      var retried;
      while (true) {
        switch (enc) {
          case "utf8":
          case "utf-8":
            return "utf8";
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return "utf16le";
          case "latin1":
          case "binary":
            return "latin1";
          case "base64":
          case "ascii":
          case "hex":
            return enc;
          default:
            if (retried) return;
            enc = ("" + enc).toLowerCase();
            retried = true;
        }
      }
    }
    function normalizeEncoding(enc) {
      var nenc = _normalizeEncoding(enc);
      if (typeof nenc !== "string" && (Buffer2.isEncoding === isEncoding || !isEncoding(enc))) throw new Error("Unknown encoding: " + enc);
      return nenc || enc;
    }
    exports2.StringDecoder = StringDecoder;
    function StringDecoder(encoding) {
      this.encoding = normalizeEncoding(encoding);
      var nb;
      switch (this.encoding) {
        case "utf16le":
          this.text = utf16Text;
          this.end = utf16End;
          nb = 4;
          break;
        case "utf8":
          this.fillLast = utf8FillLast;
          nb = 4;
          break;
        case "base64":
          this.text = base64Text;
          this.end = base64End;
          nb = 3;
          break;
        default:
          this.write = simpleWrite;
          this.end = simpleEnd;
          return;
      }
      this.lastNeed = 0;
      this.lastTotal = 0;
      this.lastChar = Buffer2.allocUnsafe(nb);
    }
    StringDecoder.prototype.write = function(buf) {
      if (buf.length === 0) return "";
      var r;
      var i;
      if (this.lastNeed) {
        r = this.fillLast(buf);
        if (r === void 0) return "";
        i = this.lastNeed;
        this.lastNeed = 0;
      } else {
        i = 0;
      }
      if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
      return r || "";
    };
    StringDecoder.prototype.end = utf8End;
    StringDecoder.prototype.text = utf8Text;
    StringDecoder.prototype.fillLast = function(buf) {
      if (this.lastNeed <= buf.length) {
        buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
        return this.lastChar.toString(this.encoding, 0, this.lastTotal);
      }
      buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
      this.lastNeed -= buf.length;
    };
    function utf8CheckByte(byte) {
      if (byte <= 127) return 0;
      else if (byte >> 5 === 6) return 2;
      else if (byte >> 4 === 14) return 3;
      else if (byte >> 3 === 30) return 4;
      return byte >> 6 === 2 ? -1 : -2;
    }
    function utf8CheckIncomplete(self2, buf, i) {
      var j = buf.length - 1;
      if (j < i) return 0;
      var nb = utf8CheckByte(buf[j]);
      if (nb >= 0) {
        if (nb > 0) self2.lastNeed = nb - 1;
        return nb;
      }
      if (--j < i || nb === -2) return 0;
      nb = utf8CheckByte(buf[j]);
      if (nb >= 0) {
        if (nb > 0) self2.lastNeed = nb - 2;
        return nb;
      }
      if (--j < i || nb === -2) return 0;
      nb = utf8CheckByte(buf[j]);
      if (nb >= 0) {
        if (nb > 0) {
          if (nb === 2) nb = 0;
          else self2.lastNeed = nb - 3;
        }
        return nb;
      }
      return 0;
    }
    function utf8CheckExtraBytes(self2, buf, p) {
      if ((buf[0] & 192) !== 128) {
        self2.lastNeed = 0;
        return "\uFFFD";
      }
      if (self2.lastNeed > 1 && buf.length > 1) {
        if ((buf[1] & 192) !== 128) {
          self2.lastNeed = 1;
          return "\uFFFD";
        }
        if (self2.lastNeed > 2 && buf.length > 2) {
          if ((buf[2] & 192) !== 128) {
            self2.lastNeed = 2;
            return "\uFFFD";
          }
        }
      }
    }
    function utf8FillLast(buf) {
      var p = this.lastTotal - this.lastNeed;
      var r = utf8CheckExtraBytes(this, buf, p);
      if (r !== void 0) return r;
      if (this.lastNeed <= buf.length) {
        buf.copy(this.lastChar, p, 0, this.lastNeed);
        return this.lastChar.toString(this.encoding, 0, this.lastTotal);
      }
      buf.copy(this.lastChar, p, 0, buf.length);
      this.lastNeed -= buf.length;
    }
    function utf8Text(buf, i) {
      var total = utf8CheckIncomplete(this, buf, i);
      if (!this.lastNeed) return buf.toString("utf8", i);
      this.lastTotal = total;
      var end = buf.length - (total - this.lastNeed);
      buf.copy(this.lastChar, 0, end);
      return buf.toString("utf8", i, end);
    }
    function utf8End(buf) {
      var r = buf && buf.length ? this.write(buf) : "";
      if (this.lastNeed) return r + "\uFFFD";
      return r;
    }
    function utf16Text(buf, i) {
      if ((buf.length - i) % 2 === 0) {
        var r = buf.toString("utf16le", i);
        if (r) {
          var c = r.charCodeAt(r.length - 1);
          if (c >= 55296 && c <= 56319) {
            this.lastNeed = 2;
            this.lastTotal = 4;
            this.lastChar[0] = buf[buf.length - 2];
            this.lastChar[1] = buf[buf.length - 1];
            return r.slice(0, -1);
          }
        }
        return r;
      }
      this.lastNeed = 1;
      this.lastTotal = 2;
      this.lastChar[0] = buf[buf.length - 1];
      return buf.toString("utf16le", i, buf.length - 1);
    }
    function utf16End(buf) {
      var r = buf && buf.length ? this.write(buf) : "";
      if (this.lastNeed) {
        var end = this.lastTotal - this.lastNeed;
        return r + this.lastChar.toString("utf16le", 0, end);
      }
      return r;
    }
    function base64Text(buf, i) {
      var n = (buf.length - i) % 3;
      if (n === 0) return buf.toString("base64", i);
      this.lastNeed = 3 - n;
      this.lastTotal = 3;
      if (n === 1) {
        this.lastChar[0] = buf[buf.length - 1];
      } else {
        this.lastChar[0] = buf[buf.length - 2];
        this.lastChar[1] = buf[buf.length - 1];
      }
      return buf.toString("base64", i, buf.length - n);
    }
    function base64End(buf) {
      var r = buf && buf.length ? this.write(buf) : "";
      if (this.lastNeed) return r + this.lastChar.toString("base64", 0, 3 - this.lastNeed);
      return r;
    }
    function simpleWrite(buf) {
      return buf.toString(this.encoding);
    }
    function simpleEnd(buf) {
      return buf && buf.length ? this.write(buf) : "";
    }
  }
});

// node_modules/readable-stream/lib/internal/streams/end-of-stream.js
var require_end_of_stream = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/end-of-stream.js"(exports2, module2) {
    "use strict";
    var ERR_STREAM_PREMATURE_CLOSE = require_errors2().codes.ERR_STREAM_PREMATURE_CLOSE;
    function once(callback) {
      var called = false;
      return function() {
        if (called) return;
        called = true;
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        callback.apply(this, args);
      };
    }
    function noop() {
    }
    function isRequest(stream) {
      return stream.setHeader && typeof stream.abort === "function";
    }
    function eos(stream, opts, callback) {
      if (typeof opts === "function") return eos(stream, null, opts);
      if (!opts) opts = {};
      callback = once(callback || noop);
      var readable = opts.readable || opts.readable !== false && stream.readable;
      var writable = opts.writable || opts.writable !== false && stream.writable;
      var onlegacyfinish = function onlegacyfinish2() {
        if (!stream.writable) onfinish();
      };
      var writableEnded = stream._writableState && stream._writableState.finished;
      var onfinish = function onfinish2() {
        writable = false;
        writableEnded = true;
        if (!readable) callback.call(stream);
      };
      var readableEnded = stream._readableState && stream._readableState.endEmitted;
      var onend = function onend2() {
        readable = false;
        readableEnded = true;
        if (!writable) callback.call(stream);
      };
      var onerror = function onerror2(err4) {
        callback.call(stream, err4);
      };
      var onclose = function onclose2() {
        var err4;
        if (readable && !readableEnded) {
          if (!stream._readableState || !stream._readableState.ended) err4 = new ERR_STREAM_PREMATURE_CLOSE();
          return callback.call(stream, err4);
        }
        if (writable && !writableEnded) {
          if (!stream._writableState || !stream._writableState.ended) err4 = new ERR_STREAM_PREMATURE_CLOSE();
          return callback.call(stream, err4);
        }
      };
      var onrequest = function onrequest2() {
        stream.req.on("finish", onfinish);
      };
      if (isRequest(stream)) {
        stream.on("complete", onfinish);
        stream.on("abort", onclose);
        if (stream.req) onrequest();
        else stream.on("request", onrequest);
      } else if (writable && !stream._writableState) {
        stream.on("end", onlegacyfinish);
        stream.on("close", onlegacyfinish);
      }
      stream.on("end", onend);
      stream.on("finish", onfinish);
      if (opts.error !== false) stream.on("error", onerror);
      stream.on("close", onclose);
      return function() {
        stream.removeListener("complete", onfinish);
        stream.removeListener("abort", onclose);
        stream.removeListener("request", onrequest);
        if (stream.req) stream.req.removeListener("finish", onfinish);
        stream.removeListener("end", onlegacyfinish);
        stream.removeListener("close", onlegacyfinish);
        stream.removeListener("finish", onfinish);
        stream.removeListener("end", onend);
        stream.removeListener("error", onerror);
        stream.removeListener("close", onclose);
      };
    }
    module2.exports = eos;
  }
});

// node_modules/readable-stream/lib/internal/streams/async_iterator.js
var require_async_iterator = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/async_iterator.js"(exports2, module2) {
    "use strict";
    var _Object$setPrototypeO;
    function _defineProperty(obj, key, value) {
      key = _toPropertyKey(key);
      if (key in obj) {
        Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
      } else {
        obj[key] = value;
      }
      return obj;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return typeof key === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (typeof input !== "object" || input === null) return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (typeof res !== "object") return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var finished = require_end_of_stream();
    var kLastResolve = /* @__PURE__ */ Symbol("lastResolve");
    var kLastReject = /* @__PURE__ */ Symbol("lastReject");
    var kError = /* @__PURE__ */ Symbol("error");
    var kEnded = /* @__PURE__ */ Symbol("ended");
    var kLastPromise = /* @__PURE__ */ Symbol("lastPromise");
    var kHandlePromise = /* @__PURE__ */ Symbol("handlePromise");
    var kStream = /* @__PURE__ */ Symbol("stream");
    function createIterResult(value, done) {
      return {
        value,
        done
      };
    }
    function readAndResolve(iter) {
      var resolve = iter[kLastResolve];
      if (resolve !== null) {
        var data = iter[kStream].read();
        if (data !== null) {
          iter[kLastPromise] = null;
          iter[kLastResolve] = null;
          iter[kLastReject] = null;
          resolve(createIterResult(data, false));
        }
      }
    }
    function onReadable(iter) {
      process.nextTick(readAndResolve, iter);
    }
    function wrapForNext(lastPromise, iter) {
      return function(resolve, reject) {
        lastPromise.then(function() {
          if (iter[kEnded]) {
            resolve(createIterResult(void 0, true));
            return;
          }
          iter[kHandlePromise](resolve, reject);
        }, reject);
      };
    }
    var AsyncIteratorPrototype = Object.getPrototypeOf(function() {
    });
    var ReadableStreamAsyncIteratorPrototype = Object.setPrototypeOf((_Object$setPrototypeO = {
      get stream() {
        return this[kStream];
      },
      next: function next() {
        var _this = this;
        var error = this[kError];
        if (error !== null) {
          return Promise.reject(error);
        }
        if (this[kEnded]) {
          return Promise.resolve(createIterResult(void 0, true));
        }
        if (this[kStream].destroyed) {
          return new Promise(function(resolve, reject) {
            process.nextTick(function() {
              if (_this[kError]) {
                reject(_this[kError]);
              } else {
                resolve(createIterResult(void 0, true));
              }
            });
          });
        }
        var lastPromise = this[kLastPromise];
        var promise;
        if (lastPromise) {
          promise = new Promise(wrapForNext(lastPromise, this));
        } else {
          var data = this[kStream].read();
          if (data !== null) {
            return Promise.resolve(createIterResult(data, false));
          }
          promise = new Promise(this[kHandlePromise]);
        }
        this[kLastPromise] = promise;
        return promise;
      }
    }, _defineProperty(_Object$setPrototypeO, Symbol.asyncIterator, function() {
      return this;
    }), _defineProperty(_Object$setPrototypeO, "return", function _return() {
      var _this2 = this;
      return new Promise(function(resolve, reject) {
        _this2[kStream].destroy(null, function(err4) {
          if (err4) {
            reject(err4);
            return;
          }
          resolve(createIterResult(void 0, true));
        });
      });
    }), _Object$setPrototypeO), AsyncIteratorPrototype);
    var createReadableStreamAsyncIterator = function createReadableStreamAsyncIterator2(stream) {
      var _Object$create;
      var iterator = Object.create(ReadableStreamAsyncIteratorPrototype, (_Object$create = {}, _defineProperty(_Object$create, kStream, {
        value: stream,
        writable: true
      }), _defineProperty(_Object$create, kLastResolve, {
        value: null,
        writable: true
      }), _defineProperty(_Object$create, kLastReject, {
        value: null,
        writable: true
      }), _defineProperty(_Object$create, kError, {
        value: null,
        writable: true
      }), _defineProperty(_Object$create, kEnded, {
        value: stream._readableState.endEmitted,
        writable: true
      }), _defineProperty(_Object$create, kHandlePromise, {
        value: function value(resolve, reject) {
          var data = iterator[kStream].read();
          if (data) {
            iterator[kLastPromise] = null;
            iterator[kLastResolve] = null;
            iterator[kLastReject] = null;
            resolve(createIterResult(data, false));
          } else {
            iterator[kLastResolve] = resolve;
            iterator[kLastReject] = reject;
          }
        },
        writable: true
      }), _Object$create));
      iterator[kLastPromise] = null;
      finished(stream, function(err4) {
        if (err4 && err4.code !== "ERR_STREAM_PREMATURE_CLOSE") {
          var reject = iterator[kLastReject];
          if (reject !== null) {
            iterator[kLastPromise] = null;
            iterator[kLastResolve] = null;
            iterator[kLastReject] = null;
            reject(err4);
          }
          iterator[kError] = err4;
          return;
        }
        var resolve = iterator[kLastResolve];
        if (resolve !== null) {
          iterator[kLastPromise] = null;
          iterator[kLastResolve] = null;
          iterator[kLastReject] = null;
          resolve(createIterResult(void 0, true));
        }
        iterator[kEnded] = true;
      });
      stream.on("readable", onReadable.bind(null, iterator));
      return iterator;
    };
    module2.exports = createReadableStreamAsyncIterator;
  }
});

// node_modules/readable-stream/lib/internal/streams/from.js
var require_from = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/from.js"(exports2, module2) {
    "use strict";
    function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
      try {
        var info = gen[key](arg);
        var value = info.value;
      } catch (error) {
        reject(error);
        return;
      }
      if (info.done) {
        resolve(value);
      } else {
        Promise.resolve(value).then(_next, _throw);
      }
    }
    function _asyncToGenerator(fn) {
      return function() {
        var self2 = this, args = arguments;
        return new Promise(function(resolve, reject) {
          var gen = fn.apply(self2, args);
          function _next(value) {
            asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
          }
          function _throw(err4) {
            asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err4);
          }
          _next(void 0);
        });
      };
    }
    function ownKeys(object, enumerableOnly) {
      var keys = Object.keys(object);
      if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        enumerableOnly && (symbols = symbols.filter(function(sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        })), keys.push.apply(keys, symbols);
      }
      return keys;
    }
    function _objectSpread(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = null != arguments[i] ? arguments[i] : {};
        i % 2 ? ownKeys(Object(source), true).forEach(function(key) {
          _defineProperty(target, key, source[key]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
      return target;
    }
    function _defineProperty(obj, key, value) {
      key = _toPropertyKey(key);
      if (key in obj) {
        Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
      } else {
        obj[key] = value;
      }
      return obj;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return typeof key === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (typeof input !== "object" || input === null) return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (typeof res !== "object") return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var ERR_INVALID_ARG_TYPE = require_errors2().codes.ERR_INVALID_ARG_TYPE;
    function from(Readable2, iterable, opts) {
      var iterator;
      if (iterable && typeof iterable.next === "function") {
        iterator = iterable;
      } else if (iterable && iterable[Symbol.asyncIterator]) iterator = iterable[Symbol.asyncIterator]();
      else if (iterable && iterable[Symbol.iterator]) iterator = iterable[Symbol.iterator]();
      else throw new ERR_INVALID_ARG_TYPE("iterable", ["Iterable"], iterable);
      var readable = new Readable2(_objectSpread({
        objectMode: true
      }, opts));
      var reading = false;
      readable._read = function() {
        if (!reading) {
          reading = true;
          next();
        }
      };
      function next() {
        return _next2.apply(this, arguments);
      }
      function _next2() {
        _next2 = _asyncToGenerator(function* () {
          try {
            var _yield$iterator$next = yield iterator.next(), value = _yield$iterator$next.value, done = _yield$iterator$next.done;
            if (done) {
              readable.push(null);
            } else if (readable.push(yield value)) {
              next();
            } else {
              reading = false;
            }
          } catch (err4) {
            readable.destroy(err4);
          }
        });
        return _next2.apply(this, arguments);
      }
      return readable;
    }
    module2.exports = from;
  }
});

// node_modules/readable-stream/lib/_stream_readable.js
var require_stream_readable = __commonJS({
  "node_modules/readable-stream/lib/_stream_readable.js"(exports2, module2) {
    "use strict";
    module2.exports = Readable2;
    var Duplex;
    Readable2.ReadableState = ReadableState;
    var EE = require("events").EventEmitter;
    var EElistenerCount = function EElistenerCount2(emitter, type) {
      return emitter.listeners(type).length;
    };
    var Stream = require_stream();
    var Buffer2 = require("buffer").Buffer;
    var OurUint8Array = (typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : {}).Uint8Array || function() {
    };
    function _uint8ArrayToBuffer(chunk) {
      return Buffer2.from(chunk);
    }
    function _isUint8Array(obj) {
      return Buffer2.isBuffer(obj) || obj instanceof OurUint8Array;
    }
    var debugUtil = require("util");
    var debug;
    if (debugUtil && debugUtil.debuglog) {
      debug = debugUtil.debuglog("stream");
    } else {
      debug = function debug2() {
      };
    }
    var BufferList = require_buffer_list();
    var destroyImpl = require_destroy();
    var _require = require_state();
    var getHighWaterMark = _require.getHighWaterMark;
    var _require$codes = require_errors2().codes;
    var ERR_INVALID_ARG_TYPE = _require$codes.ERR_INVALID_ARG_TYPE;
    var ERR_STREAM_PUSH_AFTER_EOF = _require$codes.ERR_STREAM_PUSH_AFTER_EOF;
    var ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED;
    var ERR_STREAM_UNSHIFT_AFTER_END_EVENT = _require$codes.ERR_STREAM_UNSHIFT_AFTER_END_EVENT;
    var StringDecoder;
    var createReadableStreamAsyncIterator;
    var from;
    require_inherits()(Readable2, Stream);
    var errorOrDestroy = destroyImpl.errorOrDestroy;
    var kProxyEvents = ["error", "close", "destroy", "pause", "resume"];
    function prependListener(emitter, event, fn) {
      if (typeof emitter.prependListener === "function") return emitter.prependListener(event, fn);
      if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);
      else if (Array.isArray(emitter._events[event])) emitter._events[event].unshift(fn);
      else emitter._events[event] = [fn, emitter._events[event]];
    }
    function ReadableState(options, stream, isDuplex) {
      Duplex = Duplex || require_stream_duplex();
      options = options || {};
      if (typeof isDuplex !== "boolean") isDuplex = stream instanceof Duplex;
      this.objectMode = !!options.objectMode;
      if (isDuplex) this.objectMode = this.objectMode || !!options.readableObjectMode;
      this.highWaterMark = getHighWaterMark(this, options, "readableHighWaterMark", isDuplex);
      this.buffer = new BufferList();
      this.length = 0;
      this.pipes = null;
      this.pipesCount = 0;
      this.flowing = null;
      this.ended = false;
      this.endEmitted = false;
      this.reading = false;
      this.sync = true;
      this.needReadable = false;
      this.emittedReadable = false;
      this.readableListening = false;
      this.resumeScheduled = false;
      this.paused = true;
      this.emitClose = options.emitClose !== false;
      this.autoDestroy = !!options.autoDestroy;
      this.destroyed = false;
      this.defaultEncoding = options.defaultEncoding || "utf8";
      this.awaitDrain = 0;
      this.readingMore = false;
      this.decoder = null;
      this.encoding = null;
      if (options.encoding) {
        if (!StringDecoder) StringDecoder = require_string_decoder().StringDecoder;
        this.decoder = new StringDecoder(options.encoding);
        this.encoding = options.encoding;
      }
    }
    function Readable2(options) {
      Duplex = Duplex || require_stream_duplex();
      if (!(this instanceof Readable2)) return new Readable2(options);
      var isDuplex = this instanceof Duplex;
      this._readableState = new ReadableState(options, this, isDuplex);
      this.readable = true;
      if (options) {
        if (typeof options.read === "function") this._read = options.read;
        if (typeof options.destroy === "function") this._destroy = options.destroy;
      }
      Stream.call(this);
    }
    Object.defineProperty(Readable2.prototype, "destroyed", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function get() {
        if (this._readableState === void 0) {
          return false;
        }
        return this._readableState.destroyed;
      },
      set: function set(value) {
        if (!this._readableState) {
          return;
        }
        this._readableState.destroyed = value;
      }
    });
    Readable2.prototype.destroy = destroyImpl.destroy;
    Readable2.prototype._undestroy = destroyImpl.undestroy;
    Readable2.prototype._destroy = function(err4, cb) {
      cb(err4);
    };
    Readable2.prototype.push = function(chunk, encoding) {
      var state = this._readableState;
      var skipChunkCheck;
      if (!state.objectMode) {
        if (typeof chunk === "string") {
          encoding = encoding || state.defaultEncoding;
          if (encoding !== state.encoding) {
            chunk = Buffer2.from(chunk, encoding);
            encoding = "";
          }
          skipChunkCheck = true;
        }
      } else {
        skipChunkCheck = true;
      }
      return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
    };
    Readable2.prototype.unshift = function(chunk) {
      return readableAddChunk(this, chunk, null, true, false);
    };
    function readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {
      debug("readableAddChunk", chunk);
      var state = stream._readableState;
      if (chunk === null) {
        state.reading = false;
        onEofChunk(stream, state);
      } else {
        var er;
        if (!skipChunkCheck) er = chunkInvalid(state, chunk);
        if (er) {
          errorOrDestroy(stream, er);
        } else if (state.objectMode || chunk && chunk.length > 0) {
          if (typeof chunk !== "string" && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer2.prototype) {
            chunk = _uint8ArrayToBuffer(chunk);
          }
          if (addToFront) {
            if (state.endEmitted) errorOrDestroy(stream, new ERR_STREAM_UNSHIFT_AFTER_END_EVENT());
            else addChunk(stream, state, chunk, true);
          } else if (state.ended) {
            errorOrDestroy(stream, new ERR_STREAM_PUSH_AFTER_EOF());
          } else if (state.destroyed) {
            return false;
          } else {
            state.reading = false;
            if (state.decoder && !encoding) {
              chunk = state.decoder.write(chunk);
              if (state.objectMode || chunk.length !== 0) addChunk(stream, state, chunk, false);
              else maybeReadMore(stream, state);
            } else {
              addChunk(stream, state, chunk, false);
            }
          }
        } else if (!addToFront) {
          state.reading = false;
          maybeReadMore(stream, state);
        }
      }
      return !state.ended && (state.length < state.highWaterMark || state.length === 0);
    }
    function addChunk(stream, state, chunk, addToFront) {
      if (state.flowing && state.length === 0 && !state.sync) {
        state.awaitDrain = 0;
        stream.emit("data", chunk);
      } else {
        state.length += state.objectMode ? 1 : chunk.length;
        if (addToFront) state.buffer.unshift(chunk);
        else state.buffer.push(chunk);
        if (state.needReadable) emitReadable(stream);
      }
      maybeReadMore(stream, state);
    }
    function chunkInvalid(state, chunk) {
      var er;
      if (!_isUint8Array(chunk) && typeof chunk !== "string" && chunk !== void 0 && !state.objectMode) {
        er = new ERR_INVALID_ARG_TYPE("chunk", ["string", "Buffer", "Uint8Array"], chunk);
      }
      return er;
    }
    Readable2.prototype.isPaused = function() {
      return this._readableState.flowing === false;
    };
    Readable2.prototype.setEncoding = function(enc) {
      if (!StringDecoder) StringDecoder = require_string_decoder().StringDecoder;
      var decoder = new StringDecoder(enc);
      this._readableState.decoder = decoder;
      this._readableState.encoding = this._readableState.decoder.encoding;
      var p = this._readableState.buffer.head;
      var content = "";
      while (p !== null) {
        content += decoder.write(p.data);
        p = p.next;
      }
      this._readableState.buffer.clear();
      if (content !== "") this._readableState.buffer.push(content);
      this._readableState.length = content.length;
      return this;
    };
    var MAX_HWM = 1073741824;
    function computeNewHighWaterMark(n) {
      if (n >= MAX_HWM) {
        n = MAX_HWM;
      } else {
        n--;
        n |= n >>> 1;
        n |= n >>> 2;
        n |= n >>> 4;
        n |= n >>> 8;
        n |= n >>> 16;
        n++;
      }
      return n;
    }
    function howMuchToRead(n, state) {
      if (n <= 0 || state.length === 0 && state.ended) return 0;
      if (state.objectMode) return 1;
      if (n !== n) {
        if (state.flowing && state.length) return state.buffer.head.data.length;
        else return state.length;
      }
      if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
      if (n <= state.length) return n;
      if (!state.ended) {
        state.needReadable = true;
        return 0;
      }
      return state.length;
    }
    Readable2.prototype.read = function(n) {
      debug("read", n);
      n = parseInt(n, 10);
      var state = this._readableState;
      var nOrig = n;
      if (n !== 0) state.emittedReadable = false;
      if (n === 0 && state.needReadable && ((state.highWaterMark !== 0 ? state.length >= state.highWaterMark : state.length > 0) || state.ended)) {
        debug("read: emitReadable", state.length, state.ended);
        if (state.length === 0 && state.ended) endReadable(this);
        else emitReadable(this);
        return null;
      }
      n = howMuchToRead(n, state);
      if (n === 0 && state.ended) {
        if (state.length === 0) endReadable(this);
        return null;
      }
      var doRead = state.needReadable;
      debug("need readable", doRead);
      if (state.length === 0 || state.length - n < state.highWaterMark) {
        doRead = true;
        debug("length less than watermark", doRead);
      }
      if (state.ended || state.reading) {
        doRead = false;
        debug("reading or ended", doRead);
      } else if (doRead) {
        debug("do read");
        state.reading = true;
        state.sync = true;
        if (state.length === 0) state.needReadable = true;
        this._read(state.highWaterMark);
        state.sync = false;
        if (!state.reading) n = howMuchToRead(nOrig, state);
      }
      var ret;
      if (n > 0) ret = fromList(n, state);
      else ret = null;
      if (ret === null) {
        state.needReadable = state.length <= state.highWaterMark;
        n = 0;
      } else {
        state.length -= n;
        state.awaitDrain = 0;
      }
      if (state.length === 0) {
        if (!state.ended) state.needReadable = true;
        if (nOrig !== n && state.ended) endReadable(this);
      }
      if (ret !== null) this.emit("data", ret);
      return ret;
    };
    function onEofChunk(stream, state) {
      debug("onEofChunk");
      if (state.ended) return;
      if (state.decoder) {
        var chunk = state.decoder.end();
        if (chunk && chunk.length) {
          state.buffer.push(chunk);
          state.length += state.objectMode ? 1 : chunk.length;
        }
      }
      state.ended = true;
      if (state.sync) {
        emitReadable(stream);
      } else {
        state.needReadable = false;
        if (!state.emittedReadable) {
          state.emittedReadable = true;
          emitReadable_(stream);
        }
      }
    }
    function emitReadable(stream) {
      var state = stream._readableState;
      debug("emitReadable", state.needReadable, state.emittedReadable);
      state.needReadable = false;
      if (!state.emittedReadable) {
        debug("emitReadable", state.flowing);
        state.emittedReadable = true;
        process.nextTick(emitReadable_, stream);
      }
    }
    function emitReadable_(stream) {
      var state = stream._readableState;
      debug("emitReadable_", state.destroyed, state.length, state.ended);
      if (!state.destroyed && (state.length || state.ended)) {
        stream.emit("readable");
        state.emittedReadable = false;
      }
      state.needReadable = !state.flowing && !state.ended && state.length <= state.highWaterMark;
      flow(stream);
    }
    function maybeReadMore(stream, state) {
      if (!state.readingMore) {
        state.readingMore = true;
        process.nextTick(maybeReadMore_, stream, state);
      }
    }
    function maybeReadMore_(stream, state) {
      while (!state.reading && !state.ended && (state.length < state.highWaterMark || state.flowing && state.length === 0)) {
        var len = state.length;
        debug("maybeReadMore read 0");
        stream.read(0);
        if (len === state.length)
          break;
      }
      state.readingMore = false;
    }
    Readable2.prototype._read = function(n) {
      errorOrDestroy(this, new ERR_METHOD_NOT_IMPLEMENTED("_read()"));
    };
    Readable2.prototype.pipe = function(dest, pipeOpts) {
      var src = this;
      var state = this._readableState;
      switch (state.pipesCount) {
        case 0:
          state.pipes = dest;
          break;
        case 1:
          state.pipes = [state.pipes, dest];
          break;
        default:
          state.pipes.push(dest);
          break;
      }
      state.pipesCount += 1;
      debug("pipe count=%d opts=%j", state.pipesCount, pipeOpts);
      var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;
      var endFn = doEnd ? onend : unpipe;
      if (state.endEmitted) process.nextTick(endFn);
      else src.once("end", endFn);
      dest.on("unpipe", onunpipe);
      function onunpipe(readable, unpipeInfo) {
        debug("onunpipe");
        if (readable === src) {
          if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
            unpipeInfo.hasUnpiped = true;
            cleanup();
          }
        }
      }
      function onend() {
        debug("onend");
        dest.end();
      }
      var ondrain = pipeOnDrain(src);
      dest.on("drain", ondrain);
      var cleanedUp = false;
      function cleanup() {
        debug("cleanup");
        dest.removeListener("close", onclose);
        dest.removeListener("finish", onfinish);
        dest.removeListener("drain", ondrain);
        dest.removeListener("error", onerror);
        dest.removeListener("unpipe", onunpipe);
        src.removeListener("end", onend);
        src.removeListener("end", unpipe);
        src.removeListener("data", ondata);
        cleanedUp = true;
        if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
      }
      src.on("data", ondata);
      function ondata(chunk) {
        debug("ondata");
        var ret = dest.write(chunk);
        debug("dest.write", ret);
        if (ret === false) {
          if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
            debug("false write response, pause", state.awaitDrain);
            state.awaitDrain++;
          }
          src.pause();
        }
      }
      function onerror(er) {
        debug("onerror", er);
        unpipe();
        dest.removeListener("error", onerror);
        if (EElistenerCount(dest, "error") === 0) errorOrDestroy(dest, er);
      }
      prependListener(dest, "error", onerror);
      function onclose() {
        dest.removeListener("finish", onfinish);
        unpipe();
      }
      dest.once("close", onclose);
      function onfinish() {
        debug("onfinish");
        dest.removeListener("close", onclose);
        unpipe();
      }
      dest.once("finish", onfinish);
      function unpipe() {
        debug("unpipe");
        src.unpipe(dest);
      }
      dest.emit("pipe", src);
      if (!state.flowing) {
        debug("pipe resume");
        src.resume();
      }
      return dest;
    };
    function pipeOnDrain(src) {
      return function pipeOnDrainFunctionResult() {
        var state = src._readableState;
        debug("pipeOnDrain", state.awaitDrain);
        if (state.awaitDrain) state.awaitDrain--;
        if (state.awaitDrain === 0 && EElistenerCount(src, "data")) {
          state.flowing = true;
          flow(src);
        }
      };
    }
    Readable2.prototype.unpipe = function(dest) {
      var state = this._readableState;
      var unpipeInfo = {
        hasUnpiped: false
      };
      if (state.pipesCount === 0) return this;
      if (state.pipesCount === 1) {
        if (dest && dest !== state.pipes) return this;
        if (!dest) dest = state.pipes;
        state.pipes = null;
        state.pipesCount = 0;
        state.flowing = false;
        if (dest) dest.emit("unpipe", this, unpipeInfo);
        return this;
      }
      if (!dest) {
        var dests = state.pipes;
        var len = state.pipesCount;
        state.pipes = null;
        state.pipesCount = 0;
        state.flowing = false;
        for (var i = 0; i < len; i++) dests[i].emit("unpipe", this, {
          hasUnpiped: false
        });
        return this;
      }
      var index = indexOf(state.pipes, dest);
      if (index === -1) return this;
      state.pipes.splice(index, 1);
      state.pipesCount -= 1;
      if (state.pipesCount === 1) state.pipes = state.pipes[0];
      dest.emit("unpipe", this, unpipeInfo);
      return this;
    };
    Readable2.prototype.on = function(ev, fn) {
      var res = Stream.prototype.on.call(this, ev, fn);
      var state = this._readableState;
      if (ev === "data") {
        state.readableListening = this.listenerCount("readable") > 0;
        if (state.flowing !== false) this.resume();
      } else if (ev === "readable") {
        if (!state.endEmitted && !state.readableListening) {
          state.readableListening = state.needReadable = true;
          state.flowing = false;
          state.emittedReadable = false;
          debug("on readable", state.length, state.reading);
          if (state.length) {
            emitReadable(this);
          } else if (!state.reading) {
            process.nextTick(nReadingNextTick, this);
          }
        }
      }
      return res;
    };
    Readable2.prototype.addListener = Readable2.prototype.on;
    Readable2.prototype.removeListener = function(ev, fn) {
      var res = Stream.prototype.removeListener.call(this, ev, fn);
      if (ev === "readable") {
        process.nextTick(updateReadableListening, this);
      }
      return res;
    };
    Readable2.prototype.removeAllListeners = function(ev) {
      var res = Stream.prototype.removeAllListeners.apply(this, arguments);
      if (ev === "readable" || ev === void 0) {
        process.nextTick(updateReadableListening, this);
      }
      return res;
    };
    function updateReadableListening(self2) {
      var state = self2._readableState;
      state.readableListening = self2.listenerCount("readable") > 0;
      if (state.resumeScheduled && !state.paused) {
        state.flowing = true;
      } else if (self2.listenerCount("data") > 0) {
        self2.resume();
      }
    }
    function nReadingNextTick(self2) {
      debug("readable nexttick read 0");
      self2.read(0);
    }
    Readable2.prototype.resume = function() {
      var state = this._readableState;
      if (!state.flowing) {
        debug("resume");
        state.flowing = !state.readableListening;
        resume(this, state);
      }
      state.paused = false;
      return this;
    };
    function resume(stream, state) {
      if (!state.resumeScheduled) {
        state.resumeScheduled = true;
        process.nextTick(resume_, stream, state);
      }
    }
    function resume_(stream, state) {
      debug("resume", state.reading);
      if (!state.reading) {
        stream.read(0);
      }
      state.resumeScheduled = false;
      stream.emit("resume");
      flow(stream);
      if (state.flowing && !state.reading) stream.read(0);
    }
    Readable2.prototype.pause = function() {
      debug("call pause flowing=%j", this._readableState.flowing);
      if (this._readableState.flowing !== false) {
        debug("pause");
        this._readableState.flowing = false;
        this.emit("pause");
      }
      this._readableState.paused = true;
      return this;
    };
    function flow(stream) {
      var state = stream._readableState;
      debug("flow", state.flowing);
      while (state.flowing && stream.read() !== null) ;
    }
    Readable2.prototype.wrap = function(stream) {
      var _this = this;
      var state = this._readableState;
      var paused = false;
      stream.on("end", function() {
        debug("wrapped end");
        if (state.decoder && !state.ended) {
          var chunk = state.decoder.end();
          if (chunk && chunk.length) _this.push(chunk);
        }
        _this.push(null);
      });
      stream.on("data", function(chunk) {
        debug("wrapped data");
        if (state.decoder) chunk = state.decoder.write(chunk);
        if (state.objectMode && (chunk === null || chunk === void 0)) return;
        else if (!state.objectMode && (!chunk || !chunk.length)) return;
        var ret = _this.push(chunk);
        if (!ret) {
          paused = true;
          stream.pause();
        }
      });
      for (var i in stream) {
        if (this[i] === void 0 && typeof stream[i] === "function") {
          this[i] = /* @__PURE__ */ (function methodWrap(method) {
            return function methodWrapReturnFunction() {
              return stream[method].apply(stream, arguments);
            };
          })(i);
        }
      }
      for (var n = 0; n < kProxyEvents.length; n++) {
        stream.on(kProxyEvents[n], this.emit.bind(this, kProxyEvents[n]));
      }
      this._read = function(n2) {
        debug("wrapped _read", n2);
        if (paused) {
          paused = false;
          stream.resume();
        }
      };
      return this;
    };
    if (typeof Symbol === "function") {
      Readable2.prototype[Symbol.asyncIterator] = function() {
        if (createReadableStreamAsyncIterator === void 0) {
          createReadableStreamAsyncIterator = require_async_iterator();
        }
        return createReadableStreamAsyncIterator(this);
      };
    }
    Object.defineProperty(Readable2.prototype, "readableHighWaterMark", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function get() {
        return this._readableState.highWaterMark;
      }
    });
    Object.defineProperty(Readable2.prototype, "readableBuffer", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function get() {
        return this._readableState && this._readableState.buffer;
      }
    });
    Object.defineProperty(Readable2.prototype, "readableFlowing", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function get() {
        return this._readableState.flowing;
      },
      set: function set(state) {
        if (this._readableState) {
          this._readableState.flowing = state;
        }
      }
    });
    Readable2._fromList = fromList;
    Object.defineProperty(Readable2.prototype, "readableLength", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function get() {
        return this._readableState.length;
      }
    });
    function fromList(n, state) {
      if (state.length === 0) return null;
      var ret;
      if (state.objectMode) ret = state.buffer.shift();
      else if (!n || n >= state.length) {
        if (state.decoder) ret = state.buffer.join("");
        else if (state.buffer.length === 1) ret = state.buffer.first();
        else ret = state.buffer.concat(state.length);
        state.buffer.clear();
      } else {
        ret = state.buffer.consume(n, state.decoder);
      }
      return ret;
    }
    function endReadable(stream) {
      var state = stream._readableState;
      debug("endReadable", state.endEmitted);
      if (!state.endEmitted) {
        state.ended = true;
        process.nextTick(endReadableNT, state, stream);
      }
    }
    function endReadableNT(state, stream) {
      debug("endReadableNT", state.endEmitted, state.length);
      if (!state.endEmitted && state.length === 0) {
        state.endEmitted = true;
        stream.readable = false;
        stream.emit("end");
        if (state.autoDestroy) {
          var wState = stream._writableState;
          if (!wState || wState.autoDestroy && wState.finished) {
            stream.destroy();
          }
        }
      }
    }
    if (typeof Symbol === "function") {
      Readable2.from = function(iterable, opts) {
        if (from === void 0) {
          from = require_from();
        }
        return from(Readable2, iterable, opts);
      };
    }
    function indexOf(xs, x) {
      for (var i = 0, l = xs.length; i < l; i++) {
        if (xs[i] === x) return i;
      }
      return -1;
    }
  }
});

// node_modules/readable-stream/lib/_stream_duplex.js
var require_stream_duplex = __commonJS({
  "node_modules/readable-stream/lib/_stream_duplex.js"(exports2, module2) {
    "use strict";
    var objectKeys = Object.keys || function(obj) {
      var keys2 = [];
      for (var key in obj) keys2.push(key);
      return keys2;
    };
    module2.exports = Duplex;
    var Readable2 = require_stream_readable();
    var Writable2 = require_stream_writable();
    require_inherits()(Duplex, Readable2);
    {
      keys = objectKeys(Writable2.prototype);
      for (v = 0; v < keys.length; v++) {
        method = keys[v];
        if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable2.prototype[method];
      }
    }
    var keys;
    var method;
    var v;
    function Duplex(options) {
      if (!(this instanceof Duplex)) return new Duplex(options);
      Readable2.call(this, options);
      Writable2.call(this, options);
      this.allowHalfOpen = true;
      if (options) {
        if (options.readable === false) this.readable = false;
        if (options.writable === false) this.writable = false;
        if (options.allowHalfOpen === false) {
          this.allowHalfOpen = false;
          this.once("end", onend);
        }
      }
    }
    Object.defineProperty(Duplex.prototype, "writableHighWaterMark", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function get() {
        return this._writableState.highWaterMark;
      }
    });
    Object.defineProperty(Duplex.prototype, "writableBuffer", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function get() {
        return this._writableState && this._writableState.getBuffer();
      }
    });
    Object.defineProperty(Duplex.prototype, "writableLength", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function get() {
        return this._writableState.length;
      }
    });
    function onend() {
      if (this._writableState.ended) return;
      process.nextTick(onEndNT, this);
    }
    function onEndNT(self2) {
      self2.end();
    }
    Object.defineProperty(Duplex.prototype, "destroyed", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function get() {
        if (this._readableState === void 0 || this._writableState === void 0) {
          return false;
        }
        return this._readableState.destroyed && this._writableState.destroyed;
      },
      set: function set(value) {
        if (this._readableState === void 0 || this._writableState === void 0) {
          return;
        }
        this._readableState.destroyed = value;
        this._writableState.destroyed = value;
      }
    });
  }
});

// node_modules/readable-stream/lib/_stream_writable.js
var require_stream_writable = __commonJS({
  "node_modules/readable-stream/lib/_stream_writable.js"(exports2, module2) {
    "use strict";
    module2.exports = Writable2;
    function CorkedRequest(state) {
      var _this = this;
      this.next = null;
      this.entry = null;
      this.finish = function() {
        onCorkedFinish(_this, state);
      };
    }
    var Duplex;
    Writable2.WritableState = WritableState;
    var internalUtil = {
      deprecate: require_node()
    };
    var Stream = require_stream();
    var Buffer2 = require("buffer").Buffer;
    var OurUint8Array = (typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : {}).Uint8Array || function() {
    };
    function _uint8ArrayToBuffer(chunk) {
      return Buffer2.from(chunk);
    }
    function _isUint8Array(obj) {
      return Buffer2.isBuffer(obj) || obj instanceof OurUint8Array;
    }
    var destroyImpl = require_destroy();
    var _require = require_state();
    var getHighWaterMark = _require.getHighWaterMark;
    var _require$codes = require_errors2().codes;
    var ERR_INVALID_ARG_TYPE = _require$codes.ERR_INVALID_ARG_TYPE;
    var ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED;
    var ERR_MULTIPLE_CALLBACK = _require$codes.ERR_MULTIPLE_CALLBACK;
    var ERR_STREAM_CANNOT_PIPE = _require$codes.ERR_STREAM_CANNOT_PIPE;
    var ERR_STREAM_DESTROYED = _require$codes.ERR_STREAM_DESTROYED;
    var ERR_STREAM_NULL_VALUES = _require$codes.ERR_STREAM_NULL_VALUES;
    var ERR_STREAM_WRITE_AFTER_END = _require$codes.ERR_STREAM_WRITE_AFTER_END;
    var ERR_UNKNOWN_ENCODING = _require$codes.ERR_UNKNOWN_ENCODING;
    var errorOrDestroy = destroyImpl.errorOrDestroy;
    require_inherits()(Writable2, Stream);
    function nop() {
    }
    function WritableState(options, stream, isDuplex) {
      Duplex = Duplex || require_stream_duplex();
      options = options || {};
      if (typeof isDuplex !== "boolean") isDuplex = stream instanceof Duplex;
      this.objectMode = !!options.objectMode;
      if (isDuplex) this.objectMode = this.objectMode || !!options.writableObjectMode;
      this.highWaterMark = getHighWaterMark(this, options, "writableHighWaterMark", isDuplex);
      this.finalCalled = false;
      this.needDrain = false;
      this.ending = false;
      this.ended = false;
      this.finished = false;
      this.destroyed = false;
      var noDecode = options.decodeStrings === false;
      this.decodeStrings = !noDecode;
      this.defaultEncoding = options.defaultEncoding || "utf8";
      this.length = 0;
      this.writing = false;
      this.corked = 0;
      this.sync = true;
      this.bufferProcessing = false;
      this.onwrite = function(er) {
        onwrite(stream, er);
      };
      this.writecb = null;
      this.writelen = 0;
      this.bufferedRequest = null;
      this.lastBufferedRequest = null;
      this.pendingcb = 0;
      this.prefinished = false;
      this.errorEmitted = false;
      this.emitClose = options.emitClose !== false;
      this.autoDestroy = !!options.autoDestroy;
      this.bufferedRequestCount = 0;
      this.corkedRequestsFree = new CorkedRequest(this);
    }
    WritableState.prototype.getBuffer = function getBuffer() {
      var current = this.bufferedRequest;
      var out = [];
      while (current) {
        out.push(current);
        current = current.next;
      }
      return out;
    };
    (function() {
      try {
        Object.defineProperty(WritableState.prototype, "buffer", {
          get: internalUtil.deprecate(function writableStateBufferGetter() {
            return this.getBuffer();
          }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
        });
      } catch (_) {
      }
    })();
    var realHasInstance;
    if (typeof Symbol === "function" && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === "function") {
      realHasInstance = Function.prototype[Symbol.hasInstance];
      Object.defineProperty(Writable2, Symbol.hasInstance, {
        value: function value(object) {
          if (realHasInstance.call(this, object)) return true;
          if (this !== Writable2) return false;
          return object && object._writableState instanceof WritableState;
        }
      });
    } else {
      realHasInstance = function realHasInstance2(object) {
        return object instanceof this;
      };
    }
    function Writable2(options) {
      Duplex = Duplex || require_stream_duplex();
      var isDuplex = this instanceof Duplex;
      if (!isDuplex && !realHasInstance.call(Writable2, this)) return new Writable2(options);
      this._writableState = new WritableState(options, this, isDuplex);
      this.writable = true;
      if (options) {
        if (typeof options.write === "function") this._write = options.write;
        if (typeof options.writev === "function") this._writev = options.writev;
        if (typeof options.destroy === "function") this._destroy = options.destroy;
        if (typeof options.final === "function") this._final = options.final;
      }
      Stream.call(this);
    }
    Writable2.prototype.pipe = function() {
      errorOrDestroy(this, new ERR_STREAM_CANNOT_PIPE());
    };
    function writeAfterEnd(stream, cb) {
      var er = new ERR_STREAM_WRITE_AFTER_END();
      errorOrDestroy(stream, er);
      process.nextTick(cb, er);
    }
    function validChunk(stream, state, chunk, cb) {
      var er;
      if (chunk === null) {
        er = new ERR_STREAM_NULL_VALUES();
      } else if (typeof chunk !== "string" && !state.objectMode) {
        er = new ERR_INVALID_ARG_TYPE("chunk", ["string", "Buffer"], chunk);
      }
      if (er) {
        errorOrDestroy(stream, er);
        process.nextTick(cb, er);
        return false;
      }
      return true;
    }
    Writable2.prototype.write = function(chunk, encoding, cb) {
      var state = this._writableState;
      var ret = false;
      var isBuf = !state.objectMode && _isUint8Array(chunk);
      if (isBuf && !Buffer2.isBuffer(chunk)) {
        chunk = _uint8ArrayToBuffer(chunk);
      }
      if (typeof encoding === "function") {
        cb = encoding;
        encoding = null;
      }
      if (isBuf) encoding = "buffer";
      else if (!encoding) encoding = state.defaultEncoding;
      if (typeof cb !== "function") cb = nop;
      if (state.ending) writeAfterEnd(this, cb);
      else if (isBuf || validChunk(this, state, chunk, cb)) {
        state.pendingcb++;
        ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
      }
      return ret;
    };
    Writable2.prototype.cork = function() {
      this._writableState.corked++;
    };
    Writable2.prototype.uncork = function() {
      var state = this._writableState;
      if (state.corked) {
        state.corked--;
        if (!state.writing && !state.corked && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
      }
    };
    Writable2.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
      if (typeof encoding === "string") encoding = encoding.toLowerCase();
      if (!(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((encoding + "").toLowerCase()) > -1)) throw new ERR_UNKNOWN_ENCODING(encoding);
      this._writableState.defaultEncoding = encoding;
      return this;
    };
    Object.defineProperty(Writable2.prototype, "writableBuffer", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function get() {
        return this._writableState && this._writableState.getBuffer();
      }
    });
    function decodeChunk(state, chunk, encoding) {
      if (!state.objectMode && state.decodeStrings !== false && typeof chunk === "string") {
        chunk = Buffer2.from(chunk, encoding);
      }
      return chunk;
    }
    Object.defineProperty(Writable2.prototype, "writableHighWaterMark", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function get() {
        return this._writableState.highWaterMark;
      }
    });
    function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
      if (!isBuf) {
        var newChunk = decodeChunk(state, chunk, encoding);
        if (chunk !== newChunk) {
          isBuf = true;
          encoding = "buffer";
          chunk = newChunk;
        }
      }
      var len = state.objectMode ? 1 : chunk.length;
      state.length += len;
      var ret = state.length < state.highWaterMark;
      if (!ret) state.needDrain = true;
      if (state.writing || state.corked) {
        var last = state.lastBufferedRequest;
        state.lastBufferedRequest = {
          chunk,
          encoding,
          isBuf,
          callback: cb,
          next: null
        };
        if (last) {
          last.next = state.lastBufferedRequest;
        } else {
          state.bufferedRequest = state.lastBufferedRequest;
        }
        state.bufferedRequestCount += 1;
      } else {
        doWrite(stream, state, false, len, chunk, encoding, cb);
      }
      return ret;
    }
    function doWrite(stream, state, writev, len, chunk, encoding, cb) {
      state.writelen = len;
      state.writecb = cb;
      state.writing = true;
      state.sync = true;
      if (state.destroyed) state.onwrite(new ERR_STREAM_DESTROYED("write"));
      else if (writev) stream._writev(chunk, state.onwrite);
      else stream._write(chunk, encoding, state.onwrite);
      state.sync = false;
    }
    function onwriteError(stream, state, sync, er, cb) {
      --state.pendingcb;
      if (sync) {
        process.nextTick(cb, er);
        process.nextTick(finishMaybe, stream, state);
        stream._writableState.errorEmitted = true;
        errorOrDestroy(stream, er);
      } else {
        cb(er);
        stream._writableState.errorEmitted = true;
        errorOrDestroy(stream, er);
        finishMaybe(stream, state);
      }
    }
    function onwriteStateUpdate(state) {
      state.writing = false;
      state.writecb = null;
      state.length -= state.writelen;
      state.writelen = 0;
    }
    function onwrite(stream, er) {
      var state = stream._writableState;
      var sync = state.sync;
      var cb = state.writecb;
      if (typeof cb !== "function") throw new ERR_MULTIPLE_CALLBACK();
      onwriteStateUpdate(state);
      if (er) onwriteError(stream, state, sync, er, cb);
      else {
        var finished = needFinish(state) || stream.destroyed;
        if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
          clearBuffer(stream, state);
        }
        if (sync) {
          process.nextTick(afterWrite, stream, state, finished, cb);
        } else {
          afterWrite(stream, state, finished, cb);
        }
      }
    }
    function afterWrite(stream, state, finished, cb) {
      if (!finished) onwriteDrain(stream, state);
      state.pendingcb--;
      cb();
      finishMaybe(stream, state);
    }
    function onwriteDrain(stream, state) {
      if (state.length === 0 && state.needDrain) {
        state.needDrain = false;
        stream.emit("drain");
      }
    }
    function clearBuffer(stream, state) {
      state.bufferProcessing = true;
      var entry = state.bufferedRequest;
      if (stream._writev && entry && entry.next) {
        var l = state.bufferedRequestCount;
        var buffer = new Array(l);
        var holder = state.corkedRequestsFree;
        holder.entry = entry;
        var count = 0;
        var allBuffers = true;
        while (entry) {
          buffer[count] = entry;
          if (!entry.isBuf) allBuffers = false;
          entry = entry.next;
          count += 1;
        }
        buffer.allBuffers = allBuffers;
        doWrite(stream, state, true, state.length, buffer, "", holder.finish);
        state.pendingcb++;
        state.lastBufferedRequest = null;
        if (holder.next) {
          state.corkedRequestsFree = holder.next;
          holder.next = null;
        } else {
          state.corkedRequestsFree = new CorkedRequest(state);
        }
        state.bufferedRequestCount = 0;
      } else {
        while (entry) {
          var chunk = entry.chunk;
          var encoding = entry.encoding;
          var cb = entry.callback;
          var len = state.objectMode ? 1 : chunk.length;
          doWrite(stream, state, false, len, chunk, encoding, cb);
          entry = entry.next;
          state.bufferedRequestCount--;
          if (state.writing) {
            break;
          }
        }
        if (entry === null) state.lastBufferedRequest = null;
      }
      state.bufferedRequest = entry;
      state.bufferProcessing = false;
    }
    Writable2.prototype._write = function(chunk, encoding, cb) {
      cb(new ERR_METHOD_NOT_IMPLEMENTED("_write()"));
    };
    Writable2.prototype._writev = null;
    Writable2.prototype.end = function(chunk, encoding, cb) {
      var state = this._writableState;
      if (typeof chunk === "function") {
        cb = chunk;
        chunk = null;
        encoding = null;
      } else if (typeof encoding === "function") {
        cb = encoding;
        encoding = null;
      }
      if (chunk !== null && chunk !== void 0) this.write(chunk, encoding);
      if (state.corked) {
        state.corked = 1;
        this.uncork();
      }
      if (!state.ending) endWritable(this, state, cb);
      return this;
    };
    Object.defineProperty(Writable2.prototype, "writableLength", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function get() {
        return this._writableState.length;
      }
    });
    function needFinish(state) {
      return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
    }
    function callFinal(stream, state) {
      stream._final(function(err4) {
        state.pendingcb--;
        if (err4) {
          errorOrDestroy(stream, err4);
        }
        state.prefinished = true;
        stream.emit("prefinish");
        finishMaybe(stream, state);
      });
    }
    function prefinish(stream, state) {
      if (!state.prefinished && !state.finalCalled) {
        if (typeof stream._final === "function" && !state.destroyed) {
          state.pendingcb++;
          state.finalCalled = true;
          process.nextTick(callFinal, stream, state);
        } else {
          state.prefinished = true;
          stream.emit("prefinish");
        }
      }
    }
    function finishMaybe(stream, state) {
      var need = needFinish(state);
      if (need) {
        prefinish(stream, state);
        if (state.pendingcb === 0) {
          state.finished = true;
          stream.emit("finish");
          if (state.autoDestroy) {
            var rState = stream._readableState;
            if (!rState || rState.autoDestroy && rState.endEmitted) {
              stream.destroy();
            }
          }
        }
      }
      return need;
    }
    function endWritable(stream, state, cb) {
      state.ending = true;
      finishMaybe(stream, state);
      if (cb) {
        if (state.finished) process.nextTick(cb);
        else stream.once("finish", cb);
      }
      state.ended = true;
      stream.writable = false;
    }
    function onCorkedFinish(corkReq, state, err4) {
      var entry = corkReq.entry;
      corkReq.entry = null;
      while (entry) {
        var cb = entry.callback;
        state.pendingcb--;
        cb(err4);
        entry = entry.next;
      }
      state.corkedRequestsFree.next = corkReq;
    }
    Object.defineProperty(Writable2.prototype, "destroyed", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function get() {
        if (this._writableState === void 0) {
          return false;
        }
        return this._writableState.destroyed;
      },
      set: function set(value) {
        if (!this._writableState) {
          return;
        }
        this._writableState.destroyed = value;
      }
    });
    Writable2.prototype.destroy = destroyImpl.destroy;
    Writable2.prototype._undestroy = destroyImpl.undestroy;
    Writable2.prototype._destroy = function(err4, cb) {
      cb(err4);
    };
  }
});

// node_modules/winston-transport/modern.js
var require_modern = __commonJS({
  "node_modules/winston-transport/modern.js"(exports2, module2) {
    "use strict";
    var util = require("util");
    var Writable2 = require_stream_writable();
    var { LEVEL } = require_triple_beam();
    var TransportStream = module2.exports = function TransportStream2(options = {}) {
      Writable2.call(this, { objectMode: true, highWaterMark: options.highWaterMark });
      this.format = options.format;
      this.level = options.level;
      this.handleExceptions = options.handleExceptions;
      this.handleRejections = options.handleRejections;
      this.silent = options.silent;
      if (options.log) this.log = options.log;
      if (options.logv) this.logv = options.logv;
      if (options.close) this.close = options.close;
      this.once("pipe", (logger) => {
        this.levels = logger.levels;
        this.parent = logger;
      });
      this.once("unpipe", (src) => {
        if (src === this.parent) {
          this.parent = null;
          if (this.close) {
            this.close();
          }
        }
      });
    };
    util.inherits(TransportStream, Writable2);
    TransportStream.prototype._write = function _write(info, enc, callback) {
      if (this.silent || info.exception === true && !this.handleExceptions) {
        return callback(null);
      }
      const level = this.level || this.parent && this.parent.level;
      if (!level || this.levels[level] >= this.levels[info[LEVEL]]) {
        if (info && !this.format) {
          return this.log(info, callback);
        }
        let errState;
        let transformed;
        try {
          transformed = this.format.transform(Object.assign({}, info), this.format.options);
        } catch (err4) {
          errState = err4;
        }
        if (errState || !transformed) {
          callback();
          if (errState) throw errState;
          return;
        }
        return this.log(transformed, callback);
      }
      this._writableState.sync = false;
      return callback(null);
    };
    TransportStream.prototype._writev = function _writev(chunks, callback) {
      if (this.logv) {
        const infos = chunks.filter(this._accept, this);
        if (!infos.length) {
          return callback(null);
        }
        return this.logv(infos, callback);
      }
      for (let i = 0; i < chunks.length; i++) {
        if (!this._accept(chunks[i])) continue;
        if (chunks[i].chunk && !this.format) {
          this.log(chunks[i].chunk, chunks[i].callback);
          continue;
        }
        let errState;
        let transformed;
        try {
          transformed = this.format.transform(
            Object.assign({}, chunks[i].chunk),
            this.format.options
          );
        } catch (err4) {
          errState = err4;
        }
        if (errState || !transformed) {
          chunks[i].callback();
          if (errState) {
            callback(null);
            throw errState;
          }
        } else {
          this.log(transformed, chunks[i].callback);
        }
      }
      return callback(null);
    };
    TransportStream.prototype._accept = function _accept(write) {
      const info = write.chunk;
      if (this.silent) {
        return false;
      }
      const level = this.level || this.parent && this.parent.level;
      if (info.exception === true || !level || this.levels[level] >= this.levels[info[LEVEL]]) {
        if (this.handleExceptions || info.exception !== true) {
          return true;
        }
      }
      return false;
    };
    TransportStream.prototype._nop = function _nop() {
      return void 0;
    };
  }
});

// node_modules/winston-transport/legacy.js
var require_legacy = __commonJS({
  "node_modules/winston-transport/legacy.js"(exports2, module2) {
    "use strict";
    var util = require("util");
    var { LEVEL } = require_triple_beam();
    var TransportStream = require_modern();
    var LegacyTransportStream = module2.exports = function LegacyTransportStream2(options = {}) {
      TransportStream.call(this, options);
      if (!options.transport || typeof options.transport.log !== "function") {
        throw new Error("Invalid transport, must be an object with a log method.");
      }
      this.transport = options.transport;
      this.level = this.level || options.transport.level;
      this.handleExceptions = this.handleExceptions || options.transport.handleExceptions;
      this._deprecated();
      function transportError(err4) {
        this.emit("error", err4, this.transport);
      }
      if (!this.transport.__winstonError) {
        this.transport.__winstonError = transportError.bind(this);
        this.transport.on("error", this.transport.__winstonError);
      }
    };
    util.inherits(LegacyTransportStream, TransportStream);
    LegacyTransportStream.prototype._write = function _write(info, enc, callback) {
      if (this.silent || info.exception === true && !this.handleExceptions) {
        return callback(null);
      }
      if (!this.level || this.levels[this.level] >= this.levels[info[LEVEL]]) {
        this.transport.log(info[LEVEL], info.message, info, this._nop);
      }
      callback(null);
    };
    LegacyTransportStream.prototype._writev = function _writev(chunks, callback) {
      for (let i = 0; i < chunks.length; i++) {
        if (this._accept(chunks[i])) {
          this.transport.log(
            chunks[i].chunk[LEVEL],
            chunks[i].chunk.message,
            chunks[i].chunk,
            this._nop
          );
          chunks[i].callback();
        }
      }
      return callback(null);
    };
    LegacyTransportStream.prototype._deprecated = function _deprecated() {
      console.error([
        `${this.transport.name} is a legacy winston transport. Consider upgrading: `,
        "- Upgrade docs: https://github.com/winstonjs/winston/blob/master/UPGRADE-3.0.md"
      ].join("\n"));
    };
    LegacyTransportStream.prototype.close = function close() {
      if (this.transport.close) {
        this.transport.close();
      }
      if (this.transport.__winstonError) {
        this.transport.removeListener("error", this.transport.__winstonError);
        this.transport.__winstonError = null;
      }
    };
  }
});

// node_modules/winston-transport/index.js
var require_winston_transport = __commonJS({
  "node_modules/winston-transport/index.js"(exports2, module2) {
    "use strict";
    module2.exports = require_modern();
    module2.exports.LegacyTransportStream = require_legacy();
  }
});

// node_modules/winston/lib/winston/transports/console.js
var require_console = __commonJS({
  "node_modules/winston/lib/winston/transports/console.js"(exports2, module2) {
    "use strict";
    var os = require("os");
    var { LEVEL, MESSAGE } = require_triple_beam();
    var TransportStream = require_winston_transport();
    module2.exports = class Console extends TransportStream {
      /**
       * Constructor function for the Console transport object responsible for
       * persisting log messages and metadata to a terminal or TTY.
       * @param {!Object} [options={}] - Options for this instance.
       */
      constructor(options = {}) {
        super(options);
        this.name = options.name || "console";
        this.stderrLevels = this._stringArrayToSet(options.stderrLevels);
        this.consoleWarnLevels = this._stringArrayToSet(options.consoleWarnLevels);
        this.eol = typeof options.eol === "string" ? options.eol : os.EOL;
        this.forceConsole = options.forceConsole || false;
        this._consoleLog = console.log.bind(console);
        this._consoleWarn = console.warn.bind(console);
        this._consoleError = console.error.bind(console);
        this.setMaxListeners(30);
      }
      /**
       * Core logging method exposed to Winston.
       * @param {Object} info - TODO: add param description.
       * @param {Function} callback - TODO: add param description.
       * @returns {undefined}
       */
      log(info, callback) {
        setImmediate(() => this.emit("logged", info));
        if (this.stderrLevels[info[LEVEL]]) {
          if (console._stderr && !this.forceConsole) {
            console._stderr.write(`${info[MESSAGE]}${this.eol}`);
          } else {
            this._consoleError(info[MESSAGE]);
          }
          if (callback) {
            callback();
          }
          return;
        } else if (this.consoleWarnLevels[info[LEVEL]]) {
          if (console._stderr && !this.forceConsole) {
            console._stderr.write(`${info[MESSAGE]}${this.eol}`);
          } else {
            this._consoleWarn(info[MESSAGE]);
          }
          if (callback) {
            callback();
          }
          return;
        }
        if (console._stdout && !this.forceConsole) {
          console._stdout.write(`${info[MESSAGE]}${this.eol}`);
        } else {
          this._consoleLog(info[MESSAGE]);
        }
        if (callback) {
          callback();
        }
      }
      /**
       * Returns a Set-like object with strArray's elements as keys (each with the
       * value true).
       * @param {Array} strArray - Array of Set-elements as strings.
       * @param {?string} [errMsg] - Custom error message thrown on invalid input.
       * @returns {Object} - TODO: add return description.
       * @private
       */
      _stringArrayToSet(strArray, errMsg) {
        if (!strArray) return {};
        errMsg = errMsg || "Cannot make set from type other than Array of string elements";
        if (!Array.isArray(strArray)) {
          throw new Error(errMsg);
        }
        return strArray.reduce((set, el) => {
          if (typeof el !== "string") {
            throw new Error(errMsg);
          }
          set[el] = true;
          return set;
        }, {});
      }
    };
  }
});

// node_modules/async/internal/isArrayLike.js
var require_isArrayLike = __commonJS({
  "node_modules/async/internal/isArrayLike.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.default = isArrayLike;
    function isArrayLike(value) {
      return value && typeof value.length === "number" && value.length >= 0 && value.length % 1 === 0;
    }
    module2.exports = exports2.default;
  }
});

// node_modules/async/internal/initialParams.js
var require_initialParams = __commonJS({
  "node_modules/async/internal/initialParams.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.default = function(fn) {
      return function(...args) {
        var callback = args.pop();
        return fn.call(this, args, callback);
      };
    };
    module2.exports = exports2.default;
  }
});

// node_modules/async/internal/setImmediate.js
var require_setImmediate = __commonJS({
  "node_modules/async/internal/setImmediate.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.fallback = fallback;
    exports2.wrap = wrap;
    var hasQueueMicrotask = exports2.hasQueueMicrotask = typeof queueMicrotask === "function" && queueMicrotask;
    var hasSetImmediate = exports2.hasSetImmediate = typeof setImmediate === "function" && setImmediate;
    var hasNextTick = exports2.hasNextTick = typeof process === "object" && typeof process.nextTick === "function";
    function fallback(fn) {
      setTimeout(fn, 0);
    }
    function wrap(defer) {
      return (fn, ...args) => defer(() => fn(...args));
    }
    var _defer;
    if (hasQueueMicrotask) {
      _defer = queueMicrotask;
    } else if (hasSetImmediate) {
      _defer = setImmediate;
    } else if (hasNextTick) {
      _defer = process.nextTick;
    } else {
      _defer = fallback;
    }
    exports2.default = wrap(_defer);
  }
});

// node_modules/async/asyncify.js
var require_asyncify = __commonJS({
  "node_modules/async/asyncify.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.default = asyncify;
    var _initialParams = require_initialParams();
    var _initialParams2 = _interopRequireDefault(_initialParams);
    var _setImmediate = require_setImmediate();
    var _setImmediate2 = _interopRequireDefault(_setImmediate);
    var _wrapAsync = require_wrapAsync();
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function asyncify(func) {
      if ((0, _wrapAsync.isAsync)(func)) {
        return function(...args) {
          const callback = args.pop();
          const promise = func.apply(this, args);
          return handlePromise(promise, callback);
        };
      }
      return (0, _initialParams2.default)(function(args, callback) {
        var result;
        try {
          result = func.apply(this, args);
        } catch (e) {
          return callback(e);
        }
        if (result && typeof result.then === "function") {
          return handlePromise(result, callback);
        } else {
          callback(null, result);
        }
      });
    }
    function handlePromise(promise, callback) {
      return promise.then((value) => {
        invokeCallback(callback, null, value);
      }, (err4) => {
        invokeCallback(callback, err4 && (err4 instanceof Error || err4.message) ? err4 : new Error(err4));
      });
    }
    function invokeCallback(callback, error, value) {
      try {
        callback(error, value);
      } catch (err4) {
        (0, _setImmediate2.default)((e) => {
          throw e;
        }, err4);
      }
    }
    module2.exports = exports2.default;
  }
});

// node_modules/async/internal/wrapAsync.js
var require_wrapAsync = __commonJS({
  "node_modules/async/internal/wrapAsync.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.isAsyncIterable = exports2.isAsyncGenerator = exports2.isAsync = void 0;
    var _asyncify = require_asyncify();
    var _asyncify2 = _interopRequireDefault(_asyncify);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function isAsync(fn) {
      return fn[Symbol.toStringTag] === "AsyncFunction";
    }
    function isAsyncGenerator(fn) {
      return fn[Symbol.toStringTag] === "AsyncGenerator";
    }
    function isAsyncIterable(obj) {
      return typeof obj[Symbol.asyncIterator] === "function";
    }
    function wrapAsync(asyncFn) {
      if (typeof asyncFn !== "function") throw new Error("expected a function");
      return isAsync(asyncFn) ? (0, _asyncify2.default)(asyncFn) : asyncFn;
    }
    exports2.default = wrapAsync;
    exports2.isAsync = isAsync;
    exports2.isAsyncGenerator = isAsyncGenerator;
    exports2.isAsyncIterable = isAsyncIterable;
  }
});

// node_modules/async/internal/awaitify.js
var require_awaitify = __commonJS({
  "node_modules/async/internal/awaitify.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.default = awaitify;
    function awaitify(asyncFn, arity) {
      if (!arity) arity = asyncFn.length;
      if (!arity) throw new Error("arity is undefined");
      function awaitable(...args) {
        if (typeof args[arity - 1] === "function") {
          return asyncFn.apply(this, args);
        }
        return new Promise((resolve, reject) => {
          args[arity - 1] = (err4, ...cbArgs) => {
            if (err4) return reject(err4);
            resolve(cbArgs.length > 1 ? cbArgs : cbArgs[0]);
          };
          asyncFn.apply(this, args);
        });
      }
      return awaitable;
    }
    module2.exports = exports2.default;
  }
});

// node_modules/async/internal/parallel.js
var require_parallel = __commonJS({
  "node_modules/async/internal/parallel.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    var _isArrayLike = require_isArrayLike();
    var _isArrayLike2 = _interopRequireDefault(_isArrayLike);
    var _wrapAsync = require_wrapAsync();
    var _wrapAsync2 = _interopRequireDefault(_wrapAsync);
    var _awaitify = require_awaitify();
    var _awaitify2 = _interopRequireDefault(_awaitify);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    exports2.default = (0, _awaitify2.default)((eachfn, tasks, callback) => {
      var results = (0, _isArrayLike2.default)(tasks) ? [] : {};
      eachfn(tasks, (task, key, taskCb) => {
        (0, _wrapAsync2.default)(task)((err4, ...result) => {
          if (result.length < 2) {
            [result] = result;
          }
          results[key] = result;
          taskCb(err4);
        });
      }, (err4) => callback(err4, results));
    }, 3);
    module2.exports = exports2.default;
  }
});

// node_modules/async/internal/once.js
var require_once = __commonJS({
  "node_modules/async/internal/once.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.default = once;
    function once(fn) {
      function wrapper(...args) {
        if (fn === null) return;
        var callFn = fn;
        fn = null;
        callFn.apply(this, args);
      }
      Object.assign(wrapper, fn);
      return wrapper;
    }
    module2.exports = exports2.default;
  }
});

// node_modules/async/internal/getIterator.js
var require_getIterator = __commonJS({
  "node_modules/async/internal/getIterator.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.default = function(coll) {
      return coll[Symbol.iterator] && coll[Symbol.iterator]();
    };
    module2.exports = exports2.default;
  }
});

// node_modules/async/internal/iterator.js
var require_iterator = __commonJS({
  "node_modules/async/internal/iterator.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.default = createIterator;
    var _isArrayLike = require_isArrayLike();
    var _isArrayLike2 = _interopRequireDefault(_isArrayLike);
    var _getIterator = require_getIterator();
    var _getIterator2 = _interopRequireDefault(_getIterator);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function createArrayIterator(coll) {
      var i = -1;
      var len = coll.length;
      return function next() {
        return ++i < len ? { value: coll[i], key: i } : null;
      };
    }
    function createES2015Iterator(iterator) {
      var i = -1;
      return function next() {
        var item = iterator.next();
        if (item.done) return null;
        i++;
        return { value: item.value, key: i };
      };
    }
    function createObjectIterator(obj) {
      var okeys = obj ? Object.keys(obj) : [];
      var i = -1;
      var len = okeys.length;
      return function next() {
        var key = okeys[++i];
        if (key === "__proto__") {
          return next();
        }
        return i < len ? { value: obj[key], key } : null;
      };
    }
    function createIterator(coll) {
      if ((0, _isArrayLike2.default)(coll)) {
        return createArrayIterator(coll);
      }
      var iterator = (0, _getIterator2.default)(coll);
      return iterator ? createES2015Iterator(iterator) : createObjectIterator(coll);
    }
    module2.exports = exports2.default;
  }
});

// node_modules/async/internal/onlyOnce.js
var require_onlyOnce = __commonJS({
  "node_modules/async/internal/onlyOnce.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.default = onlyOnce;
    function onlyOnce(fn) {
      return function(...args) {
        if (fn === null) throw new Error("Callback was already called.");
        var callFn = fn;
        fn = null;
        callFn.apply(this, args);
      };
    }
    module2.exports = exports2.default;
  }
});

// node_modules/async/internal/breakLoop.js
var require_breakLoop = __commonJS({
  "node_modules/async/internal/breakLoop.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    var breakLoop = {};
    exports2.default = breakLoop;
    module2.exports = exports2.default;
  }
});

// node_modules/async/internal/asyncEachOfLimit.js
var require_asyncEachOfLimit = __commonJS({
  "node_modules/async/internal/asyncEachOfLimit.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.default = asyncEachOfLimit;
    var _breakLoop = require_breakLoop();
    var _breakLoop2 = _interopRequireDefault(_breakLoop);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function asyncEachOfLimit(generator, limit, iteratee, callback) {
      let done = false;
      let canceled = false;
      let awaiting = false;
      let running = 0;
      let idx = 0;
      function replenish() {
        if (running >= limit || awaiting || done) return;
        awaiting = true;
        generator.next().then(({ value, done: iterDone }) => {
          if (canceled || done) return;
          awaiting = false;
          if (iterDone) {
            done = true;
            if (running <= 0) {
              callback(null);
            }
            return;
          }
          running++;
          iteratee(value, idx, iterateeCallback);
          idx++;
          replenish();
        }).catch(handleError);
      }
      function iterateeCallback(err4, result) {
        running -= 1;
        if (canceled) return;
        if (err4) return handleError(err4);
        if (err4 === false) {
          done = true;
          canceled = true;
          return;
        }
        if (result === _breakLoop2.default || done && running <= 0) {
          done = true;
          return callback(null);
        }
        replenish();
      }
      function handleError(err4) {
        if (canceled) return;
        awaiting = false;
        done = true;
        callback(err4);
      }
      replenish();
    }
    module2.exports = exports2.default;
  }
});

// node_modules/async/internal/eachOfLimit.js
var require_eachOfLimit = __commonJS({
  "node_modules/async/internal/eachOfLimit.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    var _once = require_once();
    var _once2 = _interopRequireDefault(_once);
    var _iterator = require_iterator();
    var _iterator2 = _interopRequireDefault(_iterator);
    var _onlyOnce = require_onlyOnce();
    var _onlyOnce2 = _interopRequireDefault(_onlyOnce);
    var _wrapAsync = require_wrapAsync();
    var _asyncEachOfLimit = require_asyncEachOfLimit();
    var _asyncEachOfLimit2 = _interopRequireDefault(_asyncEachOfLimit);
    var _breakLoop = require_breakLoop();
    var _breakLoop2 = _interopRequireDefault(_breakLoop);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    exports2.default = (limit) => {
      return (obj, iteratee, callback) => {
        callback = (0, _once2.default)(callback);
        if (limit <= 0) {
          throw new RangeError("concurrency limit cannot be less than 1");
        }
        if (!obj) {
          return callback(null);
        }
        if ((0, _wrapAsync.isAsyncGenerator)(obj)) {
          return (0, _asyncEachOfLimit2.default)(obj, limit, iteratee, callback);
        }
        if ((0, _wrapAsync.isAsyncIterable)(obj)) {
          return (0, _asyncEachOfLimit2.default)(obj[Symbol.asyncIterator](), limit, iteratee, callback);
        }
        var nextElem = (0, _iterator2.default)(obj);
        var done = false;
        var canceled = false;
        var running = 0;
        var looping = false;
        function iterateeCallback(err4, value) {
          if (canceled) return;
          running -= 1;
          if (err4) {
            done = true;
            callback(err4);
          } else if (err4 === false) {
            done = true;
            canceled = true;
          } else if (value === _breakLoop2.default || done && running <= 0) {
            done = true;
            return callback(null);
          } else if (!looping) {
            replenish();
          }
        }
        function replenish() {
          looping = true;
          while (running < limit && !done) {
            var elem = nextElem();
            if (elem === null) {
              done = true;
              if (running <= 0) {
                callback(null);
              }
              return;
            }
            running += 1;
            iteratee(elem.value, elem.key, (0, _onlyOnce2.default)(iterateeCallback));
          }
          looping = false;
        }
        replenish();
      };
    };
    module2.exports = exports2.default;
  }
});

// node_modules/async/eachOfLimit.js
var require_eachOfLimit2 = __commonJS({
  "node_modules/async/eachOfLimit.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    var _eachOfLimit2 = require_eachOfLimit();
    var _eachOfLimit3 = _interopRequireDefault(_eachOfLimit2);
    var _wrapAsync = require_wrapAsync();
    var _wrapAsync2 = _interopRequireDefault(_wrapAsync);
    var _awaitify = require_awaitify();
    var _awaitify2 = _interopRequireDefault(_awaitify);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function eachOfLimit(coll, limit, iteratee, callback) {
      return (0, _eachOfLimit3.default)(limit)(coll, (0, _wrapAsync2.default)(iteratee), callback);
    }
    exports2.default = (0, _awaitify2.default)(eachOfLimit, 4);
    module2.exports = exports2.default;
  }
});

// node_modules/async/eachOfSeries.js
var require_eachOfSeries = __commonJS({
  "node_modules/async/eachOfSeries.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    var _eachOfLimit = require_eachOfLimit2();
    var _eachOfLimit2 = _interopRequireDefault(_eachOfLimit);
    var _awaitify = require_awaitify();
    var _awaitify2 = _interopRequireDefault(_awaitify);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function eachOfSeries(coll, iteratee, callback) {
      return (0, _eachOfLimit2.default)(coll, 1, iteratee, callback);
    }
    exports2.default = (0, _awaitify2.default)(eachOfSeries, 3);
    module2.exports = exports2.default;
  }
});

// node_modules/async/series.js
var require_series = __commonJS({
  "node_modules/async/series.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.default = series;
    var _parallel2 = require_parallel();
    var _parallel3 = _interopRequireDefault(_parallel2);
    var _eachOfSeries = require_eachOfSeries();
    var _eachOfSeries2 = _interopRequireDefault(_eachOfSeries);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function series(tasks, callback) {
      return (0, _parallel3.default)(_eachOfSeries2.default, tasks, callback);
    }
    module2.exports = exports2.default;
  }
});

// node_modules/readable-stream/lib/_stream_transform.js
var require_stream_transform = __commonJS({
  "node_modules/readable-stream/lib/_stream_transform.js"(exports2, module2) {
    "use strict";
    module2.exports = Transform2;
    var _require$codes = require_errors2().codes;
    var ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED;
    var ERR_MULTIPLE_CALLBACK = _require$codes.ERR_MULTIPLE_CALLBACK;
    var ERR_TRANSFORM_ALREADY_TRANSFORMING = _require$codes.ERR_TRANSFORM_ALREADY_TRANSFORMING;
    var ERR_TRANSFORM_WITH_LENGTH_0 = _require$codes.ERR_TRANSFORM_WITH_LENGTH_0;
    var Duplex = require_stream_duplex();
    require_inherits()(Transform2, Duplex);
    function afterTransform(er, data) {
      var ts = this._transformState;
      ts.transforming = false;
      var cb = ts.writecb;
      if (cb === null) {
        return this.emit("error", new ERR_MULTIPLE_CALLBACK());
      }
      ts.writechunk = null;
      ts.writecb = null;
      if (data != null)
        this.push(data);
      cb(er);
      var rs = this._readableState;
      rs.reading = false;
      if (rs.needReadable || rs.length < rs.highWaterMark) {
        this._read(rs.highWaterMark);
      }
    }
    function Transform2(options) {
      if (!(this instanceof Transform2)) return new Transform2(options);
      Duplex.call(this, options);
      this._transformState = {
        afterTransform: afterTransform.bind(this),
        needTransform: false,
        transforming: false,
        writecb: null,
        writechunk: null,
        writeencoding: null
      };
      this._readableState.needReadable = true;
      this._readableState.sync = false;
      if (options) {
        if (typeof options.transform === "function") this._transform = options.transform;
        if (typeof options.flush === "function") this._flush = options.flush;
      }
      this.on("prefinish", prefinish);
    }
    function prefinish() {
      var _this = this;
      if (typeof this._flush === "function" && !this._readableState.destroyed) {
        this._flush(function(er, data) {
          done(_this, er, data);
        });
      } else {
        done(this, null, null);
      }
    }
    Transform2.prototype.push = function(chunk, encoding) {
      this._transformState.needTransform = false;
      return Duplex.prototype.push.call(this, chunk, encoding);
    };
    Transform2.prototype._transform = function(chunk, encoding, cb) {
      cb(new ERR_METHOD_NOT_IMPLEMENTED("_transform()"));
    };
    Transform2.prototype._write = function(chunk, encoding, cb) {
      var ts = this._transformState;
      ts.writecb = cb;
      ts.writechunk = chunk;
      ts.writeencoding = encoding;
      if (!ts.transforming) {
        var rs = this._readableState;
        if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
      }
    };
    Transform2.prototype._read = function(n) {
      var ts = this._transformState;
      if (ts.writechunk !== null && !ts.transforming) {
        ts.transforming = true;
        this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
      } else {
        ts.needTransform = true;
      }
    };
    Transform2.prototype._destroy = function(err4, cb) {
      Duplex.prototype._destroy.call(this, err4, function(err22) {
        cb(err22);
      });
    };
    function done(stream, er, data) {
      if (er) return stream.emit("error", er);
      if (data != null)
        stream.push(data);
      if (stream._writableState.length) throw new ERR_TRANSFORM_WITH_LENGTH_0();
      if (stream._transformState.transforming) throw new ERR_TRANSFORM_ALREADY_TRANSFORMING();
      return stream.push(null);
    }
  }
});

// node_modules/readable-stream/lib/_stream_passthrough.js
var require_stream_passthrough = __commonJS({
  "node_modules/readable-stream/lib/_stream_passthrough.js"(exports2, module2) {
    "use strict";
    module2.exports = PassThrough;
    var Transform2 = require_stream_transform();
    require_inherits()(PassThrough, Transform2);
    function PassThrough(options) {
      if (!(this instanceof PassThrough)) return new PassThrough(options);
      Transform2.call(this, options);
    }
    PassThrough.prototype._transform = function(chunk, encoding, cb) {
      cb(null, chunk);
    };
  }
});

// node_modules/readable-stream/lib/internal/streams/pipeline.js
var require_pipeline = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/pipeline.js"(exports2, module2) {
    "use strict";
    var eos;
    function once(callback) {
      var called = false;
      return function() {
        if (called) return;
        called = true;
        callback.apply(void 0, arguments);
      };
    }
    var _require$codes = require_errors2().codes;
    var ERR_MISSING_ARGS = _require$codes.ERR_MISSING_ARGS;
    var ERR_STREAM_DESTROYED = _require$codes.ERR_STREAM_DESTROYED;
    function noop(err4) {
      if (err4) throw err4;
    }
    function isRequest(stream) {
      return stream.setHeader && typeof stream.abort === "function";
    }
    function destroyer(stream, reading, writing, callback) {
      callback = once(callback);
      var closed = false;
      stream.on("close", function() {
        closed = true;
      });
      if (eos === void 0) eos = require_end_of_stream();
      eos(stream, {
        readable: reading,
        writable: writing
      }, function(err4) {
        if (err4) return callback(err4);
        closed = true;
        callback();
      });
      var destroyed = false;
      return function(err4) {
        if (closed) return;
        if (destroyed) return;
        destroyed = true;
        if (isRequest(stream)) return stream.abort();
        if (typeof stream.destroy === "function") return stream.destroy();
        callback(err4 || new ERR_STREAM_DESTROYED("pipe"));
      };
    }
    function call(fn) {
      fn();
    }
    function pipe(from, to) {
      return from.pipe(to);
    }
    function popCallback(streams) {
      if (!streams.length) return noop;
      if (typeof streams[streams.length - 1] !== "function") return noop;
      return streams.pop();
    }
    function pipeline() {
      for (var _len = arguments.length, streams = new Array(_len), _key = 0; _key < _len; _key++) {
        streams[_key] = arguments[_key];
      }
      var callback = popCallback(streams);
      if (Array.isArray(streams[0])) streams = streams[0];
      if (streams.length < 2) {
        throw new ERR_MISSING_ARGS("streams");
      }
      var error;
      var destroys = streams.map(function(stream, i) {
        var reading = i < streams.length - 1;
        var writing = i > 0;
        return destroyer(stream, reading, writing, function(err4) {
          if (!error) error = err4;
          if (err4) destroys.forEach(call);
          if (reading) return;
          destroys.forEach(call);
          callback(error);
        });
      });
      return streams.reduce(pipe);
    }
    module2.exports = pipeline;
  }
});

// node_modules/readable-stream/readable.js
var require_readable = __commonJS({
  "node_modules/readable-stream/readable.js"(exports2, module2) {
    var Stream = require("stream");
    if (process.env.READABLE_STREAM === "disable" && Stream) {
      module2.exports = Stream.Readable;
      Object.assign(module2.exports, Stream);
      module2.exports.Stream = Stream;
    } else {
      exports2 = module2.exports = require_stream_readable();
      exports2.Stream = Stream || exports2;
      exports2.Readable = exports2;
      exports2.Writable = require_stream_writable();
      exports2.Duplex = require_stream_duplex();
      exports2.Transform = require_stream_transform();
      exports2.PassThrough = require_stream_passthrough();
      exports2.finished = require_end_of_stream();
      exports2.pipeline = require_pipeline();
    }
  }
});

// node_modules/@dabh/diagnostics/diagnostics.js
var require_diagnostics = __commonJS({
  "node_modules/@dabh/diagnostics/diagnostics.js"(exports2, module2) {
    var adapters = [];
    var modifiers = [];
    var logger = function devnull() {
    };
    function use(adapter) {
      if (~adapters.indexOf(adapter)) return false;
      adapters.push(adapter);
      return true;
    }
    function set(custom) {
      logger = custom;
    }
    function enabled(namespace) {
      var async = [];
      for (var i = 0; i < adapters.length; i++) {
        if (adapters[i].async) {
          async.push(adapters[i]);
          continue;
        }
        if (adapters[i](namespace)) return true;
      }
      if (!async.length) return false;
      return new Promise(function pinky(resolve) {
        Promise.all(
          async.map(function prebind(fn) {
            return fn(namespace);
          })
        ).then(function resolved(values) {
          resolve(values.some(Boolean));
        });
      });
    }
    function modify(fn) {
      if (~modifiers.indexOf(fn)) return false;
      modifiers.push(fn);
      return true;
    }
    function write() {
      logger.apply(logger, arguments);
    }
    function process2(message) {
      for (var i = 0; i < modifiers.length; i++) {
        message = modifiers[i].apply(modifiers[i], arguments);
      }
      return message;
    }
    function introduce(fn, options) {
      var has = Object.prototype.hasOwnProperty;
      for (var key in options) {
        if (has.call(options, key)) {
          fn[key] = options[key];
        }
      }
      return fn;
    }
    function nope(options) {
      options.enabled = false;
      options.modify = modify;
      options.set = set;
      options.use = use;
      return introduce(function diagnopes() {
        return false;
      }, options);
    }
    function yep(options) {
      function diagnostics() {
        var args = Array.prototype.slice.call(arguments, 0);
        write.call(write, options, process2(args, options));
        return true;
      }
      options.enabled = true;
      options.modify = modify;
      options.set = set;
      options.use = use;
      return introduce(diagnostics, options);
    }
    module2.exports = function create(diagnostics) {
      diagnostics.introduce = introduce;
      diagnostics.enabled = enabled;
      diagnostics.process = process2;
      diagnostics.modify = modify;
      diagnostics.write = write;
      diagnostics.nope = nope;
      diagnostics.yep = yep;
      diagnostics.set = set;
      diagnostics.use = use;
      return diagnostics;
    };
  }
});

// node_modules/@dabh/diagnostics/node/production.js
var require_production = __commonJS({
  "node_modules/@dabh/diagnostics/node/production.js"(exports2, module2) {
    var create = require_diagnostics();
    var diagnostics = create(function prod(namespace, options) {
      options = options || {};
      options.namespace = namespace;
      options.prod = true;
      options.dev = false;
      if (!(options.force || prod.force)) return prod.nope(options);
      return prod.yep(options);
    });
    module2.exports = diagnostics;
  }
});

// node_modules/@so-ric/colorspace/dist/index.cjs.js
var require_index_cjs = __commonJS({
  "node_modules/@so-ric/colorspace/dist/index.cjs.js"(exports2, module2) {
    "use strict";
    var cssKeywords = {
      aliceblue: [240, 248, 255],
      antiquewhite: [250, 235, 215],
      aqua: [0, 255, 255],
      aquamarine: [127, 255, 212],
      azure: [240, 255, 255],
      beige: [245, 245, 220],
      bisque: [255, 228, 196],
      black: [0, 0, 0],
      blanchedalmond: [255, 235, 205],
      blue: [0, 0, 255],
      blueviolet: [138, 43, 226],
      brown: [165, 42, 42],
      burlywood: [222, 184, 135],
      cadetblue: [95, 158, 160],
      chartreuse: [127, 255, 0],
      chocolate: [210, 105, 30],
      coral: [255, 127, 80],
      cornflowerblue: [100, 149, 237],
      cornsilk: [255, 248, 220],
      crimson: [220, 20, 60],
      cyan: [0, 255, 255],
      darkblue: [0, 0, 139],
      darkcyan: [0, 139, 139],
      darkgoldenrod: [184, 134, 11],
      darkgray: [169, 169, 169],
      darkgreen: [0, 100, 0],
      darkgrey: [169, 169, 169],
      darkkhaki: [189, 183, 107],
      darkmagenta: [139, 0, 139],
      darkolivegreen: [85, 107, 47],
      darkorange: [255, 140, 0],
      darkorchid: [153, 50, 204],
      darkred: [139, 0, 0],
      darksalmon: [233, 150, 122],
      darkseagreen: [143, 188, 143],
      darkslateblue: [72, 61, 139],
      darkslategray: [47, 79, 79],
      darkslategrey: [47, 79, 79],
      darkturquoise: [0, 206, 209],
      darkviolet: [148, 0, 211],
      deeppink: [255, 20, 147],
      deepskyblue: [0, 191, 255],
      dimgray: [105, 105, 105],
      dimgrey: [105, 105, 105],
      dodgerblue: [30, 144, 255],
      firebrick: [178, 34, 34],
      floralwhite: [255, 250, 240],
      forestgreen: [34, 139, 34],
      fuchsia: [255, 0, 255],
      gainsboro: [220, 220, 220],
      ghostwhite: [248, 248, 255],
      gold: [255, 215, 0],
      goldenrod: [218, 165, 32],
      gray: [128, 128, 128],
      green: [0, 128, 0],
      greenyellow: [173, 255, 47],
      grey: [128, 128, 128],
      honeydew: [240, 255, 240],
      hotpink: [255, 105, 180],
      indianred: [205, 92, 92],
      indigo: [75, 0, 130],
      ivory: [255, 255, 240],
      khaki: [240, 230, 140],
      lavender: [230, 230, 250],
      lavenderblush: [255, 240, 245],
      lawngreen: [124, 252, 0],
      lemonchiffon: [255, 250, 205],
      lightblue: [173, 216, 230],
      lightcoral: [240, 128, 128],
      lightcyan: [224, 255, 255],
      lightgoldenrodyellow: [250, 250, 210],
      lightgray: [211, 211, 211],
      lightgreen: [144, 238, 144],
      lightgrey: [211, 211, 211],
      lightpink: [255, 182, 193],
      lightsalmon: [255, 160, 122],
      lightseagreen: [32, 178, 170],
      lightskyblue: [135, 206, 250],
      lightslategray: [119, 136, 153],
      lightslategrey: [119, 136, 153],
      lightsteelblue: [176, 196, 222],
      lightyellow: [255, 255, 224],
      lime: [0, 255, 0],
      limegreen: [50, 205, 50],
      linen: [250, 240, 230],
      magenta: [255, 0, 255],
      maroon: [128, 0, 0],
      mediumaquamarine: [102, 205, 170],
      mediumblue: [0, 0, 205],
      mediumorchid: [186, 85, 211],
      mediumpurple: [147, 112, 219],
      mediumseagreen: [60, 179, 113],
      mediumslateblue: [123, 104, 238],
      mediumspringgreen: [0, 250, 154],
      mediumturquoise: [72, 209, 204],
      mediumvioletred: [199, 21, 133],
      midnightblue: [25, 25, 112],
      mintcream: [245, 255, 250],
      mistyrose: [255, 228, 225],
      moccasin: [255, 228, 181],
      navajowhite: [255, 222, 173],
      navy: [0, 0, 128],
      oldlace: [253, 245, 230],
      olive: [128, 128, 0],
      olivedrab: [107, 142, 35],
      orange: [255, 165, 0],
      orangered: [255, 69, 0],
      orchid: [218, 112, 214],
      palegoldenrod: [238, 232, 170],
      palegreen: [152, 251, 152],
      paleturquoise: [175, 238, 238],
      palevioletred: [219, 112, 147],
      papayawhip: [255, 239, 213],
      peachpuff: [255, 218, 185],
      peru: [205, 133, 63],
      pink: [255, 192, 203],
      plum: [221, 160, 221],
      powderblue: [176, 224, 230],
      purple: [128, 0, 128],
      rebeccapurple: [102, 51, 153],
      red: [255, 0, 0],
      rosybrown: [188, 143, 143],
      royalblue: [65, 105, 225],
      saddlebrown: [139, 69, 19],
      salmon: [250, 128, 114],
      sandybrown: [244, 164, 96],
      seagreen: [46, 139, 87],
      seashell: [255, 245, 238],
      sienna: [160, 82, 45],
      silver: [192, 192, 192],
      skyblue: [135, 206, 235],
      slateblue: [106, 90, 205],
      slategray: [112, 128, 144],
      slategrey: [112, 128, 144],
      snow: [255, 250, 250],
      springgreen: [0, 255, 127],
      steelblue: [70, 130, 180],
      tan: [210, 180, 140],
      teal: [0, 128, 128],
      thistle: [216, 191, 216],
      tomato: [255, 99, 71],
      turquoise: [64, 224, 208],
      violet: [238, 130, 238],
      wheat: [245, 222, 179],
      white: [255, 255, 255],
      whitesmoke: [245, 245, 245],
      yellow: [255, 255, 0],
      yellowgreen: [154, 205, 50]
    };
    var reverseNames = /* @__PURE__ */ Object.create(null);
    for (const name in cssKeywords) {
      if (Object.hasOwn(cssKeywords, name)) {
        reverseNames[cssKeywords[name]] = name;
      }
    }
    var cs = {
      to: {},
      get: {}
    };
    cs.get = function(string) {
      const prefix = string.slice(0, 3).toLowerCase();
      let value;
      let model;
      switch (prefix) {
        case "hsl": {
          value = cs.get.hsl(string);
          model = "hsl";
          break;
        }
        case "hwb": {
          value = cs.get.hwb(string);
          model = "hwb";
          break;
        }
        default: {
          value = cs.get.rgb(string);
          model = "rgb";
          break;
        }
      }
      if (!value) {
        return null;
      }
      return { model, value };
    };
    cs.get.rgb = function(string) {
      if (!string) {
        return null;
      }
      const abbr = /^#([a-f\d]{3,4})$/i;
      const hex2 = /^#([a-f\d]{6})([a-f\d]{2})?$/i;
      const rgba = /^rgba?\(\s*([+-]?\d+)(?=[\s,])\s*(?:,\s*)?([+-]?\d+)(?=[\s,])\s*(?:,\s*)?([+-]?\d+)\s*(?:[\s,|/]\s*([+-]?[\d.]+)(%?)\s*)?\)$/;
      const per = /^rgba?\(\s*([+-]?[\d.]+)%\s*,?\s*([+-]?[\d.]+)%\s*,?\s*([+-]?[\d.]+)%\s*(?:[\s,|/]\s*([+-]?[\d.]+)(%?)\s*)?\)$/;
      const keyword = /^(\w+)$/;
      let rgb = [0, 0, 0, 1];
      let match;
      let i;
      let hexAlpha;
      if (match = string.match(hex2)) {
        hexAlpha = match[2];
        match = match[1];
        for (i = 0; i < 3; i++) {
          const i2 = i * 2;
          rgb[i] = Number.parseInt(match.slice(i2, i2 + 2), 16);
        }
        if (hexAlpha) {
          rgb[3] = Number.parseInt(hexAlpha, 16) / 255;
        }
      } else if (match = string.match(abbr)) {
        match = match[1];
        hexAlpha = match[3];
        for (i = 0; i < 3; i++) {
          rgb[i] = Number.parseInt(match[i] + match[i], 16);
        }
        if (hexAlpha) {
          rgb[3] = Number.parseInt(hexAlpha + hexAlpha, 16) / 255;
        }
      } else if (match = string.match(rgba)) {
        for (i = 0; i < 3; i++) {
          rgb[i] = Number.parseInt(match[i + 1], 10);
        }
        if (match[4]) {
          rgb[3] = match[5] ? Number.parseFloat(match[4]) * 0.01 : Number.parseFloat(match[4]);
        }
      } else if (match = string.match(per)) {
        for (i = 0; i < 3; i++) {
          rgb[i] = Math.round(Number.parseFloat(match[i + 1]) * 2.55);
        }
        if (match[4]) {
          rgb[3] = match[5] ? Number.parseFloat(match[4]) * 0.01 : Number.parseFloat(match[4]);
        }
      } else if (match = string.match(keyword)) {
        if (match[1] === "transparent") {
          return [0, 0, 0, 0];
        }
        if (!Object.hasOwn(cssKeywords, match[1])) {
          return null;
        }
        rgb = cssKeywords[match[1]];
        rgb[3] = 1;
        return rgb;
      } else {
        return null;
      }
      for (i = 0; i < 3; i++) {
        rgb[i] = clamp(rgb[i], 0, 255);
      }
      rgb[3] = clamp(rgb[3], 0, 1);
      return rgb;
    };
    cs.get.hsl = function(string) {
      if (!string) {
        return null;
      }
      const hsl = /^hsla?\(\s*([+-]?(?:\d{0,3}\.)?\d+)(?:deg)?\s*,?\s*([+-]?[\d.]+)%\s*,?\s*([+-]?[\d.]+)%\s*(?:[,|/]\s*([+-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d*)?(?:[eE][+-]?\d+)?)\s*)?\)$/;
      const match = string.match(hsl);
      if (match) {
        const alpha = Number.parseFloat(match[4]);
        const h = (Number.parseFloat(match[1]) % 360 + 360) % 360;
        const s = clamp(Number.parseFloat(match[2]), 0, 100);
        const l = clamp(Number.parseFloat(match[3]), 0, 100);
        const a = clamp(Number.isNaN(alpha) ? 1 : alpha, 0, 1);
        return [h, s, l, a];
      }
      return null;
    };
    cs.get.hwb = function(string) {
      if (!string) {
        return null;
      }
      const hwb = /^hwb\(\s*([+-]?\d{0,3}(?:\.\d+)?)(?:deg)?\s*[\s,]\s*([+-]?[\d.]+)%\s*[\s,]\s*([+-]?[\d.]+)%\s*(?:[\s,]\s*([+-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d*)?(?:[eE][+-]?\d+)?)\s*)?\)$/;
      const match = string.match(hwb);
      if (match) {
        const alpha = Number.parseFloat(match[4]);
        const h = (Number.parseFloat(match[1]) % 360 + 360) % 360;
        const w = clamp(Number.parseFloat(match[2]), 0, 100);
        const b = clamp(Number.parseFloat(match[3]), 0, 100);
        const a = clamp(Number.isNaN(alpha) ? 1 : alpha, 0, 1);
        return [h, w, b, a];
      }
      return null;
    };
    cs.to.hex = function(...rgba) {
      return "#" + hexDouble(rgba[0]) + hexDouble(rgba[1]) + hexDouble(rgba[2]) + (rgba[3] < 1 ? hexDouble(Math.round(rgba[3] * 255)) : "");
    };
    cs.to.rgb = function(...rgba) {
      return rgba.length < 4 || rgba[3] === 1 ? "rgb(" + Math.round(rgba[0]) + ", " + Math.round(rgba[1]) + ", " + Math.round(rgba[2]) + ")" : "rgba(" + Math.round(rgba[0]) + ", " + Math.round(rgba[1]) + ", " + Math.round(rgba[2]) + ", " + rgba[3] + ")";
    };
    cs.to.rgb.percent = function(...rgba) {
      const r = Math.round(rgba[0] / 255 * 100);
      const g = Math.round(rgba[1] / 255 * 100);
      const b = Math.round(rgba[2] / 255 * 100);
      return rgba.length < 4 || rgba[3] === 1 ? "rgb(" + r + "%, " + g + "%, " + b + "%)" : "rgba(" + r + "%, " + g + "%, " + b + "%, " + rgba[3] + ")";
    };
    cs.to.hsl = function(...hsla) {
      return hsla.length < 4 || hsla[3] === 1 ? "hsl(" + hsla[0] + ", " + hsla[1] + "%, " + hsla[2] + "%)" : "hsla(" + hsla[0] + ", " + hsla[1] + "%, " + hsla[2] + "%, " + hsla[3] + ")";
    };
    cs.to.hwb = function(...hwba) {
      let a = "";
      if (hwba.length >= 4 && hwba[3] !== 1) {
        a = ", " + hwba[3];
      }
      return "hwb(" + hwba[0] + ", " + hwba[1] + "%, " + hwba[2] + "%" + a + ")";
    };
    cs.to.keyword = function(...rgb) {
      return reverseNames[rgb.slice(0, 3)];
    };
    function clamp(number_, min, max) {
      return Math.min(Math.max(min, number_), max);
    }
    function hexDouble(number_) {
      const string_ = Math.round(number_).toString(16).toUpperCase();
      return string_.length < 2 ? "0" + string_ : string_;
    }
    var reverseKeywords = {};
    for (const key of Object.keys(cssKeywords)) {
      reverseKeywords[cssKeywords[key]] = key;
    }
    var convert$1 = {
      rgb: { channels: 3, labels: "rgb" },
      hsl: { channels: 3, labels: "hsl" },
      hsv: { channels: 3, labels: "hsv" },
      hwb: { channels: 3, labels: "hwb" },
      cmyk: { channels: 4, labels: "cmyk" },
      xyz: { channels: 3, labels: "xyz" },
      lab: { channels: 3, labels: "lab" },
      oklab: { channels: 3, labels: ["okl", "oka", "okb"] },
      lch: { channels: 3, labels: "lch" },
      oklch: { channels: 3, labels: ["okl", "okc", "okh"] },
      hex: { channels: 1, labels: ["hex"] },
      keyword: { channels: 1, labels: ["keyword"] },
      ansi16: { channels: 1, labels: ["ansi16"] },
      ansi256: { channels: 1, labels: ["ansi256"] },
      hcg: { channels: 3, labels: ["h", "c", "g"] },
      apple: { channels: 3, labels: ["r16", "g16", "b16"] },
      gray: { channels: 1, labels: ["gray"] }
    };
    var LAB_FT = (6 / 29) ** 3;
    function srgbNonlinearTransform(c) {
      const cc = c > 31308e-7 ? 1.055 * c ** (1 / 2.4) - 0.055 : c * 12.92;
      return Math.min(Math.max(0, cc), 1);
    }
    function srgbNonlinearTransformInv(c) {
      return c > 0.04045 ? ((c + 0.055) / 1.055) ** 2.4 : c / 12.92;
    }
    for (const model of Object.keys(convert$1)) {
      if (!("channels" in convert$1[model])) {
        throw new Error("missing channels property: " + model);
      }
      if (!("labels" in convert$1[model])) {
        throw new Error("missing channel labels property: " + model);
      }
      if (convert$1[model].labels.length !== convert$1[model].channels) {
        throw new Error("channel and label counts mismatch: " + model);
      }
      const { channels, labels } = convert$1[model];
      delete convert$1[model].channels;
      delete convert$1[model].labels;
      Object.defineProperty(convert$1[model], "channels", { value: channels });
      Object.defineProperty(convert$1[model], "labels", { value: labels });
    }
    convert$1.rgb.hsl = function(rgb) {
      const r = rgb[0] / 255;
      const g = rgb[1] / 255;
      const b = rgb[2] / 255;
      const min = Math.min(r, g, b);
      const max = Math.max(r, g, b);
      const delta = max - min;
      let h;
      let s;
      switch (max) {
        case min: {
          h = 0;
          break;
        }
        case r: {
          h = (g - b) / delta;
          break;
        }
        case g: {
          h = 2 + (b - r) / delta;
          break;
        }
        case b: {
          h = 4 + (r - g) / delta;
          break;
        }
      }
      h = Math.min(h * 60, 360);
      if (h < 0) {
        h += 360;
      }
      const l = (min + max) / 2;
      if (max === min) {
        s = 0;
      } else if (l <= 0.5) {
        s = delta / (max + min);
      } else {
        s = delta / (2 - max - min);
      }
      return [h, s * 100, l * 100];
    };
    convert$1.rgb.hsv = function(rgb) {
      let rdif;
      let gdif;
      let bdif;
      let h;
      let s;
      const r = rgb[0] / 255;
      const g = rgb[1] / 255;
      const b = rgb[2] / 255;
      const v = Math.max(r, g, b);
      const diff = v - Math.min(r, g, b);
      const diffc = function(c) {
        return (v - c) / 6 / diff + 1 / 2;
      };
      if (diff === 0) {
        h = 0;
        s = 0;
      } else {
        s = diff / v;
        rdif = diffc(r);
        gdif = diffc(g);
        bdif = diffc(b);
        switch (v) {
          case r: {
            h = bdif - gdif;
            break;
          }
          case g: {
            h = 1 / 3 + rdif - bdif;
            break;
          }
          case b: {
            h = 2 / 3 + gdif - rdif;
            break;
          }
        }
        if (h < 0) {
          h += 1;
        } else if (h > 1) {
          h -= 1;
        }
      }
      return [
        h * 360,
        s * 100,
        v * 100
      ];
    };
    convert$1.rgb.hwb = function(rgb) {
      const r = rgb[0];
      const g = rgb[1];
      let b = rgb[2];
      const h = convert$1.rgb.hsl(rgb)[0];
      const w = 1 / 255 * Math.min(r, Math.min(g, b));
      b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));
      return [h, w * 100, b * 100];
    };
    convert$1.rgb.oklab = function(rgb) {
      const r = srgbNonlinearTransformInv(rgb[0] / 255);
      const g = srgbNonlinearTransformInv(rgb[1] / 255);
      const b = srgbNonlinearTransformInv(rgb[2] / 255);
      const lp = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
      const mp = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
      const sp = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
      const l = 0.2104542553 * lp + 0.793617785 * mp - 0.0040720468 * sp;
      const aa = 1.9779984951 * lp - 2.428592205 * mp + 0.4505937099 * sp;
      const bb = 0.0259040371 * lp + 0.7827717662 * mp - 0.808675766 * sp;
      return [l * 100, aa * 100, bb * 100];
    };
    convert$1.rgb.cmyk = function(rgb) {
      const r = rgb[0] / 255;
      const g = rgb[1] / 255;
      const b = rgb[2] / 255;
      const k = Math.min(1 - r, 1 - g, 1 - b);
      const c = (1 - r - k) / (1 - k) || 0;
      const m = (1 - g - k) / (1 - k) || 0;
      const y = (1 - b - k) / (1 - k) || 0;
      return [c * 100, m * 100, y * 100, k * 100];
    };
    function comparativeDistance(x, y) {
      return (x[0] - y[0]) ** 2 + (x[1] - y[1]) ** 2 + (x[2] - y[2]) ** 2;
    }
    convert$1.rgb.keyword = function(rgb) {
      const reversed = reverseKeywords[rgb];
      if (reversed) {
        return reversed;
      }
      let currentClosestDistance = Number.POSITIVE_INFINITY;
      let currentClosestKeyword;
      for (const keyword of Object.keys(cssKeywords)) {
        const value = cssKeywords[keyword];
        const distance = comparativeDistance(rgb, value);
        if (distance < currentClosestDistance) {
          currentClosestDistance = distance;
          currentClosestKeyword = keyword;
        }
      }
      return currentClosestKeyword;
    };
    convert$1.keyword.rgb = function(keyword) {
      return cssKeywords[keyword];
    };
    convert$1.rgb.xyz = function(rgb) {
      const r = srgbNonlinearTransformInv(rgb[0] / 255);
      const g = srgbNonlinearTransformInv(rgb[1] / 255);
      const b = srgbNonlinearTransformInv(rgb[2] / 255);
      const x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
      const y = r * 0.2126729 + g * 0.7151522 + b * 0.072175;
      const z = r * 0.0193339 + g * 0.119192 + b * 0.9503041;
      return [x * 100, y * 100, z * 100];
    };
    convert$1.rgb.lab = function(rgb) {
      const xyz = convert$1.rgb.xyz(rgb);
      let x = xyz[0];
      let y = xyz[1];
      let z = xyz[2];
      x /= 95.047;
      y /= 100;
      z /= 108.883;
      x = x > LAB_FT ? x ** (1 / 3) : 7.787 * x + 16 / 116;
      y = y > LAB_FT ? y ** (1 / 3) : 7.787 * y + 16 / 116;
      z = z > LAB_FT ? z ** (1 / 3) : 7.787 * z + 16 / 116;
      const l = 116 * y - 16;
      const a = 500 * (x - y);
      const b = 200 * (y - z);
      return [l, a, b];
    };
    convert$1.hsl.rgb = function(hsl) {
      const h = hsl[0] / 360;
      const s = hsl[1] / 100;
      const l = hsl[2] / 100;
      let t3;
      let value;
      if (s === 0) {
        value = l * 255;
        return [value, value, value];
      }
      const t2 = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const t1 = 2 * l - t2;
      const rgb = [0, 0, 0];
      for (let i = 0; i < 3; i++) {
        t3 = h + 1 / 3 * -(i - 1);
        if (t3 < 0) {
          t3++;
        }
        if (t3 > 1) {
          t3--;
        }
        if (6 * t3 < 1) {
          value = t1 + (t2 - t1) * 6 * t3;
        } else if (2 * t3 < 1) {
          value = t2;
        } else if (3 * t3 < 2) {
          value = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
        } else {
          value = t1;
        }
        rgb[i] = value * 255;
      }
      return rgb;
    };
    convert$1.hsl.hsv = function(hsl) {
      const h = hsl[0];
      let s = hsl[1] / 100;
      let l = hsl[2] / 100;
      let smin = s;
      const lmin = Math.max(l, 0.01);
      l *= 2;
      s *= l <= 1 ? l : 2 - l;
      smin *= lmin <= 1 ? lmin : 2 - lmin;
      const v = (l + s) / 2;
      const sv = l === 0 ? 2 * smin / (lmin + smin) : 2 * s / (l + s);
      return [h, sv * 100, v * 100];
    };
    convert$1.hsv.rgb = function(hsv) {
      const h = hsv[0] / 60;
      const s = hsv[1] / 100;
      let v = hsv[2] / 100;
      const hi = Math.floor(h) % 6;
      const f = h - Math.floor(h);
      const p = 255 * v * (1 - s);
      const q = 255 * v * (1 - s * f);
      const t = 255 * v * (1 - s * (1 - f));
      v *= 255;
      switch (hi) {
        case 0: {
          return [v, t, p];
        }
        case 1: {
          return [q, v, p];
        }
        case 2: {
          return [p, v, t];
        }
        case 3: {
          return [p, q, v];
        }
        case 4: {
          return [t, p, v];
        }
        case 5: {
          return [v, p, q];
        }
      }
    };
    convert$1.hsv.hsl = function(hsv) {
      const h = hsv[0];
      const s = hsv[1] / 100;
      const v = hsv[2] / 100;
      const vmin = Math.max(v, 0.01);
      let sl;
      let l;
      l = (2 - s) * v;
      const lmin = (2 - s) * vmin;
      sl = s * vmin;
      sl /= lmin <= 1 ? lmin : 2 - lmin;
      sl = sl || 0;
      l /= 2;
      return [h, sl * 100, l * 100];
    };
    convert$1.hwb.rgb = function(hwb) {
      const h = hwb[0] / 360;
      let wh = hwb[1] / 100;
      let bl = hwb[2] / 100;
      const ratio = wh + bl;
      let f;
      if (ratio > 1) {
        wh /= ratio;
        bl /= ratio;
      }
      const i = Math.floor(6 * h);
      const v = 1 - bl;
      f = 6 * h - i;
      if ((i & 1) !== 0) {
        f = 1 - f;
      }
      const n = wh + f * (v - wh);
      let r;
      let g;
      let b;
      switch (i) {
        default:
        case 6:
        case 0: {
          r = v;
          g = n;
          b = wh;
          break;
        }
        case 1: {
          r = n;
          g = v;
          b = wh;
          break;
        }
        case 2: {
          r = wh;
          g = v;
          b = n;
          break;
        }
        case 3: {
          r = wh;
          g = n;
          b = v;
          break;
        }
        case 4: {
          r = n;
          g = wh;
          b = v;
          break;
        }
        case 5: {
          r = v;
          g = wh;
          b = n;
          break;
        }
      }
      return [r * 255, g * 255, b * 255];
    };
    convert$1.cmyk.rgb = function(cmyk) {
      const c = cmyk[0] / 100;
      const m = cmyk[1] / 100;
      const y = cmyk[2] / 100;
      const k = cmyk[3] / 100;
      const r = 1 - Math.min(1, c * (1 - k) + k);
      const g = 1 - Math.min(1, m * (1 - k) + k);
      const b = 1 - Math.min(1, y * (1 - k) + k);
      return [r * 255, g * 255, b * 255];
    };
    convert$1.xyz.rgb = function(xyz) {
      const x = xyz[0] / 100;
      const y = xyz[1] / 100;
      const z = xyz[2] / 100;
      let r;
      let g;
      let b;
      r = x * 3.2404542 + y * -1.5371385 + z * -0.4985314;
      g = x * -0.969266 + y * 1.8760108 + z * 0.041556;
      b = x * 0.0556434 + y * -0.2040259 + z * 1.0572252;
      r = srgbNonlinearTransform(r);
      g = srgbNonlinearTransform(g);
      b = srgbNonlinearTransform(b);
      return [r * 255, g * 255, b * 255];
    };
    convert$1.xyz.lab = function(xyz) {
      let x = xyz[0];
      let y = xyz[1];
      let z = xyz[2];
      x /= 95.047;
      y /= 100;
      z /= 108.883;
      x = x > LAB_FT ? x ** (1 / 3) : 7.787 * x + 16 / 116;
      y = y > LAB_FT ? y ** (1 / 3) : 7.787 * y + 16 / 116;
      z = z > LAB_FT ? z ** (1 / 3) : 7.787 * z + 16 / 116;
      const l = 116 * y - 16;
      const a = 500 * (x - y);
      const b = 200 * (y - z);
      return [l, a, b];
    };
    convert$1.xyz.oklab = function(xyz) {
      const x = xyz[0] / 100;
      const y = xyz[1] / 100;
      const z = xyz[2] / 100;
      const lp = Math.cbrt(0.8189330101 * x + 0.3618667424 * y - 0.1288597137 * z);
      const mp = Math.cbrt(0.0329845436 * x + 0.9293118715 * y + 0.0361456387 * z);
      const sp = Math.cbrt(0.0482003018 * x + 0.2643662691 * y + 0.633851707 * z);
      const l = 0.2104542553 * lp + 0.793617785 * mp - 0.0040720468 * sp;
      const a = 1.9779984951 * lp - 2.428592205 * mp + 0.4505937099 * sp;
      const b = 0.0259040371 * lp + 0.7827717662 * mp - 0.808675766 * sp;
      return [l * 100, a * 100, b * 100];
    };
    convert$1.oklab.oklch = function(oklab) {
      return convert$1.lab.lch(oklab);
    };
    convert$1.oklab.xyz = function(oklab) {
      const ll = oklab[0] / 100;
      const a = oklab[1] / 100;
      const b = oklab[2] / 100;
      const l = (0.999999998 * ll + 0.396337792 * a + 0.215803758 * b) ** 3;
      const m = (1.000000008 * ll - 0.105561342 * a - 0.063854175 * b) ** 3;
      const s = (1.000000055 * ll - 0.089484182 * a - 1.291485538 * b) ** 3;
      const x = 1.227013851 * l - 0.55779998 * m + 0.281256149 * s;
      const y = -0.040580178 * l + 1.11225687 * m - 0.071676679 * s;
      const z = -0.076381285 * l - 0.421481978 * m + 1.58616322 * s;
      return [x * 100, y * 100, z * 100];
    };
    convert$1.oklab.rgb = function(oklab) {
      const ll = oklab[0] / 100;
      const aa = oklab[1] / 100;
      const bb = oklab[2] / 100;
      const l = (ll + 0.3963377774 * aa + 0.2158037573 * bb) ** 3;
      const m = (ll - 0.1055613458 * aa - 0.0638541728 * bb) ** 3;
      const s = (ll - 0.0894841775 * aa - 1.291485548 * bb) ** 3;
      const r = srgbNonlinearTransform(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s);
      const g = srgbNonlinearTransform(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s);
      const b = srgbNonlinearTransform(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s);
      return [r * 255, g * 255, b * 255];
    };
    convert$1.oklch.oklab = function(oklch) {
      return convert$1.lch.lab(oklch);
    };
    convert$1.lab.xyz = function(lab) {
      const l = lab[0];
      const a = lab[1];
      const b = lab[2];
      let x;
      let y;
      let z;
      y = (l + 16) / 116;
      x = a / 500 + y;
      z = y - b / 200;
      const y2 = y ** 3;
      const x2 = x ** 3;
      const z2 = z ** 3;
      y = y2 > LAB_FT ? y2 : (y - 16 / 116) / 7.787;
      x = x2 > LAB_FT ? x2 : (x - 16 / 116) / 7.787;
      z = z2 > LAB_FT ? z2 : (z - 16 / 116) / 7.787;
      x *= 95.047;
      y *= 100;
      z *= 108.883;
      return [x, y, z];
    };
    convert$1.lab.lch = function(lab) {
      const l = lab[0];
      const a = lab[1];
      const b = lab[2];
      let h;
      const hr = Math.atan2(b, a);
      h = hr * 360 / 2 / Math.PI;
      if (h < 0) {
        h += 360;
      }
      const c = Math.sqrt(a * a + b * b);
      return [l, c, h];
    };
    convert$1.lch.lab = function(lch) {
      const l = lch[0];
      const c = lch[1];
      const h = lch[2];
      const hr = h / 360 * 2 * Math.PI;
      const a = c * Math.cos(hr);
      const b = c * Math.sin(hr);
      return [l, a, b];
    };
    convert$1.rgb.ansi16 = function(args, saturation = null) {
      const [r, g, b] = args;
      let value = saturation === null ? convert$1.rgb.hsv(args)[2] : saturation;
      value = Math.round(value / 50);
      if (value === 0) {
        return 30;
      }
      let ansi = 30 + (Math.round(b / 255) << 2 | Math.round(g / 255) << 1 | Math.round(r / 255));
      if (value === 2) {
        ansi += 60;
      }
      return ansi;
    };
    convert$1.hsv.ansi16 = function(args) {
      return convert$1.rgb.ansi16(convert$1.hsv.rgb(args), args[2]);
    };
    convert$1.rgb.ansi256 = function(args) {
      const r = args[0];
      const g = args[1];
      const b = args[2];
      if (r >> 4 === g >> 4 && g >> 4 === b >> 4) {
        if (r < 8) {
          return 16;
        }
        if (r > 248) {
          return 231;
        }
        return Math.round((r - 8) / 247 * 24) + 232;
      }
      const ansi = 16 + 36 * Math.round(r / 255 * 5) + 6 * Math.round(g / 255 * 5) + Math.round(b / 255 * 5);
      return ansi;
    };
    convert$1.ansi16.rgb = function(args) {
      args = args[0];
      let color = args % 10;
      if (color === 0 || color === 7) {
        if (args > 50) {
          color += 3.5;
        }
        color = color / 10.5 * 255;
        return [color, color, color];
      }
      const mult = (Math.trunc(args > 50) + 1) * 0.5;
      const r = (color & 1) * mult * 255;
      const g = (color >> 1 & 1) * mult * 255;
      const b = (color >> 2 & 1) * mult * 255;
      return [r, g, b];
    };
    convert$1.ansi256.rgb = function(args) {
      args = args[0];
      if (args >= 232) {
        const c = (args - 232) * 10 + 8;
        return [c, c, c];
      }
      args -= 16;
      let rem;
      const r = Math.floor(args / 36) / 5 * 255;
      const g = Math.floor((rem = args % 36) / 6) / 5 * 255;
      const b = rem % 6 / 5 * 255;
      return [r, g, b];
    };
    convert$1.rgb.hex = function(args) {
      const integer = ((Math.round(args[0]) & 255) << 16) + ((Math.round(args[1]) & 255) << 8) + (Math.round(args[2]) & 255);
      const string = integer.toString(16).toUpperCase();
      return "000000".slice(string.length) + string;
    };
    convert$1.hex.rgb = function(args) {
      const match = args.toString(16).match(/[a-f\d]{6}|[a-f\d]{3}/i);
      if (!match) {
        return [0, 0, 0];
      }
      let colorString = match[0];
      if (match[0].length === 3) {
        colorString = [...colorString].map((char) => char + char).join("");
      }
      const integer = Number.parseInt(colorString, 16);
      const r = integer >> 16 & 255;
      const g = integer >> 8 & 255;
      const b = integer & 255;
      return [r, g, b];
    };
    convert$1.rgb.hcg = function(rgb) {
      const r = rgb[0] / 255;
      const g = rgb[1] / 255;
      const b = rgb[2] / 255;
      const max = Math.max(Math.max(r, g), b);
      const min = Math.min(Math.min(r, g), b);
      const chroma = max - min;
      let hue;
      const grayscale = chroma < 1 ? min / (1 - chroma) : 0;
      if (chroma <= 0) {
        hue = 0;
      } else if (max === r) {
        hue = (g - b) / chroma % 6;
      } else if (max === g) {
        hue = 2 + (b - r) / chroma;
      } else {
        hue = 4 + (r - g) / chroma;
      }
      hue /= 6;
      hue %= 1;
      return [hue * 360, chroma * 100, grayscale * 100];
    };
    convert$1.hsl.hcg = function(hsl) {
      const s = hsl[1] / 100;
      const l = hsl[2] / 100;
      const c = l < 0.5 ? 2 * s * l : 2 * s * (1 - l);
      let f = 0;
      if (c < 1) {
        f = (l - 0.5 * c) / (1 - c);
      }
      return [hsl[0], c * 100, f * 100];
    };
    convert$1.hsv.hcg = function(hsv) {
      const s = hsv[1] / 100;
      const v = hsv[2] / 100;
      const c = s * v;
      let f = 0;
      if (c < 1) {
        f = (v - c) / (1 - c);
      }
      return [hsv[0], c * 100, f * 100];
    };
    convert$1.hcg.rgb = function(hcg) {
      const h = hcg[0] / 360;
      const c = hcg[1] / 100;
      const g = hcg[2] / 100;
      if (c === 0) {
        return [g * 255, g * 255, g * 255];
      }
      const pure = [0, 0, 0];
      const hi = h % 1 * 6;
      const v = hi % 1;
      const w = 1 - v;
      let mg = 0;
      switch (Math.floor(hi)) {
        case 0: {
          pure[0] = 1;
          pure[1] = v;
          pure[2] = 0;
          break;
        }
        case 1: {
          pure[0] = w;
          pure[1] = 1;
          pure[2] = 0;
          break;
        }
        case 2: {
          pure[0] = 0;
          pure[1] = 1;
          pure[2] = v;
          break;
        }
        case 3: {
          pure[0] = 0;
          pure[1] = w;
          pure[2] = 1;
          break;
        }
        case 4: {
          pure[0] = v;
          pure[1] = 0;
          pure[2] = 1;
          break;
        }
        default: {
          pure[0] = 1;
          pure[1] = 0;
          pure[2] = w;
        }
      }
      mg = (1 - c) * g;
      return [
        (c * pure[0] + mg) * 255,
        (c * pure[1] + mg) * 255,
        (c * pure[2] + mg) * 255
      ];
    };
    convert$1.hcg.hsv = function(hcg) {
      const c = hcg[1] / 100;
      const g = hcg[2] / 100;
      const v = c + g * (1 - c);
      let f = 0;
      if (v > 0) {
        f = c / v;
      }
      return [hcg[0], f * 100, v * 100];
    };
    convert$1.hcg.hsl = function(hcg) {
      const c = hcg[1] / 100;
      const g = hcg[2] / 100;
      const l = g * (1 - c) + 0.5 * c;
      let s = 0;
      if (l > 0 && l < 0.5) {
        s = c / (2 * l);
      } else if (l >= 0.5 && l < 1) {
        s = c / (2 * (1 - l));
      }
      return [hcg[0], s * 100, l * 100];
    };
    convert$1.hcg.hwb = function(hcg) {
      const c = hcg[1] / 100;
      const g = hcg[2] / 100;
      const v = c + g * (1 - c);
      return [hcg[0], (v - c) * 100, (1 - v) * 100];
    };
    convert$1.hwb.hcg = function(hwb) {
      const w = hwb[1] / 100;
      const b = hwb[2] / 100;
      const v = 1 - b;
      const c = v - w;
      let g = 0;
      if (c < 1) {
        g = (v - c) / (1 - c);
      }
      return [hwb[0], c * 100, g * 100];
    };
    convert$1.apple.rgb = function(apple) {
      return [apple[0] / 65535 * 255, apple[1] / 65535 * 255, apple[2] / 65535 * 255];
    };
    convert$1.rgb.apple = function(rgb) {
      return [rgb[0] / 255 * 65535, rgb[1] / 255 * 65535, rgb[2] / 255 * 65535];
    };
    convert$1.gray.rgb = function(args) {
      return [args[0] / 100 * 255, args[0] / 100 * 255, args[0] / 100 * 255];
    };
    convert$1.gray.hsl = function(args) {
      return [0, 0, args[0]];
    };
    convert$1.gray.hsv = convert$1.gray.hsl;
    convert$1.gray.hwb = function(gray) {
      return [0, 100, gray[0]];
    };
    convert$1.gray.cmyk = function(gray) {
      return [0, 0, 0, gray[0]];
    };
    convert$1.gray.lab = function(gray) {
      return [gray[0], 0, 0];
    };
    convert$1.gray.hex = function(gray) {
      const value = Math.round(gray[0] / 100 * 255) & 255;
      const integer = (value << 16) + (value << 8) + value;
      const string = integer.toString(16).toUpperCase();
      return "000000".slice(string.length) + string;
    };
    convert$1.rgb.gray = function(rgb) {
      const value = (rgb[0] + rgb[1] + rgb[2]) / 3;
      return [value / 255 * 100];
    };
    function buildGraph() {
      const graph = {};
      const models2 = Object.keys(convert$1);
      for (let { length } = models2, i = 0; i < length; i++) {
        graph[models2[i]] = {
          // http://jsperf.com/1-vs-infinity
          // micro-opt, but this is simple.
          distance: -1,
          parent: null
        };
      }
      return graph;
    }
    function deriveBFS(fromModel) {
      const graph = buildGraph();
      const queue = [fromModel];
      graph[fromModel].distance = 0;
      while (queue.length > 0) {
        const current = queue.pop();
        const adjacents = Object.keys(convert$1[current]);
        for (let { length } = adjacents, i = 0; i < length; i++) {
          const adjacent = adjacents[i];
          const node = graph[adjacent];
          if (node.distance === -1) {
            node.distance = graph[current].distance + 1;
            node.parent = current;
            queue.unshift(adjacent);
          }
        }
      }
      return graph;
    }
    function link(from, to) {
      return function(args) {
        return to(from(args));
      };
    }
    function wrapConversion(toModel, graph) {
      const path3 = [graph[toModel].parent, toModel];
      let fn = convert$1[graph[toModel].parent][toModel];
      let cur = graph[toModel].parent;
      while (graph[cur].parent) {
        path3.unshift(graph[cur].parent);
        fn = link(convert$1[graph[cur].parent][cur], fn);
        cur = graph[cur].parent;
      }
      fn.conversion = path3;
      return fn;
    }
    function route(fromModel) {
      const graph = deriveBFS(fromModel);
      const conversion = {};
      const models2 = Object.keys(graph);
      for (let { length } = models2, i = 0; i < length; i++) {
        const toModel = models2[i];
        const node = graph[toModel];
        if (node.parent === null) {
          continue;
        }
        conversion[toModel] = wrapConversion(toModel, graph);
      }
      return conversion;
    }
    var convert = {};
    var models = Object.keys(convert$1);
    function wrapRaw(fn) {
      const wrappedFn = function(...args) {
        const arg0 = args[0];
        if (arg0 === void 0 || arg0 === null) {
          return arg0;
        }
        if (arg0.length > 1) {
          args = arg0;
        }
        return fn(args);
      };
      if ("conversion" in fn) {
        wrappedFn.conversion = fn.conversion;
      }
      return wrappedFn;
    }
    function wrapRounded(fn) {
      const wrappedFn = function(...args) {
        const arg0 = args[0];
        if (arg0 === void 0 || arg0 === null) {
          return arg0;
        }
        if (arg0.length > 1) {
          args = arg0;
        }
        const result = fn(args);
        if (typeof result === "object") {
          for (let { length } = result, i = 0; i < length; i++) {
            result[i] = Math.round(result[i]);
          }
        }
        return result;
      };
      if ("conversion" in fn) {
        wrappedFn.conversion = fn.conversion;
      }
      return wrappedFn;
    }
    for (const fromModel of models) {
      convert[fromModel] = {};
      Object.defineProperty(convert[fromModel], "channels", { value: convert$1[fromModel].channels });
      Object.defineProperty(convert[fromModel], "labels", { value: convert$1[fromModel].labels });
      const routes = route(fromModel);
      const routeModels = Object.keys(routes);
      for (const toModel of routeModels) {
        const fn = routes[toModel];
        convert[fromModel][toModel] = wrapRounded(fn);
        convert[fromModel][toModel].raw = wrapRaw(fn);
      }
    }
    var skippedModels = [
      // To be honest, I don't really feel like keyword belongs in color convert, but eh.
      "keyword",
      // Gray conflicts with some method names, and has its own method defined.
      "gray",
      // Shouldn't really be in color-convert either...
      "hex"
    ];
    var hashedModelKeys = {};
    for (const model of Object.keys(convert)) {
      hashedModelKeys[[...convert[model].labels].sort().join("")] = model;
    }
    var limiters = {};
    function Color(object, model) {
      if (!(this instanceof Color)) {
        return new Color(object, model);
      }
      if (model && model in skippedModels) {
        model = null;
      }
      if (model && !(model in convert)) {
        throw new Error("Unknown model: " + model);
      }
      let i;
      let channels;
      if (object == null) {
        this.model = "rgb";
        this.color = [0, 0, 0];
        this.valpha = 1;
      } else if (object instanceof Color) {
        this.model = object.model;
        this.color = [...object.color];
        this.valpha = object.valpha;
      } else if (typeof object === "string") {
        const result = cs.get(object);
        if (result === null) {
          throw new Error("Unable to parse color from string: " + object);
        }
        this.model = result.model;
        channels = convert[this.model].channels;
        this.color = result.value.slice(0, channels);
        this.valpha = typeof result.value[channels] === "number" ? result.value[channels] : 1;
      } else if (object.length > 0) {
        this.model = model || "rgb";
        channels = convert[this.model].channels;
        const newArray = Array.prototype.slice.call(object, 0, channels);
        this.color = zeroArray(newArray, channels);
        this.valpha = typeof object[channels] === "number" ? object[channels] : 1;
      } else if (typeof object === "number") {
        this.model = "rgb";
        this.color = [
          object >> 16 & 255,
          object >> 8 & 255,
          object & 255
        ];
        this.valpha = 1;
      } else {
        this.valpha = 1;
        const keys = Object.keys(object);
        if ("alpha" in object) {
          keys.splice(keys.indexOf("alpha"), 1);
          this.valpha = typeof object.alpha === "number" ? object.alpha : 0;
        }
        const hashedKeys = keys.sort().join("");
        if (!(hashedKeys in hashedModelKeys)) {
          throw new Error("Unable to parse color from object: " + JSON.stringify(object));
        }
        this.model = hashedModelKeys[hashedKeys];
        const { labels } = convert[this.model];
        const color = [];
        for (i = 0; i < labels.length; i++) {
          color.push(object[labels[i]]);
        }
        this.color = zeroArray(color);
      }
      if (limiters[this.model]) {
        channels = convert[this.model].channels;
        for (i = 0; i < channels; i++) {
          const limit = limiters[this.model][i];
          if (limit) {
            this.color[i] = limit(this.color[i]);
          }
        }
      }
      this.valpha = Math.max(0, Math.min(1, this.valpha));
      if (Object.freeze) {
        Object.freeze(this);
      }
    }
    Color.prototype = {
      toString() {
        return this.string();
      },
      toJSON() {
        return this[this.model]();
      },
      string(places) {
        let self2 = this.model in cs.to ? this : this.rgb();
        self2 = self2.round(typeof places === "number" ? places : 1);
        const arguments_ = self2.valpha === 1 ? self2.color : [...self2.color, this.valpha];
        return cs.to[self2.model](...arguments_);
      },
      percentString(places) {
        const self2 = this.rgb().round(typeof places === "number" ? places : 1);
        const arguments_ = self2.valpha === 1 ? self2.color : [...self2.color, this.valpha];
        return cs.to.rgb.percent(...arguments_);
      },
      array() {
        return this.valpha === 1 ? [...this.color] : [...this.color, this.valpha];
      },
      object() {
        const result = {};
        const { channels } = convert[this.model];
        const { labels } = convert[this.model];
        for (let i = 0; i < channels; i++) {
          result[labels[i]] = this.color[i];
        }
        if (this.valpha !== 1) {
          result.alpha = this.valpha;
        }
        return result;
      },
      unitArray() {
        const rgb = this.rgb().color;
        rgb[0] /= 255;
        rgb[1] /= 255;
        rgb[2] /= 255;
        if (this.valpha !== 1) {
          rgb.push(this.valpha);
        }
        return rgb;
      },
      unitObject() {
        const rgb = this.rgb().object();
        rgb.r /= 255;
        rgb.g /= 255;
        rgb.b /= 255;
        if (this.valpha !== 1) {
          rgb.alpha = this.valpha;
        }
        return rgb;
      },
      round(places) {
        places = Math.max(places || 0, 0);
        return new Color([...this.color.map(roundToPlace(places)), this.valpha], this.model);
      },
      alpha(value) {
        if (value !== void 0) {
          return new Color([...this.color, Math.max(0, Math.min(1, value))], this.model);
        }
        return this.valpha;
      },
      // Rgb
      red: getset("rgb", 0, maxfn(255)),
      green: getset("rgb", 1, maxfn(255)),
      blue: getset("rgb", 2, maxfn(255)),
      hue: getset(["hsl", "hsv", "hsl", "hwb", "hcg"], 0, (value) => (value % 360 + 360) % 360),
      saturationl: getset("hsl", 1, maxfn(100)),
      lightness: getset("hsl", 2, maxfn(100)),
      saturationv: getset("hsv", 1, maxfn(100)),
      value: getset("hsv", 2, maxfn(100)),
      chroma: getset("hcg", 1, maxfn(100)),
      gray: getset("hcg", 2, maxfn(100)),
      white: getset("hwb", 1, maxfn(100)),
      wblack: getset("hwb", 2, maxfn(100)),
      cyan: getset("cmyk", 0, maxfn(100)),
      magenta: getset("cmyk", 1, maxfn(100)),
      yellow: getset("cmyk", 2, maxfn(100)),
      black: getset("cmyk", 3, maxfn(100)),
      x: getset("xyz", 0, maxfn(95.047)),
      y: getset("xyz", 1, maxfn(100)),
      z: getset("xyz", 2, maxfn(108.833)),
      l: getset("lab", 0, maxfn(100)),
      a: getset("lab", 1),
      b: getset("lab", 2),
      keyword(value) {
        if (value !== void 0) {
          return new Color(value);
        }
        return convert[this.model].keyword(this.color);
      },
      hex(value) {
        if (value !== void 0) {
          return new Color(value);
        }
        return cs.to.hex(...this.rgb().round().color);
      },
      hexa(value) {
        if (value !== void 0) {
          return new Color(value);
        }
        const rgbArray = this.rgb().round().color;
        let alphaHex = Math.round(this.valpha * 255).toString(16).toUpperCase();
        if (alphaHex.length === 1) {
          alphaHex = "0" + alphaHex;
        }
        return cs.to.hex(...rgbArray) + alphaHex;
      },
      rgbNumber() {
        const rgb = this.rgb().color;
        return (rgb[0] & 255) << 16 | (rgb[1] & 255) << 8 | rgb[2] & 255;
      },
      luminosity() {
        const rgb = this.rgb().color;
        const lum = [];
        for (const [i, element] of rgb.entries()) {
          const chan = element / 255;
          lum[i] = chan <= 0.04045 ? chan / 12.92 : ((chan + 0.055) / 1.055) ** 2.4;
        }
        return 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2];
      },
      contrast(color2) {
        const lum1 = this.luminosity();
        const lum2 = color2.luminosity();
        if (lum1 > lum2) {
          return (lum1 + 0.05) / (lum2 + 0.05);
        }
        return (lum2 + 0.05) / (lum1 + 0.05);
      },
      level(color2) {
        const contrastRatio = this.contrast(color2);
        if (contrastRatio >= 7) {
          return "AAA";
        }
        return contrastRatio >= 4.5 ? "AA" : "";
      },
      isDark() {
        const rgb = this.rgb().color;
        const yiq = (rgb[0] * 2126 + rgb[1] * 7152 + rgb[2] * 722) / 1e4;
        return yiq < 128;
      },
      isLight() {
        return !this.isDark();
      },
      negate() {
        const rgb = this.rgb();
        for (let i = 0; i < 3; i++) {
          rgb.color[i] = 255 - rgb.color[i];
        }
        return rgb;
      },
      lighten(ratio) {
        const hsl = this.hsl();
        hsl.color[2] += hsl.color[2] * ratio;
        return hsl;
      },
      darken(ratio) {
        const hsl = this.hsl();
        hsl.color[2] -= hsl.color[2] * ratio;
        return hsl;
      },
      saturate(ratio) {
        const hsl = this.hsl();
        hsl.color[1] += hsl.color[1] * ratio;
        return hsl;
      },
      desaturate(ratio) {
        const hsl = this.hsl();
        hsl.color[1] -= hsl.color[1] * ratio;
        return hsl;
      },
      whiten(ratio) {
        const hwb = this.hwb();
        hwb.color[1] += hwb.color[1] * ratio;
        return hwb;
      },
      blacken(ratio) {
        const hwb = this.hwb();
        hwb.color[2] += hwb.color[2] * ratio;
        return hwb;
      },
      grayscale() {
        const rgb = this.rgb().color;
        const value = rgb[0] * 0.3 + rgb[1] * 0.59 + rgb[2] * 0.11;
        return Color.rgb(value, value, value);
      },
      fade(ratio) {
        return this.alpha(this.valpha - this.valpha * ratio);
      },
      opaquer(ratio) {
        return this.alpha(this.valpha + this.valpha * ratio);
      },
      rotate(degrees) {
        const hsl = this.hsl();
        let hue = hsl.color[0];
        hue = (hue + degrees) % 360;
        hue = hue < 0 ? 360 + hue : hue;
        hsl.color[0] = hue;
        return hsl;
      },
      mix(mixinColor, weight) {
        if (!mixinColor || !mixinColor.rgb) {
          throw new Error('Argument to "mix" was not a Color instance, but rather an instance of ' + typeof mixinColor);
        }
        const color1 = mixinColor.rgb();
        const color2 = this.rgb();
        const p = weight === void 0 ? 0.5 : weight;
        const w = 2 * p - 1;
        const a = color1.alpha() - color2.alpha();
        const w1 = ((w * a === -1 ? w : (w + a) / (1 + w * a)) + 1) / 2;
        const w2 = 1 - w1;
        return Color.rgb(
          w1 * color1.red() + w2 * color2.red(),
          w1 * color1.green() + w2 * color2.green(),
          w1 * color1.blue() + w2 * color2.blue(),
          color1.alpha() * p + color2.alpha() * (1 - p)
        );
      }
    };
    for (const model of Object.keys(convert)) {
      if (skippedModels.includes(model)) {
        continue;
      }
      const { channels } = convert[model];
      Color.prototype[model] = function(...arguments_) {
        if (this.model === model) {
          return new Color(this);
        }
        if (arguments_.length > 0) {
          return new Color(arguments_, model);
        }
        return new Color([...assertArray(convert[this.model][model].raw(this.color)), this.valpha], model);
      };
      Color[model] = function(...arguments_) {
        let color = arguments_[0];
        if (typeof color === "number") {
          color = zeroArray(arguments_, channels);
        }
        return new Color(color, model);
      };
    }
    function roundTo(number, places) {
      return Number(number.toFixed(places));
    }
    function roundToPlace(places) {
      return function(number) {
        return roundTo(number, places);
      };
    }
    function getset(model, channel, modifier) {
      model = Array.isArray(model) ? model : [model];
      for (const m of model) {
        (limiters[m] ||= [])[channel] = modifier;
      }
      model = model[0];
      return function(value) {
        let result;
        if (value !== void 0) {
          if (modifier) {
            value = modifier(value);
          }
          result = this[model]();
          result.color[channel] = value;
          return result;
        }
        result = this[model]().color[channel];
        if (modifier) {
          result = modifier(result);
        }
        return result;
      };
    }
    function maxfn(max) {
      return function(v) {
        return Math.max(0, Math.min(max, v));
      };
    }
    function assertArray(value) {
      return Array.isArray(value) ? value : [value];
    }
    function zeroArray(array, length) {
      for (let i = 0; i < length; i++) {
        if (typeof array[i] !== "number") {
          array[i] = 0;
        }
      }
      return array;
    }
    function getDefaultExportFromCjs(x) {
      return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
    }
    var textHex = function hex2(str) {
      for (var i = 0, hash = 0; i < str.length; hash = str.charCodeAt(i++) + ((hash << 5) - hash)) ;
      var color = Math.floor(
        Math.abs(
          Math.sin(hash) * 1e4 % 1 * 16777216
        )
      ).toString(16);
      return "#" + Array(6 - color.length + 1).join("0") + color;
    };
    var hex = /* @__PURE__ */ getDefaultExportFromCjs(textHex);
    function colorspace(namespace, delimiter) {
      const split = namespace.split(delimiter || ":");
      let base = hex(split[0]);
      if (!split.length) return base;
      for (let i = 0, l = split.length - 1; i < l; i++) {
        base = Color(base).mix(Color(hex(split[i + 1]))).saturate(1).hex();
      }
      return base;
    }
    module2.exports = colorspace;
  }
});

// node_modules/kuler/index.js
var require_kuler = __commonJS({
  "node_modules/kuler/index.js"(exports2, module2) {
    "use strict";
    function Kuler(text, color) {
      if (color) return new Kuler(text).style(color);
      if (!(this instanceof Kuler)) return new Kuler(text);
      this.text = text;
    }
    Kuler.prototype.prefix = "\x1B[";
    Kuler.prototype.suffix = "m";
    Kuler.prototype.hex = function hex(color) {
      color = color[0] === "#" ? color.substring(1) : color;
      if (color.length === 3) {
        color = color.split("");
        color[5] = color[2];
        color[4] = color[2];
        color[3] = color[1];
        color[2] = color[1];
        color[1] = color[0];
        color = color.join("");
      }
      var r = color.substring(0, 2), g = color.substring(2, 4), b = color.substring(4, 6);
      return [parseInt(r, 16), parseInt(g, 16), parseInt(b, 16)];
    };
    Kuler.prototype.rgb = function rgb(r, g, b) {
      var red = r / 255 * 5, green = g / 255 * 5, blue = b / 255 * 5;
      return this.ansi(red, green, blue);
    };
    Kuler.prototype.ansi = function ansi(r, g, b) {
      var red = Math.round(r), green = Math.round(g), blue = Math.round(b);
      return 16 + red * 36 + green * 6 + blue;
    };
    Kuler.prototype.reset = function reset() {
      return this.prefix + "39;49" + this.suffix;
    };
    Kuler.prototype.style = function style(color) {
      return this.prefix + "38;5;" + this.rgb.apply(this, this.hex(color)) + this.suffix + this.text + this.reset();
    };
    module2.exports = Kuler;
  }
});

// node_modules/@dabh/diagnostics/modifiers/namespace-ansi.js
var require_namespace_ansi = __commonJS({
  "node_modules/@dabh/diagnostics/modifiers/namespace-ansi.js"(exports2, module2) {
    var colorspace = require_index_cjs();
    var kuler = require_kuler();
    module2.exports = function ansiModifier(args, options) {
      var namespace = options.namespace;
      var ansi = options.colors !== false ? kuler(namespace + ":", colorspace(namespace)) : namespace + ":";
      args[0] = ansi + " " + args[0];
      return args;
    };
  }
});

// node_modules/enabled/index.js
var require_enabled = __commonJS({
  "node_modules/enabled/index.js"(exports2, module2) {
    "use strict";
    module2.exports = function enabled(name, variable) {
      if (!variable) return false;
      var variables = variable.split(/[\s,]+/), i = 0;
      for (; i < variables.length; i++) {
        variable = variables[i].replace("*", ".*?");
        if ("-" === variable.charAt(0)) {
          if (new RegExp("^" + variable.substr(1) + "$").test(name)) {
            return false;
          }
          continue;
        }
        if (new RegExp("^" + variable + "$").test(name)) {
          return true;
        }
      }
      return false;
    };
  }
});

// node_modules/@dabh/diagnostics/adapters/index.js
var require_adapters = __commonJS({
  "node_modules/@dabh/diagnostics/adapters/index.js"(exports2, module2) {
    var enabled = require_enabled();
    module2.exports = function create(fn) {
      return function adapter(namespace) {
        try {
          return enabled(namespace, fn());
        } catch (e) {
        }
        return false;
      };
    };
  }
});

// node_modules/@dabh/diagnostics/adapters/process.env.js
var require_process_env = __commonJS({
  "node_modules/@dabh/diagnostics/adapters/process.env.js"(exports2, module2) {
    var adapter = require_adapters();
    module2.exports = adapter(function processenv() {
      return process.env.DEBUG || process.env.DIAGNOSTICS;
    });
  }
});

// node_modules/@dabh/diagnostics/logger/console.js
var require_console2 = __commonJS({
  "node_modules/@dabh/diagnostics/logger/console.js"(exports2, module2) {
    module2.exports = function(meta, messages) {
      try {
        Function.prototype.apply.call(console.log, console, messages);
      } catch (e) {
      }
    };
  }
});

// node_modules/@dabh/diagnostics/node/development.js
var require_development = __commonJS({
  "node_modules/@dabh/diagnostics/node/development.js"(exports2, module2) {
    var create = require_diagnostics();
    var tty = require("tty").isatty(1);
    var diagnostics = create(function dev(namespace, options) {
      options = options || {};
      options.colors = "colors" in options ? options.colors : tty;
      options.namespace = namespace;
      options.prod = false;
      options.dev = true;
      if (!dev.enabled(namespace) && !(options.force || dev.force)) {
        return dev.nope(options);
      }
      return dev.yep(options);
    });
    diagnostics.modify(require_namespace_ansi());
    diagnostics.use(require_process_env());
    diagnostics.set(require_console2());
    module2.exports = diagnostics;
  }
});

// node_modules/@dabh/diagnostics/node/index.js
var require_node2 = __commonJS({
  "node_modules/@dabh/diagnostics/node/index.js"(exports2, module2) {
    if (process.env.NODE_ENV === "production") {
      module2.exports = require_production();
    } else {
      module2.exports = require_development();
    }
  }
});

// node_modules/winston/lib/winston/tail-file.js
var require_tail_file = __commonJS({
  "node_modules/winston/lib/winston/tail-file.js"(exports2, module2) {
    "use strict";
    var fs2 = require("fs");
    var { StringDecoder } = require("string_decoder");
    var { Stream } = require_readable();
    function noop() {
    }
    module2.exports = (options, iter) => {
      const buffer = Buffer.alloc(64 * 1024);
      const decode = new StringDecoder("utf8");
      const stream = new Stream();
      let buff = "";
      let pos = 0;
      let row = 0;
      if (options.start === -1) {
        delete options.start;
      }
      stream.readable = true;
      stream.destroy = () => {
        stream.destroyed = true;
        stream.emit("end");
        stream.emit("close");
      };
      fs2.open(options.file, "a+", "0644", (err4, fd) => {
        if (err4) {
          if (!iter) {
            stream.emit("error", err4);
          } else {
            iter(err4);
          }
          stream.destroy();
          return;
        }
        (function read() {
          if (stream.destroyed) {
            fs2.close(fd, noop);
            return;
          }
          return fs2.read(fd, buffer, 0, buffer.length, pos, (error, bytes) => {
            if (error) {
              if (!iter) {
                stream.emit("error", error);
              } else {
                iter(error);
              }
              stream.destroy();
              return;
            }
            if (!bytes) {
              if (buff) {
                if (options.start == null || row > options.start) {
                  if (!iter) {
                    stream.emit("line", buff);
                  } else {
                    iter(null, buff);
                  }
                }
                row++;
                buff = "";
              }
              return setTimeout(read, 1e3);
            }
            let data = decode.write(buffer.slice(0, bytes));
            if (!iter) {
              stream.emit("data", data);
            }
            data = (buff + data).split(/\n+/);
            const l = data.length - 1;
            let i = 0;
            for (; i < l; i++) {
              if (options.start == null || row > options.start) {
                if (!iter) {
                  stream.emit("line", data[i]);
                } else {
                  iter(null, data[i]);
                }
              }
              row++;
            }
            buff = data[l];
            pos += bytes;
            return read();
          });
        })();
      });
      if (!iter) {
        return stream;
      }
      return stream.destroy;
    };
  }
});

// node_modules/winston/lib/winston/transports/file.js
var require_file = __commonJS({
  "node_modules/winston/lib/winston/transports/file.js"(exports2, module2) {
    "use strict";
    var fs2 = require("fs");
    var path3 = require("path");
    var asyncSeries = require_series();
    var zlib = require("zlib");
    var { MESSAGE } = require_triple_beam();
    var { Stream, PassThrough } = require_readable();
    var TransportStream = require_winston_transport();
    var debug = require_node2()("winston:file");
    var os = require("os");
    var tailFile = require_tail_file();
    module2.exports = class File extends TransportStream {
      /**
       * Constructor function for the File transport object responsible for
       * persisting log messages and metadata to one or more files.
       * @param {Object} options - Options for this instance.
       */
      constructor(options = {}) {
        super(options);
        this.name = options.name || "file";
        function throwIf(target, ...args) {
          args.slice(1).forEach((name) => {
            if (options[name]) {
              throw new Error(`Cannot set ${name} and ${target} together`);
            }
          });
        }
        this._stream = new PassThrough();
        this._stream.setMaxListeners(30);
        this._onError = this._onError.bind(this);
        if (options.filename || options.dirname) {
          throwIf("filename or dirname", "stream");
          this._basename = this.filename = options.filename ? path3.basename(options.filename) : "winston.log";
          this.dirname = options.dirname || path3.dirname(options.filename);
          this.options = options.options || { flags: "a" };
        } else if (options.stream) {
          console.warn("options.stream will be removed in winston@4. Use winston.transports.Stream");
          throwIf("stream", "filename", "maxsize");
          this._dest = this._stream.pipe(this._setupStream(options.stream));
          this.dirname = path3.dirname(this._dest.path);
        } else {
          throw new Error("Cannot log to file without filename or stream.");
        }
        this.maxsize = options.maxsize || null;
        this.rotationFormat = options.rotationFormat || false;
        this.zippedArchive = options.zippedArchive || false;
        this.maxFiles = options.maxFiles || null;
        this.eol = typeof options.eol === "string" ? options.eol : os.EOL;
        this.tailable = options.tailable || false;
        this.lazy = options.lazy || false;
        this._size = 0;
        this._pendingSize = 0;
        this._created = 0;
        this._drain = false;
        this._opening = false;
        this._ending = false;
        this._fileExist = false;
        if (this.dirname) this._createLogDirIfNotExist(this.dirname);
        if (!this.lazy) this.open();
      }
      finishIfEnding() {
        if (this._ending) {
          if (this._opening) {
            this.once("open", () => {
              this._stream.once("finish", () => this.emit("finish"));
              setImmediate(() => this._stream.end());
            });
          } else {
            this._stream.once("finish", () => this.emit("finish"));
            setImmediate(() => this._stream.end());
          }
        }
      }
      /**
       * Called by Node.js Writable stream before emitting 'finish'.
       * Ensures all buffered data is flushed to the underlying file stream
       * before the transport signals completion.
       * @param {Function} callback - Callback to signal completion.
       * @private
       */
      _final(callback) {
        if (this._opening) {
          this.once("open", () => this._final(callback));
          return;
        }
        this._stream.end();
        if (!this._dest) {
          return callback();
        }
        if (this._dest.writableFinished) {
          return callback();
        }
        this._dest.once("finish", callback);
        this._dest.once("error", callback);
      }
      /**
       * Core logging method exposed to Winston. Metadata is optional.
       * @param {Object} info - TODO: add param description.
       * @param {Function} callback - TODO: add param description.
       * @returns {undefined}
       */
      log(info, callback = () => {
      }) {
        if (this.silent) {
          callback();
          return true;
        }
        if (this._drain) {
          this._stream.once("drain", () => {
            this._drain = false;
            this.log(info, callback);
          });
          return;
        }
        if (this._rotate) {
          this._stream.once("rotate", () => {
            this._rotate = false;
            this.log(info, callback);
          });
          return;
        }
        if (this.lazy) {
          if (!this._fileExist) {
            if (!this._opening) {
              this.open();
            }
            this.once("open", () => {
              this._fileExist = true;
              this.log(info, callback);
              return;
            });
            return;
          }
          if (this._needsNewFile(this._pendingSize)) {
            this._dest.once("close", () => {
              if (!this._opening) {
                this.open();
              }
              this.once("open", () => {
                this.log(info, callback);
                return;
              });
              return;
            });
            return;
          }
        }
        const output = `${info[MESSAGE]}${this.eol}`;
        const bytes = Buffer.byteLength(output);
        function logged() {
          this._size += bytes;
          this._pendingSize -= bytes;
          debug("logged %s %s", this._size, output);
          this.emit("logged", info);
          if (this._rotate) {
            return;
          }
          if (this._opening) {
            return;
          }
          if (!this._needsNewFile()) {
            return;
          }
          if (this.lazy) {
            this._endStream(() => {
              this.emit("fileclosed");
            });
            return;
          }
          this._rotate = true;
          this._endStream(() => this._rotateFile());
        }
        this._pendingSize += bytes;
        if (this._opening && !this.rotatedWhileOpening && this._needsNewFile(this._size + this._pendingSize)) {
          this.rotatedWhileOpening = true;
        }
        const written = this._stream.write(output, logged.bind(this));
        if (!written) {
          this._drain = true;
          this._stream.once("drain", () => {
            this._drain = false;
            callback();
          });
        } else {
          callback();
        }
        debug("written", written, this._drain);
        this.finishIfEnding();
        return written;
      }
      /**
       * Query the transport. Options object is optional.
       * @param {Object} options - Loggly-like query options for this instance.
       * @param {function} callback - Continuation to respond to when complete.
       * TODO: Refactor me.
       */
      query(options, callback) {
        if (typeof options === "function") {
          callback = options;
          options = {};
        }
        options = normalizeQuery(options);
        const file = path3.join(this.dirname, this.filename);
        let buff = "";
        let results = [];
        let row = 0;
        const stream = fs2.createReadStream(file, {
          encoding: "utf8"
        });
        stream.on("error", (err4) => {
          if (stream.readable) {
            stream.destroy();
          }
          if (!callback) {
            return;
          }
          return err4.code !== "ENOENT" ? callback(err4) : callback(null, results);
        });
        stream.on("data", (data) => {
          data = (buff + data).split(/\n+/);
          const l = data.length - 1;
          let i = 0;
          for (; i < l; i++) {
            if (!options.start || row >= options.start) {
              add(data[i]);
            }
            row++;
          }
          buff = data[l];
        });
        stream.on("close", () => {
          if (buff) {
            add(buff, true);
          }
          if (options.order === "desc") {
            results = results.reverse();
          }
          if (callback) callback(null, results);
        });
        function add(buff2, attempt) {
          try {
            const log = JSON.parse(buff2);
            if (check(log)) {
              push(log);
            }
          } catch (e) {
            if (!attempt) {
              stream.emit("error", e);
            }
          }
        }
        function push(log) {
          if (options.rows && results.length >= options.rows && options.order !== "desc") {
            if (stream.readable) {
              stream.destroy();
            }
            return;
          }
          if (options.fields) {
            log = options.fields.reduce((obj, key) => {
              obj[key] = log[key];
              return obj;
            }, {});
          }
          if (options.order === "desc") {
            if (results.length >= options.rows) {
              results.shift();
            }
          }
          results.push(log);
        }
        function check(log) {
          if (!log) {
            return;
          }
          if (typeof log !== "object") {
            return;
          }
          const time = new Date(log.timestamp);
          if (options.from && time < options.from || options.until && time > options.until || options.level && options.level !== log.level) {
            return;
          }
          return true;
        }
        function normalizeQuery(options2) {
          options2 = options2 || {};
          options2.rows = options2.rows || options2.limit || 10;
          options2.start = options2.start || 0;
          options2.until = options2.until || /* @__PURE__ */ new Date();
          if (typeof options2.until !== "object") {
            options2.until = new Date(options2.until);
          }
          options2.from = options2.from || options2.until - 24 * 60 * 60 * 1e3;
          if (typeof options2.from !== "object") {
            options2.from = new Date(options2.from);
          }
          options2.order = options2.order || "desc";
          return options2;
        }
      }
      /**
       * Returns a log stream for this transport. Options object is optional.
       * @param {Object} options - Stream options for this instance.
       * @returns {Stream} - TODO: add return description.
       * TODO: Refactor me.
       */
      stream(options = {}) {
        const file = path3.join(this.dirname, this.filename);
        const stream = new Stream();
        const tail = {
          file,
          start: options.start
        };
        stream.destroy = tailFile(tail, (err4, line) => {
          if (err4) {
            return stream.emit("error", err4);
          }
          try {
            stream.emit("data", line);
            line = JSON.parse(line);
            stream.emit("log", line);
          } catch (e) {
            stream.emit("error", e);
          }
        });
        return stream;
      }
      /**
       * Checks to see the filesize of.
       * @returns {undefined}
       */
      open() {
        if (!this.filename) return;
        if (this._opening) return;
        this._opening = true;
        this.stat((err4, size) => {
          if (err4) {
            return this.emit("error", err4);
          }
          debug("stat done: %s { size: %s }", this.filename, size);
          this._size = size;
          this._dest = this._createStream(this._stream);
          this._opening = false;
          this.once("open", () => {
            if (!this._stream.emit("rotate")) {
              this._rotate = false;
            }
          });
        });
      }
      /**
       * Stat the file and assess information in order to create the proper stream.
       * @param {function} callback - TODO: add param description.
       * @returns {undefined}
       */
      stat(callback) {
        const target = this._getFile();
        const fullpath = path3.join(this.dirname, target);
        fs2.stat(fullpath, (err4, stat) => {
          if (err4 && err4.code === "ENOENT") {
            debug("ENOENT\xA0ok", fullpath);
            this.filename = target;
            return callback(null, 0);
          }
          if (err4) {
            debug(`err ${err4.code} ${fullpath}`);
            return callback(err4);
          }
          if (!stat || this._needsNewFile(stat.size)) {
            return this._incFile(() => this.stat(callback));
          }
          this.filename = target;
          callback(null, stat.size);
        });
      }
      /**
       * Closes the stream associated with this instance.
       * @param {function} cb - TODO: add param description.
       * @returns {undefined}
       */
      close(cb) {
        if (!this._stream) {
          return;
        }
        this._stream.end(() => {
          if (cb) {
            cb();
          }
          this.emit("flush");
          this.emit("closed");
        });
      }
      /**
       * TODO: add method description.
       * @param {number} size - TODO: add param description.
       * @returns {undefined}
       */
      _needsNewFile(size) {
        size = size || this._size;
        return this.maxsize && size >= this.maxsize;
      }
      /**
       * TODO: add method description.
       * @param {Error} err - TODO: add param description.
       * @returns {undefined}
       */
      _onError(err4) {
        this.emit("error", err4);
      }
      /**
       * TODO: add method description.
       * @param {Stream} stream - TODO: add param description.
       * @returns {mixed} - TODO: add return description.
       */
      _setupStream(stream) {
        stream.on("error", this._onError);
        return stream;
      }
      /**
       * TODO: add method description.
       * @param {Stream} stream - TODO: add param description.
       * @returns {mixed} - TODO: add return description.
       */
      _cleanupStream(stream) {
        stream.removeListener("error", this._onError);
        stream.destroy();
        return stream;
      }
      /**
       * TODO: add method description.
       */
      _rotateFile() {
        this._incFile(() => this.open());
      }
      /**
       * Unpipe from the stream that has been marked as full and end it so it
       * flushes to disk.
       *
       * @param {function} callback - Callback for when the current file has closed.
       * @private
       */
      _endStream(callback = () => {
      }) {
        if (this._dest) {
          this._stream.unpipe(this._dest);
          this._dest.end(() => {
            this._cleanupStream(this._dest);
            callback();
          });
        } else {
          callback();
        }
      }
      /**
       * Returns the WritableStream for the active file on this instance. If we
       * should gzip the file then a zlib stream is returned.
       *
       * @param {ReadableStream} source –PassThrough to pipe to the file when open.
       * @returns {WritableStream} Stream that writes to disk for the active file.
       */
      _createStream(source) {
        const fullpath = path3.join(this.dirname, this.filename);
        debug("create stream start", fullpath, this.options);
        const dest = fs2.createWriteStream(fullpath, this.options).on("error", (err4) => debug(err4)).on("close", () => debug("close", dest.path, dest.bytesWritten)).on("open", () => {
          debug("file open ok", fullpath);
          this.emit("open", fullpath);
          source.pipe(dest);
          if (this.rotatedWhileOpening) {
            this._stream = new PassThrough();
            this._stream.setMaxListeners(30);
            this._rotateFile();
            this.rotatedWhileOpening = false;
            this._cleanupStream(dest);
            source.end();
          }
        });
        debug("create stream ok", fullpath);
        return dest;
      }
      /**
       * TODO: add method description.
       * @param {function} callback - TODO: add param description.
       * @returns {undefined}
       */
      _incFile(callback) {
        debug("_incFile", this.filename);
        const ext = path3.extname(this._basename);
        const basename = path3.basename(this._basename, ext);
        const tasks = [];
        if (this.zippedArchive) {
          tasks.push(
            function(cb) {
              const num = this._created > 0 && !this.tailable ? this._created : "";
              this._compressFile(
                path3.join(this.dirname, `${basename}${num}${ext}`),
                path3.join(this.dirname, `${basename}${num}${ext}.gz`),
                cb
              );
            }.bind(this)
          );
        }
        tasks.push(
          function(cb) {
            if (!this.tailable) {
              this._created += 1;
              this._checkMaxFilesIncrementing(ext, basename, cb);
            } else {
              this._checkMaxFilesTailable(ext, basename, cb);
            }
          }.bind(this)
        );
        asyncSeries(tasks, callback);
      }
      /**
       * Gets the next filename to use for this instance in the case that log
       * filesizes are being capped.
       * @returns {string} - TODO: add return description.
       * @private
       */
      _getFile() {
        const ext = path3.extname(this._basename);
        const basename = path3.basename(this._basename, ext);
        const isRotation = this.rotationFormat ? this.rotationFormat() : this._created;
        return !this.tailable && this._created ? `${basename}${isRotation}${ext}` : `${basename}${ext}`;
      }
      /**
       * Increment the number of files created or checked by this instance.
       * @param {mixed} ext - TODO: add param description.
       * @param {mixed} basename - TODO: add param description.
       * @param {mixed} callback - TODO: add param description.
       * @returns {undefined}
       * @private
       */
      _checkMaxFilesIncrementing(ext, basename, callback) {
        if (!this.maxFiles || this._created < this.maxFiles) {
          return setImmediate(callback);
        }
        const oldest = this._created - this.maxFiles;
        const isOldest = oldest !== 0 ? oldest : "";
        const isZipped = this.zippedArchive ? ".gz" : "";
        const filePath = `${basename}${isOldest}${ext}${isZipped}`;
        const target = path3.join(this.dirname, filePath);
        fs2.unlink(target, callback);
      }
      /**
       * Roll files forward based on integer, up to maxFiles. e.g. if base if
       * file.log and it becomes oversized, roll to file1.log, and allow file.log
       * to be re-used. If file is oversized again, roll file1.log to file2.log,
       * roll file.log to file1.log, and so on.
       * @param {mixed} ext - TODO: add param description.
       * @param {mixed} basename - TODO: add param description.
       * @param {mixed} callback - TODO: add param description.
       * @returns {undefined}
       * @private
       */
      _checkMaxFilesTailable(ext, basename, callback) {
        const tasks = [];
        if (!this.maxFiles) {
          return;
        }
        const isZipped = this.zippedArchive ? ".gz" : "";
        for (let x = this.maxFiles - 1; x > 1; x--) {
          tasks.push(function(i, cb) {
            let fileName = `${basename}${i - 1}${ext}${isZipped}`;
            const tmppath = path3.join(this.dirname, fileName);
            fs2.exists(tmppath, (exists) => {
              if (!exists) {
                return cb(null);
              }
              fileName = `${basename}${i}${ext}${isZipped}`;
              fs2.rename(tmppath, path3.join(this.dirname, fileName), cb);
            });
          }.bind(this, x));
        }
        asyncSeries(tasks, () => {
          fs2.rename(
            path3.join(this.dirname, `${basename}${ext}${isZipped}`),
            path3.join(this.dirname, `${basename}1${ext}${isZipped}`),
            callback
          );
        });
      }
      /**
       * Compresses src to dest with gzip and unlinks src
       * @param {string} src - path to source file.
       * @param {string} dest - path to zipped destination file.
       * @param {Function} callback - callback called after file has been compressed.
       * @returns {undefined}
       * @private
       */
      _compressFile(src, dest, callback) {
        fs2.access(src, fs2.F_OK, (err4) => {
          if (err4) {
            return callback();
          }
          var gzip = zlib.createGzip();
          var inp = fs2.createReadStream(src);
          var out = fs2.createWriteStream(dest);
          out.on("finish", () => {
            fs2.unlink(src, callback);
          });
          inp.pipe(gzip).pipe(out);
        });
      }
      _createLogDirIfNotExist(dirPath) {
        if (!fs2.existsSync(dirPath)) {
          fs2.mkdirSync(dirPath, { recursive: true });
        }
      }
    };
  }
});

// node_modules/winston/lib/winston/transports/http.js
var require_http = __commonJS({
  "node_modules/winston/lib/winston/transports/http.js"(exports2, module2) {
    "use strict";
    var http = require("http");
    var https = require("https");
    var { Stream } = require_readable();
    var TransportStream = require_winston_transport();
    var { configure } = require_safe_stable_stringify();
    module2.exports = class Http extends TransportStream {
      /**
       * Constructor function for the Http transport object responsible for
       * persisting log messages and metadata to a terminal or TTY.
       * @param {!Object} [options={}] - Options for this instance.
       */
      // eslint-disable-next-line max-statements
      constructor(options = {}) {
        super(options);
        this.options = options;
        this.name = options.name || "http";
        this.ssl = !!options.ssl;
        this.host = options.host || "localhost";
        this.port = options.port;
        this.auth = options.auth;
        this.path = options.path || "";
        this.maximumDepth = options.maximumDepth;
        this.agent = options.agent;
        this.headers = options.headers || {};
        this.headers["content-type"] = "application/json";
        this.batch = options.batch || false;
        this.batchInterval = options.batchInterval || 5e3;
        this.batchCount = options.batchCount || 10;
        this.batchOptions = [];
        this.batchTimeoutID = -1;
        this.batchCallback = {};
        if (!this.port) {
          this.port = this.ssl ? 443 : 80;
        }
      }
      /**
       * Core logging method exposed to Winston.
       * @param {Object} info - TODO: add param description.
       * @param {function} callback - TODO: add param description.
       * @returns {undefined}
       */
      log(info, callback) {
        this._request(info, null, null, (err4, res) => {
          if (res && res.statusCode !== 200) {
            err4 = new Error(`Invalid HTTP Status Code: ${res.statusCode}`);
          }
          if (err4) {
            this.emit("warn", err4);
          } else {
            this.emit("logged", info);
          }
        });
        if (callback) {
          setImmediate(callback);
        }
      }
      /**
       * Query the transport. Options object is optional.
       * @param {Object} options -  Loggly-like query options for this instance.
       * @param {function} callback - Continuation to respond to when complete.
       * @returns {undefined}
       */
      query(options, callback) {
        if (typeof options === "function") {
          callback = options;
          options = {};
        }
        options = {
          method: "query",
          params: this.normalizeQuery(options)
        };
        const auth = options.params.auth || null;
        delete options.params.auth;
        const path3 = options.params.path || null;
        delete options.params.path;
        this._request(options, auth, path3, (err4, res, body) => {
          if (res && res.statusCode !== 200) {
            err4 = new Error(`Invalid HTTP Status Code: ${res.statusCode}`);
          }
          if (err4) {
            return callback(err4);
          }
          if (typeof body === "string") {
            try {
              body = JSON.parse(body);
            } catch (e) {
              return callback(e);
            }
          }
          callback(null, body);
        });
      }
      /**
       * Returns a log stream for this transport. Options object is optional.
       * @param {Object} options - Stream options for this instance.
       * @returns {Stream} - TODO: add return description
       */
      stream(options = {}) {
        const stream = new Stream();
        options = {
          method: "stream",
          params: options
        };
        const path3 = options.params.path || null;
        delete options.params.path;
        const auth = options.params.auth || null;
        delete options.params.auth;
        let buff = "";
        const req = this._request(options, auth, path3);
        stream.destroy = () => req.destroy();
        req.on("data", (data) => {
          data = (buff + data).split(/\n+/);
          const l = data.length - 1;
          let i = 0;
          for (; i < l; i++) {
            try {
              stream.emit("log", JSON.parse(data[i]));
            } catch (e) {
              stream.emit("error", e);
            }
          }
          buff = data[l];
        });
        req.on("error", (err4) => stream.emit("error", err4));
        return stream;
      }
      /**
       * Make a request to a winstond server or any http server which can
       * handle json-rpc.
       * @param {function} options - Options to sent the request.
       * @param {Object?} auth - authentication options
       * @param {string} path - request path
       * @param {function} callback - Continuation to respond to when complete.
       */
      _request(options, auth, path3, callback) {
        options = options || {};
        auth = auth || this.auth;
        path3 = path3 || this.path || "";
        if (this.batch) {
          this._doBatch(options, callback, auth, path3);
        } else {
          this._doRequest(options, callback, auth, path3);
        }
      }
      /**
       * Send or memorize the options according to batch configuration
       * @param {function} options - Options to sent the request.
       * @param {function} callback - Continuation to respond to when complete.
       * @param {Object?} auth - authentication options
       * @param {string} path - request path
       */
      _doBatch(options, callback, auth, path3) {
        this.batchOptions.push(options);
        if (this.batchOptions.length === 1) {
          const me = this;
          this.batchCallback = callback;
          this.batchTimeoutID = setTimeout(function() {
            me.batchTimeoutID = -1;
            me._doBatchRequest(me.batchCallback, auth, path3);
          }, this.batchInterval);
        }
        if (this.batchOptions.length === this.batchCount) {
          this._doBatchRequest(this.batchCallback, auth, path3);
        }
      }
      /**
       * Initiate a request with the memorized batch options, stop the batch timeout
       * @param {function} callback - Continuation to respond to when complete.
       * @param {Object?} auth - authentication options
       * @param {string} path - request path
       */
      _doBatchRequest(callback, auth, path3) {
        if (this.batchTimeoutID > 0) {
          clearTimeout(this.batchTimeoutID);
          this.batchTimeoutID = -1;
        }
        const batchOptionsCopy = this.batchOptions.slice();
        this.batchOptions = [];
        this._doRequest(batchOptionsCopy, callback, auth, path3);
      }
      /**
       * Make a request to a winstond server or any http server which can
       * handle json-rpc.
       * @param {function} options - Options to sent the request.
       * @param {function} callback - Continuation to respond to when complete.
       * @param {Object?} auth - authentication options
       * @param {string} path - request path
       */
      _doRequest(options, callback, auth, path3) {
        const headers = Object.assign({}, this.headers);
        if (auth && auth.bearer) {
          headers.Authorization = `Bearer ${auth.bearer}`;
        }
        const req = (this.ssl ? https : http).request({
          ...this.options,
          method: "POST",
          host: this.host,
          port: this.port,
          path: `/${path3.replace(/^\//, "")}`,
          headers,
          auth: auth && auth.username && auth.password ? `${auth.username}:${auth.password}` : "",
          agent: this.agent
        });
        req.on("error", callback);
        req.on("response", (res) => res.on("end", () => callback(null, res)).resume());
        const jsonStringify = configure({
          ...this.maximumDepth && { maximumDepth: this.maximumDepth }
        });
        req.end(Buffer.from(jsonStringify(options, this.options.replacer), "utf8"));
      }
    };
  }
});

// node_modules/is-stream/index.js
var require_is_stream = __commonJS({
  "node_modules/is-stream/index.js"(exports2, module2) {
    "use strict";
    var isStream = (stream) => stream !== null && typeof stream === "object" && typeof stream.pipe === "function";
    isStream.writable = (stream) => isStream(stream) && stream.writable !== false && typeof stream._write === "function" && typeof stream._writableState === "object";
    isStream.readable = (stream) => isStream(stream) && stream.readable !== false && typeof stream._read === "function" && typeof stream._readableState === "object";
    isStream.duplex = (stream) => isStream.writable(stream) && isStream.readable(stream);
    isStream.transform = (stream) => isStream.duplex(stream) && typeof stream._transform === "function";
    module2.exports = isStream;
  }
});

// node_modules/winston/lib/winston/transports/stream.js
var require_stream2 = __commonJS({
  "node_modules/winston/lib/winston/transports/stream.js"(exports2, module2) {
    "use strict";
    var isStream = require_is_stream();
    var { MESSAGE } = require_triple_beam();
    var os = require("os");
    var TransportStream = require_winston_transport();
    module2.exports = class Stream extends TransportStream {
      /**
       * Constructor function for the Console transport object responsible for
       * persisting log messages and metadata to a terminal or TTY.
       * @param {!Object} [options={}] - Options for this instance.
       */
      constructor(options = {}) {
        super(options);
        if (!options.stream || !isStream(options.stream)) {
          throw new Error("options.stream is required.");
        }
        this._stream = options.stream;
        this._stream.setMaxListeners(Infinity);
        this.isObjectMode = options.stream._writableState.objectMode;
        this.eol = typeof options.eol === "string" ? options.eol : os.EOL;
      }
      /**
       * Core logging method exposed to Winston.
       * @param {Object} info - TODO: add param description.
       * @param {Function} callback - TODO: add param description.
       * @returns {undefined}
       */
      log(info, callback) {
        setImmediate(() => this.emit("logged", info));
        if (this.isObjectMode) {
          this._stream.write(info);
          if (callback) {
            callback();
          }
          return;
        }
        this._stream.write(`${info[MESSAGE]}${this.eol}`);
        if (callback) {
          callback();
        }
        return;
      }
    };
  }
});

// node_modules/winston/lib/winston/transports/index.js
var require_transports = __commonJS({
  "node_modules/winston/lib/winston/transports/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "Console", {
      configurable: true,
      enumerable: true,
      get() {
        return require_console();
      }
    });
    Object.defineProperty(exports2, "File", {
      configurable: true,
      enumerable: true,
      get() {
        return require_file();
      }
    });
    Object.defineProperty(exports2, "Http", {
      configurable: true,
      enumerable: true,
      get() {
        return require_http();
      }
    });
    Object.defineProperty(exports2, "Stream", {
      configurable: true,
      enumerable: true,
      get() {
        return require_stream2();
      }
    });
  }
});

// node_modules/winston/lib/winston/config/index.js
var require_config2 = __commonJS({
  "node_modules/winston/lib/winston/config/index.js"(exports2) {
    "use strict";
    var logform = require_logform();
    var { configs } = require_triple_beam();
    exports2.cli = logform.levels(configs.cli);
    exports2.npm = logform.levels(configs.npm);
    exports2.syslog = logform.levels(configs.syslog);
    exports2.addColors = logform.levels;
  }
});

// node_modules/async/eachOf.js
var require_eachOf = __commonJS({
  "node_modules/async/eachOf.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    var _isArrayLike = require_isArrayLike();
    var _isArrayLike2 = _interopRequireDefault(_isArrayLike);
    var _breakLoop = require_breakLoop();
    var _breakLoop2 = _interopRequireDefault(_breakLoop);
    var _eachOfLimit = require_eachOfLimit2();
    var _eachOfLimit2 = _interopRequireDefault(_eachOfLimit);
    var _once = require_once();
    var _once2 = _interopRequireDefault(_once);
    var _onlyOnce = require_onlyOnce();
    var _onlyOnce2 = _interopRequireDefault(_onlyOnce);
    var _wrapAsync = require_wrapAsync();
    var _wrapAsync2 = _interopRequireDefault(_wrapAsync);
    var _awaitify = require_awaitify();
    var _awaitify2 = _interopRequireDefault(_awaitify);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function eachOfArrayLike(coll, iteratee, callback) {
      callback = (0, _once2.default)(callback);
      var index = 0, completed = 0, { length } = coll, canceled = false;
      if (length === 0) {
        callback(null);
      }
      function iteratorCallback(err4, value) {
        if (err4 === false) {
          canceled = true;
        }
        if (canceled === true) return;
        if (err4) {
          callback(err4);
        } else if (++completed === length || value === _breakLoop2.default) {
          callback(null);
        }
      }
      for (; index < length; index++) {
        iteratee(coll[index], index, (0, _onlyOnce2.default)(iteratorCallback));
      }
    }
    function eachOfGeneric(coll, iteratee, callback) {
      return (0, _eachOfLimit2.default)(coll, Infinity, iteratee, callback);
    }
    function eachOf(coll, iteratee, callback) {
      var eachOfImplementation = (0, _isArrayLike2.default)(coll) ? eachOfArrayLike : eachOfGeneric;
      return eachOfImplementation(coll, (0, _wrapAsync2.default)(iteratee), callback);
    }
    exports2.default = (0, _awaitify2.default)(eachOf, 3);
    module2.exports = exports2.default;
  }
});

// node_modules/async/internal/withoutIndex.js
var require_withoutIndex = __commonJS({
  "node_modules/async/internal/withoutIndex.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.default = _withoutIndex;
    function _withoutIndex(iteratee) {
      return (value, index, callback) => iteratee(value, callback);
    }
    module2.exports = exports2.default;
  }
});

// node_modules/async/forEach.js
var require_forEach = __commonJS({
  "node_modules/async/forEach.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    var _eachOf = require_eachOf();
    var _eachOf2 = _interopRequireDefault(_eachOf);
    var _withoutIndex = require_withoutIndex();
    var _withoutIndex2 = _interopRequireDefault(_withoutIndex);
    var _wrapAsync = require_wrapAsync();
    var _wrapAsync2 = _interopRequireDefault(_wrapAsync);
    var _awaitify = require_awaitify();
    var _awaitify2 = _interopRequireDefault(_awaitify);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function eachLimit(coll, iteratee, callback) {
      return (0, _eachOf2.default)(coll, (0, _withoutIndex2.default)((0, _wrapAsync2.default)(iteratee)), callback);
    }
    exports2.default = (0, _awaitify2.default)(eachLimit, 3);
    module2.exports = exports2.default;
  }
});

// node_modules/fn.name/index.js
var require_fn = __commonJS({
  "node_modules/fn.name/index.js"(exports2, module2) {
    "use strict";
    var toString = Object.prototype.toString;
    module2.exports = function name(fn) {
      if ("string" === typeof fn.displayName && fn.constructor.name) {
        return fn.displayName;
      } else if ("string" === typeof fn.name && fn.name) {
        return fn.name;
      }
      if ("object" === typeof fn && fn.constructor && "string" === typeof fn.constructor.name) return fn.constructor.name;
      var named = fn.toString(), type = toString.call(fn).slice(8, -1);
      if ("Function" === type) {
        named = named.substring(named.indexOf("(") + 1, named.indexOf(")"));
      } else {
        named = type;
      }
      return named || "anonymous";
    };
  }
});

// node_modules/one-time/index.js
var require_one_time = __commonJS({
  "node_modules/one-time/index.js"(exports2, module2) {
    "use strict";
    var name = require_fn();
    module2.exports = function one(fn) {
      var called = 0, value;
      function onetime() {
        if (called) return value;
        called = 1;
        value = fn.apply(this, arguments);
        fn = null;
        return value;
      }
      onetime.displayName = name(fn);
      return onetime;
    };
  }
});

// node_modules/stack-trace/lib/stack-trace.js
var require_stack_trace = __commonJS({
  "node_modules/stack-trace/lib/stack-trace.js"(exports2) {
    exports2.get = function(belowFn) {
      var oldLimit = Error.stackTraceLimit;
      Error.stackTraceLimit = Infinity;
      var dummyObject = {};
      var v8Handler = Error.prepareStackTrace;
      Error.prepareStackTrace = function(dummyObject2, v8StackTrace2) {
        return v8StackTrace2;
      };
      Error.captureStackTrace(dummyObject, belowFn || exports2.get);
      var v8StackTrace = dummyObject.stack;
      Error.prepareStackTrace = v8Handler;
      Error.stackTraceLimit = oldLimit;
      return v8StackTrace;
    };
    exports2.parse = function(err4) {
      if (!err4.stack) {
        return [];
      }
      var self2 = this;
      var lines = err4.stack.split("\n").slice(1);
      return lines.map(function(line) {
        if (line.match(/^\s*[-]{4,}$/)) {
          return self2._createParsedCallSite({
            fileName: line,
            lineNumber: null,
            functionName: null,
            typeName: null,
            methodName: null,
            columnNumber: null,
            "native": null
          });
        }
        var lineMatch = line.match(/at (?:(.+)\s+\()?(?:(.+?):(\d+)(?::(\d+))?|([^)]+))\)?/);
        if (!lineMatch) {
          return;
        }
        var object = null;
        var method = null;
        var functionName = null;
        var typeName = null;
        var methodName = null;
        var isNative = lineMatch[5] === "native";
        if (lineMatch[1]) {
          functionName = lineMatch[1];
          var methodStart = functionName.lastIndexOf(".");
          if (functionName[methodStart - 1] == ".")
            methodStart--;
          if (methodStart > 0) {
            object = functionName.substr(0, methodStart);
            method = functionName.substr(methodStart + 1);
            var objectEnd = object.indexOf(".Module");
            if (objectEnd > 0) {
              functionName = functionName.substr(objectEnd + 1);
              object = object.substr(0, objectEnd);
            }
          }
          typeName = null;
        }
        if (method) {
          typeName = object;
          methodName = method;
        }
        if (method === "<anonymous>") {
          methodName = null;
          functionName = null;
        }
        var properties = {
          fileName: lineMatch[2] || null,
          lineNumber: parseInt(lineMatch[3], 10) || null,
          functionName,
          typeName,
          methodName,
          columnNumber: parseInt(lineMatch[4], 10) || null,
          "native": isNative
        };
        return self2._createParsedCallSite(properties);
      }).filter(function(callSite) {
        return !!callSite;
      });
    };
    function CallSite(properties) {
      for (var property in properties) {
        this[property] = properties[property];
      }
    }
    var strProperties = [
      "this",
      "typeName",
      "functionName",
      "methodName",
      "fileName",
      "lineNumber",
      "columnNumber",
      "function",
      "evalOrigin"
    ];
    var boolProperties = [
      "topLevel",
      "eval",
      "native",
      "constructor"
    ];
    strProperties.forEach(function(property) {
      CallSite.prototype[property] = null;
      CallSite.prototype["get" + property[0].toUpperCase() + property.substr(1)] = function() {
        return this[property];
      };
    });
    boolProperties.forEach(function(property) {
      CallSite.prototype[property] = false;
      CallSite.prototype["is" + property[0].toUpperCase() + property.substr(1)] = function() {
        return this[property];
      };
    });
    exports2._createParsedCallSite = function(properties) {
      return new CallSite(properties);
    };
  }
});

// node_modules/winston/lib/winston/exception-stream.js
var require_exception_stream = __commonJS({
  "node_modules/winston/lib/winston/exception-stream.js"(exports2, module2) {
    "use strict";
    var { Writable: Writable2 } = require_readable();
    module2.exports = class ExceptionStream extends Writable2 {
      /**
       * Constructor function for the ExceptionStream responsible for wrapping a
       * TransportStream; only allowing writes of `info` objects with
       * `info.exception` set to true.
       * @param {!TransportStream} transport - Stream to filter to exceptions
       */
      constructor(transport) {
        super({ objectMode: true });
        if (!transport) {
          throw new Error("ExceptionStream requires a TransportStream instance.");
        }
        this.handleExceptions = true;
        this.transport = transport;
      }
      /**
       * Writes the info object to our transport instance if (and only if) the
       * `exception` property is set on the info.
       * @param {mixed} info - TODO: add param description.
       * @param {mixed} enc - TODO: add param description.
       * @param {mixed} callback - TODO: add param description.
       * @returns {mixed} - TODO: add return description.
       * @private
       */
      _write(info, enc, callback) {
        if (info.exception) {
          return this.transport.log(info, callback);
        }
        callback();
        return true;
      }
    };
  }
});

// node_modules/winston/lib/winston/exception-handler.js
var require_exception_handler = __commonJS({
  "node_modules/winston/lib/winston/exception-handler.js"(exports2, module2) {
    "use strict";
    var os = require("os");
    var asyncForEach = require_forEach();
    var debug = require_node2()("winston:exception");
    var once = require_one_time();
    var stackTrace = require_stack_trace();
    var ExceptionStream = require_exception_stream();
    module2.exports = class ExceptionHandler {
      /**
       * TODO: add contructor description
       * @param {!Logger} logger - TODO: add param description
       */
      constructor(logger) {
        if (!logger) {
          throw new Error("Logger is required to handle exceptions");
        }
        this.logger = logger;
        this.handlers = /* @__PURE__ */ new Map();
      }
      /**
       * Handles `uncaughtException` events for the current process by adding any
       * handlers passed in.
       * @returns {undefined}
       */
      handle(...args) {
        args.forEach((arg) => {
          if (Array.isArray(arg)) {
            return arg.forEach((handler) => this._addHandler(handler));
          }
          this._addHandler(arg);
        });
        if (!this.catcher) {
          this.catcher = this._uncaughtException.bind(this);
          process.on("uncaughtException", this.catcher);
        }
      }
      /**
       * Removes any handlers to `uncaughtException` events for the current
       * process. This does not modify the state of the `this.handlers` set.
       * @returns {undefined}
       */
      unhandle() {
        if (this.catcher) {
          process.removeListener("uncaughtException", this.catcher);
          this.catcher = false;
          Array.from(this.handlers.values()).forEach((wrapper) => this.logger.unpipe(wrapper));
        }
      }
      /**
       * TODO: add method description
       * @param {Error} err - Error to get information about.
       * @returns {mixed} - TODO: add return description.
       */
      getAllInfo(err4) {
        let message = null;
        if (err4) {
          message = typeof err4 === "string" ? err4 : err4.message;
        }
        return {
          error: err4,
          // TODO (indexzero): how do we configure this?
          level: "error",
          message: [
            `uncaughtException: ${message || "(no error message)"}`,
            err4 && err4.stack || "  No stack trace"
          ].join("\n"),
          stack: err4 && err4.stack,
          exception: true,
          date: (/* @__PURE__ */ new Date()).toString(),
          process: this.getProcessInfo(),
          os: this.getOsInfo(),
          trace: this.getTrace(err4)
        };
      }
      /**
       * Gets all relevant process information for the currently running process.
       * @returns {mixed} - TODO: add return description.
       */
      getProcessInfo() {
        return {
          pid: process.pid,
          uid: process.getuid ? process.getuid() : null,
          gid: process.getgid ? process.getgid() : null,
          cwd: process.cwd(),
          execPath: process.execPath,
          version: process.version,
          argv: process.argv,
          memoryUsage: process.memoryUsage()
        };
      }
      /**
       * Gets all relevant OS information for the currently running process.
       * @returns {mixed} - TODO: add return description.
       */
      getOsInfo() {
        return {
          loadavg: os.loadavg(),
          uptime: os.uptime()
        };
      }
      /**
       * Gets a stack trace for the specified error.
       * @param {mixed} err - TODO: add param description.
       * @returns {mixed} - TODO: add return description.
       */
      getTrace(err4) {
        const trace = err4 ? stackTrace.parse(err4) : stackTrace.get();
        return trace.map((site) => {
          return {
            column: site.getColumnNumber(),
            file: site.getFileName(),
            function: site.getFunctionName(),
            line: site.getLineNumber(),
            method: site.getMethodName(),
            native: site.isNative()
          };
        });
      }
      /**
       * Helper method to add a transport as an exception handler.
       * @param {Transport} handler - The transport to add as an exception handler.
       * @returns {void}
       */
      _addHandler(handler) {
        if (!this.handlers.has(handler)) {
          handler.handleExceptions = true;
          const wrapper = new ExceptionStream(handler);
          this.handlers.set(handler, wrapper);
          this.logger.pipe(wrapper);
        }
      }
      /**
       * Logs all relevant information around the `err` and exits the current
       * process.
       * @param {Error} err - Error to handle
       * @returns {mixed} - TODO: add return description.
       * @private
       */
      _uncaughtException(err4) {
        const info = this.getAllInfo(err4);
        const handlers = this._getExceptionHandlers();
        let doExit = typeof this.logger.exitOnError === "function" ? this.logger.exitOnError(err4) : this.logger.exitOnError;
        let timeout;
        if (!handlers.length && doExit) {
          console.warn("winston: exitOnError cannot be true with no exception handlers.");
          console.warn("winston: not exiting process.");
          doExit = false;
        }
        function gracefulExit() {
          debug("doExit", doExit);
          debug("process._exiting", process._exiting);
          if (doExit && !process._exiting) {
            if (timeout) {
              clearTimeout(timeout);
            }
            process.exit(1);
          }
        }
        if (!handlers || handlers.length === 0) {
          return process.nextTick(gracefulExit);
        }
        asyncForEach(handlers, (handler, next) => {
          const done = once(next);
          const transport = handler.transport || handler;
          function onDone(event) {
            return () => {
              debug(event);
              done();
            };
          }
          transport._ending = true;
          transport.once("finish", onDone("finished"));
          transport.once("error", onDone("error"));
        }, () => doExit && gracefulExit());
        this.logger.log(info);
        if (doExit) {
          timeout = setTimeout(gracefulExit, 3e3);
        }
      }
      /**
       * Returns the list of transports and exceptionHandlers for this instance.
       * @returns {Array} - List of transports and exceptionHandlers for this
       * instance.
       * @private
       */
      _getExceptionHandlers() {
        return this.logger.transports.filter((wrap) => {
          const transport = wrap.transport || wrap;
          return transport.handleExceptions;
        });
      }
    };
  }
});

// node_modules/winston/lib/winston/rejection-stream.js
var require_rejection_stream = __commonJS({
  "node_modules/winston/lib/winston/rejection-stream.js"(exports2, module2) {
    "use strict";
    var { Writable: Writable2 } = require_readable();
    module2.exports = class RejectionStream extends Writable2 {
      /**
       * Constructor function for the RejectionStream responsible for wrapping a
       * TransportStream; only allowing writes of `info` objects with
       * `info.rejection` set to true.
       * @param {!TransportStream} transport - Stream to filter to rejections
       */
      constructor(transport) {
        super({ objectMode: true });
        if (!transport) {
          throw new Error("RejectionStream requires a TransportStream instance.");
        }
        this.handleRejections = true;
        this.transport = transport;
      }
      /**
       * Writes the info object to our transport instance if (and only if) the
       * `rejection` property is set on the info.
       * @param {mixed} info - TODO: add param description.
       * @param {mixed} enc - TODO: add param description.
       * @param {mixed} callback - TODO: add param description.
       * @returns {mixed} - TODO: add return description.
       * @private
       */
      _write(info, enc, callback) {
        if (info.rejection) {
          return this.transport.log(info, callback);
        }
        callback();
        return true;
      }
    };
  }
});

// node_modules/winston/lib/winston/rejection-handler.js
var require_rejection_handler = __commonJS({
  "node_modules/winston/lib/winston/rejection-handler.js"(exports2, module2) {
    "use strict";
    var os = require("os");
    var asyncForEach = require_forEach();
    var debug = require_node2()("winston:rejection");
    var once = require_one_time();
    var stackTrace = require_stack_trace();
    var RejectionStream = require_rejection_stream();
    module2.exports = class RejectionHandler {
      /**
       * TODO: add contructor description
       * @param {!Logger} logger - TODO: add param description
       */
      constructor(logger) {
        if (!logger) {
          throw new Error("Logger is required to handle rejections");
        }
        this.logger = logger;
        this.handlers = /* @__PURE__ */ new Map();
      }
      /**
       * Handles `unhandledRejection` events for the current process by adding any
       * handlers passed in.
       * @returns {undefined}
       */
      handle(...args) {
        args.forEach((arg) => {
          if (Array.isArray(arg)) {
            return arg.forEach((handler) => this._addHandler(handler));
          }
          this._addHandler(arg);
        });
        if (!this.catcher) {
          this.catcher = this._unhandledRejection.bind(this);
          process.on("unhandledRejection", this.catcher);
        }
      }
      /**
       * Removes any handlers to `unhandledRejection` events for the current
       * process. This does not modify the state of the `this.handlers` set.
       * @returns {undefined}
       */
      unhandle() {
        if (this.catcher) {
          process.removeListener("unhandledRejection", this.catcher);
          this.catcher = false;
          Array.from(this.handlers.values()).forEach(
            (wrapper) => this.logger.unpipe(wrapper)
          );
        }
      }
      /**
       * TODO: add method description
       * @param {Error} err - Error to get information about.
       * @returns {mixed} - TODO: add return description.
       */
      getAllInfo(err4) {
        let message = null;
        if (err4) {
          message = typeof err4 === "string" ? err4 : err4.message;
        }
        return {
          error: err4,
          // TODO (indexzero): how do we configure this?
          level: "error",
          message: [
            `unhandledRejection: ${message || "(no error message)"}`,
            err4 && err4.stack || "  No stack trace"
          ].join("\n"),
          stack: err4 && err4.stack,
          rejection: true,
          date: (/* @__PURE__ */ new Date()).toString(),
          process: this.getProcessInfo(),
          os: this.getOsInfo(),
          trace: this.getTrace(err4)
        };
      }
      /**
       * Gets all relevant process information for the currently running process.
       * @returns {mixed} - TODO: add return description.
       */
      getProcessInfo() {
        return {
          pid: process.pid,
          uid: process.getuid ? process.getuid() : null,
          gid: process.getgid ? process.getgid() : null,
          cwd: process.cwd(),
          execPath: process.execPath,
          version: process.version,
          argv: process.argv,
          memoryUsage: process.memoryUsage()
        };
      }
      /**
       * Gets all relevant OS information for the currently running process.
       * @returns {mixed} - TODO: add return description.
       */
      getOsInfo() {
        return {
          loadavg: os.loadavg(),
          uptime: os.uptime()
        };
      }
      /**
       * Gets a stack trace for the specified error.
       * @param {mixed} err - TODO: add param description.
       * @returns {mixed} - TODO: add return description.
       */
      getTrace(err4) {
        const trace = err4 ? stackTrace.parse(err4) : stackTrace.get();
        return trace.map((site) => {
          return {
            column: site.getColumnNumber(),
            file: site.getFileName(),
            function: site.getFunctionName(),
            line: site.getLineNumber(),
            method: site.getMethodName(),
            native: site.isNative()
          };
        });
      }
      /**
       * Helper method to add a transport as an exception handler.
       * @param {Transport} handler - The transport to add as an exception handler.
       * @returns {void}
       */
      _addHandler(handler) {
        if (!this.handlers.has(handler)) {
          handler.handleRejections = true;
          const wrapper = new RejectionStream(handler);
          this.handlers.set(handler, wrapper);
          this.logger.pipe(wrapper);
        }
      }
      /**
       * Logs all relevant information around the `err` and exits the current
       * process.
       * @param {Error} err - Error to handle
       * @returns {mixed} - TODO: add return description.
       * @private
       */
      _unhandledRejection(err4) {
        const info = this.getAllInfo(err4);
        const handlers = this._getRejectionHandlers();
        let doExit = typeof this.logger.exitOnError === "function" ? this.logger.exitOnError(err4) : this.logger.exitOnError;
        let timeout;
        if (!handlers.length && doExit) {
          console.warn("winston: exitOnError cannot be true with no rejection handlers.");
          console.warn("winston: not exiting process.");
          doExit = false;
        }
        function gracefulExit() {
          debug("doExit", doExit);
          debug("process._exiting", process._exiting);
          if (doExit && !process._exiting) {
            if (timeout) {
              clearTimeout(timeout);
            }
            process.exit(1);
          }
        }
        if (!handlers || handlers.length === 0) {
          return process.nextTick(gracefulExit);
        }
        asyncForEach(
          handlers,
          (handler, next) => {
            const done = once(next);
            const transport = handler.transport || handler;
            function onDone(event) {
              return () => {
                debug(event);
                done();
              };
            }
            transport._ending = true;
            transport.once("finish", onDone("finished"));
            transport.once("error", onDone("error"));
          },
          () => doExit && gracefulExit()
        );
        this.logger.log(info);
        if (doExit) {
          timeout = setTimeout(gracefulExit, 3e3);
        }
      }
      /**
       * Returns the list of transports and exceptionHandlers for this instance.
       * @returns {Array} - List of transports and exceptionHandlers for this
       * instance.
       * @private
       */
      _getRejectionHandlers() {
        return this.logger.transports.filter((wrap) => {
          const transport = wrap.transport || wrap;
          return transport.handleRejections;
        });
      }
    };
  }
});

// node_modules/winston/lib/winston/profiler.js
var require_profiler = __commonJS({
  "node_modules/winston/lib/winston/profiler.js"(exports2, module2) {
    "use strict";
    var Profiler = class {
      /**
       * Constructor function for the Profiler instance used by
       * `Logger.prototype.startTimer`. When done is called the timer will finish
       * and log the duration.
       * @param {!Logger} logger - TODO: add param description.
       * @private
       */
      constructor(logger) {
        const Logger2 = require_logger();
        if (typeof logger !== "object" || Array.isArray(logger) || !(logger instanceof Logger2)) {
          throw new Error("Logger is required for profiling");
        } else {
          this.logger = logger;
          this.start = Date.now();
        }
      }
      /**
       * Ends the current timer (i.e. Profiler) instance and logs the `msg` along
       * with the duration since creation.
       * @returns {mixed} - TODO: add return description.
       * @private
       */
      done(...args) {
        if (typeof args[args.length - 1] === "function") {
          console.warn("Callback function no longer supported as of winston@3.0.0");
          args.pop();
        }
        const info = typeof args[args.length - 1] === "object" ? args.pop() : {};
        info.level = info.level || "info";
        info.durationMs = Date.now() - this.start;
        return this.logger.write(info);
      }
    };
    module2.exports = Profiler;
  }
});

// node_modules/winston/lib/winston/logger.js
var require_logger = __commonJS({
  "node_modules/winston/lib/winston/logger.js"(exports2, module2) {
    "use strict";
    var { Stream, Transform: Transform2 } = require_readable();
    var asyncForEach = require_forEach();
    var { LEVEL, SPLAT } = require_triple_beam();
    var isStream = require_is_stream();
    var ExceptionHandler = require_exception_handler();
    var RejectionHandler = require_rejection_handler();
    var LegacyTransportStream = require_legacy();
    var Profiler = require_profiler();
    var { warn } = require_common();
    var config = require_config2();
    var formatRegExp = /%[scdjifoO%]/g;
    var Logger2 = class extends Transform2 {
      /**
       * Constructor function for the Logger object responsible for persisting log
       * messages and metadata to one or more transports.
       * @param {!Object} options - foo
       */
      constructor(options) {
        super({ objectMode: true });
        this.configure(options);
      }
      child(defaultRequestMetadata) {
        const logger = this;
        return Object.create(logger, {
          write: {
            value: function(info) {
              const infoClone = Object.assign(
                {},
                defaultRequestMetadata,
                info
              );
              if (info instanceof Error) {
                infoClone.stack = info.stack;
                infoClone.message = info.message;
                infoClone.cause = info.cause;
              }
              logger.write(infoClone);
            }
          }
        });
      }
      /**
       * This will wholesale reconfigure this instance by:
       * 1. Resetting all transports. Older transports will be removed implicitly.
       * 2. Set all other options including levels, colors, rewriters, filters,
       *    exceptionHandlers, etc.
       * @param {!Object} options - TODO: add param description.
       * @returns {undefined}
       */
      configure({
        silent,
        format,
        defaultMeta,
        levels,
        level = "info",
        exitOnError = true,
        transports,
        colors,
        emitErrs,
        formatters,
        padLevels,
        rewriters,
        stripColors,
        exceptionHandlers,
        rejectionHandlers
      } = {}) {
        if (this.transports.length) {
          this.clear();
        }
        this.silent = silent;
        this.format = format || this.format || require_json()();
        this.defaultMeta = defaultMeta || null;
        this.levels = levels || this.levels || config.npm.levels;
        this.level = level;
        if (this.exceptions) {
          this.exceptions.unhandle();
        }
        if (this.rejections) {
          this.rejections.unhandle();
        }
        this.exceptions = new ExceptionHandler(this);
        this.rejections = new RejectionHandler(this);
        this.profilers = {};
        this.exitOnError = exitOnError;
        if (transports) {
          transports = Array.isArray(transports) ? transports : [transports];
          transports.forEach((transport) => this.add(transport));
        }
        if (colors || emitErrs || formatters || padLevels || rewriters || stripColors) {
          throw new Error(
            [
              "{ colors, emitErrs, formatters, padLevels, rewriters, stripColors } were removed in winston@3.0.0.",
              "Use a custom winston.format(function) instead.",
              "See: https://github.com/winstonjs/winston/tree/master/UPGRADE-3.0.md"
            ].join("\n")
          );
        }
        if (exceptionHandlers) {
          this.exceptions.handle(exceptionHandlers);
        }
        if (rejectionHandlers) {
          this.rejections.handle(rejectionHandlers);
        }
      }
      /* eslint-disable valid-jsdoc */
      /**
       * Helper method to get the highest logging level associated with a logger
       *
       * @returns { number | null } - The highest configured logging level, null
       * for invalid configuration
       */
      getHighestLogLevel() {
        const configuredLevelValue = getLevelValue(this.levels, this.level);
        if (!this.transports || this.transports.length === 0) {
          return configuredLevelValue;
        }
        return this.transports.reduce((max, transport) => {
          const levelValue = getLevelValue(this.levels, transport.level);
          return levelValue !== null && levelValue > max ? levelValue : max;
        }, configuredLevelValue);
      }
      isLevelEnabled(level) {
        const givenLevelValue = getLevelValue(this.levels, level);
        if (givenLevelValue === null) {
          return false;
        }
        const configuredLevelValue = getLevelValue(this.levels, this.level);
        if (configuredLevelValue === null) {
          return false;
        }
        if (!this.transports || this.transports.length === 0) {
          return configuredLevelValue >= givenLevelValue;
        }
        const index = this.transports.findIndex((transport) => {
          let transportLevelValue = getLevelValue(this.levels, transport.level);
          if (transportLevelValue === null) {
            transportLevelValue = configuredLevelValue;
          }
          return transportLevelValue >= givenLevelValue;
        });
        return index !== -1;
      }
      /* eslint-disable valid-jsdoc */
      /**
       * Ensure backwards compatibility with a `log` method
       * @param {mixed} level - Level the log message is written at.
       * @param {mixed} msg - TODO: add param description.
       * @param {mixed} meta - TODO: add param description.
       * @returns {Logger} - TODO: add return description.
       *
       * @example
       *    // Supports the existing API:
       *    logger.log('info', 'Hello world', { custom: true });
       *    logger.log('info', new Error('Yo, it\'s on fire'));
       *
       *    // Requires winston.format.splat()
       *    logger.log('info', '%s %d%%', 'A string', 50, { thisIsMeta: true });
       *
       *    // And the new API with a single JSON literal:
       *    logger.log({ level: 'info', message: 'Hello world', custom: true });
       *    logger.log({ level: 'info', message: new Error('Yo, it\'s on fire') });
       *
       *    // Also requires winston.format.splat()
       *    logger.log({
       *      level: 'info',
       *      message: '%s %d%%',
       *      [SPLAT]: ['A string', 50],
       *      meta: { thisIsMeta: true }
       *    });
       *
       */
      /* eslint-enable valid-jsdoc */
      log(level, msg, ...splat) {
        if (arguments.length === 1) {
          level[LEVEL] = level.level;
          this._addDefaultMeta(level);
          this.write(level);
          return this;
        }
        if (arguments.length === 2) {
          if (msg && typeof msg === "object") {
            msg[LEVEL] = msg.level = level;
            this._addDefaultMeta(msg);
            this.write(msg);
            return this;
          }
          msg = { [LEVEL]: level, level, message: msg };
          this._addDefaultMeta(msg);
          this.write(msg);
          return this;
        }
        const [meta] = splat;
        if (typeof meta === "object" && meta !== null) {
          const tokens = msg && msg.match && msg.match(formatRegExp);
          if (!tokens) {
            const info = Object.assign({}, this.defaultMeta, meta, {
              [LEVEL]: level,
              [SPLAT]: splat,
              level,
              message: msg
            });
            if (meta.message) info.message = `${info.message} ${meta.message}`;
            if (meta.stack) info.stack = meta.stack;
            if (meta.cause) info.cause = meta.cause;
            this.write(info);
            return this;
          }
        }
        this.write(Object.assign({}, this.defaultMeta, {
          [LEVEL]: level,
          [SPLAT]: splat,
          level,
          message: msg
        }));
        return this;
      }
      /**
       * Pushes data so that it can be picked up by all of our pipe targets.
       * @param {mixed} info - TODO: add param description.
       * @param {mixed} enc - TODO: add param description.
       * @param {mixed} callback - Continues stream processing.
       * @returns {undefined}
       * @private
       */
      _transform(info, enc, callback) {
        if (this.silent) {
          return callback();
        }
        if (!info[LEVEL]) {
          info[LEVEL] = info.level;
        }
        if (!this.levels[info[LEVEL]] && this.levels[info[LEVEL]] !== 0) {
          console.error("[winston] Unknown logger level: %s", info[LEVEL]);
        }
        if (!this._readableState.pipes) {
          console.error(
            "[winston] Attempt to write logs with no transports, which can increase memory usage: %j",
            info
          );
        }
        try {
          this.push(this.format.transform(info, this.format.options));
        } finally {
          this._writableState.sync = false;
          callback();
        }
      }
      /**
       * Delays the 'finish' event until all transport pipe targets have
       * also emitted 'finish' or are already finished.
       * @param {mixed} callback - Continues stream processing.
       */
      _final(callback) {
        const transports = this.transports.slice();
        asyncForEach(
          transports,
          (transport, next) => {
            if (!transport || transport.finished) return setImmediate(next);
            transport.once("finish", next);
            transport.end();
          },
          callback
        );
      }
      /**
       * Adds the transport to this logger instance by piping to it.
       * @param {mixed} transport - TODO: add param description.
       * @returns {Logger} - TODO: add return description.
       */
      add(transport) {
        const target = !isStream(transport) || transport.log.length > 2 ? new LegacyTransportStream({ transport }) : transport;
        if (!target._writableState || !target._writableState.objectMode) {
          throw new Error(
            "Transports must WritableStreams in objectMode. Set { objectMode: true }."
          );
        }
        this._onEvent("error", target);
        this._onEvent("warn", target);
        this.pipe(target);
        if (transport.handleExceptions) {
          this.exceptions.handle();
        }
        if (transport.handleRejections) {
          this.rejections.handle();
        }
        return this;
      }
      /**
       * Removes the transport from this logger instance by unpiping from it.
       * @param {mixed} transport - TODO: add param description.
       * @returns {Logger} - TODO: add return description.
       */
      remove(transport) {
        if (!transport) return this;
        let target = transport;
        if (!isStream(transport) || transport.log.length > 2) {
          target = this.transports.filter(
            (match) => match.transport === transport
          )[0];
        }
        if (target) {
          this.unpipe(target);
        }
        return this;
      }
      /**
       * Removes all transports from this logger instance.
       * @returns {Logger} - TODO: add return description.
       */
      clear() {
        this.unpipe();
        return this;
      }
      /**
       * Cleans up resources (streams, event listeners) for all transports
       * associated with this instance (if necessary).
       * @returns {Logger} - TODO: add return description.
       */
      close() {
        this.exceptions.unhandle();
        this.rejections.unhandle();
        this.clear();
        this.emit("close");
        return this;
      }
      /**
       * Sets the `target` levels specified on this instance.
       * @param {Object} Target levels to use on this instance.
       */
      setLevels() {
        warn.deprecated("setLevels");
      }
      /**
       * Queries the all transports for this instance with the specified `options`.
       * This will aggregate each transport's results into one object containing
       * a property per transport.
       * @param {Object} options - Query options for this instance.
       * @param {function} callback - Continuation to respond to when complete.
       */
      query(options, callback) {
        if (typeof options === "function") {
          callback = options;
          options = {};
        }
        options = options || {};
        const results = {};
        const queryObject = Object.assign({}, options.query || {});
        function queryTransport(transport, next) {
          if (options.query && typeof transport.formatQuery === "function") {
            options.query = transport.formatQuery(queryObject);
          }
          transport.query(options, (err4, res) => {
            if (err4) {
              return next(err4);
            }
            if (typeof transport.formatResults === "function") {
              res = transport.formatResults(res, options.format);
            }
            next(null, res);
          });
        }
        function addResults(transport, next) {
          queryTransport(transport, (err4, result) => {
            if (next) {
              result = err4 || result;
              if (result) {
                results[transport.name] = result;
              }
              next();
            }
            next = null;
          });
        }
        asyncForEach(
          this.transports.filter((transport) => !!transport.query),
          addResults,
          () => callback(null, results)
        );
      }
      /**
       * Returns a log stream for all transports. Options object is optional.
       * @param{Object} options={} - Stream options for this instance.
       * @returns {Stream} - TODO: add return description.
       */
      stream(options = {}) {
        const out = new Stream();
        const streams = [];
        out._streams = streams;
        out.destroy = () => {
          let i = streams.length;
          while (i--) {
            streams[i].destroy();
          }
        };
        this.transports.filter((transport) => !!transport.stream).forEach((transport) => {
          const str = transport.stream(options);
          if (!str) {
            return;
          }
          streams.push(str);
          str.on("log", (log) => {
            log.transport = log.transport || [];
            log.transport.push(transport.name);
            out.emit("log", log);
          });
          str.on("error", (err4) => {
            err4.transport = err4.transport || [];
            err4.transport.push(transport.name);
            out.emit("error", err4);
          });
        });
        return out;
      }
      /**
       * Returns an object corresponding to a specific timing. When done is called
       * the timer will finish and log the duration. e.g.:
       * @returns {Profile} - TODO: add return description.
       * @example
       *    const timer = winston.startTimer()
       *    setTimeout(() => {
       *      timer.done({
       *        message: 'Logging message'
       *      });
       *    }, 1000);
       */
      startTimer() {
        return new Profiler(this);
      }
      /**
       * Tracks the time inbetween subsequent calls to this method with the same
       * `id` parameter. The second call to this method will log the difference in
       * milliseconds along with the message.
       * @param {string} id Unique id of the profiler
       * @returns {Logger} - TODO: add return description.
       */
      profile(id, ...args) {
        const time = Date.now();
        if (this.profilers[id]) {
          const timeEnd = this.profilers[id];
          delete this.profilers[id];
          if (typeof args[args.length - 2] === "function") {
            console.warn(
              "Callback function no longer supported as of winston@3.0.0"
            );
            args.pop();
          }
          const info = typeof args[args.length - 1] === "object" ? args.pop() : {};
          info.level = info.level || "info";
          info.durationMs = time - timeEnd;
          info.message = info.message || id;
          return this.write(info);
        }
        this.profilers[id] = time;
        return this;
      }
      /**
       * Backwards compatibility to `exceptions.handle` in winston < 3.0.0.
       * @returns {undefined}
       * @deprecated
       */
      handleExceptions(...args) {
        console.warn(
          "Deprecated: .handleExceptions() will be removed in winston@4. Use .exceptions.handle()"
        );
        this.exceptions.handle(...args);
      }
      /**
       * Backwards compatibility to `exceptions.handle` in winston < 3.0.0.
       * @returns {undefined}
       * @deprecated
       */
      unhandleExceptions(...args) {
        console.warn(
          "Deprecated: .unhandleExceptions() will be removed in winston@4. Use .exceptions.unhandle()"
        );
        this.exceptions.unhandle(...args);
      }
      /**
       * Throw a more meaningful deprecation notice
       * @throws {Error} - TODO: add throws description.
       */
      cli() {
        throw new Error(
          [
            "Logger.cli() was removed in winston@3.0.0",
            "Use a custom winston.formats.cli() instead.",
            "See: https://github.com/winstonjs/winston/tree/master/UPGRADE-3.0.md"
          ].join("\n")
        );
      }
      /**
       * Bubbles the `event` that occured on the specified `transport` up
       * from this instance.
       * @param {string} event - The event that occured
       * @param {Object} transport - Transport on which the event occured
       * @private
       */
      _onEvent(event, transport) {
        function transportEvent(err4) {
          if (event === "error" && !this.transports.includes(transport)) {
            this.add(transport);
          }
          this.emit(event, err4, transport);
        }
        if (!transport["__winston" + event]) {
          transport["__winston" + event] = transportEvent.bind(this);
          transport.on(event, transport["__winston" + event]);
        }
      }
      _addDefaultMeta(msg) {
        if (this.defaultMeta) {
          Object.assign(msg, this.defaultMeta);
        }
      }
    };
    function getLevelValue(levels, level) {
      const value = levels[level];
      if (!value && value !== 0) {
        return null;
      }
      return value;
    }
    Object.defineProperty(Logger2.prototype, "transports", {
      configurable: false,
      enumerable: true,
      get() {
        const { pipes } = this._readableState;
        return !Array.isArray(pipes) ? [pipes].filter(Boolean) : pipes;
      }
    });
    module2.exports = Logger2;
  }
});

// node_modules/winston/lib/winston/create-logger.js
var require_create_logger = __commonJS({
  "node_modules/winston/lib/winston/create-logger.js"(exports2, module2) {
    "use strict";
    var { LEVEL } = require_triple_beam();
    var config = require_config2();
    var Logger2 = require_logger();
    var debug = require_node2()("winston:create-logger");
    function isLevelEnabledFunctionName(level) {
      return "is" + level.charAt(0).toUpperCase() + level.slice(1) + "Enabled";
    }
    module2.exports = function(opts = {}) {
      opts.levels = opts.levels || config.npm.levels;
      class DerivedLogger extends Logger2 {
        /**
         * Create a new class derived logger for which the levels can be attached to
         * the prototype of. This is a V8 optimization that is well know to increase
         * performance of prototype functions.
         * @param {!Object} options - Options for the created logger.
         */
        constructor(options) {
          super(options);
        }
      }
      const logger = new DerivedLogger(opts);
      Object.keys(opts.levels).forEach(function(level) {
        debug('Define prototype method for "%s"', level);
        if (level === "log") {
          console.warn('Level "log" not defined: conflicts with the method "log". Use a different level name.');
          return;
        }
        DerivedLogger.prototype[level] = function(...args) {
          const self2 = this || logger;
          if (args.length === 1) {
            const [msg] = args;
            const info = msg && msg.message && msg || { message: msg };
            info.level = info[LEVEL] = level;
            self2._addDefaultMeta(info);
            self2.write(info);
            return this || logger;
          }
          if (args.length === 0) {
            self2.log(level, "");
            return self2;
          }
          return self2.log(level, ...args);
        };
        DerivedLogger.prototype[isLevelEnabledFunctionName(level)] = function() {
          return (this || logger).isLevelEnabled(level);
        };
      });
      return logger;
    };
  }
});

// node_modules/winston/lib/winston/container.js
var require_container = __commonJS({
  "node_modules/winston/lib/winston/container.js"(exports2, module2) {
    "use strict";
    var createLogger2 = require_create_logger();
    module2.exports = class Container {
      /**
       * Constructor function for the Container object responsible for managing a
       * set of `winston.Logger` instances based on string ids.
       * @param {!Object} [options={}] - Default pass-thru options for Loggers.
       */
      constructor(options = {}) {
        this.loggers = /* @__PURE__ */ new Map();
        this.options = options;
      }
      /**
       * Retrieves a `winston.Logger` instance for the specified `id`. If an
       * instance does not exist, one is created.
       * @param {!string} id - The id of the Logger to get.
       * @param {?Object} [options] - Options for the Logger instance.
       * @returns {Logger} - A configured Logger instance with a specified id.
       */
      add(id, options) {
        if (!this.loggers.has(id)) {
          options = Object.assign({}, options || this.options);
          const existing = options.transports || this.options.transports;
          if (existing) {
            options.transports = Array.isArray(existing) ? existing.slice() : [existing];
          } else {
            options.transports = [];
          }
          const logger = createLogger2(options);
          logger.on("close", () => this._delete(id));
          this.loggers.set(id, logger);
        }
        return this.loggers.get(id);
      }
      /**
       * Retreives a `winston.Logger` instance for the specified `id`. If
       * an instance does not exist, one is created.
       * @param {!string} id - The id of the Logger to get.
       * @param {?Object} [options] - Options for the Logger instance.
       * @returns {Logger} - A configured Logger instance with a specified id.
       */
      get(id, options) {
        return this.add(id, options);
      }
      /**
       * Check if the container has a logger with the id.
       * @param {?string} id - The id of the Logger instance to find.
       * @returns {boolean} - Boolean value indicating if this instance has a
       * logger with the specified `id`.
       */
      has(id) {
        return !!this.loggers.has(id);
      }
      /**
       * Closes a `Logger` instance with the specified `id` if it exists.
       * If no `id` is supplied then all Loggers are closed.
       * @param {?string} id - The id of the Logger instance to close.
       * @returns {undefined}
       */
      close(id) {
        if (id) {
          return this._removeLogger(id);
        }
        this.loggers.forEach((val, key) => this._removeLogger(key));
      }
      /**
       * Remove a logger based on the id.
       * @param {!string} id - The id of the logger to remove.
       * @returns {undefined}
       * @private
       */
      _removeLogger(id) {
        if (!this.loggers.has(id)) {
          return;
        }
        const logger = this.loggers.get(id);
        logger.close();
        this._delete(id);
      }
      /**
       * Deletes a `Logger` instance with the specified `id`.
       * @param {!string} id - The id of the Logger instance to delete from
       * container.
       * @returns {undefined}
       * @private
       */
      _delete(id) {
        this.loggers.delete(id);
      }
    };
  }
});

// node_modules/winston/lib/winston.js
var require_winston = __commonJS({
  "node_modules/winston/lib/winston.js"(exports2) {
    "use strict";
    var logform = require_logform();
    var { warn } = require_common();
    exports2.version = require_package().version;
    exports2.transports = require_transports();
    exports2.config = require_config2();
    exports2.addColors = logform.levels;
    exports2.format = logform.format;
    exports2.createLogger = require_create_logger();
    exports2.Logger = require_logger();
    exports2.ExceptionHandler = require_exception_handler();
    exports2.RejectionHandler = require_rejection_handler();
    exports2.Container = require_container();
    exports2.Transport = require_winston_transport();
    exports2.loggers = new exports2.Container();
    var defaultLogger = exports2.createLogger();
    Object.keys(exports2.config.npm.levels).concat([
      "log",
      "query",
      "stream",
      "add",
      "remove",
      "clear",
      "profile",
      "startTimer",
      "handleExceptions",
      "unhandleExceptions",
      "handleRejections",
      "unhandleRejections",
      "configure",
      "child"
    ]).forEach(
      (method) => exports2[method] = (...args) => defaultLogger[method](...args)
    );
    Object.defineProperty(exports2, "level", {
      get() {
        return defaultLogger.level;
      },
      set(val) {
        defaultLogger.level = val;
      }
    });
    Object.defineProperty(exports2, "exceptions", {
      get() {
        return defaultLogger.exceptions;
      }
    });
    Object.defineProperty(exports2, "rejections", {
      get() {
        return defaultLogger.rejections;
      }
    });
    ["exitOnError"].forEach((prop) => {
      Object.defineProperty(exports2, prop, {
        get() {
          return defaultLogger[prop];
        },
        set(val) {
          defaultLogger[prop] = val;
        }
      });
    });
    Object.defineProperty(exports2, "default", {
      get() {
        return {
          exceptionHandlers: defaultLogger.exceptionHandlers,
          rejectionHandlers: defaultLogger.rejectionHandlers,
          transports: defaultLogger.transports
        };
      }
    });
    warn.deprecated(exports2, "setLevels");
    warn.forFunctions(exports2, "useFormat", ["cli"]);
    warn.forProperties(exports2, "useFormat", ["padLevels", "stripColors"]);
    warn.forFunctions(exports2, "deprecated", [
      "addRewriter",
      "addFilter",
      "clone",
      "extend"
    ]);
    warn.forProperties(exports2, "deprecated", ["emitErrs", "levelLength"]);
  }
});

// src/common/logger.ts
var import_winston, import_path, combine, timestamp, printf, colorize, errors, json, logFormat, jsonFormat, Logger, ChildLogger, createLogger;
var init_logger = __esm({
  "src/common/logger.ts"() {
    import_winston = __toESM(require_winston());
    import_path = __toESM(require("path"));
    ({ combine, timestamp, printf, colorize, errors, json } = import_winston.default.format);
    logFormat = printf(({ level, message, timestamp: timestamp2, stack, ...metadata }) => {
      let log = `${timestamp2} [${level}]: ${message}`;
      if (Object.keys(metadata).length > 0) {
        log += ` ${JSON.stringify(metadata)}`;
      }
      if (stack) {
        log += `
${stack}`;
      }
      return log;
    });
    jsonFormat = printf(({ level, message, timestamp: timestamp2, ...metadata }) => {
      return JSON.stringify({
        timestamp: timestamp2,
        level,
        message,
        ...metadata
      });
    });
    Logger = class {
      constructor(context = "app") {
        this.context = context;
        this.logger = import_winston.default.createLogger({
          level: process.env.LOG_LEVEL || "info",
          defaultMeta: { context: this.context },
          transports: [
            new import_winston.default.transports.Console({
              format: combine(
                colorize({ all: true }),
                timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
                errors({ stack: true }),
                logFormat
              )
            }),
            new import_winston.default.transports.File({
              filename: import_path.default.join("logs", "error.log"),
              level: "error",
              format: combine(timestamp(), errors({ stack: true }), jsonFormat),
              maxsize: 10 * 1024 * 1024,
              maxFiles: 5
            }),
            new import_winston.default.transports.File({
              filename: import_path.default.join("logs", "combined.log"),
              format: combine(timestamp(), jsonFormat),
              maxsize: 10 * 1024 * 1024,
              maxFiles: 5
            })
          ]
        });
      }
      setContext(context) {
        this.context = context;
        this.logger.defaultMeta = { context: this.context };
      }
      debug(message, meta) {
        this.logger.debug(message, { context: this.context, ...meta });
      }
      info(message, meta) {
        this.logger.info(message, { context: this.context, ...meta });
      }
      warn(message, meta) {
        this.logger.warn(message, { context: this.context, ...meta });
      }
      error(message, meta) {
        if (message instanceof Error) {
          this.logger.error(message.message, {
            context: this.context,
            stack: message.stack,
            ...meta
          });
        } else {
          this.logger.error(message, { context: this.context, ...meta });
        }
      }
      child(metadata) {
        return new ChildLogger(this.logger, this.context, metadata);
      }
    };
    ChildLogger = class {
      constructor(logger, context, metadata) {
        this.logger = logger;
        this.context = context;
        this.metadata = metadata;
      }
      debug(message, meta) {
        this.logger.debug(message, { context: this.context, ...this.metadata, ...meta });
      }
      info(message, meta) {
        this.logger.info(message, { context: this.context, ...this.metadata, ...meta });
      }
      warn(message, meta) {
        this.logger.warn(message, { context: this.context, ...this.metadata, ...meta });
      }
      error(message, meta) {
        if (message instanceof Error) {
          this.logger.error(message.message, {
            context: this.context,
            stack: message.stack,
            ...this.metadata,
            ...meta
          });
        } else {
          this.logger.error(message, { context: this.context, ...this.metadata, ...meta });
        }
      }
    };
    createLogger = (context) => new Logger(context);
  }
});

// src/common/errors.ts
var AppError, ValidationError, NotFoundError, AlreadyExistsError, DatabaseError, KnowledgeProcessingError, RetrievalError, LearningError, SchedulingError, TimeoutError;
var init_errors = __esm({
  "src/common/errors.ts"() {
    AppError = class extends Error {
      constructor(code, message, statusCode = 500, details = {}, isOperational = true) {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        this.statusCode = statusCode;
        this.details = {
          code,
          message,
          ...details
        };
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
      }
      toJSON() {
        return {
          name: this.name,
          code: this.code,
          message: this.message,
          statusCode: this.statusCode,
          details: this.details,
          stack: process.env.NODE_ENV === "development" ? this.stack : void 0
        };
      }
    };
    ValidationError = class extends AppError {
      constructor(message, field, value) {
        super("VALIDATION_ERROR" /* VALIDATION_ERROR */, message, 400, { field, value });
      }
    };
    NotFoundError = class extends AppError {
      constructor(resource, identifier) {
        super("NOT_FOUND" /* NOT_FOUND */, `${resource} not found`, 404, {
          context: { resource, identifier }
        });
      }
    };
    AlreadyExistsError = class extends AppError {
      constructor(resource, identifier) {
        super("ALREADY_EXISTS" /* ALREADY_EXISTS */, `${resource} already exists`, 409, {
          context: { resource, identifier }
        });
      }
    };
    DatabaseError = class extends AppError {
      constructor(message, cause) {
        super("DATABASE_ERROR" /* DATABASE_ERROR */, message, 500, { cause }, true);
      }
    };
    KnowledgeProcessingError = class extends AppError {
      constructor(message, context, cause) {
        super("KNOWLEDGE_PROCESSING_ERROR" /* KNOWLEDGE_PROCESSING_ERROR */, message, 500, { context, cause });
      }
    };
    RetrievalError = class extends AppError {
      constructor(message, context, cause) {
        super("RETRIEVAL_ERROR" /* RETRIEVAL_ERROR */, message, 500, { context, cause });
      }
    };
    LearningError = class extends AppError {
      constructor(message, context, cause) {
        super("LEARNING_ERROR" /* LEARNING_ERROR */, message, 500, { context, cause });
      }
    };
    SchedulingError = class extends AppError {
      constructor(message, context, cause) {
        super("SCHEDULING_ERROR" /* SCHEDULING_ERROR */, message, 500, { context, cause });
      }
    };
    TimeoutError = class extends AppError {
      constructor(operation, timeout) {
        super("TIMEOUT_ERROR" /* TIMEOUT_ERROR */, `Operation '${operation}' timed out after ${timeout}ms`, 408, {
          context: { operation, timeout }
        });
      }
    };
  }
});

// node_modules/uuid/dist/esm-node/rng.js
function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    import_crypto.default.randomFillSync(rnds8Pool);
    poolPtr = 0;
  }
  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}
var import_crypto, rnds8Pool, poolPtr;
var init_rng = __esm({
  "node_modules/uuid/dist/esm-node/rng.js"() {
    import_crypto = __toESM(require("crypto"));
    rnds8Pool = new Uint8Array(256);
    poolPtr = rnds8Pool.length;
  }
});

// node_modules/uuid/dist/esm-node/stringify.js
function unsafeStringify(arr, offset = 0) {
  return byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]];
}
var byteToHex;
var init_stringify = __esm({
  "node_modules/uuid/dist/esm-node/stringify.js"() {
    byteToHex = [];
    for (let i = 0; i < 256; ++i) {
      byteToHex.push((i + 256).toString(16).slice(1));
    }
  }
});

// node_modules/uuid/dist/esm-node/native.js
var import_crypto2, native_default;
var init_native = __esm({
  "node_modules/uuid/dist/esm-node/native.js"() {
    import_crypto2 = __toESM(require("crypto"));
    native_default = {
      randomUUID: import_crypto2.default.randomUUID
    };
  }
});

// node_modules/uuid/dist/esm-node/v4.js
function v4(options, buf, offset) {
  if (native_default.randomUUID && !buf && !options) {
    return native_default.randomUUID();
  }
  options = options || {};
  const rnds = options.random || (options.rng || rng)();
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  if (buf) {
    offset = offset || 0;
    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }
    return buf;
  }
  return unsafeStringify(rnds);
}
var v4_default;
var init_v4 = __esm({
  "node_modules/uuid/dist/esm-node/v4.js"() {
    init_native();
    init_rng();
    init_stringify();
    v4_default = v4;
  }
});

// node_modules/uuid/dist/esm-node/index.js
var init_esm_node = __esm({
  "node_modules/uuid/dist/esm-node/index.js"() {
    init_v4();
  }
});

// src/common/utils.ts
function ok(data) {
  return { success: true, data };
}
function err(error) {
  return { success: false, error };
}
function isErr(result) {
  return result.success === false;
}
function paginate(items, total, params) {
  const totalPages = Math.ceil(total / params.pageSize);
  return {
    items,
    total,
    page: params.page,
    pageSize: params.pageSize,
    totalPages,
    hasNextPage: params.page < totalPages,
    hasPreviousPage: params.page > 1
  };
}
function generateId() {
  return v4_default();
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
var init_utils = __esm({
  "src/common/utils.ts"() {
    init_esm_node();
  }
});

// src/common/types.ts
var init_types = __esm({
  "src/common/types.ts"() {
  }
});

// src/core/database/KnowledgeRepository.ts
var import_better_sqlite3, fs, path2, DEFAULT_CONFIG2, BaseRepository, KnowledgeRepository, knowledgeRepository;
var init_KnowledgeRepository = __esm({
  "src/core/database/KnowledgeRepository.ts"() {
    init_logger();
    init_errors();
    init_types();
    init_utils();
    import_better_sqlite3 = __toESM(require("better-sqlite3"));
    fs = __toESM(require("fs"));
    path2 = __toESM(require("path"));
    DEFAULT_CONFIG2 = {
      path: "./data/skills.db",
      maxConnections: 10,
      timeoutMs: 5e3,
      enableWAL: true,
      enableCache: true,
      cacheSize: 1e3,
      enableEncryption: false
    };
    BaseRepository = class {
      constructor(config = {}) {
        this.logger = createLogger(this.constructor.name);
        this.cache = /* @__PURE__ */ new Map();
        this.initialized = false;
        this.config = { ...DEFAULT_CONFIG2, ...config };
      }
      getCached(id) {
        return this.cache.get(id) || null;
      }
      setCached(entity) {
        if (this.config.enableCache) {
          if (this.cache.size >= this.config.cacheSize) {
            const firstKey = this.cache.keys().next().value;
            if (firstKey) this.cache.delete(firstKey);
          }
          this.cache.set(entity.id, entity);
        }
      }
      invalidateCache(id) {
        this.cache.delete(id);
      }
      clearCache() {
        this.cache.clear();
      }
      getCacheStats() {
        return {
          size: this.cache.size,
          maxSize: this.config.cacheSize
        };
      }
    };
    KnowledgeRepository = class extends BaseRepository {
      constructor() {
        super(...arguments);
        this.entityIndex = /* @__PURE__ */ new Map();
        this.tagIndex = /* @__PURE__ */ new Map();
      }
      async initialize() {
        if (this.initialized) {
          return;
        }
        this.logger.info("Initializing KnowledgeRepository", { path: this.config.path });
        const dbDir = path2.dirname(this.config.path);
        if (!fs.existsSync(dbDir)) {
          fs.mkdirSync(dbDir, { recursive: true });
        }
        this.db = new import_better_sqlite3.default(this.config.path);
        this.db.pragma('encoding = "UTF-8"');
        this.db.pragma("journal_mode = WAL");
        this.db.pragma("foreign_keys = ON");
        this.createTables();
        this.loadFromDatabase();
        this.initialized = true;
        this.logger.info("KnowledgeRepository initialized successfully", { entries: this.cache.size });
      }
      createTables() {
        this.db.exec(`
      CREATE TABLE IF NOT EXISTS knowledge_entries (
        id TEXT PRIMARY KEY,
        content TEXT NOT NULL,
        type TEXT DEFAULT 'DOCUMENT',
        entities TEXT DEFAULT '[]',
        relations TEXT DEFAULT '[]',
        confidence REAL DEFAULT 1.0,
        source TEXT DEFAULT 'unknown',
        tags TEXT DEFAULT '[]',
        status TEXT DEFAULT 'ACTIVE',
        version INTEGER DEFAULT 1,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_knowledge_content ON knowledge_entries(content);
      CREATE INDEX IF NOT EXISTS idx_knowledge_status ON knowledge_entries(status);
      CREATE INDEX IF NOT EXISTS idx_knowledge_source ON knowledge_entries(source);
    `);
        this.logger.info("Database tables created");
      }
      loadFromDatabase() {
        const rows = this.db.prepare("SELECT * FROM knowledge_entries").all();
        for (const row of rows) {
          const entry = {
            id: row.id,
            content: row.content,
            type: row.type,
            entities: JSON.parse(row.entities || "[]"),
            relations: JSON.parse(row.relations || "[]"),
            confidence: row.confidence,
            source: row.source,
            tags: JSON.parse(row.tags || "[]"),
            status: row.status,
            version: row.version,
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at)
          };
          this.cache.set(entry.id, entry);
          this.updateIndexes(entry);
        }
        this.logger.info("Loaded entries from database", { count: rows.length });
      }
      async shutdown() {
        this.logger.info("Shutting down KnowledgeRepository");
        this.clearCache();
        this.entityIndex.clear();
        this.tagIndex.clear();
        if (this.db) {
          this.db.close();
        }
        this.initialized = false;
        this.logger.info("KnowledgeRepository shutdown complete");
      }
      rowToEntry(row) {
        return {
          id: row.id,
          content: row.content,
          type: row.type,
          entities: JSON.parse(row.entities || "[]"),
          relations: JSON.parse(row.relations || "[]"),
          confidence: row.confidence,
          source: row.source,
          tags: JSON.parse(row.tags || "[]"),
          status: row.status,
          version: row.version,
          createdAt: new Date(row.created_at),
          updatedAt: new Date(row.updated_at)
        };
      }
      async create(entityData) {
        await this.ensureInitialized();
        const existing = await this.findByContent(entityData.content);
        if (existing) {
          throw new AlreadyExistsError("KnowledgeEntry", entityData.content.substring(0, 50));
        }
        const now = /* @__PURE__ */ new Date();
        const entity = {
          ...entityData,
          id: generateId(),
          createdAt: now,
          updatedAt: now
        };
        const stmt = this.db.prepare(`
      INSERT INTO knowledge_entries (id, content, type, entities, relations, confidence, source, tags, status, version, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
        stmt.run(
          entity.id,
          entity.content,
          entity.type || "DOCUMENT",
          JSON.stringify(entity.entities || []),
          JSON.stringify(entity.relations || []),
          entity.confidence || 1,
          entity.source || "unknown",
          JSON.stringify(entity.tags || []),
          entity.status || "ACTIVE",
          entity.version || 1,
          entity.createdAt.toISOString(),
          entity.updatedAt.toISOString()
        );
        this.updateIndexes(entity);
        this.setCached(entity);
        this.logger.debug("Created knowledge entry", { id: entity.id });
        return entity;
      }
      async findById(id) {
        await this.ensureInitialized();
        const cached = this.getCached(id);
        if (cached) {
          return cached;
        }
        const row = this.db.prepare("SELECT * FROM knowledge_entries WHERE id = ?").get(id);
        if (!row) {
          return null;
        }
        const entry = this.rowToEntry(row);
        this.setCached(entry);
        return entry;
      }
      async update(id, updateData) {
        await this.ensureInitialized();
        const existing = await this.findById(id);
        if (!existing) {
          throw new NotFoundError("KnowledgeEntry", id);
        }
        const updated = {
          ...existing,
          ...updateData,
          id: existing.id,
          createdAt: existing.createdAt,
          updatedAt: /* @__PURE__ */ new Date(),
          version: existing.version + 1
        };
        const stmt = this.db.prepare(`
      UPDATE knowledge_entries 
      SET content = ?, type = ?, entities = ?, relations = ?, confidence = ?, source = ?, tags = ?, status = ?, version = ?, updated_at = ?
      WHERE id = ?
    `);
        stmt.run(
          updated.content,
          updated.type,
          JSON.stringify(updated.entities || []),
          JSON.stringify(updated.relations || []),
          updated.confidence,
          updated.source,
          JSON.stringify(updated.tags || []),
          updated.status,
          updated.version,
          updated.updatedAt.toISOString(),
          id
        );
        this.rebuildIndexes();
        this.setCached(updated);
        this.logger.debug("Updated knowledge entry", { id });
        return updated;
      }
      async delete(id) {
        await this.ensureInitialized();
        const existing = await this.findById(id);
        if (!existing) {
          return false;
        }
        this.db.prepare("DELETE FROM knowledge_entries WHERE id = ?").run(id);
        this.invalidateCache(id);
        this.rebuildIndexes();
        this.logger.debug("Deleted knowledge entry", { id });
        return true;
      }
      async findAll(pagination) {
        await this.ensureInitialized();
        const entries = Array.from(this.cache.values());
        const total = entries.length;
        if (!pagination) {
          return {
            items: entries,
            total,
            page: 1,
            pageSize: total,
            totalPages: 1,
            hasNextPage: false,
            hasPreviousPage: false
          };
        }
        const sorted = entries.sort(
          (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
        );
        return paginate(sorted, total, pagination);
      }
      async findByContent(content) {
        await this.ensureInitialized();
        const normalizedContent = content.toLowerCase().trim();
        for (const entry of this.cache.values()) {
          if (entry.content.toLowerCase().trim() === normalizedContent) {
            return entry;
          }
        }
        return null;
      }
      async findByEntityType(entityType) {
        await this.ensureInitialized();
        const entryIds = this.entityIndex.get(entityType);
        if (!entryIds) {
          return [];
        }
        const entries = [];
        for (const id of entryIds) {
          const entry = await this.findById(id);
          if (entry) {
            entries.push(entry);
          }
        }
        return entries;
      }
      async findByTag(tag) {
        await this.ensureInitialized();
        const entryIds = this.tagIndex.get(tag.toLowerCase());
        if (!entryIds) {
          return [];
        }
        const entries = [];
        for (const id of entryIds) {
          const entry = await this.findById(id);
          if (entry) {
            entries.push(entry);
          }
        }
        return entries;
      }
      async findByStatus(status) {
        await this.ensureInitialized();
        const entries = [];
        for (const entry of this.cache.values()) {
          if (entry.status === status) {
            entries.push(entry);
          }
        }
        return entries;
      }
      async searchByContent(query, limit = 10) {
        await this.ensureInitialized();
        const normalizedQuery = query.toLowerCase().trim();
        const results = [];
        for (const entry of this.cache.values()) {
          const content = entry.content.toLowerCase();
          const score = this.calculateRelevanceScore(content, normalizedQuery);
          if (score > 0.01) {
            results.push({ entry, score });
          }
        }
        results.sort((a, b) => b.score - a.score);
        return results.slice(0, limit).map((r) => r.entry);
      }
      calculateRelevanceScore(content, query) {
        const queryTerms = query.split(/[\s,，、.。]+/).filter((t) => t.length > 0);
        let score = 0;
        const isChinese = /[\u4e00-\u9fa5]/.test(query);
        for (const term of queryTerms) {
          if (content.includes(term)) {
            score += 0.5;
          }
          const regex = new RegExp(this.escapeRegex(term), "gi");
          const matches = content.match(regex);
          if (matches) {
            score += matches.length * 0.1;
          }
        }
        if (isChinese) {
          const contentChinese = content.replace(/[^\u4e00-\u9fa5]/g, "");
          const queryChinese = query.replace(/[^\u4e00-\u9fa5]/g, "");
          if (contentChinese.includes(queryChinese)) {
            score += 0.8;
          }
          for (const char of queryChinese) {
            if (contentChinese.includes(char)) {
              score += 0.05;
            }
          }
        }
        return Math.min(score, 1);
      }
      escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
      async count() {
        await this.ensureInitialized();
        return this.cache.size;
      }
      async countByStatus() {
        await this.ensureInitialized();
        const counts = {
          ["ACTIVE" /* ACTIVE */]: 0,
          ["INACTIVE" /* INACTIVE */]: 0,
          ["DELETED" /* DELETED */]: 0,
          ["PENDING" /* PENDING */]: 0
        };
        for (const entry of this.cache.values()) {
          counts[entry.status]++;
        }
        return counts;
      }
      updateIndexes(entity) {
        for (const entity2 of entity.entities || []) {
          const ids = this.entityIndex.get(entity2.type) || /* @__PURE__ */ new Set();
          ids.add(entity.id);
          this.entityIndex.set(entity2.type, ids);
        }
        for (const tag of entity.tags || []) {
          const normalizedTag = tag.toLowerCase();
          const ids = this.tagIndex.get(normalizedTag) || /* @__PURE__ */ new Set();
          ids.add(entity.id);
          this.tagIndex.set(normalizedTag, ids);
        }
      }
      rebuildIndexes() {
        this.entityIndex.clear();
        this.tagIndex.clear();
        for (const entity of this.cache.values()) {
          this.updateIndexes(entity);
        }
      }
      async ensureInitialized() {
        if (!this.initialized) {
          throw new DatabaseError("Repository not initialized. Call initialize() first.");
        }
      }
      async bulkCreate(entries) {
        await this.ensureInitialized();
        const created = [];
        const errors2 = [];
        for (const entryData of entries) {
          try {
            const createdEntry = await this.create(entryData);
            created.push(createdEntry);
          } catch (error) {
            errors2.push(error);
          }
        }
        this.logger.info("Bulk created knowledge entries", {
          total: entries.length,
          succeeded: created.length,
          failed: errors2.length
        });
        return created;
      }
      async deleteAll() {
        await this.ensureInitialized();
        const count = this.cache.size;
        this.db.prepare("DELETE FROM knowledge_entries").run();
        this.clearCache();
        this.rebuildIndexes();
        this.logger.info("Deleted all knowledge entries", { count });
        return count;
      }
    };
    knowledgeRepository = new KnowledgeRepository();
  }
});

// src/core/database/VectorStore.ts
var VectorStore, vectorStore;
var init_VectorStore = __esm({
  "src/core/database/VectorStore.ts"() {
    init_logger();
    init_errors();
    init_utils();
    VectorStore = class {
      constructor() {
        this.logger = createLogger("VectorStore");
        this.vectors = /* @__PURE__ */ new Map();
        this.dimension = 1536;
        this.initialized = false;
        this.indexReady = false;
      }
      async initialize(dimension = 1536) {
        if (this.initialized) {
          this.logger.warn("VectorStore already initialized");
          return;
        }
        this.logger.info("Initializing VectorStore", { dimension });
        this.dimension = dimension;
        this.initialized = true;
        this.indexReady = false;
        this.logger.info("VectorStore initialized successfully");
      }
      async shutdown() {
        this.logger.info("Shutting down VectorStore");
        this.vectors.clear();
        this.initialized = false;
        this.indexReady = false;
      }
      async add(vector) {
        this.ensureInitialized();
        const values = vector.values;
        if (values.length !== this.dimension) {
          throw new ValidationError(
            `Vector dimension mismatch. Expected ${this.dimension}, got ${values.length}`
          );
        }
        const normalizedValues = this.normalize(values);
        const fullVector = {
          ...vector,
          id: generateId(),
          values: normalizedValues,
          dimension: this.dimension,
          createdAt: /* @__PURE__ */ new Date()
        };
        this.vectors.set(fullVector.id, fullVector);
        this.indexReady = false;
        this.logger.debug("Added vector", { id: fullVector.id, dimension: this.dimension });
        return fullVector;
      }
      async addBatch(vectors) {
        this.ensureInitialized();
        const added = [];
        for (const vec of vectors) {
          try {
            const addedVector = await this.add(vec);
            added.push(addedVector);
          } catch (error) {
            this.logger.error(error);
          }
        }
        this.logger.info("Batch added vectors", { requested: vectors.length, succeeded: added.length });
        return added;
      }
      async search(query, limit = 10, filter) {
        this.ensureInitialized();
        if (query.length !== this.dimension) {
          throw new ValidationError(
            `Query dimension mismatch. Expected ${this.dimension}, got ${query.length}`
          );
        }
        const normalizedQuery = this.normalize(query);
        const results = [];
        for (const vector of this.vectors.values()) {
          if (filter && !this.matchesFilter(vector, filter)) {
            continue;
          }
          const score = this.cosineSimilarity(normalizedQuery, vector.values);
          results.push({
            id: vector.id,
            score,
            vector
          });
        }
        results.sort((a, b) => b.score - a.score);
        const topResults = results.slice(0, limit);
        this.logger.debug("Vector search completed", {
          totalVectors: this.vectors.size,
          returned: topResults.length,
          topScore: topResults[0]?.score ?? 0
        });
        return topResults;
      }
      async findById(id) {
        this.ensureInitialized();
        return this.vectors.get(id) || null;
      }
      async delete(id) {
        this.ensureInitialized();
        const deleted = this.vectors.delete(id);
        if (deleted) {
          this.indexReady = false;
        }
        return deleted;
      }
      async update(id, metadata) {
        this.ensureInitialized();
        const vector = this.vectors.get(id);
        if (!vector) {
          return null;
        }
        const updated = {
          ...vector,
          metadata: { ...vector.metadata, ...metadata }
        };
        this.vectors.set(id, updated);
        return updated;
      }
      async count() {
        this.ensureInitialized();
        return this.vectors.size;
      }
      getStats() {
        this.ensureInitialized();
        let totalBytes = 0;
        for (const vector of this.vectors.values()) {
          totalBytes += vector.values.length * 8;
        }
        return {
          totalVectors: this.vectors.size,
          dimension: this.dimension,
          indexSizeBytes: totalBytes,
          lastUpdated: /* @__PURE__ */ new Date()
        };
      }
      normalize(vector) {
        const magnitude = Math.sqrt(
          vector.reduce((sum, val) => sum + val * val, 0)
        );
        if (magnitude === 0) {
          return vector;
        }
        return vector.map((val) => val / magnitude);
      }
      cosineSimilarity(a, b) {
        let dotProduct = 0;
        let magnitudeA = 0;
        let magnitudeB = 0;
        for (let i = 0; i < a.length; i++) {
          dotProduct += a[i] * b[i];
          magnitudeA += a[i] * a[i];
          magnitudeB += b[i] * b[i];
        }
        magnitudeA = Math.sqrt(magnitudeA);
        magnitudeB = Math.sqrt(magnitudeB);
        if (magnitudeA === 0 || magnitudeB === 0) {
          return 0;
        }
        return dotProduct / (magnitudeA * magnitudeB);
      }
      matchesFilter(vector, filter) {
        if (!vector.metadata) {
          return false;
        }
        for (const [key, value] of Object.entries(filter)) {
          if (vector.metadata[key] !== value) {
            return false;
          }
        }
        return true;
      }
      ensureInitialized() {
        if (!this.initialized) {
          throw new DatabaseError("VectorStore not initialized. Call initialize() first.");
        }
      }
      async clear() {
        this.ensureInitialized();
        this.vectors.clear();
        this.indexReady = false;
        this.logger.info("VectorStore cleared");
      }
      async getAllIds() {
        this.ensureInitialized();
        return Array.from(this.vectors.keys());
      }
      async getVectorsByMetadata(metadata, limit) {
        this.ensureInitialized();
        const results = [];
        for (const vector of this.vectors.values()) {
          if (this.matchesFilter(vector, metadata)) {
            results.push(vector);
            if (limit && results.length >= limit) {
              break;
            }
          }
        }
        return results;
      }
    };
    vectorStore = new VectorStore();
  }
});

// src/core/retrieval/RetrievalService.ts
var RetrievalStrategy, DEFAULT_CONFIG3, RetrievalService, retrievalService;
var init_RetrievalService = __esm({
  "src/core/retrieval/RetrievalService.ts"() {
    init_logger();
    init_errors();
    init_types();
    init_utils();
    init_KnowledgeRepository();
    RetrievalStrategy = /* @__PURE__ */ ((RetrievalStrategy2) => {
      RetrievalStrategy2["SPARSE"] = "SPARSE";
      RetrievalStrategy2["DENSE"] = "DENSE";
      RetrievalStrategy2["HYBRID"] = "HYBRID";
      RetrievalStrategy2["GRAPH"] = "GRAPH";
      return RetrievalStrategy2;
    })(RetrievalStrategy || {});
    DEFAULT_CONFIG3 = {
      defaultStrategy: "HYBRID" /* HYBRID */,
      hybridAlpha: 0.5,
      maxResults: 10,
      minScore: 0.5,
      enableReranking: true,
      rerankTopK: 20,
      enableCache: true,
      cacheSize: 1e3,
      timeoutMs: 5e3
    };
    RetrievalService = class {
      constructor(config = {}, knowledgeRepo, vectorStoreInstance) {
        this.logger = createLogger("RetrievalService");
        this.cache = /* @__PURE__ */ new Map();
        this.queryCount = 0;
        this.cacheHitCount = 0;
        this.config = { ...DEFAULT_CONFIG3, ...config };
        this.knowledgeRepo = knowledgeRepo || knowledgeRepository;
        this.vectorStore = vectorStoreInstance || (init_retrieval(), __toCommonJS(retrieval_exports)).retrievalVectorStore;
        this.logger.info("RetrievalService initialized", { config: this.config });
      }
      async retrieve(context) {
        const startTime = Date.now();
        this.queryCount++;
        try {
          this.logger.debug("Starting retrieval", { query: context.query, strategy: this.config.defaultStrategy, useVector: context.useVector });
          if (this.config.enableCache) {
            const cacheKey = this.computeCacheKey(context);
            const cached = this.cache.get(cacheKey);
            if (cached) {
              this.cacheHitCount++;
              this.logger.debug("Cache hit", { cacheKey });
              return ok(cached);
            }
          }
          let results;
          const strategy = context.useVector === false ? "SPARSE" /* SPARSE */ : this.config.defaultStrategy;
          switch (strategy) {
            case "SPARSE" /* SPARSE */:
              results = await this.sparseRetrieval(context);
              break;
            case "DENSE" /* DENSE */:
              results = await this.denseRetrieval(context);
              break;
            case "HYBRID" /* HYBRID */:
              results = await this.hybridRetrieval(context);
              break;
            case "GRAPH" /* GRAPH */:
              results = await this.graphRetrieval(context);
              break;
            default:
              results = await this.hybridRetrieval(context);
          }
          if (context.filters && context.filters.length > 0) {
            results = this.applyFilters(results, context.filters);
          }
          if (context.rerank !== false && this.config.enableReranking) {
            results = await this.rerankResults(results, context.query);
          }
          results = results.slice(0, context.limit || this.config.maxResults);
          results = results.filter((r) => r.score >= this.config.minScore);
          for (const result of results) {
            result.explanation = this.generateExplanation(result, context.query);
          }
          if (this.config.enableCache) {
            const cacheKey = this.computeCacheKey(context);
            if (this.cache.size >= this.config.cacheSize) {
              const firstKey = this.cache.keys().next().value;
              if (firstKey) this.cache.delete(firstKey);
            }
            this.cache.set(cacheKey, results);
          }
          const duration = Date.now() - startTime;
          this.logger.info("Retrieval completed", {
            queryLength: context.query.length,
            resultCount: results.length,
            duration,
            cacheHitRate: this.getCacheHitRate()
          });
          return ok(results);
        } catch (error) {
          const errMsg = error instanceof Error ? error.message : "Unknown retrieval error";
          this.logger.error("Retrieval failed", error);
          return err(new RetrievalError(errMsg));
        }
      }
      async sparseRetrieval(context) {
        const entries = await this.knowledgeRepo.searchByContent(
          context.query,
          context.limit || this.config.maxResults
        );
        const results = [];
        for (const entry of entries) {
          const score = this.calculateBM25Score(entry.content, context.query);
          results.push({
            id: entry.id,
            content: entry.content,
            score,
            metadata: {
              type: entry.type,
              tags: entry.tags,
              source: entry.source
            }
          });
        }
        return results.sort((a, b) => b.score - a.score);
      }
      async denseRetrieval(context) {
        const queryVector = await this.embedText(context.query);
        const searchResults = await this.vectorStore.search(
          queryVector,
          context.limit || this.config.rerankTopK,
          context.filters?.length ? this.filtersToMetadata(context.filters) : void 0
        );
        const results = [];
        for (const sr of searchResults) {
          const entry = await this.knowledgeRepo.findById(sr.id);
          if (entry) {
            results.push({
              id: entry.id,
              content: entry.content,
              score: sr.score,
              metadata: {
                type: entry.type,
                tags: entry.tags,
                source: entry.source
              }
            });
          }
        }
        return results;
      }
      async hybridRetrieval(context) {
        const [sparseResults, denseResults] = await Promise.all([
          this.sparseRetrieval(context),
          this.denseRetrieval(context)
        ]);
        const scoreMap = /* @__PURE__ */ new Map();
        for (const result of sparseResults) {
          const normalizedScore = this.normalizeScore(result.score, "SPARSE" /* SPARSE */);
          scoreMap.set(result.id, {
            content: result.content,
            score: normalizedScore * this.config.hybridAlpha,
            metadata: result.metadata || {}
          });
        }
        for (const result of denseResults) {
          const normalizedScore = this.normalizeScore(result.score, "DENSE" /* DENSE */);
          const existing = scoreMap.get(result.id);
          if (existing) {
            existing.score += normalizedScore * (1 - this.config.hybridAlpha);
          } else {
            scoreMap.set(result.id, {
              content: result.content,
              score: normalizedScore * (1 - this.config.hybridAlpha),
              metadata: result.metadata || {}
            });
          }
        }
        const results = [];
        for (const [id, data] of scoreMap) {
          results.push({
            id,
            content: data.content,
            score: data.score,
            metadata: data.metadata
          });
        }
        return results.sort((a, b) => b.score - a.score);
      }
      async graphRetrieval(context) {
        const sparseResults = await this.sparseRetrieval(context);
        const topEntities = sparseResults.slice(0, 5);
        const results = [...sparseResults];
        for (const entity of topEntities) {
          const relatedResults = await this.findRelatedContent(entity.id);
          for (const related of relatedResults) {
            if (!results.find((r) => r.id === related.id)) {
              results.push(related);
            }
          }
        }
        return results.sort((a, b) => b.score - a.score);
      }
      async findRelatedContent(entityId) {
        const entry = await this.knowledgeRepo.findById(entityId);
        if (!entry) {
          return [];
        }
        const relatedEntries = await this.knowledgeRepo.findByEntityType(entry.entities[0]?.type || "UNKNOWN");
        return relatedEntries.filter((e) => e.id !== entityId).slice(0, 5).map((e) => ({
          id: e.id,
          content: e.content,
          score: 0.6,
          metadata: {
            type: e.type,
            tags: e.tags,
            source: e.source,
            relatedTo: entityId
          }
        }));
      }
      async rerankResults(results, query) {
        const scored = results.map((result) => ({
          result,
          crossScore: this.calculateCrossEncoderScore(result.content, query)
        }));
        scored.sort((a, b) => b.crossScore - a.crossScore);
        return scored.slice(0, this.config.rerankTopK).map((s) => s.result);
      }
      calculateCrossEncoderScore(content, query) {
        const contentLower = content.toLowerCase();
        const queryTerms = query.toLowerCase().split(/\s+/);
        let matchCount = 0;
        let positionBonus = 0;
        for (let i = 0; i < queryTerms.length; i++) {
          const term = queryTerms[i];
          const index = contentLower.indexOf(term);
          if (index !== -1) {
            matchCount++;
            positionBonus += 1 / (index + 1);
          }
        }
        const coverage = matchCount / queryTerms.length;
        const avgPosition = positionBonus / (matchCount || 1);
        return coverage * 0.7 + Math.min(avgPosition, 0.3) * 0.3;
      }
      calculateBM25Score(content, query) {
        const contentLower = content.toLowerCase();
        const queryTerms = query.toLowerCase().split(/\s+/);
        const k1 = 1.5;
        const b = 0.75;
        const contentLength = contentLower.split(/\s+/).length;
        const avgContentLength = contentLength;
        let score = 0;
        for (const term of queryTerms) {
          const regex = new RegExp(term, "gi");
          const tf = (contentLower.match(regex) || []).length;
          if (tf > 0) {
            const idf = Math.log((1e3 + 1) / (tf + 1));
            const tfComponent = tf * (k1 + 1) / (tf + k1 * (1 - b + b * (contentLength / avgContentLength)));
            score += idf * tfComponent;
          }
        }
        return Math.min(score / queryTerms.length, 1);
      }
      normalizeScore(score, strategy) {
        switch (strategy) {
          case "SPARSE" /* SPARSE */:
            return Math.min(score / 10, 1);
          case "DENSE" /* DENSE */:
            return (score + 1) / 2;
          case "HYBRID" /* HYBRID */:
            return Math.min(score, 1);
          default:
            return score;
        }
      }
      applyFilters(results, filters) {
        return results.filter((result) => {
          for (const filter of filters) {
            if (!this.matchesFilter(result, filter)) {
              return false;
            }
          }
          return true;
        });
      }
      matchesFilter(result, filter) {
        const value = this.getNestedValue(result, filter.field);
        switch (filter.operator) {
          case "eq" /* EQ */:
            return value === filter.value;
          case "ne" /* NE */:
            return value !== filter.value;
          case "gt" /* GT */:
            return typeof value === "number" && value > filter.value;
          case "gte" /* GTE */:
            return typeof value === "number" && value >= filter.value;
          case "lt" /* LT */:
            return typeof value === "number" && value < filter.value;
          case "lte" /* LTE */:
            return typeof value === "number" && value <= filter.value;
          case "in" /* IN */:
            return Array.isArray(filter.value) && filter.value.includes(value);
          case "not_in" /* NOT_IN */:
            return Array.isArray(filter.value) && !filter.value.includes(value);
          case "contains" /* CONTAINS */:
            return typeof value === "string" && value.includes(filter.value);
          case "not_contains" /* NOT_CONTAINS */:
            return typeof value === "string" && !value.includes(filter.value);
          case "between" /* BETWEEN */:
            if (Array.isArray(filter.value) && filter.value.length === 2) {
              return typeof value === "number" && value >= filter.value[0] && value <= filter.value[1];
            }
            return false;
          default:
            return true;
        }
      }
      getNestedValue(obj, path3) {
        const keys = path3.split(".");
        let value = obj;
        for (const key of keys) {
          if (value && typeof value === "object" && key in value) {
            value = value[key];
          } else {
            return void 0;
          }
        }
        return value;
      }
      filtersToMetadata(filters) {
        const metadata = {};
        for (const filter of filters) {
          if (filter.field.startsWith("metadata.")) {
            const key = filter.field.replace("metadata.", "");
            metadata[key] = filter.value;
          }
        }
        return metadata;
      }
      generateExplanation(result, query) {
        const queryTerms = query.toLowerCase().split(/\s+/);
        const contentLower = result.content.toLowerCase();
        const matchedTerms = queryTerms.filter((term) => contentLower.includes(term));
        return `Matched ${matchedTerms.length}/${queryTerms.length} query terms with score ${result.score.toFixed(3)}. Content relevance: ${result.score > 0.8 ? "High" : result.score > 0.5 ? "Medium" : "Low"}.`;
      }
      async embedText(text) {
        const embedding = new Array(this.getEmbeddingDimension()).fill(0);
        const words = text.toLowerCase().split(/\s+/);
        for (let i = 0; i < words.length; i++) {
          const word = words[i];
          for (let j = 0; j < word.length; j++) {
            const charCode = word.charCodeAt(j);
            const index = (charCode + i + j) % this.getEmbeddingDimension();
            embedding[index] += Math.sin(charCode * (j + 1)) * 0.1;
          }
        }
        const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
        if (magnitude > 0) {
          for (let i = 0; i < embedding.length; i++) {
            embedding[i] /= magnitude;
          }
        }
        return embedding;
      }
      getEmbeddingDimension() {
        return 1536;
      }
      computeCacheKey(context) {
        const filtersStr = context.filters ? JSON.stringify(context.filters.sort((a, b) => a.field.localeCompare(b.field))) : "";
        return `${context.query}:${context.limit}:${filtersStr}`;
      }
      getCacheHitRate() {
        if (this.queryCount === 0) return 0;
        return Math.round(this.cacheHitCount / this.queryCount * 100) / 100;
      }
      getStatistics() {
        return {
          totalQueries: this.queryCount,
          cacheHitRate: this.getCacheHitRate(),
          cacheSize: this.cache.size,
          config: this.config
        };
      }
      clearCache() {
        this.cache.clear();
        this.logger.info("Retrieval cache cleared");
      }
      updateConfig(config) {
        this.config = { ...this.config, ...config };
        this.logger.info("Retrieval config updated", { config: this.config });
      }
    };
    retrievalService = new RetrievalService();
  }
});

// src/core/retrieval/index.ts
var retrieval_exports = {};
__export(retrieval_exports, {
  RetrievalService: () => RetrievalService,
  RetrievalStrategy: () => RetrievalStrategy,
  retrievalService: () => retrievalService2,
  retrievalVectorStore: () => retrievalVectorStore
});
var retrievalVectorStore, retrievalService2;
var init_retrieval = __esm({
  "src/core/retrieval/index.ts"() {
    init_RetrievalService();
    init_types();
    init_RetrievalService();
    init_KnowledgeRepository();
    init_VectorStore();
    knowledgeRepository.initialize().catch(console.error);
    retrievalVectorStore = new VectorStore();
    retrievalVectorStore.initialize(1536).catch(console.error);
    retrievalService2 = new RetrievalService(
      {
        defaultStrategy: "HYBRID",
        hybridAlpha: 0.5,
        maxResults: 10,
        minScore: 0.01,
        // 降低阈值
        enableReranking: false,
        // 禁用 reranking 简化调试
        rerankTopK: 20,
        enableCache: true,
        cacheSize: 1e3,
        timeoutMs: 5e3
      },
      knowledgeRepository,
      retrievalVectorStore
    );
  }
});

// src/api/SkillsController.ts
var SkillsController_exports = {};
__export(SkillsController_exports, {
  default: () => SkillsController_default,
  skillsController: () => skillsController
});
module.exports = __toCommonJS(SkillsController_exports);

// src/api/BaseController.ts
init_logger();
init_errors();
function successResponse(data, meta) {
  return {
    success: true,
    data,
    meta: {
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: generateRequestId(),
      ...meta
    }
  };
}
function errorResponse(error) {
  const apiError = {
    code: error instanceof AppError ? error.code : "UNKNOWN_ERROR" /* UNKNOWN_ERROR */,
    message: error.message
  };
  if (process.env.NODE_ENV === "development") {
    apiError.stack = error.stack;
  }
  if (error instanceof AppError && error.details) {
    apiError.details = error.details;
  }
  return {
    success: false,
    error: apiError,
    meta: {
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: generateRequestId()
    }
  };
}
function generateRequestId() {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}
var BaseController = class {
  constructor() {
    this.logger = createLogger(this.constructor.name);
  }
  handleError(error) {
    this.logger.error("Controller error", { error });
    return errorResponse(error);
  }
  validateRequired(params, required) {
    for (const field of required) {
      if (params[field] === void 0 || params[field] === null) {
        throw new AppError(
          "VALIDATION_ERROR" /* VALIDATION_ERROR */,
          `Missing required field: ${field}`,
          400,
          { field }
        );
      }
    }
  }
};

// src/core/data_input/DataInputService.ts
init_logger();
init_errors();
init_utils();
var DEFAULT_CONFIG = {
  maxFileSizeMB: 100,
  maxConcurrentProcessing: 5,
  supportedFormats: [
    "json" /* JSON */,
    "text" /* TEXT */,
    "markdown" /* MARKDOWN */,
    "html" /* HTML */,
    "csv" /* CSV */,
    "xml" /* XML */
  ],
  enableValidation: true,
  enablePreprocessing: true,
  enableDeduplication: true,
  timeoutMs: 3e4
};
var DataValidationError = class extends ValidationError {
  constructor(message, errors2) {
    super(message);
    this.errors = errors2;
  }
};
var DataProcessingError = class extends Error {
  constructor(message, code, context) {
    super(message);
    this.code = code;
    this.context = context;
    this.name = "DataProcessingError";
  }
};
var DataInputService = class {
  constructor(config = {}) {
    this.logger = createLogger("DataInputService");
    this.validationRules = /* @__PURE__ */ new Map();
    this.processedDataCache = /* @__PURE__ */ new Map();
    this.dataHashIndex = /* @__PURE__ */ new Map();
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.initializeDefaultValidationRules();
    this.logger.info("DataInputService initialized", { config: this.config });
  }
  initializeDefaultValidationRules() {
    this.validationRules.set("json" /* JSON */, [
      { field: "content", type: "required", message: "Content is required" },
      { field: "content", type: "type", params: { expectedType: "string" }, message: "Content must be a string" }
    ]);
    this.validationRules.set("text" /* TEXT */, [
      { field: "content", type: "required", message: "Content is required" },
      { field: "content", type: "range", params: { minLength: 1, maxLength: 10 * 1024 * 1024 }, message: "Content length out of range" }
    ]);
    this.validationRules.set("csv" /* CSV */, [
      { field: "content", type: "required", message: "Content is required" },
      { field: "content", type: "pattern", params: { pattern: /^.+\n.+/ }, message: "CSV must have at least header and one row" }
    ]);
  }
  async process(rawData) {
    const startTime = Date.now();
    this.logger.debug("Starting data processing", { dataId: rawData.id, format: rawData.format });
    try {
      if (this.config.enableValidation) {
        const validationResult = await this.validate(rawData);
        if (!validationResult.success) {
          return err(validationResult.error);
        }
      }
      if (this.config.enableDeduplication) {
        const dedupResult = await this.checkDeduplication(rawData);
        if (dedupResult.success && dedupResult.data.isDuplicate) {
          this.logger.warn("Duplicate data detected", { dataId: rawData.id, originalId: dedupResult.data.originalId });
          return err(new DataProcessingError(
            "Duplicate data detected",
            "DUPLICATE_DATA",
            { originalId: dedupResult.data.originalId }
          ));
        }
      }
      const normalized = await this.normalize(rawData);
      const extracted = await this.extractFields(normalized);
      const quality = await this.assessQuality(normalized, extracted);
      const processed = {
        id: this.generateProcessedDataId(),
        rawDataId: rawData.id,
        normalizedContent: normalized,
        extractedFields: extracted,
        format: rawData.format,
        quality,
        processingDuration: Date.now() - startTime,
        processedAt: /* @__PURE__ */ new Date(),
        warnings: []
      };
      this.cacheProcessedData(processed);
      this.logger.info("Data processed successfully", {
        dataId: rawData.id,
        processedId: processed.id,
        duration: processed.processingDuration,
        quality: processed.quality.score
      });
      return ok(processed);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Unknown error";
      this.logger.error("Data processing failed", error, { dataId: rawData.id });
      return err(new DataProcessingError(errMsg, "PROCESSING_ERROR", { dataId: rawData.id }));
    }
  }
  async validate(rawData) {
    const rules = this.validationRules.get(rawData.format);
    if (!rules || rules.length === 0) {
      return ok(true);
    }
    const errors2 = [];
    const content = typeof rawData.content === "string" ? rawData.content : rawData.content.toString("utf-8");
    for (const rule of rules) {
      const error = this.applyValidationRule(rule, content, rawData.metadata);
      if (error) {
        errors2.push(error);
      }
    }
    if (errors2.length > 0) {
      return err(new DataValidationError("Validation failed", errors2));
    }
    return ok(true);
  }
  applyValidationRule(rule, content, metadata) {
    const value = rule.field === "content" ? content : metadata[rule.field];
    switch (rule.type) {
      case "required":
        if (value === void 0 || value === null || value === "") {
          return { field: rule.field, message: rule.message };
        }
        break;
      case "type":
        const expectedType = rule.params?.expectedType;
        if (typeof value !== expectedType) {
          return { field: rule.field, message: rule.message };
        }
        break;
      case "range":
        const minLength = rule.params?.minLength;
        const maxLength = rule.params?.maxLength;
        if (typeof value === "string") {
          if (minLength !== void 0 && value.length < minLength) {
            return { field: rule.field, message: rule.message };
          }
          if (maxLength !== void 0 && value.length > maxLength) {
            return { field: rule.field, message: rule.message };
          }
        }
        break;
      case "pattern":
        const pattern = rule.params?.pattern;
        if (pattern && typeof value === "string" && !pattern.test(value)) {
          return { field: rule.field, message: rule.message };
        }
        break;
    }
    return null;
  }
  async checkDeduplication(rawData) {
    const hash = this.computeDataHash(rawData);
    const existingId = this.dataHashIndex.get(hash);
    if (existingId) {
      return ok({ isDuplicate: true, originalId: existingId });
    }
    this.dataHashIndex.set(hash, rawData.id);
    return ok({ isDuplicate: false });
  }
  computeDataHash(rawData) {
    const content = typeof rawData.content === "string" ? rawData.content : rawData.content.toString("utf-8");
    const hash = require("crypto").createHash("sha256").update(content + rawData.source + (rawData.sourceId || "")).digest("hex");
    return hash;
  }
  async normalize(rawData) {
    let content = typeof rawData.content === "string" ? rawData.content : rawData.content.toString("utf-8");
    switch (rawData.format) {
      case "html" /* HTML */:
        content = this.stripHtmlTags(content);
        break;
      case "markdown" /* MARKDOWN */:
        content = this.normalizeMarkdown(content);
        break;
      case "xml" /* XML */:
        content = this.normalizeXml(content);
        break;
      case "csv" /* CSV */:
        content = this.normalizeCsv(content);
        break;
    }
    content = this.normalizeWhitespace(content);
    return content.trim();
  }
  stripHtmlTags(html) {
    return html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "").replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"');
  }
  normalizeMarkdown(md) {
    return md.replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/[#*_~`]/g, " ").replace(/```[\s\S]*?```/g, "").replace(/`[^`]+`/g, "");
  }
  normalizeXml(xml) {
    return xml.replace(/<\?[^>]+\?>/g, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  }
  normalizeCsv(csv) {
    const lines = csv.split("\n");
    const headers = lines[0]?.split(",").map((h) => h.trim()) || [];
    const result = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim());
      const obj = {};
      headers.forEach((h, idx) => {
        obj[h] = values[idx] || "";
      });
      result.push(JSON.stringify(obj));
    }
    return result.join("\n");
  }
  normalizeWhitespace(text) {
    return text.replace(/\s+/g, " ");
  }
  async extractFields(data) {
    const fields = {
      wordCount: data.split(/\s+/).filter((w) => w.length > 0).length,
      charCount: data.length,
      lineCount: data.split("\n").length,
      paragraphCount: data.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length
    };
    const titleMatch = data.match(/^#\s+(.+)$/m);
    if (titleMatch) {
      fields.title = titleMatch[1].trim();
    }
    const urlMatches = data.match(/https?:\/\/[^\s]+/g);
    if (urlMatches) {
      fields.urls = [...new Set(urlMatches)];
    }
    const emailMatches = data.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
    if (emailMatches) {
      fields.emails = [...new Set(emailMatches)];
    }
    return fields;
  }
  async assessQuality(data, extracted) {
    const wordCount = extracted.wordCount;
    const lineCount = extracted.lineCount;
    const completeness = wordCount > 100 ? 1 : wordCount / 100;
    const consistency = this.checkConsistency(data);
    const validity = this.checkValidity(data);
    const score = completeness * 0.4 + consistency * 0.3 + validity * 0.3;
    return {
      score: Math.round(score * 100) / 100,
      completeness: Math.round(completeness * 100) / 100,
      consistency: Math.round(consistency * 100) / 100,
      validity: Math.round(validity * 100) / 100
    };
  }
  checkConsistency(data) {
    const lines = data.split("\n");
    let consistent = true;
    let lastIndent = 0;
    for (const line of lines) {
      const indent = line.match(/^\s*/)?.[0].length || 0;
      if (Math.abs(indent - lastIndent) > 4 && lastIndent !== 0) {
        consistent = false;
        break;
      }
      lastIndent = indent;
    }
    return consistent ? 1 : 0.7;
  }
  checkValidity(data) {
    const validPatterns = [
      /[\u4e00-\u9fa5]/,
      /[a-zA-Z]/,
      /[0-9]/
    ];
    let patternCount = 0;
    for (const pattern of validPatterns) {
      if (pattern.test(data)) {
        patternCount++;
      }
    }
    return patternCount / validPatterns.length;
  }
  cacheProcessedData(processed) {
    if (this.processedDataCache.size > 1e4) {
      const firstKey = this.processedDataCache.keys().next().value;
      if (firstKey) {
        this.processedDataCache.delete(firstKey);
      }
    }
    this.processedDataCache.set(processed.id, processed);
  }
  getProcessedData(id) {
    return this.processedDataCache.get(id);
  }
  async processBatch(rawDataList, onProgress) {
    const results = [];
    let completed = 0;
    const total = rawDataList.length;
    const chunkSize = this.config.maxConcurrentProcessing;
    for (let i = 0; i < total; i += chunkSize) {
      const chunk = rawDataList.slice(i, i + chunkSize);
      const chunkResults = await Promise.all(
        chunk.map(async (data) => {
          const result = await this.process(data);
          completed++;
          onProgress?.(completed, total);
          return result;
        })
      );
      results.push(...chunkResults);
    }
    return results;
  }
  addValidationRule(format, rule) {
    const rules = this.validationRules.get(format) || [];
    rules.push(rule);
    this.validationRules.set(format, rules);
    this.logger.debug("Added validation rule", { format, rule });
  }
  getStatistics() {
    let totalQuality = 0;
    let count = 0;
    for (const processed of this.processedDataCache.values()) {
      totalQuality += processed.quality.score;
      count++;
    }
    return {
      totalProcessed: count,
      cacheSize: this.processedDataCache.size,
      uniqueDataCount: this.dataHashIndex.size,
      averageQuality: count > 0 ? Math.round(totalQuality / count * 100) / 100 : 0
    };
  }
  generateProcessedDataId() {
    return `proc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
  clearCache() {
    this.processedDataCache.clear();
    this.dataHashIndex.clear();
    this.logger.info("Cache cleared");
  }
};
var dataInputService = new DataInputService();

// src/core/data_input/StreamProcessor.ts
var import_stream = require("stream");
var import_events = require("events");
init_logger();
var DataStreamProcessor = class extends import_events.EventEmitter {
  constructor(config = {}) {
    super();
    this.logger = createLogger("DataStreamProcessor");
    this.isPaused = false;
    this.buffer = [];
    this.config = {
      highWaterMark: config.highWaterMark ?? 64,
      objectMode: config.objectMode ?? true,
      enableBackpressure: config.enableBackpressure ?? true,
      maxBufferSize: config.maxBufferSize ?? 1e3
    };
    this.stats = this.createInitialStats();
    this.logger.info("DataStreamProcessor initialized", { config: this.config });
  }
  createInitialStats() {
    return {
      bytesProcessed: 0,
      recordsProcessed: 0,
      errorsEncountered: 0,
      startTime: /* @__PURE__ */ new Date(),
      processingRate: 0
    };
  }
  createReadableStream(dataSource) {
    const self2 = this;
    let iterator;
    let isAsync = false;
    if (Array.isArray(dataSource)) {
      iterator = dataSource[Symbol.iterator]();
    } else {
      isAsync = true;
      iterator = dataSource[Symbol.asyncIterator]?.() || dataSource[Symbol.iterator]();
    }
    return new import_stream.Readable({
      objectMode: this.config.objectMode,
      highWaterMark: this.config.highWaterMark,
      async read() {
        try {
          const result = isAsync ? await iterator.next() : iterator.next();
          if (result.done) {
            this.push(null);
          } else {
            self2.updateStats(result.value);
            this.push(result.value);
          }
        } catch (error) {
          self2.logger.error("Error reading from stream", error);
          self2.stats.errorsEncountered++;
          self2.emit("error", error);
          this.push(null);
        }
      }
    });
  }
  createTransformStream(transformFn) {
    const self2 = this;
    return new import_stream.Transform({
      objectMode: this.config.objectMode,
      highWaterMark: this.config.highWaterMark,
      async transform(chunk, encoding, callback) {
        try {
          if (self2.config.enableBackpressure && self2.isPaused) {
            self2.buffer.push(chunk);
            callback();
            return;
          }
          const result = await transformFn(chunk);
          self2.stats.recordsProcessed++;
          callback(null, result);
        } catch (error) {
          self2.logger.error("Error transforming data", error, { dataId: chunk.id });
          self2.stats.errorsEncountered++;
          callback(error);
        }
      },
      flush(callback) {
        self2.logger.debug("Flushing transform stream", { bufferedItems: self2.buffer.length });
        callback();
      }
    });
  }
  createWritableStream(writeFn) {
    const self2 = this;
    return new import_stream.Writable({
      objectMode: this.config.objectMode,
      highWaterMark: this.config.highWaterMark,
      async write(chunk, encoding, callback) {
        try {
          await writeFn(chunk);
          self2.stats.bytesProcessed += chunk.size || 0;
          callback();
        } catch (error) {
          self2.logger.error("Error writing data", error, { dataId: chunk.id });
          self2.stats.errorsEncountered++;
          callback(error);
        }
      }
    });
  }
  createPipeline(source, transforms, destination) {
    return new Promise((resolve, reject) => {
      const readable = this.createReadableStream(source);
      let transformStreams = [];
      const writable = this.createWritableStream(destination);
      readable.on("error", (error) => {
        this.logger.error("Pipeline source error", error);
        reject(error);
      });
      writable.on("error", (error) => {
        this.logger.error("Pipeline destination error", error);
        reject(error);
      });
      if (transforms.length > 0) {
        transformStreams = transforms.map(
          (transformFn) => this.createTransformStream(transformFn)
        );
        transformStreams.forEach((ts, index) => {
          ts.on("error", (error) => {
            this.logger.error(`Pipeline transform ${index} error`, error);
            reject(error);
          });
        });
        let stream = readable;
        for (const transform of transformStreams) {
          stream = stream.pipe(transform);
        }
        stream.pipe(writable);
      } else {
        readable.pipe(writable);
      }
      writable.on("finish", () => {
        this.stats.endTime = /* @__PURE__ */ new Date();
        this.stats.processingRate = this.calculateProcessingRate();
        this.logger.info("Pipeline completed", { stats: this.stats });
        resolve({ ...this.stats });
      });
    });
  }
  pause() {
    this.isPaused = true;
    this.emit("pause");
    this.logger.debug("Stream processing paused");
  }
  resume() {
    if (this.isPaused && this.buffer.length > 0) {
      this.isPaused = false;
      this.emit("resume", { bufferedItems: this.buffer.length });
      this.logger.debug("Stream processing resumed", { bufferedItems: this.buffer.length });
    }
  }
  getStats() {
    return { ...this.stats, processingRate: this.calculateProcessingRate() };
  }
  updateStats(data) {
    this.stats.bytesProcessed += data.size || 0;
  }
  calculateProcessingRate() {
    const duration = (this.stats.endTime?.getTime() || Date.now()) - this.stats.startTime.getTime();
    const seconds = duration / 1e3;
    return seconds > 0 ? Math.round(this.stats.recordsProcessed / seconds * 100) / 100 : 0;
  }
  resetStats() {
    this.stats = this.createInitialStats();
    this.buffer = [];
    this.isPaused = false;
    this.logger.info("Stream stats reset");
  }
};
var DataStreamManager = class {
  constructor(config = {}) {
    this.logger = createLogger("DataStreamManager");
    this.processors = /* @__PURE__ */ new Map();
    this.config = {
      highWaterMark: config.highWaterMark ?? 64,
      objectMode: config.objectMode ?? true,
      enableBackpressure: config.enableBackpressure ?? true,
      maxBufferSize: config.maxBufferSize ?? 1e3
    };
    this.logger.info("DataStreamManager initialized");
  }
  createProcessor(id, config) {
    if (this.processors.has(id)) {
      this.logger.warn("Processor already exists, returning existing", { id });
      return this.processors.get(id);
    }
    const processor = new DataStreamProcessor({ ...this.config, ...config });
    this.processors.set(id, processor);
    processor.on("error", (error) => {
      this.logger.error("Processor error", error, { processorId: id });
    });
    processor.on("pause", () => {
      this.logger.warn("Processor paused", { processorId: id });
    });
    processor.on("resume", (info) => {
      this.logger.info("Processor resumed", { processorId: id, ...info });
    });
    this.logger.info("Created new processor", { id });
    return processor;
  }
  getProcessor(id) {
    return this.processors.get(id);
  }
  removeProcessor(id) {
    const processor = this.processors.get(id);
    if (processor) {
      processor.removeAllListeners();
      this.processors.delete(id);
      this.logger.info("Processor removed", { id });
      return true;
    }
    return false;
  }
  getAllStats() {
    const stats = /* @__PURE__ */ new Map();
    for (const [id, processor] of this.processors) {
      stats.set(id, processor.getStats());
    }
    return stats;
  }
  getAggregateStats() {
    const allStats = Array.from(this.processors.values()).map((p) => p.getStats());
    return {
      bytesProcessed: allStats.reduce((sum, s) => sum + s.bytesProcessed, 0),
      recordsProcessed: allStats.reduce((sum, s) => sum + s.recordsProcessed, 0),
      errorsEncountered: allStats.reduce((sum, s) => sum + s.errorsEncountered, 0),
      startTime: allStats.length > 0 ? allStats[0].startTime : /* @__PURE__ */ new Date(),
      endTime: allStats.every((s) => s.endTime) ? /* @__PURE__ */ new Date() : void 0,
      processingRate: allStats.reduce((sum, s) => sum + s.processingRate, 0)
    };
  }
  shutdown() {
    this.logger.info("Shutting down DataStreamManager", { processorCount: this.processors.size });
    for (const [id, processor] of this.processors) {
      processor.removeAllListeners();
      processor.resetStats();
    }
    this.processors.clear();
    this.logger.info("DataStreamManager shutdown complete");
  }
};
var streamManager = new DataStreamManager();

// src/core/data_input/DataSourceAdapter.ts
init_logger();
var DataSourceManager = class {
  constructor() {
    this.logger = createLogger("DataSourceManager");
    this.sources = /* @__PURE__ */ new Map();
    this.streamProcessor = streamManager.createProcessor("ds-manager");
    this.logger.info("DataSourceManager initialized");
  }
  registerSource(id, source) {
    if (this.sources.has(id)) {
      this.logger.warn("Data source already registered", { id });
      return;
    }
    this.sources.set(id, source);
    this.logger.info("Data source registered", { id, type: source.config.type });
  }
  unregisterSource(id) {
    const source = this.sources.get(id);
    if (source) {
      source.disconnect().catch((err4) => {
        this.logger.error("Error disconnecting source", err4);
      });
      this.sources.delete(id);
      this.logger.info("Data source unregistered", { id });
      return true;
    }
    return false;
  }
  getSource(id) {
    return this.sources.get(id);
  }
  async importFromSource(id, options = {}) {
    const source = this.sources.get(id);
    if (!source) {
      throw new Error(`Data source not found: ${id}`);
    }
    this.logger.info("Starting import from source", { id });
    try {
      const rawData = await source.fetchData();
      this.logger.debug("Fetched raw data", { id, count: rawData.length });
      if (!options.processData) {
        return [];
      }
      const results = await dataInputService.processBatch(
        rawData,
        options.onProgress
      );
      const processed = [];
      for (const result of results) {
        if ("data" in result && result.success) {
          processed.push(result.data);
        } else {
          this.logger.warn("Failed to process data", { error: "data" in result ? result.error : "Unknown" });
        }
      }
      this.logger.info("Import completed", { id, processedCount: processed.length });
      return processed;
    } catch (error) {
      this.logger.error("Import failed", error, { id });
      throw error;
    }
  }
  async importFromAll(options = {}) {
    const results = /* @__PURE__ */ new Map();
    for (const [id] of this.sources) {
      try {
        const processed = await this.importFromSource(id, options);
        results.set(id, processed);
      } catch (error) {
        this.logger.error("Failed to import from source", error, { id });
        results.set(id, []);
      }
    }
    return results;
  }
  async healthCheckAll() {
    const results = /* @__PURE__ */ new Map();
    for (const [id, source] of this.sources) {
      try {
        const healthy = await source.healthCheck();
        results.set(id, healthy);
      } catch {
        results.set(id, false);
      }
    }
    return results;
  }
  getAllStats() {
    const stats = /* @__PURE__ */ new Map();
    for (const [id, source] of this.sources) {
      stats.set(id, source.getStats());
    }
    return stats;
  }
  getAggregateStats() {
    let totalRecords = 0;
    let totalErrors = 0;
    let healthy = 0;
    let unhealthy = 0;
    for (const source of this.sources.values()) {
      const stats = source.getStats();
      totalRecords += stats.recordsImported;
      totalErrors += stats.errors;
      if (source.getStatus() === "IDLE" /* IDLE */) {
        healthy++;
      } else {
        unhealthy++;
      }
    }
    return {
      totalRecordsImported: totalRecords,
      totalErrors,
      healthySources: healthy,
      unhealthySources: unhealthy
    };
  }
  async shutdown() {
    this.logger.info("Shutting down DataSourceManager", { sourceCount: this.sources.size });
    for (const [id, source] of this.sources) {
      try {
        await source.disconnect();
      } catch (error) {
        this.logger.error("Error disconnecting source", error, { id });
      }
    }
    this.sources.clear();
    streamManager.removeProcessor("ds-manager");
    this.logger.info("DataSourceManager shutdown complete");
  }
};
var dataSourceManager = new DataSourceManager();

// src/core/knowledge/KnowledgeExtractionService.ts
init_logger();
init_errors();
init_utils();
var DEFAULT_EXTRACTION_CONFIG = {
  enableEntityExtraction: true,
  enableRelationExtraction: true,
  enableConceptExtraction: true,
  maxEntityCount: 1e3,
  minConfidence: 0.5,
  language: "zh-CN"
};
var ENTITY_PATTERNS = {
  "zh-CN": [
    /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\b/g,
    /\b(\d{4}[-/年]\d{1,2}[-/月]\d{1,2}[日]?)\b/g,
    /\b(\d+(?:\.\d+)?[%亿元万元])\b/g,
    /\b([A-Z]+(?:-[A-Z]+)+)\b/g
  ],
  "en-US": [
    /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\b/g,
    /\b(\d{4}[-/]\d{1,2}[-/]\d{1,2})\b/g,
    /\b(\$\d+(?:,\d{3})*(?:\.\d{2})?)\b/g,
    /\b([A-Z]{2,})\b/g
  ]
};
var CONCEPT_CATEGORIES = [
  "PERSON",
  "ORGANIZATION",
  "LOCATION",
  "TIME",
  "MONEY",
  "PERCENT",
  "TECHNOLOGY",
  "EVENT",
  "PRODUCT"
];
var KnowledgeExtractionService = class {
  constructor(config = {}) {
    this.logger = createLogger("KnowledgeExtractionService");
    this.entityCache = /* @__PURE__ */ new Map();
    this.conceptCache = /* @__PURE__ */ new Map();
    this.config = { ...DEFAULT_EXTRACTION_CONFIG, ...config };
    this.logger.info("KnowledgeExtractionService initialized", { config: this.config });
  }
  async extract(text, context) {
    const startTime = Date.now();
    if (!text || text.trim().length === 0) {
      return err(new ValidationError("Text cannot be empty"));
    }
    try {
      this.logger.debug("Starting extraction", { textLength: text.length, context });
      const entities = [];
      const relations = [];
      const concepts = [];
      if (this.config.enableEntityExtraction) {
        const extractedEntities = this.extractEntities(text);
        entities.push(...extractedEntities);
      }
      if (this.config.enableConceptExtraction) {
        const extractedConcepts = this.extractConcepts(text, entities);
        concepts.push(...extractedConcepts);
      }
      if (this.config.enableRelationExtraction && entities.length > 1) {
        const extractedRelations = this.extractRelations(text, entities);
        relations.push(...extractedRelations);
      }
      const filteredEntities = this.filterByConfidence(entities);
      const filteredRelations = this.filterByConfidence(relations);
      const filteredConcepts = this.filterConceptsByConfidence(concepts);
      const overallConfidence = this.calculateOverallConfidence(
        filteredEntities,
        filteredRelations,
        filteredConcepts
      );
      const result = {
        entities: filteredEntities,
        relations: filteredRelations,
        concepts: filteredConcepts,
        metadata: {
          extractionTime: Date.now() - startTime,
          language: this.config.language || "auto",
          confidence: overallConfidence
        }
      };
      this.updateCaches(filteredEntities, filteredConcepts);
      this.logger.info("Extraction completed", {
        entityCount: filteredEntities.length,
        relationCount: filteredRelations.length,
        conceptCount: filteredConcepts.length,
        duration: result.metadata.extractionTime
      });
      return ok(result);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Unknown extraction error";
      this.logger.error("Extraction failed", error);
      return err(new KnowledgeProcessingError(errMsg, { textLength: text.length }));
    }
  }
  extractEntities(text) {
    const entities = [];
    const patterns = ENTITY_PATTERNS[this.config.language || "zh-CN"] || ENTITY_PATTERNS["zh-CN"];
    const addedTexts = /* @__PURE__ */ new Set();
    for (const pattern of patterns) {
      let match;
      const regex = new RegExp(pattern.source, pattern.flags);
      while ((match = regex.exec(text)) !== null) {
        const entityText = match[1] || match[0];
        const normalizedText = entityText.trim();
        if (normalizedText.length < 2 || addedTexts.has(normalizedText) || this.isStopWord(normalizedText)) {
          continue;
        }
        addedTexts.add(normalizedText);
        const entity = {
          id: generateId(),
          type: this.categorizeEntity(normalizedText, entityText),
          name: normalizedText,
          attributes: {
            originalText: entityText,
            matchIndex: match.index,
            matchedPattern: pattern.source
          },
          confidence: this.calculateEntityConfidence(normalizedText, entityText),
          startPosition: match.index,
          endPosition: match.index + entityText.length
        };
        entities.push(entity);
        if (entities.length >= this.config.maxEntityCount) {
          break;
        }
      }
    }
    return entities;
  }
  categorizeEntity(entityText, originalMatch) {
    const categoryPatterns = [
      {
        category: "PERSON",
        patterns: [/[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+/]
      },
      {
        category: "ORGANIZATION",
        patterns: [
          /公司|企业|集团|协会|组织|机构/,
          /\b(?:Inc|LLC|Corp|Ltd|Co)\.?$/i
        ]
      },
      {
        category: "LOCATION",
        patterns: [
          /省|市|区|县|镇|村|路|街|道/,
          /市|县|区$/
        ]
      },
      {
        category: "TIME",
        patterns: [/\d{4}[-/年]\d{1,2}[-/月]\d{1,2}/, /\d{4}年/, /昨天|今天|明天|上周|下周/]
      },
      {
        category: "MONEY",
        patterns: [/[$￥€£]\d/, /\d+元|\d+万|\d+亿/]
      },
      {
        category: "PERCENT",
        patterns: [/\d+%|百分之/]
      }
    ];
    for (const { category, patterns } of categoryPatterns) {
      for (const pattern of patterns) {
        if (pattern.test(entityText) || pattern.test(originalMatch)) {
          return category;
        }
      }
    }
    return "UNKNOWN";
  }
  calculateEntityConfidence(entityText, originalMatch) {
    let confidence = 0.7;
    if (entityText.length >= 2 && entityText.length <= 20) {
      confidence += 0.1;
    } else if (entityText.length > 50) {
      confidence -= 0.2;
    }
    if (/^[A-Z]/.test(entityText) || /^[\u4e00-\u9fa5]/.test(entityText)) {
      confidence += 0.1;
    }
    if (/\d/.test(entityText)) {
      confidence -= 0.05;
    }
    return Math.min(Math.max(confidence, 0), 1);
  }
  extractConcepts(text, entities) {
    const concepts = [];
    const conceptNames = /* @__PURE__ */ new Set();
    for (const category of CONCEPT_CATEGORIES) {
      const categoryEntities = entities.filter((e) => e.type === category);
      if (categoryEntities.length >= 2) {
        const conceptName = `${category}_CLUSTER_${Date.now()}`;
        if (!conceptNames.has(category)) {
          conceptNames.add(category);
          const concept = {
            id: generateId(),
            name: category,
            category: "ENTITY_CLUSTER",
            aliases: [],
            description: `Cluster of ${category} entities`,
            confidence: 0.8,
            relatedEntities: categoryEntities.map((e) => e.id)
          };
          concepts.push(concept);
        }
      }
    }
    const nounPhrases = this.extractNounPhrases(text);
    for (const phrase of nounPhrases) {
      if (phrase.length >= 3 && phrase.length <= 30) {
        const concept = {
          id: generateId(),
          name: phrase,
          category: "PHRASE",
          aliases: [],
          relatedEntities: [],
          confidence: 0.6
        };
        concepts.push(concept);
      }
    }
    return concepts;
  }
  extractNounPhrases(text) {
    const phrases = [];
    const patterns = [
      /\b([\u4e00-\u9fa5]{2,}(?:[\u4e00-\u9fa5a-zA-Z0-9]*[\u4e00-\u9fa5]+)+)/g,
      /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})\b/g
    ];
    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const phrase = match[1].trim();
        if (phrase.length >= 3) {
          phrases.push(phrase);
        }
      }
    }
    return phrases;
  }
  extractRelations(text, entities) {
    const relations = [];
    const relationPatterns = [
      {
        type: "WORKS_AT",
        pattern: /(.*?)(公司|企业|组织|机构)(.*)/,
        sourceTypes: ["PERSON"],
        targetTypes: ["ORGANIZATION"]
      },
      {
        type: "LOCATED_IN",
        pattern: /(.*?)(位于|坐落于|在)(.*)/,
        sourceTypes: ["ORGANIZATION", "LOCATION"],
        targetTypes: ["LOCATION"]
      },
      {
        type: "FOUNDED_BY",
        pattern: /(.*?)(创立|创建|成立|创办)(.*)/,
        sourceTypes: ["ORGANIZATION"],
        targetTypes: ["PERSON"]
      }
    ];
    for (const relPattern of relationPatterns) {
      let match;
      const regex = new RegExp(relPattern.pattern);
      while ((match = regex.exec(text)) !== null) {
        const sourceEntity = this.findNearestEntity(entities, match.index, relPattern.sourceTypes);
        const targetEntity = this.findNearestEntity(
          entities,
          match.index + match[0].length,
          relPattern.targetTypes
        );
        if (sourceEntity && targetEntity && sourceEntity.id !== targetEntity.id) {
          const relation = {
            id: generateId(),
            sourceEntityId: sourceEntity.id,
            targetEntityId: targetEntity.id,
            relationType: relPattern.type,
            attributes: {
              matchedText: match[0],
              matchIndex: match.index
            },
            confidence: 0.75
          };
          relations.push(relation);
        }
      }
    }
    return this.deduplicateRelations(relations);
  }
  findNearestEntity(entities, position, types) {
    let nearest;
    let minDistance = Infinity;
    for (const entity of entities) {
      if (!types.includes(entity.type)) continue;
      const entityCenter = (entity.startPosition + entity.endPosition) / 2;
      const distance = Math.abs(entityCenter - position);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = entity;
      }
    }
    return nearest;
  }
  deduplicateRelations(relations) {
    const seen = /* @__PURE__ */ new Set();
    return relations.filter((rel) => {
      const key = `${rel.sourceEntityId}-${rel.relationType}-${rel.targetEntityId}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }
  filterByConfidence(items) {
    return items.filter((item) => item.confidence >= this.config.minConfidence);
  }
  filterConceptsByConfidence(concepts) {
    return concepts.filter((c) => c.confidence >= this.config.minConfidence);
  }
  calculateOverallConfidence(entities, relations, concepts) {
    const weights = {
      entity: 0.4,
      relation: 0.3,
      concept: 0.3
    };
    const entityConf = entities.length > 0 ? entities.reduce((sum, e) => sum + e.confidence, 0) / entities.length : 0;
    const relationConf = relations.length > 0 ? relations.reduce((sum, r) => sum + r.confidence, 0) / relations.length : 0;
    const conceptConf = concepts.length > 0 ? concepts.reduce((sum, c) => sum + c.confidence, 0) / concepts.length : 0;
    return Math.round((entityConf * weights.entity + relationConf * weights.relation + conceptConf * weights.concept) * 100) / 100;
  }
  updateCaches(entities, concepts) {
    if (this.entityCache.size > 1e4) {
      const keys = Array.from(this.entityCache.keys()).slice(0, 5e3);
      keys.forEach((k) => this.entityCache.delete(k));
    }
    for (const entity of entities) {
      this.entityCache.set(entity.id, entity);
    }
    for (const concept of concepts) {
      this.conceptCache.set(concept.id, concept);
    }
  }
  isStopWord(word) {
    const stopWords = /* @__PURE__ */ new Set([
      "\u7684",
      "\u4E86",
      "\u5728",
      "\u662F",
      "\u6211",
      "\u6709",
      "\u548C",
      "\u5C31",
      "\u4E0D",
      "\u4EBA",
      "\u90FD",
      "\u4E00",
      "\u4E00\u4E2A",
      "\u4E0A",
      "\u4E5F",
      "\u5F88",
      "\u5230",
      "\u8BF4",
      "\u8981",
      "\u53BB",
      "\u4F60",
      "\u4F1A",
      "\u7740",
      "\u6CA1\u6709",
      "\u770B",
      "\u597D",
      "\u81EA\u5DF1",
      "\u8FD9",
      "the",
      "a",
      "an",
      "is"
    ]);
    return stopWords.has(word.toLowerCase());
  }
  getCacheStats() {
    return {
      entityCount: this.entityCache.size,
      conceptCount: this.conceptCache.size
    };
  }
  clearCache() {
    this.entityCache.clear();
    this.conceptCache.clear();
    this.logger.info("Knowledge extraction cache cleared");
  }
};
var knowledgeExtractionService = new KnowledgeExtractionService();

// src/core/knowledge/KnowledgeFusionService.ts
init_logger();
init_errors();
init_utils();
var DEFAULT_FUSION_CONFIG = {
  conflictResolutionStrategy: "CONFIDENCE",
  enableDeduplication: true,
  similarityThreshold: 0.85,
  enableTemporalReasoning: true
};
var KnowledgeFusionService = class {
  constructor(config = {}) {
    this.logger = createLogger("KnowledgeFusionService");
    this.config = { ...DEFAULT_FUSION_CONFIG, ...config };
    this.knowledgeGraph = this.createEmptyGraph();
    this.logger.info("KnowledgeFusionService initialized", { config: this.config });
  }
  createEmptyGraph() {
    return {
      nodes: [],
      edges: [],
      metadata: {
        totalNodes: 0,
        totalEdges: 0,
        createdAt: /* @__PURE__ */ new Date(),
        lastUpdatedAt: /* @__PURE__ */ new Date()
      }
    };
  }
  async fuseEntries(entries) {
    try {
      this.logger.info("Starting knowledge fusion", { entryCount: entries.length });
      if (entries.length === 0) {
        return ok([]);
      }
      const fusedEntries = [];
      const groupedEntries = this.groupByContent(entries);
      for (const [contentHash, group] of groupedEntries) {
        if (group.length === 1) {
          fusedEntries.push(group[0]);
        } else {
          const fused = await this.fuseGroup(group);
          fusedEntries.push(fused);
        }
      }
      this.logger.info("Knowledge fusion completed", {
        inputCount: entries.length,
        outputCount: fusedEntries.length,
        deduplicatedCount: entries.length - fusedEntries.length
      });
      return ok(fusedEntries);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Unknown fusion error";
      this.logger.error("Knowledge fusion failed", error);
      return err(new KnowledgeProcessingError(errMsg));
    }
  }
  groupByContent(entries) {
    const groups = /* @__PURE__ */ new Map();
    for (const entry of entries) {
      const hash = this.computeContentHash(entry.content);
      const existing = groups.get(hash) || [];
      existing.push(entry);
      groups.set(hash, existing);
    }
    return groups;
  }
  computeContentHash(content) {
    const normalized = content.toLowerCase().trim();
    const hash = require("crypto").createHash("sha256").update(normalized).digest("hex").substring(0, 16);
    return hash;
  }
  async fuseGroup(entries) {
    this.logger.debug("Fusing entry group", { size: entries.length });
    entries.sort((a, b) => b.confidence - a.confidence);
    const primary = entries[0];
    const fused = {
      ...primary,
      id: primary.id,
      entities: [],
      relations: [],
      tags: []
    };
    const mergedEntities = this.mergeEntities(
      entries.flatMap((e) => e.entities)
    );
    fused.entities = mergedEntities;
    const mergedRelations = this.mergeRelations(
      entries.flatMap((e) => e.relations)
    );
    fused.relations = mergedRelations;
    const mergedTags = this.mergeTags(entries.flatMap((e) => e.tags));
    fused.tags = mergedTags;
    const avgConfidence = entries.reduce((sum, e) => sum + e.confidence, 0) / entries.length;
    fused.confidence = Math.round(avgConfidence * 100) / 100;
    fused.updatedAt = /* @__PURE__ */ new Date();
    fused.version++;
    return fused;
  }
  mergeEntities(entities) {
    const merged = [];
    const seen = /* @__PURE__ */ new Map();
    for (const entity of entities) {
      const key = `${entity.type}:${entity.name}`;
      if (seen.has(key)) {
        const existing = seen.get(key);
        if (entity.confidence > existing.confidence) {
          seen.set(key, entity);
        } else {
          existing.attributes = { ...existing.attributes, ...entity.attributes };
          existing.confidence = (existing.confidence + entity.confidence) / 2;
        }
      } else {
        seen.set(key, { ...entity });
      }
    }
    return Array.from(seen.values());
  }
  mergeRelations(relations) {
    const merged = [];
    const seen = /* @__PURE__ */ new Set();
    for (const relation of relations) {
      const key = `${relation.sourceEntityId}:${relation.relationType}:${relation.targetEntityId}`;
      if (!seen.has(key)) {
        seen.add(key);
        merged.push(relation);
      }
    }
    return merged;
  }
  mergeTags(tags) {
    const tagSet = new Set(tags.map((t) => t.toLowerCase().trim()));
    return Array.from(tagSet);
  }
  async addToGraph(entities, relations) {
    try {
      for (const entity of entities) {
        const existingNode = this.findNodeByEntityId(entity.id);
        if (existingNode) {
          existingNode.attributes = { ...existingNode.attributes, ...entity.attributes };
          existingNode.inDegree = this.countIncomingEdges(existingNode.id);
          existingNode.outDegree = this.countOutgoingEdges(existingNode.id);
        } else {
          const node = {
            id: generateId(),
            entityId: entity.id,
            type: entity.type,
            name: entity.name,
            attributes: entity.attributes,
            inDegree: 0,
            outDegree: 0
          };
          this.knowledgeGraph.nodes.push(node);
        }
      }
      for (const relation of relations) {
        const sourceNode = this.findNodeByEntityId(relation.sourceEntityId);
        const targetNode = this.findNodeByEntityId(relation.targetEntityId);
        if (sourceNode && targetNode) {
          const existingEdge = this.findEdge(sourceNode.id, targetNode.id, relation.relationType);
          if (existingEdge) {
            existingEdge.weight = Math.max(existingEdge.weight, relation.confidence);
          } else {
            const edge = {
              id: relation.id,
              sourceNodeId: sourceNode.id,
              targetNodeId: targetNode.id,
              relationType: relation.relationType,
              weight: relation.confidence,
              attributes: relation.attributes
            };
            this.knowledgeGraph.edges.push(edge);
            sourceNode.outDegree++;
            targetNode.inDegree++;
          }
        }
      }
      this.updateGraphMetadata();
      this.logger.info("Added entities and relations to graph", {
        entitiesAdded: entities.length,
        relationsAdded: relations.length,
        totalNodes: this.knowledgeGraph.metadata.totalNodes,
        totalEdges: this.knowledgeGraph.metadata.totalEdges
      });
      return ok(void 0);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Unknown graph error";
      this.logger.error("Failed to add to graph", error);
      return err(new KnowledgeProcessingError(errMsg));
    }
  }
  findNodeByEntityId(entityId) {
    return this.knowledgeGraph.nodes.find((n) => n.entityId === entityId);
  }
  findEdge(sourceNodeId, targetNodeId, relationType) {
    return this.knowledgeGraph.edges.find(
      (e) => e.sourceNodeId === sourceNodeId && e.targetNodeId === targetNodeId && e.relationType === relationType
    );
  }
  countIncomingEdges(nodeId) {
    return this.knowledgeGraph.edges.filter((e) => e.targetNodeId === nodeId).length;
  }
  countOutgoingEdges(nodeId) {
    return this.knowledgeGraph.edges.filter((e) => e.sourceNodeId === nodeId).length;
  }
  updateGraphMetadata() {
    this.knowledgeGraph.metadata = {
      totalNodes: this.knowledgeGraph.nodes.length,
      totalEdges: this.knowledgeGraph.edges.length,
      createdAt: this.knowledgeGraph.metadata.createdAt,
      lastUpdatedAt: /* @__PURE__ */ new Date()
    };
  }
  getGraph() {
    return {
      ...this.knowledgeGraph,
      nodes: [...this.knowledgeGraph.nodes],
      edges: [...this.knowledgeGraph.edges]
    };
  }
  async findPath(startEntityId, endEntityId, maxDepth = 3) {
    try {
      const startNode = this.findNodeByEntityId(startEntityId);
      const endNode = this.findNodeByEntityId(endEntityId);
      if (!startNode || !endNode) {
        return err(new NotFoundError("Entity not found in graph"));
      }
      const visited = /* @__PURE__ */ new Set();
      const path3 = [];
      const found = this.bfs(startNode.id, endNode.id, maxDepth, visited, path3);
      if (found) {
        return ok(path3);
      } else {
        return err(new KnowledgeProcessingError("No path found between entities"));
      }
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Unknown path error";
      return err(new KnowledgeProcessingError(errMsg));
    }
  }
  bfs(startId, endId, maxDepth, visited, path3) {
    if (startId === endId) {
      path3.push(startId);
      return true;
    }
    if (maxDepth === 0) {
      return false;
    }
    visited.add(startId);
    path3.push(startId);
    const neighbors = this.getNeighbors(startId);
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (this.bfs(neighbor, endId, maxDepth - 1, visited, path3)) {
          return true;
        }
      }
    }
    path3.pop();
    return false;
  }
  getNeighbors(nodeId) {
    const neighbors = /* @__PURE__ */ new Set();
    for (const edge of this.knowledgeGraph.edges) {
      if (edge.sourceNodeId === nodeId) {
        neighbors.add(edge.targetNodeId);
      }
      if (edge.targetNodeId === nodeId) {
        neighbors.add(edge.sourceNodeId);
      }
    }
    return Array.from(neighbors);
  }
  calculateCentrality() {
    const centrality = /* @__PURE__ */ new Map();
    for (const node of this.knowledgeGraph.nodes) {
      const degree = node.inDegree + node.outDegree;
      centrality.set(node.id, degree);
    }
    return centrality;
  }
  async getSubgraph(entityIds, depth = 1) {
    try {
      const nodeIds = /* @__PURE__ */ new Set();
      const edgeIds = /* @__PURE__ */ new Set();
      for (const entityId of entityIds) {
        const node = this.findNodeByEntityId(entityId);
        if (node) {
          nodeIds.add(node.id);
          this.expandSubgraph(node.id, depth, nodeIds, edgeIds);
        }
      }
      const subgraph = {
        nodes: this.knowledgeGraph.nodes.filter((n) => nodeIds.has(n.id)),
        edges: this.knowledgeGraph.edges.filter((e) => edgeIds.has(e.id)),
        metadata: {
          totalNodes: nodeIds.size,
          totalEdges: edgeIds.size,
          createdAt: /* @__PURE__ */ new Date(),
          lastUpdatedAt: /* @__PURE__ */ new Date()
        }
      };
      return ok(subgraph);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Unknown subgraph error";
      return err(new KnowledgeProcessingError(errMsg));
    }
  }
  expandSubgraph(nodeId, remainingDepth, nodeIds, edgeIds) {
    if (remainingDepth === 0) return;
    for (const edge of this.knowledgeGraph.edges) {
      if (edge.sourceNodeId === nodeId) {
        nodeIds.add(edge.targetNodeId);
        edgeIds.add(edge.id);
        this.expandSubgraph(edge.targetNodeId, remainingDepth - 1, nodeIds, edgeIds);
      }
      if (edge.targetNodeId === nodeId) {
        nodeIds.add(edge.sourceNodeId);
        edgeIds.add(edge.id);
        this.expandSubgraph(edge.sourceNodeId, remainingDepth - 1, nodeIds, edgeIds);
      }
    }
  }
  getStatistics() {
    const degrees = this.knowledgeGraph.nodes.map((n) => ({
      id: n.id,
      name: n.name,
      degree: n.inDegree + n.outDegree
    }));
    degrees.sort((a, b) => b.degree - a.degree);
    const totalDegree = degrees.reduce((sum, n) => sum + n.degree, 0);
    const avgDegree = degrees.length > 0 ? totalDegree / degrees.length : 0;
    return {
      totalNodes: this.knowledgeGraph.metadata.totalNodes,
      totalEdges: this.knowledgeGraph.metadata.totalEdges,
      avgDegree: Math.round(avgDegree * 100) / 100,
      mostConnectedNodes: degrees.slice(0, 10)
    };
  }
  clearGraph() {
    this.knowledgeGraph = this.createEmptyGraph();
    this.logger.info("Knowledge graph cleared");
  }
};
var knowledgeFusionService = new KnowledgeFusionService();

// src/core/knowledge/index.ts
init_types();

// src/core/database/index.ts
init_KnowledgeRepository();
init_VectorStore();

// src/core/database/MemoryRepository.ts
init_logger();
init_errors();
init_utils();
var import_better_sqlite32 = __toESM(require("better-sqlite3"));
var MemoryRepository = class {
  constructor(dbPath = "./data/skills.db") {
    this.logger = createLogger(this.constructor.name);
    this.initialized = false;
    this.db = new import_better_sqlite32.default(dbPath);
    this.db.pragma('encoding = "UTF-8"');
    this.db.pragma("journal_mode = WAL");
  }
  async initialize() {
    if (this.initialized) return;
    try {
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS memories (
          id TEXT PRIMARY KEY,
          content TEXT NOT NULL,
          memoryType TEXT NOT NULL CHECK(memoryType IN ('working', 'episodic', 'semantic')),
          role TEXT CHECK(role IN ('user', 'assistant', 'system')),
          speaker TEXT,
          keywords TEXT,
          metadata TEXT,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL
        )
      `);
    } catch (e) {
      this.logger.warn("Table creation warning: " + e.message);
    }
    try {
      this.db.exec(`ALTER TABLE memories ADD COLUMN role TEXT CHECK(role IN ('user', 'assistant', 'system'))`);
    } catch (e) {
    }
    try {
      this.db.exec(`ALTER TABLE memories ADD COLUMN speaker TEXT`);
    } catch (e) {
    }
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_memories_type ON memories(memoryType)
    `);
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_memories_role ON memories(role)
    `);
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_memories_created ON memories(createdAt DESC)
    `);
    this.initialized = true;
    this.logger.info("MemoryRepository initialized");
  }
  async create(entry) {
    const id = generateId();
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const stmt = this.db.prepare(`
      INSERT INTO memories (id, content, memoryType, role, speaker, keywords, metadata, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id,
      entry.content,
      entry.memoryType,
      entry.role || null,
      entry.speaker || null,
      entry.keywords ? JSON.stringify(entry.keywords) : null,
      entry.metadata ? JSON.stringify(entry.metadata) : null,
      now,
      now
    );
    return {
      id,
      ...entry,
      createdAt: now,
      updatedAt: now
    };
  }
  async findById(id) {
    const stmt = this.db.prepare("SELECT * FROM memories WHERE id = ?");
    const row = stmt.get(id);
    if (!row) return null;
    return this.mapRowToEntry(row);
  }
  async findAll(pagination) {
    const limit = pagination?.pageSize || 100;
    const offset = ((pagination?.page || 1) - 1) * limit;
    const countStmt = this.db.prepare("SELECT COUNT(*) as total FROM memories");
    const { total } = countStmt.get();
    const stmt = this.db.prepare(`
      SELECT * FROM memories 
      ORDER BY createdAt DESC 
      LIMIT ? OFFSET ?
    `);
    const rows = stmt.all(limit, offset);
    const entries = rows.map((row) => this.mapRowToEntry(row));
    return {
      items: entries,
      total,
      page: pagination?.page || 1,
      pageSize: limit
    };
  }
  async findByType(memoryType, pagination) {
    const limit = pagination?.pageSize || 100;
    const offset = ((pagination?.page || 1) - 1) * limit;
    const countStmt = this.db.prepare("SELECT COUNT(*) as total FROM memories WHERE memoryType = ?");
    const { total } = countStmt.get(memoryType);
    const stmt = this.db.prepare(`
      SELECT * FROM memories 
      WHERE memoryType = ?
      ORDER BY createdAt DESC 
      LIMIT ? OFFSET ?
    `);
    const rows = stmt.all(memoryType, limit, offset);
    const entries = rows.map((row) => this.mapRowToEntry(row));
    return {
      items: entries,
      total,
      page: pagination?.page || 1,
      pageSize: limit
    };
  }
  async search(query, memoryType) {
    let sql = "SELECT * FROM memories WHERE content LIKE ?";
    const params = [`%${query}%`];
    if (memoryType) {
      sql += " AND memoryType = ?";
      params.push(memoryType);
    }
    sql += " ORDER BY createdAt DESC LIMIT 50";
    const stmt = this.db.prepare(sql);
    const rows = stmt.all(...params);
    return rows.map((row) => this.mapRowToEntry(row));
  }
  async update(id, updates) {
    const existing = await this.findById(id);
    if (!existing) {
      throw new NotFoundError(`Memory ${id} not found`);
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const stmt = this.db.prepare(`
      UPDATE memories 
      SET content = ?, memoryType = ?, role = ?, speaker = ?, keywords = ?, metadata = ?, updatedAt = ?
      WHERE id = ?
    `);
    stmt.run(
      updates.content ?? existing.content,
      updates.memoryType ?? existing.memoryType,
      updates.role ?? existing.role ?? null,
      updates.speaker ?? existing.speaker ?? null,
      updates.keywords ? JSON.stringify(updates.keywords) : existing.keywords ? JSON.stringify(existing.keywords) : null,
      updates.metadata ? JSON.stringify(updates.metadata) : existing.metadata ? JSON.stringify(existing.metadata) : null,
      now,
      id
    );
    return {
      ...existing,
      ...updates,
      updatedAt: now
    };
  }
  async delete(id) {
    const stmt = this.db.prepare("DELETE FROM memories WHERE id = ?");
    const result = stmt.run(id);
    return result.changes > 0;
  }
  async count() {
    const stmt = this.db.prepare("SELECT COUNT(*) as count FROM memories");
    const result = stmt.get();
    return result.count;
  }
  async countByType(memoryType) {
    const stmt = this.db.prepare("SELECT COUNT(*) as count FROM memories WHERE memoryType = ?");
    const result = stmt.get(memoryType);
    return result.count;
  }
  async countByRole(role) {
    const stmt = this.db.prepare("SELECT COUNT(*) as count FROM memories WHERE role = ?");
    const result = stmt.get(role);
    return result.count;
  }
  async findByRole(role, pagination) {
    const limit = pagination?.pageSize || 100;
    const offset = ((pagination?.page || 1) - 1) * limit;
    const countStmt = this.db.prepare("SELECT COUNT(*) as total FROM memories WHERE role = ?");
    const { total } = countStmt.get(role);
    const stmt = this.db.prepare(`
      SELECT * FROM memories 
      WHERE role = ?
      ORDER BY createdAt DESC 
      LIMIT ? OFFSET ?
    `);
    const rows = stmt.all(role, limit, offset);
    const entries = rows.map((row) => this.mapRowToEntry(row));
    return {
      items: entries,
      total,
      page: pagination?.page || 1,
      pageSize: limit
    };
  }
  async clearByType(memoryType) {
    const stmt = this.db.prepare("DELETE FROM memories WHERE memoryType = ?");
    const result = stmt.run(memoryType);
    return result.changes;
  }
  async shutdown() {
    this.db.close();
    this.initialized = false;
    this.logger.info("MemoryRepository shutdown");
  }
  mapRowToEntry(row) {
    return {
      id: row.id,
      content: row.content,
      memoryType: row.memoryType,
      role: row.role || void 0,
      speaker: row.speaker || void 0,
      keywords: row.keywords ? JSON.parse(row.keywords) : void 0,
      metadata: row.metadata ? JSON.parse(row.metadata) : void 0,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    };
  }
};
var memoryRepository = new MemoryRepository();

// src/core/database/index.ts
init_utils();

// src/api/SkillsController.ts
init_retrieval();

// src/core/learning/LearningControlService.ts
init_logger();
init_errors();
init_types();
init_utils();
var DEFAULT_CONFIG4 = {
  strategy: "EPSILON_GREEDY" /* EPSILON_GREEDY */,
  epsilon: 0.1,
  epsilonDecay: 0.995,
  epsilonMin: 0.01,
  learningRate: 1e-3,
  discountFactor: 0.95,
  explorationBonus: 2,
  batchSize: 32,
  memorySize: 1e4,
  targetUpdateFrequency: 100
};
var LearningControlService = class {
  constructor(config = {}) {
    this.logger = createLogger("LearningControlService");
    this.policies = /* @__PURE__ */ new Map();
    this.episodeMemory = [];
    this.actionRewards = /* @__PURE__ */ new Map();
    this.initialized = false;
    this.config = { ...DEFAULT_CONFIG4, ...config };
    this.epsilon = this.config.epsilon;
    this.metrics = this.createInitialMetrics();
    this.logger.info("LearningControlService initialized", { config: this.config });
  }
  createInitialMetrics() {
    return {
      totalEpisodes: 0,
      totalRewards: 0,
      averageReward: 0,
      explorationRate: this.epsilon,
      convergenceScore: 0
    };
  }
  async initialize() {
    if (this.initialized) {
      return;
    }
    this.initialized = true;
    this.logger.info("LearningControlService setup complete");
  }
  async shutdown() {
    this.initialized = false;
    this.policies.clear();
    this.episodeMemory = [];
    this.actionRewards.clear();
    this.logger.info("LearningControlService shutdown complete");
  }
  async selectAction(policyId, state) {
    try {
      const policy = this.policies.get(policyId);
      if (!policy) {
        return err(new ValidationError(`Policy not found: ${policyId}`));
      }
      const exploration = this.shouldExplore();
      let selectedAction;
      if (exploration) {
        selectedAction = this.selectRandomAction(policy);
        this.logger.debug("Exploration: selected random action", { action: selectedAction.name });
      } else {
        selectedAction = this.selectBestAction(policy);
        this.logger.debug("Exploitation: selected best action", { action: selectedAction.name, score: selectedAction.score });
      }
      return ok(selectedAction);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Unknown selection error";
      this.logger.error("Action selection failed", error);
      return err(new LearningError(errMsg));
    }
  }
  shouldExplore() {
    return Math.random() < this.epsilon;
  }
  selectRandomAction(policy) {
    const actions = Array.from(policy.actionScores.keys());
    const randomIndex = Math.floor(Math.random() * actions.length);
    const actionName = actions[randomIndex];
    return {
      id: generateId(),
      name: actionName,
      score: policy.actionScores.get(actionName) || 0,
      count: policy.actionCounts.get(actionName) || 0
    };
  }
  selectBestAction(policy) {
    let bestActionName = "";
    let bestScore = -Infinity;
    for (const [actionName, score] of policy.actionScores.entries()) {
      let adjustedScore = score;
      if (this.config.strategy === "UCB1" /* UCB1 */ && policy.totalSelections > 0) {
        const count = policy.actionCounts.get(actionName) || 0;
        if (count > 0) {
          const ucb1Bonus = this.config.explorationBonus * Math.sqrt(
            Math.log(policy.totalSelections) / count
          );
          adjustedScore += ucb1Bonus;
        }
      }
      if (adjustedScore > bestScore) {
        bestScore = adjustedScore;
        bestActionName = actionName;
      }
    }
    return {
      id: generateId(),
      name: bestActionName,
      score: bestScore,
      count: policy.actionCounts.get(bestActionName) || 0
    };
  }
  async recordFeedback(feedback) {
    try {
      this.logger.debug("Recording feedback", { taskId: feedback.taskId, feedbackType: feedback.feedback });
      const policyId = `policy_${feedback.taskId}`;
      let policy = this.policies.get(policyId);
      if (!policy) {
        policy = this.createPolicy(policyId, feedback.query);
        this.policies.set(policyId, policy);
      }
      const reward = this.computeReward(feedback);
      const action = feedback.retrievedIds[0] || "unknown";
      await this.recordEpisode({
        id: generateId(),
        state: feedback.query,
        action,
        reward,
        done: true,
        timestamp: /* @__PURE__ */ new Date()
      });
      this.updatePolicy(policy, action, reward);
      this.updateMetrics(reward);
      this.decayEpsilon();
      return ok(void 0);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Unknown feedback error";
      this.logger.error("Failed to record feedback", error);
      return err(new LearningError(errMsg));
    }
  }
  computeReward(feedback) {
    switch (feedback.feedback) {
      case "RELEVANT" /* RELEVANT */:
        return 1;
      case "PARTIALLY_RELEVANT" /* PARTIALLY_RELEVANT */:
        return 0.5;
      case "BOOKMARK" /* BOOKMARK */:
        return 0.3;
      case "IRRELEVANT" /* IRRELEVANT */:
        return -0.5;
      case "BAD" /* BAD */:
        return -1;
      default:
        return 0;
    }
  }
  async recordEpisode(episode) {
    this.episodeMemory.push(episode);
    if (this.episodeMemory.length > this.config.memorySize) {
      this.episodeMemory.shift();
    }
    const rewards = this.actionRewards.get(episode.action) || [];
    rewards.push(episode.reward);
    if (rewards.length > 1e3) {
      rewards.shift();
    }
    this.actionRewards.set(episode.action, rewards);
  }
  updatePolicy(policy, action, reward) {
    const currentScore = policy.actionScores.get(action) || 0;
    const count = (policy.actionCounts.get(action) || 0) + 1;
    let newScore;
    switch (this.config.strategy) {
      case "REINFORCE" /* REINFORCE */:
        newScore = currentScore + this.config.learningRate * (reward - currentScore);
        break;
      case "EPSILON_GREEDY" /* EPSILON_GREEDY */:
      case "UCB1" /* UCB1 */:
      default:
        newScore = currentScore + this.config.learningRate * (reward - currentScore);
        break;
    }
    policy.actionScores.set(action, newScore);
    policy.actionCounts.set(action, count);
    policy.totalSelections++;
    policy.lastUpdated = /* @__PURE__ */ new Date();
  }
  updateMetrics(reward) {
    this.metrics.totalEpisodes++;
    this.metrics.totalRewards += reward;
    this.metrics.averageReward = this.metrics.totalRewards / this.metrics.totalEpisodes;
    this.metrics.explorationRate = this.epsilon;
    this.calculateConvergenceScore();
  }
  calculateConvergenceScore() {
    let maxDiff = 0;
    for (const [, scores] of this.policies) {
      const scoreArray = Array.from(scores.actionScores.values());
      if (scoreArray.length < 2) continue;
      scoreArray.sort((a, b) => a - b);
      const diff = scoreArray[scoreArray.length - 1] - scoreArray[0];
      maxDiff = Math.max(maxDiff, diff);
    }
    this.metrics.convergenceScore = Math.max(0, 1 - maxDiff);
  }
  decayEpsilon() {
    if (this.epsilon > this.config.epsilonMin) {
      this.epsilon *= this.config.epsilonDecay;
      this.epsilon = Math.max(this.epsilon, this.config.epsilonMin);
    }
  }
  createPolicy(id, name) {
    return {
      id,
      name,
      actionScores: /* @__PURE__ */ new Map(),
      actionCounts: /* @__PURE__ */ new Map(),
      totalSelections: 0,
      lastUpdated: /* @__PURE__ */ new Date()
    };
  }
  async addAction(policyId, actionName, initialScore = 0) {
    const policy = this.policies.get(policyId);
    if (!policy) {
      return err(new ValidationError(`Policy not found: ${policyId}`));
    }
    if (!policy.actionScores.has(actionName)) {
      policy.actionScores.set(actionName, initialScore);
      policy.actionCounts.set(actionName, 0);
      this.logger.debug("Added action to policy", { policyId, actionName });
    }
    return ok(void 0);
  }
  async removeAction(policyId, actionName) {
    const policy = this.policies.get(policyId);
    if (!policy) {
      return err(new ValidationError(`Policy not found: ${policyId}`));
    }
    policy.actionScores.delete(actionName);
    policy.actionCounts.delete(actionName);
    this.logger.debug("Removed action from policy", { policyId, actionName });
    return ok(void 0);
  }
  getPolicy(policyId) {
    return this.policies.get(policyId);
  }
  getAllPolicies() {
    return Array.from(this.policies.values());
  }
  getMetrics() {
    return { ...this.metrics };
  }
  getActionStatistics(actionName) {
    const rewards = this.actionRewards.get(actionName);
    if (!rewards || rewards.length === 0) {
      return null;
    }
    return {
      averageReward: rewards.reduce((a, b) => a + b, 0) / rewards.length,
      selectionCount: rewards.length,
      lastReward: rewards[rewards.length - 1]
    };
  }
  async resetPolicy(policyId) {
    const policy = this.policies.get(policyId);
    if (!policy) {
      return err(new ValidationError(`Policy not found: ${policyId}`));
    }
    for (const action of policy.actionScores.keys()) {
      policy.actionScores.set(action, 0);
      policy.actionCounts.set(action, 0);
    }
    policy.totalSelections = 0;
    policy.lastUpdated = /* @__PURE__ */ new Date();
    this.logger.info("Policy reset", { policyId });
    return ok(void 0);
  }
  async resetAll() {
    this.policies.clear();
    this.episodeMemory = [];
    this.actionRewards.clear();
    this.metrics = this.createInitialMetrics();
    this.epsilon = this.config.epsilon;
    this.logger.info("All learning state reset");
  }
  updateConfig(config) {
    this.config.strategy = config.strategy ?? this.config.strategy;
    this.config.epsilon = config.epsilon ?? this.config.epsilon;
    this.config.learningRate = config.learningRate ?? this.config.learningRate;
    this.config.epsilonDecay = config.epsilonDecay ?? this.config.epsilonDecay;
    this.config.epsilonMin = config.epsilonMin ?? this.config.epsilonMin;
    if (config.epsilon !== void 0) {
      this.epsilon = config.epsilon;
    }
    this.logger.info("Learning config updated", { config: this.config });
  }
};
var learningControlService = new LearningControlService();

// src/core/learning/index.ts
init_types();

// src/core/scheduling/TaskScheduler.ts
init_logger();
init_errors();
init_types();
init_utils();
var DEFAULT_CONFIG5 = {
  maxConcurrentTasks: 10,
  maxQueuedTasks: 1e3,
  taskTimeoutMs: 3e4,
  retryAttempts: 3,
  retryDelayMs: 1e3,
  enablePriorityQueue: true,
  enableTaskDependencies: true,
  healthCheckIntervalMs: 6e4
};
var TaskScheduler = class {
  constructor(config = {}) {
    this.logger = createLogger("TaskScheduler");
    this.taskQueue = [];
    this.runningTasks = /* @__PURE__ */ new Map();
    this.completedTasks = /* @__PURE__ */ new Map();
    this.taskExecutors = /* @__PURE__ */ new Map();
    this.isRunning = false;
    this.processingLoop = null;
    this.config = { ...DEFAULT_CONFIG5, ...config };
    this.metrics = this.createInitialMetrics();
    this.logger.info("TaskScheduler initialized", { config: this.config });
  }
  createInitialMetrics() {
    return {
      totalTasksSubmitted: 0,
      totalTasksCompleted: 0,
      totalTasksFailed: 0,
      totalTasksCancelled: 0,
      activeTasks: 0,
      queuedTasks: 0,
      averageExecutionTime: 0,
      throughput: 0
    };
  }
  async start() {
    if (this.isRunning) {
      this.logger.warn("TaskScheduler already running");
      return;
    }
    this.isRunning = true;
    this.processingLoop = setInterval(() => this.processQueue(), 1e3);
    this.logger.info("TaskScheduler started");
  }
  async stop() {
    if (!this.isRunning) {
      return;
    }
    this.isRunning = false;
    if (this.processingLoop) {
      clearInterval(this.processingLoop);
      this.processingLoop = null;
    }
    await this.cancelAllTasks();
    this.logger.info("TaskScheduler stopped");
  }
  registerExecutor(type, executor) {
    this.taskExecutors.set(type, executor);
    this.logger.debug("Registered task executor", { type });
  }
  async submitTask(taskData) {
    try {
      if (this.taskQueue.length >= this.config.maxQueuedTasks) {
        return err(new SchedulingError("Task queue is full", {
          maxQueueSize: this.config.maxQueuedTasks,
          currentSize: this.taskQueue.length
        }));
      }
      if (this.config.enableTaskDependencies && taskData.dependencies.length > 0) {
        const depsValid = await this.validateDependencies(taskData.dependencies);
        if (!depsValid) {
          return err(new SchedulingError("Invalid task dependencies"));
        }
      }
      const now = /* @__PURE__ */ new Date();
      const task = {
        ...taskData,
        id: generateId(),
        status: "PENDING" /* PENDING */,
        progress: 0,
        retryCount: 0,
        createdAt: now,
        updatedAt: now
      };
      this.taskQueue.push(task);
      this.taskQueue.sort((a, b) => {
        if (a.priority !== b.priority) {
          return b.priority - a.priority;
        }
        return a.scheduledAt.getTime() - b.scheduledAt.getTime();
      });
      this.metrics.totalTasksSubmitted++;
      this.updateMetrics();
      this.logger.info("Task submitted", { taskId: task.id, type: task.type, priority: task.priority });
      return ok(task);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Unknown submission error";
      this.logger.error("Failed to submit task", error);
      return err(new SchedulingError(errMsg));
    }
  }
  async validateDependencies(dependencies) {
    for (const depId of dependencies) {
      const depTask = this.findTask(depId);
      if (!depTask) {
        this.logger.warn("Dependency not found", { dependencyId: depId });
        return false;
      }
      if (depTask.status !== "COMPLETED" /* COMPLETED */) {
        return false;
      }
    }
    return true;
  }
  findTask(taskId) {
    const inQueue = this.taskQueue.find((t) => t.id === taskId);
    if (inQueue) return inQueue;
    const inProgress = this.runningTasks.get(taskId);
    if (inProgress) return inProgress;
    const completed = this.completedTasks.get(taskId);
    return completed;
  }
  async getTask(taskId) {
    return this.findTask(taskId) || null;
  }
  async cancelTask(taskId) {
    const task = this.findTask(taskId);
    if (!task) {
      return err(new NotFoundError("Task", taskId));
    }
    switch (task.status) {
      case "PENDING" /* PENDING */:
        this.removeFromQueue(taskId);
        task.status = "CANCELLED" /* CANCELLED */;
        task.updatedAt = /* @__PURE__ */ new Date();
        this.metrics.totalTasksCancelled++;
        this.updateMetrics();
        this.logger.info("Task cancelled", { taskId });
        break;
      case "RUNNING" /* RUNNING */:
        task.status = "CANCELLED" /* CANCELLED */;
        task.updatedAt = /* @__PURE__ */ new Date();
        this.runningTasks.delete(taskId);
        this.metrics.totalTasksCancelled++;
        this.updateMetrics();
        this.logger.info("Running task cancelled", { taskId });
        break;
      case "COMPLETED" /* COMPLETED */:
      case "FAILED" /* FAILED */:
      case "CANCELLED" /* CANCELLED */:
        this.logger.warn("Cannot cancel task in terminal state", { taskId, status: task.status });
        return err(new SchedulingError("Task is already in terminal state"));
      default:
        return err(new SchedulingError(`Unknown task status: ${task.status}`));
    }
    return ok(void 0);
  }
  removeFromQueue(taskId) {
    const index = this.taskQueue.findIndex((t) => t.id === taskId);
    if (index !== -1) {
      this.taskQueue.splice(index, 1);
    }
  }
  async retryTask(taskId) {
    const task = this.findTask(taskId);
    if (!task) {
      return err(new NotFoundError("Task", taskId));
    }
    if (task.status !== "FAILED" /* FAILED */) {
      return err(new SchedulingError("Only failed tasks can be retried"));
    }
    if (task.retryCount >= this.config.retryAttempts) {
      return err(new SchedulingError("Maximum retry attempts exceeded"));
    }
    task.status = "PENDING" /* PENDING */;
    task.retryCount++;
    task.progress = 0;
    task.error = void 0;
    task.updatedAt = /* @__PURE__ */ new Date();
    this.taskQueue.push(task);
    this.taskQueue.sort((a, b) => {
      if (a.priority !== b.priority) {
        return b.priority - a.priority;
      }
      return a.scheduledAt.getTime() - b.scheduledAt.getTime();
    });
    this.logger.info("Task queued for retry", { taskId, retryCount: task.retryCount });
    return ok(void 0);
  }
  async processQueue() {
    if (!this.isRunning) return;
    if (this.runningTasks.size >= this.config.maxConcurrentTasks) {
      return;
    }
    const availableSlots = this.config.maxConcurrentTasks - this.runningTasks.size;
    for (let i = 0; i < availableSlots; i++) {
      const readyTask = this.findReadyTask();
      if (!readyTask) break;
      this.removeFromQueue(readyTask.id);
      await this.executeTask(readyTask);
    }
  }
  findReadyTask() {
    for (const task of this.taskQueue) {
      if (this.config.enableTaskDependencies) {
        const depsValid = this.validateDependenciesSync(task.dependencies);
        if (depsValid) {
          return task;
        }
      } else {
        return task;
      }
    }
    return void 0;
  }
  validateDependenciesSync(dependencies) {
    for (const depId of dependencies) {
      const depTask = this.findTask(depId);
      if (!depTask || depTask.status !== "COMPLETED" /* COMPLETED */) {
        return false;
      }
    }
    return true;
  }
  async executeTask(task) {
    task.status = "RUNNING" /* RUNNING */;
    task.startedAt = /* @__PURE__ */ new Date();
    task.updatedAt = /* @__PURE__ */ new Date();
    this.runningTasks.set(task.id, task);
    this.metrics.activeTasks++;
    this.updateMetrics();
    const executor = this.taskExecutors.get(task.type);
    if (!executor) {
      task.status = "FAILED" /* FAILED */;
      task.error = `No executor registered for task type: ${task.type}`;
      task.updatedAt = /* @__PURE__ */ new Date();
      this.runningTasks.delete(task.id);
      this.completedTasks.set(task.id, task);
      this.metrics.totalTasksFailed++;
      this.metrics.activeTasks--;
      this.updateMetrics();
      this.logger.error("Task failed - no executor", { taskId: task.id, type: task.type });
      return;
    }
    const startTime = Date.now();
    try {
      const timeoutPromise = sleep(this.config.taskTimeoutMs).then(() => {
        throw new TimeoutError(task.type, this.config.taskTimeoutMs);
      });
      const executePromise = executor.execute(task);
      const completedTask = await Promise.race([executePromise, timeoutPromise]);
      Object.assign(task, completedTask);
      task.status = "COMPLETED" /* COMPLETED */;
      task.progress = 100;
      task.completedAt = /* @__PURE__ */ new Date();
      task.updatedAt = /* @__PURE__ */ new Date();
      this.runningTasks.delete(task.id);
      this.completedTasks.set(task.id, task);
      this.metrics.totalTasksCompleted++;
      this.metrics.activeTasks--;
      const executionTime = Date.now() - startTime;
      this.updateAverageExecutionTime(executionTime);
      this.updateMetrics();
      this.logger.info("Task completed", {
        taskId: task.id,
        executionTime,
        retryCount: task.retryCount
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      if (error instanceof TimeoutError) {
        task.status = "FAILED" /* FAILED */;
        task.error = `Task timed out after ${this.config.taskTimeoutMs}ms`;
      } else {
        task.status = "FAILED" /* FAILED */;
        task.error = errorMessage;
      }
      task.updatedAt = /* @__PURE__ */ new Date();
      this.runningTasks.delete(task.id);
      this.completedTasks.set(task.id, task);
      this.metrics.totalTasksFailed++;
      this.metrics.activeTasks--;
      this.updateMetrics();
      this.logger.error("Task execution failed", error, { taskId: task.id });
    }
  }
  updateAverageExecutionTime(executionTime) {
    const completed = this.metrics.totalTasksCompleted;
    const currentAvg = this.metrics.averageExecutionTime;
    this.metrics.averageExecutionTime = (currentAvg * (completed - 1) + executionTime) / completed;
  }
  async getTasksByStatus(status) {
    const results = [];
    for (const task of this.taskQueue) {
      if (task.status === status) {
        results.push(task);
      }
    }
    for (const task of this.runningTasks.values()) {
      if (task.status === status) {
        results.push(task);
      }
    }
    for (const task of this.completedTasks.values()) {
      if (task.status === status) {
        results.push(task);
      }
    }
    return results;
  }
  async getTaskHistory(limit = 100) {
    const completed = Array.from(this.completedTasks.values());
    completed.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    return completed.slice(0, limit);
  }
  async cancelAllTasks() {
    for (const task of this.taskQueue) {
      task.status = "CANCELLED" /* CANCELLED */;
      task.updatedAt = /* @__PURE__ */ new Date();
      this.metrics.totalTasksCancelled++;
    }
    this.taskQueue = [];
    for (const task of this.runningTasks.values()) {
      task.status = "CANCELLED" /* CANCELLED */;
      task.updatedAt = /* @__PURE__ */ new Date();
      this.metrics.totalTasksCancelled++;
    }
    this.runningTasks.clear();
    this.updateMetrics();
    this.logger.info("All tasks cancelled");
  }
  getMetrics() {
    return { ...this.metrics, queuedTasks: this.taskQueue.length };
  }
  updateMetrics() {
    const totalProcessed = this.metrics.totalTasksCompleted + this.metrics.totalTasksFailed;
    if (totalProcessed > 0 && this.metrics.totalTasksCompleted > 0) {
      this.metrics.throughput = Math.round(
        this.metrics.totalTasksCompleted / totalProcessed * 100
      );
    }
  }
  getQueueStatus() {
    return {
      queued: this.taskQueue.length,
      running: this.runningTasks.size,
      completed: this.metrics.totalTasksCompleted,
      failed: this.metrics.totalTasksFailed,
      maxConcurrent: this.config.maxConcurrentTasks,
      maxQueued: this.config.maxQueuedTasks
    };
  }
  updateConfig(config) {
    Object.assign(this.config, config);
    this.logger.info("Scheduler config updated", { config: this.config });
  }
  clearCompletedTasks() {
    const beforeCount = this.completedTasks.size;
    this.completedTasks.clear();
    this.logger.info("Cleared completed tasks cache", { count: beforeCount });
  }
};
var taskScheduler = new TaskScheduler();

// src/core/scheduling/index.ts
init_types();

// src/api/SkillsController.ts
init_types();
init_errors();
init_utils();
function getResultError(result) {
  return isErr(result) ? result.error : void 0;
}
var SkillsController = class extends BaseController {
  async processData(req, res) {
    try {
      const { content, format, source, metadata } = req.body;
      const rawData = {
        id: `data_${Date.now()}`,
        content: content || "",
        format: format || "text" /* TEXT */,
        source: source || "api" /* API */,
        metadata: metadata || {},
        receivedAt: /* @__PURE__ */ new Date(),
        size: content ? content.length : 0
      };
      const result = await dataInputService.process(rawData);
      if (!result.success) {
        res.status(400).json(errorResponse(getResultError(result)));
        return;
      }
      res.json(successResponse(result.data));
    } catch (error) {
      res.status(500).json(this.handleError(error));
    }
  }
  async extractKnowledge(req, res) {
    try {
      const { text, context } = req.body;
      if (!text) {
        throw new AppError("VALIDATION_ERROR" /* VALIDATION_ERROR */, "Text is required", 400);
      }
      const result = await knowledgeExtractionService.extract(text, context);
      if (!result.success) {
        res.status(500).json(errorResponse(getResultError(result)));
        return;
      }
      res.json(successResponse(result.data));
    } catch (error) {
      res.status(500).json(this.handleError(error));
    }
  }
  async fuseKnowledge(req, res) {
    try {
      const { entries } = req.body;
      if (!entries || !Array.isArray(entries)) {
        throw new AppError("VALIDATION_ERROR" /* VALIDATION_ERROR */, "Entries array is required", 400);
      }
      const result = await knowledgeFusionService.fuseEntries(entries);
      if (!result.success) {
        res.status(500).json(errorResponse(getResultError(result)));
        return;
      }
      const savedEntries = [];
      for (const entry of result.data) {
        const saved = await knowledgeRepository.create(entry);
        savedEntries.push(saved);
      }
      res.json(successResponse({ fusedEntries: savedEntries }));
    } catch (error) {
      res.status(500).json(this.handleError(error));
    }
  }
  async createKnowledgeEntry(req, res) {
    try {
      const { content, type, entities, relations, tags, source } = req.body;
      const entry = await knowledgeRepository.create({
        content,
        type: type || "DOCUMENT" /* DOCUMENT */,
        entities: entities || [],
        relations: relations || [],
        confidence: 1,
        source: source || "api",
        tags: tags || [],
        status: "ACTIVE" /* ACTIVE */,
        version: 1
      });
      if (entities && entities.length > 0) {
        await knowledgeFusionService.addToGraph(entities, relations || []);
      }
      res.status(201).json(successResponse(entry));
    } catch (error) {
      const appError = error;
      if (appError.code === "ALREADY_EXISTS" /* ALREADY_EXISTS */) {
        res.status(409).json(errorResponse(appError));
        return;
      }
      res.status(500).json(this.handleError(error));
    }
  }
  async searchKnowledge(req, res) {
    try {
      const { query, limit: queryLimit, filters: queryFilters } = req.query;
      if (!query) {
        throw new AppError("VALIDATION_ERROR" /* VALIDATION_ERROR */, "Query is required", 400);
      }
      const useVector = req.query.useVector === "true" || process.env.ENABLE_VECTOR_SEARCH === "true";
      const limit = req.query.limit || queryLimit || 10;
      const context = {
        query,
        limit: parseInt(limit, 10),
        filters: queryFilters ? JSON.parse(queryFilters) : void 0,
        useVector
      };
      const result = await retrievalService2.retrieve(context);
      if (!result.success) {
        res.status(500).json(errorResponse(getResultError(result)));
        return;
      }
      res.json(successResponse({
        results: result.data,
        query: context.query,
        count: result.data?.length || 0
      }));
    } catch (error) {
      res.status(500).json(this.handleError(error));
    }
  }
  async submitLearningFeedback(req, res) {
    try {
      const { taskId, query, retrievedIds, selectedId, relevanceScore, feedback } = req.body;
      if (!taskId || !feedback) {
        throw new AppError("VALIDATION_ERROR" /* VALIDATION_ERROR */, "taskId and feedback are required", 400);
      }
      const feedbackData = {
        taskId,
        query: query || "",
        retrievedIds: retrievedIds || [],
        selectedId,
        relevanceScore,
        feedback
      };
      const result = await learningControlService.recordFeedback(feedbackData);
      if (!result.success) {
        res.status(500).json(errorResponse(getResultError(result)));
        return;
      }
      res.json(successResponse({ message: "Feedback recorded successfully" }));
    } catch (error) {
      res.status(500).json(this.handleError(error));
    }
  }
  async submitTask(req, res) {
    try {
      const { type, priority, input, dependencies, maxRetries } = req.body;
      if (!type) {
        throw new AppError("VALIDATION_ERROR" /* VALIDATION_ERROR */, "Task type is required", 400);
      }
      const taskData = {
        type,
        priority: priority || 1 /* NORMAL */,
        input: input || {},
        dependencies: dependencies || [],
        maxRetries: maxRetries || 3,
        scheduledAt: /* @__PURE__ */ new Date(),
        metadata: {},
        version: 1
      };
      const result = await taskScheduler.submitTask(taskData);
      if (!result.success) {
        res.status(500).json(errorResponse(getResultError(result)));
        return;
      }
      res.status(201).json(successResponse(result.data));
    } catch (error) {
      res.status(500).json(this.handleError(error));
    }
  }
  async getTaskStatus(req, res) {
    try {
      const { taskId } = req.params;
      const task = await taskScheduler.getTask(taskId);
      if (!task) {
        throw new AppError("NOT_FOUND" /* NOT_FOUND */, "Task not found", 404);
      }
      res.json(successResponse(task));
    } catch (error) {
      const appError = error;
      if (appError.code === "NOT_FOUND" /* NOT_FOUND */) {
        res.status(404).json(errorResponse(appError));
        return;
      }
      res.status(500).json(this.handleError(error));
    }
  }
  async getSystemStats(req, res) {
    try {
      const [inputStats, extractionCache, graphStats, retrievalStats, schedulerMetrics] = await Promise.all([
        Promise.resolve(dataInputService.getStatistics()),
        Promise.resolve(knowledgeExtractionService.getCacheStats()),
        Promise.resolve(knowledgeFusionService.getStatistics()),
        Promise.resolve(retrievalService2.getStatistics()),
        Promise.resolve(taskScheduler.getMetrics())
      ]);
      res.json(successResponse({
        dataInput: inputStats,
        knowledgeExtraction: extractionCache,
        knowledgeGraph: graphStats,
        retrieval: retrievalStats,
        scheduler: schedulerMetrics,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }));
    } catch (error) {
      res.status(500).json(this.handleError(error));
    }
  }
  async listKnowledge(req, res) {
    try {
      const { limit, offset } = req.query;
      const limitNum = limit ? parseInt(limit, 10) : 50;
      const offsetNum = offset ? parseInt(offset, 10) : 0;
      const result = await knowledgeRepository.findAll({ page: Math.floor(offsetNum / limitNum) + 1, pageSize: limitNum });
      res.json(successResponse({ entries: result.items, total: result.total }));
    } catch (error) {
      res.status(500).json(this.handleError(error));
    }
  }
  async getKnowledgeCount(req, res) {
    try {
      const count = await knowledgeRepository.count();
      res.json(successResponse({ count }));
    } catch (error) {
      res.status(500).json(this.handleError(error));
    }
  }
  async deleteKnowledge(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json(errorResponse({ code: "VALIDATION_ERROR", message: "ID is required" }));
        return;
      }
      const deleted = await knowledgeRepository.delete(id);
      if (deleted) {
        res.json(successResponse({ deleted: true, id }));
      } else {
        res.status(404).json(errorResponse({ code: "NOT_FOUND", message: "Knowledge entry not found" }));
      }
    } catch (error) {
      res.status(500).json(this.handleError(error));
    }
  }
  async updateKnowledge(req, res) {
    try {
      const { id } = req.params;
      const { content, tags, source, type, status } = req.body;
      if (!id) {
        res.status(400).json(errorResponse({ code: "VALIDATION_ERROR", message: "ID is required" }));
        return;
      }
      const updateData = {};
      if (content !== void 0) updateData.content = content;
      if (tags !== void 0) updateData.tags = tags;
      if (source !== void 0) updateData.source = source;
      if (type !== void 0) updateData.type = type;
      if (status !== void 0) updateData.status = status;
      const updated = await knowledgeRepository.update(id, updateData);
      res.json(successResponse({ updated: true, entry: updated }));
    } catch (error) {
      if (error.message?.includes("not found")) {
        res.status(404).json(errorResponse({ code: "NOT_FOUND", message: "Knowledge entry not found" }));
      } else {
        res.status(500).json(this.handleError(error));
      }
    }
  }
  async importFromFolder(req, res) {
    try {
      const { folderPath, source } = req.body;
      if (!folderPath) {
        res.status(400).json(errorResponse({ code: "VALIDATION_ERROR", message: "folderPath is required" }));
        return;
      }
      const fs2 = require("fs");
      const path3 = require("path");
      if (!fs2.existsSync(folderPath)) {
        res.status(400).json(errorResponse({ code: "NOT_FOUND", message: "Folder not found" }));
        return;
      }
      const supportedExtensions = [".txt", ".md", ".json", ".csv", ".html", ".xml", ".pdf", ".docx", ".xlsx"];
      const imported = [];
      const errors2 = [];
      async function scanDir(dir) {
        const items = fs2.readdirSync(dir);
        for (const item of items) {
          const fullPath = path3.join(dir, item);
          const stat = fs2.statSync(fullPath);
          if (stat.isDirectory()) {
            await scanDir(fullPath);
          } else if (stat.isFile()) {
            const ext = path3.extname(item).toLowerCase();
            if (supportedExtensions.includes(ext)) {
              await processFile(fullPath);
            }
          }
        }
      }
      async function processFile(filePath) {
        try {
          let content = fs2.readFileSync(filePath, "utf-8");
          const ext = path3.extname(filePath).toLowerCase();
          if (ext === ".html" || ext === ".xml") {
            content = content.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "").replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
          }
          if (ext === ".json") {
            try {
              const data = JSON.parse(content);
              const extractText = (obj) => {
                const texts = [];
                if (typeof obj === "string") {
                  texts.push(obj);
                } else if (Array.isArray(obj)) {
                  for (const item of obj) {
                    texts.push(...extractText(item));
                  }
                } else if (obj && typeof obj === "object") {
                  for (const key of Object.keys(obj)) {
                    const val = obj[key];
                    if (["id", "uuid", "date", "timestamp", "createdAt", "updatedAt"].includes(key)) continue;
                    texts.push(...extractText(val));
                  }
                }
                return texts;
              };
              const extracted = extractText(data).filter((t) => t && t.length > 10);
              if (extracted.length > 0) {
                content = extracted.join("\n\n");
              }
            } catch {
            }
          }
          if (ext === ".csv") {
            const lines = content.split("\n").filter((l) => l.trim());
            if (lines.length > 1) {
              content = lines.slice(1).map((line) => line.split(",")[0]).filter(Boolean).join("\n");
            }
          }
          if (ext === ".pdf") {
            try {
              const pdfParse = require("pdf-parse");
              const pdfBuffer = fs2.readFileSync(filePath);
              const pdfData = await pdfParse(pdfBuffer);
              content = pdfData.text || "";
            } catch (e) {
              errors2.push(`${filePath}: PDF \u89E3\u6790\u5931\u8D25 - ${e.message}`);
              content = "";
            }
          }
          if (ext === ".docx") {
            try {
              const mammoth = require("mammoth");
              const result = await mammoth.extractRawText({ path: filePath });
              content = result.value || "";
            } catch (e) {
              errors2.push(`${filePath}: Word \u89E3\u6790\u5931\u8D25 - ${e.message}`);
              content = "";
            }
          }
          if (ext === ".xlsx") {
            try {
              const XLSX = require("xlsx");
              const workbook = XLSX.readFile(filePath);
              let texts = [];
              for (const sheetName of workbook.SheetNames) {
                const sheet = workbook.Sheets[sheetName];
                const data = XLSX.utils.sheet_to_json(sheet);
                for (const row of data) {
                  for (const val of Object.values(row)) {
                    if (val && typeof val === "string") texts.push(val);
                    else if (val) texts.push(String(val));
                  }
                }
              }
              content = texts.join("\n");
            } catch (e) {
              errors2.push(`${filePath}: Excel \u89E3\u6790\u5931\u8D25 - ${e.message}`);
              content = "";
            }
          }
          if (content && content.trim().length > 5) {
            knowledgeRepository.create({
              content: content.trim().substring(0, 1e4),
              type: "DOCUMENT",
              source: source || "folder-import",
              tags: [ext.slice(1).toUpperCase()],
              status: "ACTIVE",
              confidence: 1,
              entities: [],
              relations: []
            }).then(() => {
              imported.push(filePath);
            }).catch((err4) => {
              errors2.push(`${filePath}: ${err4.message}`);
            });
          }
        } catch (err4) {
          errors2.push(`${filePath}: ${err4.message}`);
        }
      }
      await scanDir(folderPath);
      setTimeout(() => {
        res.json(successResponse({
          imported: imported.length,
          errors: errors2.length,
          details: { imported, errors: errors2 }
        }));
      }, 500);
    } catch (error) {
      res.status(500).json(this.handleError(error));
    }
  }
  // 备份知识库
  async backupKnowledge(req, res) {
    try {
      const fs2 = require("fs");
      const path3 = require("path");
      const entries = await knowledgeRepository.findAll({ page: 1, pageSize: 1e4 });
      const backup = {
        version: "2.0.0",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        count: entries.total,
        entries: entries.items
      };
      const backupDir = path3.join(process.cwd(), "backups");
      if (!fs2.existsSync(backupDir)) {
        fs2.mkdirSync(backupDir, { recursive: true });
      }
      const fileName = `knowledge-backup-${(/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-")}.json`;
      const filePath = path3.join(backupDir, fileName);
      fs2.writeFileSync(filePath, JSON.stringify(backup, null, 2), "utf-8");
      res.json(successResponse({
        backup: true,
        filePath,
        count: entries.total,
        timestamp: backup.timestamp
      }));
    } catch (error) {
      res.status(500).json(this.handleError(error));
    }
  }
  // 恢复知识库
  async restoreKnowledge(req, res) {
    try {
      const { filePath } = req.body;
      const fs2 = require("fs");
      if (!filePath) {
        res.status(400).json(errorResponse({ code: "VALIDATION_ERROR", message: "filePath is required" }));
        return;
      }
      if (!fs2.existsSync(filePath)) {
        res.status(404).json(errorResponse({ code: "NOT_FOUND", message: "Backup file not found" }));
        return;
      }
      const backupData = JSON.parse(fs2.readFileSync(filePath, "utf-8"));
      if (!backupData.entries || !Array.isArray(backupData.entries)) {
        res.status(400).json(errorResponse({ code: "VALIDATION_ERROR", message: "Invalid backup file format" }));
        return;
      }
      let imported = 0;
      let failed = 0;
      for (const entry of backupData.entries) {
        try {
          await knowledgeRepository.create({
            content: entry.content,
            type: entry.type || "DOCUMENT",
            source: entry.source || "restore",
            tags: entry.tags || [],
            status: entry.status || "ACTIVE",
            confidence: entry.confidence || 1,
            entities: entry.entities || [],
            relations: entry.relations || []
          });
          imported++;
        } catch (e) {
          failed++;
        }
      }
      res.json(successResponse({
        restored: true,
        imported,
        failed,
        total: backupData.entries.length
      }));
    } catch (error) {
      res.status(500).json(this.handleError(error));
    }
  }
  // 上传文件
  async uploadFile(req, res) {
    try {
      const contentType = req.headers["content-type"] || "";
      if (!contentType.includes("multipart/form-data")) {
        const { content, fileName, source } = req.body;
        if (!content) {
          res.status(400).json(errorResponse({ code: "VALIDATION_ERROR", message: "No file content provided" }));
          return;
        }
        const ext = fileName ? fileName.split(".").pop()?.toLowerCase() : "txt";
        let processedContent = content;
        if (ext === "html") {
          processedContent = content.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "").replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
        } else if (ext === "json") {
          try {
            const data = JSON.parse(content);
            const extractText = (obj) => {
              const texts = [];
              if (typeof obj === "string") texts.push(obj);
              else if (Array.isArray(obj)) obj.forEach((item) => texts.push(...extractText(item)));
              else if (obj && typeof obj === "object") {
                Object.keys(obj).forEach((key) => {
                  if (!["id", "uuid", "date"].includes(key)) texts.push(...extractText(obj[key]));
                });
              }
              return texts;
            };
            const extracted = extractText(data).filter((t) => t && t.length > 10);
            if (extracted.length > 0) processedContent = extracted.join("\n\n");
          } catch {
          }
        }
        const entry = await knowledgeRepository.create({
          content: processedContent.substring(0, 1e4),
          type: "DOCUMENT",
          source: source || "file-upload",
          tags: [ext || "UPLOAD"],
          status: "ACTIVE",
          confidence: 1,
          entities: [],
          relations: []
        });
        res.json(successResponse({
          uploaded: true,
          entry,
          originalName: fileName
        }));
        return;
      }
      res.status(400).json(errorResponse({ code: "NOT_SUPPORTED", message: "Multipart upload not implemented yet. Send file content as JSON." }));
    } catch (error) {
      res.status(500).json(this.handleError(error));
    }
  }
  // 获取所有标签
  async getAllTags(req, res) {
    try {
      const result = await knowledgeRepository.findAll({ page: 1, pageSize: 1e3 });
      const entries = result.items || [];
      const tagSet = /* @__PURE__ */ new Set();
      entries.forEach((entry) => {
        if (entry.tags && Array.isArray(entry.tags)) {
          entry.tags.forEach((tag) => tagSet.add(tag));
        } else if (entry.tags && typeof entry.tags === "string") {
          entry.tags.split(",").forEach((tag) => tagSet.add(tag.trim()));
        }
      });
      const tags = Array.from(tagSet).sort();
      res.json(successResponse({ tags, count: tags.length }));
    } catch (error) {
      res.status(500).json(this.handleError(error));
    }
  }
  // 批量删除知识
  async batchDeleteKnowledge(req, res) {
    try {
      const { ids } = req.body;
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        throw new AppError("VALIDATION_ERROR" /* VALIDATION_ERROR */, "ids array is required", 400);
      }
      const deleted = [];
      const failed = [];
      for (const id of ids) {
        try {
          await knowledgeRepository.delete(id);
          deleted.push(id);
        } catch (e) {
          failed.push(id);
        }
      }
      res.json(successResponse({ deleted: deleted.length, failed: failed.length, ids: deleted }));
    } catch (error) {
      res.status(500).json(this.handleError(error));
    }
  }
  // 导出知识
  async exportKnowledge(req, res) {
    try {
      const { format = "json" } = req.query;
      const result = await knowledgeRepository.findAll({ page: 1, pageSize: 1e3 });
      const entries = result.items || [];
      if (format === "markdown") {
        let md = "# \u77E5\u8BC6\u5E93\u5BFC\u51FA\n\n";
        entries.forEach((entry, i) => {
          md += `## ${i + 1}. ${entry.source || "Untitled"}

`;
          md += `${entry.content}

`;
          if (entry.tags && entry.tags.length > 0) {
            md += `**\u6807\u7B7E**: ${Array.isArray(entry.tags) ? entry.tags.join(", ") : entry.tags}

`;
          }
          md += `---

`;
        });
        res.setHeader("Content-Type", "text/markdown; charset=utf-8");
        res.setHeader("Content-Disposition", `attachment; filename=knowledge-export-${Date.now()}.md`);
        res.send(md);
        return;
      }
      res.json(successResponse({
        exportDate: (/* @__PURE__ */ new Date()).toISOString(),
        count: entries.length,
        entries: entries.map((e) => ({
          id: e.id,
          content: e.content,
          type: e.type,
          source: e.source,
          tags: e.tags,
          createdAt: e.createdAt,
          updatedAt: e.updatedAt
        }))
      }));
    } catch (error) {
      res.status(500).json(this.handleError(error));
    }
  }
  // 获取知识统计
  async getKnowledgeStats(req, res) {
    try {
      const result = await knowledgeRepository.findAll({ page: 1, pageSize: 1e3 });
      const entries = result.items || [];
      const typeCount = {};
      const sourceCount = {};
      const tagCount = {};
      const dateCount = {};
      entries.forEach((entry) => {
        const type = entry.type || "UNKNOWN";
        typeCount[type] = (typeCount[type] || 0) + 1;
        const source = entry.source || "unknown";
        sourceCount[source] = (sourceCount[source] || 0) + 1;
        const tags = Array.isArray(entry.tags) ? entry.tags : entry.tags ? [entry.tags] : [];
        tags.forEach((tag) => {
          if (tag && typeof tag === "string") {
            tagCount[tag] = (tagCount[tag] || 0) + 1;
          }
        });
        const date = entry.createdAt ? new Date(entry.createdAt).toISOString().split("T")[0] : "unknown";
        dateCount[date] = (dateCount[date] || 0) + 1;
      });
      const topTags = Object.entries(tagCount).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([tag, count]) => ({ tag, count }));
      res.json(successResponse({
        total: entries.length,
        byType: typeCount,
        bySource: sourceCount,
        byTag: tagCount,
        byDate: dateCount,
        topTags,
        avgContentLength: entries.reduce((sum, e) => sum + (e.content?.length || 0), 0) / (entries.length || 1)
      }));
    } catch (error) {
      res.status(500).json(this.handleError(error));
    }
  }
};
var skillsController = new SkillsController();
var SkillsController_default = SkillsController;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  skillsController
});
/*! Bundled license information:

safe-buffer/index.js:
  (*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> *)
*/
