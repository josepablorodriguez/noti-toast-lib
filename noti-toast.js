const DEFAULT_OPTIONS = {
	text: 'Hello, Toast!',
	html: '',
	position: 'top-right',
	style: {
		'background-color': 'darkseagreen',
		border: '2px solid #333',
	},
	canClose: true,
	autoClose: 25000,
	onClose: ()=>{},
	showProgressBar: true,
	pauseOnHover: true,
	pauseOnFocusLoss: true,
	animation: {
		type: 'slide',
		duration_ms: 1000,
	},
};

export default class NotiToast {
	/*region PRIVATE VARS*/

	#toastElem; //ok

	#checkVisibilityState = ()=>{};

	#autoClose_duration;
	#autoClose_elapsedTime;
	#autoClose_animationFrame;

	#progressBarLength = 1;
	#progressBar_animationFrame;

	#removeBinded;

	#animated;
	#animationClass;
	#animation_animationFrame;
	#dinamyc_remove_event;

	#isNotPaused = true;
	#isReturningFromPause = false;

	/*endregion*/
	constructor(options) {
		this.create();
		this.init();
		this.update( {...DEFAULT_OPTIONS, ...options} );
	}

	/*region SETTERS*/
	set text(value){
		this.#toastElem.textContent = value;
	}
	set html(value){
		this.#toastElem.innerHTML = value;
	}
	set style(value){
		Object.entries( value ).forEach(([property, value]) => {
			this.#toastElem.style.setProperty(`--${property}`, value);
		});
	}
	set position(value){
		//select the current Toast container and position it, OR create it and position it.
		const current_toast_container = this.#toastElem.parentElement,
			selector = `.ntl-toast-container[data-position="${value}"]`,
			toast_container = document.querySelector(selector) ?? createContainer(value);

		toast_container.append(this.#toastElem);
		if(null === current_toast_container || current_toast_container.hasChildNodes()) return;
		current_toast_container.remove();
	}
	set canClose(value){
		this.#toastElem.classList.toggle('ntl-can-close', value);
		if(value) {
			this.triggerCloseAnimationOn('click')
		}
		else {
			this.triggerCloseAnimationOn('timeout');
		}
	}
	set autoClose(value){
		this.#autoClose_elapsedTime = 0;
		this.#autoClose_duration = value;
		if(false === value) return;

		let lastExecutionTime = null;
		const autoClose_countDown = (currentAnimationFrameTime)=>{
			if(this.#isReturningFromPause){
				lastExecutionTime = null;
				this.#isReturningFromPause = false;
			}
			if(null === lastExecutionTime){
				lastExecutionTime = currentAnimationFrameTime;
				this.#autoClose_animationFrame =
					requestAnimationFrame(autoClose_countDown);
				return;
			}
			if(this.#isNotPaused){
				this.#autoClose_elapsedTime += currentAnimationFrameTime - lastExecutionTime;
				this.#progressBarLength = 1 - ( this.#autoClose_elapsedTime / this.#autoClose_duration );
				if(this.#autoClose_elapsedTime >= this.#autoClose_duration){
					this.#toastElem.dispatchEvent(this.#dinamyc_remove_event);
					return;
				}
			}

			lastExecutionTime = currentAnimationFrameTime;
			this.#autoClose_animationFrame = requestAnimationFrame(autoClose_countDown);
		};
		this.#autoClose_animationFrame = requestAnimationFrame(autoClose_countDown);
	}
	set animation(value){
		this.#toastElem.classList.toggle('ntl-animated', value);
		if(value && value.type){
			this.setCSSanimationVariables(value);

			const setAnimation = animation_class =>{
				this.#animated = true;
				this.#animationClass = animation_class;
				this.#animation_animationFrame = requestAnimationFrame(() => {
					this.#toastElem.classList.add(animation_class);
				});
				this.#toastElem.addEventListener('transitionend', ()=>{
					if(!this.#toastElem.classList.contains(animation_class)) {
						this.remove();
						//this.#removeBinded
					}
				});
			};
			const removeAnimation = ()=>{
				this.#animated = false;
				this.#animationClass = null;
				cancelAnimationFrame(this.#animation_animationFrame);
				this.#toastElem.classList.remove('ntl-animated');
				this.#toastElem.removeEventListener('transitionend', ()=>{
					if(!this.#toastElem.classList.contains(type)) {
						this.remove();
					}
				});
			}

			switch (value.type){
				case 'slide': setAnimation('ntl-slide'); break;
				case 'fade' : setAnimation('ntl-fade' ); break;
				default: removeAnimation(); break;
			}
		}
		else {
			this.#animated = false;
		}
	}
	set pauseOnHover(value){
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
		this.#toastElem.classList.toggle('ntl-progress-bar', value);
		if(value && !isNaN(this.#autoClose_duration)){
			const progressBar_update = ()=>{
				if(this.#isNotPaused){
					this.#toastElem.style.setProperty( '--progress_bar_length', this.#progressBarLength );
				}
				this.#progressBar_animationFrame = requestAnimationFrame(progressBar_update);
			}
			this.#progressBar_animationFrame = requestAnimationFrame(progressBar_update);
		}
	}
	set pauseOnFocusLoss(value) {
		if (value) {
			document.addEventListener("visibilitychange", this.#checkVisibilityState)
		} else {
			document.removeEventListener("visibilitychange", this.#checkVisibilityState)
		}
	}
	/*endregion*/

	/*region METHODS*/
	init(){
		console.group('INIT()');
		this.#removeBinded = this.remove.bind(this);

		this.#checkVisibilityState = ()=>{
			this.#isReturningFromPause = document.visibilityState === "visible";
		};
		console.groupEnd();
	}
	create(){
		console.group('CREATE()');
		this.#toastElem = document.createElement('div');
		this.#toastElem.classList.add('ntl-toast');
		console.groupEnd();
	}
	update(options){
		console.group('UPDATE()');
		let can_close, auto_close;
		Object.entries( options ).forEach(([key, value]) => {
			this[key] = value;
			if(key === 'canClose') can_close = value;
			if(key === 'autoClose') auto_close = value;
		});
		if(!can_close && !auto_close) {
			this.canClose = true;
			ntlConsoleWarning({
				message: 'autoClose and canClose were both set to false. To prevent undesire behaviour canClose has been set to TRUE.',
			});
		}
		console.groupEnd();
	}
	triggerCloseAnimationOn(event){
		this.#dinamyc_remove_event = new Event(event);
		this.#toastElem.addEventListener(event, ()=>{
			if(this.#animated) {
				this.#toastElem.classList.remove(this.#animationClass);
			}else{
				this.remove();
			}
		}, false);
	}
	setCSSanimationVariables(data){
		if(data.type === 'slide') {
			this.#toastElem.style.setProperty('--transition_type', 'transform');
			if(undefined !== data.duration_ms)
				this.#toastElem.style.setProperty('--time_ms', data.duration_ms);
		}
		if(data.type === 'fade'){
			this.#toastElem.style.setProperty('--translate_value', '0');
			this.#toastElem.style.setProperty('--transition_type', 'opacity');
			if(undefined !== data.duration_ms)
				this.#toastElem.style.setProperty('--time_ms', data.duration_ms);
		}
	}
	remove(){
		console.group('REMOVE()');
		const toast_container = this.#toastElem.parentElement;
		cancelAnimationFrame(this.#animation_animationFrame);
		cancelAnimationFrame(this.#progressBar_animationFrame);
		cancelAnimationFrame(this.#autoClose_animationFrame);

		this.#toastElem.remove();
		this.onClose();
		console.groupEnd();
		if(toast_container.hasChildNodes()) return;
		toast_container.remove();
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
