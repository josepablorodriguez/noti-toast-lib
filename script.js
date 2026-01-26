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
