import NotiToast from './src/noti-toast.js';
import jsonToHTML from './lib/jsonToHTMLParser.js';

let currentConfigFile = null;

document.querySelector('.ntl-parse-button').addEventListener('click', ()=>{
	const nodes = document.querySelectorAll('.ntl-grid-config-template > .ntl-node'),
		jsonToHtml = new jsonToHTML({debug: false}); /* you can pass {debug: true} as a JSON parameter */

	currentConfigFile = getConfigFile(nodes);
	let code = document.getElementsByTagName('code')[0];

	jsonToHtml.parse(currentConfigFile).insertInto(code);

	let notiToast = new NotiToast(currentConfigFile);
	notiToast.open();

	//setTimeout(()=>{ notiToast.close(); }, 2000);
});

document.getElementById('copyJson').addEventListener('click', (e)=>{
	const btn = e.currentTarget;
	if(!currentConfigFile) {
		NotiToast.warning('Generate a configuration first by clicking "Show Noti-Toast"');
		return;
	}
	const jsonText = JSON.stringify(currentConfigFile, null, 2);
	navigator.clipboard.writeText(jsonText).then(()=>{
		btn.classList.add('copied');
		btn.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`;
		setTimeout(()=>{
			btn.classList.remove('copied');
			btn.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>`;
		}, 2000);
	}).catch(()=>{
		NotiToast.error('Failed to copy to clipboard');
	});
});
function getConfigFile(nodes){
	let configFile = {};

	nodes.forEach((node)=>{
		const checkbox = node.querySelector('input[type="checkbox"]');
		if(checkbox.checked){
			configFile[ checkbox.id ] = (()=>{
				const lastChild = node.lastElementChild;

				if(lastChild.tagName !== 'DIV')
					return lastChild.value;

				const subNodes = lastChild.querySelectorAll('.ntl-node');
				return getConfigFile(subNodes);
			})();
		}
	});
	return configFile;
}

// ============================================
// Phase 4: New Features Demo
// ============================================

// 4.1 Queue Management
document.getElementById('btnApplyConfig')?.addEventListener('click', () => {
	const maxToasts = parseInt(document.getElementById('maxToasts').value) || 5;
	const newestOnTop = document.getElementById('newestOnTop').checked;
	const preventDuplicates = document.getElementById('preventDuplicates').checked;

	const config = NotiToast.config({
		maxToasts,
		newestOnTop,
		preventDuplicates
	});

	NotiToast.success(`Config applied: max=${config.maxToasts}, newestOnTop=${config.newestOnTop}, preventDuplicates=${config.preventDuplicates}`);
});

document.getElementById('btnSpawnMany')?.addEventListener('click', () => {
	for (let i = 1; i <= 5; i++) {
		setTimeout(() => {
			new NotiToast({
				text: `Toast #${i}`,
				type: ['info', 'success', 'warning', 'error', 'default'][i - 1],
				autoClose: 5000,
				canClose: true,
				animation: { type: 'slide', duration_ms: 300 }
			}).open();
		}, i * 200);
	}
});

document.getElementById('btnClearAll')?.addEventListener('click', () => {
	NotiToast.clearAll();
});

// 4.3 Action Buttons
document.getElementById('btnActions')?.addEventListener('click', () => {
	new NotiToast({
		text: 'File "report.pdf" deleted',
		type: 'warning',
		autoClose: false,
		canClose: false,
		animation: { type: 'slide', duration_ms: 300 },
		actions: [
			{
				label: 'Undo',
				onClick: () => NotiToast.success('File restored!'),
				close: true
			},
			{
				label: 'Dismiss',
				close: true
			}
		]
	}).open();
});

// 4.4 Toast Grouping
let groupCounter = 0;
document.getElementById('btnGroup')?.addEventListener('click', () => {
	groupCounter++;
	new NotiToast({
		text: `New message received (#${groupCounter})`,
		type: 'info',
		group: 'messages',
		count: groupCounter,
		autoClose: 8000,
		canClose: true,
		animation: { type: 'slide', duration_ms: 300 }
	}).open();
});

// 4.5 RTL Support
document.getElementById('btnRTL')?.addEventListener('click', () => {
	new NotiToast({
		text: 'مرحبا بالعالم! هذا إشعار تجريبي',
		type: 'info',
		rtl: true,
		position: 'top-right',
		autoClose: 5000,
		canClose: true,
		animation: { type: 'slide', duration_ms: 300 }
	}).open();
});

// 4.6 Custom Icons
document.getElementById('btnCustomIcon')?.addEventListener('click', () => {
	new NotiToast({
		text: 'Custom rocket notification!',
		type: 'custom',
		icon: '<path d="M12 2.5c1.1 0 2 .9 2 2v3.5l3.5 2.1c.3.2.5.5.5.9v2c0 .4-.3.7-.7.6l-3.3-.8v2.5l1 .8c.2.1.3.4.3.6v1.3c0 .3-.2.5-.5.5h-5.6c-.3 0-.5-.2-.5-.5v-1.3c0-.2.1-.5.3-.6l1-.8v-2.5l-3.3.8c-.4.1-.7-.2-.7-.6v-2c0-.4.2-.7.5-.9l3.5-2.1v-3.5c0-1.1.9-2 2-2z"/>',
		iconColor: '#ff6600',
		autoClose: 5000,
		canClose: true,
		animation: { type: 'zoom', duration_ms: 300 }
	}).open();
});

// 4.2 Promise-Based API
document.getElementById('btnPromise')?.addEventListener('click', async () => {
	const toast = new NotiToast({
		text: 'Loading... (will close in 2 seconds)',
		type: 'info',
		autoClose: false,
		animation: { type: 'fade', duration_ms: 300 }
	});

	await toast.open();
	console.log('Toast is now visible');
	NotiToast.success('Toast opened! Check console.');

	setTimeout(async () => {
		await toast.close();
		console.log('Toast has been closed');
		NotiToast.info('Toast closed! Check console.');
	}, 2000);
});

// 4.8 Stacking Animations
document.getElementById('btnStacking')?.addEventListener('click', () => {
	const messages = [
		'First toast - click me!',
		'Second toast - click me!',
		'Third toast - click me!',
		'Fourth toast - click me!'
	];

	messages.forEach((msg, i) => {
		setTimeout(() => {
			new NotiToast({
				text: msg,
				type: 'default',
				autoClose: 15000,
				canClose: true,
				animation: { type: 'slide', duration_ms: 300 }
			}).open();
		}, i * 300);
	});

	setTimeout(() => {
		NotiToast.info('Click any toast to see smooth stack reposition!');
	}, messages.length * 300 + 500);
});
