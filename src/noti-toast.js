import funcParser from "./parseFunction/parseFunction.js";

const DEFAULT_OPTIONS = {
	debug: false,
	text: undefined,
	html: undefined,
	position: 'top-right',
	style: {
		'background-color': 'white',
		'border': '2px solid #bbb',
	},
	animation: {
		type: 'none',
		duration_ms: 200,
	},
	canClose: false,
	autoClose: false,
	onClose: ()=>{},
	showProgressBar: false,
	pauseOnHover: false,
	pauseOnFocusLoss: false,
};

export default class NotiToast {
	/*region PRIVATE VARS*/
	#toastElem;

	#checkVisibilityState = ()=>{};

	#onClose = ()=>{};
	#autoClose_duration;
	#autoClose_elapsedTime;
	#autoClose_animationFrame;
	#autoCloseCountDown;

	#progressBarLength = 1;
	#progressBarUpdate;
	#progressBar_animationFrame;

	#show;
	#animated;
	#animationClass;
	#animation_animationFrame;
	#dynamic_remove_event;
	#animationRemove;

	#isNotPaused = true;
	#isReturningFromPause = false;

	#debug;
	/*endregion*/

	constructor(options) {
		this.update({'debug': options['debug']})
		this.create();
		this.init();
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
			this.#toastElem.textContent = value;
	}
	set html(value){
		if(this.#debug) console.log('SET: html');
		if(undefined !== value && null !== value && value.length > 0)
			this.#toastElem.innerHTML = value;
	}
	set style(value){
		if(this.#debug) console.log('SET: style');
		Object.entries( value ).forEach(([property, value]) => {
			this.#toastElem.style.setProperty(`--${property}`, value);
		});
	}
	set position(value){
		if(this.#debug) console.log('SET: position');
		//select the current Toast container and position it, OR create it and position it.
		const current_toast_container = this.#toastElem.parentElement,
			selector = `.ntl-toast-container[data-position="${value}"]`,
			toast_container = document.querySelector(selector) ?? createContainer(value);

		toast_container.append(this.#toastElem);
		if(null === current_toast_container || current_toast_container.hasChildNodes()) return;
		current_toast_container.remove();
	}
	set onClose(value){
		if(this.#debug) console.log('SET: onClose');
		if(typeof value === 'string')
			value = funcParser(value);
		if(typeof value === 'function')
			this.#onClose = value;
	}
	set canClose(value){
		if(this.#debug) console.log('SET: canClose');
		this.#toastElem.classList.toggle('ntl-can-close', value);
		if(value) {
			this.triggerCloseAnimationOn('click')
		}
		else {
			this.triggerCloseAnimationOn('timeout');
		}
	}
	set autoClose(value){
		if(this.#debug) console.log('SET: autoClose');
		value = parseInt(value);
		this.#autoClose_elapsedTime = 0;
		this.#autoClose_duration = value;
		if(isNaN(value) || value === false) return;

		let lastExecutionTime = null;
		this.#autoCloseCountDown = (currentAnimationFrameTime)=>{
			if(this.#isReturningFromPause){
				lastExecutionTime = null;
				this.#isReturningFromPause = false;
			}
			if(null === lastExecutionTime){
				lastExecutionTime = currentAnimationFrameTime;
				this.#autoClose_animationFrame =
					requestAnimationFrame(this.#autoCloseCountDown);
				return;
			}
			if(this.#isNotPaused){
				this.#autoClose_elapsedTime += currentAnimationFrameTime - lastExecutionTime;
				this.#progressBarLength = 1 - ( this.#autoClose_elapsedTime / this.#autoClose_duration );
				if(this.#autoClose_elapsedTime >= this.#autoClose_duration){
					this.#toastElem.dispatchEvent(this.#dynamic_remove_event);
					return;
				}
			}
			lastExecutionTime = currentAnimationFrameTime;
			this.#autoClose_animationFrame = requestAnimationFrame(this.#autoCloseCountDown);
		};
		//this.#autoClose_animationFrame = requestAnimationFrame(this.#autoCloseCountDown);
	}
	set animation(animation){
		if(this.#debug) console.log('SET: animation');
		this.#animated = (animation.type === 'slide' || animation.type === 'fade');
		if(this.#debug) console.log('isAnimated:', this.#animated);
		if(this.#animated){
			this.setCSSAnimationVariables(animation);
			this.#animationClass = `ntl-${animation.type}`;
			this.#toastElem.classList.toggle(this.#animationClass, this.#animated);
			if(this.#debug) console.log('added:', this.#animationClass);

			this.#show = () =>{
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
						this.remove();
				});
				this.#progressBar_animationFrame = requestAnimationFrame(this.#progressBarUpdate);
				this.#autoClose_animationFrame = requestAnimationFrame(this.#autoCloseCountDown);
			};

			this.#animationRemove = ()=>{
				if(this.#debug) console.log('running: removeAnimation()')
				this.#animated = false;
				this.#animationClass = null;
				cancelAnimationFrame(this.#animation_animationFrame);
				this.#toastElem.classList.remove('ntl-animated');
				this.#toastElem.removeEventListener('transitionend', ()=>{
					if(!this.#toastElem.classList.contains('ntl-show')) {
						this.remove()
					}
				});
			}
			/*switch (animation.type){
				case 'slide': setAnimation('ntl-show'); break;
				case 'fade' : setAnimation('ntl-show' ); break;
				default: removeAnimation(); break;
			}*/
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
			value = (value === 'true');
		if(typeof value === 'boolean') {
			this.#toastElem.classList.toggle('ntl-progress-bar', value);
			if (value && !isNaN(this.#autoClose_duration)) {
				this.#progressBarUpdate = () => {
					if (this.#isNotPaused) {
						this.#toastElem.style.setProperty('--progress_bar_length', this.#progressBarLength);
					}
					this.#progressBar_animationFrame = requestAnimationFrame(this.#progressBarUpdate);
				}
				//this.#progressBar_animationFrame = requestAnimationFrame(this.#progressBarUpdate);
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
			value = (value === 'true');
		if(typeof value === 'boolean')
			this.#debug = value;
	}
	/*endregion*/

	/*region METHODS*/
	init(){
		if(this.#debug) console.group('INIT()');
		this.#checkVisibilityState = ()=>{
			this.#isReturningFromPause = document.visibilityState === "visible";
		};
		if(this.#debug) console.groupEnd();
	}
	create(){
		if(this.#debug) console.group('CREATE()');
		this.#toastElem = document.createElement('div');
		this.#toastElem.classList.add('ntl-toast');
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
	triggerCloseAnimationOn(event){
		this.#dynamic_remove_event = new Event(event);
		this.#toastElem.addEventListener(event, ()=>{
			console.log('isAnimated:', this.#animated);
			if(this.#animated) {
				this.#toastElem.classList.remove('ntl-show');
				if(this.#debug){
					console.log('removed:', 'ntl-show');
					console.log('classList:', this.#toastElem.classList);
				}
			}else{
				console.log('isAnimated:', this.#animated);
				this.remove();
			}
		}, false);
	}
	setCSSAnimationVariables(animation){
		if(undefined !== animation.duration_ms)
			this.#toastElem.style.setProperty('--time_ms', animation.duration_ms);
		/*if(animation.type === 'slide') {
			this.#toastElem.style.setProperty('--translate_value', 110);
			this.#toastElem.style.setProperty('--transition_type', 'transform');
		}
		if(animation.type === 'fade'){
			this.#toastElem.style.setProperty('--translate_value', 0);
			this.#toastElem.style.setProperty('--transition_type', 'opacity');
		}*/
	}
	remove(){
		if(this.#debug) console.group('REMOVE()');

		const toast_container = this.#toastElem.parentElement;
		cancelAnimationFrame(this.#progressBar_animationFrame);
		cancelAnimationFrame(this.#autoClose_animationFrame);
		cancelAnimationFrame(this.#animation_animationFrame);
		this.#toastElem.remove();
		console.log('toast-removed');

		if(this.#debug) console.groupEnd();
		if(toast_container.hasChildNodes()) return;
		toast_container.remove();
		console.log('container-removed');
		this.#onClose();
	}
	show(){

		switch (this.#animationClass){
		 case 'ntl-slide': this.#show('ntl-show'); break;
		 case 'ntl-fade' : this.#show('ntl-show' ); break;
		 default: this.#animationRemove(); break;
		 }
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