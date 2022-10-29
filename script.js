import NotiToast from 'src/noti-toast.js';
import jsonToHTML from 'lib/jsonToHTMLParser.js';

document.querySelector('.ntl-parse-button').addEventListener('click', ()=>{
	const nodes = document.querySelectorAll('.ntl-grid-config-template > .ntl-node'),
		jsonToHtml = new jsonToHTML({debug: false}); /* you can pass {debug: true} as a JSON parameter */

	let configFile = getConfigFile(nodes),
		code = document.getElementsByTagName('code')[0];

	jsonToHtml.parse(configFile).insertInto(code);

	let notiToast = new NotiToast(configFile);
	notiToast.open();

	//setTimeout(()=>{ notiToast.close(); }, 2000);
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
