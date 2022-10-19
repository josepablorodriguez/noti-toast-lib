import NotiToast from './src/noti-toast.js';
import jsonToHTML from './lib/jsonToHTMLParser.js';

document.querySelector('button').addEventListener('click', ()=>{
	const nodes = document.querySelectorAll('.configuration-settings > .node');

	let configFile = getConfigFile(nodes),
		code = document.getElementsByTagName('code')[0];

	const jsonToHtml = new jsonToHTML(/*{debug: true}*/);
	jsonToHtml.parse(configFile).insertInto(code);

	const toast1 = new NotiToast(configFile);

});
function getConfigFile(nodes){
	let configFile = {};

	nodes.forEach((node)=>{
		const chkbx = node.querySelector('input[type="checkbox"]');
		if(chkbx.checked){
			configFile[ chkbx.id ] = (()=>{
				const lastChild = node.lastElementChild;

				if(lastChild.tagName !== 'DIV')
					return lastChild.value;

				const subNodes = lastChild.querySelectorAll('.node');
				return getConfigFile(subNodes);
			})();
		}
	});
	return configFile;
}