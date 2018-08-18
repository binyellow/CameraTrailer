const puppeteer = require('puppeteer')

const url = 'https://movie.douban.com/explore#!type=movie&tag=%E7%BB%8F%E5%85%B8&sort=recommend&page_limit=20&page_start=0'

const sleep = time => new Promise(resolve=>{
    setTimeout(resolve,time)
})
;(async ()=>{
    console.log('start to visit the target page');
    const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        dumpio: false
    })

    const page = await browser.newPage();
    await page.goto(url,{
        waitUntil: 'networkidle2'
    })
    await sleep(1000);
    await page.waitForSelector('.more');
    for(let i = 0;i < 1;i++){
        await sleep(1000);
        await page.click('.more')
    }
    const result = await page.evaluate(()=>{
        const $ = window.$;
        var items = $('.list-wp a');
        var links = [];
        if(items.length>0){
            items.each((index,item)=>{
                let it = $(item);
                let douBanId = it.find('div').data('id');
                let title = $.trim(it.find('p').text().match(/[\u4e00-\u9fa5]+/));
                let rate = Number(it.find('strong').text());
                let poster = it.find('img').attr('src');
                links.push({
                    title,
                    douBanId,
                    rate,
                    poster
                })
            })
        }
        return links;
    })
    browser.close();
    console.log(result);
})()