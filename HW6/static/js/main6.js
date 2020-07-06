
function changeBgc(x) {
    document.getElementById(x).style.backgroundColor="#E6F0FF";
}

function clearCon() {
    console.log("clear");

    location.reload();
}

function check() {
    document.getElementById("kwd").setAttribute('required','required');
    document.getElementById("resultsnum").style.display="none";
    document.getElementById("hide").style.display="none";
    document.getElementById("hide7").style.display = "none"
    document.getElementById("buttonhtml").style.display = "none"
    let kwds = document.getElementById("kwd").value
    let lP = document.getElementById("low").value;
    let hP = document.getElementById("high").value;
    // console.log(kwds,lP,hP);
    // console.log(typeof parseInt(lP));
    // console.log(typeof lP);
    // console.log(typeof hP);
    if(parseInt(lP)<0 || parseInt(hP)<0) {
        alert("Price Range values cannot be negative! Please try a value greater than or equal to 0.0.");
        return false;
    } else if(lP!='' && hP!='' && lP-hP>0) {
        alert("Oops! Lower price limit cannot be greater than upper price limit! Please try again.");
        return false;
    }
    let conditionsbox = document.ebayform.condition;
    let shippingbox = document.ebayform.shipping;
    let conditions = new Array();
    let shipping = new Array();
    for(let i=0; i<5; i++){
        if(conditionsbox[i].checked){
            conditions.push(conditionsbox[i].value);
        }
    }
    if(document.ebayform.seller.checked)
        var seller = "Return Acceptable";
    else
        seller = "";

    for(let i=0; i<2; i++) {
        if (shippingbox[i].checked) {
            shipping.push(shippingbox[i].value);
        }
    }
    var s = new String();
    s="sasawe";
    s="ewewqe";
    let sort = document.getElementById("sort");
    let index = sort.selectedIndex;
    let selectedsort = sort.options[index].innerText;
    // console.log(selectedsort);
    let queryConfig = {
        "Keywords":kwds,
        "MinPirce":lP,
        "MaxPrice":hP,
        "Condition":conditions,
        "seller": seller,
        "shipping": shipping,
        "sortOrder": selectedsort
    };
    var _str="https://mattycc-project002.wl.r.appspot.com/search?";
    // var _str="http://127.0.0.1:8080/search?";

    for(let o in queryConfig){
        // console.log(o);
        // console.log(queryConfig[o]);
        _str += o + "=" +queryConfig[o] + "&";
    }
    // console.log(_str);
    var _str_res = _str.substring(0, _str.length-1);
    console.log(_str_res);
    let xhr = new XMLHttpRequest();
    // xhr.responseType = "json";
    xhr.open('GET',_str_res,true);

    xhr.onreadystatechange=function () {
        if(xhr.readyState == 4 && xhr.status == 200){
            let text=xhr.responseText;
            console.log(text);
            // console.log(typeof text);
            if(text=="nores"){
                //no result
                // console.log("no");
                document.getElementById("resultsnum").style.display="";
                let html = "<h2 style='text-align: center'>No Results Found</h2>";
                document.querySelector("h2").innerHTML = html;
                return false;
            }else if(text=="Failure"){
                //invalid keyword
                document.getElementById("resultsnum").style.display="";
                let html = "<h2 style='text-align: center'>Invalid keyword.</h2>";
                document.querySelector("h2").innerHTML = html;
                return false;
            }
            // console.log("haah")
            let test = JSON.parse(text);
            // console.log((test.resultsnum));
            document.getElementById("resultsnum").style.display="";
            document.getElementById("hide").style.display="";
            document.querySelector("h2").innerHTML = test.resultsnum + " Results found for <em>" + kwds + "</em>"
            let count = Object.keys(test).length;
            // console.log(count);
            for(let i=1; i<11; i++){
                console.log(test[i].condition);
                // console.log(test[i].imageURL);
                getId = "hehe" + i;
                if(i<count) {
                    let html = "<div class='res' id='res" + i + "' onclick='showHideInfo(this)'> <div class='imgDiv' ><img src='" + test[i].imageURL + "' class='resImg' '></div><div class='resInfo'><div name='itemTitle' value='' class='linetitleInfo'><a href='" + test[i].link + "' target=\'_blank\'><strong>" + test[i].title + "</strong></a></div><div name='category' value='' class='lineInfo'>Category: <em>" + test[i].category + "</em><a href='" + test[i].link + "' target=\"_blank\"><img src='../img/redirect.png' style='height: 10px; width: 10px'></a> </div><div name='condition' value='' id='condition' class='lineInfo'> Condition: " + test[i].condition + "</div><div name='seller' class='lineInfo' style='display: none'>" + sellerfun(test[i].seller) + "</div><div name='shipping' style='display: none' class='lineInfo'>" + shippingfun(test[i].shippingCost, test[i].expedite) + "</div>";
                    if (parseFloat(test[i].shippingCost) > 0) {
                        html += "<div name='Price' value='' class='lineInfo'><strong>Price: $" + test[i].itemPrice + "(+ $ " + parseFloat(test[i].shippingCost) + " for shipping)</strong><span style='display: none'>From " + test[i].location + "</span></div>";
                    } else {
                        html += "<div name='Price' value='' class='lineInfo'><strong>Price: $" + test[i].itemPrice + "</strong><span style='display: none'> From " + test[i].location + "</span></div>";
                    }
                    html += "</div><div name='cancel' id='cancel" + i + "' class='cancel' style='display: none' onclick='hideInfo(this)'>❌</div></div>"

                    document.getElementById(getId).innerHTML = html;
                    // console.log(test[i].top);
                    if (test[i].top == "true") {
                        // console.log("top");
                        console.log("test[i].condition");
                        let topHtml = "Condition: " + test[i].condition + "<img src='../img/topRatedImage.png' style='height: 30px; width: 20px'>";
                        // console.log(topHtml);
                        divNum = "res" + i;
                        let divDom = document.getElementById(divNum);
                        let divDom2 = divDom.getElementsByTagName("div")[1];
                        // console.log(divDom2);
                        divDom2.getElementsByTagName("div")[2].innerHTML = topHtml;
                    }
                    document.getElementById(getId).style.display="";
                    // console.log(getId);
                    // console.log(document.getElementById(getId).style.display);

                }else{
                    document.getElementById(getId).style.display="none";
                    // console.log(getId);
                    // console.log(document.getElementById(getId).style.display)
                }
            }
            if(count>4) {
                let buttonhtml = "<input type='button' class='bnt2' id='showbnt' value='Show More' onclick='show()'></input>";
                document.getElementById("buttonhtml").style.display = "";
                document.getElementById("buttonhtml").innerHTML = buttonhtml;
            }
        }
    }
    xhr.send();
    function sellerfun(elm) {
    if(elm=='false'){
        return 'Seller <strong>does not accept returns</strong>';
    }else{
        return 'Seller <strong>accepts</strong> returns';
    }
}

    function shippingfun(a,b) {
        let str='';
    if(parseFloat(a)==0.0){
        str += 'Free Shipping';
    }else{
        str += 'No Free Shipping';
    }
    if(b=='true'){
        str += '--Expedited Shipping avaiable';
    }
    // console.log(str);
    return str;
}
}

function show() {
    let showValue = document.getElementById("showbnt").value;
    // console.log("showmore")
    if(showValue == "Show More") {

            document.getElementById("hide7").style.display = "";

        document.getElementById("showbnt").value = "Show Less";
    }
    else{
        document.getElementById("hide7").style.display = "none";
        document.getElementById("showbnt").value = "Show More";
        // scrollTo(0,0);
    // console.log("scrol")
        var timer = null;
        cancelAnimationFrame(timer);
        timer = requestAnimationFrame(function fn(){
        var oTop = document.body.scrollTop || document.documentElement.scrollTop;
        if(oTop > 0){
        scrollTo(0,oTop-50);
        timer = requestAnimationFrame(fn);
        }else{
        cancelAnimationFrame(timer);
        }
        });
    }
}

function showHideInfo(elm) {
    let showId = elm.getAttribute("id");
    // console.log(showId);
    document.getElementById(showId).style.height="400px";
    // console.log("showhideInfo")
    let showDom = document.getElementById(showId);
    let showDom2 = showDom.getElementsByTagName("div")[1];
    // console.log(showDom2.getElementsByTagName("div")[0]);
    // showDom2.getElementsByTagName("div")[0].style.wordWrap="break-word";
    // showDom2.getElementsByTagName("div")[0].style.lineHeight="normal";
    showDom2.getElementsByTagName("div")[0].style.whiteSpace="normal";
    showDom2.getElementsByTagName("div")[3].style.display="";
    showDom2.getElementsByTagName("div")[4].style.display="";
    showDom.getElementsByTagName("div")[8].style.display="";
    // console.log(showDom)
    // console.log(showDom.getElementsByTagName("div")[8]);
    let priceDom = showDom2.getElementsByTagName("div")[5];
    priceDom.getElementsByTagName("span")[0].style.display="inline";
}

function stopPropagation(e) {
            e = e || window.event;
            if(e.stopPropagation) { //W3C阻止冒泡方法
                e.stopPropagation();
            } else {
                e.cancelBubble = true; //IE阻止冒泡方法
            }
        }

function hideInfo(elm) {
    stopPropagation();
    // console.log(elm);
    let showId = elm.getAttribute("id");
    // console.log(showId);
    let hideDom = document.getElementById(showId).parentNode;   //card
    // console.log(hideDom);
    hideDom.style.height="300px";
    // console.log("hideInfo")
    let hideDom2 = hideDom.getElementsByTagName("div")[1];
    // hideDom2.getElementsByTagName("div")[0].style.lineHeight="60px";
    hideDom2.getElementsByTagName("div")[0].style.whiteSpace="nowrap";
    hideDom2.getElementsByTagName("div")[3].style.display="none";
    hideDom2.getElementsByTagName("div")[4].style.display="none";
    hideDom.getElementsByTagName("div")[8].style.display="none";
    let priceDom = hideDom2.getElementsByTagName("div")[5];
    priceDom.getElementsByTagName("span")[0].style.display="none";
    // document.body.scrollTop = document.documentElement.scrollTop = 0;
}






