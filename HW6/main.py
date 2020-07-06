from flask import Flask, request, make_response, send_from_directory, jsonify
from flask_restful import Api, Resource, reqparse, marshal_with, fields
import requests

app = Flask(__name__, static_url_path='')
api = Api(app)
# @app.route('/')

# class display(Resource):
@app.route('/')
def display():
    return app.send_static_file('HW6.html')

@app.route('/search')
def search():
        #拼接ebay api的url
        url = "https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsAdvanced&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=mengting-mattycc-PRD-12eb6be68-c6612eba&RESPONSE-DATA-FORMAT=JSON&RESTPAYLOAD&paginationInput.entriesPerPage=100"
        #&paginationInput.entriesPerPage=10
        #从前端获取数据
        data = request.args
        #keywords
        url += "&keywords=" + data.get("Keywords")
        # sort order
        # print("++++++++++++++")
        # print(data)
        sort = data.get("sortOrder")
        # print(sort)
        if (sort == "Best Match"):
            url += "&sortOrder=BestMatch"
        elif(sort == "Price: highest first"):
            url += "&sortOrder=CurrentPriceHighest"
        elif (sort == "Price   Shipping: highest first"):
            url += "&sortOrder=PricePlusShippingHighest"
        elif (sort == "Price   Shipping: lowest first"):
            url += "&sortOrder=PricePlusShippingLowest"
        i = 0
        #price
        if(data.get("MinPirce")):
            url += "&itemFilter(" + str(i) + ").name=MinPrice&itemFilter(" + str(i) + ").value=" + data.get("MinPirce") + "&itemFilter(" + str(i) + ").paramName=Currency&itemFilter(" + str(i) + ").paramValue=USD"
            i = i+1
        if(data.get("MaxPrice")):
            url += "&itemFilter(" + str(i) + ").name=MaxPrice&itemFilter(" + str(i) + ").value=" + data.get("MaxPrice") + "&itemFilter(" + str(i) + ").paramName=Currency&itemFilter(" + str(i) + ").paramValue=USD"
            i = i + 1
        #condition
        if(len(data.get("Condition"))!=0):
            condition = data.get("Condition").split(',')
            j = 0
            url += "&itemFilter(" + str(i) + ").name=Condition"
            for c in condition:
                # print(c)
                if (c=="New"):
                    url += "&itemFilter(" + str(i) + ").value(" + str(j) + ")=1000"
                if (c=="Used"):
                    url += "&itemFilter(" + str(i) + ").value(" + str(j) + ")=3000"
                if (c == "Very Good"):
                    url += "&itemFilter(" + str(i) + ").value(" + str(j) + ")=4000"
                if (c == "Good"):
                    url += "&itemFilter(" + str(i) + ").value(" + str(j) + ")=5000"
                if (c == "Acceptable"):
                    url += "&itemFilter(" + str(i) + ").value(" + str(j) + ")=6000"
                j = j+1
            i = i+1
        #seller
        if(len(data.get("seller"))!=0):
            seller = data.get("seller")
            url += "&itemFilter(" + str(i) + ").name=ReturnsAcceptedOnly&itemFilter(" + str(i) + ").value=true"
            i = i+1
        #shipping
        if(len(data.get("shipping"))!=0):
            shipping = data.get("shipping").split(',')
            for s in shipping:
                if(s=="Free"):
                    url += "&itemFilter(" + str(i) + ").name=FreeShippingOnly&itemFilter(" + str(i) + ").value=true"
                    i= i+1
                if(s=="Expedited"):
                    url += "&itemFilter(" + str(i) + ").name=ExpeditedShippingType&itemFilter(" + str(i) + ").value=Expedited"
                    i = i+1
        print("------------")
        print(url)
        #从ebay获取数据
        # response = make_response(url)
        r = requests.get(url)
        jsondata = r.json();
        # print(jsondata)
        # 从eaby返回的数据中获取数据
        # print(jsondata["findItemsAdvancedResponse"][0]["ack"][0])
        if(jsondata["findItemsAdvancedResponse"][0]["ack"][0]=="Failure"):
            # print("invalid")
            resp = make_response("Failure")
            # print(resp)
            resp.headers['Cache-Control'] = 'no-store'
            resp.headers['Pragma'] = 'no-cache'
            resp.headers['Access-Control-Allow-Origin'] = '*'
            resp.headers['Access-Control-Allow-Methods'] = 'GET'
            return resp
        else:
            if(jsondata["findItemsAdvancedResponse"][0]["paginationOutput"][0]["totalEntries"][0]!='0'):
                # print(jsondata["findItemsAdvancedResponse"][0]["paginationOutput"][0])
                # print(jsondata["findItemsAdvancedResponse"][0]["paginationOutput"][0]["totalEntries"][0])
                ebayInfo = {}
                resultsnum = jsondata["findItemsAdvancedResponse"][0]["paginationOutput"][0]["totalEntries"]
                # print(resultsnum)
                resultsnumjson = {"resultsnum" : resultsnum[0]}
                # print(type(resultsnumjson))
                ebayInfo.update(resultsnumjson)
                itemInfo = jsondata["findItemsAdvancedResponse"][0]["searchResult"][0]["item"]

                k=1
                for o in itemInfo:
                    dict = {}
                    # if("galleryURL" in o and "title" in o and "categoryName" in o["primaryCategory"][
                    #          0] and "viewItemURL" in o and "viewItemURL" in o):
                    if("galleryURL" in o and "title" in o and "categoryName" in o["primaryCategory"][0] and "viewItemURL" in o and "viewItemURL" in o and "condition" in o and "convertedCurrentPrice" in o["sellingStatus"][0]):
                        # if(k<11):
                        #     print(o["galleryURL"][0])
                        if(o["galleryURL"][0]=="https://thumbs1.ebaystatic.com/pict/04040_0.jpg" or o["galleryURL"][0]=="https://thumbs2.ebaystatic.com/pict/04040_0.jpg" or o["galleryURL"][0]=="https://thumbs3.ebaystatic.com/pict/04040_0.jpg" or o["galleryURL"][0]=="https://thumbs4.ebaystatic.com/pict/04040_0.jpg" or o["galleryURL"][0]=="https://thumbs1.ebaystatic.com/pict/1242128311104040_0.jpg" or o["galleryURL"][0]=="https://thumbs2.ebaystatic.com/pict/1242128311104040_0.jpg" or o["galleryURL"][0]=="https://thumbs3.ebaystatic.com/pict/1242128311104040_0.jpg" or o["galleryURL"][0]=="https://thumbs4.ebaystatic.com/pict/1242128311104040_0.jpg"):
                            imageURL = "/img/ebay_default.jpg"
                        else:
                            imageURL= o["galleryURL"][0]
                        dict['imageURL'] = imageURL
                        itemTitle = o["title"]
                        dict['title'] = itemTitle[0]
                        category = o["primaryCategory"][0]["categoryName"]
                        dict['category'] = category[0]
                        link = o["viewItemURL"]
                        dict['link'] = link[0]
                        if("conditionDisplayName" in o["condition"][0]):
                            # condi = o["condition"][0]["conditionId"][0]
                            # print(condi)
                            # if(condi == 'New'):
                            #     print("hehe")
                            #     dict['condition'] = "New"
                            # elif(condi == "3000"):
                            #     dict['condition'] = "Used"
                            # elif (condi == "4000"):
                            #     dict['condition'] = "Very Good"
                            # elif (condi == "5000"):
                            #     dict['condition'] = "Good"
                            # elif (condi == "6000"):
                            dict['condition'] = o["condition"][0]["conditionDisplayName"][0]

                        if(o["returnsAccepted"][0] == 'true'):
                            dict['seller'] = 'true'
                        else:
                            dict['seller'] = 'false'
                        itemPrice = o["sellingStatus"][0]["convertedCurrentPrice"][0]["__value__"]
                        dict['itemPrice'] = itemPrice
                        if ("shippingServiceCost" in o["shippingInfo"][0]):
                            shippingCost = o["shippingInfo"][0]["shippingServiceCost"][0]["__value__"]
                            dict['shippingCost'] = shippingCost;
                        else:
                            dict['shippingCost'] = 0;
                        if("expeditedShipping" in o["shippingInfo"][0]):
                            dict['expedite'] = o["shippingInfo"][0]["expeditedShipping"][0]
                        if(o["topRatedListing"][0] == 'true'):
                            dict['top'] = 'true'
                        else:
                            dict['top'] = 'false'
                        if("location" in o):
                            dict['location'] = o['location'][0]
                        # print(dict)
                        itemNo = str(k)
                        k = k+1
                        ebayInfo[itemNo] = dict
                        # print(ebayInfo)
                    else:
                        continue
                # print(ebayInfo)
                print("------------")
                num = len(ebayInfo)
                # print(num)
                ebayValidInfo = {}
                ebayValidInfo['resultsnum'] = ebayInfo['resultsnum']
                if(num>=11):
                    for i in range(1,11):
                        validNo = str(i)
                        ebayValidInfo[validNo] = ebayInfo[validNo]
                else:
                    for i in range(1,num):
                        validNo = str(i)
                        ebayValidInfo[validNo] = ebayInfo[validNo]
                # print("*******************")
                # print(ebayValidInfo)
                resp = make_response(ebayValidInfo)
                # print(type(resp))
                resp.headers['Cache-Control']='no-store'
                resp.headers['Pragma']='no-cache'
                resp.headers['Access-Control-Allow-Origin'] = '*'
                resp.headers['Access-Control-Allow-Methods'] = 'GET'
                return resp
            else:
                # print("no search")
                resp = make_response("nores")
                # print(resp)
                resp.headers['Cache-Control'] = 'no-store'
                resp.headers['Pragma'] = 'no-cache'
                resp.headers['Access-Control-Allow-Origin'] = '*'
                resp.headers['Access-Control-Allow-Methods'] = 'GET'
                return resp



@app.route('/search22')
def search22():
        #拼接ebay api的url
        url = "https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsAdvanced&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=mengting-mattycc-PRD-12eb6be68-c6612eba&RESPONSE-DATA-FORMAT=JSON&RESTPAYLOAD&paginationInput.entriesPerPage=100"
        #&paginationInput.entriesPerPage=10
        #从前端获取数据
        data = request.args
        #keywords
        url += "&keywords=" + data.get("Keywords")
        # sort order
        sort = data.get("sortOrder")
        if (sort == "Best Match"):
            url += "&sortOrder=BestMatch"
        elif(sort == "Price: highest first"):
            url += "&sortOrder=CurrentPriceHighest"
        elif (sort == "Price + Shipping: highest first"):
            url += "&sortOrder=PricePlusShippingHighest"
        elif (sort == "Price + Shipping: lowest first"):
            url += "&sortOrder=PricePlusShippingLowest"
        i = 0
        #price
        if(data.get("MinPirce")):
            url += "&itemFilter(" + str(i) + ").name=MinPrice&itemFilter(" + str(i) + ").value=" + data.get("MinPirce") + "&itemFilter(" + str(i) + ").paramName=Currency&itemFilter(" + str(i) + ").paramValue=USD"
            i = i+1
        if(data.get("MaxPrice")):
            url += "&itemFilter(" + str(i) + ").name=MaxPrice&itemFilter(" + str(i) + ").value=" + data.get("MaxPrice") + "&itemFilter(" + str(i) + ").paramName=Currency&itemFilter(" + str(i) + ").paramValue=USD"
            i = i + 1
        #condition
        if(len(data.get("Condition"))!=0):
            condition = data.get("Condition").split(',')
            j = 0
            url += "&itemFilter(" + str(i) + ").name=Condition"
            for c in condition:
                # print(c)
                if (c=="New"):
                    url += "&itemFilter(" + str(i) + ").value(" + str(j) + ")=1000"
                if (c=="Used"):
                    url += "&itemFilter(" + str(i) + ").value(" + str(j) + ")=3000"
                if (c == "Very Good"):
                    url += "&itemFilter(" + str(i) + ").value(" + str(j) + ")=4000"
                if (c == "Good"):
                    url += "&itemFilter(" + str(i) + ").value(" + str(j) + ")=5000"
                if (c == "Acceptable"):
                    url += "&itemFilter(" + str(i) + ").value(" + str(j) + ")=6000"
                j = j+1
            i = i+1
        #seller
        if(len(data.get("seller"))!=0):
            seller = data.get("seller")
            url += "&itemFilter(" + str(i) + ").name=ReturnsAcceptedOnly&itemFilter(" + str(i) + ").value=true"
            i = i+1
        #shipping
        if(len(data.get("shipping"))!=0):
            shipping = data.get("shipping").split(',')
            for s in shipping:
                if(s=="Free"):
                    url += "&itemFilter(" + str(i) + ").name=FreeShippingOnly&itemFilter(" + str(i) + ").value=true"
                    i= i+1
                if(s=="Expedited"):
                    url += "&itemFilter(" + str(i) + ").name=ExpeditedShippingType&itemFilter(" + str(i) + ").value=Expedited"
                    i = i+1
        print("------------")
        print(url)
        #从ebay获取数据
        # response = make_response(url)
        r = requests.get(url)
        jsondata = r.json();
        return jsondata

# api.add_resource(search,'/search')


# class GetDatas(Resource):
#     resource_fidlds = {
#         'title':fields.String,
#         'content':fields.String
#     }
#     @marshal_with(resource_fidlds)
#     def get(self):
#         result = Artcle.query.all()
#         return result

if __name__ == '__main__':
    app.run(debug=True, host ='127.0.0.1', port ='8080')