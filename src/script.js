import NotiToast from './noti-toast.js';
window.showNotiToast = function (config = {}){
	window.notiToast = new NotiToast(config);

	if(config.hasOwnProperty('steps')){
		window.notiToast.tourGuideStart();
	}
	else{
		window.notiToast.open();
	}
};