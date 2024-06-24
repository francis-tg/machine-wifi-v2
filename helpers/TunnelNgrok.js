const ngrok = require("ngrok");
const db = require("../models");
require("dotenv").config({ path: "../.env" });
/**
 *
 * @param {string} token
 * @returns
 */
const setToken = (token) => {
	return ngrok.authtoken(token);
};

/**
 *
 * @returns
 */
const getNgrokUrl = async () => {
	const serverData = await db.Server_data.findOne({ where: { id: 1 } ,raw :true});
	console.log(serverData)
	const token = serverData.ngrok_token == "" || serverData.ngrok_token == undefined ? process.env.NGROK_AUTH_TOKEN : serverData.ngrok_token 
	console.log(token)
	setToken(token);
	const {ngrok_port} = await db.Server_data.findOne({where:{id:1}})
	const portServer = ngrok_port == null || ngrok_port == undefined ? process.env.PORT || 4000 : ngrok_port
	console.log(portServer)
	let url = ""
	if(portServer == 22)
	{
		url = await ngrok.connect({proto: 'tcp', addr: 22})
	}else
	{
		url = await ngrok.connect(portServer || 4000);
	}
	await db.Server_data.update({ ngrok_port: portServer }, { where: { id: 1 } });
	return url;
	//return null;
};

const setPublicUrl = async () => {
	const url = await getNgrokUrl();
	console.log(url);
	if (url !== null) {
		await db.Server_data.update({ ngrok_address: url }, { where: { id: 1 } });
		return url;
	}
};
module.exports = { setPublicUrl, getNgrokUrl };
