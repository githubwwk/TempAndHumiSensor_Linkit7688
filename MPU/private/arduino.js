var firmata = require('firmata'),
     moment = require('moment'),
     assert = require('assert'),
         db = require('./db.js');

var g_strHumidity = "N/A";
var g_strTemperature = "N/A";
var g_strMoment = "N/A";


var DHT11_READ_CMD = 0x99;
var ledPin = 13;


exports.init = function()
{

	var board = new firmata.Board("/dev/ttyS0", function(err) {
	    if (err) {
	        console.log(err);
	        board.reset();
	        return;
	    }

	    console.log('connected...');
        console.log('board.firmware: ', board.firmware);

         board.pinMode(ledPin, board.MODES.OUTPUT);
	});

	board.on("ready", function() {
	   console.log("board ready");

	   var maxBytesToRead = 4;
	   var HW_SERIAL1 = board.SERIAL_PORT_IDs.HW_SERIAL1;
	   console.log("Start Read..." + HW_SERIAL1);
       
       board.sysexCommand([DHT11_READ_CMD]);  

	   board.serialRead(HW_SERIAL1, maxBytesToRead, function(data) {
	     console.log("serialRead+++");
	     console.log(new Buffer(data).toString("ascii"));
	   });

	   board.on("string", function (message) {
	     console.log("string");
	     console.log(message);
	     console.log(new Buffer(message).toString("ascii"));
	   });

	   board.sysexResponse(DHT11_READ_CMD, function(recv_data){
	    //console.log("sysexResponse+++");
	    //console.dir(recv_data)
	    //console.log(new Buffer(recv_data).toString("ascii"));
	    var data_list = (new Buffer(recv_data).toString("ascii")).split(';');   
	    g_strHumidity = data_list[0];
	    g_strTemperature = data_list[1];
	    g_strMoment = moment().utcOffset(8).format("YYYY-MM-DD HH:mm:ss");	   
        
        /* remove space */
        g_strHumidity = g_strHumidity.trim();
        g_strTemperature = g_strTemperature.trim();
        g_strMoment = g_strMoment.trim();

        console.log("after trim [Time]:" + g_strMoment + " [Humidity]:" + g_strHumidity + " [Temperature]:" + g_strTemperature + "");	  

        //console.log("db.collectionEx:" + db.collectionEx);

	    db.collectionEx.insert({Time: g_strMoment,
	    	                 Humi: g_strHumidity,
	    	                 Temp: g_strTemperature}
	                         , function(err, result) {
	                               assert.equal(null, err);
	      
	                         });
	   }); /* board.on("ready") */

	   var interval = setInterval(function() {
	     //console.log("Send CMD to read data from DHT11");
	     board.sysexCommand([DHT11_READ_CMD]);     
	   }, 60*1000 );  	   	   
   });
};

exports.latestDHT11Data = function()
{
   var result = {};
   result.time = g_strMoment;
   result.temp = g_strTemperature;
   result.humi = g_strHumidity;

   return result;
};