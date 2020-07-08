
var appKey = "mengting-mattycc-PRD-12eb6be68-c6612eba"
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// var users = require('./routes/users');
var request=require('request');
var http = require('http');
var axios = require("axios");

// var users = require('./routes/users');

var app = express();
const  cors = require('cors')
 app.use(cors())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())
app.listen(8080, function () {
  console.log('start')
})

app.all("*",function(req,res,next){
	
    // 防止undefined 报错

  // console.log("aa")
     //设置允许跨域的域名，*代表允许任意域名跨域
     res.header("Access-Control-Allow-Origin","*");
    //  例如 允许百度跨域， 把上面这行的*替换为 https://baidu.com
     //允许的header类型
     res.header("Access-Control-Allow-Headers","content-type");
     //跨域允许的请求方式 
     res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
     res.header('Content-Type', 'application/json;charset=utf-8');
      next();
 })

app.get('/haha', function(req, res) {
  res.jsonp({msg: '1111'});
})

// app.post('/', async (req, res, next) =>
// {
//   console.log("ppa");
// })
// app.use('/api/v1/users', users);

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

function ninefi(bodyJson){
  y = 0;
  num = 0;
	json = [];
	ack = bodyJson["findItemsAdvancedResponse"][0]["ack"];
	
			
			if(ack=="Success"){
        count = bodyJson["findItemsAdvancedResponse"][0]["searchResult"]["@count"];
        if(count != "0"){
				let items = bodyJson["findItemsAdvancedResponse"][0]["searchResult"][0]["item"];
				console.log("haha23");
				for(var i in items){
          if(y<50){
            if("title" in items[i] && "galleryURL" in items[i]  && "__value__" in items[i]["sellingStatus"][0]['currentPrice'][0] && 'shippingServiceCost' in items[i]['shippingInfo'][0] && '__value__' in items[i]['shippingInfo'][0]['shippingServiceCost'][0] && "shipToLocations" in items[i]['shippingInfo'][0] && "expeditedShipping" in items[i]['shippingInfo'][0] && "oneDayShippingAvailable" in items[i]['shippingInfo'][0] && "topRatedListing" in items[i]){
              ++y;
              // console.log(++y);
              let ItemID = items[i]['itemId'][0];
              let Link = items[i]['viewItemURL'][0];
              let Title = items[i]['title'][0];
              let Image = items[i]['galleryURL'][0];
              if(Image=="https://thumbs1.ebaystatic.com/pict/04040_0.jpg"){
                Image="https://csci571.com/hw/hw8/images/ebayDefault.png";
              }
              let Price = items[i]['sellingStatus'][0]['currentPrice'][0]['__value__'];
              let Condition;
              if( "condition" in items[i] && "conditionDisplayName" in items[i]['condition'][0]){
              Condition = items[i]['condition'][0]['conditionDisplayName'][0];
              }else{
              Condition = 'N/A';
              }
              let ShippingCost = items[i]['shippingInfo'][0]['shippingServiceCost'][0]['__value__'];
              let TopRatedListing = items[i]['topRatedListing'][0];
              let ShippingInfo = items[i]["shippingInfo"][0];
              let jsonData = {
                "ItemID" :ItemID,
                "BtnID": y,
                "Link" : Link,
                "Title": Title,
                "Image" : Image,
                "Price" : Price,
                "Condition" : Condition,
                "ShippingCost" : ShippingCost,
                "TopRatedListing" : TopRatedListing,
                "shippingInfo" : ShippingInfo
              }
              // console.log(jsonData);
              json.push(jsonData);
              // console.log(jsonData);
              }
              continue;
          }else{
            break;
          }
					}
					// if(y==0){
					// 	obj = {};
					// 	obj.result="No Result Found";
					// 	return obj;
					// }else{
          //   console.log(json);
					// 	return json;
					// }
        }
        // console.log(json);
      }
      return json;
    }


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

app.get('/', async (req, res, next) =>
{
  res.jsonp({msg: '2222'});
	try
	{
		console.log("niuniu");
		console.log("req", req.originalUrl);
		res = "xixi";
		return res
		// return res.json({ users: req.params.id });
	}
	catch(err)
	{
		// unexpected error
		return next(err);
	}
});


function tenfi(bodyJson){
  // console.log(bodyJson);
  num = 0;
  json = {};
  jsonFea = {};
  jsonSpeci = {};
  flag=false;
	ack = bodyJson["Ack"];
      //PictureURL 
      //title ->GetItemsAdvanced
      //price ->GetItemsAdvanced
      //shipping information ->GetItemsAdvanced
      //product feature -- subtititle/brand if both not exist not display  ->ItemSpecifics
      //specifications ->ItemSpecifics->NameValueList  if NameValueList empty/absent not display| max=5(not include name=brand)
      //icons

      // Seller Information -> Seller
      // Return Policies -> ReturnPolicy
      
      //Shipping informatio -> “shippingInfo”
			if(ack=="Success"){
        let item = bodyJson["Item"];
        // console.log(bodyJson["PictureURL"].length);
        let PictureURL = item["PictureURL"];
        console.log(PictureURL);
        console.log("öo");
        json["PictureURL"]=PictureURL;
        if("Subtitle" in item){     //exist subtitle
          let Subtitle = item["Subtitle"];
          jsonFea["Subtitle"]=Subtitle;
          if('ItemSpecifics' in item){
            let ItemSpecifics = item["ItemSpecifics"];
              if("NameValueList" in ItemSpecifics){
                let NameValueList = ItemSpecifics["NameValueList"][0];
                for(var i=0; i<NameValueList.length; i++){
                  if(NameValueList[i]["Name"]=="Brand"){
                  let Brand = NameValueList[i]["Value"];
                  jsonFea["Brand"]=Brand;
                  }
               }
            }
          }
          }else if('ItemSpecifics' in item && "NameValueList" in item["ItemSpecifics"]){
                  let NameValueList = item["ItemSpecifics"]["NameValueList"];
                  console.log(NameValueList);
                  for(var i=0; i<NameValueList.length; i++){
                    console.log(NameValueList[i]);
                    if(NameValueList[i]["Name"]=="Brand"){
                    let Brand = NameValueList[i]["Value"];
                    jsonFea["Brand"]=Brand;
                    }
                 }
              }
          
          console.log("jsonfea");
          console.log(jsonFea);
          json["Feature"]=jsonFea;
          if('ItemSpecifics' in item){
            let ItemSpecifics = item["ItemSpecifics"];
              if("NameValueList" in ItemSpecifics){
                let NameValueList = ItemSpecifics["NameValueList"];
                console.log(NameValueList.length);
                console.log(NameValueList[0]['Name']);
              //   for(var i=0; i<NameValueList.length; i++){
              //     console.log(NameValueList[i]['Name']);
              //     // console.log(nametest)
              //     // console.log('nametest'+ nametest["Name"]);
              //     // console.log(nametest['Name']);
              //     if(NameValueList[i]["Name"]=="Brand"){
              //       flag=true;
              //       break;
              //   }else{
              //       flag=false;
              //   }
              // }
              //   if(flag){     //brand exist
                  for(var i=0; i<NameValueList.length; i++){
                    if(num<5){
                      if(NameValueList[i]["Name"]=="Brand"){
                        continue;
                      }else{
                        console.log("Name:"+NameValueList[i]["Name"]);
                        console.log("Value:"+NameValueList[i]["Value"]);
                        jsonSpeci[NameValueList[i]["Name"]]=NameValueList[i]["Value"];
                        num++;
                      }
                      }
                    }
                  }
                }
          // console.log(jsonSpeci);
          console.log("aaa");
          json["Speci"]=jsonSpeci;

          //seller
          if("Seller" in item){
            json["Seller"] = item["Seller"];
          }

          //return
          if("ReturnPolicy" in item){
          json["ReturnPolicy"] = item["ReturnPolicy"];
          }

        }
      
      console.log("subtitle brand name value:");
      console.log(json);
        
				console.log("haha23");
				
          return json;
        }
  
   

app.get('/item', async (req, res, next) =>
{
    console.log(req.originalUrl);
    ebayUrl = "";
    ebayUrl += "http://open.api.ebay.com/shopping?callname=GetSingleItem&responseencoding=JSON&appid=mengting-mattycc-PRD-12eb6be68-c6612eba&siteid=0&version=967&ItemID=";
    i = -1;
    jsondata = [];
    let url = req.originalUrl;
    s=url.replace("?","?&").split("&");
    console.log(s);
    for (var j=1;j<s.length;j++) {
      let pair = s[j].split("=");
      console.log(pair);
      if(pair[0] =="ItemID"){
        ebayUrl += pair[1];
      }
      ebayUrl += "&IncludeSelector=Description,Details,ItemSpecifics";
}
console.log(ebayUrl);
request(ebayUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          // console.log("aa")
            // console.log(body);
            bodyJson = JSON.parse(body);
            reponse = tenfi(bodyJson);
            res.send(reponse);
            return;
            };
            // response = bodyJson;
            // console.log("zizi")
            // console.log(typeof bodyJson);
        })
	});

app.get('/android', async (req, res, next) =>
{
    console.log(req.originalUrl);
    ebayUrl = "";
    ebayUrl += "https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsAdvanced&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=mengting-mattycc-PRD-12eb6be68-c6612eba&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&paginationInput.entriesPerPage=100&keywords=";
    i = -1;
    k=-1;
    var flag1 =false;
    jsondata = [];
    let url = req.originalUrl;
    s=url.replace("?","?&").split("&");
    console.log(s);
    for (var j=1;j<s.length;j++) {
      let pair = s[j].split("=");
      console.log(pair);
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
      }else if(pair[0].substr(0,pair[0].length-1)=="Condition"){
        if(!flag1){
          i+=1;
          ebayUrl += "&itemFilter(" + i + ").name=Condition";
        }
        flag1=true;
        if(pair[1]=="New"){
          k+=1;
          ebayUrl += "&itemFilter(" + i + ").value("+k+")=1000";
        }else if(pair[1] == "Used"){
          k+=1;
          ebayUrl += "&itemFilter(" + i + ").value("+k+")=3000";
        }
      }else if(pair[0]=="sortOrder"){
        if (pair[1] == "Best%20Match"){sortOrder = "BestMatch";}
        else if (pair[1] =="Price:%20highest%20first"){sortOrder = "CurrentPriceHighest";}
        else if (pair[1] =="Price%20+%20Shipping:%20Highest%20first"){sortOrder = "PricePlusShippingHighest";}
        else{sortOrder = "PricePlusShippingLowest";}
        ebayUrl += "&sortOrder=" + sortOrder;
      }
}
console.log(ebayUrl);
request(ebayUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          // console.log("aa")
            // console.log(body);
            bodyJson = JSON.parse(body);
            reponse = ninefi(bodyJson);
            // console.log(request);
            res.send(reponse);
            return;
            };
            // response = bodyJson;
            // console.log("zizi")
            // console.log(typeof bodyJson);
        })
	});

  app.get('/users', async (req, res, next) =>
  {
    // try
    // {
      // res.jsonp({msg: '3333'});
      // res.write("haha");
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
  console.log("oo")
          if (!error && response.statusCode == 200) {
            // console.log("aa")
              // console.log(body);
              bodyJson = JSON.parse(body);
              response = bodyJson;
              console.log("zizi")
              res.send(bodyJson);
              return;
              // console.log(typeof bodyJson);
          }    
  })
    });

module.exports = app;
