/**
 * Parse a string function definition and return a function object.
 *
 * WARNING: SECURITY CONSIDERATION
 * This function uses the Function() constructor which can execute arbitrary code.
 * Only use with trusted input. Never pass user-generated strings directly.
 *
 * Safe usage: Parsing function strings from your own codebase
 * Unsafe usage: Parsing function strings from user input or external sources
 *
 * @param {string} str - A string representation of a function
 * @return {function} - The parsed function object
 *
 * @example
 *  var f = function (x, y) { return x * y; };
 *  var g = parseFunction(f.toString());
 *  g(33, 3); //=> 99
 */
export default function parseFunction (str) {
	let fn_body_idx = str.indexOf('{'),
		fn_body = str.substring(fn_body_idx+1, str.lastIndexOf('}')),
		fn_declare = str.substring(0, fn_body_idx),
		fn_params = fn_declare.substring(fn_declare.indexOf('(')+1, fn_declare.lastIndexOf(')')),
		args = fn_params.split(',');

	args.push(fn_body);

	function Fn () {
		return Function.apply(this, args);
	}
	Fn.prototype = Function.prototype;

	return new Fn();
}