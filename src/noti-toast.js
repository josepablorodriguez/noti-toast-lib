import funcParser from "../lib/parseFunction.js";

const DEFAULT_OPTIONS = {
	debug: false,
	text: undefined,
	html: undefined,
	position: 'top-right',
	theme: 'light',
	type: 'default',
	style: {
		//'background-color': 'white',
		//'border': '1px solid hsla(60, 2%, 74%, 1)',
		//'color': 'hsla(0, 0%,0%, 1)',
	},
	canClose: true,
	classes: {},
	autoClose: false,
	onClose: ()=>{},
	showProgressBar: false,
	pauseOnHover: false,
	pauseOnFocusLoss: false,
	animation: {
		type: 'none',
		duration_ms: 10,
	},
};

export default class NotiToast {
	/*region PRIVATE VARS */
	#toastElem;

	#theme;
	#type;
	#classes;

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

	#tourSteps;
	#tourButtons;
	#currentTourStep = 0;
	#tourBoundHandler;

	#debug;
	/*endregion*/

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
			type.color = type.iconColor = type.afterColor = 'hsla(224, 15%, 20%, 1)';
			type.bgColor = 'hsla(255, 100%, 100%, 1)';
			type.borderColor = 'hsla(250, 50%, 90%, 1)';
			type.progBarLength = 0;
			type.progBarHeight = 3;
			type.border = `1px solid ${ type.borderColor }`;
		}

		if(this.#type === 'info') {
			if(this.#theme === 'light') {
				type.color = type.iconColor = type.afterColor = type.progBarBgColor = 'hsla(200, 70%, 55%, 1)';
				type.bgColor = 'hsla(200, 70%, 85%, 1)';
				type.borderColor = 'hsla(200, 70%, 30%, 1)';
				type.border = `1px solid ${ type.borderColor }`;
			}
			else if(this.#theme === 'solid') {
				type.color = type.iconColor = type.progBarBgColor = 'hsla(200, 70%, 85%, 1)';
				type.bgColor = 'hsla(200, 70%, 55%, 1)';
			}
			else if(this.#theme === 'dark') {
				type.color = 'hsla(200, 70%, 85%, 1)';
				type.bgColor = 'hsla(200, 70%, 7%, 1)';
				type.borderColor = 'hsla(200, 70%, 20%, 1)';
				type.iconColor = type.progBarBgColor = 'hsla(200, 70%, 55%, 1)';
				type.border = `1px solid ${ type.borderColor }`;
			}
			this.#toastElem.innerHTML =
				`<div class="ntl-grid ntl-toast-content"><span>
					<svg class="ntl-svg-icon" aria-hidden="true" title="">
						<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/scripts/noti-toast-lib/lib/svg/symbols.svg#info"/>
					</svg>
				</span>${this.#toastElem.innerHTML}</div>`.replace(/[\r\n\t]/gm, '');
		}
		else if(this.#type === 'success') {
			if(this.#theme === 'light'){
				type.color = type.iconColor = type.afterColor = type.progBarBgColor = 'hsla(97, 34%, 50%, 1)';
				type.bgColor = 'hsla(97, 34%, 85%, 1)';
				type.borderColor = 'hsla(122, 50%, 38%, 1)';
				type.border = `1px solid ${ type.borderColor }`;
			}
			else if(this.#theme === 'solid'){
				type.color = type.iconColor = type.progBarBgColor = 'hsla(97, 34%, 85%, 1)';
				type.bgColor = 'hsla(97, 34%, 50%, 1)';
			}
			else if(this.#theme === 'dark'){
				type.color = 'hsla(97, 34%, 85%, 1)';
				type.bgColor = 'hsla(97, 34%, 10%, 1)';
				type.borderColor = 'hsla(97, 34%, 20%, 1)';
				type.iconColor = type.progBarBgColor = 'hsla(97, 34%, 50%, 1)';
				type.border = `1px solid ${ type.borderColor }`;
			}
			this.#toastElem.innerHTML =
				`<div class="ntl-grid ntl-toast-content"><span>
					<svg class="ntl-svg-icon" aria-hidden="true" title="">
						<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/scripts/noti-toast-lib/lib/svg/symbols.svg#success"/>
					</svg>
				</span>${this.#toastElem.innerHTML}</div>`.replace(/[\r\n\t]/gm, '');
		}
		else if(this.#type === 'warning') {
			if(this.#theme === 'light'){
				type.color = type.iconColor = type.afterColor = type.progBarBgColor = 'hsla(38, 100%, 58%, 1)';
				type.bgColor = 'hsla(38, 100%, 85%, 1)';
				type.borderColor = 'hsla(38, 100%, 55%, 1)';
				type.border = `1px solid ${ type.borderColor }`;
			}
			else if(this.#theme === 'solid'){
				type.color = type.iconColor = type.afterColor = 'hsla(38, 100%, 25%, 1)';
				type.bgColor = 'hsla(38, 100%, 58%, 1)';
				type.borderColor = 'hsla(38, 100%, 20%, 1)';
				type.progBarBgColor = 'hsla(38, 100%, 85%, 1)';
				type.border = `1px solid ${ type.borderColor }`;
			}
			else if(this.#theme === 'dark'){
				type.color = 'hsla(38, 100%, 85%, 1)';
				type.bgColor = 'hsla(38, 100%, 10%, 1)';
				type.borderColor = 'hsla(38, 100%, 20%, 1)';
				type.iconColor = type.progBarBgColor = 'hsla(38, 100%, 58%, 1)';
				type.border = `1px solid ${ type.borderColor }`;
			}
			this.#toastElem.innerHTML =
				`<div class="ntl-grid ntl-toast-content"><span>
					<svg class="ntl-svg-icon" aria-hidden="true" title="">
						<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/scripts/noti-toast-lib/lib/svg/symbols.svg#warning"/>
					</svg>
				</span>${this.#toastElem.innerHTML}</div>`.replace(/[\r\n\t]/gm, '');
		}
		else if(this.#type === 'error') {
			if(this.#theme === 'light'){
				type.color = type.iconColor = type.afterColor = type.progBarBgColor = 'hsla(15, 77%, 45%, 1)';
				type.bgColor = 'hsla(15, 77%, 85%, 1)';
				type.borderColor = 'hsla(15, 77%, 35%, 1)';
				type.border = `1px solid ${ type.borderColor }`;
			}
			else if(this.#theme === 'solid'){
				type.color = type.iconColor = type.progBarBgColor = 'hsla(15, 77%, 85%, 1)';
				type.bgColor = 'hsla(15, 77%, 45%, 1)';
			}
			else if(this.#theme === 'dark'){
				type.color = 'hsla(15, 77%, 85%, 1)';
				type.bgColor = 'hsla(15, 77%, 10%, 1)';
				type.borderColor = 'hsla(15, 77%, 20%, 1)';
				type.iconColor = type.progBarBgColor = 'hsla(15, 77%, 45%, 1)';
				type.border = `1px solid ${ type.borderColor }`;
			}
			this.#toastElem.innerHTML =
				`<div class="ntl-grid ntl-toast-content"><span>
					<svg class="ntl-svg-icon" aria-hidden="true" title="">
						<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/scripts/noti-toast-lib/lib/svg/symbols.svg#clear"/>
					</svg>
				</span>${this.#toastElem.innerHTML}</div>`.replace(/[\r\n\t]/gm, '');
		}
		if(this.#type === 'default') {
			if(this.#theme === 'light'){
				type.color = type.afterColor = 'hsla(224, 15%, 20%, 1)';
				type.bgColor = 'hsla(255, 100%, 100%, 1)';
				type.borderColor = 'hsla(60, 2%, 74%, 1)';
				type.progBarBgColor = 'hsla(0, 0%, 50%, 1)';
				type.border = `1px solid ${ type.borderColor }`;
			}
			else if(this.#theme === 'solid'){
				type.color = type.iconColor = type.afterColor = type.progBarBgColor = 'hsla(224, 15%, 20%, 1)';
				type.bgColor = 'hsla(0, 0%, 50%, 1)';
				type.borderColor = 'hsla(224, 15%, 20%, 1)';
				type.border = `1px solid ${ type.borderColor }`;
			}
			else if(this.#theme === 'dark'){
				type.color = 'hsla(0, 0%, 50%, 1)';
				type.afterColor = type.progBarBgColor = 'hsla(255, 100%, 100%, 1)';
				type.bgColor = 'hsla(224, 15%, 20%, 1)';
				type.borderColor = 'hsla(60, 2%, 74%, 1)';
				type.border = `1px solid ${ type.borderColor }`;
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
	/**
	 * @param {string | numeric | boolean | null} value
	 * */
	set style(value){
		if(this.#debug) console.log('SET: style');
		Object.entries( value ).forEach(([property, value]) => {
			if(isNaN(value)){
				this.#toastElem.style.setProperty(`--ntl-${property}`, value);
			}
			else{
				if(value === 'width'){
					this.#toastElem.style.setProperty(`--ntl-${property}`, parseFloat(value));
				}
				else{
					this.#toastElem.parentNode.style.setProperty(`--ntl-${property}`, parseFloat(value));
				}
			}
		});
	}
	set position(value){
		if(this.#debug) console.log('SET: position');
		value = value.toLowerCase();
		const current_toast_container = this.#toastElem.parentElement,
			selector = `.ntl-toast-container[data-position="${value}"]`,
			toast_container = document.querySelector(selector) ?? createContainer(
				value, (this.#tourSteps ?? [{target: null}])[this.#currentTourStep].target
			);

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
	set classes(value){
		if(this.#debug) console.log('SET: classes');
		this.#classes = value;
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
	/**
	 * @param { array | null } value
	 * */
	set steps(value){
		if(this.#debug) console.log('SET: steps');
		if(value){
			this.#tourSteps = value;
		}
	}
	set content(value){
		if(this.#debug) console.log('SET: content/html');
		if(undefined !== value && null !== value && value.length > 0)
			this.#toastElem.innerHTML = `<span class="ntl-toast-message">${value}</span>`;
	}
	set buttons(value){
		if(undefined === this.#tourButtons || null === this.#tourButtons){
			this.#tourButtons = document.createElement('div');
		}

		this.#tourButtons.innerHTML  = '';
		value.forEach((btnText)=>{
			if(this.#debug) console.log('SET: buttons');

			this.#tourButtons.dataset.ntlElement = 'buttons_container';
			this.#tourButtons.classList.add('ntl-guide-buttons');

			const btn = document.createElement('button'),
				svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
				use = document.createElementNS('http://www.w3.org/2000/svg','use'),
				icons = {
					next: '/assets/icons/utility-sprite/svg/symbols.svg#right', // play, breadcrumbs
					back: '/assets/icons/utility-sprite/svg/symbols.svg#left', //undo, back
					stop: '/assets/icons/utility-sprite/svg/symbols.svg#stop',
					done: '/assets/icons/utility-sprite/svg/symbols.svg#close',
				},
				position = {
					next: 'ntl-guide-buttons_next',
					back: 'ntl-guide-buttons_back',
					stop: 'ntl-guide-buttons_stop',
					done: 'ntl-guide-buttons_stop',
				};

			use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', icons[btnText]);
			svg.classList.add('ntl-btn_icon-normal');
			svg.append(use);
			btn.type = 'button';
			btn.classList.add('ntl-btn', position[btnText]);
			btn.dataset.ntlType = btnText;
			btn.addEventListener('click', (e)=>{
				console.log('fire:', e.currentTarget.dataset.ntlType);
				switch (e.currentTarget.dataset.ntlType){
					case 'next': { this.#tourGuideNext(); break; }
					case 'back': { this.#tourGuidePrev(); break; }
					case 'stop': { this.#currentTourStep = this.#tourSteps.progBarLength; this.#tourGuideNext(); break; }
					case 'done': { this.#currentTourStep = this.#tourSteps.progBarLength; this.#tourGuideNext(); break; }
				}
			});
			btn.append(svg);

			this.#tourButtons.append(btn);
		});
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
		this.#toastElem.dataset.ntlElement = 'toast';
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

		if(this.#debug) console.log('container:', toast_container);

		if(null === toast_container || undefined === toast_container){ return; }

		if(toast_container.hasChildNodes()) {
			const containerIdx = toast_container.childNodes.length - 1 ;
			for(let idx = containerIdx; idx >= 0; --idx){
				if(toast_container.childNodes[idx]?.classList?.contains('ntl-guide-buttons')){
					const elementIdx = toast_container.childNodes[idx]?.childNodes.length - 1;
					for(let i = elementIdx; i>=0; --i){
						toast_container.childNodes[idx]?.childNodes[i].remove();
					}
					toast_container.childNodes[idx]?.remove();
					if(this.#debug) console.log('buttonsContainer:', toast_container.childNodes[idx]);
				}
				if(toast_container.childNodes[idx]?.classList?.contains('ntl-toast-arrow')){
					toast_container.childNodes[idx]?.remove();
					if(this.#debug) console.log('arrow:', toast_container.childNodes[idx]);
				}
			}
			this.#toastElem.remove();
			if(this.#debug) {
				console.log('toast:', this.#toastElem);
				console.log('toast-removed');
			}
			const describedElement = document.querySelector('.ntl-toast-guide-border');

			if(null !== describedElement) {
				describedElement.style.position = null;
				describedElement.classList.remove('ntl-toast-guide-border');

				document.removeEventListener('keydown', this.#tourBoundHandler);
				this.#tourBoundHandler = null;
			}
		}

		toast_container.remove();
		if(this.#debug) {
			console.log('container:', toast_container);
			console.log('container-removed');
		}

		if(this.#debug) console.groupEnd();
	}
	#getContainer(){
		let current_toast_container = this.#toastElem.parentElement;
		if(undefined === current_toast_container || null === current_toast_container){
			current_toast_container = document.querySelector(`div[data-ntl-element="container"]`);
		}

		return current_toast_container;
	}
	#tourGuideNext(){
		if(this.#debug) console.group('TOUR_GUIDE_NEXT()');
		this.close();
		this.#currentTourStep++;
		setTimeout(()=>{
			/*console.log('STEP-IDX:', this.#currentTourStep);
			console.log('length:', this.#tourSteps.length - 1);*/
			const step = this.#tourSteps[this.#currentTourStep];

			if (this.#currentTourStep < this.#tourSteps.length) {
				this.update(step);
				this.open();
			}
			else{
				console.log('THIS:', this);
			}

			/*const tafier = document.querySelector('.ntl-scroll-wrapper');
			console.log('TAFIER:', tafier);
			tafier?.scrollIntoView({ behavior: 'smooth' });*/
		}, 150);
		if(this.#debug) console.groupEnd();
	}
	#tourGuidePrev(){
		if(this.#debug) console.group('TOUR_GUIDE_BACK()');
		this.close();
		this.#currentTourStep--;
		setTimeout(()=>{
			const step = this.#tourSteps[this.#currentTourStep];

			if (this.#currentTourStep < (this.#tourSteps.length - 1)) {
				this.update(step);
				this.open();
			}
		}, 150);
		if(this.#debug) console.groupEnd();
	}
	#tourGuideKeyDownEvent(guide, event){
		if(guide.#debug) console.group('GUIDE_KEYDOWN_EVENT()');
		if(guide.#debug) console.log('eventKey:', event.key);

		const container = guide.#getContainer();

		if (event.key === 'ArrowRight') {
			if(guide.#currentTourStep < (guide.#tourSteps.length)) guide.#tourGuideNext();
		}
		if (event.key === 'ArrowLeft') {
			if(guide.#currentTourStep > 0) guide.#tourGuidePrev();
		}
		if (event.key === 'Escape') {
			guide.#currentTourStep = guide.#tourSteps.length; guide.#tourGuideNext();
		}

		if(guide.#debug) console.groupEnd();
	}
	tourGuideStart(){
		if(this.#debug) console.group('TOUR_GUIDE_START()');

		if (!this.#tourSteps.length) { return; }

		const step = this.#tourSteps[this.#currentTourStep];

		if (this.#currentTourStep < this.#tourSteps.length) {
			this.update(step);
			this.open();
		}

		if(this.#debug) console.groupEnd();
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
			console.log('OPEN()');
		}
		setTimeout(()=>{
			const toast_container = this.#getContainer();
			this.#onOpen();

			if(toast_container.dataset?.position.includes('bottom'))
				toast_container.prepend(this.#toastElem);
			else
				toast_container.append(this.#toastElem);

			if(undefined !== this.#tourButtons && null !== this.#tourButtons){
				//toast_container.parentElement.classList.add(this.#classes.container);
				if(toast_container.dataset?.position.includes('top')){
					toast_container.prepend(this.#tourButtons);
				}
				else{
					toast_container.append(this.#tourButtons);
				}
				this.#tourBoundHandler = this.#tourGuideKeyDownEvent.bind(null, this);
				document.addEventListener('keydown', this.#tourBoundHandler);
			}

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
		if(this.#debug){
			console.log('CLOSE()')
		}
		this.#toastElem.dispatchEvent(this.#dynamic_remove_event);
	}
	/*endregion*/

	/*region TRIGGER METHODS */

	/*endregion*/
}

function createContainer(position, target = null){
	console.group('CREATE_CONTAINER()');
	const toast_container = document.createElement('div');

	toast_container.dataset.ntlElement = 'container';
	toast_container.dataset.position = position;

	if(null !== target){
		const targetElement = document.querySelector(target),
			arrow = document.createElement('div');

		if(!target.includes('data-ntl-guide')){
			const tempArray = target.split('_');
			let tempTargetName = '';

			tempArray.forEach((str, idx)=>{
				if(idx > 0){ tempTargetName += str + '-'; }
			});
			tempTargetName += 'temp';
			targetElement.dataset.ntlGuide = tempTargetName;
		}
		targetElement.style.position = 'relative';
		targetElement.classList.add('ntl-toast-guide-border');
		//console.log('target:', targetElement);
		arrow.classList.add('ntl-toast-arrow');
		toast_container.append(arrow);
		toast_container.classList.add('ntl-toast-container');
		targetElement.append(toast_container);
	}
	else{
		toast_container.classList.add('ntl-toast-container');
		document.body.append(toast_container);
	}

	console.groupEnd()
	
	return toast_container;
}
function ntlConsoleWarning(params){
	const { message = "", } = params;

	console.group("Noti-Toast-Library Warning");
	console.warn(message);
	console.groupEnd();
}
