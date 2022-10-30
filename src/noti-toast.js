import funcParser from "../lib/parseFunction.js";

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
	autoClose: false,
	onClose: ()=>{},
	showProgressBar: false,
	pauseOnHover: false,
	pauseOnFocusLoss: false,
	animation: {
		type: 'none',
		duration_ms: 200,
	},
};

export default class NotiToast {
	/*region PRIVATE VARS*/
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

	#isNotPaused = true;
	#recoverFocus;

	#debug;
	/*endregion*/

	constructor(options) {
		this.update({'debug': options['debug']})
		this.#create();
		this.#init();
		this.update( {...DEFAULT_OPTIONS, ...options} );
		if(this.#debug) {
			console.log({options});
			console.log('TOAST:', this.#toastElem);
		}
	}

	/*region SETTERS*/
	set text(value){
		if(this.#debug) console.log('SET: text');
		if(undefined !== value && null !== value && value.length > 0)
			this.#toastElem.innerHTML = `<span class="ntl-toast-message">${value}</span>`;
	}
	set html(value){
		if(this.#debug) console.log('SET: html');
		if(undefined !== value && null !== value && value.length > 0)
			this.#toastElem.innerHTML = `<span class="ntl-toast-message">${value}</span>`;
	}
	set theme(value){
		if(this.#debug) console.log('SET: theme');
		this.#theme = value.toLowerCase();
	}
	set type(value){
		if(this.#debug) console.log('SET: type');
		this.#type = value.toLowerCase();

		let type = {};
		if(this.#type !== 'custom') { // general config for ALL predetermine types
			type.color = type.iconColor = type.afterColor = 'hsla(250, 50%, 90%, 1)';
			type.progBarLength = 0;
			type.progBarHeight = 3;
			type.border = '1px solid hsla(250, 50%,90%, 1)';
		}

		if(this.#type === 'info') {
			if(this.#theme === 'light') {
				//type.color = type.iconColor = type.afterColor = type.progBarBgColor = 'hsla(200, 70%, 35%, 1)';
				type.color = type.iconColor = type.afterColor = type.progBarBgColor = 'hsla(200, 70%, 55%, 1)';
				type.bgColor = 'hsla(200, 70%, 85%, 1)';
				type.border = '1px solid hsla(200, 70%, 30%, 1)';
			}
			else if(this.#theme === 'solid') {
				type.bgColor = 'hsla(200, 70%, 55%, 1)';
				type.progBarBgColor = 'hsla(200, 70%, 85%, 1)';
			}
			else if(this.#theme === 'dark') {
				type.iconColor = type.progBarBgColor = 'hsla(200, 70%, 55%, 1)';
				type.bgColor = 'hsla(200, 70%, 7%, 1)';
				type.border = '1px solid hsla(200, 70%, 20%, 1)';
			}
			this.#toastElem.innerHTML =
				`<div class="ntl-grid ntl-toast-content"><span>
					<svg class="ntl-svg-icon" aria-hidden="true" title="">
						<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="./lib/svg/symbols.svg#info"/>
					</svg>
				</span>${this.#toastElem.innerHTML}</div>`;
		}
		else if(this.#type === 'success') {
			if(this.#theme === 'light'){
				type.bgColor = 'hsla(122, 50%, 85%, 1)';
				type.color = type.iconColor = type.afterColor = type.progBarBgColor = 'hsla(122, 50%, 43%, 1)';
				type.border = '1px solid hsla(122, 50%, 38%, 1)';
			}
			else if(this.#theme === 'solid'){
				type.bgColor = 'hsla(122, 50%, 43%, 1)';
				type.progBarBgColor = 'hsla(122, 50%, 85%, 1)';
			}
			else if(this.#theme === 'dark'){
				type.iconColor = type.progBarBgColor = 'hsla(122, 50%, 43%, 1)';
				type.bgColor = 'hsla(122, 50%, 6%, 1)';
				type.border = '1px solid hsla(122, 50%, 20%, 1)';
			}
			this.#toastElem.innerHTML =
				`<div class="ntl-grid ntl-toast-content"><span>
					<svg class="ntl-svg-icon" aria-hidden="true" title="">
						<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href=".lib/svg/symbols.svg#success"/>
					</svg>
				</span>${this.#toastElem.innerHTML}</div>`;
		}
		else if(this.#type === 'warning') {
			if(this.#theme === 'light'){
				type.color = type.iconColor = type.afterColor = type.progBarBgColor = 'hsla(48, 89%, 60%, 1)';
				type.bgColor = 'hsla(48, 89%, 95%, 1)';
				type.border = '1px solid hsla(48, 89%, 55%, 1)';
			}
			else if(this.#theme === 'solid'){
				type.bgColor = 'hsla(48, 89%, 60%, 1)';
				type.color = type.iconColor = type.afterColor = 'hsla(48, 89%, 25%, 1)';
				type.progBarBgColor = 'hsla(48, 89%, 85%, 1)';
				type.border = '1px solid hsla(48, 89%,20%, 1)';
			}
			else if(this.#theme === 'dark'){
				type.iconColor = type.progBarBgColor = 'hsla(48, 89%, 60%, 1)';
				type.bgColor = 'hsla(48, 89%, 6%, 1)';
				type.border = '1px solid hsla(48, 89%, 20%, 1)';
			}
			this.#toastElem.innerHTML =
				`<div class="ntl-grid ntl-toast-content"><span>
					<svg class="ntl-svg-icon" aria-hidden="true" title="">
						<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href=".lib/svg/symbols.svg#warning"/>
					</svg>
				</span>${this.#toastElem.innerHTML}</div>`;
		}
		else if(this.#type === 'error') {
			if(this.#theme === 'light'){
				type.color = type.iconColor = type.afterColor = type.progBarBgColor = 'hsla(3, 79%, 41%, 1)';
				type.bgColor = 'hsla(3, 79%, 85%, 1)';
				type.border = '1px solid hsla(3, 79%, 35%, 1)';
			}
			else if(this.#theme === 'solid'){
				type.bgColor = 'hsla(3, 79%, 41%, 1)';
				type.progBarBgColor = 'hsla(3, 79%, 78%, 1)';
			}
			else if(this.#theme === 'dark'){
				type.iconColor = type.progBarBgColor = 'hsla(3, 79%, 41%, 1)';
				type.bgColor = 'hsla(3, 79%, 7%, 1)';
				type.border = '1px solid hsla(3, 79%, 20%, 1)';
			}
			this.#toastElem.innerHTML =
				`<div class="ntl-grid ntl-toast-content"><span>
					<svg class="ntl-svg-icon" aria-hidden="true" title="">
						<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href=".lib/svg/symbols.svg#clear"/>
					</svg>
				</span>${this.#toastElem.innerHTML}</div>`;
		}
		if(this.#type === 'default') {
			if(this.#theme === 'light'){
				type.color = type.afterColor = 'hsla(0, 0%,0%, 1)';
				type.bgColor = 'hsla(255, 100%, 100%, 1)';
				type.progBarBgColor = 'hsla(60, 2%, 34%, 1)';
				type.border = '1px solid hsla(60, 2%, 74%, 1)';
			}
			else if(this.#theme === 'solid'){
				type.color = type.afterColor = type.progBarBgColor = 'hsla(0, 0%,0%, 1)';
				type.bgColor = 'hsla(60, 2%, 34%, 1)';
				type.border = '1px solid hsla(0, 0%, 0%, 1)';
			}
			else if(this.#theme === 'dark'){
				type.color = type.afterColor = type.progBarBgColor = 'hsla(255, 100%, 100%, 1)';
				type.bgColor = 'hsla(0, 0%, 0%, 1)';
				type.border = '1px solid hsla(60, 2%, 74%, 1)';
			}
		}

		this.#toastElem.style.setProperty('--ntl-background-color', type.bgColor);
		this.#toastElem.style.setProperty('--ntl-color', type.color);
		this.#toastElem.style.setProperty('--ntl-icon-color', type.iconColor);
		this.#toastElem.style.setProperty('--ntl-after-color', type.afterColor);
		this.#toastElem.style.setProperty('--ntl-border', type.border);
		this.#toastElem.style.setProperty('--ntl-progress-bar-length', type.progBarLength);
		this.#toastElem.style.setProperty('--ntl-progress-bar-height', type.progBarHeight);
		this.#toastElem.style.setProperty('--ntl-progress-bar-background-color', type.progBarBgColor);
	}
	set style(value){
		if(this.#debug) console.log('SET: style');
		if(this.#type === 'custom')
			Object.entries( value ).forEach(([property, value]) => {
				this.#toastElem.style.setProperty(`--ntl-${property}`, value);
			});
	}
	set position(value){
		if(this.#debug) console.log('SET: position');
		value = value.toLowerCase();
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
			this.#triggerCloseAnimationOn('click')
		}
		else {
			this.#triggerCloseAnimationOn('timeout');
		}
	}
	set autoClose(value){
		if(this.#debug) console.log('SET: autoClose');
		value = parseInt(value);
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
	set animation(animation){
		if(this.#debug) console.log('SET: animation');
		animation.type = animation.type.toLowerCase();
		this.#hasAnimation = (animation.type === 'slide' || animation.type === 'fade');
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
			this.#toastElem.addEventListener('mouseover', ()=>{
				this.#isNotPaused = false;
			});
			this.#toastElem.addEventListener('mouseleave', ()=>{
				this.#isNotPaused = true;
			});
		}
		else{
			this.#toastElem.removeEventListener('mouseover', ()=>{
				this.#isNotPaused = false;
			});
			this.#toastElem.removeEventListener('mouseleave', ()=>{
				this.#isNotPaused = true;
			});
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

	/*region METHODS*/
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
		if(this.#debug) console.groupEnd();
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
		console.log({animation});
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
		this.#toastElem.remove();
		if(this.#debug) console.log('toast-removed');

		if(this.#debug) console.groupEnd();
		if(toast_container.hasChildNodes()) return;
		toast_container.remove();
		if(this.#debug) console.log('container-removed');
	}
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
	open(){
		if(this.#debug){
			console.log('HasAnimation:', this.#hasAnimation);
			console.log('ProgressBar:', this.#progressBarIsActive);
			console.log('AutoClose:', this.#autoCloseIsActive);
		}
		setTimeout(()=>{
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
		}, 50);
		//this setTimeout() hack is needed to make the animations work with Firefox
		//slide-in and fade-in animations didn't animate the toast, it just appeared in both cases,
		//but the slide-out and fade-out animations executed without a problem.
	}
	close(){
		this.#toastElem.dispatchEvent(this.#dynamic_remove_event);
	}
	/*endregion*/

	/*region TRIGGER METHODS*/

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
