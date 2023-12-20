const axios = require("axios");
const fs = require("fs");
const readline = require('readline');

console.log('--------------------> NetHack PROXY PARSER <--------------------\n');

let proxySources = [
  "https://www.proxy-list.download/api/v1/get?type=http",
  "https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/http.txt",
  "https://raw.githubusercontent.com/jetkai/proxy-list/main/online-proxies/txt/proxies-http.txt",
  "https://raw.githubusercontent.com/jetkai/proxy-list/main/online-proxies/txt/proxies-https.txt",
  "https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/http.txt",
  "https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/https.txt",
];

async function scan(outfile) {
  let proxyList = [];

  for (let url of proxySources) {
    let res = await axios.get(url);
    let proxies = res.data.replace(/\r/g, "").split("\n");
    proxies = proxies.filter((proxy) => proxy !== "");
    proxyList.push(...proxies);
  }

  // добавление запятой после каждого прокси, кроме последнего
  let formattedProxies = proxyList.join(",\n");

  fs.writeFileSync(outfile, formattedProxies, "utf-8");
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Введите название файла, куда вы хотите сохранить список прокси (если файл не существует, он будет создан): ', (inputFilename) => {
  const filename = inputFilename.endsWith('.txt') ? inputFilename : `${inputFilename}.txt`;
  
  scan(filename).catch(console.error);

  console.log('\nПрокси создаётся...\n\n--------------------> NetHack PROXY PARSER <--------------------\n');
  
  rl.close();
});
