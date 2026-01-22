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
			bgColor: 'hsla(200, 70%, 55%, 1)',
			progBarBgColor: 'hsla(200, 70%, 85%, 1)'
		},
		dark: {
			iconColor: 'hsla(200, 70%, 55%, 1)',
			progBarBgColor: 'hsla(200, 70%, 55%, 1)',
			bgColor: 'hsla(200, 70%, 7%, 1)',
			border: '1px solid hsla(200, 70%, 20%, 1)'
		}
	},
	success: {
		light: {
			bgColor: 'hsla(122, 50%, 85%, 1)',
			color: 'hsla(122, 50%, 43%, 1)',
			iconColor: 'hsla(122, 50%, 43%, 1)',
			afterColor: 'hsla(122, 50%, 43%, 1)',
			progBarBgColor: 'hsla(122, 50%, 43%, 1)',
			border: '1px solid hsla(122, 50%, 38%, 1)'
		},
		solid: {
			bgColor: 'hsla(122, 50%, 43%, 1)',
			progBarBgColor: 'hsla(122, 50%, 85%, 1)'
		},
		dark: {
			iconColor: 'hsla(122, 50%, 43%, 1)',
			progBarBgColor: 'hsla(122, 50%, 43%, 1)',
			bgColor: 'hsla(122, 50%, 6%, 1)',
			border: '1px solid hsla(122, 50%, 20%, 1)'
		}
	},
	warning: {
		light: {
			color: 'hsla(48, 89%, 60%, 1)',
			iconColor: 'hsla(48, 89%, 60%, 1)',
			afterColor: 'hsla(48, 89%, 60%, 1)',
			progBarBgColor: 'hsla(48, 89%, 60%, 1)',
			bgColor: 'hsla(48, 89%, 95%, 1)',
			border: '1px solid hsla(48, 89%, 55%, 1)'
		},
		solid: {
			bgColor: 'hsla(48, 89%, 60%, 1)',
			color: 'hsla(48, 89%, 25%, 1)',
			iconColor: 'hsla(48, 89%, 25%, 1)',
			afterColor: 'hsla(48, 89%, 25%, 1)',
			progBarBgColor: 'hsla(48, 89%, 85%, 1)',
			border: '1px solid hsla(48, 89%, 20%, 1)'
		},
		dark: {
			iconColor: 'hsla(48, 89%, 60%, 1)',
			progBarBgColor: 'hsla(48, 89%, 60%, 1)',
			bgColor: 'hsla(48, 89%, 6%, 1)',
			border: '1px solid hsla(48, 89%, 20%, 1)'
		}
	},
	error: {
		light: {
			color: 'hsla(3, 79%, 41%, 1)',
			iconColor: 'hsla(3, 79%, 41%, 1)',
			afterColor: 'hsla(3, 79%, 41%, 1)',
			progBarBgColor: 'hsla(3, 79%, 41%, 1)',
			bgColor: 'hsla(3, 79%, 85%, 1)',
			border: '1px solid hsla(3, 79%, 35%, 1)'
		},
		solid: {
			bgColor: 'hsla(3, 79%, 41%, 1)',
			progBarBgColor: 'hsla(3, 79%, 78%, 1)'
		},
		dark: {
			iconColor: 'hsla(3, 79%, 41%, 1)',
			progBarBgColor: 'hsla(3, 79%, 41%, 1)',
			bgColor: 'hsla(3, 79%, 7%, 1)',
			border: '1px solid hsla(3, 79%, 20%, 1)'
		}
	},
	default: {
		light: {
			color: 'hsla(0, 0%, 0%, 1)',
			afterColor: 'hsla(0, 0%, 0%, 1)',
			bgColor: 'hsla(255, 100%, 100%, 1)',
			progBarBgColor: 'hsla(60, 2%, 34%, 1)',
			border: '1px solid hsla(60, 2%, 74%, 1)'
		},
		solid: {
			color: 'hsla(0, 0%, 0%, 1)',
			afterColor: 'hsla(0, 0%, 0%, 1)',
			progBarBgColor: 'hsla(0, 0%, 0%, 1)',
			bgColor: 'hsla(60, 2%, 34%, 1)',
			border: '1px solid hsla(0, 0%, 0%, 1)'
		},
		dark: {
			color: 'hsla(255, 100%, 100%, 1)',
			afterColor: 'hsla(255, 100%, 100%, 1)',
			progBarBgColor: 'hsla(255, 100%, 100%, 1)',
			bgColor: 'hsla(0, 0%, 0%, 1)',
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
	style: {
		'background-color': 'white',
		'border': '1px solid hsla(60, 2%, 74%, 1)',
		'color': 'hsla(0, 0%,0%, 1)',
	},
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

	/*region SETTERS */
	/**
	 * Sets the plain text content of the toast
	 * @param {string} value - The text to display
	 */
	set text(value){
		if(this.#debug) console.log('SET: text');
		if(undefined !== value && null !== value && value.length > 0) {
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
			color: 'hsla(250, 50%, 90%, 1)',
			iconColor: 'hsla(250, 50%, 90%, 1)',
			afterColor: 'hsla(250, 50%, 90%, 1)',
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

		// Apply all CSS properties
		this.#applyCSSProperties(typeStyles);
	}
	/**
	 * Sets custom CSS variable overrides
	 * @param {Object} value - Object with CSS property names (without --ntl- prefix) and values
	 */
	set style(value){
		if(this.#debug) console.log('SET: style');
		/*if(this.#type === 'custom')*/
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
		//select the current Toast container and position it, OR create it and position it.
		const current_toast_container = this.#toastElem.parentElement,
			selector = `.ntl-toast-container[data-position="${value}"]`,
			toast_container = document.querySelector(selector) ?? createContainer(value);

		if(value.includes('bottom'))
			toast_container.prepend(this.#toastElem);
		else
			toast_container.append(this.#toastElem);

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

		/*if(animation.type === 'slide') {
		 this.#toastElem.style.setProperty('--translate_value', 110);
		 this.#toastElem.style.setProperty('--transition_type', 'transform');
		 }
		 if(animation.type === 'fade'){
		 this.#toastElem.style.setProperty('--translate_value', 0);
		 this.#toastElem.style.setProperty('--transition_type', 'opacity');
		 }*/
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
		this.#toastElem.remove();
		if(this.#previouslyFocusedElement && this.#previouslyFocusedElement.focus) {
			this.#previouslyFocusedElement.focus();
		}
		if(this.#debug) console.log('toast-removed');

		if(this.#debug) console.groupEnd();
		if(toast_container.hasChildNodes()) return;
		toast_container.remove();
		if(this.#debug) console.log('container-removed');
	}
	/**
	 * Updates the toast configuration with new options
	 * @param {Object} options - Configuration options to update (same as constructor options)
	 */
	update(options){
		if(this.#debug) console.group('UPDATE()');
		let can_close = false, auto_close = false;
		Object.entries( options ).forEach(([key, value]) => {
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
	 */
	open(){
		this.#previouslyFocusedElement = document.activeElement;
		if(this.#debug){
			console.log('HasAnimation:', this.#hasAnimation);
			console.log('ProgressBar:', this.#progressBarIsActive);
			console.log('AutoClose:', this.#autoCloseIsActive);
		}
		// Double rAF ensures DOM is ready before animation starts (replaces setTimeout hack for Firefox)
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				this.#onOpen();
				if(this.#hasAnimation)
					this.#runAnimation();
				else
					this.#toastElem.classList.add('ntl-show');
				if(this.#autoCloseIsActive) {
					this.#autoClose_animationFrame = requestAnimationFrame(this.#autoCloseCountDown);
					if(this.#progressBarIsActive)
						this.#progressBar_animationFrame = requestAnimationFrame(this.#progressBarUpdate);
				}
			});
		});
	}
	/**
	 * Manually closes the toast notification
	 */
	close(){
		this.#toastElem.dispatchEvent(this.#dynamic_remove_event);
	}
	/*endregion*/

	/*region TRIGGER METHODS */

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