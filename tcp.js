const net = require('net');
const port = 8080;
const host = "192.168.1.69";


// Create instance of server 
const server = net.createServer(onClientConnection);

// CSV writer 
const createCsvWriter = require('csv-writer').createArrayCsvWriter;

const csvWriterZero = createCsvWriter({
    path: 'public/data/live/data0.csv',
    header: ['TIME', 'NODEUUID', 'BLEUUID', 'RSSI', 'PACKETID']
});

const csvWriterOne = createCsvWriter({
    path: 'public/data/live/data1.csv',
    header: ['TIME', 'NODEUUID', 'BLEUUID', 'RSSI', 'PACKETID']
});

const csvWriterTwo = createCsvWriter({
    path: 'public/data/live/data2.csv',
    header: ['TIME', 'NODEUUID', 'BLEUUID', 'RSSI', 'PACKETID']
});

const csvWriterThree = createCsvWriter({
    path: 'public/data/live/data3.csv',
    header: ['TIME', 'NODEUUID', 'BLEUUID', 'RSSI', 'PACKETID']
});

// Start listening with the server on given port and host.
server.listen(port, host, function() {
	console.log(`server started on port ${port} at ${host}`);
});


// Declare connection listener function
function onClientConnection(sock){
	// Log when a client connects.
	console.log(`${sock.remoteAddress}:${sock.remotePort} Connected`);
	// Listen for data from the connected client.
	sock.on('data', function(data){
			//Log data from the client
			let today = new Date();
			let time = today.getHours()+":"+today.getMinutes()+":"+today.getSeconds();
			let RSSI = `${data[0]}`;
			let BLEUUID = `${data[1]}:${data[2]}:${data[3]}:${data[4]}:${data[5]}:${data[6]}`;
			let NodeUUID = `${data[7]}:${data[8]}:${data[9]}:${data[10]}:${data[11]}:${data[12]}`;
			let PacketID =  `${data[13]}:${data[14]}:${data[15]}:${data[16]}:${data[17]}:${data[18]}:${data[19]}:${data[20]}`;
			
			console.log(`${sock.remoteAddress}:${sock.remotePort} Says : 
			RSSI = ${RSSI}
			BLEUUID = ${BLEUUID}
			NodeUUID = ${NodeUUID}
			PacketID = ${PacketID}
			Time = ${time}`);
			console.log()

			let record = [[time, NodeUUID, BLEUUID, RSSI, PacketID]];

			if(data[12] == 14) {
				csvWriterThree.writeRecords(record).then( console.log("data Three written"));       // returns a promise
			} else if(data[12] == 11) {
				csvWriterOne.writeRecords(record).then( console.log("data One written"));       // returns a promise
			} else if (data[12] == 12){
				csvWriterTwo.writeRecords(record).then( console.log("data Two written"));       // returns a promise
			} else if (data[12] == 10){
				csvWriterZero.writeRecords(record).then( console.log("data Zero written"));       // returns a promise
			}

			
		});
		
	// Handle client connection termination.
	sock.on('close', function() {
			console.log(`${sock.remoteAddress}:${sock.remotePort} Terminated the connection `);
		});
		
	// Hande client conenction error.
	sock.on('error', function(error){
			console.error(`${sock.remoteAddress}:${sock.remotePort} Connection Error ${error}`);
		});
};
