var http = require("http");
var request = require("request")
var fs = require("fs")
var path = require("path")

var xAuth="";
var storageUrl="";
function generateSwiftAuth()
{
    var serverIp = "http://10.129.103.86:5000/";
    var requestUrl = "v3/auth/tokens"
    var requestParameter = {
        uri: serverIp + requestUrl,
        method: "POST",
        body : '\n{ "auth": {\n    "identity": {\n      "methods": ["password"],\n      "password": {\n        "user": {\n          "name": "telemet",\n          "domain": { "name": "default" },\n          "password": "telemet"\n        }\n      }\n    },\n    "scope": {\n      "project": {\n        "name": "datastore",\n        "domain": { "name": "default" }\n      }\n    }\n  }\n}'
    }
    request(requestParameter, function(error, response, body) {
        var resobj=JSON.parse(response.body)
        xAuth=response.headers['x-subject-token'];
        storageUrl=resobj.token.catalog[0].endpoints[2].url;
        storageUrl=storageUrl.replace("controller","10.129.103.86")
        if(xAuth!='')
            uploadtelemetry();
    });

}

generateSwiftAuth();

function uploadtelemetry()
{
   
    var a=storageUrl.split("/")[4];
    var file=fs.readFileSync(path.join(__dirname,"/upload/telemetry_log.txt"),null);
   console.log(a);
    var requestParameter = {
        method: "PUT",
         host: '10.129.103.86',
        port: 8080,
        path: '/v1/'+a+'/telemetry/telemetry_log.txt',
        encoding: null,
        headers : {
            'x-auth-token' : xAuth,
            'content-type' : 'image/png'  
        }          
    }
       var req = http.request(requestParameter, function(res) {
           
            console.log("\n\n");
            console.log("\n\n");
            res.on('data', function (body) {
               console.log('Body: ' + body);
            });
        });
        req.on('error', function(e) {
            console.log('problem with request: ' + e.message);
        });
req.write(file,null);
req.end();

}

module.export=generateSwiftAuth;



















//xAuth="bbc5a250343a4279bd5cfa2203eb846d"
    //storageUrl="http://10.129.103.86:8080/v1/AUTH_5b2bcbcb10f347aaa4c7b0e370c2c055";
