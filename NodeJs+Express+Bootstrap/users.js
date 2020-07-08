var express = require('express');
var router = express.Router();
var appKey = "mengting-mattycc-PRD-12eb6be68-c6612eba"
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())
var request=require('request');
var http = require('http');
var axios = require("axios");
 
const  cors = require('cors')
 app.use(cors())
 app.listen(8080, function () {
   console.log('start')
 })

app.all("*",function(req,res,next){
    // 防止undefined 报错
  if(!req.headers.origin){
    return
  }
     //设置允许跨域的域名，*代表允许任意域名跨域
     res.header("Access-Control-Allow-Origin","*");
    //  例如 允许百度跨域， 把上面这行的*替换为 https://baidu.com
     //允许的header类型
     res.header("Access-Control-Allow-Headers","content-type");
     //跨域允许的请求方式 
     res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
     if (req.method.toLowerCase() == 'options'){
      res.sendStatus(200);  //让options预验证尝试请求快速结束
     }
     else{
      next();
     }
 })
//   app.post('/cors',(req,res)=> {
//   res.send('ok')
// })

app.post('/', async (req, res, next) =>
{
	console.log("jaja");
	
	var forms = req.body;
	// try
	// {	
		let obj = {};
		console.log("post");
		console.log(forms);
		let ebayUrl = buildUrl(forms,res);
		console.log(ebayUrl);
		axios.get(ebayUrl).then(function (response){
			console.log("zizi");
			console.log(response.data);
			body = response.data;
			if(body["findItemsAdvancedResponse"][0]["ack"][0] == "Failure"){
				obj.result = "Failure"
				res.send(obj);
			}else if(body["findItemsAdvancedResponse"][0]["searchResult"][0]["@count"] == "0"){
				obj.result = "No Result Found"
				res.send(obj);
			}else{
				// console.log(body);
				let jj = fi(body);
				res.send(jj);
			}
		})
		return res;
});


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

// app.get('/users', async (req, res, next) =>
// {
// 	// try
// 	// {
//     console.log(req.originalUrl);
//     ebayUrl = "";
//     ebayUrl += "https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsAdvanced&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=mengting-mattycc-PRD-12eb6be68-c6612eba&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&paginationInput.entriesPerPage=100&keywords=";
//     i = -1;

//     jsondata = [];
//     console.log("keke");
//     // console.log("req", req.originalUrl);
//     let url = req.originalUrl;
//     s=url.replace("?","?&").split("&");
//     console.log(s);
//     for (var j=1;j<s.length;j++) {
//       let pair = s[j].split("=");
//       console.log(pair);
//       // jsondata.push(jj);
//       // if(pair[0] == variable){return pair[1];}
//       if(pair[0] =="Keywords"){
//         ebayUrl += pair[1];
//       }else if(pair[0]=="MinPrice"){
//         i += 1;
// 		ebayUrl += "&itemFilter(" + i + ").name=MinPrice&itemFilter(" + i
// 		     + ").value=" + pair[1] + "&itemFilter(" + i + ").paramName=Currency&itemFilter(" + i + ").paramValue=USD";
//       }else if(pair[0]=="MaxPrice"){
//         i += 1;
// 		ebayUrl += "&itemFilter(" + i + ").name=MaxPrice&itemFilter(" +
// 		    i + ").value=" + pair[1] + "&itemFilter(" + i + ").paramName=Currency&itemFilter(" + i + ").paramValue=USD";
//       }else if(pair[0]=="Condition"){
//         ebayUrl += "&itemFilter(" + i + ").name=Condition";
//             if(pair[1]=="New"){
//               ebayUrl += "itemFilter(" + i + ").value(0)=1000";
//             }else if(pair[1] == "Used"){
//               ebayUrl += "&itemFilter(" + i + ").value(0)=3000";
//             }else if(pair[1]=="Very Good"){
//               ebayUrl += "&itemFilter(" + i + ").value(0)=4000";
//             }else if(pair[1]=="Good"){
//               ebayUrl += "&itemFilter(" + i + ").value(0)=5000";
//             }else if(pair[1]=="Acceptable")
//             ebayUrl += "&itemFilter(" + i + ").value(0)=6000";
//       }else if(pair[0]=="Shipping"){
//         if(pair[1]=="Free"){
//           		i += 1;
//           	    ebayUrl += "&itemFilter(" + i + ").name=FreeShippingOnly&itemFilter(" + i + ").value=true";
//             }else if(pair[1]=="Expedite")
//             {
//           		i += 1;
//               ebayUrl += "&itemFilter(" + i + ").name=ExpeditedShippingType&itemFilter(" + i + ").value=Expedited";
//           	}
//       }else if(pair[0]=="sortOrder"){
//         if (pair[1] == "Best Match"){sortOrder = "BestMatch";}
//         else if (pair[1] =="Price: highest first"){sortOrder = "CurrentPriceHighest";}
//         else if (pair[1] =="Price + Shipping: highest first"){sortOrder = "PricePlusShippingHighest";}
//         else{sortOrder = "PricePlusShippingLowest";}
//         ebayUrl += "&sortOrder=" + sortOrder;
//       }
// }
// console.log(ebayUrl);
// request(ebayUrl, function (error, response, body) {

//         if (!error && response.statusCode == 200) {
//             // console.log(body);
//             bodyJson = JSON.parse(body);
//             response = bodyJson;
//             console.log("zizi")
//             res.send(bodyJson);
//             // console.log(typeof bodyJson);
//         }    
// })
// 	});



// app.listen(8000, function () {
// 	console.log('start')
//   })
// app.listen(3001);
//
function fi(bodyJson){
	y = 0;
	json = [];
	ack = bodyJson["findItemsAdvancedResponse"][0]["ack"];
	count = bodyJson["findItemsAdvancedResponse"][0]["searchResult"]["@count"];
			
			if(ack=="Success" && count != "0"){
				let items = bodyJson["findItemsAdvancedResponse"][0]["searchResult"][0]["item"];
				console.log("haha23");
				for(var i in items){
					if("title" in items[i] && "galleryURL" in items[i] && "viewItemURL" in items[i]  && "__value__" in items[i]["sellingStatus"][0]['currentPrice'][0] && "location" in items[i] && "categoryName" in items[i]['primaryCategory'][0] && "condition" in items[i] && "conditionDisplayName" in items[i]['condition'][0] && "shippingType" in items[i]['shippingInfo'][0] && 'shippingServiceCost' in items[i]['shippingInfo'][0] && '__value__' in items[i]['shippingInfo'][0]['shippingServiceCost'][0] && "shipToLocations" in items[i]['shippingInfo'][0] && "expeditedShipping" in items[i]['shippingInfo'][0] && "oneDayShippingAvailable" in items[i]['shippingInfo'][0] && "bestOfferEnabled" in items[i]['listingInfo'][0] && "buyItNowAvailable" in items[i]['listingInfo'][0] && "listingType" in items[i]['listingInfo'][0] && "gift" in items[i]['listingInfo'][0] && "watchCount" in items[i]['listingInfo'][0]){
						console.log(++y);
						let Title = items[i]['title'][0];
						let Image = items[i]['galleryURL'][0];
						if(Image=="https://thumbs1.ebaystatic.com/pict/04040_0.jpg"){
							Image="https://csci571.com/hw/hw8/images/ebayDefault.png";
						}
						let Link = items[i]['viewItemURL'][0];
						let Price = items[i]['sellingStatus'][0]['currentPrice'][0]['__value__'];
						let Location = items[i]['location'][0];
						let Category = items[i]['primaryCategory'][0]['categoryName'][0];
						let Condition = items[i]['condition'][0]['conditionDisplayName'][0];
						let ShippingType = items[i]['shippingInfo'][0]['shippingType'][0];
						let ShippingCost = items[i]['shippingInfo'][0]['shippingServiceCost'][0]['__value__'];
						let ShiptoLocations = items[i]['shippingInfo'][0]['shipToLocations'][0];
						let ExpeditedShipping = items[i]['shippingInfo'][0]['expeditedShipping'][0];
						let OneDayShippingAvailable = items[i]['shippingInfo'][0]['oneDayShippingAvailable'][0];
						let BestOfferEnabled = items[i]['listingInfo'][0]['bestOfferEnabled'][0];
						let BuyItNowAvailable = items[i]['listingInfo'][0]['buyItNowAvailable'][0];
						let ListingType = items[i]['listingInfo'][0]['listingType'][0];
						let Gift = items[i]['listingInfo'][0]['gift'][0];
						let WatchCount = items[i]['listingInfo'][0]['watchCount'][0];
						let jsonData = {
							"BtnID": "id"+y,
							"Title": Title,
							"Image" : Image,
							"Link" : Link,
							"Price" : Price,
							"Location" : Location,
							"Category" : Category,
							"Condition" : Condition,
							"ShippingType" : ShippingType,
							"ShippingCost" : ShippingCost,
							"ShiptoLocations" : ShiptoLocations,
							"ExpeditedShipping" : ExpeditedShipping,
							"OneDayShippingAvailable" : OneDayShippingAvailable,
							"BestOfferEnabled" : BestOfferEnabled,
							"BuyItNowAvailable" : BuyItNowAvailable,
							"ListingType" : ListingType,
							"Gift" : Gift,
							"WatchCount" : WatchCount
						}
						console.log(jsonData);
						json.push(jsonData);
						}
					}
					if(y==0){
						obj = {};
						obj.result="No Result Found";
						return obj;
					}else{
						return json;
					}
				}
				// return json;
			}
// }




function buildUrl(forms, res) {
	ebayUrl = "";
	keywords = forms['inputKwd'];
	minprice = forms['inputMin'];
	maxprice = forms['inputMax'];
	c1 = forms['condiCheck1'];
	c2 = forms['condiCheck2'];
	c3 = forms['condiCheck3'];
	c4 = forms['condiCheck4'];
	c5 = forms['condiCheck5'];
	sc = forms['sellerCheck'];
	s1 = forms['shipCheck1'];
	s2 = forms['shipCheck2'];

	if (forms['sort'] === "Best Match"){sortOrder = "BestMatch";}
	else if (forms['sort'] ==="Price: highest first"){sortOrder = "CurrentPriceHighest";}
	else if (forms['sort'] ==="Price + Shipping: highest first"){sortOrder = "PricePlusShippingHighest";}
	else{sortOrder = "PricePlusShippingLowest";}
	ebayUrl += "https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsAdvanced&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=" + appKey + "&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&keywords=";
	ebayUrl += keywords + "&paginationInput.entriesPerPage=100" + "&sortOrder=" + sortOrder;
	i = -1;
	if(minprice !=''){
		i += 1;
		ebayUrl += "&itemFilter(" + i + ").name=MinPrice&itemFilter(" + i
		     + ").value=" + minprice + "&itemFilter(" + i + ").paramName=Currency&itemFilter(" + i + ").paramValue=USD";
	}
	if(maxprice !=''){
		i += 1;
		ebayUrl += "&itemFilter(" + i + ").name=MaxPrice&itemFilter(" +
		    i + ").value=" + maxprice + "&itemFilter(" + i + ").paramName=Currency&itemFilter(" + i + ").paramValue=USD";
	}
	if(c1 != '' || c2 != '' || c3 != '' || c4 != '' || c5 != ''){
		i += 1;
		ebayUrl += "&itemFilter(" + i + ").name=Condition";
		let k = -1;
		if(c1 != ''){
			k += 1;
			ebayUrl += "itemFilter(" + i + ").value(" + k + ")=1000";
		}
	
		if(c2 != ''){
			k += 1;
			ebayUrl += "&itemFilter(" + i + ").value(" + k + ")=3000";
		}
	
		if(c3 != ''){
			k += 1;
			ebayUrl += "&itemFilter(" + i + ").value(" + k + ")=4000";
		}
	
		if(c4 != ''){
			k += 1;
			ebayUrl += "&itemFilter(" + i + ").value(" + k + ")=5000";
		}
	
		if(c5 != ''){
			k += 1;
			ebayUrl += "&itemFilter(" + i + ").value(" + k + ")=6000";
		}
	}
	
	if(sc != ''){
		i += 1;
	    ebayUrl += "&itemFilter(" + i + ").name=ReturnsAcceptedOnly&itemFilter(" + i + ").value=true";
	}

	if(s1 != ''){
		i += 1;
	    ebayUrl += "&itemFilter(" + i + ").name=FreeShippingOnly&itemFilter(" + i + ").value=true";
	}

	if(s2 != ''){
		i += 1;
	    ebayUrl += "&itemFilter(" + i + ").name=ExpeditedShippingType&itemFilter(" + i + ").value=Expedited";
	}

	return ebayUrl;
}


module.exports = app;