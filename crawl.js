var Crawler = require("crawler");
var url = require('url');

var c = new Crawler({
    maxConnections : 2,
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            var $ = res.$;
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server
            console.log('Grabbed '+res.request.uri.href);
        }
        done();
    }
});

// Queue just one URL, with default callback
c.queue('http://www.cgwmuseum.org/');
