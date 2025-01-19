'use strict';

var require$$1 = require('tty');
var require$$1$1 = require('util');
var require$$0 = require('os');

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var src = {exports: {}};

var browser = {exports: {}};

/**
 * Helpers.
 */

var ms;
var hasRequiredMs;

function requireMs () {
	if (hasRequiredMs) return ms;
	hasRequiredMs = 1;
	var s = 1000;
	var m = s * 60;
	var h = m * 60;
	var d = h * 24;
	var w = d * 7;
	var y = d * 365.25;

	/**
	 * Parse or format the given `val`.
	 *
	 * Options:
	 *
	 *  - `long` verbose formatting [false]
	 *
	 * @param {String|Number} val
	 * @param {Object} [options]
	 * @throws {Error} throw an error if val is not a non-empty string or a number
	 * @return {String|Number}
	 * @api public
	 */

	ms = function (val, options) {
	  options = options || {};
	  var type = typeof val;
	  if (type === 'string' && val.length > 0) {
	    return parse(val);
	  } else if (type === 'number' && isFinite(val)) {
	    return options.long ? fmtLong(val) : fmtShort(val);
	  }
	  throw new Error(
	    'val is not a non-empty string or a valid number. val=' +
	      JSON.stringify(val)
	  );
	};

	/**
	 * Parse the given `str` and return milliseconds.
	 *
	 * @param {String} str
	 * @return {Number}
	 * @api private
	 */

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
	  var type = (match[2] || 'ms').toLowerCase();
	  switch (type) {
	    case 'years':
	    case 'year':
	    case 'yrs':
	    case 'yr':
	    case 'y':
	      return n * y;
	    case 'weeks':
	    case 'week':
	    case 'w':
	      return n * w;
	    case 'days':
	    case 'day':
	    case 'd':
	      return n * d;
	    case 'hours':
	    case 'hour':
	    case 'hrs':
	    case 'hr':
	    case 'h':
	      return n * h;
	    case 'minutes':
	    case 'minute':
	    case 'mins':
	    case 'min':
	    case 'm':
	      return n * m;
	    case 'seconds':
	    case 'second':
	    case 'secs':
	    case 'sec':
	    case 's':
	      return n * s;
	    case 'milliseconds':
	    case 'millisecond':
	    case 'msecs':
	    case 'msec':
	    case 'ms':
	      return n;
	    default:
	      return undefined;
	  }
	}

	/**
	 * Short format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function fmtShort(ms) {
	  var msAbs = Math.abs(ms);
	  if (msAbs >= d) {
	    return Math.round(ms / d) + 'd';
	  }
	  if (msAbs >= h) {
	    return Math.round(ms / h) + 'h';
	  }
	  if (msAbs >= m) {
	    return Math.round(ms / m) + 'm';
	  }
	  if (msAbs >= s) {
	    return Math.round(ms / s) + 's';
	  }
	  return ms + 'ms';
	}

	/**
	 * Long format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function fmtLong(ms) {
	  var msAbs = Math.abs(ms);
	  if (msAbs >= d) {
	    return plural(ms, msAbs, d, 'day');
	  }
	  if (msAbs >= h) {
	    return plural(ms, msAbs, h, 'hour');
	  }
	  if (msAbs >= m) {
	    return plural(ms, msAbs, m, 'minute');
	  }
	  if (msAbs >= s) {
	    return plural(ms, msAbs, s, 'second');
	  }
	  return ms + ' ms';
	}

	/**
	 * Pluralization helper.
	 */

	function plural(ms, msAbs, n, name) {
	  var isPlural = msAbs >= n * 1.5;
	  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
	}
	return ms;
}

var common;
var hasRequiredCommon;

function requireCommon () {
	if (hasRequiredCommon) return common;
	hasRequiredCommon = 1;
	/**
	 * This is the common logic for both the Node.js and web browser
	 * implementations of `debug()`.
	 */

	function setup(env) {
		createDebug.debug = createDebug;
		createDebug.default = createDebug;
		createDebug.coerce = coerce;
		createDebug.disable = disable;
		createDebug.enable = enable;
		createDebug.enabled = enabled;
		createDebug.humanize = requireMs();
		createDebug.destroy = destroy;

		Object.keys(env).forEach(key => {
			createDebug[key] = env[key];
		});

		/**
		* The currently active debug mode names, and names to skip.
		*/

		createDebug.names = [];
		createDebug.skips = [];

		/**
		* Map of special "%n" handling functions, for the debug "format" argument.
		*
		* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
		*/
		createDebug.formatters = {};

		/**
		* Selects a color for a debug namespace
		* @param {String} namespace The namespace string for the debug instance to be colored
		* @return {Number|String} An ANSI color code for the given namespace
		* @api private
		*/
		function selectColor(namespace) {
			let hash = 0;

			for (let i = 0; i < namespace.length; i++) {
				hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
				hash |= 0; // Convert to 32bit integer
			}

			return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
		}
		createDebug.selectColor = selectColor;

		/**
		* Create a debugger with the given `namespace`.
		*
		* @param {String} namespace
		* @return {Function}
		* @api public
		*/
		function createDebug(namespace) {
			let prevTime;
			let enableOverride = null;
			let namespacesCache;
			let enabledCache;

			function debug(...args) {
				// Disabled?
				if (!debug.enabled) {
					return;
				}

				const self = debug;

				// Set `diff` timestamp
				const curr = Number(new Date());
				const ms = curr - (prevTime || curr);
				self.diff = ms;
				self.prev = prevTime;
				self.curr = curr;
				prevTime = curr;

				args[0] = createDebug.coerce(args[0]);

				if (typeof args[0] !== 'string') {
					// Anything else let's inspect with %O
					args.unshift('%O');
				}

				// Apply any `formatters` transformations
				let index = 0;
				args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
					// If we encounter an escaped % then don't increase the array index
					if (match === '%%') {
						return '%';
					}
					index++;
					const formatter = createDebug.formatters[format];
					if (typeof formatter === 'function') {
						const val = args[index];
						match = formatter.call(self, val);

						// Now we need to remove `args[index]` since it's inlined in the `format`
						args.splice(index, 1);
						index--;
					}
					return match;
				});

				// Apply env-specific formatting (colors, etc.)
				createDebug.formatArgs.call(self, args);

				const logFn = self.log || createDebug.log;
				logFn.apply(self, args);
			}

			debug.namespace = namespace;
			debug.useColors = createDebug.useColors();
			debug.color = createDebug.selectColor(namespace);
			debug.extend = extend;
			debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.

			Object.defineProperty(debug, 'enabled', {
				enumerable: true,
				configurable: false,
				get: () => {
					if (enableOverride !== null) {
						return enableOverride;
					}
					if (namespacesCache !== createDebug.namespaces) {
						namespacesCache = createDebug.namespaces;
						enabledCache = createDebug.enabled(namespace);
					}

					return enabledCache;
				},
				set: v => {
					enableOverride = v;
				}
			});

			// Env-specific initialization logic for debug instances
			if (typeof createDebug.init === 'function') {
				createDebug.init(debug);
			}

			return debug;
		}

		function extend(namespace, delimiter) {
			const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
			newDebug.log = this.log;
			return newDebug;
		}

		/**
		* Enables a debug mode by namespaces. This can include modes
		* separated by a colon and wildcards.
		*
		* @param {String} namespaces
		* @api public
		*/
		function enable(namespaces) {
			createDebug.save(namespaces);
			createDebug.namespaces = namespaces;

			createDebug.names = [];
			createDebug.skips = [];

			const split = (typeof namespaces === 'string' ? namespaces : '')
				.trim()
				.replace(' ', ',')
				.split(',')
				.filter(Boolean);

			for (const ns of split) {
				if (ns[0] === '-') {
					createDebug.skips.push(ns.slice(1));
				} else {
					createDebug.names.push(ns);
				}
			}
		}

		/**
		 * Checks if the given string matches a namespace template, honoring
		 * asterisks as wildcards.
		 *
		 * @param {String} search
		 * @param {String} template
		 * @return {Boolean}
		 */
		function matchesTemplate(search, template) {
			let searchIndex = 0;
			let templateIndex = 0;
			let starIndex = -1;
			let matchIndex = 0;

			while (searchIndex < search.length) {
				if (templateIndex < template.length && (template[templateIndex] === search[searchIndex] || template[templateIndex] === '*')) {
					// Match character or proceed with wildcard
					if (template[templateIndex] === '*') {
						starIndex = templateIndex;
						matchIndex = searchIndex;
						templateIndex++; // Skip the '*'
					} else {
						searchIndex++;
						templateIndex++;
					}
				} else if (starIndex !== -1) { // eslint-disable-line no-negated-condition
					// Backtrack to the last '*' and try to match more characters
					templateIndex = starIndex + 1;
					matchIndex++;
					searchIndex = matchIndex;
				} else {
					return false; // No match
				}
			}

			// Handle trailing '*' in template
			while (templateIndex < template.length && template[templateIndex] === '*') {
				templateIndex++;
			}

			return templateIndex === template.length;
		}

		/**
		* Disable debug output.
		*
		* @return {String} namespaces
		* @api public
		*/
		function disable() {
			const namespaces = [
				...createDebug.names,
				...createDebug.skips.map(namespace => '-' + namespace)
			].join(',');
			createDebug.enable('');
			return namespaces;
		}

		/**
		* Returns true if the given mode name is enabled, false otherwise.
		*
		* @param {String} name
		* @return {Boolean}
		* @api public
		*/
		function enabled(name) {
			for (const skip of createDebug.skips) {
				if (matchesTemplate(name, skip)) {
					return false;
				}
			}

			for (const ns of createDebug.names) {
				if (matchesTemplate(name, ns)) {
					return true;
				}
			}

			return false;
		}

		/**
		* Coerce `val`.
		*
		* @param {Mixed} val
		* @return {Mixed}
		* @api private
		*/
		function coerce(val) {
			if (val instanceof Error) {
				return val.stack || val.message;
			}
			return val;
		}

		/**
		* XXX DO NOT USE. This is a temporary stub function.
		* XXX It WILL be removed in the next major release.
		*/
		function destroy() {
			console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
		}

		createDebug.enable(createDebug.load());

		return createDebug;
	}

	common = setup;
	return common;
}

/* eslint-env browser */

var hasRequiredBrowser;

function requireBrowser () {
	if (hasRequiredBrowser) return browser.exports;
	hasRequiredBrowser = 1;
	(function (module, exports) {
		/**
		 * This is the web browser implementation of `debug()`.
		 */

		exports.formatArgs = formatArgs;
		exports.save = save;
		exports.load = load;
		exports.useColors = useColors;
		exports.storage = localstorage();
		exports.destroy = (() => {
			let warned = false;

			return () => {
				if (!warned) {
					warned = true;
					console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
				}
			};
		})();

		/**
		 * Colors.
		 */

		exports.colors = [
			'#0000CC',
			'#0000FF',
			'#0033CC',
			'#0033FF',
			'#0066CC',
			'#0066FF',
			'#0099CC',
			'#0099FF',
			'#00CC00',
			'#00CC33',
			'#00CC66',
			'#00CC99',
			'#00CCCC',
			'#00CCFF',
			'#3300CC',
			'#3300FF',
			'#3333CC',
			'#3333FF',
			'#3366CC',
			'#3366FF',
			'#3399CC',
			'#3399FF',
			'#33CC00',
			'#33CC33',
			'#33CC66',
			'#33CC99',
			'#33CCCC',
			'#33CCFF',
			'#6600CC',
			'#6600FF',
			'#6633CC',
			'#6633FF',
			'#66CC00',
			'#66CC33',
			'#9900CC',
			'#9900FF',
			'#9933CC',
			'#9933FF',
			'#99CC00',
			'#99CC33',
			'#CC0000',
			'#CC0033',
			'#CC0066',
			'#CC0099',
			'#CC00CC',
			'#CC00FF',
			'#CC3300',
			'#CC3333',
			'#CC3366',
			'#CC3399',
			'#CC33CC',
			'#CC33FF',
			'#CC6600',
			'#CC6633',
			'#CC9900',
			'#CC9933',
			'#CCCC00',
			'#CCCC33',
			'#FF0000',
			'#FF0033',
			'#FF0066',
			'#FF0099',
			'#FF00CC',
			'#FF00FF',
			'#FF3300',
			'#FF3333',
			'#FF3366',
			'#FF3399',
			'#FF33CC',
			'#FF33FF',
			'#FF6600',
			'#FF6633',
			'#FF9900',
			'#FF9933',
			'#FFCC00',
			'#FFCC33'
		];

		/**
		 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
		 * and the Firebug extension (any Firefox version) are known
		 * to support "%c" CSS customizations.
		 *
		 * TODO: add a `localStorage` variable to explicitly enable/disable colors
		 */

		// eslint-disable-next-line complexity
		function useColors() {
			// NB: In an Electron preload script, document will be defined but not fully
			// initialized. Since we know we're in Chrome, we'll just detect this case
			// explicitly
			if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
				return true;
			}

			// Internet Explorer and Edge do not support colors.
			if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
				return false;
			}

			let m;

			// Is webkit? http://stackoverflow.com/a/16459606/376773
			// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
			// eslint-disable-next-line no-return-assign
			return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
				// Is firebug? http://stackoverflow.com/a/398120/376773
				(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
				// Is firefox >= v31?
				// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
				(typeof navigator !== 'undefined' && navigator.userAgent && (m = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(m[1], 10) >= 31) ||
				// Double check webkit in userAgent just in case we are in a worker
				(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
		}

		/**
		 * Colorize log arguments if enabled.
		 *
		 * @api public
		 */

		function formatArgs(args) {
			args[0] = (this.useColors ? '%c' : '') +
				this.namespace +
				(this.useColors ? ' %c' : ' ') +
				args[0] +
				(this.useColors ? '%c ' : ' ') +
				'+' + module.exports.humanize(this.diff);

			if (!this.useColors) {
				return;
			}

			const c = 'color: ' + this.color;
			args.splice(1, 0, c, 'color: inherit');

			// The final "%c" is somewhat tricky, because there could be other
			// arguments passed either before or after the %c, so we need to
			// figure out the correct index to insert the CSS into
			let index = 0;
			let lastC = 0;
			args[0].replace(/%[a-zA-Z%]/g, match => {
				if (match === '%%') {
					return;
				}
				index++;
				if (match === '%c') {
					// We only are interested in the *last* %c
					// (the user may have provided their own)
					lastC = index;
				}
			});

			args.splice(lastC, 0, c);
		}

		/**
		 * Invokes `console.debug()` when available.
		 * No-op when `console.debug` is not a "function".
		 * If `console.debug` is not available, falls back
		 * to `console.log`.
		 *
		 * @api public
		 */
		exports.log = console.debug || console.log || (() => {});

		/**
		 * Save `namespaces`.
		 *
		 * @param {String} namespaces
		 * @api private
		 */
		function save(namespaces) {
			try {
				if (namespaces) {
					exports.storage.setItem('debug', namespaces);
				} else {
					exports.storage.removeItem('debug');
				}
			} catch (error) {
				// Swallow
				// XXX (@Qix-) should we be logging these?
			}
		}

		/**
		 * Load `namespaces`.
		 *
		 * @return {String} returns the previously persisted debug modes
		 * @api private
		 */
		function load() {
			let r;
			try {
				r = exports.storage.getItem('debug');
			} catch (error) {
				// Swallow
				// XXX (@Qix-) should we be logging these?
			}

			// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
			if (!r && typeof process !== 'undefined' && 'env' in process) {
				r = process.env.DEBUG;
			}

			return r;
		}

		/**
		 * Localstorage attempts to return the localstorage.
		 *
		 * This is necessary because safari throws
		 * when a user disables cookies/localstorage
		 * and you attempt to access it.
		 *
		 * @return {LocalStorage}
		 * @api private
		 */

		function localstorage() {
			try {
				// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
				// The Browser also has localStorage in the global context.
				return localStorage;
			} catch (error) {
				// Swallow
				// XXX (@Qix-) should we be logging these?
			}
		}

		module.exports = requireCommon()(exports);

		const {formatters} = module.exports;

		/**
		 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
		 */

		formatters.j = function (v) {
			try {
				return JSON.stringify(v);
			} catch (error) {
				return '[UnexpectedJSONParseError]: ' + error.message;
			}
		}; 
	} (browser, browser.exports));
	return browser.exports;
}

var node = {exports: {}};

var hasFlag;
var hasRequiredHasFlag;

function requireHasFlag () {
	if (hasRequiredHasFlag) return hasFlag;
	hasRequiredHasFlag = 1;

	hasFlag = (flag, argv = process.argv) => {
		const prefix = flag.startsWith('-') ? '' : (flag.length === 1 ? '-' : '--');
		const position = argv.indexOf(prefix + flag);
		const terminatorPosition = argv.indexOf('--');
		return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
	};
	return hasFlag;
}

var supportsColor_1;
var hasRequiredSupportsColor;

function requireSupportsColor () {
	if (hasRequiredSupportsColor) return supportsColor_1;
	hasRequiredSupportsColor = 1;
	const os = require$$0;
	const tty = require$$1;
	const hasFlag = requireHasFlag();

	const {env} = process;

	let forceColor;
	if (hasFlag('no-color') ||
		hasFlag('no-colors') ||
		hasFlag('color=false') ||
		hasFlag('color=never')) {
		forceColor = 0;
	} else if (hasFlag('color') ||
		hasFlag('colors') ||
		hasFlag('color=true') ||
		hasFlag('color=always')) {
		forceColor = 1;
	}

	if ('FORCE_COLOR' in env) {
		if (env.FORCE_COLOR === 'true') {
			forceColor = 1;
		} else if (env.FORCE_COLOR === 'false') {
			forceColor = 0;
		} else {
			forceColor = env.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env.FORCE_COLOR, 10), 3);
		}
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

	function supportsColor(haveStream, streamIsTTY) {
		if (forceColor === 0) {
			return 0;
		}

		if (hasFlag('color=16m') ||
			hasFlag('color=full') ||
			hasFlag('color=truecolor')) {
			return 3;
		}

		if (hasFlag('color=256')) {
			return 2;
		}

		if (haveStream && !streamIsTTY && forceColor === undefined) {
			return 0;
		}

		const min = forceColor || 0;

		if (env.TERM === 'dumb') {
			return min;
		}

		if (process.platform === 'win32') {
			// Windows 10 build 10586 is the first Windows release that supports 256 colors.
			// Windows 10 build 14931 is the first release that supports 16m/TrueColor.
			const osRelease = os.release().split('.');
			if (
				Number(osRelease[0]) >= 10 &&
				Number(osRelease[2]) >= 10586
			) {
				return Number(osRelease[2]) >= 14931 ? 3 : 2;
			}

			return 1;
		}

		if ('CI' in env) {
			if (['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI', 'GITHUB_ACTIONS', 'BUILDKITE'].some(sign => sign in env) || env.CI_NAME === 'codeship') {
				return 1;
			}

			return min;
		}

		if ('TEAMCITY_VERSION' in env) {
			return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
		}

		if (env.COLORTERM === 'truecolor') {
			return 3;
		}

		if ('TERM_PROGRAM' in env) {
			const version = parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);

			switch (env.TERM_PROGRAM) {
				case 'iTerm.app':
					return version >= 3 ? 3 : 2;
				case 'Apple_Terminal':
					return 2;
				// No default
			}
		}

		if (/-256(color)?$/i.test(env.TERM)) {
			return 2;
		}

		if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
			return 1;
		}

		if ('COLORTERM' in env) {
			return 1;
		}

		return min;
	}

	function getSupportLevel(stream) {
		const level = supportsColor(stream, stream && stream.isTTY);
		return translateLevel(level);
	}

	supportsColor_1 = {
		supportsColor: getSupportLevel,
		stdout: translateLevel(supportsColor(true, tty.isatty(1))),
		stderr: translateLevel(supportsColor(true, tty.isatty(2)))
	};
	return supportsColor_1;
}

/**
 * Module dependencies.
 */

var hasRequiredNode;

function requireNode () {
	if (hasRequiredNode) return node.exports;
	hasRequiredNode = 1;
	(function (module, exports) {
		const tty = require$$1;
		const util = require$$1$1;

		/**
		 * This is the Node.js implementation of `debug()`.
		 */

		exports.init = init;
		exports.log = log;
		exports.formatArgs = formatArgs;
		exports.save = save;
		exports.load = load;
		exports.useColors = useColors;
		exports.destroy = util.deprecate(
			() => {},
			'Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.'
		);

		/**
		 * Colors.
		 */

		exports.colors = [6, 2, 3, 4, 5, 1];

		try {
			// Optional dependency (as in, doesn't need to be installed, NOT like optionalDependencies in package.json)
			// eslint-disable-next-line import/no-extraneous-dependencies
			const supportsColor = requireSupportsColor();

			if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
				exports.colors = [
					20,
					21,
					26,
					27,
					32,
					33,
					38,
					39,
					40,
					41,
					42,
					43,
					44,
					45,
					56,
					57,
					62,
					63,
					68,
					69,
					74,
					75,
					76,
					77,
					78,
					79,
					80,
					81,
					92,
					93,
					98,
					99,
					112,
					113,
					128,
					129,
					134,
					135,
					148,
					149,
					160,
					161,
					162,
					163,
					164,
					165,
					166,
					167,
					168,
					169,
					170,
					171,
					172,
					173,
					178,
					179,
					184,
					185,
					196,
					197,
					198,
					199,
					200,
					201,
					202,
					203,
					204,
					205,
					206,
					207,
					208,
					209,
					214,
					215,
					220,
					221
				];
			}
		} catch (error) {
			// Swallow - we only care if `supports-color` is available; it doesn't have to be.
		}

		/**
		 * Build up the default `inspectOpts` object from the environment variables.
		 *
		 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
		 */

		exports.inspectOpts = Object.keys(process.env).filter(key => {
			return /^debug_/i.test(key);
		}).reduce((obj, key) => {
			// Camel-case
			const prop = key
				.substring(6)
				.toLowerCase()
				.replace(/_([a-z])/g, (_, k) => {
					return k.toUpperCase();
				});

			// Coerce string value into JS value
			let val = process.env[key];
			if (/^(yes|on|true|enabled)$/i.test(val)) {
				val = true;
			} else if (/^(no|off|false|disabled)$/i.test(val)) {
				val = false;
			} else if (val === 'null') {
				val = null;
			} else {
				val = Number(val);
			}

			obj[prop] = val;
			return obj;
		}, {});

		/**
		 * Is stdout a TTY? Colored output is enabled when `true`.
		 */

		function useColors() {
			return 'colors' in exports.inspectOpts ?
				Boolean(exports.inspectOpts.colors) :
				tty.isatty(process.stderr.fd);
		}

		/**
		 * Adds ANSI color escape codes if enabled.
		 *
		 * @api public
		 */

		function formatArgs(args) {
			const {namespace: name, useColors} = this;

			if (useColors) {
				const c = this.color;
				const colorCode = '\u001B[3' + (c < 8 ? c : '8;5;' + c);
				const prefix = `  ${colorCode};1m${name} \u001B[0m`;

				args[0] = prefix + args[0].split('\n').join('\n' + prefix);
				args.push(colorCode + 'm+' + module.exports.humanize(this.diff) + '\u001B[0m');
			} else {
				args[0] = getDate() + name + ' ' + args[0];
			}
		}

		function getDate() {
			if (exports.inspectOpts.hideDate) {
				return '';
			}
			return new Date().toISOString() + ' ';
		}

		/**
		 * Invokes `util.formatWithOptions()` with the specified arguments and writes to stderr.
		 */

		function log(...args) {
			return process.stderr.write(util.formatWithOptions(exports.inspectOpts, ...args) + '\n');
		}

		/**
		 * Save `namespaces`.
		 *
		 * @param {String} namespaces
		 * @api private
		 */
		function save(namespaces) {
			if (namespaces) {
				process.env.DEBUG = namespaces;
			} else {
				// If you set a process.env field to null or undefined, it gets cast to the
				// string 'null' or 'undefined'. Just delete instead.
				delete process.env.DEBUG;
			}
		}

		/**
		 * Load `namespaces`.
		 *
		 * @return {String} returns the previously persisted debug modes
		 * @api private
		 */

		function load() {
			return process.env.DEBUG;
		}

		/**
		 * Init logic for `debug` instances.
		 *
		 * Create a new `inspectOpts` object in case `useColors` is set
		 * differently for a particular `debug` instance.
		 */

		function init(debug) {
			debug.inspectOpts = {};

			const keys = Object.keys(exports.inspectOpts);
			for (let i = 0; i < keys.length; i++) {
				debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
			}
		}

		module.exports = requireCommon()(exports);

		const {formatters} = module.exports;

		/**
		 * Map %o to `util.inspect()`, all on a single line.
		 */

		formatters.o = function (v) {
			this.inspectOpts.colors = this.useColors;
			return util.inspect(v, this.inspectOpts)
				.split('\n')
				.map(str => str.trim())
				.join(' ');
		};

		/**
		 * Map %O to `util.inspect()`, allowing multiple lines if needed.
		 */

		formatters.O = function (v) {
			this.inspectOpts.colors = this.useColors;
			return util.inspect(v, this.inspectOpts);
		}; 
	} (node, node.exports));
	return node.exports;
}

/**
 * Detect Electron renderer / nwjs process, which is node, but we should
 * treat as a browser.
 */

var hasRequiredSrc;

function requireSrc () {
	if (hasRequiredSrc) return src.exports;
	hasRequiredSrc = 1;
	if (typeof process === 'undefined' || process.type === 'renderer' || process.browser === true || process.__nwjs) {
		src.exports = requireBrowser();
	} else {
		src.exports = requireNode();
	}
	return src.exports;
}

var srcExports = requireSrc();
var createDebug = /*@__PURE__*/getDefaultExportFromCjs(srcExports);

const debug$a = createDebug('sdk:utils:url-helper');
class URLHelper {
    /**
     * Appends query parameters to a given URL as a query string.
     *
     * It accepts an object of key-value pairs and transforms it into a properly formatted query string.
     *
     * The query string is appended to the base URL, ensuring that data structures such as arrays or nested objects are correctly serialized.
     *
     * If no query parameters are provided, the original URL is returned unchanged.
     *
     * @param url - The base URL onto which query params are added.
     * @param [queryParams] - An optional object containing query parameters to append.
     *
     * @returns The URL with the appended query string. If no query parameters are provided or if they're empty, the original URL remains unchanged.
     *
     * @example
     * ```typescript
     * // Example 1: appending a flat key-value pair
     * const url1 = URLHelper.appendQueryParams('https://api.example.com/resources', { locale: 'en' });
     * // Result: 'https://api.example.com/resources?locale=en'
     *
     * // Example 2: appending an array
     * const url2 = URLHelper.appendQueryParams('https://api.example.com/resources', { tags: ['news', 'tech'] });
     * // Result: 'https://api.example.com/resources?tags[0]=news&tags[1]=tech'
     *
     * // Example 3: appending a nested object
     * const url3 = URLHelper.appendQueryParams('https://api.example.com/resources', { filters: { category: 'news', status: 'published' } });
     * // Result: 'https://api.example.com/resources?filters[category]=news&filters[status]=published'
     *
     * // Example 4: No query parameters
     * const url4 = URLHelper.appendQueryParams('https://api.example.com/resources');
     * // Result: 'https://api.example.com/resources'
     * ```
     *
     * @remarks
     * - This method doesn't validate the URL format, please ensure the base URL is a valid string.
     *
     * @see {@link URLSearchParams}
     * @see {@link BaseQueryParams} for details on supported query parameter structures.
     *
     */
    static appendQueryParams(url, queryParams) {
        debug$a('appending query params to %o: %o', url, queryParams);
        if (!queryParams) {
            debug$a('no query params provided, returning original URL: %o', url);
            return url;
        }
        const params = new URLSearchParams();
        const appendParam = (key, value) => {
            // vals=[1, 2, 3] -> vals[0]='1', vals[1]='2', vals[3]='2'
            if (Array.isArray(value)) {
                value
                    .filter((item) => typeof item !== 'undefined')
                    .forEach((item, index) => params.append(`${key}[${index}]`, String(item)));
            }
            // vals={ foo: 'bar', bar: 40 } -> vals[foo]='bar', vals[bar]='40'
            else if (typeof value === 'object' && value !== null) {
                for (const [subKey, subValue] of Object.entries(value)) {
                    appendParam(`${key}[${subKey}]`, subValue);
                }
            }
            // val=40 -> val='40'
            else if (typeof value !== 'undefined') {
                params.append(key, String(value));
            }
        };
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                appendParam(key, value);
            }
        }
        const queryString = params.toString();
        const qs = queryString ? `${url}?${queryString}` : url;
        debug$a('query params appended to url: %o', qs);
        return qs;
    }
    /**
     * Converts a given string or URL instance into a human-readable URL path without query parameters.
     *
     * Normalizes to include only the origin and path while excluding any query strings or fragments.
     *
     * @param input - The input to be converted.
     *                Can be a string representing the URL or a URL object.
     *                If it is a string, it should be a valid absolute URL.
     *                If it is a `URL` instance, the method processes it directly.
     *
     * @returns A string representing the origin and path of the provided URL.
     *          Query parameters and fragments are removed.
     *
     * @example
     * // Using a string URL
     * const url = 'https://example.com/articles/1?param1=a&param2=b';
     * const readablePath = URLHelper.toReadablePath(url);
     * // 'https://example.com/articles/1'
     *
     * @example
     * // Using a URL instance
     * const url = new URL('https://example.com/articles/1?param1=a&param2=b');
     * const readablePath = URLHelper.toReadablePath(url);
     * // 'https://example.com/articles/1'
     */
    static toReadablePath(input) {
        const url = input instanceof URL ? input : new URL(input);
        return `${url.origin}${url.pathname}`;
    }
}

class RequestHelper {
    /**
     * Formats a Fetch request into a concise, human-readable string.
     *
     * Extracts the HTTP method and URL from the given `Request` object
     * and formats them into a readable format for logging or debugging purposes.
     *
     * @param input -   The HTTP request to format.
     *                  This parameter must be a valid `Request` object that includes
     *                  the method and URL fields.
     *
     * @returns A formatted string representing the HTTP request in the form `<method> - <URL>`.
     *          The URL included in the formatted output contains only the origin and path,
     *          excluding any query parameters or fragments.
     *
     * @example
     * // Example usage of the `formatRequest` method:
     * const request = new Request('https://example.com/api/items?filter=active', { method: 'POST' });
     *
     * const formattedRequest = RequestHelper.format(request);
     * // Output: "POST - https://example.com/api/items"
     *
     * @see {@link URLHelper.toReadablePath}
     */
    static format(input) {
        if (!(input instanceof Request)) {
            throw new TypeError(`Invalid input, expected a Request instance but found ${typeof input}`);
        }
        return `${input.method} - ${URLHelper.toReadablePath(input.url)}`;
    }
}

const debug$9 = createDebug('sdk:ct:single');
/**
 * A service class designed for interacting with a single-type resource in a Strapi app.
 *
 * It provides methods to fetch, update, or delete a document of a specified Strapi single-type.
 *
 * #### Overview
 * - The class is instantiated with the singular resource name and an HTTP client.
 * - All operations use the resource's singular name to construct the API endpoint.
 * - It also supports optional query parameters for filtering, sorting, pagination, etc.
 */
class SingleTypeManager {
    _singularName;
    _httpClient;
    /**
     * Creates an instance of {@link SingleTypeManager}.
     *
     * @param singularName - The singular name of the single-type resource as defined in the Strapi app.
     * @param httpClient - An instance of {@link HttpClient} to handle HTTP communication.
     *
     * @example
     * ```typescript
     * const httpClient = new HttpClient('http://localhost:1337/api');
     * const homepageManager = new SingleTypeManager('homepage', httpClient);
     * ```
     */
    constructor(singularName, httpClient) {
        this._singularName = singularName;
        this._httpClient = httpClient;
        debug$9('initialized manager for %o', singularName);
    }
    /**
     * Retrieves the document of the specified single-type resource.
     *
     * @param [queryParams] - Optional query parameters to customize the request, such as filters or locale.
     *                        Query parameters follow the Strapi conventions for filtering, pagination, and sorting.
     *
     * @returns The full document for the single-type resource.
     *
     * @throws {HTTPError} if the HTTP client encounters connection issues, the server is unreachable, or authentication fails.
     *
     * @example
     * ```typescript
     * const homepageManager = new SingleTypeManager('homepage', httpClient);
     *
     * // Fetch the homepage content without additional filtering
     * const homepageContent = await homepageManager.find();
     *
     * // Fetch homepage contents for the 'es' locale
     * const localizedHomepage = await homepageManager.find({ locale: 'es' });
     * ```
     */
    async find(queryParams) {
        debug$9('finding document for %o', this._singularName);
        let path = `/${this._singularName}`;
        if (queryParams) {
            path = URLHelper.appendQueryParams(path, queryParams);
        }
        const response = await this._httpClient.fetch(path, { method: 'GET' });
        debug$9('the %o document has been fetched', this._singularName);
        return response.json();
    }
    /**
     * Updates the document of the specified single-type resource with the provided data.
     *
     * @param data -  A record of key-value pairs that represent the fields to update.
     *                Must follow the schema defined in the Strapi app.
     * @param [queryParams] - Optional query parameters to customize the request, such as locale or other additional filters.
     *
     * @returns The updated document for the single-type resource.
     *
     * @throws {HTTPError} if the HTTP client encounters connection issues, the server is unreachable, or authentication fails.
     *
     * @example
     * ```typescript
     * const homepageManager = new SingleTypeManager('homepage', httpClient);
     *
     * // Update the homepage content
     * const updatedHomepage = await homepageManager.update({ title: 'Updated Homepage Title' });
     *
     * // Update localized homepage content
     * const localizedUpdatedHomepage = await homepageManager.update(
     *   { title: 'Inicio Actualizado' },
     *   { locale: 'es' }
     * );
     * ```
     */
    async update(data, queryParams) {
        debug$9('updating document for %o', this._singularName);
        let url = `/${this._singularName}`;
        if (queryParams) {
            url = URLHelper.appendQueryParams(url, queryParams);
        }
        const response = await this._httpClient.fetch(url, {
            method: 'PUT',
            body: JSON.stringify({ data }),
        });
        debug$9('the %o document has been updated', this._singularName);
        return response.json();
    }
    /**
     * Deletes the document of the specified single-type resource.
     *
     * @param [queryParams] - Optional query parameters to customize the request, such as locale or other additional filters.
     *
     * @returns The response after the deletion, confirming the successful removal of the document.
     *
     * @throws {HTTPError} if the HTTP client encounters connection issues, the server is unreachable,
     *                 or authentication fails.
     *
     * @example
     * ```typescript
     * const homepageManager = new SingleTypeManager('homepage', httpClient);
     *
     * // Delete the homepage content
     * await homepageManager.delete();
     *
     * // Delete localized homepage content in Spanish
     * await homepageManager.delete({ locale: 'es' });
     * ```
     *
     * @see HttpClient
     * @see URLHelper.appendQueryParams
     */
    async delete(queryParams) {
        debug$9('deleting document for %o', this._singularName);
        let url = `/${this._singularName}`;
        if (queryParams) {
            url = URLHelper.appendQueryParams(url, queryParams);
        }
        await this._httpClient.fetch(url, { method: 'DELETE' });
        debug$9('the %o document has been deleted', this._singularName);
    }
}

const debug$8 = createDebug('sdk:ct:collection');
/**
 * A service class designed for interacting with a collection-type resource in a Strapi app.
 *
 * It provides methods to fetch, update, or delete documents of a specified Strapi collection-type.
 *
 * #### Overview
 * - The class is instantiated with the plural resource name and an HTTP client.
 * - All operations use the resource's plural name to construct the API endpoint.
 * - It also supports optional query parameters for filtering, sorting, pagination, etc.
 */
class CollectionTypeManager {
    _pluralName;
    _httpClient;
    /**
     * Creates an instance of {@link CollectionTypeManager}`.
     *
     * @param pluralName - The singular name of the single-type resource as defined in the Strapi app.
     * @param httpClient - An instance of {@link HttpClient} to handle HTTP communication.
     *
     * @example
     * ```typescript
     * const httpClient = new HttpClient('http://localhost:1337/api');
     * const articlesManager = new CollectionTypeManager('articles', httpClient);
     * ```
     */
    constructor(pluralName, httpClient) {
        this._pluralName = pluralName;
        this._httpClient = httpClient;
        debug$8('initialized manager for %o', pluralName);
    }
    /**
     * Retrieves multiple documents.
     *
     * @param [queryParams] - Optional query parameters to filter, sort, or paginate the results.
     *
     * @returns A list of documents matching the given request.
     *
     * @throws {HTTPError} if the HTTP client encounters connection issues, the server is unreachable, or authentication fails.
     *
     * @example
     * ```typescript
     * const articlesManager = new CollectionTypeManager('articles', httpClient);
     *
     * const articles = await articlesManager.find({
     *   filters: { published: true },
     *   sort: 'title'
     * });
     *
     * console.log(articles);
     * ```
     */
    async find(queryParams) {
        debug$8('finding documents for %o', this._pluralName);
        let url = `/${this._pluralName}`;
        if (queryParams) {
            url = URLHelper.appendQueryParams(url, queryParams);
        }
        const response = await this._httpClient.fetch(url, { method: 'GET' });
        const json = await response.json();
        debug$8('found %o %o documents', Number(json?.data?.length), this._pluralName);
        return json;
    }
    /**
     * Retrieves a single document by its ID.
     *
     * @param documentID - The unique identifier of the document to retrieve.
     * @param [queryParams] - Optional query parameters to include additional data or filtering.
     *
     * @returns A single document
     *
     * @throws {HTTPError} if the HTTP client encounters connection issues, the server is unreachable, or authentication fails.
     *
     * @example
     * ```typescript
     * const articlesManager = new CollectionTypeManager('articles', httpClient);
     *
     * // Find an article by its document ID
     * const article = await articlesManager.findOne('ebd74ca4-288f-41a2-974c-a4288fa1a24f');
     *
     * // Find a version of a document using its document ID and filters
     * const localizedArticle = await articlesManager.findOne('ebd74ca4-288f-41a2-974c-a4288fa1a24f', { locale: 'es' });
     * ```
     *
     */
    async findOne(documentID, queryParams) {
        debug$8('finding a document for %o with id: %o', this._pluralName, documentID);
        let url = `/${this._pluralName}/${documentID}`;
        if (queryParams) {
            url = URLHelper.appendQueryParams(url, queryParams);
        }
        const response = await this._httpClient.fetch(url, { method: 'GET' });
        debug$8('found the %o document with document id %o', this._pluralName, documentID);
        return response.json();
    }
    /**
     * Creates a new document.
     *
     * @param data - The content data of the document to create.
     * @param [queryParams] - Optional query parameters for adding additional metadata.
     *
     * @returns The created document
     *
     * @throws {HTTPError} if the HTTP client encounters connection issues, the server is unreachable, or authentication fails.
     *
     * @example
     * ```typescript
     * const articlesManager = new CollectionTypeManager('articles', httpClient);
     *
     * // Create a new article document
     * const newArticle = await articlesManager.create({ title: 'My New Article', content: '...' });
     * ```
     */
    async create(data, queryParams) {
        debug$8('creating a document for %o', this._pluralName);
        let url = `/${this._pluralName}`;
        if (queryParams) {
            url = URLHelper.appendQueryParams(url, queryParams);
        }
        const response = await this._httpClient.fetch(url, {
            method: 'POST',
            body: JSON.stringify({ data }),
        });
        debug$8('created the %o document', this._pluralName);
        return response.json();
    }
    /**
     * Updates an existing document
     *
     * @param documentID - The unique identifier of the document to update.
     * @param data - The content data to update for the document.
     * @param [queryParams] - Optional query parameters for additional metadata.
     *
     * @returns The updated document
     *
     * @throws {HTTPError} if the HTTP client encounters connection issues, the server is unreachable, or authentication fails.
     *
     * @example
     * ```typescript
     * const articlesManager = new CollectionTypeManager('articles', httpClient);
     *
     * // Update an article content
     * const updatedArticle = await articlesManager.update('3ec3770c-9d02-4798-8377-0c9d02079818', { title: 'Updated Article Title' });
     *
     * // Update localized article content
     * const localizedUpdatedArticle = await articlesManager.update(
     *   '22127a83-4ed4-4249-927a-834ed4a249a6',
     *   { title: 'Inicio Actualizado' },
     *   { locale: 'es' }
     * );
     * ```
     */
    async update(documentID, data, queryParams) {
        debug$8('updating a document for %o with id: %o', this._pluralName, documentID);
        let url = `/${this._pluralName}/${documentID}`;
        if (queryParams) {
            url = URLHelper.appendQueryParams(url, queryParams);
        }
        const response = await this._httpClient.fetch(url, {
            method: 'PUT',
            body: JSON.stringify({ data }),
        });
        debug$8('updated the %o document with id %o', this._pluralName, documentID);
        return response.json();
    }
    /**
     * Deletes a document
     *
     * @param documentID - The unique identifier of the document to delete.
     * @param [queryParams] - Optional query parameters for additional metadata.
     *
     * @throws {HTTPError} if the HTTP client encounters connection issues, the server is unreachable, or authentication fails.
     *
     * @example
     * @example
     * ```typescript
     * const articlesManager = new CollectionTypeManager('articles', httpClient);
     *
     * // Delete an article
     * await articlesManager.delete('3ec3770c-9d02-4798-8377-0c9d02079818');
     *
     * // Delete the Spanish version of a document
     * await articlesManager.delete(
     *   '59b2774f-90a5-498e-b277-4f90a5198e96',
     *   { locale: 'es' }
     * );
     * ```
     */
    async delete(documentID, queryParams) {
        debug$8('deleting a document for %o with id: %o', this._pluralName, documentID);
        let url = `/${this._pluralName}/${documentID}`;
        if (queryParams) {
            url = URLHelper.appendQueryParams(url, queryParams);
        }
        await this._httpClient.fetch(url, { method: 'DELETE' });
        debug$8('deleted the %o document with id %o', this._pluralName, documentID);
    }
}

class StrapiSDKError extends Error {
    constructor(cause = undefined, message = 'An error occurred in the Strapi SDK. Please check the logs for more information.') {
        super(message);
        this.cause = cause;
    }
}
class StrapiSDKValidationError extends StrapiSDKError {
    constructor(cause = undefined, message = 'Some of the provided values are not valid.') {
        super(cause, message);
    }
}
class StrapiSDKInitializationError extends StrapiSDKError {
    constructor(cause = undefined, message = 'Could not initialize the Strapi SDK') {
        super(cause, message);
    }
}

class URLValidationError extends Error {
}
class URLParsingError extends URLValidationError {
    constructor(url) {
        super(`Could not parse invalid URL: "${url}"`);
    }
}

class HTTPError extends Error {
    name = 'HTTPError';
    response;
    request;
    constructor(response, request) {
        const code = response.status?.toString() ?? '';
        const title = response.statusText ?? '';
        const status = `${code} ${title}`.trim();
        const reason = status ? `status code ${status}` : 'an unknown error';
        super(`Request failed with ${reason}: ${request.method} ${request.url}`);
        this.response = response;
        this.request = request;
    }
}
class HTTPAuthorizationError extends HTTPError {
    name = 'HTTPAuthorizationError';
}
class HTTPNotFoundError extends HTTPError {
    name = 'HTTPNotFoundError';
}
class HTTPBadRequestError extends HTTPError {
    name = 'HTTPBadRequestError';
}
class HTTPInternalServerError extends HTTPError {
    name = 'HTTPInternalServerError';
}
class HTTPForbiddenError extends HTTPError {
    name = 'HTTPForbiddenError';
}
class HTTPTimeoutError extends HTTPError {
    name = 'HTTPTimeoutError';
}

/**
 * An abstract class that provides a foundational structure for implementing different authentication providers.
 *
 * It is designed to be extended by specific authentication strategies such as
 * API token or users-permissions based authentication.
 *
 * This class implements the {@link AuthProvider} interface, ensuring consistency across
 * authentication strategies in handling authentication processes and headers.
 *
 * @template T - The type of options that the specific authentication provider requires.
 *
 * @example
 * // Example of extending the AbstractAuthProvider
 * class MyAuthProvider extends AbstractAuthProvider<MyOptions> {
 *   constructor(options: MyOptions) {
 *     super(options);
 *   }
 *
 *   authenticate(): Promise<void> {
 *     // Implementation for authentication
 *   }
 *
 *   get headers() {
 *     return {
 *       Authorization: `Bearer ${this._options.token}`,
 *     };
 *   }
 * }
 *
 * @abstract
 */
class AbstractAuthProvider {
    _options;
    constructor(options) {
        this._options = options;
        // Validation
        this.preflightValidation();
    }
}

const debug$7 = createDebug('sdk:auth:provider:api-token');
const API_TOKEN_AUTH_STRATEGY_IDENTIFIER = 'api-token';
class ApiTokenAuthProvider extends AbstractAuthProvider {
    static identifier = API_TOKEN_AUTH_STRATEGY_IDENTIFIER;
    constructor(options) {
        super(options);
    }
    get name() {
        return ApiTokenAuthProvider.identifier;
    }
    get token() {
        return this._options.token;
    }
    preflightValidation() {
        debug$7('validating provider configuration');
        if (typeof this.token !== 'string' || this.token.trim().length === 0) {
            debug$7('invalid api token provided: %o (%o)', this.token, typeof this.token);
            throw new StrapiSDKValidationError(`A valid API token is required when using the api-token auth strategy. Got "${this.token}"`);
        }
        debug$7('provider configuration validated successfully');
    }
    authenticate() {
        debug$7('no authentication step is required for the %o auth strategy, skipping', this.name);
        return Promise.resolve(); // does nothing
    }
    get headers() {
        return {
            Authorization: `Bearer ${this.token}`,
        };
    }
}

const debug$6 = createDebug('sdk:auth:provider:users-permissions');
const USERS_PERMISSIONS_AUTH_STRATEGY_IDENTIFIER = 'users-permissions';
/**
 * @experimental
 * Authentication through users and permissions is experimental for the MVP of
 * the Strapi SDK.
 */
class UsersPermissionsAuthProvider extends AbstractAuthProvider {
    static identifier = USERS_PERMISSIONS_AUTH_STRATEGY_IDENTIFIER;
    _token = null;
    constructor(options) {
        super(options);
    }
    get name() {
        return UsersPermissionsAuthProvider.identifier;
    }
    get credentials() {
        return {
            identifier: this._options.identifier,
            password: this._options.password,
        };
    }
    preflightValidation() {
        debug$6('validating provider configuration');
        if (this._options === undefined ||
            this._options === null ||
            typeof this._options !== 'object') {
            debug$6('invalid options provided: %s (%s)', this._options, typeof this._options);
            throw new StrapiSDKValidationError('Missing valid options for initializing the Users & Permissions auth provider.');
        }
        const { identifier, password } = this._options;
        if (typeof identifier !== 'string') {
            debug$6('invalid identifier provided: %s (%s)', identifier, typeof identifier);
            throw new StrapiSDKValidationError(`The "identifier" option must be a string, but got "${typeof identifier}"`);
        }
        if (typeof password !== 'string') {
            debug$6('invalid password provided: %s (%s)', password, typeof password);
            throw new StrapiSDKValidationError(`The "password" option must be a string, but got "${typeof password}"`);
        }
        debug$6('provider configuration validated successfully');
    }
    get headers() {
        if (this._token === null) {
            return {};
        }
        return { Authorization: `Bearer ${this._token}` };
    }
    async authenticate(httpClient) {
        const { baseURL } = httpClient;
        const { identifier, password } = this.credentials;
        const localAuthURL = `${baseURL}/auth/local`;
        debug$6('trying to authenticate with %o as %o at %o ', this.name, identifier, localAuthURL);
        const request = new Request(localAuthURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifier, password }),
        });
        // Make sure to use the HttpClient's "_fetch" method to not perform authentication in an infinite loop.
        const response = await httpClient._fetch(request);
        const data = await response.json();
        const obfuscatedToken = data.jwt.slice(0, 5) + '...' + data.jwt.slice(-5);
        debug$6('authentication successful for %o (%o)', identifier, obfuscatedToken);
        this._token = data.jwt;
    }
}

const debug$5 = createDebug('sdk:auth:factory');
/**
 * A factory class responsible for creating and managing authentication providers.
 *
 * It facilitates the registration and creation of different authentication
 * strategies which implement the AuthProvider interface.
 *
 * @template T_Providers Defines a map for authentication strategy names to their corresponding creator functions.
 */
class AuthProviderFactory {
    _registry = new Map();
    /**
     * Creates an instance of an authentication provider based on the specified strategy.
     *
     * @param authStrategy The authentication strategy name to be used for creating the provider.
     * @param options Configuration options required to initialize the authentication provider.
     *
     * @returns An instance of an AuthProvider initialized with the given options.
     *
     * @throws {StrapiSDKError} Throws an error if the specified strategy is not registered in the factory.
     *
     * @example
     * ```typescript
     * const factory = new AuthProviderFactory();
     *
     * factory.register(
     *   'api-token',
     *   (options: ApiTokenAuthProviderOptions) => new ApiTokenAuthProvider(options)
     * );
     *
     * const provider = factory.create('api-token', { jwt: 'token' });
     * ```
     */
    create(authStrategy, options) {
        const creator = this._registry.get(authStrategy);
        if (!creator) {
            debug$5('the %o auth strategy is not registered, skipping', authStrategy);
            throw new StrapiSDKError(`Auth strategy "${authStrategy}" is not supported.`);
        }
        const instance = creator(options);
        debug$5('successfully instantiated a new %o provider', authStrategy);
        return instance;
    }
    /**
     * Registers a new authentication strategy with the factory.
     *
     * @param strategy The name of the authentication strategy to register.
     * @param creator A function that creates an instance of an authentication provider for the specified strategy.
     *
     * @returns The instance of AuthProviderFactory, for chaining purpose.
     *
     * @example
     * ```typescript
     * const factory = new AuthProviderFactory();
     *
     * factory
     *  .register(
     *    'api-token',
     *    (options: ApiTokenAuthProviderOptions) => new ApiTokenAuthProvider(options)
     *  )
     *  .register(
     *    'users-permissions',
     *    (options: UsersPermissionsAuthProviderOptions) => new UsersPermissionsAuthProvider(options)
     *  );
     * ```
     */
    register(strategy, creator) {
        this._registry.set(strategy, creator);
        debug$5('registered a new auth strategy: %o', strategy);
        return this;
    }
}

const debug$4 = createDebug('sdk:auth:manager');
/**
 * Manages authentication by using different authentication providers and strategies.
 *
 * Responsible for the registration and management of multiple authentication strategies.
 *
 * It allows for setting the current strategy, authenticating requests, and tracking authentication status.
 */
class AuthManager {
    _authProviderFactory;
    _authProvider;
    _isAuthenticated = false;
    constructor(
    // Dependencies
    authProviderFactory = new AuthProviderFactory()) {
        debug$4('initializing a new auth manager');
        // Initialization
        this._authProviderFactory = authProviderFactory;
        // Setup
        this.registerDefaultProviders();
    }
    /**
     * Retrieves the strategy name of the currently active authentication provider.
     *
     * @returns The name of the current authentication strategy, or undefined if no provider is set.
     */
    get strategy() {
        return this._authProvider?.name;
    }
    /**
     * Checks if the last authentication was successful and if the current provider can authenticate HTTP requests.
     *
     * @returns A boolean indicating whether the user is currently authenticated.
     */
    get isAuthenticated() {
        return this._isAuthenticated;
    }
    /**
     * Resets the authentication status to unauthenticated when an unauthorized error is encountered.
     *
     * @example
     * ```typescript
     * authManager.handleUnauthorizedError();
     *
     * console.log(authManager.isAuthenticated); // false
     * ```
     */
    handleUnauthorizedError() {
        debug$4('unauthorized error encountered, resetting authentication status');
        this._isAuthenticated = false;
    }
    /**
     * Sets the current authentication strategy with configuration options.
     *
     * @param strategy - The name of the authentication strategy to be set.
     * @param options - Configuration options required to initialize the strategy.
     *
     * @example
     * ```typescript
     * authManager.setStrategy('api-token', { jwt: 'my-token' });
     * ```
     */
    setStrategy(strategy, options) {
        debug$4('setting strategy to %o', strategy);
        this._authProvider = this._authProviderFactory.create(strategy, options);
    }
    /**
     * Performs authentication by using the current authentication provider.
     *
     * @param http - The HttpClient instance that can be used for the authentication process.
     *
     * @returns A promise that resolves when the authentication process is complete.
     *
     * @example
     * ```typescript
     * await authManager.authenticate(httpClient);
     *
     * console.log(authManager.isAuthenticated); // true or false depending on success
     * ```
     */
    async authenticate(http) {
        if (this._authProvider === undefined) {
            debug$4('no auth provider is set, skipping authentication');
            this._isAuthenticated = false;
            return;
        }
        try {
            debug$4('trying to authenticate with %s', this._authProvider.name);
            await this._authProvider.authenticate(http);
            this._isAuthenticated = true;
            debug$4('authentication successful');
        }
        catch {
            debug$4('authentication failed');
            this._isAuthenticated = false;
        }
    }
    /**
     * Adds authentication headers to an HTTP request using the current authentication provider.
     *
     * @param request - The HTTP request to which authentication headers are added.
     *
     * @example
     * ```typescript
     * const request = new Request('https://api.example.com/data');
     *
     * authManager.authenticateRequest(request);
     *
     * console.log(request.headers.get('Authorization')) // 'Bearer <token>'
     * ```
     */
    authenticateRequest(request) {
        if (this._authProvider) {
            const { headers } = this._authProvider;
            for (const [key, value] of Object.entries(headers)) {
                request.headers.set(key, value);
                debug$4('added %o header to %o query', key, URLHelper.toReadablePath(request.url));
            }
        }
        else {
            debug$4('no auth provider is set. skipping headers for %s query', URLHelper.toReadablePath(request.url));
        }
    }
    /**
     * Registers the SDK default authentication providers in the factory so that they can be later selected.
     *
     * The default authentication providers are:
     * - API Token ({@link ApiTokenAuthProvider})
     * - Users Permissions ({@link UsersPermissionsAuthProvider})
     *
     * @note This method is called internally during initialization to set up the available strategies.
     */
    registerDefaultProviders() {
        debug$4('registering default authentication providers');
        this._authProviderFactory
            // API Token
            .register(ApiTokenAuthProvider.identifier, (options) => new ApiTokenAuthProvider(options))
            // Users and Permissions
            .register(UsersPermissionsAuthProvider.identifier, (options) => new UsersPermissionsAuthProvider(options));
        debug$4('default authentication providers registered successfully');
    }
}

const debug$3 = createDebug('sdk:validators:url');
/**
 * Class representing a URLValidator.
 *
 * It provides the ability to validate URLs based on a predefined list of allowed protocols.
 */
class URLValidator {
    /**
     * Validates the provided URL.
     *
     * This method checks that the provided URL is a string and can be parsed.
     *
     * @param url - The URL to be validated. This parameter must be a valid string representation of a URL.
     *
     * @throws {URLParsingError} Thrown if the URL is not a string or can't be parsed.
     *
     * @example
     * // Example of validating a URL successfully
     * const validator = new URLValidator();
     *
     * const url = 'http://example.com';
     *
     * validator.validate(url); // Does not throw an error
     *
     * @example
     * // Example of a failing validation
     * const validator = new URLValidator();
     *
     * const url = 123;
     *
     * try {
     *   validator.validate(url);
     * } catch (error) {
     *   console.error(error); // URLParsingError
     * }
     */
    validate(url) {
        if (typeof url !== 'string') {
            debug$3('url must be a string, received: %o (%s)', url, typeof url);
            throw new URLParsingError(url);
        }
        const canParse = this.canParse(url);
        if (!canParse) {
            debug$3('url could not be parsed: %o (%s)', url, typeof url);
            throw new URLParsingError(url);
        }
        debug$3('validated url successfully: %o', url);
    }
    /**
     * Checks if the URL string can be parsed.
     *
     * @param url - The URL string to be checked.
     *
     * @returns A boolean indicating whether the URL can be parsed.
     */
    canParse(url) {
        return URL.canParse(url);
    }
}

const debug$2 = createDebug('sdk:validators:sdk');
/**
 * Provides the ability to validate the configuration used for initializing the Strapi SDK.
 *
 * This includes URL validation to ensure compatibility with Strapi's API endpoints.
 */
class StrapiSDKValidator {
    _urlValidator;
    constructor(
    // Dependencies
    urlValidator = new URLValidator()) {
        this._urlValidator = urlValidator;
    }
    /**
     * Validates the provided SDK configuration, ensuring that all values are
     * suitable for the SDK operations..
     *
     * @param config - The configuration object for the Strapi SDK. Must include a `baseURL` property indicating the API's endpoint.
     *
     * @throws {StrapiSDKValidationError} If the configuration is invalid, or if the baseURL is invalid.
     */
    validateConfig(config) {
        debug$2('validating sdk config');
        if (config === undefined ||
            config === null ||
            Array.isArray(config) ||
            typeof config !== 'object') {
            debug$2(`provided sdk configuration is not a valid object: %o (%s)`, config, typeof config);
            throw new StrapiSDKValidationError(new TypeError('The provided configuration is not a valid object.'));
        }
        this.validateBaseURL(config.baseURL);
        debug$2('validated sdk config successfully');
    }
    /**
     * Validates the base URL, ensuring it follows acceptable protocols and structure for reliable API interaction.
     *
     * @param url - The base URL string to validate.
     *
     * @throws {StrapiSDKValidationError} If the URL is invalid or if it fails through the URLValidator checks.
     */
    validateBaseURL(url) {
        try {
            debug$2('validating base url');
            this._urlValidator.validate(url);
        }
        catch (e) {
            if (e instanceof URLValidationError) {
                debug$2('failed to validate sdk config, invalid base url %o', url);
                throw new StrapiSDKValidationError(e);
            }
            throw e;
        }
    }
}

var StatusCode;
(function (StatusCode) {
    StatusCode[StatusCode["OK"] = 200] = "OK";
    StatusCode[StatusCode["CREATED"] = 201] = "CREATED";
    StatusCode[StatusCode["NO_CONTENT"] = 204] = "NO_CONTENT";
    StatusCode[StatusCode["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    StatusCode[StatusCode["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    StatusCode[StatusCode["FORBIDDEN"] = 403] = "FORBIDDEN";
    StatusCode[StatusCode["NOT_FOUND"] = 404] = "NOT_FOUND";
    StatusCode[StatusCode["TIMEOUT"] = 408] = "TIMEOUT";
    StatusCode[StatusCode["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
})(StatusCode || (StatusCode = {}));

const debug$1 = createDebug('sdk:http');
/**
 * Strapi SDK's HTTP Client
 *
 * Provides methods for configuring the base URL, authentication strategies,
 * and for performing HTTP requests with automatic header management and URL validation.
 */
class HttpClient {
    // Properties
    _baseURL;
    // Dependencies
    _authManager;
    _urlValidator;
    constructor(
    // Properties
    baseURL, 
    // Dependencies
    authManager = new AuthManager(), urlValidator = new URLValidator()) {
        debug$1('initializing new client with base url: %o', baseURL);
        // Initialization
        this._baseURL = baseURL;
        this._authManager = authManager;
        this._urlValidator = urlValidator;
        // Validation
        this._urlValidator.validate(this._baseURL);
    }
    /**
     * Gets the currently set base URL.
     *
     * @returns The base URL used for HTTP requests.
     */
    get baseURL() {
        return this._baseURL;
    }
    /**
     * Sets a new base URL for the HTTP client and validates it.
     *
     * @param url - The new base URL to set.
     *
     * @returns The HttpClient instance for chaining.
     *
     * @throws {URLParsingError} If the URL cannot be parsed.
     *
     * @example
     * const client = new HttpClient('http://example.com');
     *
     * client.setBaseURL('http://newexample.com');
     */
    setBaseURL(url) {
        debug$1('setting new base url: %o', url);
        this._urlValidator.validate(url);
        this._baseURL = url;
        return this;
    }
    /**
     * Sets the authentication strategy for the HTTP client.
     *
     * Configures how the client handles authentication based on the specified strategy and options.
     *
     * @param strategy - The authentication strategy to use.
     * @param options - Additional options required for the authentication strategy.
     *
     * @throws {StrapiSDKError} If the given strategy is not supported
     *
     * @returns The HttpClient instance for chaining.
     *
     * @example
     * client.setAuthStrategy('api-token', { token: 'abc123' });
     */
    setAuthStrategy(strategy, options) {
        debug$1('setting auth strategy to %o', strategy);
        this._authManager.setStrategy(strategy, options);
        return this;
    }
    /**
     * Performs an HTTP fetch request to the specified URL.
     *
     * Attaches the necessary headers, authenticates if required, and handles unauthorized errors.
     *
     * @param path - The path to which the request is made, appended to the base URL.
     * @param [init] - Optional object containing any custom settings to apply to the fetch request.
     *
     * @returns A promise that resolves to the HTTP response.
     *
     * @throws {Error} If the authentication can't be completed, or if the server can't be reached
     *
     * @example
     * client.fetch('/data')
     *  .then(response => response.json())
     *  .then(data => console.log(data));
     */
    async fetch(path, init) {
        const url = new URL(`${this._baseURL}${path}`);
        const request = new Request(url, init);
        debug$1('performing a fetch request to %o', RequestHelper.format(request));
        const { strategy, isAuthenticated } = this._authManager;
        if (strategy && !isAuthenticated) {
            debug$1('an auth strategy is set (%o), but the client is not authenticated, trying to authenticate now', strategy);
            await this._authManager.authenticate(this);
        }
        this.attachHeaders(request);
        try {
            return await this._fetch(request);
        }
        catch (e) {
            this.handleFetchError(e);
            throw e;
        }
    }
    /**
     * Handles HTTP fetch error logic.
     *
     * It deals with unauthorized responses by delegating the handling of the error to the authentication manager.
     *
     * @param error - The original HTTP request object that encountered an error. Used for error handling.
     *
     * @see {@link AuthManager#handleUnauthorizedError} for handling unauthorized responses.
     */
    handleFetchError(error) {
        if (error instanceof HTTPAuthorizationError) {
            debug$1('received an authorization error, delegating to the auth manager for handling');
            this._authManager.handleUnauthorizedError();
        }
    }
    /**
     * Executes an HTTP fetch request using the Fetch API.
     *
     * @param input - The target of the HTTP request which can be a string URL or a `Request` object.
     * @param [init] - An optional `RequestInit` object that contains any custom settings that you want to apply to the request.
     *
     * @returns A promise that resolves to the `Response` object representing the complete HTTP response.
     *
     * @throws {HTTPError} if the request fails
     *
     * @additionalInfo
     * - This method doesn't perform any authentication or header customization.
     *   It directly passes the parameters to the global `fetch` function.
     * - To include authentication, consider using the `fetch` method from the `HttpClient` class, which handles headers and authentication.
     */
    async _fetch(input, init) {
        const request = new Request(input, init);
        debug$1('performing an internal fetch request to %o', RequestHelper.format(request));
        const response = await globalThis.fetch(request);
        if (!response.ok) {
            const { status, statusText } = response;
            debug$1('server responded to %o with an error status: %o, reason: %o', RequestHelper.format(request), status, statusText);
            throw this.mapResponseToHTTPError(response, request);
        }
        return response;
    }
    /**
     * Attaches default and authentication headers to an HTTP request.
     *
     * This method ensures that a default 'Content-Type' header is set for the request if it is not already specified.
     *
     * It also delegates to the AuthManager to append any necessary authentication headers,
     * potentially overwriting existing ones to ensure correct authorization.
     *
     * @param request - The HTTP request object to which headers are added.
     */
    attachHeaders(request) {
        this.setContentTypeHeader(request);
        // Set auth headers if available, potentially overwrite manually set auth headers
        this._authManager.authenticateRequest(request);
    }
    setContentTypeHeader(request) {
        const [key, value] = ['Content-Type', 'application/json'];
        request.headers.set(key, value);
        debug$1('%o header set to %o for %o', key, value, RequestHelper.format(request));
    }
    /**
     * Maps an HTTP response's status code to a specific HTTP error class.
     *
     * @param response - The HTTP response object obtained from a failed HTTP request,
     *                   which contains the status code and reason for failure.
     * @param request - The original HTTP request object that resulted in the error response.
     *
     * @returns A specific subclass instance of HTTPError based on the response status code.
     *
     * @throws {HTTPError} or any of its subclass.
     *
     * @see {@link StatusCode} for all possible HTTP status codes and their meanings.
     */
    mapResponseToHTTPError(response, request) {
        switch (response.status) {
            case StatusCode.BAD_REQUEST:
                return new HTTPBadRequestError(response, request);
            case StatusCode.UNAUTHORIZED:
                return new HTTPAuthorizationError(response, request);
            case StatusCode.FORBIDDEN:
                return new HTTPForbiddenError(response, request);
            case StatusCode.NOT_FOUND:
                return new HTTPNotFoundError(response, request);
            case StatusCode.TIMEOUT:
                return new HTTPTimeoutError(response, request);
            case StatusCode.INTERNAL_SERVER_ERROR:
                return new HTTPInternalServerError(response, request);
        }
        return new HTTPError(response, request);
    }
}

const debug = createDebug('sdk:core');
/**
 * Class representing the Strapi SDK to interface with a Strapi backend.
 *
 * This class integrates setting up configuration, validation, and handling
 * HTTP requests with authentication.
 *
 * It serves as the main interface through which users interact with
 * their Strapi installation programmatically.
 *
 * @template T_Config - Configuration type inferred from the user-provided SDK configuration
 */
class StrapiSDK {
    /** @internal */
    _config;
    /** @internal */
    _validator;
    /** @internal */
    _httpClient;
    /** @internal */
    constructor(
    // Properties
    config, 
    // Dependencies
    validator = new StrapiSDKValidator(), httpClientFactory) {
        // Properties
        this._config = config;
        this._validator = validator;
        debug('started the initialization process');
        // Validation
        this.preflightValidation();
        debug('user config passed the preflight validation');
        // The HTTP client depends on the preflightValidation for the baseURL validity.
        // It could be instantiated before but would throw an invalid URL error
        // instead of the SDK itself throwing an initialization exception.
        this._httpClient = httpClientFactory?.(config.baseURL) ?? new HttpClient(config.baseURL);
        this.init();
        debug('finished the sdk initialization process');
    }
    /**
     * Performs preliminary validation of the SDK configuration.
     *
     * This method ensures that the provided configuration for the SDK is valid by using the
     * internal SDK validator. It is invoked during the initialization process to confirm that
     * all necessary parts are correctly configured before effectively using the SDK.
     *
     * @throws {StrapiSDKInitializationError} If the configuration validation fails, indicating an issue with the SDK initialization process.
     *
     * @example
     * // Creating a new instance of StrapiSDK which triggers preflightValidation
     * const config = {
     *   baseURL: 'https://example.com',
     *   auth: {
     *     strategy: 'jwt',
     *     options: { token: 'your-token-here' }
     *   }
     * };
     * const sdk = new StrapiSDK(config);
     *
     * // The preflightValidation is automatically called within the constructor
     * // to ensure the provided config is valid prior to any further setup.
     *
     * @note This method is private and only called internally during SDK initialization.
     *
     * @internal
     */
    preflightValidation() {
        try {
            debug('validating the configuration');
            this._validator.validateConfig(this._config);
        }
        catch (e) {
            throw new StrapiSDKInitializationError(e);
        }
    }
    /**
     * Initializes the configuration settings for the SDK.
     *
     * Sets up the necessary parts required for the SDK's operation,
     * including setting up an authentication strategy if provided.
     *
     * @throws {StrapiSDKValidationError} From the _httpClient if the baseURL is invalid.
     *
     * @note
     * - This method is private and internally invoked only during SDK initialization.
     * - Although this method technically -can- throw a validation error, the baseURL
     *       should already have been validated during the SDK preflight validation.
     *
     * @internal
     */
    init() {
        if (this.auth) {
            const { strategy, options } = this.auth;
            debug('setting up the http auth strategy using %o', strategy);
            this._httpClient.setAuthStrategy(strategy, options);
        }
    }
    /**
     * Retrieves the authentication configuration for the Strapi SDK.
     *
     * @note This is a private property used internally within the SDK for configuring authentication in the HTTP layer.
     *
     * @internal
     */
    get auth() {
        return this._config.auth;
    }
    /**
     * Retrieves the base URL of the Strapi SDK instance.
     *
     * This getter returns the `baseURL` property stored within the SDK's configuration object.
     *
     * The base URL is used as the starting point for all HTTP requests initiated through the SDK.
     *
     * @returns The current base URL configured in the SDK.
     *          This URL typically represents the root endpoint of the Strapi service the SDK interfaces with.
     *
     * @example
     * const config = { baseURL: 'http://localhost:1337/api' };
     * const sdk = new StrapiSDK(config);
     *
     * console.log(sdk.baseURL); // Output: http://localhost:1337
     */
    get baseURL() {
        return this._config.baseURL;
    }
    /**
     * Executes an HTTP fetch request to a specified endpoint using the SDK HTTP client.
     *
     * This method ensures authentication is handled before issuing requests and sets the necessary headers.
     *
     * @param url - The endpoint to fetch from, appended to the base URL of the SDK.
     * @param [init] - Optional initialization options for the request, such as headers or method type.
     *
     * @example
     * ```typescript
     * // Create the SDK instance
     * const sdk = strapiSDK({ baseURL: 'http://localhost:1337/api' );
     *
     * // Perform a custom fetch query
     * const response = await sdk.fetch('/categories');
     *
     * // Parse the categories into a readable JSON object
     * const categories = await response.json();
     *
     * // Log the categories
     * console.log(categories);
     * ```
     *
     * @note
     * - The method automatically handles authentication by checking if the user is authenticated and attempts to authenticate if not.
     * - The base URL is prepended to the provided endpoint path.
     */
    fetch(url, init) {
        return this._httpClient.fetch(url, init);
    }
    /**
     * Returns a {@link CollectionTypeManager} instance to interact with the specified collection-type routes in the
     * Strapi app.
     *
     * This instance provides methods for performing operations on the associated documents: create, read, update, delete.
     *
     * @param resource -  The plural name of the collection to interact with.
     *                    This should match the collection name as defined in the Strapi app.
     *
     * @returns An instance of {@link CollectionTypeManager} targeting the given {@link resource} name.
     *
     * @example
     * ```typescript
     * // Initialize the SDK with required configuration
     * const sdk = new StrapiSDK({ baseURL: 'http://localhost:1337/api' });
     *
     * // Retrieve a CollectionTypeManager for the 'articles' resource
     * const articles = sdk.collection('articles');
     *
     * // Example: find all articles
     * const allArticles = await articles.find();
     *
     * // Example: find a single article by ID
     * const singleArticle = await articles.findOne('936c6dc0-f2ec-46c3-ac6d-c0f2ec46c396');
     *
     * // Example: create a new article
     * const newArticle = await articles.create({ title: 'New Article' });
     *
     * // Example: update an existing article
     * const updatedArticle = await articles.update('90169631-7033-4963-9696-317033a96341', { title: 'Updated Title' });
     *
     * // Example: delete an article
     * await articles.delete('dde61ffb-00a6-4cc7-a61f-fb00a63cc740');
     * ```
     *
     * @see CollectionTypeManager
     * @see StrapiSDK
     */
    collection(resource) {
        return new CollectionTypeManager(resource, this._httpClient);
    }
    /**
     * Returns a {@link SingleTypeManager} instance to interact with the specified single-type routes in the Strapi app.
     *
     * This instance provides methods for managing the associated single-type document: read, update, delete.
     *
     * @param resource - The singular name of the single-type resource to interact with.
     *                   This should match the single-type name as defined in the Strapi app.
     *
     * @returns An instance of {@link SingleTypeManager} targeting the given {@link resource} name.
     *
     * @example
     * ```typescript
     * // Initialize the SDK with required configuration
     * const sdk = new StrapiSDK({ baseURL: 'http://localhost:1337/api' });
     *
     * // Retrieve a SingleTypeManager for the 'homepage' resource
     * const homepage = sdk.single('homepage');
     *
     * // Example: fetch the homepage content in Spanish
     * const homepageContent = await homepage.find({ locale: 'es' });
     *
     * // Example: update the homepage content
     * const updatedHomepage = await homepage.update({ title: 'Updated Homepage Title' });
     *
     * // Example: delete the homepage content
     * await homepage.delete();
     * ```
     *
     * @see SingleTypeManager
     * @see StrapiSDK
     */
    single(resource) {
        return new SingleTypeManager(resource, this._httpClient);
    }
}

/**
 * Creates a new instance of the Strapi SDK with a specified configuration.
 *
 * The Strapi SDK functions as a client library to interface with the Strapi content API.
 *
 * It facilitates reliable and secure interactions with Strapi's APIs by handling URL validation,
 * request dispatch, and response parsing for content management.
 *
 * @param config - The configuration for initializing the SDK. This should include the base URL
 *                 of the Strapi content API that the SDK communicates with. The baseURL
 *                 must be formatted with one of the supported protocols: `http` or `https`.
 *                 Additionally, optional authentication details can be specified within the config.
 *
 * @returns An instance of the Strapi SDK configured with the specified baseURL and auth settings.
 *
 * @example
 * ```typescript
 * // Basic configuration using API token auth
 * const sdkConfig = {
 *   baseURL: 'https://api.example.com',
 *   auth: {
 *     strategy: 'api-token',
 *     options: { token: 'your_token_here' }
 *   }
 * };
 *
 * // Create the SDK instance
 * const strapiSDK = strapiSDK(sdkConfig);
 *
 * // Using the SDK to fetch content from a custom endpoint
 * const response = await strapiSDK.fetch('/content-endpoint');
 * const data = await response.json();
 *
 * console.log(data);
 * ```
 *
 * @throws {StrapiSDKInitializationError} If the provided baseURL does not conform to a valid HTTP or HTTPS URL,
 *                                        or if the auth configuration is invalid.
 */
const strapiSDK = (config) => {
    const sdkValidator = new StrapiSDKValidator();
    return new StrapiSDK(
    // Properties
    config, 
    // Dependencies
    sdkValidator);
};

exports.HTTPAuthorizationError = HTTPAuthorizationError;
exports.HTTPBadRequestError = HTTPBadRequestError;
exports.HTTPError = HTTPError;
exports.HTTPForbiddenError = HTTPForbiddenError;
exports.HTTPInternalServerError = HTTPInternalServerError;
exports.HTTPNotFoundError = HTTPNotFoundError;
exports.HTTPTimeoutError = HTTPTimeoutError;
exports.StrapiSDKError = StrapiSDKError;
exports.StrapiSDKInitializationError = StrapiSDKInitializationError;
exports.StrapiSDKValidationError = StrapiSDKValidationError;
exports.URLParsingError = URLParsingError;
exports.URLValidationError = URLValidationError;
exports.strapiSDK = strapiSDK;
//# sourceMappingURL=bundle.cjs.js.map
