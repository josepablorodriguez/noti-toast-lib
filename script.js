import NotiToast from "./noti-toast.js";

document.querySelector('button').addEventListener('click', ()=>{
	const toast = new NotiToast({
		text: "BYE",
		html: `<div><u>Greet:</u></div><div>Hi, toast!</div>`,
		//autoClose: 2000,
		//canClose: false,
		//position: 'top-right',
		style: {
			'background-color': 'yellow',
			border: '4px solid #999',
		},
		//onClose: ()=>{ alert("hola"); },
		//showProgressBar: false,
		//pauseOnHover: false,
		//pauseOnFocusLoss: false,
		animation: {
			type: 'slide',
			duration_ms: 2000,
		},
		//animation: false,
	});
});
