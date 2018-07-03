var cron = require('cron');
var connect = require('./connect.js')
var cronJob = cron.job("* 30 11 * * 0-6", function(){
    
    connect.generateSwiftAuth;
    console.log("sent");
}); 
cronJob.start();