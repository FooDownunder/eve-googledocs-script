/*

Takes a bunch of typeids from a list (duplicates are fine. multidimensional is fine) and returns a bunch of rows 
with relevant price data.

TypeID,Buy Volume,Buy average,Buy max,Buy min,Buy Std deviation,Buy median,Buy Percentile,
Sell Volume,Sell Average,Sell Max,Sell Min,Sell std Deviation,Sell Median,sell Percentile



I'd suggest loading price data into a new sheet, then using vlookup to get the bits you care about in your main sheet.

loadRegionPrices defaults to the Forge
loadSystemPrices defaults to Jita


=loadRegionPrices(A1:A28)
=loadRegionPrices(A1:A28,10000002)
=loadRegionPrices(A1:A28,10000002,47)

=loadSystemPrices(A1:A28)






An example below:

https://docs.google.com/spreadsheets/d/1f9-4cb4Tx64Do-xmHhELSwZGahZ2mTTkV7mKDBRPrrY/edit?usp=sharing

*/
function loadRegionPrices(priceIDs,regionID,cachebuster){
  if (typeof regionID == 'undefined'){
    regionID=10000002;
  }
  if (typeof priceIDs == 'undefined'){
    throw 'need typeids';
  }
  if (typeof cachebuster == 'undefined'){
    cachebuster=1;
  }
  var prices = new Array();
  var dirtyTypeIds = new Array();
  var cleanTypeIds = new Array();
  var url="http://api.eve-central.com/api/marketstat?cachebuster="+cachebuster+"&regionlimit="+regionID+"&typeid=";
  priceIDs.forEach (function (row) {
    row.forEach ( function (cell) {
      if (typeof(cell) === 'number' ) {
        dirtyTypeIds.push(cell);
      }
    });
  });
  cleanTypeIds = dirtyTypeIds.filter(function(v,i,a) {
    return a.indexOf(v)===i;
  });
  var parameters = {method : "get", payload : ""};
  
  var i,j,k,temparray,chunk = 100;
  for (i=0,j=cleanTypeIds.length; i < j; i+=chunk) {
    temparray = cleanTypeIds.slice(i,i+chunk);
    var xmlFeed = UrlFetchApp.fetch(url+temparray.join("&typeid="), parameters).getContentText();
    var xml = XmlService.parse(xmlFeed);
    if(xml) {
      var rows=xml.getRootElement().getChild("marketstat").getChildren("type");
      for(var k = 0; k < rows.length; k++) {
        var price=[parseInt(rows[k].getAttribute("id").getValue()),
                   parseInt(rows[k].getChild("buy").getChild("volume").getValue()),
                   parseFloat(rows[k].getChild("buy").getChild("avg").getValue()),
                   parseFloat(rows[k].getChild("buy").getChild("max").getValue()),
                   parseFloat(rows[k].getChild("buy").getChild("min").getValue()),
                   parseFloat(rows[k].getChild("buy").getChild("stddev").getValue()),
                   parseFloat(rows[k].getChild("buy").getChild("median").getValue()),
                   parseFloat(rows[k].getChild("buy").getChild("percentile").getValue()),
                   parseInt(rows[k].getChild("sell").getChild("volume").getValue()),
                   parseFloat(rows[k].getChild("sell").getChild("avg").getValue()),
                   parseFloat(rows[k].getChild("sell").getChild("max").getValue()),
                   parseFloat(rows[k].getChild("sell").getChild("min").getValue()),
                   parseFloat(rows[k].getChild("sell").getChild("stddev").getValue()),
                   parseFloat(rows[k].getChild("sell").getChild("median").getValue()),
                   parseFloat(rows[k].getChild("sell").getChild("percentile").getValue())];
        prices.push(price);
      }
    }
  }
  return prices;
}

function loadSystemPrices(priceIDs,systemID,cachebuster){
  if (typeof systemID == 'undefined'){
    systemId=30000142;
  }
  if (typeof priceIDs == 'undefined'){
    throw 'need typeids';
  }
  if (typeof cachebuster == 'undefined'){
    cachebuster=1;
  }
  var prices = new Array();
  var dirtyTypeIds = new Array();
  var cleanTypeIds = new Array();
  var url="http://api.eve-central.com/api/marketstat?cachebuster="+cachebuster+"&usesystem="+systemID+"&typeid=";
  priceIDs.forEach (function (row) {
    row.forEach ( function (cell) {
      if (typeof(cell) === 'number' ) {
        dirtyTypeIds.push(cell);
      }
    });
  });
  cleanTypeIds = dirtyTypeIds.filter(function(v,i,a) {
    return a.indexOf(v)===i;
  });
  var parameters = {method : "get", payload : ""};
  
  var i,j,k,temparray,chunk = 100;
  for (i=0,j=cleanTypeIds.length; i < j; i+=chunk) {
    temparray = cleanTypeIds.slice(i,i+chunk);
    var xmlFeed = UrlFetchApp.fetch(url+temparray.join("&typeid="), parameters).getContentText();
    var xml = XmlService.parse(xmlFeed);
    if(xml) {
      var rows=xml.getRootElement().getChild("marketstat").getChildren("type");
      for(var k = 0; k < rows.length; k++) {
        var price=[parseInt(rows[k].getAttribute("id").getValue()),
                   parseInt(rows[k].getChild("buy").getChild("volume").getValue()),
                   parseFloat(rows[k].getChild("buy").getChild("avg").getValue()),
                   parseFloat(rows[k].getChild("buy").getChild("max").getValue()),
                   parseFloat(rows[k].getChild("buy").getChild("min").getValue()),
                   parseFloat(rows[k].getChild("buy").getChild("stddev").getValue()),
                   parseFloat(rows[k].getChild("buy").getChild("median").getValue()),
                   parseFloat(rows[k].getChild("buy").getChild("percentile").getValue()),
                   parseInt(rows[k].getChild("sell").getChild("volume").getValue()),
                   parseFloat(rows[k].getChild("sell").getChild("avg").getValue()),
                   parseFloat(rows[k].getChild("sell").getChild("max").getValue()),
                   parseFloat(rows[k].getChild("sell").getChild("min").getValue()),
                   parseFloat(rows[k].getChild("sell").getChild("stddev").getValue()),
                   parseFloat(rows[k].getChild("sell").getChild("median").getValue()),
                   parseFloat(rows[k].getChild("sell").getChild("percentile").getValue())];
        prices.push(price);
      }
    }
  }
  return prices;
}
