

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var users = require('./routes/users');
var request=require('request');
var http = require('http');

// var users = require('./routes/users');

var app = express();
const  cors = require('cors')
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())

// app.use('/api/v1/users', users);

// app.get('/', async (req, res, next) =>
// {
// 	try
// 	{
// 		console.log("niuniu");
// 		console.log("req", req.originalUrl);
// 		res = "xixi";
// 		return res
// 		// return res.json({ users: req.params.id });
// 	}
// 	catch(err)
// 	{
// 		// unexpected error
// 		return next(err);
// 	}
// });
// app.all("*",function(req,res,next){
//   // 防止undefined 报错
// if(!req.headers.origin){
//   return
// }
//    //设置允许跨域的域名，*代表允许任意域名跨域
//    res.header("Access-Control-Allow-Origin","*");
//   //  例如 允许百度跨域， 把上面这行的*替换为 https://baidu.com
//    //允许的header类型
//    res.header("Access-Control-Allow-Headers","content-type");
//    //跨域允许的请求方式 
//    res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
//    if (req.method.toLowerCase() == 'options'){
//     res.sendStatus(200);  //让options预验证尝试请求快速结束

//    }
//    else{
//     next();
//    }
// })

app.get('/users', async (req, res, next) =>
{
	// try
	// {
    res.write("haha");
    console.log(req.originalUrl);
    ebayUrl = "";
    ebayUrl += "https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsAdvanced&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=mengting-mattycc-PRD-12eb6be68-c6612eba&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&paginationInput.entriesPerPage=100&keywords=";
    i = -1;

    jsondata = [];
    console.log("keke");
    // console.log("req", req.originalUrl);
    let url = req.originalUrl;
    s=url.replace("?","?&").split("&");
    console.log(s);
    for (var j=1;j<s.length;j++) {
      let pair = s[j].split("=");
      console.log(pair);
      // jsondata.push(jj);
      // if(pair[0] == variable){return pair[1];}
      if(pair[0] =="Keywords"){
        ebayUrl += pair[1];
      }else if(pair[0]=="MinPrice"){
        i += 1;
		ebayUrl += "&itemFilter(" + i + ").name=MinPrice&itemFilter(" + i
		     + ").value=" + pair[1] + "&itemFilter(" + i + ").paramName=Currency&itemFilter(" + i + ").paramValue=USD";
      }else if(pair[0]=="MaxPrice"){
        i += 1;
		ebayUrl += "&itemFilter(" + i + ").name=MaxPrice&itemFilter(" +
		    i + ").value=" + pair[1] + "&itemFilter(" + i + ").paramName=Currency&itemFilter(" + i + ").paramValue=USD";
      }else if(pair[0]=="Condition"){
        ebayUrl += "&itemFilter(" + i + ").name=Condition";
            if(pair[1]=="New"){
              ebayUrl += "itemFilter(" + i + ").value(0)=1000";
            }else if(pair[1] == "Used"){
              ebayUrl += "&itemFilter(" + i + ").value(0)=3000";
            }else if(pair[1]=="Very Good"){
              ebayUrl += "&itemFilter(" + i + ").value(0)=4000";
            }else if(pair[1]=="Good"){
              ebayUrl += "&itemFilter(" + i + ").value(0)=5000";
            }else if(pair[1]=="Acceptable")
            ebayUrl += "&itemFilter(" + i + ").value(0)=6000";
      }else if(pair[0]=="Shipping"){
        if(pair[1]=="Free"){
          		i += 1;
          	    ebayUrl += "&itemFilter(" + i + ").name=FreeShippingOnly&itemFilter(" + i + ").value=true";
            }else if(pair[1]=="Expedite")
            {
          		i += 1;
              ebayUrl += "&itemFilter(" + i + ").name=ExpeditedShippingType&itemFilter(" + i + ").value=Expedited";
          	}
      }else if(pair[0]=="sortOrder"){
        if (pair[1] == "Best Match"){sortOrder = "BestMatch";}
        else if (pair[1] =="Price: highest first"){sortOrder = "CurrentPriceHighest";}
        else if (pair[1] =="Price + Shipping: highest first"){sortOrder = "PricePlusShippingHighest";}
        else{sortOrder = "PricePlusShippingLowest";}
        ebayUrl += "&sortOrder=" + sortOrder;
      }
}
console.log(ebayUrl);
request(ebayUrl, function (error, response, body) {

        if (!error && response.statusCode == 200) {
            // console.log(body);
            bodyJson = JSON.parse(body);
            response = bodyJson;
            console.log("zizi")
            // res.send(bodyJson);
            // console.log(typeof bodyJson);
        }    
})
	});





app.use('/api', users);
app.use('/users', users);



// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

// app.all('*', function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");
//   res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
//   res.header("X-Powered-By",' 3.2.1')
//   res.header("Content-Type", "application/json;charset=utf-8");
//   next();
// });

// app.listen(3001);

module.exports = app;
