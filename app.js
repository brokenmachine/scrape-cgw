const request = require('request');
const cheerio = require('cheerio');
const stringify = require('node-stringify');

function parseIssueHtml(html) {
    var $ = cheerio.load(html);
    var issueMetadata = [];
    
    // get most of the issue metadata from the grey box
    var issueDataText = $('body > table table[cellpadding="5"]').text();
    if (issueDataText.includes("Softline")) {
        issueMetadata.mag = "Softline";
    } else
    if (issueDataText.includes("Computer Gaming World")) {
        issueMetadata.mag = "Computer Gaming World";
    }

    // issue #
    var re = /Comments and Highlights: (.+)/i;
    var matches = re.exec(issueDataText);
    if (matches!==null) {
     issueMetadata.comments = matches[1];
    }
    
    // pub date
    re = /Date: (\w+) (\d+)/i;
    matches = re.exec(issueDataText);
    if (matches!==null) {
     issueMetadata.pubYear = matches[2];
     issueMetadata.pubMonthStart = matches[1];
    } else {
          re = /Date: (\w+)\-(\w+) (\d+)/i;
          matches = re.exec(issueDataText);
          if (matches!==null) {
            issueMetadata.pubYear = matches[3];
            issueMetadata.pubMonthEnd = matches[2];
            issueMetadata.pubMonthStart = matches[1];
          }
    }

    // issue #
    re = /Issue Number: ([\d\.]+)/i;
    matches = re.exec(issueDataText);
    issueMetadata.issueNumber = matches[1]; 
    
    // # pages
    re = /(\d+) pages/i;
    matches = re.exec(issueDataText);
    issueMetadata.numPages = matches[1]; 
    
    // get the download link URL
    issueMetadata.cgwUrl = "http://www.cgwmuseum.org/galleries/"+$('table tr[cellpadding="5"] a').attr('href');
    
    // get the cover page image
    issueMetadata.coverImageUrl = "http://www.cgwmuseum.org/galleries/"+$('td img')[10].attribs.src;            
    console.log(issueMetadata);
    return issueMetadata;
}

var LineByLineReader = require('line-by-line'),
    lr = new LineByLineReader('issuePages.csv');

lr.on('error', function (err) {
	console.log("error: "+err);
});

lr.on('line', function (line) {
request(line, function (error, response, body) {
if(!error){
    var issueData = parseIssueHtml(body);
} else {
    console.log("Error loading URL "+line);
} 

}); 
  //console.log(line);
});

lr.on('end', function () {
	// All lines are read, file is closed now.
});



