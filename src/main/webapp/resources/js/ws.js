var host = "ws://"+document.location.host + "/chatWS/sendmsg";
var wSocket = new WebSocket(host);
wSocket.binaryType = "arraybuffer";

var browserSupport = ("WebSocket" in window) ? true : false;
function initWebSocket() {
	if (browserSupport)
	{
		wSocket.onopen = function()
		{
			console.log("******* WebSocket Aberto");
			
		};
	}
	else
	{
		alert("WebSocket is NOT supported by your Browser!");
	}

	wSocket.onmessage = function(evt)
	{
		onMessage(evt);
	};

	wSocket.onclose = function(evt)
	{	
		console.log("****** Socket Fechou!");
	};

	wSocket.onerror = function (evt){
		onError(evt);
	};
}

function sendText() {
	var inputTextArea = document.getElementById("chatPanel:insertMSG").value;
	var myNickName = document.getElementById("chatPanel:myNickName").innerHTML;
	// Melhorar o JSON (caracteres especiais e o "enter")
	var msgWS = '{"source":"' + myNickName + '", "destination": "all", "body":"'+ inputTextArea +
	'", "timestamp":"", "operation":"sendText"}';
	wSocket.send(msgWS);
}

function onMessage(evt) {
	// called when a message is received
	var receivedMsg = JSON.parse(evt.data);
	
	if (receivedMsg.operation == "addUser"){
		welcomeMSG(receivedMsg.body, receivedMsg.timestamp);
		addUserOnlinePanel(receivedMsg.source);
			
	}else if (receivedMsg.operation == "logoutUser"){
		userLogoutMSG(receivedMsg.body, receivedMsg.timestamp);
		logoutUser(receivedMsg.source);

	}else{
		addMSGArea(receivedMsg.source, receivedMsg.body, 
				receivedMsg.timestamp, receivedMsg.destination);
	}
}

function welcomeMSG(body, timestamp){
	var tableChatMSG = document.getElementById("chatPanel:chatArea");
	var newRowChatMSG = tableChatMSG.insertRow(-1);
	var newCellChatMSG = newRowChatMSG.insertCell(-1);
	var newChatMSG = document.createTextNode(timestamp+"\n"+body+"\n");
	newCellChatMSG.appendChild(newChatMSG);
	tableChatMSG.scrollTop = tableChatMSG.scrollHeight;
}

function userLogoutMSG(body, timestamp){
	var tableChatMSG = document.getElementById("chatPanel:chatArea");
	var newRowChatMSG = tableChatMSG.insertRow(-1);
	var newCellChatMSG = newRowChatMSG.insertCell(-1);
	var logoutUser = timestamp+"\n"+body+"\n";
	
	newCellChatMSG.appendChild(logoutUser);
	
	tableChatMSG.scrollTop = tableChatMSG.scrollHeight;
}

function addUserOnlinePanel(user){
	if (user != null){
		var table = document.getElementById("chatPanel:allOnlines");
		// -1 = end of table
		var newRow   = table.insertRow(-1);
		newRow.id = user; // atribuindo id na linha
		var newCell  = newRow.insertCell(-1);
		var newUser  = document.createTextNode(user);
		newCell.appendChild(newUser);
		
	}
	
	console.log("** Novo Usuário Online: " + user);
}

function addMSGArea(user, body, timestamp, destination){
	var tableChatMSG = document.getElementById("chatPanel:chatArea");
	var newRowChatMSG = tableChatMSG.insertRow(-1);
	var newCellChatMSG = newRowChatMSG.insertCell(-1);
	var chatMSG = "";

	if (destination != "all"){
		// Unicast
		chatMSG = "<b>"+user +", "+ timestamp+"<br /> MSG PRIVADA: "+body+"</b>";
	}else{
		// Broadcast
		chatMSG = user +", "+ timestamp+"<br />"+body;
	}
//	var newChatMSG = document.createTextNode(chatMSG);
	newCellChatMSG.innerHTML = chatMSG;
	tableChatMSG.scrollTop = tableChatMSG.scrollHeight;
	
	document.getElementById("chatPanel:insertMSG").value = "";
	document.getElementById("chatPanel:insertMSG").focus();
	
}

function logoutUser(user){
	console.log("*** Usuário logout: "+user);
	var userOnList = document.getElementById(user);
	userOnList.remove(userOnList);
	wSocket.onclose("logout: "+user);
}

function onError(evt) {
	console.log("Deu merda: "+evt.data);
	writeToScreen('<span style="color: red;">ERROR: </span> ' + evt.data);
	wSocket.onclose(evt);
}

function writeToScreen(msg) {
    var textArea = document.getElementById("chatPanel:chatArea");
	textArea.value += msg+"\n";
}
