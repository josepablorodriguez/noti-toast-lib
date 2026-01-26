import funcParser from "../lib/parseFunction.js";

const VALID_POSITIONS = [
	'top-left', 'top-center', 'top-right',
	'middle-left', 'middle-center', 'middle-right',
	'bottom-left', 'bottom-center', 'bottom-right'
];
const VALID_THEMES = ['light', 'solid', 'dark'];
const VALID_TYPES = ['default', 'info', 'success', 'warning', 'error', 'custom'];
const VALID_ANIMATIONS = ['none', 'slide', 'fade', 'bounce', 'zoom'];

// Icon mappings for notification types
const TYPE_ICONS = {
	info: 'info',
	success: 'success',
	warning: 'warning',
	error: 'clear'
};

// Color configurations for each type and theme
const TYPE_CONFIGS = {
	info: {
		light: {
			color: 'hsla(200, 70%, 55%, 1)',
			iconColor: 'hsla(200, 70%, 55%, 1)',
			afterColor: 'hsla(200, 70%, 55%, 1)',
			progBarBgColor: 'hsla(200, 70%, 55%, 1)',
			bgColor: 'hsla(200, 70%, 85%, 1)',
			border: '1px solid hsla(200, 70%, 30%, 1)'
		},
		solid: {
			color: 'hsla(200, 70%, 85%, 1)',
			iconColor: 'hsla(200, 70%, 85%, 1)',
			progBarBgColor: 'hsla(200, 70%, 85%, 1)',
			bgColor: 'hsla(200, 70%, 55%, 1)'
		},
		dark: {
			color: 'hsla(200, 70%, 85%, 1)',
			iconColor: 'hsla(200, 70%, 55%, 1)',
			progBarBgColor: 'hsla(200, 70%, 55%, 1)',
			bgColor: 'hsla(200, 70%, 7%, 1)',
			border: '1px solid hsla(200, 70%, 20%, 1)'
		}
	},
	success: {
		light: {
			color: 'hsla(97, 34%, 50%, 1)',
			iconColor: 'hsla(97, 34%, 50%, 1)',
			afterColor: 'hsla(97, 34%, 50%, 1)',
			progBarBgColor: 'hsla(97, 34%, 50%, 1)',
			bgColor: 'hsla(97, 34%, 85%, 1)',
			border: '1px solid hsla(122, 50%, 38%, 1)'
		},
		solid: {
			color: 'hsla(97, 34%, 85%, 1)',
			iconColor: 'hsla(97, 34%, 85%, 1)',
			progBarBgColor: 'hsla(97, 34%, 85%, 1)',
			bgColor: 'hsla(97, 34%, 50%, 1)'
		},
		dark: {
			color: 'hsla(97, 34%, 85%, 1)',
			iconColor: 'hsla(97, 34%, 50%, 1)',
			progBarBgColor: 'hsla(97, 34%, 50%, 1)',
			bgColor: 'hsla(97, 34%, 10%, 1)',
			border: '1px solid hsla(97, 34%, 20%, 1)'
		}
	},
	warning: {
		light: {
			color: 'hsla(38, 100%, 58%, 1)',
			iconColor: 'hsla(38, 100%, 58%, 1)',
			afterColor: 'hsla(38, 100%, 58%, 1)',
			progBarBgColor: 'hsla(38, 100%, 58%, 1)',
			bgColor: 'hsla(38, 100%, 85%, 1)',
			border: '1px solid hsla(38, 100%, 55%, 1)'
		},
		solid: {
			color: 'hsla(38, 100%, 25%, 1)',
			iconColor: 'hsla(38, 100%, 25%, 1)',
			afterColor: 'hsla(38, 100%, 25%, 1)',
			progBarBgColor: 'hsla(38, 100%, 85%, 1)',
			bgColor: 'hsla(38, 100%, 58%, 1)',
			border: '1px solid hsla(38, 100%, 20%, 1)'
		},
		dark: {
			color: 'hsla(38, 100%, 85%, 1)',
			iconColor: 'hsla(38, 100%, 58%, 1)',
			progBarBgColor: 'hsla(38, 100%, 58%, 1)',
			bgColor: 'hsla(38, 100%, 10%, 1)',
			border: '1px solid hsla(38, 100%, 20%, 1)'
		}
	},
	error: {
		light: {
			color: 'hsla(15, 77%, 45%, 1)',
			iconColor: 'hsla(15, 77%, 45%, 1)',
			afterColor: 'hsla(15, 77%, 45%, 1)',
			progBarBgColor: 'hsla(15, 77%, 45%, 1)',
			bgColor: 'hsla(15, 77%, 85%, 1)',
			border: '1px solid hsla(15, 77%, 35%, 1)'
		},
		solid: {
			color: 'hsla(15, 77%, 85%, 1)',
			iconColor: 'hsla(15, 77%, 85%, 1)',
			progBarBgColor: 'hsla(15, 77%, 85%, 1)',
			bgColor: 'hsla(15, 77%, 45%, 1)'
		},
		dark: {
			color: 'hsla(15, 77%, 85%, 1)',
			iconColor: 'hsla(15, 77%, 45%, 1)',
			progBarBgColor: 'hsla(15, 77%, 45%, 1)',
			bgColor: 'hsla(15, 77%, 10%, 1)',
			border: '1px solid hsla(15, 77%, 20%, 1)'
		}
	},
	default: {
		light: {
			color: 'hsla(224, 15%, 20%, 1)',
			afterColor: 'hsla(224, 15%, 20%, 1)',
			bgColor: 'hsla(255, 100%, 100%, 1)',
			progBarBgColor: 'hsla(0, 0%, 50%, 1)',
			border: '1px solid hsla(60, 2%, 74%, 1)'
		},
		solid: {
			color: 'hsla(224, 15%, 20%, 1)',
			iconColor: 'hsla(224, 15%, 20%, 1)',
			afterColor: 'hsla(224, 15%, 20%, 1)',
			progBarBgColor: 'hsla(224, 15%, 20%, 1)',
			bgColor: 'hsla(0, 0%, 50%, 1)',
			border: '1px solid hsla(224, 15%, 20%, 1)'
		},
		dark: {
			color: 'hsla(0, 0%, 50%, 1)',
			afterColor: 'hsla(255, 100%, 100%, 1)',
			progBarBgColor: 'hsla(255, 100%, 100%, 1)',
			bgColor: 'hsla(224, 15%, 20%, 1)',
			border: '1px solid hsla(60, 2%, 74%, 1)'
		}
	}
};

// CSS property mapping for type styles
const CSS_PROPERTY_MAP = {
	bgColor: '--ntl-background-color',
	color: '--ntl-color',
	iconColor: '--ntl-icon-color',
	afterColor: '--ntl-after-color',
	border: '--ntl-border',
	progBarLength: '--ntl-progress-bar-length',
	progBarHeight: '--ntl-progress-bar-height',
	progBarBgColor: '--ntl-progress-bar-background-color'
};

// Inline SVG icon paths for notification types
const INLINE_ICONS = {
	info: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>',
	success: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>',
	warning: '<path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>',
	error: '<path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/>'
};

/**
 * Validates an option value against a list of valid values
 * @param {string} value - The value to validate
 * @param {string[]} validValues - Array of valid options
 * @param {string} defaultValue - Default value if invalid
 * @param {string} optionName - Name of the option for warning message
 * @returns {string} The validated value or default
 */
function validateOption(value, validValues, defaultValue, optionName) {
	value = value.toLowerCase();
	if (!validValues.includes(value)) {
		ntlConsoleWarning({
			message: `Invalid ${optionName} "${value}". Valid options: ${validValues.join(', ')}. Defaulting to "${defaultValue}".`
		});
		return defaultValue;
	}
	return value;
}

const DEFAULT_OPTIONS = {
	debug: false,
	text: undefined,
	html: undefined,
	position: 'top-right',
	theme: 'light',
	type: 'default',
	style: {},
	canClose: false,
	autoClose: 20,
	onClose: ()=>{},
	showProgressBar: false,
	pauseOnHover: false,
	pauseOnFocusLoss: false,
	animation: {
		type: 'none',
		duration_ms: 10,
	},
	icon: undefined,
	iconColor: undefined,
	actions: undefined,
	group: undefined,
	count: undefined,
	rtl: undefined,
};

/**
 * NotiToast - A lightweight toast notification library
 * @class
 * @example
 * const toast = new NotiToast({
 *   text: 'Hello World',
 *   type: 'success',
 *   position: 'top-right'
 * });
 * toast.open();
 */
export default class NotiToast {
	/*region STATIC FIELDS */
	static #globalConfig = {
		maxToasts: Infinity,
		newestOnTop: true,
		preventDuplicates: false,
	};
	static #registry = new Map();
	static #queue = new Map();
	static #groups = new Map();
	/*endregion*/

	/*region PRIVATE VARS */
	#toastElem;

	#theme;
	#type;

	#checkVisibilityState = ()=>{};

	#onOpen = ()=>{};
	#onClose = ()=>{};
	#autoClose_duration;
	#autoClose_elapsedTime;
	#autoClose_animationFrame;
	#autoCloseIsActive;
	#autoCloseCountDown;

	#progressBarLength = 1;
	#progressBarUpdate;
	#progressBarIsActive;
	#progressBar_animationFrame;

	#runAnimation;
	#hasAnimation;
	#animationClass;
	#animation_animationFrame;
	#dynamic_remove_event;
	#animationRemove;

	#handleKeyDown;
	#previouslyFocusedElement;

	#isNotPaused = true;
	#recoverFocus;
	#handleMouseOver = () => { this.#isNotPaused = false; };
	#handleMouseLeave = () => { this.#isNotPaused = true; };

	#customIcon;
	#position_value;
	#text_value;
	#isQueued = false;
	#isVisible = false;
	#group;
	#count;
	#openResolve;
	#closeResolve;
	#actionsContainer;
	#actionCleanup = [];
	#isRTL = false;

	#debug;
	/*endregion*/

	/**
	 * Creates a new toast notification
	 * @param {Object} options - Configuration options
	 * @param {string} [options.text] - Plain text content for the toast
	 * @param {string} [options.html] - HTML content (overrides text, caller must sanitize)
	 * @param {string} [options.position='top-right'] - Toast position (top/middle/bottom + left/center/right)
	 * @param {string} [options.theme='light'] - Visual theme ('light', 'solid', 'dark')
	 * @param {string} [options.type='default'] - Notification type ('default', 'info', 'success', 'warning', 'error', 'custom')
	 * @param {boolean} [options.canClose=false] - Show close button
	 * @param {number} [options.autoClose=20] - Auto-close duration in milliseconds
	 * @param {boolean} [options.showProgressBar=false] - Show progress bar for auto-close
	 * @param {boolean} [options.pauseOnHover=false] - Pause auto-close timer on hover
	 * @param {boolean} [options.pauseOnFocusLoss=false] - Pause timer when window loses focus
	 * @param {Object} [options.animation] - Animation configuration
	 * @param {string} [options.animation.type='none'] - Animation type ('none', 'slide', 'fade', 'bounce', 'zoom')
	 * @param {number} [options.animation.duration_ms=10] - Animation duration in milliseconds
	 * @param {Object} [options.style] - CSS variable overrides (prefixed with --ntl-)
	 * @param {Function} [options.onOpen] - Callback when toast opens
	 * @param {Function} [options.onClose] - Callback when toast closes
	 * @param {boolean} [options.debug=false] - Enable debug logging
	 * @param {string} [options.icon] - Custom SVG path content for icon
	 * @param {string} [options.iconColor] - Custom icon color (CSS value)
	 * @param {Array} [options.actions] - Action buttons [{label, onClick, close, className}]
	 * @param {string} [options.group] - Group identifier for toast grouping
	 * @param {number} [options.count] - Count to display in group badge
	 * @param {boolean} [options.rtl] - RTL mode (true/false/undefined for auto-detect)
	 */
	constructor(options) {
		this.update({ debug: options.debug });
		this.#create();
		this.#init();
		this.update( {...DEFAULT_OPTIONS, ...options} );
		if(this.#debug) {
			console.log({options});
			console.log('TOAST:', this.#toastElem);
		}
	}

	/*region STATIC METHODS */
	/**
	 * Configure global toast queue settings
	 * @param {Object} options - Global configuration
	 * @param {number} [options.maxToasts=Infinity] - Maximum visible toasts per position
	 * @param {boolean} [options.newestOnTop=true] - Show newest toasts on top
	 * @param {boolean} [options.preventDuplicates=false] - Prevent duplicate messages
	 * @returns {Object} Current global configuration (copy)
	 */
	static config(options = {}) {
		if (typeof options.maxToasts === 'number' && options.maxToasts > 0) {
			NotiToast.#globalConfig.maxToasts = options.maxToasts;
		}
		if (typeof options.newestOnTop === 'boolean') {
			NotiToast.#globalConfig.newestOnTop = options.newestOnTop;
		}
		if (typeof options.preventDuplicates === 'boolean') {
			NotiToast.#globalConfig.preventDuplicates = options.preventDuplicates;
		}
		return { ...NotiToast.#globalConfig };
	}

	/**
	 * Close all active toasts, optionally filtered by position
	 * @param {string} [position] - Position to clear (if omitted, clears all)
	 */
	static clearAll(position = null) {
		if (position) {
			const set = NotiToast.#registry.get(position);
			if (set) {
				for (const toast of [...set]) { toast.close(); }
			}
			NotiToast.#queue.delete(position);
		} else {
			for (const [, set] of NotiToast.#registry) {
				for (const toast of [...set]) { toast.close(); }
			}
			NotiToast.#queue.clear();
		}
	}

	/**
	 * Create and show a success toast
	 * @param {string} text - Message text
	 * @param {Object} [options] - Additional options
	 * @returns {NotiToast} The toast instance
	 */
	static success(text, options = {}) {
		const toast = new NotiToast({
			text, type: 'success', canClose: true,
			autoClose: 3000,
			animation: { type: 'slide', duration_ms: 300 },
			...options
		});
		toast.open();
		return toast;
	}

	/**
	 * Create and show an error toast
	 * @param {string} text - Message text
	 * @param {Object} [options] - Additional options
	 * @returns {NotiToast} The toast instance
	 */
	static error(text, options = {}) {
		const toast = new NotiToast({
			text, type: 'error', canClose: true,
			autoClose: 5000,
			animation: { type: 'slide', duration_ms: 300 },
			...options
		});
		toast.open();
		return toast;
	}

	/**
	 * Create and show a warning toast
	 * @param {string} text - Message text
	 * @param {Object} [options] - Additional options
	 * @returns {NotiToast} The toast instance
	 */
	static warning(text, options = {}) {
		const toast = new NotiToast({
			text, type: 'warning', canClose: true,
			autoClose: 4000,
			animation: { type: 'slide', duration_ms: 300 },
			...options
		});
		toast.open();
		return toast;
	}

	/**
	 * Create and show an info toast
	 * @param {string} text - Message text
	 * @param {Object} [options] - Additional options
	 * @returns {NotiToast} The toast instance
	 */
	static info(text, options = {}) {
		const toast = new NotiToast({
			text, type: 'info', canClose: true,
			autoClose: 3000,
			animation: { type: 'slide', duration_ms: 300 },
			...options
		});
		toast.open();
		return toast;
	}

	static #register(instance, position) {
		if (!NotiToast.#registry.has(position)) {
			NotiToast.#registry.set(position, new Set());
		}
		NotiToast.#registry.get(position).add(instance);
	}

	static #unregister(instance, position) {
		const positionSet = NotiToast.#registry.get(position);
		if (positionSet) {
			positionSet.delete(instance);
			if (positionSet.size === 0) {
				NotiToast.#registry.delete(position);
			}
		}
		NotiToast.#processQueue(position);
	}

	static #processQueue(position) {
		const queue = NotiToast.#queue.get(position);
		if (!queue || queue.length === 0) return;

		const currentCount = NotiToast.#registry.has(position)
			? NotiToast.#registry.get(position).size
			: 0;

		if (currentCount < NotiToast.#globalConfig.maxToasts) {
			const nextToast = queue.shift();
			if (queue.length === 0) NotiToast.#queue.delete(position);
			NotiToast.#register(nextToast, position);
			nextToast.#showImmediate();
		}
	}

	static #canShow(instance, position) {
		if (NotiToast.#globalConfig.preventDuplicates && instance.#text_value) {
			const existing = NotiToast.#registry.get(position);
			if (existing) {
				for (const toast of existing) {
					if (toast.#text_value === instance.#text_value && toast.#isVisible) {
						return false;
					}
				}
			}
		}

		const currentCount = NotiToast.#registry.has(position)
			? NotiToast.#registry.get(position).size
			: 0;

		return currentCount < NotiToast.#globalConfig.maxToasts;
	}

	static #enqueue(instance, position) {
		if (!NotiToast.#queue.has(position)) {
			NotiToast.#queue.set(position, []);
		}
		NotiToast.#queue.get(position).push(instance);
		instance.#isQueued = true;
	}
	/*endregion*/

	/*region SETTERS */
	/**
	 * Sets the plain text content of the toast
	 * @param {string} value - The text to display
	 */
	set text(value){
		if(this.#debug) console.log('SET: text');
		if(undefined !== value && null !== value && value.length > 0) {
			this.#text_value = value;
			const span = document.createElement('span');
			span.className = 'ntl-toast-message';
			span.textContent = value;
			this.#toastElem.innerHTML = '';
			this.#toastElem.appendChild(span);
		}
	}
	/**
	 * Sets the HTML content of the toast (overrides text)
	 * @param {string} value - The HTML string to display (caller must sanitize to prevent XSS)
	 */
	set html(value){
		if(this.#debug) console.log('SET: html');
		// WARNING: Uses innerHTML - caller is responsible for sanitizing input to prevent XSS
		if(undefined !== value && null !== value && value.length > 0)
			this.#toastElem.innerHTML = `<span class="ntl-toast-message">${value}</span>`;
	}
	/**
	 * Sets the custom icon SVG path content
	 * @param {string} value - SVG inner content (path elements)
	 */
	set icon(value) {
		if(this.#debug) console.log('SET: icon');
		if (value !== undefined && value !== null) {
			this.#customIcon = value;
		}
	}
	/**
	 * Sets the custom icon color
	 * @param {string} value - CSS color value
	 */
	set iconColor(value) {
		if(this.#debug) console.log('SET: iconColor');
		if (value !== undefined && value !== null) {
			this.#toastElem.style.setProperty('--ntl-icon-color', value);
		}
	}
	/**
	 * Sets the visual theme of the toast
	 * @param {string} value - Theme name ('light', 'solid', 'dark')
	 */
	set theme(value){
		if(this.#debug) console.log('SET: theme');
		this.#theme = validateOption(value, VALID_THEMES, 'light', 'theme');
	}
	/**
	 * Sets the notification type and applies corresponding styles/icon
	 * @param {string} value - Type name ('default', 'info', 'success', 'warning', 'error', 'custom')
	 */
	set type(value){
		if(this.#debug) console.log('SET: type');
		this.#type = validateOption(value, VALID_TYPES, 'default', 'type');

		this.#toastElem.setAttribute('aria-live',
			(this.#type === 'error' || this.#type === 'warning') ? 'assertive' : 'polite'
		);

		// Base config for all predefined types
		let typeStyles = {
			color: 'hsla(224, 15%, 20%, 1)',
			iconColor: 'hsla(224, 15%, 20%, 1)',
			afterColor: 'hsla(224, 15%, 20%, 1)',
			bgColor: 'hsla(255, 100%, 100%, 1)',
			progBarLength: 0,
			progBarHeight: 3,
			border: '1px solid hsla(250, 50%, 90%, 1)'
		};

		// Apply type/theme specific config if not custom
		if(this.#type !== 'custom' && TYPE_CONFIGS[this.#type]?.[this.#theme]) {
			typeStyles = { ...typeStyles, ...TYPE_CONFIGS[this.#type][this.#theme] };
		}

		// Add icon for types that have one
		const iconName = TYPE_ICONS[this.#type];
		if(iconName) {
			const iconHTML = this.#getIconHTML(iconName);
			this.#toastElem.innerHTML = `<div class="ntl-grid ntl-toast-content"><span>${iconHTML}</span>${this.#toastElem.innerHTML}</div>`;
		}

		// Add custom icon for 'custom' type
		if (this.#type === 'custom' && this.#customIcon) {
			const iconHTML = `<svg class="ntl-svg-icon" viewBox="0 0 24 24" aria-hidden="true">${this.#customIcon}</svg>`;
			this.#toastElem.innerHTML = `<div class="ntl-grid ntl-toast-content"><span>${iconHTML}</span>${this.#toastElem.innerHTML}</div>`;
		}

		// Apply all CSS properties
		this.#applyCSSProperties(typeStyles);
	}
	/**
	 * Sets custom CSS variable overrides
	 * @param {Object} value - Object with CSS property names (without --ntl- prefix) and values
	 */
	set style(value){
		if(this.#debug) console.log('SET: style');
		Object.entries( value ).forEach(([property, value]) => {
			this.#toastElem.style.setProperty(`--ntl-${property}`, value);
		});
	}
	/**
	 * Sets the position of the toast on screen
	 * @param {string} value - Position string (e.g., 'top-right', 'bottom-center', 'middle-left')
	 */
	set position(value){
		if(this.#debug) console.log('SET: position');
		value = validateOption(value, VALID_POSITIONS, 'top-right', 'position');

		// Mirror position for RTL
		if (this.#isRTL) {
			value = value.replace('-left', '__LEFT__')
				.replace('-right', '-left')
				.replace('__LEFT__', '-right');
		}

		this.#position_value = value;

		const current_toast_container = this.#toastElem.parentElement,
			selector = `.ntl-toast-container[data-position="${value}"]`,
			toast_container = document.querySelector(selector) ?? createContainer(value);

		if (NotiToast.#globalConfig.newestOnTop) {
			toast_container.prepend(this.#toastElem);
		} else {
			if(value.includes('bottom'))
				toast_container.prepend(this.#toastElem);
			else
				toast_container.append(this.#toastElem);
		}

		if(null === current_toast_container || current_toast_container.hasChildNodes()) return;
		current_toast_container.remove();
	}
	set onOpen(value){
		if(this.#debug) console.log('SET: onOpen');
		if(typeof value === 'string')
			value = funcParser(value);
		if(typeof value === 'function')
			this.#onOpen = ()=>{ value(this.#toastElem); };
	}
	set onClose(value){
		if(this.#debug) console.log('SET: onClose');
		if(typeof value === 'string')
			value = funcParser(value);
		if(typeof value === 'function')
			this.#onClose = ()=>{ value(this.#toastElem); };
	}
	set canClose(value){
		if(this.#debug) console.log('SET: canClose');
		this.#toastElem.classList.toggle('ntl-can-close', value);
		if(value) {
			this.#toastElem.setAttribute('tabindex', '0');
			this.#toastElem.setAttribute('aria-label', 'Notification. Press Escape to dismiss.');
			this.#handleKeyDown = (e) => {
				if(e.key === 'Escape') {
					this.#toastElem.dispatchEvent(this.#dynamic_remove_event);
				}
			};
			this.#toastElem.addEventListener('keydown', this.#handleKeyDown);
			this.#triggerCloseAnimationOn('click');
		}
		else {
			this.#toastElem.removeAttribute('tabindex');
			this.#toastElem.removeAttribute('aria-label');
			if(this.#handleKeyDown) {
				this.#toastElem.removeEventListener('keydown', this.#handleKeyDown);
			}
			this.#triggerCloseAnimationOn('timeout');
		}
	}
	set autoClose(value){
		if(this.#debug) console.log('SET: autoClose');
		value = parseInt(value);
		if(!isNaN(value) && value <= 0) {
			ntlConsoleWarning({
				message: `Invalid autoClose value "${value}". Must be a positive number. Disabling autoClose.`
			});
			value = NaN;
		}
		this.#autoClose_elapsedTime = 0;
		this.#autoClose_duration = value;
		this.#autoCloseIsActive = (!isNaN(value));
		if(!this.#autoCloseIsActive) return;

		let lastExecutionTime = null;
		this.#autoCloseCountDown = (currentAnimationFrameTime)=>{
			if(this.#recoverFocus) {
				lastExecutionTime = null;
				this.#recoverFocus = false;
			}

			if(this.#isNotPaused && null !== lastExecutionTime){
				this.#autoClose_elapsedTime += (currentAnimationFrameTime - lastExecutionTime);
				this.#progressBarLength = 1 - ( this.#autoClose_elapsedTime / this.#autoClose_duration );
				if(this.#autoClose_elapsedTime >= this.#autoClose_duration){
					this.#toastElem.dispatchEvent(this.#dynamic_remove_event);
					return;
				}
			}
			lastExecutionTime = currentAnimationFrameTime;
			this.#autoClose_animationFrame = requestAnimationFrame(this.#autoCloseCountDown);
		};
	}
	/**
	 * Sets the animation configuration for the toast
	 * @param {Object} animation - Animation configuration object
	 * @param {string} [animation.type='none'] - Animation type ('none', 'slide', 'fade', 'bounce', 'zoom')
	 * @param {number} [animation.duration_ms] - Animation duration in milliseconds
	 */
	set animation(animation){
		if(this.#debug) console.log('SET: animation');
		animation.type = validateOption(animation.type, VALID_ANIMATIONS, 'none', 'animation type');
		if(animation.duration_ms !== undefined && (isNaN(animation.duration_ms) || animation.duration_ms <= 0)) {
			ntlConsoleWarning({
				message: `Invalid animation duration "${animation.duration_ms}". Must be a positive number. Defaulting to 500ms.`
			});
			animation.duration_ms = 500;
		}
		this.#hasAnimation = VALID_ANIMATIONS.includes(animation.type) && animation.type !== 'none';
		if(this.#debug) console.log('hasAnimation:', this.#hasAnimation);
		if(this.#hasAnimation){
			this.#setCSSAnimationVariables(animation);
			this.#animationClass = `ntl-${animation.type}`;
			this.#toastElem.classList.toggle(this.#animationClass, this.#hasAnimation);
			if(this.#debug) console.log('added:', this.#animationClass);

			this.#runAnimation = () =>{
				if(this.#debug) console.log('running: Show()');
				this.#animation_animationFrame = requestAnimationFrame(() => {
					this.#toastElem.classList.add('ntl-show');
					if(this.#debug) {
						console.log('added:', 'ntl-show');
						console.log('classList:', this.#toastElem.classList);
					}
				});
				this.#toastElem.addEventListener('transitionend', (e)=>{
					if(this.#debug) {
						console.log('EVENT:', e);
						console.log('transitionEnd');
					}
					if(!this.#toastElem.classList.contains('ntl-show'))
						this.#remove();
				});
			};
		}
	}
	set pauseOnHover(value){
		if(this.#debug) console.log('SET: pauseOnHover');
		if(value){
			this.#toastElem.addEventListener('mouseover', this.#handleMouseOver);
			this.#toastElem.addEventListener('mouseleave', this.#handleMouseLeave);
		}
		else{
			this.#toastElem.removeEventListener('mouseover', this.#handleMouseOver);
			this.#toastElem.removeEventListener('mouseleave', this.#handleMouseLeave);
		}
	}
	set showProgressBar(value){
		if(this.#debug) console.log('SET: showProgressBar');
		if(typeof value === 'string')
			value = (value.toLowerCase() === 'true');
		if(typeof value === 'boolean') {
			this.#toastElem.classList.toggle('ntl-progress-bar', value);
			this.#progressBarIsActive = value;
			if (value && !isNaN(this.#autoClose_duration)) {
				this.#progressBarUpdate = () => {
					if (this.#isNotPaused) {
						this.#toastElem.style.setProperty('--ntl-progress-bar-length', this.#progressBarLength);
					}
					this.#progressBar_animationFrame = requestAnimationFrame(this.#progressBarUpdate);
				}
			}
		}
	}
	set pauseOnFocusLoss(value) {
		if(this.#debug) console.log('SET: pauseOnFocusLoss');
		if (value) {
			document.addEventListener("visibilitychange", this.#checkVisibilityState)
		} else {
			document.removeEventListener("visibilitychange", this.#checkVisibilityState)
		}
	}
	/**
	 * Sets action buttons for the toast
	 * @param {Array} value - Array of action objects [{label, onClick, close, className}]
	 */
	set actions(value) {
		if(this.#debug) console.log('SET: actions');
		if (!Array.isArray(value) || value.length === 0) return;

		if (this.#actionsContainer) {
			this.#actionsContainer.remove();
			this.#actionCleanup.forEach(fn => fn());
			this.#actionCleanup = [];
		}

		this.#actionsContainer = document.createElement('div');
		this.#actionsContainer.className = 'ntl-toast-actions';

		value.forEach((action) => {
			if (!action.label) return;

			const btn = document.createElement('button');
			btn.className = 'ntl-toast-action-btn';
			if (action.className) btn.classList.add(action.className);
			btn.textContent = action.label;
			btn.setAttribute('type', 'button');

			const handler = (e) => {
				e.stopPropagation();
				if (typeof action.onClick === 'function') {
					action.onClick(this.#toastElem);
				}
				if (action.close) {
					this.close();
				}
			};

			btn.addEventListener('click', handler);
			this.#actionCleanup.push(() => btn.removeEventListener('click', handler));
			this.#actionsContainer.appendChild(btn);
		});

		this.#toastElem.appendChild(this.#actionsContainer);
	}
	/**
	 * Sets the group identifier for toast grouping
	 * @param {string} value - Group identifier
	 */
	set group(value) {
		if(this.#debug) console.log('SET: group');
		if (value === undefined || value === null) return;
		this.#group = String(value);
	}
	/**
	 * Sets the count displayed in the group badge
	 * @param {number} value - Count to display
	 */
	set count(value) {
		if(this.#debug) console.log('SET: count');
		if (value === undefined || value === null) return;
		this.#count = parseInt(value);
		if (this.#toastElem) {
			let badge = this.#toastElem.querySelector('.ntl-group-badge');
			if (!badge) {
				badge = document.createElement('span');
				badge.className = 'ntl-group-badge';
				this.#toastElem.appendChild(badge);
			}
			badge.textContent = this.#count;
		}
	}
	/**
	 * Sets RTL mode
	 * @param {boolean|undefined} value - true for RTL, false for LTR, undefined for auto-detect
	 */
	set rtl(value) {
		if(this.#debug) console.log('SET: rtl');
		if (typeof value === 'boolean') {
			this.#isRTL = value;
		} else {
			this.#isRTL = this.#detectRTL();
		}
		this.#toastElem.classList.toggle('ntl-rtl', this.#isRTL);
		if (this.#isRTL) {
			this.#toastElem.setAttribute('dir', 'rtl');
		} else {
			this.#toastElem.removeAttribute('dir');
		}
	}
	set debug(value){
		if(this.#debug) console.log('SET: debug');
		if(typeof value === 'string')
			value = (value.toLowerCase() === 'true');
		if(typeof value === 'boolean')
			this.#debug = value;
	}
	/*endregion*/

	/*region METHODS */
	#init(){
		if(this.#debug) console.group('INIT()');
		this.#checkVisibilityState = ()=>{
			this.#recoverFocus = document.visibilityState === "visible";
		};
		if(this.#debug) console.groupEnd();
	}
	#create(){
		if(this.#debug) console.group('CREATE()');
		this.#toastElem = document.createElement('div');
		this.#toastElem.classList.add('ntl-toast');
		this.#toastElem.setAttribute('role', 'alert');
		this.#toastElem.setAttribute('aria-live', 'polite');
		this.#toastElem.setAttribute('aria-atomic', 'true');
		if(this.#debug) console.groupEnd();
	}
	#detectRTL() {
		const htmlDir = document.documentElement.getAttribute('dir');
		if (htmlDir) return htmlDir.toLowerCase() === 'rtl';
		const bodyDir = document.body.getAttribute('dir');
		if (bodyDir) return bodyDir.toLowerCase() === 'rtl';
		return getComputedStyle(document.body).direction === 'rtl';
	}
	#applyCSSProperties(styleConfig){
		Object.entries(CSS_PROPERTY_MAP).forEach(([configKey, cssVar]) => {
			if (styleConfig[configKey] !== undefined) {
				this.#toastElem.style.setProperty(cssVar, styleConfig[configKey]);
			}
		});
	}
	#getIconHTML(iconName){
		if (INLINE_ICONS[iconName]) {
			return `<svg class="ntl-svg-icon" viewBox="0 0 24 24" aria-hidden="true">${INLINE_ICONS[iconName]}</svg>`;
		}
		// Fallback to external file for custom icons
		return `<svg class="ntl-svg-icon" aria-hidden="true"><use xlink:href="./lib/svg/symbols.svg#${iconName}"/></svg>`;
	}
	#triggerCloseAnimationOn(event){
		this.#dynamic_remove_event = new Event(event);
		this.#toastElem.addEventListener(event, ()=>{
			if(this.#debug) console.log('hasAnimation:', this.#hasAnimation);
			if(this.#hasAnimation) {
				this.#toastElem.classList.remove('ntl-show');
				if(this.#debug){
					console.log('removed:', 'ntl-show');
					console.log('classList:', this.#toastElem.classList);
				}
			}else{
				if(this.#debug) console.log('hasAnimation:', this.#hasAnimation);
				this.#remove();
			}
		}, false);
	}
	#setCSSAnimationVariables(animation){
		if(undefined !== animation.duration_ms)
			this.#toastElem.style.setProperty('--ntl-duration-ms', animation.duration_ms);
	}
	#showImmediate() {
		this.#isVisible = true;
		this.#isQueued = false;
		if(this.#debug){
			console.log('HasAnimation:', this.#hasAnimation);
			console.log('ProgressBar:', this.#progressBarIsActive);
			console.log('AutoClose:', this.#autoCloseIsActive);
		}
		// Double rAF ensures DOM is ready before animation starts (replaces setTimeout hack for Firefox)
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				this.#onOpen();
				if(this.#hasAnimation) {
					this.#runAnimation();
					const resolveOpen = () => {
						if (this.#openResolve) {
							this.#openResolve();
							this.#openResolve = null;
						}
					};
					this.#toastElem.addEventListener('transitionend', resolveOpen, { once: true });
				} else {
					this.#toastElem.classList.add('ntl-show');
					if (this.#openResolve) {
						this.#openResolve();
						this.#openResolve = null;
					}
				}
				if(this.#autoCloseIsActive) {
					this.#autoClose_animationFrame = requestAnimationFrame(this.#autoCloseCountDown);
					if(this.#progressBarIsActive)
						this.#progressBar_animationFrame = requestAnimationFrame(this.#progressBarUpdate);
				}
			});
		});
	}
	#animateStackReposition() {
		const container = this.#toastElem.parentElement;
		if (!container) return;

		const toasts = Array.from(container.querySelectorAll('.ntl-toast'));
		const toastIndex = toasts.indexOf(this.#toastElem);
		if (toastIndex === -1) return;

		const movingToasts = toasts.filter((t, i) => i !== toastIndex);
		const positions = movingToasts.map(t => t.getBoundingClientRect());

		this.#toastElem.remove();

		movingToasts.forEach((toast, i) => {
			const newRect = toast.getBoundingClientRect();
			const deltaY = positions[i].top - newRect.top;
			if (Math.abs(deltaY) > 1) {
				toast.style.transform = `translateY(${deltaY}px)`;
				toast.style.transition = 'none';
				// Force reflow
				toast.offsetHeight;
				toast.style.transition = 'transform 200ms ease-out';
				toast.style.transform = 'translateY(0)';
				toast.addEventListener('transitionend', () => {
					toast.style.transform = '';
					toast.style.transition = '';
				}, { once: true });
			}
		});
	}
	#remove(){
		if(this.#debug) console.group('REMOVE()');
		this.#onClose();

		const toast_container = this.#toastElem.parentElement;
		cancelAnimationFrame(this.#progressBar_animationFrame);
		cancelAnimationFrame(this.#autoClose_animationFrame);
		cancelAnimationFrame(this.#animation_animationFrame);
		if(this.#handleKeyDown) {
			this.#toastElem.removeEventListener('keydown', this.#handleKeyDown);
		}
		this.#actionCleanup.forEach(fn => fn());
		this.#actionCleanup = [];

		// Animate stack repositioning (FLIP technique)
		this.#animateStackReposition();

		this.#isVisible = false;
		NotiToast.#unregister(this, this.#position_value);

		if (this.#group && NotiToast.#groups.get(this.#group) === this) {
			NotiToast.#groups.delete(this.#group);
		}

		if(this.#previouslyFocusedElement && this.#previouslyFocusedElement.focus) {
			this.#previouslyFocusedElement.focus();
		}

		if (this.#closeResolve) {
			this.#closeResolve();
			this.#closeResolve = null;
		}

		if(this.#debug) console.log('toast-removed');
		if(this.#debug) console.groupEnd();
		if(toast_container && toast_container.hasChildNodes()) return;
		if(toast_container) toast_container.remove();
		if(this.#debug) console.log('container-removed');
	}
	/**
	 * Updates the toast configuration with new options
	 * @param {Object} options - Configuration options to update (same as constructor options)
	 */
	update(options){
		if(this.#debug) console.group('UPDATE()');
		// Process icon/iconColor first so they're available when type setter runs
		if (options.icon !== undefined) this.icon = options.icon;
		if (options.iconColor !== undefined) this.iconColor = options.iconColor;

		let can_close = false, auto_close = false;
		Object.entries( options ).forEach(([key, value]) => {
			if (key === 'icon' || key === 'iconColor') return;
			this[key] = value;
			if(key === 'canClose') can_close = value;
			if(key === 'autoClose') auto_close = value;
		});
		if(!can_close && !auto_close && undefined !== this['canClose']) {
			this['canClose'] = true;
			ntlConsoleWarning({
				message: 'autoClose and canClose were both set to false. To prevent un desire behaviour canClose has been set to TRUE.',
			});
		}
		if(this.#debug) console.groupEnd();
	}
	/**
	 * Displays the toast notification
	 * @returns {Promise} Resolves when the toast is visible
	 */
	open(){
		return new Promise((resolve) => {
			this.#openResolve = resolve;
			this.#previouslyFocusedElement = document.activeElement;

			// Handle toast grouping
			if (this.#group) {
				const existingGroupToast = NotiToast.#groups.get(this.#group);
				if (existingGroupToast && existingGroupToast.#isVisible) {
					const newCount = this.#count || ((existingGroupToast.#count || 1) + 1);
					existingGroupToast.count = newCount;
					if (this.#text_value) {
						existingGroupToast.text = this.#text_value;
					}
					resolve();
					return;
				}
				NotiToast.#groups.set(this.#group, this);
			}

			// Check queue constraints
			if (!NotiToast.#canShow(this, this.#position_value)) {
				if (NotiToast.#globalConfig.preventDuplicates) {
					resolve();
					return;
				}
				NotiToast.#enqueue(this, this.#position_value);
				return;
			}

			NotiToast.#register(this, this.#position_value);
			this.#showImmediate();
		});
	}
	/**
	 * Manually closes the toast notification
	 * @returns {Promise} Resolves when the toast is removed
	 */
	close(){
		return new Promise((resolve) => {
			this.#closeResolve = resolve;
			// If queued but not yet visible, remove from queue directly
			if (this.#isQueued && !this.#isVisible) {
				const queue = NotiToast.#queue.get(this.#position_value);
				if (queue) {
					const idx = queue.indexOf(this);
					if (idx !== -1) queue.splice(idx, 1);
					if (queue.length === 0) NotiToast.#queue.delete(this.#position_value);
				}
				this.#isQueued = false;
				if (this.#openResolve) {
					this.#openResolve();
					this.#openResolve = null;
				}
				resolve();
				return;
			}
			this.#toastElem.dispatchEvent(this.#dynamic_remove_event);
		});
	}
	/*endregion*/
}

function createContainer(position){
	const toast_container = document.createElement('div');
	toast_container.classList.add('ntl-toast-container');
	toast_container.dataset.position = position;
	document.body.append(toast_container);
	return toast_container;
}
function ntlConsoleWarning(params){
	const { message = "", } = params;

	console.group("Noti-Toast-Library Warning");
	console.warn(message);
	console.groupEnd();
}
