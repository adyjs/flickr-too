const fs = require('fs');
const path = require('path');
const {Builder, By} = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

const url = 'https://www.flickr.com/services/api/explore/flickr.photos.search';


function substringjs(str){
    const content = `const yeah = '${str}'`;
    const dirPath = path.join(__dirname , 'js' , 'yeah.js');
    fs.writeFile(dirPath, content, function(err){
        if(err) return console.log(err);
    })
}


function get_API_String(str){
    const API_str_start = str.indexOf('api_key') + 8;
    const API_str_end = str.indexOf('&' , API_str_start);
    const substring = str.substring(API_str_start, API_str_end);
    // console.log('api_key' , apiKey)
    substringjs(substring);



}

async function start(){
    let driver = new Builder()
        .forBrowser('chrome')
        .setChromeOptions(new chrome.Options().headless())
        .build();
    await driver.get(url);
    await driver.findElement(By.id('param_text')).sendKeys('car');
    await driver.findElement(By.css('input[type="submit"][value="Call Method..."]')).click();
    const href = await driver.findElement(By.id('api_call_url'))
        .findElement(By.xpath('.//a'))
        .getAttribute('href');

    get_API_String(href);
}

start();