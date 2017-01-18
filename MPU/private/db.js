var Engine = require('tingodb')();

//var db_path = './';
var db_path = '/Media/USB-A1/';

var collection;
exports.init = function()
{
	console.log("db init()+");
    var db = new Engine.Db(db_path, {});
    collection = db.collection("dht11_tingodb_collection");    
    //console.log("db.collection:" + collection);
    exports.collectionEx = collection;
};

