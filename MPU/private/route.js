var Engine = require('tingodb')(),
    moment = require('moment'),
    ardino = require('./arduino.js'), 
        fs = require('fs'),   
        db = require('./db.js');

//=====================================
// API
//=====================================

console.logCopy = console.log.bind(console);

console.log = function(data)
{
    var currentDate = '[' + moment().format('HH:mm:ss') + '] ';
    this.logCopy(currentDate, data);
};

//=====================================
// Export API
//=====================================
exports.main = function(req,res){

    console.log("route.main()+");

    /* Load database */
    

    //db.collectionEx.find({'Time':{$regex: /2016-10-2*/}}).toArray(function(err, results) {
    db.collectionEx.find().toArray(function(err, results) {
        
        console.log("route.main() done");

        res.render( 'main', {
                db_data : results 
                });	
        
    });   
};

exports.statisticMenu = function(req, res)
{
    console.log("route.statisticMenu()+");

    /* Load database */
   
    db.collectionEx.find({'Time':{$regex: /2016-10-2*/}}).toArray(function(err, results) {

        res.render( 'envMenu', {
                db_data : results 
                });	
    });

};

exports.statisticResult = function(req, res)
{
    console.log("route.statisticResult()+");
    
    var select_date_str = "";
    if ((req.query.date != "") && (req.query.date !== undefined)) {
        select_date_str = req.query.date;      
    }else {    	
        select_date_str = 'all';
    }
    console.log("select_date_str:" + select_date_str);

    /* Load database */
         
    //db.collectionEx.find({'Time':{$regex: /2016-10-2*/}}).toArray(function(err, results) {
    //    res.render( 'envStatistic', {
    //            db_data : results 
    //            });	
    //});
    var db_path = '/Media/USB-A1/';

	fs.readFile(db_path + 'dht11_tingodb_collection', 'utf8', function(err, data){
	  if(err){
	     return console.log(err);
	  }
	  var lines = data.split('\n');
	  var results = [];

	  console.log("Check time isSame()");
	  for (var index in lines)
	  {         
	  	 if(lines[index].indexOf('{"Time"') > -1)
	  	 {
	  		//console.log(line);
	  		var item = JSON.parse(lines[index]);  		
	  		//console.log('time:' + item.Time + ' temp:' + item.Temp + ' humi:' + item.Humi);
	  		item.Humi = item.Humi.trim();
	  		item.Temp = item.Temp.trim();
	  		//var select_date = moment(select_date_str);
	  		//console.log("date diff:" + moment(item.Time).isSame(select_date, 'days') + ' date:' + item.Time);	  		
            if((item.Time.indexOf(select_date_str) > -1) || (select_date_str == 'all'))
            {
	  			if (item.Humi != '0' || item.Temp != '0')  /* Check invalide data */
	  			{
	  		   		results.push(item);
	  			}
	  		}
	  	 }
	  } /* for */
       
      console.log("Shirnk Data"); 
      console.log("data length:" + results.length);
      /* Shirnk data */
      var mod_value = 1;
	  if (results.length > (800*2))
	  {
	     var mod_value = parseInt(results.length / (800)); /* 800 is chart width pixal */
	  }
	  console.log('mod_value:' + mod_value);
      
      var filter_result = [];
	  for (var index in results)
	  {
         if ((index % mod_value) != 0)
         {
            /* skip data */
            //console.log('skip index:' + (index % mod_value));
            continue;            
         }else{
            //console.log('index:' + index);
            filter_result.push(results[index]); 
         }

	  }
	  
	  console.log("Done");

      res.render( 'envStatistic', {
                db_data : filter_result 
                });	

	

	}); 
};

exports.current = function(req, res){

   console.log("route.current()+");

   var result = ardino.latestDHT11Data();
   

   if (req.query.autoTimeUpdate == 'true')
   {
   	   console.log("req.query.autoTimeUpdate  Done");
       res.status(200).send({result:result});
        
   }else { 
       console.log("req.query.current Done");
	   res.render( 'envCurrent', {
	               result : result 
	               });	
	}	   
};
