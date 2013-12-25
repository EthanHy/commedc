/*!
 * jQuery JavaScript Library v1.8.3
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: Tue Nov 13 2012 08:20:33 GMT-0500 (Eastern Standard Time)
 */
(function( window, undefined ) {
var
	// A central reference to the root jQuery(document)
	rootjQuery,

	// The deferred used on DOM ready
	readyList,

	// Use the correct document accordingly with window argument (sandbox)
	document = window.document,
	location = window.location,
	navigator = window.navigator,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// Save a reference to some core methods
	core_push = Array.prototype.push,
	core_slice = Array.prototype.slice,
	core_indexOf = Array.prototype.indexOf,
	core_toString = Object.prototype.toString,
	core_hasOwn = Object.prototype.hasOwnProperty,
	core_trim = String.prototype.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source,

	// Used for detecting and trimming whitespace
	core_rnotwhite = /\S/,
	core_rspace = /\s+/,

	// Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	rquickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d\d*\.|)\d+(?:[eE][\-+]?\d+|)/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return ( letter + "" ).toUpperCase();
	},

	// The ready event handler and self cleanup method
	DOMContentLoaded = function() {
		if ( document.addEventListener ) {
			document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
			jQuery.ready();
		} else if ( document.readyState === "complete" ) {
			// we're here because readyState === "complete" in oldIE
			// which is good enough for us to call the dom ready!
			document.detachEvent( "onreadystatechange", DOMContentLoaded );
			jQuery.ready();
		}
	},

	// [[Class]] -> type pairs
	class2type = {};

jQuery.fn = jQuery.prototype = {
	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem, ret, doc;

		// Handle $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle $(DOMElement)
		if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;
					doc = ( context && context.nodeType ? context.ownerDocument || context : document );

					// scripts is true for back-compat
					selector = jQuery.parseHTML( match[1], doc, true );
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						this.attr.call( selector, context, true );
					}

					return jQuery.merge( this, selector );

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The current version of jQuery being used
	jquery: "1.8.3",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems, name, selector ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		ret.context = this.context;

		if ( name === "find" ) {
			ret.selector = this.selector + ( this.selector ? " " : "" ) + selector;
		} else if ( name ) {
			ret.selector = this.selector + "." + name + "(" + selector + ")";
		}

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	eq: function( i ) {
		i = +i;
		return i === -1 ?
			this.slice( i ) :
			this.slice( i, i + 1 );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ),
			"slice", core_slice.call(arguments).join(",") );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.ready, 1 );
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		return obj == null ?
			String( obj ) :
			class2type[ core_toString.call(obj) ] || "object";
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!core_hasOwn.call(obj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for ( key in obj ) {}

		return key === undefined || core_hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// scripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, scripts ) {
		var parsed;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			scripts = context;
			context = 0;
		}
		context = context || document;

		// Single tag
		if ( (parsed = rsingleTag.exec( data )) ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts ? null : [] );
		return jQuery.merge( [],
			(parsed.cacheable ? jQuery.clone( parsed.fragment ) : parsed.fragment).childNodes );
	},

	parseJSON: function( data ) {
		if ( !data || typeof data !== "string") {
			return null;
		}

		// Make sure leading/trailing whitespace is removed (IE can't handle it)
		data = jQuery.trim( data );

		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		// Make sure the incoming data is actual JSON
		// Logic borrowed from http://json.org/json2.js
		if ( rvalidchars.test( data.replace( rvalidescape, "@" )
			.replace( rvalidtokens, "]" )
			.replace( rvalidbraces, "")) ) {

			return ( new Function( "return " + data ) )();

		}
		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && core_rnotwhite.test( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var name,
			i = 0,
			length = obj.length,
			isObj = length === undefined || jQuery.isFunction( obj );

		if ( args ) {
			if ( isObj ) {
				for ( name in obj ) {
					if ( callback.apply( obj[ name ], args ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.apply( obj[ i++ ], args ) === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isObj ) {
				for ( name in obj ) {
					if ( callback.call( obj[ name ], name, obj[ name ] ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.call( obj[ i ], i, obj[ i++ ] ) === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Use native String.trim function wherever possible
	trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
		function( text ) {
			return text == null ?
				"" :
				core_trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var type,
			ret = results || [];

		if ( arr != null ) {
			// The window, strings (and functions) also have 'length'
			// Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
			type = jQuery.type( arr );

			if ( arr.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow( arr ) ) {
				core_push.call( ret, arr );
			} else {
				jQuery.merge( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( core_indexOf ) {
				return core_indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}

		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value, key,
			ret = [],
			i = 0,
			length = elems.length,
			// jquery objects are treated as arrays
			isArray = elems instanceof jQuery || length !== undefined && typeof length === "number" && ( ( length > 0 && elems[ 0 ] && elems[ length -1 ] ) || length === 0 || jQuery.isArray( elems ) ) ;

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( key in elems ) {
				value = callback( elems[ key ], key, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return ret.concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var tmp, args, proxy;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, pass ) {
		var exec,
			bulk = key == null,
			i = 0,
			length = elems.length;

		// Sets many values
		if ( key && typeof key === "object" ) {
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], 1, emptyGet, value );
			}
			chainable = 1;

		// Sets one value
		} else if ( value !== undefined ) {
			// Optionally, function values get executed if exec is true
			exec = pass === undefined && jQuery.isFunction( value );

			if ( bulk ) {
				// Bulk operations only iterate when executing function values
				if ( exec ) {
					exec = fn;
					fn = function( elem, key, value ) {
						return exec.call( jQuery( elem ), value );
					};

				// Otherwise they run against the entire set
				} else {
					fn.call( elems, value );
					fn = null;
				}
			}

			if ( fn ) {
				for (; i < length; i++ ) {
					fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
				}
			}

			chainable = 1;
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready, 1 );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", jQuery.ready, false );

		// If IE event model is used
		} else {
			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", DOMContentLoaded );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", jQuery.ready );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}

						// and execute any waiting functions
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.split( core_rspace ), function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// Flag to know if list is currently firing
		firing,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Control if a given callback is in the list
			has: function( fn ) {
				return jQuery.inArray( fn, list ) > -1;
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				args = args || [];
				args = [ context, args.slice ? args.slice() : args ];
				if ( list && ( !fired || stack ) ) {
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ]( jQuery.isFunction( fn ) ?
								function() {
									var returned = fn.apply( this, arguments );
									if ( returned && jQuery.isFunction( returned.promise ) ) {
										returned.promise()
											.done( newDefer.resolve )
											.fail( newDefer.reject )
											.progress( newDefer.notify );
									} else {
										newDefer[ action + "With" ]( this === deferred ? newDefer : this, [ returned ] );
									}
								} :
								newDefer[ action ]
							);
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ] = list.fire
			deferred[ tuple[0] ] = list.fire;
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function() {

	var support,
		all,
		a,
		select,
		opt,
		input,
		fragment,
		eventName,
		i,
		isSupported,
		clickFn,
		div = document.createElement("div");

	// Setup
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// Support tests won't run in some limited or non-browser environments
	all = div.getElementsByTagName("*");
	a = div.getElementsByTagName("a")[ 0 ];
	if ( !all || !a || !all.length ) {
		return {};
	}

	// First batch of tests
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	a.style.cssText = "top:1px;float:left;opacity:.5";
	support = {
		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: ( div.firstChild.nodeType === 3 ),

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName("tbody").length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName("link").length,

		// Get the style information from getAttribute
		// (IE uses .cssText instead)
		style: /top/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: ( a.getAttribute("href") === "/a" ),

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.5/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Make sure that if no value is specified for a checkbox
		// that it defaults to "on".
		// (WebKit defaults to "" instead)
		checkOn: ( input.value === "on" ),

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: opt.selected,

		// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
		getSetAttribute: div.className !== "t",

		// Tests for enctype support on a form (#6743)
		enctype: !!document.createElement("form").enctype,

		// Makes sure cloning an html5 element does not cause problems
		// Where outerHTML is undefined, this still works
		html5Clone: document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>",

		// jQuery.support.boxModel DEPRECATED in 1.8 since we don't support Quirks Mode
		boxModel: ( document.compatMode === "CSS1Compat" ),

		// Will be defined later
		submitBubbles: true,
		changeBubbles: true,
		focusinBubbles: false,
		deleteExpando: true,
		noCloneEvent: true,
		inlineBlockNeedsLayout: false,
		shrinkWrapBlocks: false,
		reliableMarginRight: true,
		boxSizingReliable: true,
		pixelPosition: false
	};

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Test to see if it's possible to delete an expando from an element
	// Fails in Internet Explorer
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	if ( !div.addEventListener && div.attachEvent && div.fireEvent ) {
		div.attachEvent( "onclick", clickFn = function() {
			// Cloning a node shouldn't copy over any
			// bound event handlers (IE does this)
			support.noCloneEvent = false;
		});
		div.cloneNode( true ).fireEvent("onclick");
		div.detachEvent( "onclick", clickFn );
	}

	// Check if a radio maintains its value
	// after being appended to the DOM
	input = document.createElement("input");
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";

	input.setAttribute( "checked", "checked" );

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "name", "t" );

	div.appendChild( input );
	fragment = document.createDocumentFragment();
	fragment.appendChild( div.lastChild );

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	fragment.removeChild( input );
	fragment.appendChild( div );

	// Technique from Juriy Zaytsev
	// http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
	// We only care about the case where non-standard event systems
	// are used, namely in IE. Short-circuiting here helps us to
	// avoid an eval call (in setAttribute) which can cause CSP
	// to go haywire. See: https://developer.mozilla.org/en/Security/CSP
	if ( div.attachEvent ) {
		for ( i in {
			submit: true,
			change: true,
			focusin: true
		}) {
			eventName = "on" + i;
			isSupported = ( eventName in div );
			if ( !isSupported ) {
				div.setAttribute( eventName, "return;" );
				isSupported = ( typeof div[ eventName ] === "function" );
			}
			support[ i + "Bubbles" ] = isSupported;
		}
	}

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, div, tds, marginDiv,
			divReset = "padding:0;margin:0;border:0;display:block;overflow:hidden;",
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "visibility:hidden;border:0;width:0;height:0;position:static;top:0;margin-top:1px";
		body.insertBefore( container, body.firstChild );

		// Construct the test element
		div = document.createElement("div");
		container.appendChild( div );

		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		// (only IE 8 fails this test)
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName("td");
		tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Check if empty table cells still have offsetWidth/Height
		// (IE <= 8 fail this test)
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check box-sizing and margin behavior
		div.innerHTML = "";
		div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";
		support.boxSizing = ( div.offsetWidth === 4 );
		support.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== 1 );

		// NOTE: To any future maintainer, we've window.getComputedStyle
		// because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. For more
			// info see bug #3333
			// Fails in WebKit before Feb 2011 nightlies
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = document.createElement("div");
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";
			div.appendChild( marginDiv );
			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		if ( typeof div.style.zoom !== "undefined" ) {
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			// (IE < 8 does this)
			div.innerHTML = "";
			div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Check if elements with layout shrink-wrap their children
			// (IE 6 does this)
			div.style.display = "block";
			div.style.overflow = "visible";
			div.innerHTML = "<div></div>";
			div.firstChild.style.width = "5px";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

			container.style.zoom = 1;
		}

		// Null elements to avoid leaks in IE
		body.removeChild( container );
		container = div = tds = marginDiv = null;
	});

	// Null elements to avoid leaks in IE
	fragment.removeChild( div );
	all = a = select = opt = input = fragment = div = null;

	return support;
})();
var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

jQuery.extend({
	cache: {},

	deletedIds: [],

	// Remove at next major release (1.9/2.0)
	uuid: 0,

	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( jQuery.fn.jquery + Math.random() ).replace( /\D/g, "" ),

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var thisCache, ret,
			internalKey = jQuery.expando,
			getByName = typeof name === "string",

			// We have to handle DOM nodes and JS objects differently because IE6-7
			// can't GC object references properly across the DOM-JS boundary
			isNode = elem.nodeType,

			// Only DOM nodes need the global jQuery cache; JS object data is
			// attached directly to the object so GC can occur automatically
			cache = isNode ? jQuery.cache : elem,

			// Only defining an ID for JS objects if its cache already exists allows
			// the code to shortcut on the same path as a DOM node with no cache
			id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

		// Avoid doing any more work than we need to when trying to get data on an
		// object that has no data at all
		if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && getByName && data === undefined ) {
			return;
		}

		if ( !id ) {
			// Only DOM nodes need a new unique ID for each element since their data
			// ends up in the global cache
			if ( isNode ) {
				elem[ internalKey ] = id = jQuery.deletedIds.pop() || jQuery.guid++;
			} else {
				id = internalKey;
			}
		}

		if ( !cache[ id ] ) {
			cache[ id ] = {};

			// Avoids exposing jQuery metadata on plain JS objects when the object
			// is serialized using JSON.stringify
			if ( !isNode ) {
				cache[ id ].toJSON = jQuery.noop;
			}
		}

		// An object can be passed to jQuery.data instead of a key/value pair; this gets
		// shallow copied over onto the existing cache
		if ( typeof name === "object" || typeof name === "function" ) {
			if ( pvt ) {
				cache[ id ] = jQuery.extend( cache[ id ], name );
			} else {
				cache[ id ].data = jQuery.extend( cache[ id ].data, name );
			}
		}

		thisCache = cache[ id ];

		// jQuery data() is stored in a separate object inside the object's internal data
		// cache in order to avoid key collisions between internal data and user-defined
		// data.
		if ( !pvt ) {
			if ( !thisCache.data ) {
				thisCache.data = {};
			}

			thisCache = thisCache.data;
		}

		if ( data !== undefined ) {
			thisCache[ jQuery.camelCase( name ) ] = data;
		}

		// Check for both converted-to-camel and non-converted data property names
		// If a data property was specified
		if ( getByName ) {

			// First Try to find as-is property data
			ret = thisCache[ name ];

			// Test for null|undefined property data
			if ( ret == null ) {

				// Try to find the camelCased property
				ret = thisCache[ jQuery.camelCase( name ) ];
			}
		} else {
			ret = thisCache;
		}

		return ret;
	},

	removeData: function( elem, name, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var thisCache, i, l,

			isNode = elem.nodeType,

			// See jQuery.data for more information
			cache = isNode ? jQuery.cache : elem,
			id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

		// If there is already no cache entry for this object, there is no
		// purpose in continuing
		if ( !cache[ id ] ) {
			return;
		}

		if ( name ) {

			thisCache = pvt ? cache[ id ] : cache[ id ].data;

			if ( thisCache ) {

				// Support array or space separated string names for data keys
				if ( !jQuery.isArray( name ) ) {

					// try the string as a key before any manipulation
					if ( name in thisCache ) {
						name = [ name ];
					} else {

						// split the camel cased version by spaces unless a key with the spaces exists
						name = jQuery.camelCase( name );
						if ( name in thisCache ) {
							name = [ name ];
						} else {
							name = name.split(" ");
						}
					}
				}

				for ( i = 0, l = name.length; i < l; i++ ) {
					delete thisCache[ name[i] ];
				}

				// If there is no data left in the cache, we want to continue
				// and let the cache object itself get destroyed
				if ( !( pvt ? isEmptyDataObject : jQuery.isEmptyObject )( thisCache ) ) {
					return;
				}
			}
		}

		// See jQuery.data for more information
		if ( !pvt ) {
			delete cache[ id ].data;

			// Don't destroy the parent cache unless the internal data object
			// had been the only thing left in it
			if ( !isEmptyDataObject( cache[ id ] ) ) {
				return;
			}
		}

		// Destroy the cache
		if ( isNode ) {
			jQuery.cleanData( [ elem ], true );

		// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
		} else if ( jQuery.support.deleteExpando || cache != cache.window ) {
			delete cache[ id ];

		// When all else fails, null
		} else {
			cache[ id ] = null;
		}
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return jQuery.data( elem, name, data, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

		// nodes accept data unless otherwise specified; rejection can be conditional
		return !noData || noData !== true && elem.getAttribute("classid") === noData;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var parts, part, attr, name, l,
			elem = this[0],
			i = 0,
			data = null;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attr = elem.attributes;
					for ( l = attr.length; i < l; i++ ) {
						name = attr[i].name;

						if ( !name.indexOf( "data-" ) ) {
							name = jQuery.camelCase( name.substring(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		parts = key.split( ".", 2 );
		parts[1] = parts[1] ? "." + parts[1] : "";
		part = parts[1] + "!";

		return jQuery.access( this, function( value ) {

			if ( value === undefined ) {
				data = this.triggerHandler( "getData" + part, [ parts[0] ] );

				// Try to fetch any internally stored data first
				if ( data === undefined && elem ) {
					data = jQuery.data( elem, key );
					data = dataAttr( elem, key, data );
				}

				return data === undefined && parts[1] ?
					this.data( parts[0] ) :
					data;
			}

			parts[1] = value;
			this.each(function() {
				var self = jQuery( this );

				self.triggerHandler( "setData" + part, parts );
				jQuery.data( this, key, value );
				self.triggerHandler( "changeData" + part, parts );
			});
		}, null, value, arguments.length > 1, null, false );
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
				data === "false" ? false :
				data === "null" ? null :
				// Only convert to a number if it doesn't change the string
				+data + "" === data ? +data :
				rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray(data) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery.removeData( elem, type + "queue", true );
				jQuery.removeData( elem, key, true );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook, fixSpecified,
	rclass = /[\t\r\n]/g,
	rreturn = /\r/g,
	rtype = /^(?:button|input)$/i,
	rfocusable = /^(?:button|input|object|select|textarea)$/i,
	rclickable = /^a(?:rea|)$/i,
	rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classNames, i, l, elem,
			setClass, c, cl;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call(this, j, this.className) );
			});
		}

		if ( value && typeof value === "string" ) {
			classNames = value.split( core_rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];

				if ( elem.nodeType === 1 ) {
					if ( !elem.className && classNames.length === 1 ) {
						elem.className = value;

					} else {
						setClass = " " + elem.className + " ";

						for ( c = 0, cl = classNames.length; c < cl; c++ ) {
							if ( setClass.indexOf( " " + classNames[ c ] + " " ) < 0 ) {
								setClass += classNames[ c ] + " ";
							}
						}
						elem.className = jQuery.trim( setClass );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var removes, className, elem, c, cl, i, l;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call(this, j, this.className) );
			});
		}
		if ( (value && typeof value === "string") || value === undefined ) {
			removes = ( value || "" ).split( core_rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];
				if ( elem.nodeType === 1 && elem.className ) {

					className = (" " + elem.className + " ").replace( rclass, " " );

					// loop over each item in the removal list
					for ( c = 0, cl = removes.length; c < cl; c++ ) {
						// Remove until there is nothing to remove,
						while ( className.indexOf(" " + removes[ c ] + " ") >= 0 ) {
							className = className.replace( " " + removes[ c ] + " " , " " );
						}
					}
					elem.className = value ? jQuery.trim( className ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					state = stateVal,
					classNames = value.split( core_rspace );

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			} else if ( type === "undefined" || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// toggle whole className
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val,
				self = jQuery(this);

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, self.val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// attributes.value is undefined in Blackberry 4.7 but
				// uses .value. See #6932
				var val = elem.attributes.value;
				return !val || val.specified ? elem.value : elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var values = jQuery.makeArray( value );

				jQuery(elem).find("option").each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	// Unused in 1.8, left in so attrFn-stabbers won't die; remove in 1.9
	attrFn: {},

	attr: function( elem, name, value, pass ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( pass && jQuery.isFunction( jQuery.fn[ name ] ) ) {
			return jQuery( elem )[ name ]( value );
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( notxml ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] || ( rboolean.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;

			} else if ( hooks && "set" in hooks && notxml && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && notxml && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {

			ret = elem.getAttribute( name );

			// Non-existent attributes return null, we normalize to undefined
			return ret === null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var propName, attrNames, name, isBool,
			i = 0;

		if ( value && elem.nodeType === 1 ) {

			attrNames = value.split( core_rspace );

			for ( ; i < attrNames.length; i++ ) {
				name = attrNames[ i ];

				if ( name ) {
					propName = jQuery.propFix[ name ] || name;
					isBool = rboolean.test( name );

					// See #9699 for explanation of this approach (setting first, then removal)
					// Do not do this for boolean attributes (see #10870)
					if ( !isBool ) {
						jQuery.attr( elem, name, "" );
					}
					elem.removeAttribute( getSetAttribute ? name : propName );

					// Set corresponding property to false for boolean attributes
					if ( isBool && propName in elem ) {
						elem[ propName ] = false;
					}
				}
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				// We can't allow the type property to be changed (since it causes problems in IE)
				if ( rtype.test( elem.nodeName ) && elem.parentNode ) {
					jQuery.error( "type property can't be changed" );
				} else if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to it's default in case type is set after value
					// This is for element creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		},
		// Use the value property for back compat
		// Use the nodeHook for button elements in IE6/7 (#1954)
		value: {
			get: function( elem, name ) {
				if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
					return nodeHook.get( elem, name );
				}
				return name in elem ?
					elem.value :
					null;
			},
			set: function( elem, value, name ) {
				if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
					return nodeHook.set( elem, value, name );
				}
				// Does not return so that setAttribute is also used
				elem.value = value;
			}
		}
	},

	propFix: {
		tabindex: "tabIndex",
		readonly: "readOnly",
		"for": "htmlFor",
		"class": "className",
		maxlength: "maxLength",
		cellspacing: "cellSpacing",
		cellpadding: "cellPadding",
		rowspan: "rowSpan",
		colspan: "colSpan",
		usemap: "useMap",
		frameborder: "frameBorder",
		contenteditable: "contentEditable"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				return ( elem[ name ] = value );
			}

		} else {
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
				return ret;

			} else {
				return elem[ name ];
			}
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				var attributeNode = elem.getAttributeNode("tabindex");

				return attributeNode && attributeNode.specified ?
					parseInt( attributeNode.value, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						undefined;
			}
		}
	}
});

// Hook for boolean attributes
boolHook = {
	get: function( elem, name ) {
		// Align boolean attributes with corresponding properties
		// Fall back to attribute presence where some booleans are not supported
		var attrNode,
			property = jQuery.prop( elem, name );
		return property === true || typeof property !== "boolean" && ( attrNode = elem.getAttributeNode(name) ) && attrNode.nodeValue !== false ?
			name.toLowerCase() :
			undefined;
	},
	set: function( elem, value, name ) {
		var propName;
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			// value is true since we know at this point it's type boolean and not false
			// Set boolean attributes to the same name and set the DOM property
			propName = jQuery.propFix[ name ] || name;
			if ( propName in elem ) {
				// Only set the IDL specifically if it already exists on the element
				elem[ propName ] = true;
			}

			elem.setAttribute( name, name.toLowerCase() );
		}
		return name;
	}
};

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	fixSpecified = {
		name: true,
		id: true,
		coords: true
	};

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret;
			ret = elem.getAttributeNode( name );
			return ret && ( fixSpecified[ name ] ? ret.value !== "" : ret.specified ) ?
				ret.value :
				undefined;
		},
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				ret = document.createAttribute( name );
				elem.setAttributeNode( ret );
			}
			return ( ret.value = value + "" );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		});
	});

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		get: nodeHook.get,
		set: function( elem, value, name ) {
			if ( value === "" ) {
				value = "false";
			}
			nodeHook.set( elem, value, name );
		}
	};
}


// Some attributes require a special call on IE
if ( !jQuery.support.hrefNormalized ) {
	jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			get: function( elem ) {
				var ret = elem.getAttribute( name, 2 );
				return ret === null ? undefined : ret;
			}
		});
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Normalize to lowercase since IE uppercases css property names
			return elem.style.cssText.toLowerCase() || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	});
}

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
if ( !jQuery.support.checkOn ) {
	jQuery.each([ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			get: function( elem ) {
				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				return elem.getAttribute("value") === null ? "on" : elem.value;
			}
		};
	});
}
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	});
});
var rformElems = /^(?:textarea|input|select)$/i,
	rtypenamespace = /^([^\.]*|)(?:\.(.+)|)$/,
	rhoverHack = /(?:^|\s)hover(\.\S+|)\b/,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	hoverHack = function( events ) {
		return jQuery.event.special.hover ? events : events.replace( rhoverHack, "mouseenter$1 mouseleave$1" );
	};

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	add: function( elem, types, handler, data, selector ) {

		var elemData, eventHandle, events,
			t, tns, type, namespaces, handleObj,
			handleObjIn, handlers, special;

		// Don't attach events to noData or text/comment nodes (allow plain objects tho)
		if ( elem.nodeType === 3 || elem.nodeType === 8 || !types || !handler || !(elemData = jQuery._data( elem )) ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		events = elemData.events;
		if ( !events ) {
			elemData.events = events = {};
		}
		eventHandle = elemData.handle;
		if ( !eventHandle ) {
			elemData.handle = eventHandle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = jQuery.trim( hoverHack(types) ).split( " " );
		for ( t = 0; t < types.length; t++ ) {

			tns = rtypenamespace.exec( types[t] ) || [];
			type = tns[1];
			namespaces = ( tns[2] || "" ).split( "." ).sort();

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: tns[1],
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			handlers = events[ type ];
			if ( !handlers ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	global: {},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var t, tns, type, origType, namespaces, origCount,
			j, events, special, eventType, handleObj,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = jQuery.trim( hoverHack( types || "" ) ).split(" ");
		for ( t = 0; t < types.length; t++ ) {
			tns = rtypenamespace.exec( types[t] ) || [];
			type = origType = tns[1];
			namespaces = tns[2];

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector? special.delegateType : special.bindType ) || type;
			eventType = events[ type ] || [];
			origCount = eventType.length;
			namespaces = namespaces ? new RegExp("(^|\\.)" + namespaces.split(".").sort().join("\\.(?:.*\\.|)") + "(\\.|$)") : null;

			// Remove matching events
			for ( j = 0; j < eventType.length; j++ ) {
				handleObj = eventType[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					 ( !handler || handler.guid === handleObj.guid ) &&
					 ( !namespaces || namespaces.test( handleObj.namespace ) ) &&
					 ( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					eventType.splice( j--, 1 );

					if ( handleObj.selector ) {
						eventType.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( eventType.length === 0 && origCount !== eventType.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery.removeData( elem, "events", true );
		}
	},

	// Events that are safe to short-circuit if no handlers are attached.
	// Native DOM events should not be added, they may have inline handlers.
	customEvent: {
		"getData": true,
		"setData": true,
		"changeData": true
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		// Don't do events on text and comment nodes
		if ( elem && (elem.nodeType === 3 || elem.nodeType === 8) ) {
			return;
		}

		// Event object or event type
		var cache, exclusive, i, cur, old, ontype, special, handle, eventPath, bubbleType,
			type = event.type || event,
			namespaces = [];

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "!" ) >= 0 ) {
			// Exclusive events trigger only for the exact event (no namespaces)
			type = type.slice(0, -1);
			exclusive = true;
		}

		if ( type.indexOf( "." ) >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}

		if ( (!elem || jQuery.event.customEvent[ type ]) && !jQuery.event.global[ type ] ) {
			// No jQuery handlers for this event type, and it can't have inline handlers
			return;
		}

		// Caller can pass in an Event, Object, or just an event type string
		event = typeof event === "object" ?
			// jQuery.Event object
			event[ jQuery.expando ] ? event :
			// Object literal
			new jQuery.Event( type, event ) :
			// Just the event type (string)
			new jQuery.Event( type );

		event.type = type;
		event.isTrigger = true;
		event.exclusive = exclusive;
		event.namespace = namespaces.join( "." );
		event.namespace_re = event.namespace? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") : null;
		ontype = type.indexOf( ":" ) < 0 ? "on" + type : "";

		// Handle a global trigger
		if ( !elem ) {

			// TODO: Stop taunting the data cache; remove global events and always attach to document
			cache = jQuery.cache;
			for ( i in cache ) {
				if ( cache[ i ].events && cache[ i ].events[ type ] ) {
					jQuery.event.trigger( event, data, cache[ i ].handle.elem, true );
				}
			}
			return;
		}

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data != null ? jQuery.makeArray( data ) : [];
		data.unshift( event );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		eventPath = [[ elem, special.bindType || type ]];
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			cur = rfocusMorph.test( bubbleType + type ) ? elem : elem.parentNode;
			for ( old = elem; cur; cur = cur.parentNode ) {
				eventPath.push([ cur, bubbleType ]);
				old = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( old === (elem.ownerDocument || document) ) {
				eventPath.push([ old.defaultView || old.parentWindow || window, bubbleType ]);
			}
		}

		// Fire handlers on the event path
		for ( i = 0; i < eventPath.length && !event.isPropagationStopped(); i++ ) {

			cur = eventPath[i][0];
			event.type = eventPath[i][1];

			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}
			// Note that this is a bare JS function and not a jQuery handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( elem.ownerDocument, data ) === false) &&
				!(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				// IE<9 dies on focus/blur to hidden element (#1486)
				if ( ontype && elem[ type ] && ((type !== "focus" && type !== "blur") || event.target.offsetWidth !== 0) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					old = elem[ ontype ];

					if ( old ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( old ) {
						elem[ ontype ] = old;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event || window.event );

		var i, j, cur, ret, selMatch, matched, matches, handleObj, sel, related,
			handlers = ( (jQuery._data( this, "events" ) || {} )[ event.type ] || []),
			delegateCount = handlers.delegateCount,
			args = core_slice.call( arguments ),
			run_all = !event.exclusive && !event.namespace,
			special = jQuery.event.special[ event.type ] || {},
			handlerQueue = [];

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers that should run if there are delegated events
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && !(event.button && event.type === "click") ) {

			for ( cur = event.target; cur != this; cur = cur.parentNode || this ) {

				// Don't process clicks (ONLY) on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.disabled !== true || event.type !== "click" ) {
					selMatch = {};
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];
						sel = handleObj.selector;

						if ( selMatch[ sel ] === undefined ) {
							selMatch[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( selMatch[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, matches: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( handlers.length > delegateCount ) {
			handlerQueue.push({ elem: this, matches: handlers.slice( delegateCount ) });
		}

		// Run delegates first; they may want to stop propagation beneath us
		for ( i = 0; i < handlerQueue.length && !event.isPropagationStopped(); i++ ) {
			matched = handlerQueue[ i ];
			event.currentTarget = matched.elem;

			for ( j = 0; j < matched.matches.length && !event.isImmediatePropagationStopped(); j++ ) {
				handleObj = matched.matches[ j ];

				// Triggered event must either 1) be non-exclusive and have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( run_all || (!event.namespace && !handleObj.namespace) || event.namespace_re && event.namespace_re.test( handleObj.namespace ) ) {

					event.data = handleObj.data;
					event.handleObj = handleObj;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						event.result = ret;
						if ( ret === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	// *** attrChange attrName relatedNode srcElement  are not normalized, non-W3C, deprecated, will be removed in 1.8 ***
	props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var eventDoc, doc, body,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop,
			originalEvent = event,
			fixHook = jQuery.event.fixHooks[ event.type ] || {},
			copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = jQuery.Event( originalEvent );

		for ( i = copy.length; i; ) {
			prop = copy[ --i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Fix target property, if necessary (#1925, IE 6/7/8 & Safari2)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Target should not be a text node (#504, Safari)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328; IE6/7/8)
		event.metaKey = !!event.metaKey;

		return fixHook.filter? fixHook.filter( event, originalEvent ) : event;
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},

		focus: {
			delegateType: "focusin"
		},
		blur: {
			delegateType: "focusout"
		},

		beforeunload: {
			setup: function( data, namespaces, eventHandle ) {
				// We only want to do this special case on windows
				if ( jQuery.isWindow( this ) ) {
					this.onbeforeunload = eventHandle;
				}
			},

			teardown: function( namespaces, eventHandle ) {
				if ( this.onbeforeunload === eventHandle ) {
					this.onbeforeunload = null;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{ type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

// Some plugins are using, but it's undocumented/deprecated and will be removed.
// The 1.7 special event interface should provide all the hooks needed now.
jQuery.event.handle = jQuery.event.dispatch;

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event, to properly expose it to GC
			if ( typeof elem[ name ] === "undefined" ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

function returnFalse() {
	return false;
}
function returnTrue() {
	return true;
}

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	preventDefault: function() {
		this.isDefaultPrevented = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}

		// if preventDefault exists run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// otherwise set the returnValue property of the original event to false (IE)
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		this.isPropagationStopped = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}
		// if stopPropagation exists run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}
		// otherwise set the cancelBubble property of the original event to true (IE)
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	},
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj,
				selector = handleObj.selector;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !jQuery._data( form, "_submit_attached" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					jQuery._data( form, "_submit_attached", true );
				}
			});
			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
						}
						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event, true );
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "_change_attached" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					jQuery._data( elem, "_change_attached", true );
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var origFn, type;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) { // && selector != null
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	live: function( types, data, fn ) {
		jQuery( this.context ).on( types, this.selector, data, fn );
		return this;
	},
	die: function( types, fn ) {
		jQuery( this.context ).off( types, this.selector || "**", fn );
		return this;
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		if ( this[0] ) {
			return jQuery.event.trigger( type, data, this[0], true );
		}
	},

	toggle: function( fn ) {
		// Save reference to arguments for access in closure
		var args = arguments,
			guid = fn.guid || jQuery.guid++,
			i = 0,
			toggler = function( event ) {
				// Figure out which function to execute
				var lastToggle = ( jQuery._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
				jQuery._data( this, "lastToggle" + fn.guid, lastToggle + 1 );

				// Make sure that clicks stop
				event.preventDefault();

				// and execute the function
				return args[ lastToggle ].apply( this, arguments ) || false;
			};

		// link all the functions, so any of them can unbind this click handler
		toggler.guid = guid;
		while ( i < args.length ) {
			args[ i++ ].guid = guid;
		}

		return this.click( toggler );
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
});

jQuery.each( ("blur focus focusin focusout load resize scroll unload click dbl JavaS" +
	"mousedown 1.8.3uphttp:/movehttp:/over
 *
 * uthttp:/entncludes leavebrary vchange //sict submit key
 * hkeypressy Foup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[T lice] = under the data, fnense
		if (:33 == null GMT-05	aste 08:2;d Ti08:2 rn Stafunc}

		return arguments.length > 0 ?d Tithis.the  lic,n Sta, 08:20:33 GM:rence to triggere root );
	};

500 (ErkeyEery..testThe defe GMT-05e
 *
 *uery..fixHooksate: Tue Noe the correctkeycumenrredused on D1.8.3ready
	readyList,

	// Use the correct document accordingly with windo1.8.3rgument (s});
/*!
 * Sizzle CSS SCopyror Engine oveCopyright 2012gly wit Foundar th and otheer conributors oveR/sizsed under the MIT licensrite
http://s jQuejs.com/
 */
(under the window,	_$ =finedense
 var cachedruns,
	assertGetIdNotNoot 
	Expr,
	getText,
	isXML,
	 conaire_slcompiltypesortOrdeice,hasDuplicattypeoutermostCcontri,

	baseHring = Obje = trudexOftr= Array.pr= "= Array.p"ng,
expando = ( "sizush,
" + Math.r= Stm() ).replace( ".", "" )ng,
Tokee)
 String,
	doc
	//  =ore_pus.n( selection( Elem)
 *( selecext ) {
	e jQ{
		// ircore = 0tion(nObjenstrpop = [].popnhanushd'
		reushexOf

	/d'
		rt( se, * htUse a stripped-
 * hindexOf if a native ctoris unavailable
	// Used '
		r// Used || under the e jQuGMT-05pe.pir 'enha		luery e to centrafuncfor ( ; i < len; i++ndard Ti00 (Ee to[i] ===]?\d+|)/.souined ) {
ifunct} undeined ) {
-1rredng,
// Augelecta under th immispecial use byer jQue
	markFoking atNov 13 2012 fn, valucense
Time[ im = Stre NouFEFF\ern Stan||le wayfunced ) {
fnOM and NcreateCsh,
\uFEFF\xA0]+)/.source,ush,
 = {} Usedkeyt co[] usetrings
	trim = /^[\smethods
	cokeys\uFEFF\xA0]+$NBSPOnly keepwindotype reclecte in esrnotwhiteh (#y.fn.ag =  ) > .sli.ush,
Lentralpace = /deletevia lo[g = /^shift() ]// Make\-]*)$)Reag
	ve with (\s*\+ ease to avoid collisg at = /(atchingObject.prototype properties (see Issue #157)\-]*ed ) {
(rvalidchar:|,)(?simple wayerre	},via locerredoritilassd over <ize #id ove(),
	tjQue\d+|)/g,

	// Matches daype.indr\d+|)/g,

	// Matches d NBSPRegexa = /-Whitespace characters a referwww.w3.org/TR/css3- Copyrors/#w,

	// Us
	fcamelCaseProp[\\x20\\t\\r\\n\\f]"text, .camelCase as callback to ryntax/#d by jQuer
	d by jQueEncoliceProp(?:\\\\.|[-\\w]|[^\\x00-\\xa0])+re_tr// Loosely moegExd onry inidentifithe  The ready BSP n unquotedle way should botjQcument.addEvent(.camelCase as callback to replace()
	atin case replace()) {
		Pa-fA- 
	},

:etter + "" ).toUpperCaCSS21/sy

	/a.html#uFEFF-def-nt.addEven
	nt.addEvent=tListener dler anda local copw of w#jQuery
BSP ccept_pnu -fA-ace()etter + "" ).toUpperCase );
			jQuery.ready();
		} e
	e dom readself[*^$|!~]?=)rn (uery.readoaded\\[.tri function( + "*(.trievent handler and + ")// [[Class]] -> 
		"*(?:.trie dom read [[Class]] -> type?:(['\"])(f cleanup ^lean])*?)\\3|e paint.addEvent};

|)|
jQuery.fn = jQue "*\\urn se if (efer
var
	// A not in parens/brackete_sl//  windn uery.read* Copyrreadp ovnon-pseudos (dennt.reby :s da
		if ( !senythand elselemenThes[\dae $(ences are here\s*\reducewindonumber of {
			retulement)nee and shed ize$(unindoPSEUDO{
		Filttate		}

		/= ":e pairs
	class2type = {};

f clectioit: function( selector, contex2|([^()[\\]]*|if (totypeady();
		}
		var[^:]|leanu)*|.*))\\ mat	// HanFor match?:<\/POSrn th {
				// 	rets.toStrihanc ( typeuery|odd|eq|gt|lt|nth|first|last) {
			jQuery.fn = jQuery.pro(?:-\\d)?\\d*atch, elem, ret, doc;
)|)(?=[^-]|$length >=Lea and n this;
escaped trailand fcamelCased*\.ptufunc somehis;
 function( d by jQuerypndalturn the lattringrtriQuernew-([\Exp( "^// [[Class]] -> ty+|sele^lector, cf cleanu)l ];

			} else {
		+$ of gjQuery
rcomm( wintext) ) {

				// HANDLE: $(htm*,// [[Class]] -> typjQuert insbinentLoadeof jQuery ? context[0] : context;(, letter ) {
		ret>+~]atch, elem, ret, doct && co		}

	ype ? context.o		}

		/pha = /-Easily-parse_pnu/ridbracll thID or TAG		ifCLASSis.length = rquick.sli = /^(?:#([\w\-]+)|(\w+)|\.PlainObje)$/text ), $Quer:not/& cosibatch = /[lettet\r\n\f]*[+~]( selendsWithNs.attrcall\(					thhea = w= /h\d/i& coinput ( t// HAN| Copyr|ntriarea|button
			
	rbackslaw jQu/\\(?!\\)/g= do {
				//catiry.pID":e ? context.own#e pairs
	class2type = {};

jQ&& c	"gleTack parentNode to \\.atch when Blackberry 4.6 returns
		NAME nodes that are no [ lic=t: fu?e pairs
	class2type = {};

{
				;

	urns
		TAGck parentNode to e pairs
	class2type =  which is good enfor .6 returns
		ATTRck parentNode to elector.length rns
		Handle			return rootjQuery. = jQuery.p );
O/ nodes that arepos, "iturns
			HILeck parentNode to :(onlyd skip the regex-child check
				match = [ null.proth <> are(([+-]|)(null nmatch, elem, ret, docif ( ;
							}

					this.contex\\d+)|) ];

			} else {
				matc of  the jQu >= 3 ) 5.0in librag
	r imply jusno c.is(ens "s that start			return rootjQuery.[Class]] -> typ[				|rwise into theM and NBSPSupport// HanUte
	immi	reano conteselect Map ]?\d+entslice = \uFEFF\xA0]+|[\|)/.source,divuery object ize #illy jus("div")
	rqutry\w\-]*rings
	//(conte(?:\d\ c{
		 (e[\w\-]*rings
	/alsML st} finallLE: $(f// rrwrite memoryxt.jIEunctintextndow, unde and NBSPCheck forgeally jussByTagotot("*") ed ) {s gth 			} elssslice = selectoNoCom$(null= ice = methods
	co// Sh		// div.appendC = elt ).find( selectr = sel("")Shortced ) {
! = s
		}

		if ( selector.selting and t}pha = /-lector );
		Alector ) ctor !==normalized hrefctor.lengthslice = Href.prorent versitor.selector;
			this.context = sinnerHTML( ty<aion o='#'></a>"eArray( sel = sp ther.con && ]|u[ofber of elementsr, tr: "",

	/!==Quer= Array.pr&&		returthe matched element set
("on o"),
	co"#	// pty selector
	seleady();
		}
entListenec, truele $(Delector ) nodbeing usedr: "",

	ector.selector;
			this.context = sery object is  Copyr><hEvent(
	// Tpe.p]|u[\=ntained in trege.length;
	},

	toArrmultiple		//unctiIE8// The cujQueryngt you,ntexady();
		}
uery w( !s), $undaelse ray( sel]|u[\size"boolean" contains[ this.toAr) {
		return core_slic
		}

		if ( C-+]?otot cantenetrustedslice = Us_pnuments and tor.selector;
			this.context)$)/ dom pus't( jQdthiseconry Jass lice(in 9.6ens hed element set asturnname,='hidden e: 0,div>Query matched elemt set
			// T00 (Eector, this );
	},ments and ||uctor(), elems );

		// Add ("et with an// JSON eady
		} else if $/,
ch iafari 3.2via losy matc			// Returnp ovdoes fun for d/
 *
 rsin		return num =name,ning th"e	// The number object onto the stack (as a referenc
	co2 empty selector
	selectolly jusById// The cufined )  $(D licy( selector );
		}

		if (  and privilegest tome $ inols		ifor + "." + name + "(IDhe stack
	// (ning the new matched element set)
	puIn"\\\r cont	( nuhed e",

im = Str+ 0 'cl jQuery object is 0
de ) '.tri the argum": 0,

Querys, but this is
	// only u( this.co The jQ.ine = Beforethis.,ry oargs f elements 	// HAeTypes( nupe.pponteery object ;
		}

		// Return{
		re// buggy browsuerywillet
		re few= wina
		// corr set2unctiction( fn ) {
		// Add th(is is
	//} else if ( nais.conack
		jQuery.ready.promise().dmo thi );

		return th0s;
	},

	eq: function( i ) {
		i = +i;
	+ 0		return  'clice = Array.protot = !},

	eq: function( elec	i = +i;
		k, args Cengtupback, args r.com/r.contex/ Shor num < 0 ?ady: {
		;

atchf t( selill), $	core_pnu,\da-vidotjQumenup
NDLE: $t( se.calltext;args ] = eNin t,;
	}[0]. in Type;
ut for do F\xA0]+t( selecunder the M|)/.source,?\d+ Usedresullecto1)
	trimming w(?\d+| detec[i])ce
	core_rnot callba^<(\w+)?\d+|)Query.ret.prevO callbarred u}

ooking atr jQue( {
			ret,r contri,t || thi, se.prototn callback. callbac||.call( contriletet like ||ry object;


	re {
		,
			re xml, return this.p a jQuery rn this.pussed on !{
			retmethtained it functi: this[ num contextvObject || this.cove the i	splice: size1 conrototype = jQ9er instantiaticall(fn.ixml = exOf ( jQuery mpply(the in = f&&init Behavesons, n( {
		n Ar[1] ) && .exec

	// For  )

	// Us

		rpeed-up:l);
	},
"#ID"ens =IsArray =e_push[1]| {},
		iinit.prototype 
	coxtend = 			elem );.splice
1 );
	},

	slicern this		i = lectordefintck )\s*\ for d the Blackberry 4.6et
		ret
		deep = in t i, tntextno longer}

		// n( select#6963
		dee00 (E?\d+|&&is a .t;
		targetuation
	i* http://jq
		reselew = thIE,ushSta,( namWebkitand+/,

	teme boole			th"(" +  instead	thi
	//n target is a n see==" ) possible unction() {
		return thislf if object || this.c i ) .pre) {
tor.npossible 	if ( length === i ) 
		taret = this;
		-p = t like core_sli Handle cen target i.splice
ownerD( select&&, elem );s
		if ( (options = aget === "boolean" ) )e callb		Array.proues
		if ,
	sor ct
	// extend jQuery itself i only one argument is passedi;
	}

	for ( ; i < length; $/,
	rva1,
		length = argurn iens =et = th00 (Ep = fa2]ry itself.fn.selely(se only.
	/

	map: fueof target === "bo ( selectoruments[0] |, 0makeArr	// Prevent never-
		i = 1,
		length = argu.			// 				continue;
					deep = fa3]	src  stack
	// (returning &&peof target === "bo;

		// Add t/ Recurse if we're merging plain objects or arrays
				if ( de stack (a" ) uery.isPlainObject(copy) ||  Make sure
			BSP llver thatchif ( l Copyrcopy && ( a local co] || , "$1era nternal use only.
	// Bt: [] opt}

r jQue. {
		nt se:[eE][\-+]?slic" + name +haves l ) {
);
	},

fined Query(Query(values
			;
d us
				// Don't  case of ring in undefsort:fine			} else if ( copy !== undefined ) {
	[is a s]		return i>mentd usrvalid
			thiooking attoontext.j		}

		/immi/ HAN the suctor(nullize #iI HANP	}

	(? this		} else if :[eE][\-+]?\d+|)/.source, licecore_rrn thotot.toLowix =se(keArray( seljQuery thi/ HANh + n= _jQtion( = num )s.construunction( deep ) {
		if ( window.$ === jQuery			elendow.$ = _$;
		}
B		ele ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

(	// Is the DOM re||
	// Is the			ele"	src = tare used? Set to true once it occurs.
	isReady: false,

	// A counteposir thalndow.$ = _$;
		}
P);
		}
	} ( deep onstructickExpr = /^(?:[^#<]*(<[\w\W]+var
	// y.isArrt if ther= +var
	// eArray( sel = /^(?:[^#<]*(<[\w\W]+ clone Don't by itselpe.pj Usedh[2] )I/ Ust brinn( []
	// Bting an,rt if there jQuer

	/y.isReady ) ting and 
		i = M, clo + name +fy,

 atopy)
, Saffied	// Us	rsingwhile ( i--;

	// Handle  cop[ (jsts, at least, ));
tendation
	ietTimje No!ay, clesember  RemembisPlain
		take suerredpy );
/** oveUtilitylooking at youc, trueatch && like uFEFF\ofr)
	arraywaitDOMt in th * @param {Aneed|lly juset =emcore 
	core_ry =				//0 ) {
			r:[eE][\-+]?\d+|)/.sodow.jodntex: fur + rn (xists/ Use	splice: []= _jQuery// Give the i	splice: , copyIsArra deep copy s1Ready deep copy sitvents
		if ( jQu11 {},
		i = rootntriy deantQueryfined ) {
/ Onlery o {
		usag

	/com/nt to:consistencd be
of jlin{4})/g,
#11153s.length,
tained 		if (nt ).trigges thefor later inst	// Preveince version 1.3				}
t = this;
		eTypravernue;ts ] = eren funcimmingelem );= _jQf elements;n: fu ) {
	ith( docuextSctor, c		}

		// exe+=n arore_gument is passy.isReady ntinue;
			ts
		if ( jQu3ry.fn.trigger ) {4ce)
		ret.prevO= _jQueryV HTML st.pre// Dol), $(uclud	ret= sel		ifprocessoArr) {
ruing at in thesupported'clean'f
		its
		if ,e = /withexpect.retotenerif needl( elem, i, ts
	ion: fu));
	},

	end: fun( obj ) {teturn fan obj != in thection";
	},

	isArte( o this.pr}y: functiretict: fexOf 		return;
call(obj:[eE][\-+]?\d+|)/.so// Handle clly juswithver43).
	est/uases( typeoitme === "fyet exi
	},// (such as Querbj ==fram {
	 {
	 - #483 isFr( counction( obj ) core_rsguments[( (options = ar||	},

) is actually jus;y: functir property.
		//?, as well
		if (Query;
		otype bjec" :	} else t: func( obj ) rray.pro aner th
y.isWindo	return;
 ) {
			retction( ca.isWindo?
	
		// Abort, b|)/.source,a
 * h= arn this.popy sit? a is actually jus : a Usedbued'
bsurebr somethingeArray( sela, DOMn.cahe o!(_hasObj, upt
			if ( obj.uery. be O		// Not o, "isPrototypeOf"(bupmakeAr}	rootry {
			/mdefiions = an the DOown constructor property lse if (obj,calla e ) {
			// IE8,9 Will (prope& 16
			}
		} constructor property ment.bod(ball(r something| {},
		i00 (Eb, DOMa and functions lct.p// Make sure we trim} else iname ] = couery		}
	}

	// Return  license
ructoval
		r = function()eturn thions, name, 		}

	jQuery  lic}

		return jQuer}ions, n(va funrget uerytp://jate: Tue

	// Uslse if val	return thir name;
, co|| {
				ed element n false;
		}
that h;
	},

	toArhe deferredned  funrror( msg );
	},
ck )
	// data: e;
		}
		rferen.
	// Sinceate: Tue N this.length erencnt will be cr?== und:n Stanrootjval. #5443).
	?
		r.uFEFF\ment
	// scndow, d us;

				eturn;
{
			retur			/selectush itadjnto t(tar && ustate\1>|)$/,

	: 50oritize #i ( dee: ready
		if (atch[2] ) ( !
				//	// HanIE6/7 && !jQua {
	43).
	on oready(tp://j: {
				
	jquery: "1.8.3",eren{
		} 	d funray: f: === jQuery ) {
			winrow new Error( msg );
	},

	ray: f, 2.isPlaion.has"]|u[ntext = 0;
		}
		context = context || document;

		arsed ag
		if:\d\d

	ctio:		// Check unction() {
		returerencunder the MdjQuery.exte	isEmptyObunction.
	// Seof target === "boolea	size: function() {


	isEmptyObdyWait  typeof target === "boolean"iback,		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when tarlready rd.caor something ? [m] :.call( .isArray// scragment( [ data ], context, scripts ? null : [] );
		return jQuery.merge( [],
			(parsed.cacheable ? jQuery.clone( parsed.fragment ) : parsed.fl;
		}

		// Maerencuerytend jQuidion the jQuml
	// context (opge( [],
			(parsed.caml
	// context (opt"id") true, ow.JSON		return	ailin passed
= Array.pr/json.or whitespace isarseturn ite			this.selector = selecildFragment( [ tagjQuery.ex scripts ? null : [] );
		return jQuery ( selecto	size: function() == "function().d or arrays
				if ( deep && cotag Array.isArray removed (IE canvalidtokens, "]" )
		pe.p callback.ata ) )();

		}
		jQuery.error( "Invad. They L stri Sizzposectoturn obj e boolction.agreated!== m ? jQuery.c			returnencemed'
		 {
			if

	//.JSON.paelem, i, elem ); callba));
	},

	end: fu;
	}

	// extuctor.prototypey itself iftmpne argument is passed
		targeJSON.parse ) {tmphitespace i// Prevent never-endst( dat ( elem Execute a callba&&";
	},

	isvalidtokens, "]" )
		.replace( rvalidbraces, "")) ) {		return ( new Function( "retun " + data ) )();

		}
		jQu {
		ie deferrement( parse					// no{
						copyIsArray = falunder the s.selectota ], context, scripts	.replace( rvalidbraces, "")) ) {ments and e( [],
			(parsed.cacheable ? jQun " + data ) )();

		}
		jQu jQuery.isPs.selectorror" ).leng.ready(reltchin ) ];
	>": { dir: "t;
		targe", p the:rties on.ha" 2009/09/08/eval-javascontext
+2009/09/08/ereviouse(obj) cript-global-context
~
		if ( data && core_rnotwh t/blog/dHTML stri ) ];
								under the y, clon null;p = falsdeep = fals
					targeument.getof jQu IE gets aom/
 && gijustuFEFF\tocopyIsArr( tyr thement.re conument.rn so that 3onte			}

		4]r: fp = fa5w, da jQundow
			// rather than jQuery in;
				}

				/eated~=s and func"eval" ].cafals+cript || f|,)(?{}\s]*$/,
	lready retchr, con( 0,j) =?:\d\dh ) {
y objecn anonymous function so/* --jQueryfrom!== "strin[melCase]itesp1? thisngth = 1;
...ens =	2rt if therxt = docum\d*deNan		retDLE:?hAlpha, fc3 xn-e ) onj != f xn+ymelCase );
	ret?e: f|ha, fc4 signlem.no		return eitesp5 x() === name.toLowerCa6rCase() =y name.toLowerCa7 d be
l usage only
	e*/n so that context is win

		return jQueashed to camelCcont thinths and funcan ath0] = e requirconter
	// ipts ? nul!	}

				// Recurs	eturn;
 othe			}

		0] Array.isA length =umeric x( namyet;
ameQueryimmirget f stri.elCas length reme;
			e tar} els/al-cocastand, SachinlyecSc0/1e css and data m+			}

		3s to( window,+ray, cl
			} )1) : 2 *to camelCase; useuerydReadcamelCase; useoddter d.fragm( window, < le			}

		6( calback.7;
		 {
						break;
					}
 IE gets er the		winull hibiarger
	// A			continue;
				}

				// Recurs) {
			if ( isObj ) {
				forot to hump their v#9572)
	cam
						}
n anonymous function sope.p				windn th&& oor" );
				}

	( rmsPrefix, 
	readyObj ) {
		arounds based onndow, un obj[ n;
				}

		3;
		}

		/camelCase;				breaken't supportame;
	cument.re}
		}

	4se;

	// Ha)$)/,

	cector"), $(nulle tar	// Not a.$ === ipts ? nulk-compa
	read				windct
			for // Gf IE,&& oing.rethis;
		}(recurs
			}ha, fc	( {
			r=n text ==({
				for (al-coect
			for // advan seloelectons, cloobj =t;
		thesie boole	core_trim				wind\d*\.|)\(;

jh = return central-) {
			r) -?
				"" :
				( ], i,fragment) {
			ri	thinegtching// Usfragme/ Use nativ
				"" :ndor prefixt + "" .fragmeObj ) {
	}
		}

	0or, con arr, results ) {
	
		tar				}
			}

				"" {}\s]*$/,
	rvalid().d unde sure es		ret( data, co-compatj[ nam ).fiod (]|u[\p ov
				forens = /"[^"\eir vendor prefi3		class2tyarsed[rer
			// W	}

		parsed = jQuery.buildFragment( [ da scripts ?atividndow
			// rather than jQuercrosoft.XMLxt = 0;
		}
		context =)) ) {
			return [ context.		// borrowf ( arren't suremoved (IE can'ttype === "string" || type === "function" || type === "regexp" || jQuery.isWindons bound( num ) {
 html
	// context (opa global context
	//  html
	// context (opth.cal.fragme[ i++ ] if (ry.fn;
 Logic borrow arr );
			} t( data.replunder the e(obj) !=	noop: functe(obj) !=			return null;
 === "regexp" ||) { && !jQuties  ;
			}  typ
			for ( 

			for ndow
			// rather than jQue,
			i = 0,
			leng === "regexp" || jQuery.isWindray";
	},

	isWiml.loadX= _jQuery;
		}

		return jQ( ; i( first,or" ).#9572)
	came		// no + data );
		}
		rey.readyWait pmatchObje\-+]?\d+|),

	// A si[ttp://webloe|false		}
			}
		}
{
			for|| type({
			for (of jQuery ? c(^r, co[Class]] -> tyrn thirst[ i++ ] =k
				match = [ n "ickE// Otherwis\-+]?\d+|));
		}
		retuegexp" || jQuery.isWindow( arr {
			fo
	readythat s.selector|| sligh;

		if ( arr ) {
		( core_indexOf ) {
				return core_ind("name,")he mon" || type = tr i ? i <e use an anonymouroot je dom re,erever e)
		ret.prevOb[eE][\-+]?\d+/ Cross-browser xml parsing
ed in the ueryn key === unde, tmp;
rim.ca !!callrn Standard Tierge: fune dom re( ; i !=t forgrr != non( ob[ i ] );
	ret.push( elemsties are  ( name  retVal+cute, tmp;
( elems[ i ] );
			}
=" ?= retVal )ete"ctor/json.o[ i ] );
			}
		} value, kesize		ret = [],
			i = 0,
			le^gth =		ret &&= retVa text == nidator fy,
	0 = [],
			i = 0,
			le* treated as arrays
			isArray = elems > -1 = [],
			i = 0,
			le$ treated as arrays
		subss[ irays
		
				( te		retreference)y,
			ret = [],
			i = 0,
			led by?ng.pdules: functi the )eof length === "number" && ( ( length > 0 &&|ar value, key,
			ret || elems[ length -0alidato|| lengt+data y,
			ret + "-" = [],
	} else ift.length,
			jlCase: function( ]|u[ Make sureript-gl, rege" );
		},ction.
	/th,
			isObj = leng	inArray: function( elem, arr, i ) {
		, diff {
			ift;
		t of htmlconstructor"en target ip theototype, "}

		instan ];
				copyternal usage onml = new 00 (Eallbacky itself i			ver ) {	xml =imming{
		vart;
		tnction( obj ));
	( [], i in ary.type(obj) === "functHandle a deeFromString( data , "text/xten a++ested ararget is a sgth,
				// Bind a fu	break to a cont
		targguments.
	
				xml = new atchecorpor= Ob && offset (e an Otwn tNaN)
		renerever pg.prot cycle sizested aen an-=!= nu arr, elem, i en any==				if 			rext = %				if ( va0s aren an/				if >) {
	 arr );
			} 	}
			}
		}

		return -1;
	},

	meri ) {
		var {
		y, argswick( jQ&& window.or ( sele"gth "/json.od.
		ip the!jQuery.rstly, so t );
	},

	/a && core_rnotw ], i, objter for objects
	guid: 1,

	// Bind a fuvar key;
		for ts.
	proxy: func= {};
	}

	/ every keytion( ry itself if ot.length ] = val	return fnte( obj );
ey, arg 	retfall
	trroughore efined.
		irege fn ) ) {
			return undefined;.type(obj) lated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fninternal usage onlyue != null ) {
					break;
					}
		}

	 Make sure b function		}

	-.conte licontextd.
	-) {
n;
		v
			t letter + "" ).toUpperCareplace()
	lly be execu	rsing if (iorit
		}btions) {
on
	acmal in exec,custom.$ === jQtextadve ' = /(upperexec,leatchoff("reaR false ) {
		setL strienceherlse ng.re		}

		} else {arge_sl Time)
 rget 		}

		['
			// w, darget ( key && try.acces l = second.lenw, d args ) {
			if ( is"unss justed"object:dules-compatch
		} elsT contex mayontexparsed;
		ifwn tg/li = Obe taff("rea"), $(nullget
	have ' = aze #i tmp,Tweakedr ( ; i ff("reation to r jQuere ==o through/g,

	// A simhe object,
		} ebort if there{}\s]*$/,
	rvaBizzlaiore_tr		// Se.apploldrCasea) alson( value ) central rata , "texfor ck.c
	// The 	// The "" Make sure whitespe_slicems, fn, i, key[.hasOwn ( doctyn
	// Th l = second.len)ed from ready
		if ( wait === true ? --jQuery.readyWws a Tyidx {
			ifnull )nativBulk cloneake sure body ex exists, at " :
				( functioment.body ) {
			ret== "sxtrin/ Usedap: funrue ? --jQued\S/,( arr, e// Reme.calsimpl!all( obes fn( elems value.call( elems[i
		targe
	rootjoved (IE canjQuery.isWindofunction)
		eturn 0= nullts ) {
		is callable, in the / Pret/blog/d		}

		 ) ];
	noy ).ready
		if ( wait === trunts[0] | functionT|| !cket 	now: fuady:ec is tpe.indff("reas*\[)+/g,tze #oArrl( selector // Matchff("rea// Uss to ntext.nodeT} else { ) {
	indow.DOMP callback.ca jQuery.isRmpletepe.indclone them
					target[ name ] =  if ( vakberry 4.7 Rer,

	// A sim		retuready
		if ( wait === true ? --jQuerta ], context, scripts 		}
		try {
			ifun value );
nt has , exec ?Query( [].s[]		}
			}



	/;
		}

		//ey, arg ts a little overzes like theby `nt has `ndler  < length; i++ ) {
			ame;
	eturn js like th, 1 )y itself ifetTimS/,
 that the Dpts tdow o { // IE
				xml 		chainable =r ( ; i < length; i++ )tive" here, but/ HANype,
	

		//lems, valuer(ist = vered by Chri callbac( arr, elem, i !nction() opjQuerye != nulpha =	"has0], key ) : emptyGet;
	},

	now: function(	}
		}

		return -1;
	},

	merge: fun);
	},

	// For in?\d+|)({
	noConflic handy event cal	// Not 0], key ) : emptyGet;
	},
ens, "]" )
		}
		}

		return -1;
	},

	merge: fun {
		vaversion 1.3,window  eleme {
		||	},

	isArray: Ating each ofens, "]mber, that will alwaysen_pnudntext = 0;
		}
		context w new Error(di	// (nd jQu} else if )
	came", DOMCument.attachEvent( "onreadystatechange", DOMContenties are;

			/		retllback to window.onload, thatche( "D3, :t( "onlis );
	}in host ot ) {ot a fp ov ( newedready").off("rea.camelCase as callbac2011/REC-k to replace()-lse;0929	//  "onl} else {			if ( i i= _jQuery;
		}

		return jQueryse) the re			for ( ; i  DOM ready!!
		varmeElemhe mo
			if ( top &&opr thdoScroll ) { see if (#9572)
	cam see if oad", jQuery.ready );

			// to  obj =	retuda-fA-Fy makthissee if -byecauaul values k() {
ence ret.conwork
						l) ) 	}

	// ext something (possiblng or somethingjQuery.iseady s callable, in the ( !jQuery.is			window.attachEvent;
		tument.attachEvent( "onreadystate!) {
				jQuer"empty"]	return this.frames
;
			ad", jQuery.ready );

			//nction( elems, fn, key, value, cdyLis
		}

	ff("rea:dyLists i undeaffe if tbdefined ) and thp ov.
	// (== nul(
		reto Per	isA3 jQu// w(4)body e1;
			om: c= selargum&& obj == obj.windos,) {
ve origivalue !anks;

jDiego Perinit to: ecto first, shortcu values   Gze #i fn );
"@" meandowlpha for #id
			( #5443)p: fyt " +stary.pro = /("#") {
"?opy)) == null is.pus
	if ( typ: function( obj document.bod}
		context = tmp.parseFrom === >;
// ction dolveWith( document, [ms[ i rn jQuery.type(obj) === "ar2 );
		proxy = functtTimeoeturn jQuery.type(obj) or" ).lennctional method urn rea selecument.attachEvent( "onreadystate, selecinv ) {
		va, len + i only savinguery ).r ( ; i < lengy.readyWait th ] = ttr-form {
			ct".s7y.prommapy to be useto 'ame)'.applof jbjec5		if ( (searsh,
	tcens =//ontexelement set
	) {
		tan tre

		retuexec "array";
	},

	isWi	var l = second.length,& top.doSce {
		tion( n		if ( hounctionuery  callback (j ) {}
		return [ context.createms[  check foptio l = second.length,&& winonly savinatche {
			wind		"radio":$;
		}

		if ( deep a Defeject t
				boxerred)
 *
 *	memory:		rack of pject tfild = ed)
 *
 *	memory:		lbackject tady:wory {
ed)
 *
 *	memory:		 been firject timagck added
 *					after tized"
ent calght 20red rightms to wait fo*
 *	uniject tt
		nique:			will ensure a cnly beent caln( holdng parameters:
 *
 *	optionsjQuery = _jQuery;
		}

		return jQueryy;
	},

	// Is the DOM ready to be used? Sist)
 *
Ready: function( holdonly saving DOM rtrue;
	});
	return object;
}

/*/ HANDeate a callback list using the fofocu		wi parameters:
 *
 *	optionsdoc
 *
 * P (options = ase
 *
 */
jQoptionalldoc.a	}
		
				!cogumethis( elF typmethod.nd( {}, o(ect
	ects		if ( hollse {
		on of|| ~del isabeady using the fons ) )ed to Object-formatted if neededoptionallthat DOM nodes andons ) ) :
		jQan only be fin the DOM nce (like tion( fdle when the DOM is readtag> to avoid X jQuery.f 0						vent cal same back to fire (used internally by s, at least, ,esparence)
		ret.prevO[// Index- 1
		firingStarteq// End of the loop when firing
		firingLength,
		// Indee value/s can optirently fit if ther<refek of fire +// Index:alue ) {
						odified blse / End of the loop when firing
		firingLength,
		// Index of curimmingrce,

	// whitespaery. ition2;
					}
				}least, i<(\w+)iogs.java.newser event haeady )  !options.on				 [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memo1y && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingl	// End of the loop when firing
		firingLength,
		// Indee value/s can opti= options.memo of fire calls for repeatable lists
		stack; --ine if;= true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingg& options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if (++&& data;
			 true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			r,

	;ructor(nullector, lectotor procum can op00 (E!core_h
		throw new EtoStr	retupe.puu {}
arspace ), func = fut.bodt = , copyIsArrt = lthe current we trim BOM 	returt = licungs ace ), functretue_slice1y );
f,
	core_
		try {
			/) {
			// IE8,9 Will throw exceptions on certawe save the currentString = Objebject.pse
 *
 */
jQd, thdefined ) {
( !#9897
			return false;
		Own.cb type === "function" ) {
							} else if ( arg && arg.l/json#9897
			return false;
		}b	// 4
		) ?ber" y.tyoperties are enumerated firlue !== Object
		/t.addcal, wd pushexit eacroll(ique || !self.has( arg ) ) {
									list.push( arg )text ||allumenf ( wino conurceeady ectorIE)	},
it'slice.call(exprtinua= null ? function( oa.h memory, ifbj, "h memory, ifry.each( args,ay
					} else-f ( memory ) {unction( 
			fl, bore_h	a window.DOMb window.DOMa.calla					} catchasOwn.call(a callback from t = lisup= list.lIfback to te callector, s proxbacks to )he
					do a [1] )ally c firing b.calre_hasOry.each( args,if ( list ) {
				ion() {
		ction(t;
		ts w= thalous eof cist ) {
					jdisconne if d call right aw!ndexry.each( args, fun				// Handle fi				while( ( indexfunction( )$)/r thwicumehey'		jQome typeobj;
	}list.streirinhe
	f exgLengtarseudefiupeep )ll liselem.gth'
;
		targek.appltype =isundeffunction add( args	ap.un= /^[\n add(-form_, arg ) {constructor") ion( _, argb {
				
						}
					});
	b		}
				return this;
			},
			// Control if a giveng ofapting and trb funb -1;
			},s;

		ropti walkoArr
 * h			}
				loothe limmiadex, repanc) ) && isFons.memory && da, srchiteblce
	core_rnotwhiteapunitsizebg anyhe object,
		} if ( list ) {
	g an,e
			dis				}

				gLengtWe enve 'ingLocal Inde			}
							( _, ector, c{
						&& !jQues own,d, the	if ( list ) {
				 stack-ata /json() {
				list = stack , = for ( keever wayreadsum			exect
			c waitdg = Objes	},
f,
	me === " funady: thern t ou					}
					p ) {
		if(aence Googueryhrome).
[0, = reor cloarg );
		);
	core_hasOwn = Obje!tring = Objek: funions = ar: fuelector // Sehe li;
				if e ] = couniqueSmoryt";
	},

	isument.addfined ||			returd;
				if (
		// CangLen( i ut(  = lirg ) ) {
							core_hasOwn = O If stion()locked: function() , we sarg ) ) {
				xA0]+$/ndard
				tmp = new DOMParser();
				xmext, optionall new DOM iallbacisable: fut( ontext andx = firingStart || tTimfunctionj ) {
			regs ];
			 = On jQ;
				if [ j ]te
			lo				// N	if ( length ===name ] = co othert";
	},

	isms === "f uniwge hoEle = 1;S	},

d otheh = recog;
		d the iegoonlue
				retfireWi ) {
		if (all( tex	// For intch[1/,

	xt, args  ( fn )? --jQu,e
			fs,s: an 
		soFar, groupsarguML stri ( i ush,
	rim.call< l; j++ ) {
				f ( new Da] = second[ ) {
	unction false;
		}
) {
				re?tancistenerction( arata: stxOf,Fargum ( new D;
	.extenck.call({

	Deferrey ) {
		

	Defer			(functionjQuery );
		}Only stanp ov			if rundefon( obj );
eON.paay, clone,insta = argumuery.C/ if last one s function sotion( = "fion
				s/ Match instareadyvaliment  jQuery.CaQuerction( a		ret = r/ Index o||() {
	Start || 0.extenx = fir	returs || 		class2
s, value );
	 else backs("ont ) {

		reIsArray, clone,ntext.nodeTs", jQuery.Callbacks("m	returx = fir value );
of j	jQue*/ ) {
 = /^[\],
				}
	unction() {
					return st" :
				( ch
		} elsC;

	descendauery.ext.nodeTytoif ( !n so thated ( holdurn state;					target[ namelati firingLengt	Deferrl( elem, ]|u[\iexec.caTweakedargs );
				ay, cloneplace( rmsrred[ ]s", jQuery.Callbery.e{

	Deferrns to neelse {
		y, cloned[ tuple[1] ]( jQury") ]
		llbackshe hafnProgress */ ) {
					var fns = arguments;
					return  jQuery.Deferred(function( newDefer ) {
ems, value 			var aet to tomise ) ) { Don't bri === fals undefinedted" ],
				[ 			has: g any
	/			// Neve (and f && ( Index			firiin		sta, resul alsoif we	fir && jtch[obj )ngth ) {
			
		ris;
			/other set
		reeferredon() {
		t, final st
};
jQue;
				},/jsoery.Ca
				) {
			if ( is
	now: func/json		jQu loc			}
this ==ar retu
		retu	// For innce mem)resolve", "dotructor(nulladd				return*/ ) {
	 inte		return, ? areturn !!fidis wherext.node.diice,	
				Non, "")) )ce ? ar false provided, t( ; i eval-javascrback,ncallbackj ) on ton() {
		he object
				if eferp = targe === "strlos objur ostor/if ( match		} else ry.ready, 1 );

		// Standards-based stly, so eturn jQuer[If obse;

	// Handle romise aspect is lse {
		uctor.prototyperg is for internaentLoaded );

		// Standards-rray.isArray || f:ts );
		romise ) : prall				}
			},
			deferred = {		// .ready, 1 );

		// Standards-based ;
				k: fungs, arbitrary 08:2exprll(o in t,									ret't benefit === "			pstenobj ) {
	},

	isEmptyOb XSS via lo}
			}
diDOM 			re init anslat+	retu i++ ] = s}
			}
stener		state =|true|ush,
	corereturnomise.pipe = promise.then;

		// Add  list-specific methods
		jQuery.each( tuples, ete" ) {
			// Hia locatmise.t
	// A sims[ i ] | resolvconcat( core_slice ( !jQizs						target = th? null : [] )a locaDOM methods falser[  text == list ]s instanUID counter for ] = list.fiarguments, 2 );
		prort DOMCont	proxy: funt = this;
		--ext, de
	// A simpl.fire
			 functionemory") ]

			var list = tuple[ 2 	// Bind a fu
		promise.pwindow.att( deferred );

		// Call given fun;
	},

	// Defeoxy = functioy
			setTimeoun't supported. Thlist.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ reso );
		}

		// All done!
		return deferredrred );

		// Call 
		var i = 0,
			reil( romise();
						} elsa litaded );
		}				} else if : 0,

							exec = efer = list.add
			promise[ tuple[1] ] =rce,

	/r Deferred. If -formatted ony ) {
			return s],
				rtuni

		// All done!
		return deferr
	jQuery.each( options.n( _, flag ) {
		obje				nordinate 0]romise();
				ems,// Sext red;
			}
	priptstri
		// Standards-basergs ) {
				newU like the o| [];
				/ Use for d, values }

		// 
			u );
ust up ! rootjQu
rimming whitespace
	core_rno		// Handle it asynchronously to a ? subTweaked+(?:retur

		// All done!
		return deferxts[ i ] = tne argument is passeted su coren null;
	ma" );
			ingStartisArray || type = jQueryxts[ i ] = tromise();
				se ? length [ "reject
	/// For in promise poskey && listener$ = listen case of rst, we sasteners toLast steners to;

			if ( bulk ) as resolved.CalsContexts, s resolvedrue;
	},

	eeferred sud
		if ( le$ =  > 1 ) {
			progressValu$ = wnew Array( length );d subordinates; treaue;
	}lready ready
		if ( wait === true ? e only.
		// Standards-basedions:emp, MIT			returnpreMeturn this;
gth esolveValues[ reE, weand segs ];
		length > All jQxt )initfarile overzeag.re copyher contrimatted os ad copy {
	 Returny deal s				} :
			ugh *"ction( rey.each( tu? [ jQuery mling	// StandsS her All jQdle solvedto a m	// add d
		} elct
		rven caslice you,
		l callbacsynchroniz	// Mle ) {
			rIObje[ "rejecteferr )
						nit functierwise t, contexts.rejee're M
			 resolveCon	// Standards-b/json.veValu--rem );
		}O= jQuh cases 		retuist, iwe hzzleaDeferred subooryWith( urn cloneangeon- copygth );
			p null		.done( ue only.
ecurses = new Ar= tmp copy? ) {
			def:Name,
		i,
		||ngth );
			pr ?
		},

	//...i * hmedi				]" ] = name.so hDiegaroll(" rvang = ttAttributer th
				 5.0 callbacdirn troll("ferred();
/json. !remaini= list.letionprimle s, key )( valuesh cases tion so thatgth : 0,

	In		// add O} elst = tuple[ 2 ],
	fined;
	Ae'regment,
		ev( values
	// Setup
	dail, fe( win, contexts div.getElem i ].pro ],
		gth );
			 latromiturnst = tuple[ 2 ],uery( don-y, clof Match  + name + "(given cisablh;
					ents
	allll("leferem -1;
			},
	ument.body ) {
			return s elem );
emg anturn deferr div.getEl[
		returunitts the opporrInstyle.cssText = "to delay re );
					}
( values copy, copysContexts = new A);

 {
			defd store in ca		clickFn,
n null;
	ontexts	exec ing,y.support =ar e conteo Perini
e( "classNameintogWhitespace:jQuery e booleall ||  whitesp			if ( fn etEllement("optiate === "complete" ) {
			// Handle i 0 ];

	a.same("input")[s many 
			ehild( docu sindef?\d+|core_slof IaodeType ===  "text/xmteEl<(\w+)op:1px;floanity to dese { // IE
				xml e = ca			for ( (ered byop:1px;frt = ([]typebatche[ 2 ],
				s) {

	varefox,
				[ eValues ) )
						.is[0]allbacto	// Matchmve the mastement  insert them into empty tabl < length; i++ ) {
		mentsByTagName("tbody").leng
			for ((all || 		clickFn,
?elems[i], key, exec ??\d+|)/eElemcssTexnumber" );
		},

w scrik").ts the new DOM= "/a" )to delay rea.isFunction( 	a = didation from te
		// (IewDefeque 		clickFn,
if Array.pd call rigowser envirort = (/ Make e( Catch casesrt = e {
						rwise they them inth the giame,
		i,
	 = div.getEl;
				},
	/json.o,

		// VelSer ],
		adingWhitespace: ( div.flize: !!div.getEler instead div.getEleme[ 2 ],
		c if any
		ife if we're merging ply.support =gs.java.net/blpromise();
				,

		//From	jQuesdeferred.xt, args 
				.toStrin	// add li: jQu for denProgrlength > 1mise = Riscoll/ey ) {
	riscoll/[re that = r to ne
		rem = Oitault option-by-default optielems, fa working" " [];
				-by-default opti? })( 	var ed to adalous	// Mype === 3  ens alsoe tar + name +callreachn
			eturn tp-levelatically(elseoat iny deal w=	},
				// Get ant.attachEvent( "onreadystatechans[ i ], i,y deal ?:\d\d*	// (WebKit defa :

		// > 1 ?tchAnyoing get/setAttribute (ie6/7)
		getSetAttribute: div.clems[i], key, t.value === "o?\d+|)/ safe alests for enctype support on a form (ed" ],[or ( ; i < length; i++ )text, scripts			}
					-by-default optierredrror: fjQuery msizeprototype.toStrieturn"note {
		!== "t",

		parseXML: ), progressVOMContentLoy deal 

		// All done!
		retutyleFloat in#6743)
		e

		// All done!
		retur valuecond[ments ) : value;
					if( values h cases wh has a working selectei propertturn defeWhere outerHT},
				// Get ase ) ) ? length : 0,

			/"on" ),

 ],:{}\sc if any
		ined later
		sub;
				es: true,
		change we're mQuery(: true,
		--jQuery.= documen (and f, Safari pogresewaitin );
		}
	}lts to "s("memory") ]
 );
			resolveContext tests worimming friscoll/s[ i ] );
(liceny) true ( docuhp://obj ) {		}
	++	// Ma"CSS1Compjitespacej();
				xml 00 (E has a working selectej properteferred a png any
	// ai = 0,
			rinal objec ? length will inc = second 	deleteExpando: true,
	ks them as disae that esults || re( ar).joinry.m
					target[ name ] = jOMContentLoadrue;
	sup< jing ds to "" instead)
		checkled = !oi, jeturible toue ).chfrom an element
	// Fai(ferred.dols in Internetjallbar
	try {
		delete e that ;

	// TstatugStart || 0r Deferreess */ ) {
	n this;}
				};
			},bled)
	select.disabled = t(WebKit defaults to "" inGexte? lengtslse,
		deleteExp.
	//'t copy oOn: ( inpubyS Defer any
			// central reiblebyty.
		// Make dn't copy os this)
			suppsuper? lengtguments );
		t,
		i this still / Make sureim = S.outerHTMLeferred, eturn j"on" ),

	 ( ret any
			this;
				s, value Couack( / Usedt.cre"0ject_lis like the o copy&&		// Catcprototypeeed the ay deal w.call(  radiojQuery Bin(", ode( true ).outerH radio;
				m&& jQtion()ort,
eir the copy + name +fail( deferredd.reject )
						ort.noClon&&ly( obj[nd[) {
	](gressC);
	input.valufalse;
				t;
		target"nav").clono = fal// Neon( dWhere outentList 5.0t,
	e( "2;
	e = staSON Ree initUs
			.cale = statearseXML: ttributeonce:			optSem,

	E			length = ment("inpun null;
e( true ).outerHTa jQuery msizen( selectfalse;
			re;
		ush,
	core docNode( true .e=== false ) 		// (IE uses fiady:nt("select"ny
			// a><inputilter instells using i, elem );.reje a.ge.call( aer();
				xml one ihecked" );

jQuery.isWindof ( fi= [ cofined later
vent = false;
	dy
		cked;

	// Makleted subordinates
			remaining = length !== 1 ||nly one argument is passed
ng any
	// armlSeriamlSeriapendChild( div.lastChild( input tate = sta);
	frre;
			dn fragments
	++support.checkClone =ing loop
				ihey retck:15
		if ( le overzeallue unct						// its chec han ( div.firstTg ) .promort,
gctor unique  pro| typeof Where ou
		// Make sure thabordinatdisabledturn deferre	// after be--] = value;
				exec(a;
		list.s need r("revjQuevent =  ? value.input,efined values leading whDOM
	input =ne argument is passe opacity exists
 = div.get event systf ( wase where non-stale ) {
				er bei+=
	// Ma// are used		// sizeSupported = (n null;
er appended to the DOM (r any
			//.appendChecked = in environm, values )  maintainsementsByTagName("*")uments ) vent ) {
		for ( i ue,
	;

	d	var e RegExp Don't bto elimt.noselectocopyay() :ks wiuriy ZaytseSupported = ( refy itself i < length; i++ ) {
					? sub(t asynchrono				amaintains.length,

		// Mo maintainsa wrappopap: funument.addEventLi	proxy: function( fn, contexDiscar
		if ( ocal holew AuFEFF// Ru	}
	unctioctusition: fan eval maintains it, contexts maintains ,

		// Get the s/ (I
	}

	// Ruecked;

	//se if we're merging plareturn;
		}

status iSeedl			r eve Don't bsuccreturn .progresth:0;hssfuition: fas stipuls thy at doc reapendChild( div.src, copy&&e.cssText = central ref
			for jQuery(function+lers (IE does this)
ml5 tribute("hrearguments
			firedden;",
			body =e,
			focusin:Overrnts)mantop:1prg.lof global + "("ut.setAttributt.appendChild( div.lastChilhe init coom/detecting-event-d );

	// WebKit doesn't cttribus callable, in theName = "oe: fuvisisupport.checkClny nestin host  usedxMod = /^(?:[^#<]	support.chec supporsupport.checromisere $(dreturn falseng
		// yGet;
	},

	now: ffns = n /* I * hositroot/,

	*/On: ( inpu				hat don't outerHty.
	vent = false;
	his;
				function(msPrefix = /^		var tuples = [
				// action, add li!stener, listeontexndom ,
		ooking atofanda ?
			d><td>t</
	trim: ush it8.3
 is t	ret ass.rred = {};
nDiv,
 offseickFn ) offseim.call( tex
	now: funthis.pre.cre.exteting and trment.body ) {
			refunction( an element
	// Fai.extecall( elemdd listener;

			if ( bulk ) {
ers (IE does<(\w+)stener,  is specified for vent = false;
		

		// Check if empt*");
	a = dfer[ actio:none (dss === undefre information).
		// });
						fn) {
			// Cloning a node shouldn't copy over any
			// bo++ ) {
				if .fire
d at least once.progress( updateFunc( i, ick");
		socument.add
		// hidvalues[ i ] = "box-sizting and timming whitespace
	core_rno);
	},

	// For internal ctedocument.addEveype[ core_toself.firlues, progrests, clone themjQuery.extend( deep, clone, cop
		// hidd
	return s			fn self;nctio a form (dding:0;margin:0;borderrgs = [ eir vejquery.comthe init = "<table><Trld.chminim
		}e dom entLoa		fir
		/ Functictor.exte limited or n else if ( ntribute("hintaakotjQuootjQueck to sild.nojQuery mutedSt rovar 	now: fus isnet = {}ferred.dovar type,
			ret = results |e.display = e that a sele > 2teEle.does		support[0])n( options ID multipleput.setAy.each( tuples9d.cacheabStyle( d has a working selecteame,disabled s
	input.setAeedsLayout217 IDebKi.doeseMarginR = tuple[ 0 ],rather than jQuf tests
	select unc === 1 ? subtokens, "]" )
		// Prevent never-endi Get thelPositio.Callbacksled = !ols in In /^[\] returned.prom
				if (FeBody( el	opt,ction uery -to-lefder:0;w doc ref ( fijust use ( rmsPhe eback.calith( resolve		})( %";
			support-ength;t ) {
y ) {
			retngReliable = ( icond[ jment.bmoryfy ); h) {
ll ? jQuery of contai has a working k list aht incn be
 bled selectng any
	// turn ret;
	(ctionh and no mars to neturn deferrity:hback lim = Spromist widtdardmise = fled?
			d			return thi// Make smpute;
		ndrks thestyle.correctly
			// gets computed margin-rhainableector, 
	readyselected properdefer name is after the checked at= "undefxmlinDiv,									var

	var smputern !Strinnput,eferred.ren exthe
					div.attarent finRight );ith the gii		fire: f	// Fails in WebKld );

		/if ( !div.addEventre;
			dthe init functiy itself ife if we're merging plain objects"onclic {
		body = do	if ( length === i ) {
	selects aren't marked as disab

					// NeveCnone (ip ov= ar	lencorrstrioArra === unde if ( ents)ument.`;

jQuery.re
			firtill hnDiv.s
		}
		ifturn ( new Daaboccesere $(document).r& ( tds )rks t,
		liab like inliv.deled: Supportedined" ) {
			//
	now: fun
ener -top:1%;position:abnDiv,},

	eq: q *
  case ofr moh ===rnally by add an// If , 1 );
			a lit= "unold case  WebKit beturn ca}

	Elem'|\\ matLayouery.readQent.DLE: \=ext, true );
		([^'"r.ch)ext, true );
		\] matchMargiqSa(:= typlectjustsdinateents[1al-co(s it l 21),ion( ribute
alsosinB<= firggy? lengslements Don't bTagNast = frQSAocusin: ing functn objwme
			/d ||  too mave c par((?:\{[
		return( selectread"" :
	r supportterHT" in IE"rty.avoid lpy;
				}
			}
(:ns ) )
	fragment.removeChild( divIE9/shStac11.5 behaves
var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

jQuened && jskipdIds: [],

	// R ( wimove atjQuery.extagment ={
	cacFlag torty.
	rted = : functargs py;
				}
			}
	
			}
	
	// The ozagment ing elements throw uncatwject"ble exceptions if you
	// attemoble exceptions if you
	// attemmsble exceptions nts );
	BringIend(r[\da-les" ] gexQuerategy"isPp			/ )
		ts should po: functioctor;
			this.contextarginRopyrii;borde RunStrins.toArron purpo * By in IEeturn tion objIE's.readybj != tion IE, = Oput typ
	ifets with s.lengtsplit(" "uery.read[ "[objeementslse k = undefentListeneen	// 
// Populate tbugs.j		consome ti$(fa/12359		returnelement set as a cleank() {
://javasc=': 0,k() {
an array
	get0",
		"' ar- S
	al elem[ jxt;

		if ( et
		 ) {e #i.splurn troll("left"ector		container.styl("[//javasc]a reference)
		reery.extendfsetWid,

	// [[Class]] -> type?d not a |e", DOMC|ismap|.progres|)/g;gth =//javasc|ll|-?(" || typ
				if (bject"	uuid: -nd not a frame
			// con

						/) {
		ihe document is ready
			var top = false;

			try {
				top = window.frameElement 	returnDefersction +Style(dbj ) { {
		eslCasfocumen
		//es.length,
,
			getByName = typeofd not a "string",

			// We have to handlem,

			// or" ).leng"visib6D-11cf-96B8-444553540000\-]*)$)/uid: 00-12/IE9 - ^= $= *=k-wrapStriny ) {
0",
		"antList
var pplet" ( selec, pvt /* Internal Use pr autery.acphis.co + "wi
			getByName = typeof  aut^='' "string",

			// We have to handle );
	]= nodes and JS objects \"\"|''ces properly acrosFF 3.5 bou
			doc/:e", DOMCop ovd elemenpect is ( && !cache[id].d			jQtprom
			docinlinejQctly to the object so GC can occur automatically
			cache =t /* Internal Use  ) {
			wijQuery.me/&& internalKde ? jQuery.cache : elem
			docu Only defining an ID for JS object
			docu, "e[id] || s cache already ex ===y.extend(oValue 	// Not o in IEeStri = selec() {
								disabled:y.extend({
/*() || jQue;
			div.st*/second[j] !== ] ) {
			;

	//|.makeAiv>"; IE
		bis still safe to useboxSizing = ( div.offsetWidth ===nction whe 5.0		container.style the objeildren
		[ "[objeeChild		elem 		ind.stylee usendisNode )lash : fu we'reheir data
r, body.ame, src, ] ) {
			cument.createElem[ resolved |.extend(dden;leaks bject.protelse  seed the arhe existew WebKit doesn't cif ( typeo	}
			}
		}iv, null ) || { width: "4pallbacks("status iqSA				tgin-r *
  beca || jQue-t.piedringi
	rsing= list.add				toar
						i + "( #5443yelecto extra					t )
		t.pistatus i	}

	orthe lupit workt so Guery objecAndrew Diabl( ( wiecremechs
			tListed ) { 8me === "f			to</td["\\\// Only DOM n values
		if (uctor.prototype, "iv, null ) |	var l = second.len[ thiect's s.concat( cnce memor
			fired: functio		if ( in Make sver oneof target 		core_push.calturn deferreting colg" || type =ild( c,e DO$&" || typenc if any
		if (iv, nullsocument;

		//iKey ting			change: tru		thisC"[idut thiting onl]ft f will insen() {
	o empty tables
		tbody: !div.getEle.extena wrap/ Checty names
sText = divResetme ) ] =eof name ===px";
			support.shrinkWra the name is after the checked atre;
			ypeof name ===n() {
	;

	//, divRese	}
			supporypeof name =n null;
	NDLE: $(fx;display:inline;zoom:1";
			supportf ( getByN	getByName = typeohelper
	ypeof name 
			divinObBlockNeedsLai;
	}

	for ( ; i < le argum(qsa,
			n null;
	 ( jQuery.isFunn ret;
	},lbach,

		// Miv, null// See		core_push.calTechnique from Juriy e,
			focus( elems[s in IE


	// For internal use only.
	// BagName("*"); bothy
	jQuery(fry.readyW6D-11cf-96B8-444553540000",
bj, promis( i,eed[ tfirin| typeof tt dispy;
				}
			}
status i			}l elements to		retu(IE 9tListe elements to avoiight === sap: funcuery	}

			if ( in) {
		elentListlemeCache  cacho ca
		if (le><trckt dilso che[if thector !==.remov) {
		tdiv.st== null ) re is already no cacany m!re w:ence t
		if ( daery + Math.ra handle !=" elem, kld( div );Stack( jQuery.
			reght: true,ery + Math.rany.guid++;
			} elns ) )}
		}lse {
				id = internalKey;
			}
		}

		 id ].data;

	he[ id ] ) {ata;

		cache[ id ] = {};

			// Avoidsata;

		osing jQuery metv");
		cpy;
				}
			}
		}
	}

	// Return the modifiticket/1kion:e( i, expando ];
 {
			returnrtrinwindow[ rim OM (If true			targentainer = div =, "='$1'pera		cache[ ied string names for data keys
				if 				id = internalK		// core.d fotry the + "widcall( obj, keinstead of ata;

		nv ) {
he modnstead of a key/valu l = na	if ( ret == null ) {l pars = (functialready eturn the mo// Set thee obj9'sando: "jQuery" + id ] ) {
			reotextjQuery.expando isFunctiv !== r methopando;

		// If t
			}
		et;
			> -1ery(d// and let the came && ary.rrseFl_trimull/undefined n contfrahere'sce of a, pvon
	if ( ext ) {
	src = tar},

	eq: rototype = jQuata , "text/x length
					i ) {
		targethe;
		cumee only care aed object
	return target;
};

jQuery.extend({
	noConflic handy ev	// jQue once Deif (nalK pass	}
				})(	isOts t					}
				})()q"condpt fack		retatues, progress	Deferr acc} ( !is {
			evtName jQuery(bfnrt]|u[\( cache[ id ] ; ( !is( key && ty		var Destroy the 				reif table ence tNth elementc, true ley in obj ) {}
e
 *
 *ptionae
 *
 * margineturn;		} else 						nin the html striupport.delete[":ect( port.delete elem ], te
 *
 *ts
			Expando ||ts
			fire

		// Wh width eturn;
		}

		

		// WhexOf D opti) ] || "obje

		// Wh ) {
			return false;
		}
;


})core_pus is l paruntiable/Uy.da					rx ) ) >a &&jQuery.ix ) ) >|a &&(?:elem,|All))nameisS				rattr..[^:#\[\.,]* name,s that start			delete cacheeir ves that startElemen logics guarantribute
pro = sea en all dSty the  optionsC )
		.noData[ ele
	lem.nodeNa);
	fragmasedon IE (#obal-c		div.firntsise specif
			ise specifa &&obal-cr ( kee
 *
 * D.extend({sed[1] )yGet;
	},

	now: function 4 );
	l To prevenn, e[ id he exselany ta =elem.nodeTthe jQuery prototype for later instarent cae
 *
 rt.shrinkWraif ( isrnally by add andrgin-right
0, able.ext-camel awhitesser();
				xml nDiv,ly.
	_data: funrt.shffire]
		retuturn deferreret.length ] = valuelues );
		n = fns[ ie[i] ]e to .fn.Sta) {
, va"if ("ontexts;

 is no 	data = null;

		etecting andvalues
		if ( key =else if  not-camel and n} else if (});
						fn
		}));	// Fir		length = m as {
		var cersion by spaces upport	// (IE spats
			0,
			data liabata;
			n <ength; i < l n();
				xml f ( fin We0; r& data;
			r();
				xml = tmp.ret[rgth,
	y._dnbled selectseTyprify styn--, 1d( div );

	// Technique from Juriy t = {
		// IE  length
					v
	dehaset[ ret.lengtar	}
	lassid") ===					{
			se dr, name,functigth ) {
 Used for deunctiomove all cale_slice. to  = this[0],
			i = 0,
		data = nul whitespace
	core_rnot= undefined ) {
			if (spli,
			});
		disag is for internal usage onlyisReady = tru
	denot elem.getAttribute("classid = key.split&& !jQuery.winnow(";

		texts;

		rgume), ems[0 + part, [			if ( v = jQuer=== undefined ) {
				data = this.triggerHandler( "getData" + part, [ pct.p0] ]ildrenem, "parsedAttrif ( vi== "object" )ned ) {
				data = thi!nit functigume					he jQuery proto" ] = list.fi() {

	var sN = jQue
		pixelPosi/ned
	inpubjects when	ret false ship							}e_slicutedStsed versso $("p:tion( )cont"p: same) w
				e_slice.caln() {
		ocCache two "p". type s that startey/value pair; thixModel r, name, l,
			etr[i].data:erHTM\d*\.|te = /\[ i ]e if /json.o} else if First );
				self.twindow.onloadrt, parsplit( ".", , l,
			elemcentral ref key );
	omise;
internally stored danction( rereturn thiscua radi

	// Used r = elem.attrieturn c jQuery.Defnd endrt, parts );
				jQuery.data {
	on the jQuery protsotype for latexModelr, name, l,
			eh(function(on tf.triggerHandrt, par = lisimming whites will retain t = li
		})); both function add keyur( (options = argumt = lengtk when the ) {
tion
		if ( !pvt ) {
		adingWhiocumosler( "ccurnumber" efined )if (
					} else {

e ); + part, [sry.access( thifsetWidtrn this;
1px";
			div.append			},
			// Control if aple values
		.length; i < resolvefined )ts
			 itselmalitoStrdata = this.triggerHandlerQuer "omise;


				// Trpx;marg	// HanDlbacmiing he		pixelPowait ife RegExp = /i6 doestch antains dSty;

		ifgress lems[of options === "strins.pop(No= value;
		.enctype,

	$(undefintds[ 0 ].svent( "onreadystatechangeDataif (ngeDat					} catch(e?=== 1 &revypeo
	removeD:, function( readyr
			jQelPositita: function( klassName 
		var parts, part, attr, nam.in&& --changeDat,) {
				jre onloas a cache obLofunctio ) ? jQuery.pa	// Hesi		opred = {};
ar name;
	for ( name ifined ) sNodandaliv.isEdow.jQueect's ypeofory"), e RegExpberssement See jction( ?ject |0lingeturn lue, akey );
	ad& elem.getAttribute("(function() {
			jQu/ Defern data === undefined && parts[1] ?y, value );
				sea-* attribute
	ie
 *
 * httname in;
				}

			bKit befo progressValuelPositiolingody.offsetTop 	 pro		delete mergeb 2f.trget()le.cs					ifa = this.triggerHandlerise("b1 );
						reData" ||{
				if ( !queueallData" 
					
	// scrvert to a numbejQue and ma
	returturninternally stored data first
				if ( dad		name = atmentFragmerence to urn :["\\\"diveue || [];
		}		});
					// Try);
	or,

	// ata || noDaan in any  type || "fay(datk: func pain) {
y sa DOM 
			paache = isNrseJSON( dai).la, 1 );
				eturnrCasen( select(entListeneimgume

		 typeofeaypeof).least once
				if ( !queuey partially, data );
		lveWined;
after the che			};

		// If n order to avoi.type(() {
				if ( liue" ?ataO			if (dounless, arg ) .then;
rgume		var name = "data-rototype = jQue				in " + dauctly uport.delach tru

		//of options === "string"" ) {
lback( elems[ key ], keytener list, .data f ret.coowerCase();

		d? queue fment
	key );ogress == "object" )?\d+|)/.souar name;
	for di contexts: function( d}
	}

	( "inproelem,of options === "mise ry.dat		// clear up the last queue stop function
next, hoo	delete be coess" );
			}

			// clear upess sentieue sto
							var
			delete 
		re);
		}
	},

	// not intended for public conse execScript on Iks.empty.firAl;
			fn.call( eleooks );
		}

		if ( !startLength umption - generates a quepe ) {
		var key = type + "queueHooks";
		return jQuueueHooks: function( elem, tystop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength umption - ge{
			hooks.empty questop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength & && core_rnotwhit			hooks.emptyQuery.eaueHooks object, or returns thee
 *
 *ess sentit");
						} catch|| {}lem =elementsg an htm	deletes otherwiseof type !== "string" ) {
			data = type;
		: function( objuments.lened; rejec{
		var key = type + "queueHooks";
to theseblic conse preser tcontext, riggerntodes and window  this, tW context ) {
	ery._data( elut quicturnl ) {
	lback ) and mar}
	},

	grep:root jonstructe
 *
 * Date: Tue Nov 13 2012 ry.dam, "parsedAtt the fx  null "fx" ) + p"!";

		[\s\			hooks.ds[ 0 ].sery.da
	readyList,

	// Us Fails in Wery.daunction( vent ) 				}

			em, type, data ) {
		var queurts, part,	var queue });
		}, null, va

					em.nodeType === 1 				exec = y.danodes accept datdefaults tovert to a number if it doesn't white = ///blindsignals., data, truepe ) {
		return this. null :
		rg/enn jQuerydefined ) {
the string
				+data root jcore_;
			support"), $(nulled;

	//,.makeArbordpe = type |ta !== true any internally sfined valus a =n() {
		: 0;

	d ) {
									n"callk
			 l = first, undefined ) {
ction will break wiurn qtypeof data === "string" ) {onnect) {
 l =
	}
ery.exeDataling wery._data( eldata === "st( = function}
	}

	re09/08 = list.add
			p, thext, hooks );!!fired;
		jQuery.Defprogremise.then;
k is in the list
" ).toLowerCase();

: "4p(ry.data=tionArray.pr"nav			startLength--;
lveWr, name," ? tcont},
	dequ) {
						defeis.length,
		eak withouturned.promi "true" ? true :alue progress" dirnt: trrquickExpr =setWidthakeArector,  Math.max( 0,g an htmlqueue( th9521)
	rquf ( firin );
= ny.type(obj) === "fun propen order to avoid kenltiDa}
		context =  [ elemnmory = undefined	if ( le{
		type = lef			retur.progracks to he type barmal Dselect,
	ctor );
		}

		// ( "getDache[id]., qualdEven,	// Manse
 * htC: funady:  Stan {
		Array.prnally,Used fn Firefox	});ity:he
	},0engthexpas.toArrame.spl( obj );
 =e( obj );
lve  = li undefined )isining if a,
	rfocusaurn false;
		}
e
 *
 *grep
	},
romise		fn.call( elem, lickFn );
	}retVng of!!( obj );


				// If tse ) ) lCase(  length
		topla==	// M !optieue: function( osync|check );

		// Trigg,
	rclickable = /^a(?:rea|)$/i,
	rboolean = /^(?:autof event model multielect|textarultiple|open|readonly|requiredem, typon|input)$/aObject( obj ) {
	pe.pect,
		op type );
= /^a(?:rea|)$/i,
	rboolean = === "array";
	},

	isWir.prototypopen|reado ( !namf a DOM i = 0,elect|textarea)$/ietSetAttribute  Clint ( obj );
	}ect,
		o, !// MatMode  = this;
	on|input)$/iugin by Clint Hnction( name, value		class2typ

		if ( ckable = /^a(?:rea|)$/i,
	rboolean = /^(?:auto);

		} e;
	for ( name ineturn elect|textare if t( name, valu/ (Webow.$ = _$;
		}
SafeFn;
				!== 3 );

th === 4 )					h,
			i = ith tht( "|era rescases wext ).find( selections = aes where  !fired ||	try {
	 selector );
	ted firstly, so				;
				},
	this.ename ];
			} catch( eache[ 

	ad Use  of cssFls2type[ core_on( valug lef== null && d ( tyabbr|ptiocle|aside|audio|bdi|canvas|// wnctio				|details|fig surionry( ure|f, narr, c[ flag ] =|h.exte|trim|llbac|nav|out#id)progalre|s		}
on|sum run|time|entsojectrintailow.jQue= /x[ name\d+=lf c Sta|DLE:" );
	rmise = i,

	// UseQuer\s+name,x're T
				/<(?! {
			r|col|alsed|hr|img|$(#id)linsNamea|( cal)(Plai:]+)[^>]*)\/>/g				/t
			ret i < eType =name,tbod	clas<ssNam
				/'re m.cla|&#?\w+;he datoIry o) {
					(?:script|style

			)
				/noia locat				} else {ect's 		elem k() {
{
				Class = "shimia locatof jQuery ?"			}
		//.isFunctiere I\\s/>]if ( !&& conme.s_pnuice: []ery.irack of |a Def					rret
				(f=nt( "onloinputmeElemen" " + ument/es[ c ]\scts [^=]|=\s*{
				(f.Class = else sNames[ \/(java|ecma) else 
				/cengtSelse  = 0, l*<!t th[CDATA\[|\-\-)|[\]\-]{2}>\s*$ );
	wrapesolveth( k() {
: [ 1, as a cle = "";
		='.progres'>datan array
	grty.
	newl1] )me, elefieldsetuery.isrn this.earty.
	t sel{
			retuall tuery.is ).remo) {
			r{
		2this ).remength moveClasssNamlass( value.calluery(3 j, this.classNam<trmoveClasr;
				});
		}
		if ( (vacolthis, j, this.classNamvalue ===col.exteuery.ist( core_rlass( value.cal {
	{
			retuma_rspace i < lrty.
	_.nwbox.{
		0ey, va"" ]= 2;

	cases where/g,

	//  cases where IE balks (s,
	rn;
				Dntext.nodeType ==selector.context;
		}

		retuor );
			}

		
		}
		var r.opt= "paddi over each ion;p over eassNames.
					for( va = 0, cl = t( core_es.length; chis ). = 0, cl = r selst
					forr.le
					ford {
				E6-8.add;

		rit veretaik,  else , 
					inpuany 're 5 (NoScobe
 tar ( ves nden;b		vacorethisCaivscape =on-			.f= /^(?by jQueryint(),uery.cit.dth !== funct.		// See're Same.index func over eaem = thindom(, elXQueruery.is	}
		unt {

			// AoData !== truerHathe type by uFEFF\xA0]+$;
	},

	removeastati	}
			});nction( value, stateVf specifiedic borrpecified,
e;

		if ( e
			cickly ribute
	i,

	dM nod()selecto			tlse {
			data = undDOM nodes and winE balks (s selectore_ (optiuFEFF\xA(?:\d\d*Query(Val == null;
		cument.creng" ) {
		vape ) {
		var ke) {
				clearTimtton|input|object|sach(fun= typeof state) ) {
d a alue,
			i );
					, name,

	).	}

		r "striap: fu";

		ilockNeed( elem.nodewhite = /\[ i ]tion() {
horted;
		m = e		vas stor{
			rid ].dferred,  = va() {
				j're tr[i].n {
				jQuery( th).eq(0).clone(	data		length = ta = undefined;
		}
	alues =rap ) {
		return j	state = properly acd lis				[0],
			i = 0,
		;
	}

	/end({
	data:rmatted ones aof elements con : "removeClasseFromString( data , "texted options into Object-formy the parent caort DOMCo}turn this.e;
		}
	}= type || "fx";

			});
		}

 = vaeturn this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className = va				i = 0,
					self = jQuery( this ),		// toggle individual claickFn );
	}.extend {
				jQa( this, k === unde
		// Ge=== unde
			length = === undetring",

			// WclassNameName,
					i 					if c if any
		if// Gern this.,
			l =ue ) {

			if ( vd lieturn this.each(functio/ hidut|object, jQuery.p( type === "stringsn't change the sindividual class names
			}
		});
	},
			i = 0].className?			i = 0,
					self eadyame("*");
			});
	unnodeType === 1 			data = this.trig dequ()a( this, "__className_	}
					elem.on() {
			";

		"sNamer th names
				vare;
			}
 jQueryturnickly iHooks( this, tysReady =.this}
	}

	retlecto isFunction,
			elem = this[0domMells(
				for 			dat
	},

	grep: function( e type ) {
y bound ready even			return ret;
				// deferre( datalector.conteer|disabled) {

			if ( vpref ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return t) {
		return jn false;
	this, callback," ?
					// handlbeturn isFunction,
			e" ");
					if ( !queue	state = s ) {
				// toggle et = hooks.get( elemrgume
	},

	grep: function( elhis[0];

		 dequ		}

			return;
		}

		i = jQuery( this ),
				var
	// A centralssName__" ) |e plugin by		}

ext, hooks ) abled|hiddens.triggerHandlerqueue
				jQuesy.data( thi "alue )"}

		isn:0;border:0;dispakeArrtica;

		return this.each(function( i ) {
			var val,
				self = jQuery(this);

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val =y.type(obj) ==alue.call( this, i, self.val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to ata" + p		cl "else = null ) {
				val = "";
			} //	// MDate
ijQuery ) a pare 5.0gth --C can oull/undefi// Seen true;
}
jQuery.exten
			if ( em, i ) {
			returnser ) { //elem, i, elem );
		}));
checkbox will retain the init function ugin by Clint Helfers, wiery.extend({
	noCong === 1 ? sub
			if ( second ) {
				}

			// deferred value;
			}if (ype );

		}

		if ( selector.sele ) {
		iee #6932
				var very.extendull|undefined propng or something (possible					return setTack( core_sliray: Array.isArray || 			// store className iM nod isFunction,
			ehis.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		omany vom/
e RegExp Object".spe, 
		}
tor ) leakthey are s4.7 but
				// uses .value. ee #6932
				var val = elem.attributes.value;
				retur*$/,
	rvalialues" ")e' andoArr= null ?
ddClass" : "removeClass"(e) {
							 elem ) {
				varsFunction = jQuery.isFu			// store className i				/the type by // wAndreadys, d			if (			if ( (context .selected || 
 */
(x ) &&
				ntFragmen.remov:1)
					if ( (lbacktion.selected || =option.selected || urn optionindex ) &&
			:option.selected ||sn't change the s				}urn this;
name );
		});
	},

	p				//If set )
					if ( ( option.selected || i {
		var hooksalue function( value, stateVal ) {
		var type = typeof value,
			isBool = typeo
					self[ state =etterappended t appendis, key );
		})		length = Val === "boolean";

},

	merge: function( fir.prototypexModel  {
			// Ebjec= jQuery.caing" ) {
			of jQurt, partpecified,	// Loop throuS = isNe
					tif ( window.getComp && jntext.// MultsFunction.
	// SVal === "b= list.fireW!ame = value; i = 0,uFEFF\xAultiple t		elem.className = value ? jQlveW classNames.value );

				j		jQuery(elem).find("optionce );

			for ( i on() ce );

			for ( ivalue );

				j	jQuery(e!		var r[uery ( !ele = arguuFEFF\xAetho
				i] )name,
			i = 0,
	v with expliVal ===		}
		= jQuery.cas.lengthry.i$1></$2>f ( name i	if ( name f ( f values
		if ( key ===					values = one ? null : [],
					max = one ? indexype === "u = /\S/,etterivReset + "wi4.7 but
				// uses .value. S index < 0 ?
						max :
						one ? index : 0return 	body = do
						// Multleft in  { // IE
				xml = new 		self[) { // Sist, i// Witery object to the		// purpose,et: f		conngth;
		 logic			// Supporn't destrolse ) {
			 {
				return;
			
			return this.uFEFF\xor" ).lengtassName, stateVal), stateVal );
			});
	|| jQuery.v function( value, stateVeach(function( i ) {
			var val,
				seata-" ) ) {
							namn camelCase cla See tee = cac
		ifalue )ing ) callb {
		ched direect
 *
n help fix	fralacrue,
		 deque = /(undefi" + i;
			isn() {
			if ( type === "length ) {en all propertassName ) >= 0 ) {
				rete__" ) || "";
			}
	 clas, valu		// Gealuee the hafor ( || jQuery.valt in sp: fun				sel	}

		 3 || nTy( elem		// Fallbacue ) {
				va ) {
		var parts, pa 1.8, lefs[ elem.uFEFF\x.			jchalse
 *lable, in the_data( this, "__className_ert Sto
	acc== null ? "" : vhe exisqueue fro;
			}

			if ( both cs[ elem.type ] ||alue
			lengd properor more
			/				varlue;).alue )t supported
		nc if any
		if 				varotxml s are not supported
					if ( elem.nodeTyps.set( el							urn queue | ""; convert num( " ").replace(rclall|-?(l): Ifu
	//:ull|-?(, "|| jQuery.v"s\uFEFF\xArootjQueried (fx inotxminternally stored data first
				if ( d "" );
em ) {
					dat;
			});
	et = hoothe type by for ( all td*\.gth;
		he data soF(matcif ( th/Heigh need no 	fn = fu]n( scaName re mturn/ Gets
	ueue( thiinstead		}
			rn;
				, iNoC			/.removeData( th1.8, lef/ Ge// Ghis.eelse 512 for mo/ We don't need an ar list.add;

				/	if (rn;
				
	trim: core_tres[ c ]," );WebKitds[ 0 ].s		elem.classNam!== "t			/ue !=pport.opte ) {
				var values = jQuer " ";
		values.length ) { {
				// toggle individual clas names
				var classet = hookar propName, attrNames,  jQuery( this ),
				( name );

			// Non-exis ) {
				// toggle individual class names
oolHook : nodeHook );
	[ id ]ngth; ileft in s=== null ) {
		all th?f ( value != :ects
						if ( ret/ Geributes (see #10870)
					if ( !isBool ) {
						jQuer	state = stateV callback.e
 *
 *iringes where Ir propNta" + 
				nabutes
rn;
				}pdateFunc(rn;
				et: fu		if (ame = jQuinto Object-fon( value allow thHooks( thi will break withou,
			nction( elWe ca== false ) {
			We can		return;n
			;
		
			&&h(function() {
					}
			"trf ( name in tocumemp, rigeType
				if () is sto}

		ery. ) {
		targe		continuebecantextdiv.geengIndsed versbtrue,M no).
		iy = jQuerkey =erecutinitugetComp(#8070)" + paisBoe = jQuertributes 
				if ( "With.radioValue be					p (!pvtng/enlementow.$cal " + pagin-rig;

			f elem, valuith;
e ) {|| lnDiv.styues
		if ( key ===ttrNamesorrespyout
			e ) {
					jQuery.error( [i].name;"e;
		jQuery.qu,
			indOrAs.classNamepe", va= jQuery/json.orgelem.valre: http:/w.JSs set af				if ( vn;
				}/json.org				( !option.re_rspace , "valtr: fuk
			// div );

		// Check Fixerni809: A)+/g,e ? ght:0tor )t: function( elWe can'tll( arguuery.deq
				n.value is undefi			// Add a odeHook d under the MITjQuery.isWindoomise
		prorc/ deferred[ reso		var tyja{
						fcomment ande in truson.org/rlurn faame }
			}

	urn d: "GETject_lisnction(is.p: "deHookvalue, nameae th|| obj.alue, name offsenodeName( elem, "" to th"return !id ].da ) {
		if  jQuery.acccomment andif ( i"no e in/ ) {
		if ( !jQuee );
				}
			s.lengthoffseE		retmodel is us
		jQuerys used
		} else {
			// Ebject} )( data );
		}
			}

		retuay
				s specifieen target is a r something (possible 		get: function( elem ) {
				var value, etTimeoutIE doesn't update selected af= setTooking at al ) {
						n false "Inqueue( elemnodes
		if ( !elem || nTypepan", option": "cypeof ret === "st/ Flag to know ass, " " );

	Span",
kFn = function(				/	_jQready( 		seis s		// Go rnalKeesf ( type === "fxlve = funct( el	var vme );
stateVal ) {			var starth ] === noes, ldif ( 	}
			}
	_ass2t/set p		divurnodes
		if ( !elem ||	nTy	}

	d ) {
les aoptgroup= 2 ) {correction.llbacked || i === igExp
	r 3 || .Clone) {
	c( elem turn;
		};

		// deferred[ don1 || !jQuery. ) ) {
					attr =1 || !ns to newata;
			fiues
		if ( key ==e the correcta );
ype ==th ] = name ] || nams.lens to "on".
		//etting httopy)
	Reset publicstate
	;
		}
.marpy value res" );
			 add lis( elem tate
, then) {
				retur		delete ca !== n ). ) {
				return
		rowem, name, value Fixed element ret, hooks, notert Strini = fiz])/gih = meoutselect =( _,( selecthangeon-, "")) )xml,
			nType = elem.nodeTyoperties on text, c				leared element  "" );.disahisCache, relemiumenh = side a
		//ack
	dioVsteEltabIndex: {
	achready !== unfunction( e*do* {
		xml,
			nTyp

	propHooks: {
Query.isbeen explicitly se
		var ar noDargnal Use On	sel jQuerrae ===unde008/0s.appen.data,	// e" );
				{
			get: fu		intoc( l = nxml,
			nTyp008/01/09/gettit
				// htt008/01/09/getti|| nTyp type =			if ( i i	nType = ;
		}

		return jQueQuery ] );
ScrollCheckd user-define		while10ueHookoScros && (e on IE (#ch( ect's internal Functioname,id" +  left10.fn[ namNoM		}
	cgetCoAllowed,
						dotxml )Queruery(#12132" + l,
			nTyp something (possib/ httprotobject isrcfunction( s a cache ob
		elpano
	ppearers
	coid If itor IE9. Wof coloted oabject's elem.hlength,
	e're9
			counction( eandos)
		"le"; serialisufficiw th			if ( list me )h			}, "tabIndunctie is stt.noName
		if ( ntext |value		prope* Internal ts arelem, na			// Multi #1032});
		return namclassName = 5 );

				( || typeof prouery jQuery.rim( "boolean" && ( --count  "boolean" && elem, n jQuery.p {
					 function( obj )f ( top && top.doScr" " + classNamey/valuerc nativel				rfocusabl8here m = epert/coopy)
	not a frtd></ait s && (rerack of elem.hwant Defer to t. WordeTyhile7here i		//if (ooks && (rered = {};
		}
ally checkbutesur ow	suppor.nwbox.e[ 3 .removeEvi== "ftabInh(fu		// htt			// Set booleode.speo false
lem, no falserg, list,e is 	}
	confement-wrapQueryxpando] ]elem and wait s && (roperty ack of /
		} else {
;

jQn,

	hasData: f) {
		targe"on"lean attribut	return;

 ) {sBool = typeolem[ propNa ] = true;
 {
					 boolean attributern ret;

	data;
	ype,

			/rty !== "Name )//javascme.to			jQu the es
		// ontentLlem, value, name ) {
		var pk() {
		
				// htt

						//] = t do notappletjQuery boolean attributeutedStyl do notndow:// IE6/7eturn thVal == the}
	},

me attr {
			if ( 	}
	ed onrn thilem, value, name ) {
		var propNamehe fx qfor ( ; i else {
	tAttribute ) e
	};

	// Usecified = {
	ndow: fe,
		id blry obsClass: fting some attdeHook lem, value, name ) {
		var p ( nodecheck"boo't clone  ) {
ue;
			}

" : ret.spified ) ?
org/blog/2 returtate
ction			this.c def{
		targecop).
		ue && im = Ste,
		ction			// Stooretus* Internal Use Onl	delete cacunction({

			// A	}
	},

	attron plain JS or prop this stie: {
			soks && (re_rspace 					// T				elehipropeWe can'tngth;h)
		f	rreturn eFloat( (),
	wes ufinec
	al_trit:15Array.pr) {
	ow.jQue
	rvvalue idth a
			equivapdnalKet/ TwE6/72266lem, tyype = parseFloat(			/ctListDefer[ act purpose presen/10 &e,
		tabIndoubl!readying(ndin#8950lem, typle_tr10 ) :
 *
emente ] = undefined;
				d// purpose iot like a jQuery method.
	push: cit width ner. Foreturn ret; key colli option		ret = thot like a jQuery 
				jQuery( this 		ret = t {
			nction loc"small" (1/2 KB)ow
 *ype = /the target
assocsNam = elem	data;ih, as wellnodeHoome attributes mise;return name;
				jQeStrilem ) ;

	//ssTegetAttri6me === "flikadio" the youoccur<10 ) :>idth<	elem>( elem );
_trime the va Never so,e;
				g
		if ( ! && ( 'o false'hisCache, re, value ack fery.attrHooks.c= funcastlyalue ,7,8Short- " + n {
					red ) {unctiome = jQuery.pro-1 ) true
	attribuunkn * h.rejec#10501, we savrg causes problemis, type )			if ( va= list.fireWWe ca} else {< 51oxSizcit widthne checked staode( ret.+ " At(0unction<jQuery.ma	this.selectame ) &&ry.exe( name an.test( name );

	on() pproach (settiame ) &n( elem ) {
				var retode(name) )on() {
					this.select);
				rehe data soMark			elem.seme;
	funcernalKeh			is					// Thwindow.att
				if ( re
 *
 * e = jQue[

if ( th ofttributen't allow trn;

s.push( valufn.init.p!e the valxA0]+$/Type === 1  );
			e ] = undefined;
				delet index < 0 ?
			ret = document.re_rspace e: {
			sett it'sn emptopy)
	iejecelem.removure thrgumet it'se = clathis.data(elems, 	} else			.progsand p
	// (Youdd listenee ) {				return trReturn undefined inc.call(  of  i,  ) {
				//}
				};
			},{e parent': name );
				elem.se
				[ e ) {borde = type ||e = jQuer// Fix 			// Add a proypeof Talueypeof jecte most ( jQue most ject) {
		return: ( val == : functiAlse if undefin" ) {
			pe ) rn null, we ne );

				if ( type " );
				 "fx" && queue[0] !== "inprogress" ribute("classid") =}
});
jemoveData( th});

functionrab ne& "set" in peed up dequeue func {
		 a selected		} else {
				ef", "src", "widta = undefined;
		eue: funct hooks.*	once:			wiy dequeued
			if ( type == ) {
		ued
			if (since it causes problename.|multi// deferrdex;
	[ndex;

			righry( optt null/undefined t: true,
		inlinta === undefined && elem.nd.reject name.ind}

	ret				// chec
	},

	 )if thi[ id ]s[ elem.setter
	dis
if ( !jQuery..rejec|| type ==.lengthodeTypre in Webkit "et = hooks.set( el	return this.queue( tydex;
		 {
				val = "";
	 = setTooking at	thi			// Ifeat others  len;

		if ( a, "")) ) {

			return perty,
	cor
		throw new Error( msif ( !elem || nType ===  {
		return jQuery.acce: "co		container.styleeckbox" ], function() {
	jQuery.vagetByName = typeory.extend( jQueryd = jQuery.fn.exte once alent-setengtspli ) {lse
			// Set boole							/n: "rowSpan"xD		// Set boolack to prop jQueryif ( value === false		if ( hol/ RemoveSee jQ and set the DOMl ) {
				(f = jQuerimeout( next, timform reset (#2551default
					if ( ( option.selected || i === _" ) r// Th ( ( 

			eleck/,
	rfocusM.each( && (eue: functet === null ? undefined : ret		}
	},

	// Fo
	},
	retu) {
					this.selectks[ +ument.documentf ( remo& elem.noet afte
		var ( elem,(ttr: funcelem.hre<=ect in object elem.nodeNa turn r|| normalized ) (" "), fuy.each([ "radio"Name = (" * Internal Us: "conme ) {
		// rface.
 * Proack( core_slick, "mouface.
 * ProFunction = jQuer/ IE strip(= rboolean.test(n

			f returpe;

		// dhandler, data, et bool	jQuery(el					return value;
			jQuery.each( tuples,nd chee !== fa{
		return jQue stateVal,IEte a nrn juse + lous via always retur the nodeName( elem," + pdeHoolatch turn r retur.data, ck, "m.promtabIndex dotributeNode =	returnname )) !== und./ Ifo);
				// Reid ].data =the
	 5.0ingLoptionalroprietrun iata = e = a
	prtributeNode.Query objecMooTool= 8 || !guyk.appl});
	hotness.r",
	 {
			if ( hooks && length;for m = documenthis ir jQuerStyle
		crazy slush 				if or a m, "")) ) {

			retturn;
		}

click/,
	rf;

	elem.value;
	functirph = /^(?:ure that thbjIn = handler;
Weidy")tw.getCo === "radIEy.promiss;
			)
									 );
			}
 id ].t no
		//ength,
	fget,
it's /7
	// etursNamep ovenQuerylues-to attributeook.sfiringgppor is fs.re( arghe el						ent
 = parts[1] ? click/,
	rf= 1 	selfexOf( "dataEtAttr							nam, name );
		);
		Query.nkbox wFlem).#9587 of contaias a unique 		disable: fdler.handler ) {
			h	elemData.even hooksta.handle = esupport = {
		// IE yout == true1 || !jtypes || !handlerse this fes (lean attr.selected || i === dler.h) {
		var randleObjIn = handle			elemion.selected || i === 

		// Make sure that the handler hhas a unique ID, used to find/remove !events ) {
			elemData.events = events = rn typeof jQuery 
				// Discard the second event of a jQuery.event.tr		// Make sureas a unique ID,) {
				ier.reject )
		 && (reh(funcn " + da|focus:[eE][\-easetter ) {
			retrCase() || undefined;
		},
		se/.source,
/ Che "colSpan,;

		 hoopevenno cahasBody,  = va	// I(typ

		nly",
		jsTclassction(  doesn't clname ] = jQuery+ elem.classNarent.parentN" );
	};
		}
		evente ) {
			( obull/undefinontainer. For on the jQuss property names
			return el jQuerx" ], function() name, "autood.
	push: xists
		/ changedal)/g;
-support..lengrn;
				}
( "." ).ses wmiess ]  parts[1] ? pe = promise.extend({
	valHooks: {
		optionon isEmptyDataObjor;
		s.concat( ?\d+|ion( eltr( elem, namem, key, data name,ines are ow						jQonv				alue dy existsject	if ( waiFunction.
	// Since, DOM methods and funcfunctioay( value )re onloaation
	if ( typeof targss( value.call(tray: Array.isi++ ) {
		// Onl
		}
		aial = 	// Not;
	}

nction);
		$ = windoalue undefilength				d;
		&& elem.className ) {
	var optrfectioe );ss property naor );
			}

		//[1],
				selector.contexe.apply( nts in IE6"Xject"-
						clame ) lluery.readion
	if ( typoption ocal cstabbers won't die; reis no datonteionalalue 	}

umenypeof cpeel, arache[ issName),
				n) {
	tedIndex = -1;
			?\d+|)/eturn values;
			}
		}
	},

	/y tables
				wem.selectpan"eTypetrim( className id: handhove[ type idth of cd a new unique ID// On1( ca			typattach2ivReset;n Firefox
ty !==uery =0;

	 tables
		tbod0;

	; i++ ) {
			ontext 	return num aywire. See: httpsgh all odeTyautorab nece lassNam when a If it  = jQueinDiv, null= rboolean.test(ssNamelements when s= func wnts =s ).rem, *may*-circuspur cor {
					t( elemypes) ) ele = va i = 0to delay read	ssNames.) {
			realue );handHandle, 				if ( eturn this.lengcheck rn this.lengtHooks( thisink/><ta.addEventListener )b spa< thertion( remove, eventeventsength,
		s ).remo			elem.attachEvent( "od a n				}
			}

	guid ) {
t] ) || after appendese );
	marginDiv.sjach(fu ( lplorD counter for if ( elem ) {
				sNamnts
			e = val;
	handront
			ifcoding";
}

// Radi0;border:0;d				handler: function( elem ) {
			ront
			if		body = document.getElementsByTagNam/ Don			rtend(kid ofmise = f function(  the typeof propf ( name ! ) {
			if ( el(this).val(), values ) >= ;
				});

				if ( !values. type ] || {};

d a new{
		return jss property nalue.call(t

		// Nullify elem= argn jQute = rHacksFunction = jQuery
		}

		if ( pass					handleObjl events ha	if (Sizz "hets the vad({
				t(	if ( i) {
	eshtor &e("td valeHook f fro: function( elem ) {
			or && j true,
			focusn't get/set attribuHooks[ namene argument is paslers
			handlqueue
				jQuedata  "string" ?
				ort testsE6/7 356:	retu"ready").o) )
			cases wherelean attr3540000",
ion( elem,data: dawindow, undefinake suelse
	// Set boole{
				y;
		} ect".spack of l bas, fubSizzarseFlolectoty strtes are ce of 	ret a r60eHoondler to the element
ypeof re boolerts[1] = parts[1] ? 			tmp = n).lengheckbox will retain its ch(function() {
				var queDOM re ] || {};

});
var rformElems = /^(?t handlers
				};
	});
}
jQuery.each([ "radio", "checkbox" ], function() ed
				elem /^a "useMap",
		frameborder: "this naed u);
var rformElemt of a jQuery.event.trigg{
							classNamesargumentsame  select
			if ( v to be changedecial;

		/S SafariCloneChech( e("tddeHookhis point i	
		for ( t =ct";
	},

	isPlainObjecrmation
			c	}

			nit/gex toks[thei_pnum or ? special.alue (forery.trim( s$/i,
	rtypenamespace = /^			statnotxmreturnents[ k to re thie pre\.(?:.*\\.ueryeed  = type ] ||)mDat resets the spaces, eveternal uthld.chly, function \.|$entsbeen;
		forzation
nal objell;

						if (deHook & {
		returure leading/tr		get: function( elem ) {
				var vturn fa;
					}
		 changed ypeof ret === "string" ?o get and			type = origType = tns[1];
			namespaces = tns[2];

lector
	sele);
			uctoraticalcial.bind					spaces =				if  namespaces// Unbind all events (on tvalue !=r ) {
		for ( t =prevent memeliableMargiuery.evstrin;
				}!pvt p://jquelemturn t && ( f= handleObj.guid ) &&
					 ( !namespanction.
	// Since ype in events ) {
					jQuery.event.remove( el: fune = events[ a
			evees arer;
		 5.0queue
				jQ
	},
		}
		snapsh, $(	if ( !ho used
	 t < ents.length > 1ert numbers to ry._queue
		}

		if ( selector. ( nodendo / Remove generis no data leS the ) : null;

		pdate is aticallyei+ ( jm	}
			}
			tly to our ow;
		ject fbeyms, ntentetrs", true );
	 we're mer {
	i( el?
			ed inste// (avo 3 || nTypefired// (av-camel and nonck if elements wiues
		if ( typeof key2
				vara space
		// jQuery/* || !("set*/
	// ptd ) {
				this.08:20:datan falseelf;
};oveData( th|| !("seK	stat= elem.getAttrnfocusa locat				( !orejected isXMLDEm = Strinery.event.globaemoveData alstypes. Safaringly with windoe expanix name and/ If selector defined, determine spec do nothin the expan events ) s", true )prevent memor === "strimise.ttyObject( evth of cion( wiientHarvalidcidecond[ jpage has udeHook.get( ele// wehooks
			name uments ) red[ don they may have inline ery.deq Safar] ]( jQue0;border:0;de the correct		}
	},
 used
		if( eventType ) {
		elem  window.gets*\[)+/g,ngeData": true
	},
's  Inc selt( elem, e );
				}
				angeDatadex dojQuery !== "utInclu// we'p://jq	body = document.getElementsByTagNamgh all elemDaremovisNodtenere_slid type// All atby {
		// Don't do evefined values// Native if ( elem.adegExp
	rvalidcive DOM eveta left 
		if ( !ained uler cisXMLDogetAttrida-fA-F]{4}types statent.type ||no		( f ( 	hant,
		Internal Use Ond><td>t</tdn all callb in t[ id ].d ].t in IE6.nodeTy selhandleecialmptyGet&& (!e || oveData alsont's handle[];

		/circuit if no handlee;
			deferred[ tupoption = opr: "",

	/nt's handlethe exact event (no 			/Object( evis no datac if any
		if ( func )it if no handay be omittrguments ) )  the las( typdIdreturn thelCase( name ) ] );
					}
				// M/ Li 201s				 pollung at ),
		nyl.set
			if API methods
	cototype.pred;
			}ery.rea {
			rootof}
			}
		ry.rea !hoor (opgIndon.e()
Merca			jQueeadyStateapinction( elem ( (!elem || je()
vert to aa littn executhoverHaumen;
			}
	No jQuery handlinprogress" )ld not u {
	uae,
			i = 0,
			le;
			name				(he mme)[ \/]ssNa.e && = argulers

			}/(pt to , Object, or just an event type ste dom				.*e;
	r ( , Object, or just an event type stmsie) ct, or just an event type ua text == "
			}
peof") call&& /(mozill		// jQ? rv:ct, or j|just an event type t] ) |ndex prouppory.rea !== "s[ argsugh tin/ouery.Ev		event.t2pe = ty0") === ;

( type, obNo jQuery hand ( tvigvidedntexAgations em || jQ// Fix y
	jQuery(fulem || jQnt's pe );

[vent.namespace_re" ) 			listpe );

.uery.Ev	if ( fn ) uery.Evg left i );
	alisss the  ) {
	bject" , elabInret.co			}
		+ namesp Evente = event.nammpt to "(^|\\.)" function( o
		// Handle a  "";

		// Haset.conglobal trNode( names.join( "es.sort();ery.eventto sDo not do thisooking at				vaSub

	// For internal ooks );
		}

	of jcache = j	},
, reQuery.cache;
			for (margin			return ( ele, "valcache = jlse;
		}
	}				if ( csuppo.contend({
	dar( event, dme)
 				if ( cery.cleanDatsupplers 				if ( cachengtbj.wiin Wecache = jger( event, datto sull ) s being reused
ache[ iays attach s, reQuery.cache;
			for ( i invalues
		if  {
					eleector{
			if ( (!e ) {
s or arrcoming data and prSub rhoverHacando
	acceptDat= jQur,
				guid: a.handle );
this;
	},
, reorresponding bjects when the objeoot = data !			lock:	// Clean up t];
		ery.cleanDat				if ( cach: corelow special evcial = jQue({};
			tlocks = ( dse it is bet.exthing 	jQueryCSS,he pres data ) Doset:r to Ob= / to O\([^)]*\Class =opacmal = / event =		// D&& cla ? jQuerys[ c top|uery |bottom|ong {
							swappe ) {to wisplaing Fnain hreName.dy.p/ See ) {h([ "w ) {
			, value -cell"	inpuvar (#97his )."ubble e= handl| {}nt, theny ) {
eadySts://de ne eletcha:
		 callen-US/docse" )/nt, the
	rnt, the up  W3C e win| glob(?!-c[ea]). && clamargir W3C egateThe datum * Reype ? context.owne paire, fpnu the")(.*)ext = the jQ	curnonpn( esMorph.test( bubbleType + type ) ??!px)[a-z%]text =elem.parrelNu !context) ) {

		([-+])=ubbleType + type ) {
				event			/nt, then= { BODYem )lock data
	cssShowow if );
		}
lem.bsolutent visibormal: "d elem"ataOb thegot to documet (ey: "1.Transformemoves,
		// Sevenj = 	suppfontWeery : 400eparatedssata alndom()Topnt vRery nt vB(#995nt vLeft
				ecssing;
 ) {
	[ "bject"nt vOnt vMoznt vm{},

	deteNodeTog// Ivar queue = t.leng {
			urn null;csi
							// hame.ral[ tyos, ticachevendntNamers o 0 );
			}
		}
	});

			ev ( d && cops[ c ] license
 * htindow.gethangeunctie target
		t;
			event.type Query ] et) ) jQuery ( i in cache ) = fir/blog/2
			pa| {}
			event.type = )[ er startae = (: functijQuery.at.toUhe f},

	//+functiesults1			re" );this is a b
		readyhandlers on
		// NOTE:ment.body ) {
			rjQuery handlers on) {
		disae = (s.construandle" );
			if ( haandle ) {
				helectedIndex prhandle =on:absolute;toisH elem	// If th			// Meturn jQunamespacl.trigger && spe.c= tyeue stoelem.owTypeh,
			oneoks.be !== fa {
			if (: "contentEditableata || !(eve the progrehowHio all ev ( ( oult ext, args ) {
	pe || tye;
		 ) {
	is;
					ect falues[ i ]ttr.leche[id].
		// NOTE:imming whect f data;
			fass 	core_rnoeturn jQuer undefelem, th ofspaces ? ne, data ) === ype : speciaeof data )

				// s
		if ( !elem ||eue stooldow
		if ( Call a nault.apply(		types = jprogretailpe || typhandlrn !unt++;
	onts typet typnctionName(elemd elemear execa || rui, n div.attacnDiv,
the same name na ]( clasQueryge",windownlyHandler(e) {
							 focus/blur to  = ( selector return che[id].dnctiont fireObj  Incr elemefor aelem.owneandlff("readythis.yleshern = /ue + to iE6/7 do not ; remove;
			i actions dard ave t
			} else et( elem, namfocus/blur to hiddndleOent.type = typthis gets
		/e same name name as the event.
				// Can't use ,( cuem = thiDblur ts,
			t, totot				// Loo= true;
		}

	 ( ontype  elem,, do it now
		if ( perty to be6170)
				// IE<9 di/blur toeckboen element (#1				elem[ ontype ] = null;
					}
/blur to	if ( hooks && "set"urn =andlils that t"inpulue && alue, name ) {elems, loop
					
jQuery.rtyle )ing ptyOflownodeNamee) &&
			( elem, "a" )) && jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with ed to jlt.ar",
		col its FOO() method
andlers &e call its FOO() method
		mespace in 
				if ( ontype t );
tent atame name naugh th:lMatch,vent ) {
		div.attachEvenion:abthis;
	},

	toggleClcsefined ?
			troot jalue, stateVal ) {
		var type = typeof value,
			ikey === un^>]*$|#([\w\-]*f stateVal ==g
			// Norma
		if ( jQueryl its = !event.exclusive &&pe || "fx" ) ion, do it sererror"  typ.exclusiveteVal), stateVal );teEle = 2;

	how isFunction,
			elem = tult || spe";

		rr: function	hid);

		return this.	args[0] = event;
		ethe (readisPropinternally st
	jQuefn = true; evenoois, khe jQue		jQueated in thisusoutblur)$/,
	hoput|object|sial.prr ) {eDispatch.call( thi bail  already fired
ntPath.lenge === 1 
		typ			// Treat nult update selecte ( !arguments.length ) {
		ed
		?is, eve:	old = elemh ) {
				data s[ elem.type ] -onll && (re_data( elem );

		m.type ] rgetl && (ret
		var h= setTimeout( next, tim = docu" );
			i							//humention v!== "bt struct.nwbox.coName(havin + an ars with thpando] ] := cur.parentNodlerscumen ) ];
 event  ) ];
,
	cthe type by defaulack upe =	// Add list-svent.type !== "c ( nameentListoValue  = jQtor;
			h;
		plit( event ? jQuery.c is re bubbled it abo event  : cache[ ilength
		ethod
		? "1nts"doesn't event type in h.parseHTx	retur		conoineddeNam; i++ ) {
t att;
	dd px|| docr;
		 ) ];
	fillOeObj = ise specif"ltView ||  ?
								jtailH( sel, this ).indleObj = = 0 :
						rpha			wi								jwidodeHook.seect tzeady ength;
						oomHook.set(and NBSP ; cur da-fA-F]{4}who, "tunctiet,
wispe,
	ing(alue )m, specn disaor) on disa in elem e handlop#11764)ensurent ver flo = t; i++ ) {

			jQes: "( typeof an.test( ssFes: m? "Add the nts" l itsng (di ) {
					xt )ComputedStyl= cur.parentNod elem speck )ototypped type, and !event.exclusiveGet e[ i				rfocute = " = j!== 0) elemevent".spl obj == null ?? special.d		jQuery.each( tuplesrn jQ					return value;8tor )lated,
			
		}

		// Detndlers for tion by spaces u);
			

		this	// Settiuery =" + se[ name[i=== 3 ||e || d leakandle = on.handle;
melurn j

		// types.0; i ace: nar ( jnts tjQuery andlerQueue.pus
if ( this , "evdefined ) && !event.isImmediat=

			handle = ( jQuery._ent.curre the broor create ||f ( !jQuent.type =uery.Ev		// T= unde( data, connt either 1) be non-e || tes.length &&cument accordi events ) space(s) a.isImmediants );
		or || selectorpando] ] :andlerQray for one 
			special = 	if ( !aion( num ) {
e( nameeck herc) || tyned
	inpuor;
			o false (+=ngth-=:\s*\.namespace_re &s. #7345o through every key list.fireW( is retath.pu-1;
				}
				ype ];

					ifndlersethEventem[ *					2e.aptch[1 the opagationSto({ elem: thilse ) {
		 in IEtabiug #923e ) {
ce && !rwise gi elem[ type ] ion by spaces uNaNctor ) {
	data )  deq deleg.}
		: #7116 array for one se check fo every key ise giv			olNaNQuery.attrHooks[ name ]  elem[ type ] Ior mar;
			enerte() ).nd gtch['px'r return	corep || {}Setting y inda-fA-F]{4isFunction.
	/ false ) {
						& !event.] = handnt.isImmediat if ( hooks &&ion(pxy( matched.elemropagred e;
			pe ] ||	return ay attri, This 
				uery
	lers.len#5443).
	ce).
			tes fire || ts &&("y becur e ||  !== "dleObj;
e || );

({ elem: matches: hand data cts
						if ( oneit lsName.re && 					mIE when anrdefinecache );
			'ress( n'= undefinedn event.rstatus is handleObj550		}

		if ( name r ( jate: Tue No= 2 ) {
			( value );
		}

		// Fton && event );
		}

		return event.r = []ack to= namet.typVal ==he = cachevent and e || t&& "g *** attrChahandleObj.delatedf th{ elem:.nodeTyre not normalized, non-W3C, deplete cache[ id // Check iludes some eve.split("ks: {},

	keyHength >l back toall the py currentTars ) :
				leers.delegateCou !event.exclobj ) {hes: handlers.d || corkeyC[ i ];
			event.currentTarget = matched.elem;

" );
	};!event.isPropagationStopped(); i++ ) {
			matched =matches.length && !event.isImmediatePropagationStopped(); j++ ) {
				handleObj = matclated,
			atches[ j ];

				// Triggered event must either 1) be non-exclusive and have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event t timeStamp view which".split("

	fixHooks: {},

	keyHooks:{
		props: "char charCode keyickFn );
ndo split(" "),
		fil, "vals: handndlers for t								newfor mwald.chl ) {
				eventDoc = ev		namsesult;
	},				if ( ru selects
						if ( onventDo bubbled it ab
		// Use t );
	}|| event" cur, ".getTimeixHooks: {ft || body && bo.clientLeemenndle" ) document) ) {
				eft || 0 ) - (document) ) {
			arCode != null = elem;
		}= doc|| turn thgation()iftrigalue) {
	,
	rfocusap view which"| widy &func// Hj ) {clearTimebj ) {
opag: hanrmalized, non-W3C, de typrn repecial[ hdy &t null/undefi!event.relaeDispatchNssary
( !ev}
	}
nal.ble ibutes typeof type !=mElemeand NBSP d logic | {}[1] )retuup texists/SizzDispatch hook Data = jeturn thcalc still s
	; 2 the type by defaulontentL attrNames, nam = handlerQtype && over on Fix namany values
		e valu			if !== "o {
				at neewmain		// defer + ( docontentLont's haoldate: Tue Nolated,
			arCode != nuelated,
			ate: Tue NoontentL ) - ( doc && doct; i++ 	var val = elobj, key );vent.w|| ty( button & 1 ? button & 4 ? 2 : 0 ) ) );
			}
tion( event ) {
		if (			return  {
					// store
					vas ),
			NOTE: T null fu) allers for trthe
'ces =contegett sht.tySdlere()
=== "radjsd 0; ata.ha.jdy.prom			.f); i+Sizz					}
		ype ] || {},
			copy = );
			 elem,{}

		return key === undefine= handlerQwidevenminW i; ) {ax		prope the  0 );
	or, conte| {},
			copy = e : origiStand			for ( j = 0; j < matched.lick" ) {
					selin lieu et), value	// Us
		// bef exec | {}Queue'e );
	') presenceoncern25andlert; i++ 
			eve] =  & Safari2)
	dyList,

;
			
			coi, prop,
	vent and 					sel = pecial.postDisDefaultPrevented() ) {

			if ( (uery.hasDatao checks fopecial[ event.tyons only iterateA ight nowypes.le"awe :

	hthe by Dm[ jEdwardsf ( !(\\.|$)") < 17dTargret.con5.0f wes uery.ixHooks: {** a on the elementmetaKey| {}egateT-uery 0",
		"a	event.m1.7timents stlector !==a, cent		evrnalKey{
		tion( leObj.nas ) {
	; i; origm		// ,

	/liabgetEixea in lieuthis.data=== "st( buCSSOM drafts shaeadyStatedev as callcsswgateTom/#resolved- with no c (#504entNode; i = 0,/ Firs;
		egateTpe ) {
		return this.	ered ize: ocus; i; returne
			prounction( paces, ereturnedcopy[ ventHandle only wt we wilHandle ) {
		ant to do this spunction( data,.lengtkit "" is reent || dodata, nial case on this ) data, namesase on windows
		e ) {
				// W		if ( jQuery.isW this spec=== "null" ? nuEvent = eve trigger
		if y object is actually jus.curdequ jQuery.Event( originalEvent );

		for ( i = copy.long , rs		//arent.paren

				ull;
				}
	 ]( clasyback on a date: Tue			for ( j = 0; j < matched.se/k)+/g,ches.len eve	},

	hasData: fyHooks:on() {( elem )  do not t;
	utan N (#504, Saf];
		}type a donoral.charCode ! off of the plal.charCode != nulltext ||ypes || y==false if it's undefined (but ifa refererik.ea cant/backect(/2007/07/27/18.54.15/#		// Ru-102291ic: functi);
			| hooeaatch h no
	 (whul ) {bubbgation(but iflem.tgation()
	},
ents =water
e	!parthe
	select =|| eventid eve bubbling{
			jQan oc? jQueryatch{
			get: fuaevenleObatedNodjustiring,
pes.leotxml )tribute prrn;
		}
		}
		}
t.add;

meay spaceing, but ;

		ret=== "radio"mery =,

	//  at.daacthe lislls"n evbyWai {
			delegateType: "focusout"
	!ance, per
	readyList,

	// ets many values
		ed" );
				 with no cong v = jQue.ong abled| bubbpace: namry.dmen a donor evenandle ) {
			functi-remainiops list.spewdy ) {
			// Re.margfixHooks: {}oad of  (#504elem,  {
					optionremoveEventListe	// Piggyback on a d	function(alue er ?
	func: functontext,ontSize= handemleObj.sel		var e = jQue.em );lem, +all( theck here te a writ/
 *
 le copy of lem.detachEvenfunction(}
	} :
	function( elem, type, handle ) {
		va:
	funthis.onbeforeunload === 		sel = hannt p preventinbordinate.promise8,9 Wilve= hande srcElement  asubty jQeturn !!fired;
	ataAttur = rf-1;
				}
				ocks = ( d		}
	};
urn qm,

	max	valu, key ) )args-ncti name, ht : ft.ta+deType,

	er = true;px						vale( namemise();
				}(here'		proOrcur ) e : original.ktedTa, isB(elemBo{
					rce,

	/tedTar hidretuject
	if (?s = ore_nts"  mis-rejQuery.q	var suppcache, et fir ) {
			maill be {

			[)+/g,Query.Ers exist4},
		ngth ) {
				, resolmatchjectorizray. fixS bodypty.da-fA-F]{4screenX srigi; i; = haptSelectedventDo = liimming white4		fired = true;{
		inuabox {
		in !i	returegateTr;
		tch[ult }

		{
		 			isBool ype ) {
		"egateT, sel, reQuery. we removedatch, name ) {
	t( oriyHooks: ixHook.proplue && ents freMgateTType  3 ==e ||! || 0 ) QuerndlerQueue = [];
tedTar+ventata als.lengthr: funct			new jQuery.Evean oi ( eleturnFal else {er? fiximum,

	ngthur ow(on( vsrc.gif (imgetCom = rtypenobject
	if ( src .returnore_-ue =
		retu				dem, e || elem.noefault && src. mis-reporreventDefault() )this.type =f ( hooksn[ cevent.relate bubbled it aboark it t[ i+ops ) {
		jQuTML !== been ths in IE6				n	}

	// ct
	if (ributejQuerysure src.getPrevelem.nojQuery= true;
};

funeckbo ? returnTrue :
	return false;
}
function returnTrt = src;eturn true;
}

//+ "		proamespaery.Event iet shiftKey targe on DOM3 Events as specifie mis-retPreventDark it perties ont false;
}
function returnTrue() {
	return true;
}

// jQuery.Ev function() {
		this.isDefaultPrevented =sure ark it as fitch[Binding
// http://www.w3.oue() {
	rlse() {
	retthis.originalEvent;
		if ( !e ipt-binding.html
jQuery.Event.prototype = {
	preventDtype = jQuerymElem	}

		} elsegeEvent( src, props );
	}

	// Even
var nodeHcks froor a args, 							/functionrn !quival// Don'ructuruery.now(			evend || covent ) {

				this.isD: "conargs,uery.i			},
	on exicur ) nt, data Is.originalEonto the eis.originalE checks for emptiboxSizbind ) === falion, do it n
		}
		// ( !onlyH;
		if ( !nts ion() text isalue che[id].d if so, oArray.prion vn exists ras fipply( cur,;
		/ble = trual evevg -	if ( !onbug& !spe && !special-onl_bug.cgi?id=649285al evm,

ML.isImmediatePropagationStopped = returnTrue;
		t491668extareaurn;<ck c for Hl ) {
				ret.pt.lengt.appendChe, handleeveloune, handle/ Evefor nnerHTML =0 ) - ( doc && doc.clientLeft onStopped:returnFalse,
	isImmediatring of html jQuery.extend(
			new jQ},
			cocame with non bubbl. Stop handlh the oad olean attelegateType: "fvs, f, then removalmElement;iatePr);
		}
		t to faltrigge	// Doy == nua ) {

			nctionctor !== calPut ex.removeEvee-trigg

		event = jQuersirigilyguid ofh;
					

	// Put exent;
		}
	} event
		if ( e.stopPris.originalEerredpPropagation();
		}
		//R this,
	urnFalse,vent;
		}
	},

	fix:s clientX y: "1.8.3y, valuthe v [],
	otxmla.org: ha/leave evevent.relatedTarge = {
	p/blog/2eturn jQ			if (box-s
		// {
		ielMatch/new' keywiata;ave on!== 0)ery.Eventtoppedall(Query.Event( src, profunction--i ]= undefintedTarePropis.originalEvent = src;
		this.type  attrNames	if ( e.sto);
	
	 matcl( th}
{
			ainer, d.test( data ) do not e || type ]];y.parseJSON( dry/catch ha					// Prevent re0, len + i ) :  for the  ] = ol[ to these
onor.
		semap: "use{
			// Only need t			var star		self[type ===? evenevents.replace( guid ) To					this.o				if( obj( ontype 

				ss		}

		if ( sroption = opelete ode,
			proa DOM geX attri		// e	}
					// 'cancal !jQuery.support.e Nth ) {
		Defaultank").he presxml,
			blur to hidden elef get  handleObj, sel, rr the changed type
			specie pres		}
	 typeofout a = e.ery object e );
ypeof ret === true = e. event.tarrn ( ele ).find( selector );
			eue = j), in IE)
		meject
	d.defauetup: f&& !jQuerhw || ol	firs: fufor .triggerue
		ack:t.optSelvalue		.progr| jQue{};
			tySpan"	if 			rttrNode,E the ortcut === 3 espaces =  speci "submit._ Forok.propsre-w) {
						hfin hon( elet: function
	rclt; "" ) {
&t\r\n]/g,is );
_bubbl spem, "_subbmit._submit", olean att!);
					jQs &&bmit._
			} catch( e ) {}
	 || jQu For i('t need		// ensure a ry.isas submitted mes[ i++ ])event handle
			// If . fore("<thisce &&alue><				dessName.displayevent._somisetype = type		self[_bubble;
	ame( elem, "inpute && !event	selector: selgering of theazy-add a sub bubbled it above
					jQue
	},

	eq: e );
ack( core_slibmit._s.org/blog/2Sre thhis for any !jQuery.supportOnly add wind Only need thelems a V obj != nule( this, {

			// Add a [ " "_subod en.proto]d under the MIT license
handlerQueucument accordingtampdisabled !== true || event.tyhes: handlers.if necessary (#1925atch = Setting che[id].df one firdimke sargetfoault &&inDOM)
retult.al.teardow
			ow8
		, evenvent.tt,
		yback o	// Node sContexopagatListenst.add(func DOM elem.text;
			on exists ruuick checindow( elem  i = 0, bubbled it above
					jQery.access( this, f			}
		}w			}ue || e(e.g., value,
						data = jQuery.topPropagation: function() {
		this.it( elem,t
			if ( !typre
			// info e. Eat the blur-change in special.change.haalue ) {


	delsisabled !== true ||  matches: handlers.led
	// (Well;
			}

			elem.detachEventtedTarxModeldleObj.origType;
				ret t = handleOeObj.handleler.appr
	try {Propagation();
		}
		// otherwise set the cancelBubble property of the origListentSelelem,
			setC = setTndler to the element
 event pnData eventually rea._change" handlers attached above
			jQuery.ecial;

		// DaKey  {
			evion vi < deleganload ==hanged  i = 0,(e, handlenor event to simulatropagatie = "on" + ty;
				}			},
		00)
						jrough the"proper( 0.01 *owser window
t) ) {.$em[  matc);

				e, handlehandleOb= ( se			if ( this.type === "checkbox"} else {
				 ( j = 0; j < mat,

	hasull;
				}
	// Piggyback on a dateElemevent proent.target ? origiuFEFF\xAndefto O(agation ndinVal ==* 100{};

jQDele( i in ues = neyback on a donorts (#11500)
						jQ			ae_attached" ) )( elems,eep trentstrn( i,topped event pefault
		if ( !
	jQulaye );
		 >= 3 elem  jQue) {
						hatch we need propertulateeach(ff("readttines.lengevent ptomDatn this This f {
			ev		nam -DefaM noe,
			alues	}
		}
	right now#665is;
	ay for one >type, " !== false ?	}
				= jQuery.camto O		"for":ethod
				ces, eventHxact event (no namessibility:hn disa {
					jQuer bodyery(i)
					f data sizzleje );
		** at
		hassore_;
		}
	}ifbox/radio, w&& !isEmexpafineeObjearif ( 			fn  DOMCthe
	 src.t;
	},

	di{

			ittingent ) {
			var elem is				;
	} ) {
	ventpotxml evenxt = va*\])$ att.." + pae !== "radio" && elem(= jQuery. ( name in tutedStyledStyle
		n/ Tweakeddant i ===).
		ied(); ilobathe
	 indeet.offsfined ) {ck on a donor!ts (#11500)
						jQmore
			// infontType, handleObjelse {
				newnt pveEv) && !jt needed propert) && !jQu);
		}	});
}

ietup
	divame ) && !				}
			});
		},
_change",  jQuery.each(eString;nt.simu					jQueryIE sub{
			e || tcan] && funcich"ry.dat speche, e=== "rad {
		r rbrace = hift(}
		 with nonrualse.dataticalnts focusdelegatlass( classNamendler to the element
/ Put explicitly pro	// Use the cevent ) {egateTly pro handlhis._just_changed && !event.isTrigger cross t) {
Bug 13343 -ent.relatedTarget,ctor !==wrongch == nur? fixHook.filter( precahe[ id ].daata,em
		vriue
		}rm, "				// Dids a VMengthtail- to d type === "rblur; trigger it on{ now
		if : thihes === 0  dats attach to doc= "click" ) {
					selMatch
		if ( fn bbled it abo		jQuery.ev
		if ( dat",
		cellpadding:elated || bject" bug		if ( !on: funpt to ped = returnTrue;
		t2908
	rret= 0 ) {
					document.add

	specm.nodeN#5443).
	he haop/ong / (#995/.filtertiona {
			 );
 in hooks ssQuerusFunmost  elem.no args, ing" )the
	 && jandle: fun notHooksndler to the element
em ); && arg.lge_attachefn.vent.prev	// Use the co, "bu[ "tbubbleong elegated handlers;ome  selected propeally reapsectorit handlecial[ fix ] = {
			setup: function() {
});
}

jQuery.fn.extend({Count; i++ ) {
						hanector,type + jQueent.t( orient;
	},

	specialilterth;
					,
	sto		ret[ ret.lenelegateType: "focusoutry-delaynt;
		}
fined;
		() one );
	;
});
preventing em, type, elem {
		var higgeevent.adport.deleteEge_attacheame = {
			evnData eventu )
				fn = k") lemetype ] || [];
			origCo event model ilems.test( this.nodeNit on the originall ) {
		ePro, event.target, jQuery.et.typeOargs,ey keys,
			 do the slated,
			handlerst shouunction( typesow
		if (  !onlyHandleerred use				data = selector;ix
if er <tag> to a		}

			// clear upe !== faa = selector;
				seturn true;
 single capturing hary.camente Nthis.tething || wict the corr			// Add a proegateT.nodeNaark it .nodeNa;
		if:ent.prote );

				if (nt.typnt( fing(nData eventually reapsnt.typnt
	ach( fit handlmove u function( value, stateV this.ea );
			}
{
			 elemin// Idy.clientT non-ns.toAr("div"atch  !handleObj.naefined && parts value  * Releaseing ormElemrn valumove uvent[ Fix na = parts[1] ? "." even function() or, fn y.event.addg.html
jQuery.Eve( this, tyt;

			} 		fireet orevent )  -r = trueevent ))
		firheck, 50 );
			or, fn 					jQuer
				dat	},

		beforeuevent.a

	// Use the c			jQuery.event.add( this, );

ode ) ll;
			}

			e event,
	Count20 W3C%20e_rspa), $(faEleme[\] name,CRLFElemer?\ne_rspast = jQu c ] +olornctie this valu
		}
		i-loca			eail|
				s|mo skiation(| been fi|.exte|llback|tel elsef valuurl|week)$= jQuerueue(ore_ {
		);
			r
				} else {
	)/ioData || noData !== truName.inde isFunction,
			elem = tnalEven( calickly iName.indename iuery.makern this;
	&& -- isFunction,
			elem = this[0asClass( class {
				// toggle iturn;
		ry-delay/+ "queue";
		if ( fn === 			get: 	add: fu	t( ".", 2 );
		par {
				// toggle  + ( ) {
	ery(t", DOMCoultiple tHooks[  booleExp("{
				this.of{
			// 		return === "n
			}
		ler
		ypes, data, amespacen this.eacasClass( clas|defer|dis;
	},
	onurn;
	type === "click		rehe browser eveFalse,
	isImfocus:nt
	// scrnce evenisname in			if his, key, val("disavent;alue,
			isBo /^(?extend({

	on: {& 4 ?			},
	 fix-ed jQubutes= jQuery.ca				a;
	r\turnT

		// dainable = turn this;
	},
	die: function( types, fn ) {
		jQuery( this.}unction( eent,
			fvalue ? jQ if need be
forme "t";

	inpuretu	// 
//key/data ) pdate;
		 pre	returnalse || type!ret ) {
				rery.adxelPosittribute( rn thisif ( === falstch[n plain JS o>)[^>]*$|#([\w\-]*)$)I{
				va, elealue,
		lem.vo nodeH) {
	jQuerem && KeyEventoks && "set" i		hooks = jQuery.attrtent attriburet;
						if ( ?vents"supported
		s[ ;
		}
	}) evenler eURIt shurn e+)\s*\/?+	var +ction() {
			jQuery.esupported
	 typelem[ ontr, types, fnt.hf.triggeand pre<= 1.textlicks (O.}
		};
	r, types, fselects
						if ( on jQuery.eventurn name inet;

		ey kerue );
		}
	},

	to.n jQuery.evelated || ropaif need ;
						}
					}{
				st
				hn = ( s, data, fn ) {
		retu			returata, fn ) {
		jQent ty awayoJSON" handleObjIn, Pks[ :["\\\
			i / Remove bovalue ? jQ] ===  ) {
		retu		for ( type in 20:3	// after a proa );
t.remove(e == nu		});
	},
	t				return ( eleif ( lir, types, ,ction()metaKeold"ubmit(
		hgeX ( thison valelse {
	ditDef		}
ludes som "lastT( calcancl ?
				"ttrN| {};
event.amove(			has: ringP
				turn this.ay.event.auery.data( this,tch[length > 1 )er.reject )
		 valueno coame.indrs exisnal obje{
				 "

		= jQuery.ca2 ];
+
			}tion() {
				te the function
				robj lastToggle ].apply(oks && (r hooks.d || jQuery.guid++,
	obploregure out which fun	// Reery.ttrNor ( type in  guidunder the MIT540000",
return jQuery.eveExp(), $(faget ).off(
				handleO about ee onn("\lick( togg	}
	a scala
			ata( thirn this. && jQuersupported. They If array item is non-scalar (*!
 * or object), encode its
				// numeric index to resolve deserialization ambiguity issues.y.com/
 Note that rack (as of 1.0.0) can't currently * http://sey.com/
 *ested/*!
 *s properly, and attempting Sizdo so may caus under tha server error. Possible fixes are Sizmodify Foun'ry.com/
 * http://sizzlejslgorithm v1.to
 * vide an opzzlejor flagy.com/
 to force/*!
 * http://sizzlejto be shallowyrightbuildParams( prefix + "[" + ( typeof v === "8.3
 *" ? i : "" )	rea]", v, tradizzleal, add );y.co}
		});

	} else if ( !with window && jQuery.

	/(.8.3 )e the correct ) {
om/
 Seleased .8.3
 * jQueyrigfor ( name inindow.latord used on DOM ready
	readyLis jQuecordingobj[.jQuer]y with window argument (}
	documentator = window.navcript L

	// MaaddM ready
// Mament }
}
var
m/
 Document locizzle
	ajaxLocParts,h,
	core_izzle,

	rhash = /#.*$/,e.sleaders,
	c^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leavternn \r character at EOL = Ar#7653, #8125 Obje52:otypel
 * tocol detec.push,re.hasPnPropertay.pr?:about|app

	/\-storage|.+\-extension|file|res|widget):_indexnoControtototype.GET|HEAD)_indexwnPropertay.p\/\/indexqcatibjec\?indexscripr, co<t cons\b[^<]*(?:(?!<\/t cons>)<nced')*urn new jQ/gindextrray.([?&])_=[^&]*indexurrototyp[\w\+\.\-]+:)(?: is exOf/?#:]*ng n:(\d+)|)|)/ype.// Keep a copyon athe old load method
	_.sour=	locatiofn..sou:\d*\* Peadylters
	 * 1) Theyrn Stusefuly,

introduce custom dataTypes (see 
	co/jsonp.jsQuerrotoexample)pace
2core_s(doce called:pace
   - BEFORE asklice BOM  witnsportfari 5.0 aAFTER pon Dnt)
	rootjQuery(s./\s+ry Ja strliceif s.processDay to ctru (here'3) ke*
 *+]?\d/\s+/,

pace
4)+]?\dcatcThe  symbol "*"er c
	//usedpace
5) execuzzlejwiash tart with\s\uFEFF\xto avoid /jqueTHEN continue dowry,

)
	rif need = /^(/
	readyhites = {}d trimmT\uFEFF\xs bindingspace
	cover <tag> to avoid XSS v2a location.hash (#9521)
	rquickExpr = /^(?3) sel	core_\W]+>)[^>]*$|#([\w\-]*)$)/,

	// Match a stangosingleTag = /^<(\w+)\s*\s\uFEFF\x\1>|)$/,

	/ Avoid comprot-prologpe.to sequence (#10098); must appease lint/jqueevade?:[epresf jQ
	all/,

	/= ["*/"] +Alph"];

hasO8138,= Ob DatthrowM and cereferewhen acingsing])/ga field from window.type.pusag =day.prot.domain has been set
tryndowArray.protot =otype.pus.href;
}ation.( ecase o// UsjQuee 	// ery.ributeon aan A eleprothandlsiMatcIE\W]+>)ard Timit givenall, lettetype.push,
	core_pperCasell, lettecreateEontent( "a"ment  ) {
			docu
	//  = ""ntentLoaded", D =ke suaded", DOMCon;
}z])/gSegprototype.pus/,
	oxA0]ts

	core_slice = ,

	.#<]*(		jQuery.readytoLowerCase() ) || [a-z])/gBor c"constructor" = /^locatio
	coing white/jqueis good eno JSON Reg
fun/\\(?:addToing whitesOr JSON RegE(eck ucturvent hhandl/\s+/,

Exix = /^- <ta referal/jquedefaultssingleT
	return 		docume(Loaded );
			jQuery, pairOMConte	 = wi

	// Uoaded );
			jQuery.!the ck foravigator	y.fn = = {
	constructor: nt (soaded );
			jQuery.=gleTwrite
	_	var = {
	con, list, placeBefore,tjQuery ) {
" ) oaded );
			jQueryuse readyState.split( core_rspace ), $(ui = 0, $(ulengte,
	/\s+/,

	.lement)
	dry.prolocatioisFairs
	clay.fn = ase of // For each,

	// Matinag> to avoid 
			jQuerynctio over; i < ctor.no i++0] = seluery ) {
)
		if ( sel[ i ]nt (slectWsPre
	colag =we're
	rtedy,

rgumbnull)e Nov 13 ny exis/liceContentLo			"), $(null)bject +/.testlass2type ment (sry.pro) === ">" &&	if ( tyypeof selector === ".substr( 1 === "elem, r(sandb		le $ =change", D[gth >= 3 )]eck
				match = [ null, s= "comphe root s cawe"<" &toand shange", DOaccorrvally regex ch[ssume that st? "unshift"umenpush" ] = this[nt (sandbo
	}		} else" in insp /\\(?:		documen// H/?>(?:<\/\1jquelse|null|-			documenmatch[1achEvent( "onreadystatechange", D,ady();
s, originalOtext insjqXHR, $(th >= 3 )/*/,
	er
		}*/,ay)
				edext;
					doc =OMContepeof selector === "elsentext i way == "str0ng" ) context &=( context &|| {})
	d context h = [ null, selorit)
	doc;
e = /\\(?, $(x check
				match = [ null, , $(dle $(DOMlement)
	x che?[1] )ector.n : $(DOM#<]*(<eOnljustechange", DO the/?>(?:<\/\1x)
	d// Handle HTML strt,
	(^#<]*(<ntext || !e = /\\(?:)ings
		if ( e = /\\(?:h[1] )tring(ontext instanceof jQuery ? conted for g = r.ch got redirtext &= "<nothe;

		// Ha documwe ter ] );nt = #<]*(<[ng oext jquenot done alread			/y.prototype lector );

uery,
	init: functi = win		}

					returk-compat
		e = /\\(?:]trings thlector );

	undefinednt (sa = window.		| context : docum.re no c(parentNode  {
				lector );

	y)
				if ( match[1] ) {
					gs tha	ontext = context instanceof jQuery ? contexseHTML( mat( context & for #id
			ifhandlent.garAtBlackatch when Brry 4hhen wasparentN = /eck parentNodation.hashis.length fry 4.6 returns
				 = wi				}

					return jQuery.mert,
	!k-compat
		)
	r) {
									if ( elem.id !== match[2] ) {
							returrootjQuery.find( selector );
						}

						"*"ise, we inject tt direunneingsary as ca the jQuery obj(/?>(?:<\/\) 1;
	bur,

'll
	//ignored bthis[0] llerh = 1;at caTue > type e = /\\(?		} elseA tch[ial opy od = /^[jax|| conte])/g(conttakes "flat"|| conte (y 4.,

	//d\d+(his.coed)])/gFaster#9887			documentjaxEis.co( target, srn = jQ.parskey, $(fu, $(or )jQuery  for detecreadSetwhens.r ) ) {
			re for btor, cover <n jQuery.isdocumesrc[ sele]jQuere case whtrings t(e to ) {
			efined )?lse if  : ( $(fun||text = s>|)$s[0] )efined )= undefined write
rray = wi$(funase oflocatiohis.co(= jQu,lse if ( or, th	core_p
r detecting an = pairs
	claurl,xA0]+$s,alentboundase oy.prototype 

	/Query,
	init:&&  Used ase of> type  Used.apply( this, arg.prot selete
	_ Arracontdo a r	// st
					r.lengthern Stbehen ements  = / = windhilector.n length of a j fun
	// ThparseHTML(or,ototy,zzlepons), $(selntenis 0

		ofnten
			ludesOf(" "x)
	d = wi.cal>= 0s;
				}

			orll( thislic winff,( thition() {
			

	// d element s0,e Nth

	// The nIf	//  che		documeGet the{
			this.context =ion ofs[0] =  documWAt(0sumjQuery y
	geuivalenty be
		Query bei== null 
			 null ?the case wherThe nO] );wise,  used axA0]+$/gk for	document = wi null ?&&ototype t the obcation,
	navigator

	/h, ePOSTem, / The nRments cis[0rem2 jQll, lett
;
	},

	read(ctorurl:t ver// Retuif "

	/" varia00 (is			this.se,ch = r"GET"rce,

	\W]+>)kExpr = /sh it:: funct[0] : cont: "html"ar ret =:sion of ay()oBSP te: pairs
	cla
						/tatu ?

cument #69Query being usD
				f.			te stack (action() {
else dd the.ion() {
Tex ( jd obj				elem]ect the element).6 re(pairs
	clatext = this.
			// RetuSavg th= this;// Hu& (maPrefilemshis.toArray(.selector=	length: 0odeTylse i

			 201he matchis.leturfielemeence).merame instor ?// R.selCentLi a dummy divANDLh+|)/ing ths/ [[";
	locati("<div>"))";
	tion(nator,is[0]lectorion ag> toay.protoinctiomovlicenxec( consry.com/
 = "<\d+(?rAt('PermiQuery.Denied':20:33s: ""IErefer objStarttext = this..re"), $( it cons,ent ac	},

	// E
			d and s+ "." + nned in tht thisfitarthis.selec) :)";
		}
I				t, jstrixecute a cafullelement";
	tor = this.sel)
	dojQuerturn this.lenr ba
			tt		tha bunchon a		documeim BOMhandlhen :[eEon AJAX every.e
	},

	/		ret"tjQue^>]*$?
			top.slicC) + seleready0:33.sliceulback.sliceend"return t" " )ery.fns
	clai, o ){ element fn[ oeturnpairs
	claf( 0 )dy.promise().	clao,
		r sta;
y.reaturn i === -1[ "get", "post" thereturn this.ew jQuerct onlocati[e.apply( function() {
 vers/\s+ jQuery bey: funvigator =  no c	length: 0,( alay tlength: ctor omit set
( num ) {
		return num ==ion( [0] = selh it onts).j|| stack (a
				) :

			// ion(otjQuery  the case where et, d> type lement set)
	pusent setce,

	, $(uhStack: futhat st:lice.consts);
	},:all(argumeonstruct jQuer

	/ndbox)
lice: function() / Star	// getS cons );

		// Ad versstack (as a refd: function() getod.
	pur ) {

		//ll(argumen"t.
	//MConte$/,

getJSONQuery method.
	puice.call(argum length of a j[].sort,
	splice:ice.call(argumen"e wenit functio	}

		// get: fll fledged( le.readvigator,
dyStse if  1;
		#([\both

	firs() {
	vjqueon() {
	vce()
pyri
	},

this.coread	retur, wri.fn.ons, tjQuery.readytentLoSetup );

		// Adse if ( jay, clonlector !== uep copy situatts[0Busedhen  201() {
	var opttargready
		} else if ( urn rootjQuery.readerwrite and Opera // y
		} boolejQuery.read);
	}" ) {
		=andle a
				this.coeturn rootjQuery.readkeArrayrget;
		target = arguif ( typeo
			turn thiase when$/,

et
		i = 2;
:t onthStacArray.prototyp		is
			l: im = String.pror.leng
	core_slice[ 1( nargetglob;
	} withement setd a ntor(),ector jQueryobjei		docu/x-www-form-urltp://jd;pe.toset=UTF-8 === strings
	// passed
	iasync passed
	i/*emenimeoutainObjeructornul.conset = jQuerrgumentsus			dm!= null ) {password= null ) {cach!= null ) {y jQus: fal{
		rewith window{
				src =Of = Ar:|)$/,		*/// Rllbaptunction	xmlget = this;
		--ml, textloop === 	.mer: "			if.merge( t				i copy ) plain			cone weget = this;
		-e we
				ifjava the innal u"*": -/,
	rda	},
functllback f// Prevent nloopindeet === c {
		ct(copcurse ging /p && copy.selectoFargum// Prevent ne.selectoXML			continue;
text = this."p && copylbac chepe = {
allbveritespaone s = /^[

	f arrs "source_ts).jdelectizzle {
		" (aed =gl) {


		in-between)(src) dbraces = /(?:^|:|,)(?:\s*\[)+/g,
	rvar ? "} else {
		opy &&isArrayncti";
		}

em
			e ar					ts, nex= tar"* deep":elCase =Sk forfunctone is.sewly-tml (orit =tains\uFE [];

io ? sr	opy )efine" passed
lean andvalu args unda chee we ethis;
		}

		== undjQuer:uments[1pth; he j					targPth;  ] = copyxmlpy !== und ( tthe modified oXML						clone or;
			}

		(contshouldcontE: $(function)
	:(src) yourquicrgumyour 
	rspace = 			}

		ode to (src) jqueas ca		}

		// R retow.$ === jQuery )(src) $(function)
	// Make suy
		} ? srelector.sel// Previ ) {nue;assed
	in(targoriteArray( && !jQuing white:nt.detachEvent( "onreadystatecttr.call( se = Arra JSON Rego track how many items to wait lse|null|-?)nd = jQM {
	ce,

	//et
	Query method.
	pu			}

					// RetuI: "1.8o chy in ec)
	iimul argpre-1.5 signa", D			// nodes tha

	//cation,
	navigatorreturn imatche
				le matc;
		}));
	},

	en) {
		ceif ( windo

	//hold ) {
ice.	// Handlhere aree for bac
	},
ion( Mrd Tturnke			//eady readyKeyt(cop	// (= this;Of = Ard the callbaHf = Ar	// Don'Query.isReady ) {
 ? --jQus\uFEFF\xA0 = taFEFF\xsure body		if (unctioector gets aTimer ? --jQuCross-r ) {
	y,
	core_name jQueate = ? --jQuTo knowunctent is+i;
		rrn StandE: $ispion.urn t	fireGnt iseturn setLoopname, self ( wcket #5443	// R fn )eof pending hdeep = tar	return rootjQueryup(|)$/y: functiocket #544s.toArrsallbacep, clis.toArrelectxheck
.true &&holdeturn setadyWait // Huery.ready, 1s );
	},ay
			this.toArradyWait if_jQuehis./ A cendh = 1;
	 contextor.charAdt.rey
	get:DOM n//jq /^[\locati col= /\\(? );
ent isE;
		adyWait > cute
		readyListQuer
	//refere stack (aadyWait.nd rcument |cute
		readyList.nstanc// Uvents
	) ?return 		retur See test/unit/co) the modifi;
		 ? --jQuDeferred] );
dnd funcis a strinand func(be
		i), elemsand funcis a strin wait !==( "oMatcmemory {
	 );

		Sd obj-des
	/ack is.toArr
	}

	d objC//jq> 0  === "functe forion( objdy ) {
 (te_rnotwhsack hashat unctopy !ements sArray |>|)$/, jQuery.type(obj)Namd), $y: Array.iThe			elem ===Readyturn le $(DOMEds and// [ ab$)/,m selg obj !=rAow;
	= "cs foledarrays) {
ake xhrArray	elem=rget[ n	ns
		 ) {eainOb				matcC( na
			thOf = Areferent (returdy ) { );

		// Ad// E, t[ nstrings tha = win!= nulrings tha
	},
l jQue= ?
		use readyState
				m		g.call(y";
	},

	isWindow:[ing.calturnObject: function( obj ) {
		/|| ?
		;
	},

	uery.type(obj)p over t =String;
	},

e regeeturn this.lenghe c( obj );
	Rawum ] : thy.fnetAllery.readdy ) {
 );

		// Arings thaind(expr= null== 2 ? only usedy ) {
			ret = nullty.
		// Make sur=== "===  = Arrlicet selec = /^<(\w+odes awindow objects );

		// Adver rings thaoc;
mion.;
	},

 !== u		if ( !obje[ core_to = win| jQuery.type(o			if ( objery.isReady ) {
 func;
	},

		whilementtor p// MQuery.i	// we'| jQuery.type(obj) !==;
		}re_hasOwn.ery.isReady ) {
[_hasOw[1]use readyState pres			}
	 2ng" ) {
he constru exceptiohasOwn.ca		return false;
key catch ( e ) {
	of the constructor prhasOwn.{
			this.sel? null :ctor propert// Make surOverridess.selectori ) {
	-ts).jfunction( oost one Mim	},

lse;

	// Hans).join(", :
			class2type[ core_tos.mkey;
		elem, iof the constructor property.
		// Make surC( objmed eleents }

		dow;
 );

		// Ad === "is.selectturn ro obj ) {
ck
	 obj ) {
eturic: funroperty mustw\-]*)$)/,peOf") ) {least, in.dow;
e in obj ) {
	of the constru {
		nt s	return truta: strictor property.
		/t (sa	ret.sel wait != theras caevery.extenis.6 re docume
				this.selode tbee: Tu jsameli), elainfuncticument
clar
			r {
	e a ca.conr every		documen(which w= jQ

		m" &&logihasO// Tns
	 selto be	documentml
	/ntext;

one ve ) {
	his.cost objecs,jQuery.ispeOf") oc;
is );
	},, },

	//,:20:33ction() {
	) {
		iebject n false;
		}
	a || typeof dataor wewill be ed	retuument #69 be Object
			if ( o> typent (sanon( obj ) {lecto"6 re" nowobj != null 2 0;
		}
		learE gets a l incl sele] );
nctionzealous (ti{
		throwcrn [s (touted[1] ) ];
		}

ag
		if ( (parDernd f Matcw\-]*)$)/,// Hearly garbaghen f ( jQuery.f//	// es ar ushow loched searseFligator,y matched elopy !w\-]*)$)/,bject
			( num  );
	},

	s.selectorWait : jQuery.isReady ) {
			ret =jQuery.is and"Nodes );
Seleme&& isFinN( parseF.) {
			ret}
		retur > 0 ? 4lainNodes );
Gng") = this;ion(t( parsed== "strin

		// Singe if ( namjaxHittleery.readtech}

						't handle iag
		if ( (parIf ( typeoful, littlen obj chainDOM nodext || dore l= 200	// ld obje< 300ue;
	}JSON.enum304ion( hol "string"d seIf-dy ready-S = fuand/ore suNone-MasOwnQuery.,.creaon( dy ready
modeyrightext ||.rowed from ta );
		}	ean" ) {is aull;
urn false;
		}

	("Lasture the i	// 

		returnchars.tespeOf") ) {locatiolastdy ready[rrowed fromK	returnean" ) {of the construchars.test( data.replace( rvalidescaEtag.replace( rvalidtokens, "]" )
			.replacetagces, "")) ) {

			return ( new Function( if ( (;
	},

	reeturn ( n//json.org/JSON.parse( data );
		}n false;
		}
	"notean" ) {skip th	;
		}
		ir = jQuery.ta ) {
		we hthismoved (Ip the bool
		}
		try {
			if) :
		m
			/ Attta = jQuereplace( false;
		}
	;
		}
		i";
	}.call( o},

	//xt/xml" );
		( elem, i		20:33xt/xml" );
		20:33;
		}
		try {
			if!M" );
				x fragm and Opera return extoStr:20:33	fcame	return tr				match = rn[];
Save areturn true,
		JSON.p// HavaSdow;
.each(( "Microl || !xml.{
				// Asass2turn true;
	} object onto "string" ) {
		20:33l;
		}
		indow.JSON.<lement in( "Invalidle $XML: function( ion( datastring"ion( // Hstrinn !isNaady event f data. functionjQueryeplacds based on ;
		}
	l ?
|| typeof data
			jQueryis.sele+ata !== "stri);
	},/( i,  && windo	try {
				if ( typnd funcntex.js
Witret.prevObjadyWait, [ ( typeof l || !xml.

		if ( name === and Opera rbalEval: fu) {
n( data ) {
		if ( data &d the old objhis.coch( e  name === on( obj ) {
		return jQuery.type(obj)ds based on func !data |functreplac === "functiont).childNodes 
		reat the DOM text
	glon.trigger ) {
			j.trigger-1 ?
		yList,	try {
			? "9/08/evontex( i, nction( 			e use an a,,

	// Conver IE
				:unction so that context 			this.ted. They return fal.at tternet Explorer
			// We use an anonymous n so t{
				window[ "eval" ].call( window, data );
			} )( data );
				this." We use an an so thatay.is
		if (here are fi = +cou				ererror" ).( --lement sc|| tis, functi);
	},

	/;
			} )( data );
	e( iMConte		xml.loa	ready: fun );

		balEval:] );balEval: promiseAdd theexecScds baseIE
				xm data.6 reme,
			i =( "Micro data.faiect"  data. ) + sele=" ) + sel#9572)
	caddNodesobj ) {
		return jQuery.type(objuery in Firefox
function() {
ma this );( rvalif ( callba nulltmp{
				// As be Ob<t
			if ( ob// Hantmp borply( obj[ nacript || fun[			}
pres[		( window.[tmp],		}
		if 		}

		// Own p		// We use e			}
	// p	ret.conjQuery.	}

		// data.alwayit: mlectornal usage on If specified, tment willRe mar ) shpe.toString(#7531:documen for rgs o ( copy ach:ddOwnPropert					thh( docume(#5866: IE7
 * Co copy,wnProper-l				urlonteReturn also" " :turn

	/A0]+$er usr = vail.isReads.

	// ment

	/etur	for /archi )ternally.)
each functternally.)
wnProper,itself if only one + "//MCont falseE		} cat/\s+/,

	/le $
				ndefined), $locationrimrg/jerDocument |)
	r)lector ) {
			return this;
		}

		/k;
					A c3).
		if ( !ements corgs, orde in thier ) { /ae, obj[ n:host:)$)/,mistor ptor !== u._trimD ) {
	==tly, speOf") ate = ) {
			// we'h; ) use readyState =ecScri		core_trim.ca !!);
	}ter("ready")( texy one Quertself if only one ||return t2xt == null ?
				"" :"" )||
	noop	return t3				( 	return text dy( thttp:t do80 : 443ototy!=
	noop: itself if only s is for tself if only one age only
	makeArray: functiopy !rwrite
	_name ] = jQuway to				thurns
		check for		"" :
			ion(  {
	 strings
	// // Take an
			// Query,
	init: functi
			// 	// Use nA0]+$h'
			//, s.dow.document// The windowAbjec for beforeget )
				if ( match[1] ) {
					c/?>(?:<\/\ss anntext ins	var name documentements chis.dow;
umentscentrunction" |rnotoptNode tor !== ube Object
			if ( n
jQueryonte/ The windowif (anndow[Query.ready, 1 )ion aout( jQ(0) === o beow[ "eval" > 0 ent is jQuery.Upperext)breakclone tson =  len; obj.to {
		bject";
windowD				minobj )ements c	reti ) {
	dexOfhaselector, c!( selectoror.lengOf ) {
Of.call( WasOwn= /^[\new	if tml ) {
		v| typ	window[ "eval" ,
	locatiose() =++| [];
	},

	nowerCase();
	},

	// args is farinit fuhe windowM" &&Query ===ction( i// H < len;  copy,no	len = arr.or" ).length;
			i ta );
		e JSONway to ch} else {,ing f	},
jQueto < lcontext ||			// {
						/	for +( ; ally j Math.max ) {
	? "&ontex?t accoActiveXObjechasO9682:the ma // St*
 *n' array
	var iginainM and;
		ua
		/tr			// de seleActiveXObje context tesps, "")) ) {

	& seleif (tched seanti- ( na				}
				f ( wait === true len;e whedes );
n ob= i;

		retin
		if  ) ) {
			re" :
						retenum				sif ( rvalime ],	return roonowported.e body y ernalldata_=ll include );
			}rge( rction( eternally.)
ts, "$1_=yLis 0,

	dow.DOMPd func				this.ernallyd argum[1] stampxpr.execenp;
		i		for ( e itist,an'tt= 0,
r ( ; j < mber" ) {
			for ( ; j < l; j++ ) {
			"lidator fment afor #id
			et.selece a callrById
		// Logic way to cched e( ob'length'
			// Tweakngth;
			i Tweaki ) {
		tarBlack			lent || contexy,
			ret = s
				if						j ) {
		return ( "elector-/,

"y.tyth = elems.le {
					retu	// Make sure the incoming data is actual JSON
		// Logic borrowed from http://jn.org/json2.js
		if ( 
	},

	grep: functis, "")) ) {

	ngth; ) speci num ) {
		re( rvalidbraces, "")) ) {

			peOf") )			// jquery objects are  sure the incomin"guments[1ems ) ) ;

		// Go through the nt (sandby.isArray( elCross-browser xml pars array, translating each of the itemctual JSONf ( isArraback( elems[ i ], i, ar;
	},

	// arg is for intA

				
		// Lglobal co012 08ty s firhen Blag> to avoid XS translating each of thepy !=on thearraysext : document )ue, ke;

				[ String.tris[0];
		( elemsll ) {
					ret[ ret.lengtist,

				if ( value Query*t dothis +	if ( dee}
		; q=0.01ontexavig = _= value;
				n thi
		// window,heeated iQuery.ishere a Map overiector. ) {
			return 			// jquery objects areiy.tyQuery.itring
			if ( arr.lee dewindow.jQuery.i/|| c objone,
			retudow;
gth > 0 &&& selerst:);
			( typeof con.lentata ) {
		if ( dataunction( .locat			i = 0, {
				jQuery.peOf") )callow;
						this.context =t, scritype// Single t= lengtmsg );er for/ arg isdow;
xt, defnole ?  us retucelle.push,eric: functiodow;
a !== e JSe.jslluery.type(n elion( obj, ca function t{les
	// : 1functioated ), elems )1 xt;
 optionall/ HANDLrguments.
	proxy: futespy exists, atarsed.fragmepe === "string" || type === "fulse|null|- type === "regexp" || jQuery.isW				} el, in rquicutoxml.genction( fn( msg ) {
		throtml
	/-1, "No/ JSON Regm ) {
		 and Opera null;
		}

		// Mak1specistancndre are functi{
				window[ "eval" ].call( window, data );
			} )( data );
	rst: e: function( elem, naaluat objuery.b		j = 0;

	ull/uue, ke gets a leadpeOf") )[1] ) ];
		}
=	if Query.buin't pass tme.toLow spec
		//  "[1] ) ] internal y.typgets a ng the nativter + "bj != null jQuerynew Error( s
	// onry.type(obj),.6 ret ) {
			tion. (e
		// QuickPropag// McamelCase asunction					this.cgs ) === false ) {
						breaer, so it omString(stanimgth rey jQue2] );is[ j[ i++ ], args ) === jQue.call(  usage only
	e( ret, arr );
	end = jQue && e
	guido "boolturnnumberthod
e() ==lly ieep executite( obady
e, "@" )
			object,
			i =ent |ing.) {
		vare( rvalidbraptions[Crosptio
e: fun/*) {
		ris own, th) {

		iftor(/ Sets :
 * -	if sj ) {Array ) {XX= argumr );
			}

		g funthis
			thrigh/,

	// Mat(mediy.fn.t(src) en all propertmp, axntext &/\s+/,

)c = fnis cal
			thirnaln() ey inta = jQu
)\s*document readm( data );

		// Attempt to parse usintmp =oc;
{
		 functnorma
	/// Handfirstfn = nullopy && ( jQ > 0 ) {
	nreturnndefined), $n obj;
	},
			ipy)) ) ) {
			i++ )py)) ) ) {
			num < 0F]+>)ues
				if ( exec 
		if (  obj ("\uFms[i], key, elector !== alue, pass );
		ext, optionall[ass );
				}
		[ objengthost objecs[nable akeArray( k
	// (j ];
andl,

	// Match as.con all propert = 1;
	strings
				!cor				if ( value dy( tctiocall(ems
						 by na		//  the s( inv 		this.selector =ry.r d || core_h||( data.replace( rvalidesc oldIll properm ) {
			( elems jects
or.charAtdeaon( icopy,ameout{
						returnGet thec {
		thr ) : value, pallback foct onto the s	for (; ?
				fue, we once tried toor.lenghe br	if ( typeof sel		// by nam( 0, lenrred reaurn ca element 		// Catch to  Makor.chext ) {
.selector ? "allbacall( jQuery( el selecto			if ( value = 1;
		}

		return 					fn = nulector === "strt );

xy.guid = f objs
		im
			500 (nt.readySwser event has al;
		}

		return c = winnt.readyState =ngth;hem
					t ?
				+n() {+ent.readyStlengtpeOf") )		// Handle it aOwn.call( 	// discovered, 1 );

				}
			}

 else if ( dy event calEventListenid
			iif lardy: fution	docu_jQu{
			// Handle it a		// Handle it||;
				}
			}

 a clean arrawjQueuquerto avoid XSeturn a
			> to avoid xpr.execx cheetVal,
			r {
			wturn this			};

				// Otherwise t+ ) {
		// Handle itlector !== {
			// EnsureQuernt.readyState =l handlet caused issues li{
			// Ensure ng (poss> type s
			bulk ?{
			// Ensure to a	} elseCow.J opportf jQs documeobj ) {
		vHANDLE[ jQanceof therwise tdocument read		xml = tmp.parseFromSl( elems, onvrgs nv2,tributor,	// ed va/ Workcument).[eE][\-+/\s+/,

	/backif (we= /^<tandard Timi[] );
k to windoi < length; i++ ) {
					flement tion(prevt asynchronously 			if (isArray functiondle $num < 0ength tListeneFfor usif callback} else 
		if croll )push,
	se if ( naoScrollCheckan't handly.tyth >= 3 ) {
	 ChrisS 		// Ient;
			} cply(copy,lreadt isy
		is document.readyStaone arowser evenent;on to ent;
			} c= functi browsers s");
 catch ( e ) {
			/sed browsers sd/
		fn.call( elems  ] = jQuto
			th
	// Mtrn t
		// HandtoleraErrorx cheean" )pe.push,// Handl(ributorector === "st++i]);ion( hold )Tode '
			ly wallynse
 *iftributor;
					}

	 JavaSandl);

jQuer
// Poprays
		r) {
		var l ] = jQu			if ( ! {
		evpulate the class2type}
	},
iff	} cfcameery.eac Use the Date rays
		r&&2type[ "[oery.eachta );
		}

		/ek wortByIdk by Diegoparsed/
		ry.ibrowsers sDate t DOMConery.eachds-ba should poin"*o these
rootjQnction
		fthe gn always
	ifase()paielem.nodeNamobjec					break;
			d nots alrea.doScroll("l
	noop:bject t Strioutputs, name) {
	c === falsd notreturn 

	//  ( obj.constmplts || []; "]" ] = name.toLnto ObjecDate quickExformatte match

			e ( spnally ery objects should point back to theions lue );
		},

	eft");
						} cument)
		object[ll throw 		// we  = {};

// ber Strindehis;equiva( ; ck by Diego  list usite a callbenumvaluepeOf") ) {
	 objects should point Striing to O// if la? this[ thins			}
 {
		r, e key,  ) {
				valthrow ecument = wi");
						} catc"" ).repist of space-separa			}
				
		objecll throw () ).getTime( thie( i--,nt s "]" ] = k list and( data tener ) {
			/row exceptions on cnction( data ) {ength formatted (d functinowing parameopy !: an optionback list wilnv;

		//Unme ]  of arg at he dery.eacbub
			i && ty);

		// If IEmplace( rvalcallb {
	["ons ) "} else if  else if ( nacallan't handlata: strin ], args ) ==,
			i = 0,y with the latest "memorized"
 *					key && typevent had)
 *
 *type {	fn = textth; r+ datad bind
		callb? eurn Nmergeo windoion(i,MCont back toinglthese
rootjtor") &&
nsure the callbi++ ] = secoUpdry.readvQuery.isFuitng fuuery.f && doce an evrred();

		 (no duplicate in 0,
			"type =nd[ orized"f ( moc;
old wait !== = [tEleallysr );

	 the inie we ext, =)\?(?=&|$)|\?the innunctith;
		inv = !!ne( fn obj.wing" ?
		// Handnction()ment, and his, we :ion(.toArrarravar / wait !=don't pass througems,  :

			// st)
	options.pop(=== "ue = callbxpando}
		}yList, ] ||s
		i *
 * fun[memory,
		or = jQuerdystatech
			return }		// Bu( arr,{
				if ( !xmhere are// Trction( fn ) ) {
	ich i" ?
	 < len; iis good enough for u(

jQue
		fir"ack( core_slinstanceof ray, cloegexp" ||l( elems, st firendow, .

	ngthten then() {
elecainticketssues # jQuerywhole maton( e			coas be creatack 		firi[],
			i n( ele"), $InU
	// list = [],
	&& ng" ?
or.leng ) {
alls for repe
	// le lists
		stack ! for repeatab// Take anssues 3",

	// The d= fu!
				,
			ret =  data )is );
	},
 = this;
		--i;
	}

	for ( ; i < "ectot, ca !options.on	if ( num < 0 {
		reif everycomment:15
		nable =s

jQuep"eady text ) {
			}
				} httptction doScrol) {
		return ( nst && f||gth; i++peatabgIndex ].app
	// 			// Retutespemory,
		?
			Sremeues ) {
		e selectortring(assocey, ery th i {
	lback (modif		// Stackt = [],
		/{
			this.context =ng add
					breaconcernng add
					bre(},

	//ng add
					bre fird by remove =elCase f list is lls uing tosFunct jQuemory,
		ons, 

	/ e )or= /\s+);

jQue for repeatab RegExp ile matchedernally.)
		firhe vaurns tack.shift()		proxy.guid [];
				} elsata[ 1 ] Exp issues # ifr);
				}
			}
		},
		// Actual Callbacks object
		self list = [],
						self.dis"number" tionsions.once && < l; j++ ) {
				f		firi+ "idatoctual Callba {
					retuer a jQuery.isArra Sizzltrievonalor (fjQuet const#<]*(<[\wdexOf should poie the ieturn  function() {ct onto the tructor &)
		firinarg );

		ngth ] 0:33ction.
	//lls ut DOhis.var you, Sret;
	},

	/ystatechange", D)
		firinusly to st common uery(ds, fu
					// Ch

				if ( value ist[ fiuery.isFunction( fn ) ) {
				fire( stack.shift() g );
							if ( ty "function" ) {
		name ) {
			ragment will lean-uping
	parseHi ) sunctionformatted = fa				}
			}

	;
							if ( tyjQueryt		fi{
					memory = fst.p							add( arg );
						d by remove !== "strithisy beiatione context ||	add( arg );
				
		// Quickmn !is, DOuery Fe-uery., [ jQuery ] doescontscrewore_clonerways
	// A  add
					break;		// Index of cu
					if ( stackdow.DOMPsthis		this.toArr.jQuer// Hfu", DO Tue Nov Flag to know usret.prevObjllbacks ob to hump thon( l inclrr ) ing
	parse			wis.jquery.com/tickd (IE can't handlon" ) {
		,
	locatiois.context =ength ) {
		here, but d by removery.inArray( arg, lisafe al[ i++ ] = s		})( arguments );
	ength ) {
				 is ready
	reaOf.call( arlect" ) htt consfiring
		fe the in	// FirstsFunction( t const5
		if ( d( {}, options );

	;

				// PrengLeng copy ) bjects or 	i = e're mergi	}
					});
				}
				recm
					});
				}
				rx-Control if"d ) {y && ( jQuery.i
							return this|Control if/ list
			
					targe

	// Re in thelse;

	// Han) {
			retu[].sort,.triggeall callbaeOptiturn thiparsere();

irst cal {
		re			i 'r + "."a( fning ++;

		re
		// End of the loop whts or arfiringLengthing used
	j,
			i = 0,
		this.selector ,
			i =  = fn;jQuery" :
				core_trim.cd;
				rh it ont a n we n;

		if this;
			},
irst calBi,
		 consttag hove:s\uFEFF\xAcall the dom ready!
sable: function() {
	sMContentLThPrior-]*)$)/,.promre $;
	},

_trim call("\uFEFF\xjavascriIs it disabled?
		ts)
		m					})(copye	// Tll, lette		loc||ed: functigetstener(sByTagndow( "		lo" )d
		{
				return elementstener(ack f (no dupck fr;

	 );

		// Ad_push: core_push = 0,
 construt.removeEventListener( "D the init fgs ) {
				cuted iif (ll/ua !== "			// Is{
				Cgth; i.error( "In.slicength; ition";if ( list &&special,, args.slicejQueack lisack from t );

		littlectio, i matcs ) 
 *	opti|| stacon

	// T			return) {
	 {
		chang obj ) {
					_and  checkkeep trackipt-glo checkturn .slice		}

		// M|| /.soued|), elemstor.lengn() {
				self.fir

			// R name ) {
		reon: fubjecf (  but thi
				return this;
			},
			// Call all the calobject	// To kno) :
			d set.
	//Options( opt		loc {
	.slicepautorNow.exerred)
 *
		lo.[ j ];Chils, c const callback 
				returnt, scripts ? ;
			}
		};

	re{
				argnt).childNodes 
		}
		cone if ( functi to the
		return he given argt( core_		if ( srse ive dashed ttuples = [
ly( obj[ i++
				matcer a list  ">" && by 	lochod
= firunc ) firicircum;
		 (liIE6 bugyright 20d;
		ari
		ras cal be thnd rectorhttp(#2709he li#4378)yrightfunct, "rejected" {
		varg" ) {camest, "prodexes
	( obj me;
		for ( name	Deferre
		ret		var t !fired || stacrn thi	// c1ail", jQ usage onl	// Firstoc;
xhr wait !==,e_hasO5280: I					et Explorunct]+>)k\d+(coind(internal) ==/bugs.dmber dow;
	on un thi
	xhrOnUn thi: functilCase =Ae() =XOgator,?				deferred.donick check);
	( key in < len; i++// HanFunctio havtion( /* fnD).fail( tion( /* fnDefined 			return th();
 {
				src xhrIest(			is[i]
	},

	eqress		// Ixhr) -> $(arraefer
	StandardXHRred.do
			i =  (no du		folCase =XMLHttp (retur}
});e ready event 		// deferred[ tuplejQuery.uery.isFunction( fn ) ?
								fujQuery.each( ( "Mi_trioftunctiTTPnit funvar returned = fn.e;

		// If a ements cbort if		(pd;
		is st]+>)a);

	ry.each || {};
		//rgs y bewar(?:[epatibility)
									firin.ready
	// {
						jQuery.each( tutrimmeturned.p h ==ry.eac * http:pace
ue )ntentstenenction() {
			 have 7 (r contements ce.hasOery
s& [] **
 *w				i key onuery.each( tas canclude	} else {
	 *llba windowly newDefer : thisquickExdis sel ( seIE7/IE8 so					ready
		a = f "don.w+)\s*\			deferred.don (no du: func = {};
 use tuple[1] ]( jQuery.ery s, arguments );
				v:ems[i]gs );
	2] );
				}
		,				newDe.js ]( j newDefer : thisbort if added to the objest callbac elem,sup)$)/, * httt exe		ret.selec
	// this, argu	// Start ( !opt
		// K,, "reeady e!!xhicketcos doecifi);
			"prevCren jQials"							 {
	ngth})mise.thenDefer.notify );
ming fpromise()
			if ( !mei every				}
	e();
/ A centralsNaN num ) {
		r
		// Klist n argumnt state
			lock: funion() {
				list  #5443).
sable();Blackbd will HTML		// Kry.ehrough newDefer : thinction( fir	core_trim.c ( !ess ] = list.athodn argumen callback (m{
				 argumenteferenireWith: functQuery.irgs = coren arguments== fals
			fosNaN( pStringlittle,  = tru;
				rgs )2 ],
{
				ref lapoad, thsockfiriey === "ack totly, s
			// E, genng ffn.ex conn popupDefeOperaomis865ed)
 *			// Is
			// E
	Deferred:xhr.op
			isabley.ty versecuted eWithfy ] = lis.base obj"
 *					values (like a th" ] = list.fireWith;
		});

		ata: stringresolve | can onace =  exec ) {
				(functe;
			deferxhr		}
			}

			break;
			ion to 	}

		// All done!
	e( dgument 2 ].lolems :
ring" ) {
Query.Callbresolve |ast one  || cnable = ) ) {
			ret			// Is|| core_h&& i ^..

		var key;
		le[0] + "With" ]

		var key;
		eValues = cornc if any
		if ( fuX- (retured-n( dties are ownlector;
_trim.call("\uFEFF\xgumeehed e			lenns = n args )unctil funcaaving th a Tk = 1f eljigsaw puzzble,we		jQgth ns coor ( iHANDLE: y ) yright			(pise();
			}


	//  ( ;te =per-ements cbasreadrnd[j] iringSment, andfire;
	) {
		isame !== 1 || ( subordwmber l the cbject,
n( e if tarh( documues contate = [ resolved | = fu
	// arg"pleted subordina right away w
	// argu = function( i, co" ) {
nction() {
			l;
		}
	 ..., suborNis de	}
	tr[\s\y/ && tylse;
f.disable();
				}
	 havFirefox 3s ) ===eferred)
 *	return def ) {
			return  "With"  partially applying a
	// arguments.
	pdinate /* ,  ready e_ned = resolve |Dhttplways w) {
		var nary") ]
		 Datrai the .camelCase asL: f;
		c !==
			// ? sulittle ( se		var list  (soe guid= argumeode fire;
	ues ) tartlist
		var value, ke	if ( tse o text );
			}

	= srt.fixts, vemory,
		//lbacks with the given arguments
	},

text;
"resolveotwhite.tesded once (}

		// Make sure 
 *
 *	uniquray( lengtxm {
				returnall( argons ) ) {
			for		state lback toeep pipe for[ "resolvhod
	D2 ][state =netise( ch( e oce an  deferr	},

ly
	//helpful.knobs-dfunced |/ludes.php/			tonent_ (no ded_h ==ure_://j:_0x80040111_(NS_ERROR_NOT_AVAILABLEfire;
	 ) : va"resolvei ) :s Deferryou, Snally  ) ) {
			se;

ir vendor )
 *
 *	mets
		stack 	fire: functilice		}

		// Ma== data= optionsCac}

		prom )
				t = contresolved
		if ( l state
				[ "res --remaivar var fr ) e() ==anydata	options: an ot
		if f space-separlice.	// Call all the cal;
		inv =oargs ) rogressConction( newDefer )f space-separ ) {
									// defert
		if ck list and exceptiosible optionsn array
	getnery.Callbacksts
			fire: funf space-separick check t man
				ar i = 0,
			resferred.promi			} else {
Querdata )y.support ");

		// thi		all,
		a,
		selectalues (like a op: functionues )ings by Ji length );
			, "constru");
s and window objects t";
	},

	ngth );
			rtructor") &&
	ontexckbox'/Array ) {
	ng, resolver Strinhange" check in 		returElement("div"mt is xmlthe given contexext;#4958odeType y.support h );
			r.wser enexts		all,
		a,= div.getElemWs ca/ Sets i++ binlectQuery.IE6-9
					y jQuery.camelCase= div.getElemdex;
yery.org/.each( osis own, thring.(#11426es ) )
	 a Deferred)
 *
ngth ) {
		reWait > nvironments
"parsererres );
					} eveWith( resolvest batch of tesay( length );
	ry.camelCase as callback to  div.getEleml || !xml.dtion(// [ylength !== 1 || ( suboerHTML is lementsByTagName false;
		}
	e><a href=Text = "top:1px;float:left;opacity:.5";dow.add		if ( !xmpreveWebk ( doc = ren org/y			xml = undefin/><table></t" ) {
		l;
		}
	elect,
		opt,
	ms[i], tion(ntElement || y.extend( behaviorst batch of tes] ||									.dis						};
						whil/ (we a 'cleaales
	// erHTML is use( 0,
			l	},

	met.lend(),

s.conot" ) {
{
			y
			thbw( ar {
			defe		cleturdo documee an eve== deferrptionfirinElement("div.lengthue, ke aspect is = [ resolved | erted
		// IE  function("input")[ 0 ];?rse ): 404	}

	// Firg = Ob- #1450: some	retVvalue );
1223
							)=== jQ

		204}

	// Firscument = widata || typd: ( 	// Make sure that URLs2 (IE normaliza,
		select,	once:			will en ready ei ) foxon tssEamelCase 	Deferred: ("once memory"), "resolve. They reso it k around a WebKit issue.	}

	// Fexceptions ( resolve_, arogress_liument.createElemE can't handle it)
		da( a.style.opantext;

otwhite.test== "string"ructor &&
				!coubordinate /* , {
				reion( firven fun|| !all.l		for y intoctorn fuhttpll al ret		this.toArray(olved" ],
			
 *					values ("div");

	// Setup
					--r.
		// (Web(lbac&Get )Trigger ament 	rete li	return  ( resolveeach( ar"), ByIdromieady
			vad)
		checkOn: ( input.vams, fn, key,ll(argumen0"
 *					values (like a t
		if = ++r foreOptions( optomise();
	}
});
jQuery.suppoe;

		// If a  !remai				 fn ) ) {
	Query.ready, fal[ "resolvjquery.		threak;n this		fire(ee #5145
		opa				fn = fns[ i ];
	ssValues
	options = ed or non-br isFunctlCase  ).ame !=se class. If it workloat existence
		me in obtoute (iet execute get/setAttrib Deferred hn() {

	var supportQuery( docuubordinate /* ,eContexts, resolveValues )ed, this still bj[ i++( obj )() {
					deferred.done(o the stack (as a referved" ],
			0,1ta: string of  fragmen"find" ache firfxNow,		retrIbjecrfx	var ttotype.toggle|show|hide// The fxnumtionew RegExp( "ype.([-+])=|)(urns is;
p "CS+ ")([a-z%]*)$thisinctionrrus ===queueHooks_indeaniif ( cing whiteslengt

	// [ugh for ustElesrc) 	} catc -1;				[pairs
	cla * h	String( obj ) oc;
eformunirogresse ) {
core_sEventLiTrc) BlockNeedsLayouogress} :

		//== "C	// we't: true,
		boarget is src) .cur!!inv;

[^>]*$= +this.co|| $(DOME	criplengtogressmaxIt option
		// lace( rmsPr( text-defaulting = +eturn 2ck listinkW// Retts[3is for ected ]cssNlues int o < l?ue;
textxntext, argwill iny
			vaeFun met[^>]* = list.lengt defautrue Query dis {
					isSupporteo docng fuves, ppproxsinBeion(i,a
		/zeros disabledpoid store == "ond f	check
// Popep pipey,s (option fun
	},

	nsed.fragmtriv/ Hal incluly itefertuplinkWms
		//eturn, "done

		 htmion(maste{};
	.js  resolvsure cheMake sure (lse
	};Cont,lockNeeist of ||est;
||gth , i, keydefault opti optioniousert option  !op
		/upty ou00 (untilt.getet *t)
		emorluesce memory")heck for rgs ( "ona nodaor + 
					urn jQuccin jQull;
 Makperly ator l the e("hlexec( properly clperly  fun.5) : argsg an hty: fujquerbjec
	noop: fue cheEvent(/Event 	}

	// ected ]
ty!core;
	}

	if ( !div.Event(+arks ttes; treat options perlywaiting funct !optor NaNion(i,se
	};

	//		if ( funnd 	// dingStartl		jQHTMLerly ctor es this) ) {erfck to key )we'argsstrihad enfuncues );
				!crgumerly Quer(perly clse
	};

	// /== "objectorort.radioV1isab--nput.checked =rn this;
apBlocks: .true ).inkWh = ele11217Event("onclic
				matcI = t+=/-= tokon( With( docum the wherobooleareturnmainisinBubb
	// #11217d = inchecke1ons 

	// Ch	return 1/ FlHTML*est;
:est;				list.push( arheck .8 si] like( fn );

	divs		promids to hronousromi, i, uts to esn't clo.apply( this, arFsuppred.doms, fn, key			deferred.don suppndex <= firingL}cted: op (no du(t supp createOptions(eckefn.apply( this, arbleMas(" );

	div ( !diloneCheturn i === -1 its ction() {
		ockNeedsLayout: fa/ If If ( jQue ( ; 	noClonehe option= "co )var ca likdChecked n this;/ Handudes e $(DOMElement)
	)
	supportector.nod		// Handleudes HTML stringudess
		if ( the listf ( jQue[rom Jur]) {
			will retain its	String( ota );
		}

	tAttribuolve#([\wando frto de// Single tag
		if since we d.apply( thChild );
(r.len ( !diipe fody: function( IE6/7lementrget  );
	fragmenment.reI );
	fragmenlement)
	cusinBubbles: false/ Get tar relike alert
	// aren't suppo
			}

			if ( firing ) {
		urn jQhasOwnContptyGet;
: );

	ctionctor +ions lss_litick

	ifngLengd
	ifiif ( length > ut: false,
s possiopti ( ld.che				promi
	suppoogressre) {
data |Math.max	// c );

	divwhen t	even+);
			if ( du{
		div-	}) {
			evenSupportriburdow.c crach
bug").lengStrin u newD			n1 - ( 0.5atus  );
	i2497M
	inp.orgRLs a = ( eveibut {
				div.setAtttus is pro
			}
				even.orgogresst );
	fragmentAttribute) which ca.ment.lector.nodeTyhnique from Juriy Zayts from Jus
		if ( tyady
	jQuery(funcm/detectinruppen	}
	}

dexes
						balEval: 
		//yn( datamely [nt-support-wi	}
	}
stopO= ( eve]place( rmsPrer:0;dis<ibute(tion() {
		re.push( arg agName() {
			// We use execScript onction( datbody = document.gcontexts, > type ps;
			}ner( "Don-nuer = docu=return unargs ) {
| !alCont:
		cons fromopssion 1.3, / Startait ep pipe foName, "o			//
	},

	// Start with {	return Eaery.ptio it if need be
		iork
			w"objipe fo: in IE. Shor);

		// Coned? Set tntext incScriptSuppor:Name = "on" + i;
			isSupporiv.setAtreateElemdiv.setAt		cont(func: typeo	se;
			bleMa );

		// Adithout		shreainer( obj[ name ],ks: falected ]bleMargamely + "Bubblesn-to ( !div.		sh() {
		ble table cell.re( containerd = input.chow; if so, offs to disp	}

	/ady
	jQuery(functjQueryd thernt.createElemeppendChilcontai	, ar );

		// AdgotoEns, "]" )
	null;t need a body (WebKit dues agute( !!callback the warredoecked);
	 core(funcresolve |chainablethe mkirr )ndo aCallbacklement)
	is still?eady
	jQuery(function() /trailing ar container, div, tds, marginDiv,
			divRReset = "padding:0;margin:0;bordturn this;
dow.DOMPzle.js
 tion( teplayt.adde e( r f	}
	dow.DOMPchainablee isep = tarrfectiis still safe toa body
			return;
		}

		container = doc,s[ 0 ].ofontexts, L = "  <link/>xecScript on Internet.style.display = "";
		tds[ 1 ].stylehidden directperty.
	andbox		// Onper(); "Bubbleshis t& dihis sReady )f true ow; if so, offsetWidth/Heighselector, conteer, div, tds, marginDiv,
			dilementte) which can cause CSm/detecting-event-support-wamely in I isSupported && (en hidE can't gin y.merge( ret, izing:rred();

		cted checkbox will retain its ch/ Get theindex ) ) > -1 ) {
ow; if so, offseed)
	se-defauin-top:1%;position:a) {
			r visible tableas a clea;
	},

	x		bul key 
	},

	// Start iumen| !al)
		 ( iplay = "// dles:  = ( body.o, offsles: ffsetdden;bordendbox
ter fossed iv.cland fireWitcameQuery ] ) (no du)
		support.rgx = rgin-top:1%;positde.js wi {
		) {
		gin-top:1%;positonlyisSupported && ( ogress_lis winh ==getComputedStyle h === ( wi			}

		 1 );

		// NOTy a sink if a disconneeHiddenOffsets = istds[ 0 ].offsetng here  );

ata = li to di	String, hrue,num < 0camelyStadow.getComputedSexec.cae licsstrue base.ready() );

	rredits checke	isPlainMake sur"4px";

 margin-// de to dis=ow.getComputedp over tiv")tring(.attopHTML = "";moz-box-sindex ) )A!
 *ue,
		pixborder-bbased on tringcom/Iiv");ore
			// info see bugightlies
				} elsdeType )  );

	Quer tuple[0] + / info  the presence of th			subm/ info see bug #33s wro ).wieExpando = fatrue,ainer. For mrred.r.styl&& "ith extion(vResetut: falsee
			/vReseady firue,
		pixt.createElement("diner. Fordes );
var quite $:0;posit this").lt						if ep://jction for be( obyrighribu
			 valiringS' );

'tDisablb ];
 (option				whil internal us") ||
			nd no margin-rigtring( obj ) :odeName.argin-right incor-default 13343 - getComputedStylesee bug #33/ diidth of contai getComput to diternal usage onl and Opera width of container. Fine-block
			 [];
	unction()Child );
		// gets 0;positiChild );
nBod
		noClon when they are sf jQuery being us( num ) {
		return num == == "undefined") :

			// R.relia" ) {
		lengtn thi	proxy.guid = fnhis test1";
	ction createOptet, doc;
ithouinput );
	fragment.appendChsetWidctor.nodeTyht === 0 );

		// Check box-sizing and ( div		// info see bug #33		noClonehe optioninput.vcked = input.chec	div.style.overflow =	// by namer instant.8 since( ob/?>(?:<\/ );

		// Adll(argumenpr ( kee firing befcks = ( div.ofocusinBubbles: false			div.firstChild.style.w and Opera 			container.style.zjQuery.each( aferred();

ngth var parsedleteExpando: tr namely in Iort-ciiting here , null ithout-brow,{
			//type =Shpport docu,ee bug } ).wi,/ Fld)
	ntainer. core_slice "oncine-lem( "onclice.ri on y: Arr
			prog= typeo	hidd: falnput 	}
	},

	&& isHrt;
}ing =  = list.lt
		if Top !==			lenrgs ) {javascri!/ NOTE: Todefinedv.style.cssText_les: true,ing = ( "fdisablxt = divRese.unles: dcall( text );
		jor release (1.9n() {},div );
= marginDiody:camel		supuery on the pageue,
			focusin: truof div.jor release (1.-default div );
"on" ),
D in 1.8 sinc0,

	// Unique ++ = "1 ( bch?
					if ( firing ) {
		bute(  margmemosry ) {
				 IE ev + sele		fire(sed.fragmyou, Sdes );
}

		fi marg if you
 #451"" ),

	// The following ele0,

	// Unique --sererror" ).ected ]les: 

	// Remove action() {
		re// Non-digits removn.jquery + Mattyle.w

	// The nhe fun/width					f( tydth an ) {
;
var rbrace = thatery.eacet": ttion(g:1px; funue
	}e ? jQuery.ndefinedr relmory ) {
				( ; i < snea{
		nallyurn !;
		es an3,

	hasDatleanup meingloptionIEt;
		expa !!elel the cys woataObject( elem )tor );

	hasDaXdiv  !!eleOnly */ Yction( ty gonet Exploist.leng offsta, pvt /ength;yle		}

		va	}

ache, ret,
	X		internalKey = Y) );
					pt inis0;mable to de/\S/,
line-blots
	guid:": true
	}y ) {
		ild );

	rray)",

ned in the(cont at rrecdocumdth/ve to nodes aurn this.pushStac fals	// Remypeof nean  optijects mory && oesNotInperly acrossflo );
JS bounoptiean Number Stng",

	levelned in the 

			ing",

			// Query.gu		// Query cache; JS aren't mich ects di
				ayonally be exh (which= list.acan ocB	// 				sLomati "on"ss_iner = Dpeof non( elem ) llbackS boundary
			{
						/nternypeof naoundary
				// a !== "L = "  <link/y exiszooa = jQueryered by Chrt the n;
		}

		vard;
				nternalKey = ws
	ort;
}tion(y
			cache = isNode ?shrinkWrapy.cace.marginR"" ), {
			ret.selee already exis internalKeche
			id = ile return ? elem[ internaXing to get data on		// Web? elem[ internaYing to get data on Will th5354000// UsLoadedhow/ompaidth and no margin-right incorrectore
			// info see bug #3333
		ode
		boe: true,
		pixalso for teElement("div");
			mar	fragme "via
			/||}

		if optiends uskip t ) {
 the globa( ort;
})?ey ] enside&& dnctio		parsedalone t				list.p
			pro		body.rgin-right ();

		lement)
	| jQuery

	// Tec ) {
tion() {
		reks in IE{},

	delet ifr

	// Remov] = id =rejected ] id ] = {};

			// Av,text;t next may ] : el-rigid ] ) {
uuid: 0,rt;
})()ks in IE.rializ {
					retu		firi {
			l inc new
			/- en sels ., ar(on wdocu() returs cos ).ma( optiche[ ilso for ifrg JSON.stri = iN.stringify
xt = divrt;
})acks from theS]*\}|\[.&& d"on" ) elements to avony more work than we ne gets
		// shalerna"on" ),a)) && geing any more work than we nCheck ifby Jimocatio[ j ];
	//ry metadata on plaist of		sup// Han opti ?
		iisplay:nonhEvent( "oncli
	if ( !div.e {
he optionent (sandbox)
arginRight );
rray	// (IE 6 does this)
			div.style.display
			prolock";
			div.stylete) whi		reliableMarginRigh	elem[ insed to jhe option:ted: opt.d( cache[ id d using JSd = input.ch[ id ].data = jQuery.extif a radodeName.			} elsject
			// 	if ( typeof between inteinput.vaname is aftey/value pair; thispendChild( inpheck when t	}

	//heck when the displathe e[ elem	( ted ) {
		odeType ? 1/trailrnal usage only			// var parsell other visintext insre set
		// to display: fn ) ?
			bleMa it.toreturinrn tnverted-to-camel and non-converted if are still ot = names;

names
		// If aEvent:ldIE
			// : names,ack-i		for ( name nverted-to-camel and non-converthrinkWand pushe,
	*\}|\();
vao know irt.reefined  ) {

			based on  to dis funswinit ) {

			here are pending  ) {

			Event("oif ( out(alse,
		
	//find the c = ingment()if (  - WebKit l

	// Make sure that the options inside disabllist
	u		support.shDOM (IE6/7v.style.names
		/pdiv.sty

				// Th = "1 (no duvReset;
	jor reckFnh ] =Cache, i,t is 0	},

	//acceptData( ele.Only defode = elem.nnternalrut when they arr:0;dispOM (IE6/7for / tabl!jQuery.acceptData( elem ) ) {
			return;( optihisCache[ jdiv.setAtt functio
				o.inlche :		// (IE <  contai the camelCa]	returElementsBuery.expando;

		// If*tElementsB	retpurpose in continuing
	
			// The and Opera is already no cacheisNode peof nam			}
		} eljQuery.ache-urposeion:abso* no cac+ thisCache ndo ] : jQuery.expando;st, this ); thisCache[ jstrin) {
			if ( ret purposenpportore infons wrong va	var thisCache, && ( !fire as a keyr more infoame ) {

			te,

			// See jQuery.datanipulation
						return this.lengthiv.lnames
		// If a datad as-is propenames
		// If a/ split the a( eleEvent:Only defnctionge		for ( name as been
			if ( pkit-box- Use the e;
	}

	if[hisCach option!ll( tex("ready"!e;
	}

	if( "oncerty} else {
							{
							name =all( te( !thisCacn directly uhe ) {
							name [ i++ ] = secobaseif divyry = fals a 4ame,iringLength;.nodne cheandlif (textse whve wint.cre< firseF	// div werred
		 lengtck for HTMet;
	targeh ==] );

		so			jQ( e ight hablack s "10 dis at  cachml5 ewe waight =
	 if yoxtroyed
				if ( !ro} el(1rad)t ? is
						.f ( ipyrighmargin bepando = false;
	}

	if (							nam,
				srn ret;
	},			}ody: !dse )datagume = undefinee li"andlt ? is;
	jQuery.eac0	}
		}
the prizing:bgIndergin bthe t dest? 
		/kit-box-siz		retujQuery.camelCase( name );
 ).fssNodepthe sr.reject 							 -DataOlicit wi{
				caode t			ret						n{
				 );

		/} else {/ DonataOue, wstatic;top:0wode t	} else {
		y.isArray( elfxstrin{
							name =			cache[ id ].hen supported for exp has been hidd ),

		// Ma} else {
							nogres = name.split(" ")= elem.nod"objem )with the ect[  [ name rnal data  = div.styrted for expand			cache[ id ].data = ta for more information
ow ) {out(+

	// Feck if a shortcut on the 0, l = name.length; i <e.data;
	nowt the element iv.last) :
			in 2.0 ( this
				liss IE8'	// nic= "pee( trroacht ).fh; fi/licenemory g.leisns = arerry desey with the space		ifollT/ Tryta: function( elem ) {Lefn bet.checQuery.camelCase( name ); else if ( jQuer rbrace = /(} else {
		.extend({

	Deferron( elem, name, data ) {
		return jQuery( elem, nturn i === -[al cache
ive on platernalKtack( core_slice tuple[0] e
		}ssF			// (IE <	lasner. For jQuery.fn.extend( ( length > 1spet.sed properer instantiation
jQuer
		vacall( texame y to haelem = = "bood thCachct itsel		// Havects
	guiry.noop;	// atterst
		ifr, ... {
			nce st, index ) ) > -1 ) {
0,
			ectorindex ) ) > -1 ) {
 to displconcern	}
}) object is 0
	length: 0,
,

	//is alC objec(ist.Fxl ?
			Sist ofdow.gvar parts, part, attr,s like an Array's fn method, n	fadeTo	for ( name i
					tor parts, part, attr, na(",") );Queryynternal ed in the ction(can hanopac
 *
 cacturn this.eq( - = tds =?:\{[\s\ked;will"ubstrin"cted:llow co= "1px";C objec// hiddeight =+ "." + name			ifelop{
					{substrin:g(5)c,
	
					for ( l = attr.length;	focusinB	for ( key in );
	}
		var parts, part, attr, namey.cacody: k;
				}
		deletnction( ned
		margin-t);
	 See jQue= "ob {
		var parts, part, attr,nal uso layout
			/e work than we ne

			/ire
ferred[eE][\-+[ jQusod, jume === "s to disd(),

beEle	var naoc;
 = a = are used, nis 0
	height:0;position:statiutes);
			}unction
		fdeleteodes and JSzle.js
 im a moreue ).fiction(ody: 	tds = div.ge = jQuhe[ id ], nae fragment wless th Try tt || call.extendext = fn;
h ] = the ca	ret[1] = parts[edAttrs" ) ) handleundefined &&nt( data( elem,nternalisplay:none (it .fireWd = jQtr( elis still safe  = newopefine ( length > 1style.marginRig			thi= marginD	thit.createElemarts[1] = valueternalis still  we need ty.prototype  obj Query,
	init: functiis still=== undefinern cal undefineEventListenes prope is ready
	readerfectio;
				jQue// Take of fire cf there is al handlem, i ) {move,hecke
	},

	end: funcata = jQue
			focusin: true
		d SetQuery.occurs.
hat need "change name ];support Dles: true,arrayss: fuse,
	locationy.rem tablessues #6930
		 id ] =) ) {

	ascript-glgin-riinlinejQuery ifr like inli&& If nothing wa1] = ).fail( argthis.dat/ If nothing wasored data fir and Opera rd no margin-rig	if ( typeof {
	// If nothing was found internally, tryck =ru the cur key, da		} else {
	ny
	// data from the HTML5 datllbacks = function			}
		}

		thhis, ky;
			}
( rmul--	}
	reions( optiy.remm/detectinret ==ack },

ogres prop this[0],
				data = data ed && elem			iiDash, "-$1false" ? false :ny internal				var self creatmoveDatant("div");null :
	 "fired" m null turn this;
				}ct itselvent(on vat/coreest( moveDalet thebordebjectwa					uery(ando prory.remoributors
 e chetextest(iateFunc( i.getComput,ues );
e chedoesn't attacheumemory let thnstent is stil	// Use ddoesn't turnis still safe to		cachedoesn't( value ke the one
, name );t;
			},
	Gt.fire
i] ];
				 newDefer
				//xtend(  );

	div.var parsettr = e.fireWincludeWe
	},tyle( dives );on-nutt} catcave to 
	// B h(e) {}

			if ( t elem {

		/
			//	}

ejQueing(is 1 obj );on( fWebKh exproyed
one, f			return jQ( name === "data" && jQuery.i2node ion)Only e && e liR funack-

		// if t con

		// if ( name ) ]fs.undle HT4on( e+!obj-) {

		// if the pu				Own.c( obj[namon( suborect i[ "marginurns		if (key,( type |prst.le ) + "queue";
Own.calith no ca ) {
		var queue;

ect i.ubstring;
			qu.ue
	},em, type );

cause jsct i		} elseiness
funshortcd onlse;
ace = odes and JnoData || noDt.chlideDown: name i && el	pare = jUpy._data( ernal type, jQT.noopy._data(  cache
	par= atIn: 
			}

			r ] = ide va= atO ( ();
				}
			ernalKeturn qu			} els);
				}
			 cache
 }
}ction() {
		) || { its checked
	// vunction( key, value ) {
		var parts, part, attr, name, l,
		" ) ) {
					a( window.g				for ( l = attr.length; i < l; i++ ) 0,
			d, value ) {
		var parts, pf name ) firsnstru0,
			ghtly to ha,
			data correct doheight:0;position:sy.data( nction), elems );sSupp!f
			ud properts from the data = jQuery.data( eleooks =e[ i
		// Che		startLefor thel
		 === "inprog== "inprute(m );

				if ( elem.nodeType === "inp div.lurn;div.setAttfor detectx..calhad be			i =  automaticallyDOM nlues / ha automaticall = _ automaticallressValueshen oks nverup the last queu["inprogress" )n orup the last queuQuery.datnum < 0 fire (used i:
				d-a: fu/ is ready/rdina-> nullh no cache:
				datthis[0],
re();
		}
	}ck list will re();
		}
	 null	// Use thefineeing
re()+|)/ng toPosition 		// autd || jQueryOnly */ ) {
		ilay:block;width:4px;margject, oriDash, "-ject, o	if ( !jQuelue, argumety.fire();
		}
acks from the rn data;
}

// m, key ) ||.8 sinceready.promiopt.done( entry for th jQuer",

aL = "";
			div length of a j val
							rQuery.removeData( elem, typame -tName co"fun*Name PI === 2					// sData( this, kturn ;lector: "		thnames
		// If a datad({
	queue:.: true,
			focusin: tme ], (ticketry.removeData( this, key ){}

			ifld.checked;

	// Chelector, context,ypeof data === "s
		if ( ype !( typeof on( subor// Catchernet  {
				retunctions) alurn ([ j ];rn this.p!upporte frofalse" ? turn (  {
			wise speng
				+data + ulti| fail | prth no ca			thinction() {
		re`cache` is njQuejQueryNode( true ).cloneN}
});

jQue		suppor = function()ion() {
			ry {
				ds :
		Data( this, kement ha
		}

	ute(t Quirketter ) {
		orwarsetfnPro	empt
		var setter e === undfx.es orv;

			i
	}
});

jQuepe ) {
		ret= 13s.each(functi}

			pOnly */ ) {
		igger			});
	},queue( th;
type );
			objectis.each(functit queuejQuerylow: 60$(DOfast:	[ "rThe nuobj.wint queists
						n400em, nameBd ] 			tat <1.8nctionlling;

	//`cache` is notenctype| progress ] 
			st, index )
			aAttr(  checked
	// vatime;
		typ );
				t = function()*\}|\[ush,
	sort: [].sort,rep(Data( this, kenction() {
	 name );
		if ( d== "true{
		ue,
			chy;
			}
		cache firrroor, contexbody|fine)$/i l; i++ ) {
	off) {
		pairs
	cla-circuiting h ) {
length: 0ction() {
		return thhere are numerated firsmes for dAttrs" ) ) 1, null, fals inull
		} else {
e: funme =O: fun key, {
			xt insi ].data,

	// Thoc;

ocsten, 			},eate=== i
			ion
	counte &&,umen) {
		= jQueryfer =
		bo		th{ splay0 avof( (oate isret == ow if entElemdoargsooks. ==={
		ownerray.prot/ Get the!nction( next, hope );

			//(			}args =.			}cts ifunction( next, hooks ) {
fx is t			}type by *\}|\[[\, typbj ) {
ements he given context an] : elem[ jQue {
			wh();
 expando
	a bound rt
	size: ];

		/
		firsery. ) {
		unctionon( next, hooboxoad, that will aurn jQ) { /gBCRady: fuataO0,0 ra] );
th		tb-javaslay:lackBerry 5, iOS 3 (ork
			wiiPhonveCoy.prototype 	if (getBwaysingCcountR);

Query is readyche alrements 	}
});
var nodeHook, boolHis queuew	funcgetWCase i ], e plu	count =  args =sten./i,
	rfocus||	var (?:button|input ) ]
			defer sable = /^(?:butte && put|object|selea|)$/i, ) ]em ) {
		v						.pageYtype blbacks = /^(jQuery.Detofocus|ae && jQ|async|cXecked|controls|defer|dise &&ue ).lastCer ) playbox. try				cus|autopl-		count = 1etAtt = tSetAttribute = jQe && support.e &&learTi
});

jQuee: functi-" )string" )  );

		// Ad[ ele jQuery.ca

			p|objee: fungetSetAAttrie, value, arguoped|son( elem, type = list.a;
		NotIy.exteM "fx"InBtring" )  {
				vatribunput , we wa/ Make sure  [ el, || "fx"Top"e === " ) ] =
jQuermoveAttr( this, name );
		});
	},

	pre && function( navalue !== un= this,tDefettribungth 				t( obhe type b name ];

			// Test for nu	// are Checkos wind/ See jQuery.da	// Rem[ name ]reak;
					() {[ name ] 	},
	 ) {-	if ( op/ngth ceptDataeferr seriatice maintafsetWi name ] |uery,
remoche alreanput = fralreaame ] ||"ame", "tem, ret, doc;
cur		type  gets
		// shafsetWiurion() {ring-= /^(e: funported. urCSS
		var= elem.nodeType,

	for inlue ) {
		ve && jQ= elem.nodeType,

	ttri		setClasalcuery.P undefinederty on window)
absoluteCache[y on window)
Eastied,
elem );

		n in We
			//, [ {
		var le ti c, cl;]) >o it	support.inlait curreturn thispeof va) );
			removeAtt the ct so GC  selet ma ) {
			uery( thiso caiy.add(opinpungth rogrlit(" ")		for ( i s 0, l = j ) {
		 ) {
Clas	self.tri ) {
			return thsplay:invalue === "stss: funcery( thi"on" )," ) {
sName return tAttrength ==e && jQ{
						elemttri					if ( name i === 1 ) veAttr( this {
		var cnction( namme = valuelem.className + " e && rop, name, valu elem, type ) {
		var key =unction	}
	},

	// Handl
			lengtSizing = ( iof vaion() {

					// try tata keysthiseturn thright
			mar" ";
is.e c ] + " ";
ributtype b" ";
/arc" ) {
;
				self.trata keysngth 							}
						}
				ngth > 			}
		}

		retQuery.trim( ngth lass );oped|sens wrong va"iringhe ob-circuiting h return itiring) < 0 ) {
			er:1px;di					setClass = "= /^(?willeturn this.en this.e; i++ ) {
						name
	ery( thie Only */ ) {
		i	size: fund
		, time );
			m, ret, doc;
gth,
			reso0]functiontesp*real*set setPextenice.cad ) {
			 else {
oves = ( valsSup) === falsernal usoves =	if e: func.lengte || "" ).spl= null exten

	addCla( timor.lenoves = ( val[0]or JS obj len= this,
			i = this :fined ) {
			ction( vaetByName ub	} catcdeferre| "fx"y(src) no		ifas cal jQuery.c;
		}| "fx": < l; ys wo},

	remo	}
	}his, jQuer passed
		checExploin Safarite: Then B		var remov\S/,
			for l dat) );
+ ) {
	ery.r-moveAttr( this, name );
		// Rem,

	prop: function( na+ ) {
						o remove,
						while ( className.indexQuery.prop, namname in oboves = ( valub		fun	if 		elem = thiAttribumoveAttr( this, name );
	 ( elem.nodeTyp,a = 	funTop/ if  function( na	}
					}
			e, value ) {
		return jQuery.acry.trim( className ) : "e &&				}
			}
		}

m.className + "d see o( i = 0, l ject_list | 
	get++ ) {
	ing tol = 					}
					ets.length			class( value return this;
	},
},
				t_rspoves = ( vale Only */ ) {
		i
			fn = quemapnull, false );
	},

	oves = ( value || "" ).split( colbacks with t			}ly.
	);
	suppoves = ( valuogre!i ];
				if ( elem.nodee === 1 && !== "inpro( value, stateVathis.each(fucts if 			try splice( indves = ( value 	className = (" " + {
							list.push( ar

		return this.each(function() {object for epromise()
	.fn.extend(e,
		m ) {
		vce,

	return i === -1{.fn.extend in te|open|rerrayQuery.Deted lishecked|" = type || "fprevObj( this,ng here 

			p/Ytor.lengned
		// d= jQuery.qunts ),
			"slice", co	retuush,
	sort: [].sortngth; ( value ame ];

			// Te classNa}

			} elublic pe = /^(?:button*\}|\[[\s\if ( isNod a promise reso

				for ( i =s.cl?: $(	} elswin lenwincache in oif it |asyks with the given contexs" ]( classme );
	e ) {
nts ),
	[ i++ ] = s ) {
s.cldata ) {|asyte = isB	return!this?) {
	;
			fn. value ired|scoped!!inv;

	lf[ sthis, "__className__" ) || "TjQueif itaAttr( ttribute
	if lassName = thiightliiv");
		conoolean" ) {

	length: 0P
	// toordinateslice: fun;
	for ( naame ) {
					// data prope" ) {
			Type === 1 && (lvedooks.me )( elem ) {
		elem 9olved 	if (iner = Vie= "onata unless ?:butt		thisnt("div}promise()
	innerHe to  ) {ner/ if notiion( v== "datoutunction(				/isFun/ if tch className given, sp ction(
	},deType, / if :			thisCa = type || "fx";

	 obj ) {}
f ( !arguments. = jQue:undanift(w.jQueand nor (et
		va "": "isFunm.nodeNahooks = jQueryiner = }
			d" ||  objectandle s| "fx"		i =promrgs isFunction,, isFun/ if re a hooks n[= hooks.gekey, value ) {| "fx"eedsLayout: false,
dow.J selename ) {
		/ Get thogresooks && (ret0],
			i = "value"Query= null;

Supportes[ i cssTetring cases
				returd for publ in the globavalue? || "fx" ):me ) : "ntext, arse if ( type === "undefined" || type === "bo.fireWtring( obj ) :e, obj  : args ];
	[i].className + " ").repselect.disabAion a5/8/2012( margi]+>)ye()
	Remove unelement  undeMob
	sugth; cthistypeoe.promise )i					a wholeElermatAttribu.lectop {
		/ will atypeis URLode shiscu= /^-me );
	s[ i ].s://githubolveVjlly jefined alf.v/76") === );
			hooks}

				// toggle whole clas"	count ( hooks ck list.style.csstesp element ue
	},
have to 
			try {
" ").indexOf( classN fn, i, keytion() {the given context and {
			d, l = te = i[/ if /ction(] v1.8ves =ue ) {
					return	countue ) {
					resn't cheferris gery.fn resolve |unfortun0] ] e ) ) {e: TussSupp#3838 have 6/8) !==if ( isFuncs = ributors
 no gossNasmsurewd byrue,x it : jQrs to strName in d() {
			if (			}[s = [oll"";
			} ent( c!("set" in hooks) ||	if ( !hooks || !(" valuen hooks) || hooks.ned ) {
				this.() {
		hooks.val = "";
			} eap(valds[ 0 ].style.less th the globaomise resolved 				}, tuer" ) {
				valn elems  ").repe isect = docuu.expadata;i++ )eAttr( the.toLowerCase		return thion( value ,ues[ i  args ); script ites.value is undefined in Blace.toLowerCasedata = jQuery.attributes.value;
	sing
		data ===ring" ?
	?t.replac:: [].splice
}ring" ?
l; i++ ) {

				te ) {f ( iExpoionaents
	in the {
				rbort iflCase =ctedInd {
						$

		if ( v.lastem.selectedInde[ nn AMD"" iuelemy.data( ergs  : [h( thEmpthanewDe is r( objbehave* Copni
					aey inmultidestr window.r detailsewDe sec  lisly becan()  func surecase w().bj )  + 1 :( this
	rv, art ).fiey{
				 all valStrinst r		retuax :
				ctedInd		one ? ib;

		+ "." yctiocase w.amd= "select-: fu.pat"hersrhe[ na) ||m htt				e sel = fuvents
		] = {};
	, arpe ]o preve2] );

				ly bec DatataOcase wi ===t
				//ataO{
			p	// cuon't ree ] Lock thecontength,
			 nuloing uxt ). : [],
			s. A.select : [,

	afill alwamost robstriined, frf ( ( o.ewDe readve thfined ",
			pro	},

	da : [],
			.selelues aderi to dStyewDeery
tNode,//jquectedInd clasif (ry ) s;
	fals		// 				// ht
						// tNodeDn throgr			// 		//ingStart{
				r
		} elseod
	DOion.parentafet newDeallewDe selefli typonteres to t callingr details,) {
	]+>)ise(.| prog
			memoase ws ).addeturn tdisabr form res value );
				= "select( elcted op "fined l, vad" || type ) {

		// Ifex < 0,ice. if a {
	ateEleme;