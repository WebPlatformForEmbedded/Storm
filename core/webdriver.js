/**
 * WPETestFramework test webdriver class
 */
/*jslint esnext: true*/
'use strict';

var webdriver = require('selenium-webdriver'),
             By = webdriver.By,
          until = webdriver.until;

var driver = new webdriver.Builder();

/*
 *  WebDriver functionality through Selenium
 */
module.exports = {
    // connect and start a webdriver session
    wdConnect(x, cb) {
        driver = new webdriver.Builder()
        .forBrowser('firefox')
        .usingServer(`http://${host}:9517`)
        .build();

        setTimeout(cb, 10000, true);
    },
    // sets the url through webdriver
    wdSetUrl(url, cb) {
        let r = driver.get(url);
        r.then((resp) => {
            cb(true);
        }).catch((err) => {
            throw err;
        });
    },
    // get the currently loaded url
    wdGetUrl(x, cb) {
        let r = driver.getCurrentUrl();
        r.then((resp) => {
            cb(resp);
        }).catch((err) => {
            throw err;
        });
    },
    // refresh the page
    wdRefresh(x, cb) {
        let r = driver.navigate().refresh();
        r.then(() => {
            cb();
        }).catch((err) => {
            throw err;
        });
    },
    // get the title of the currently loaded page
    wdGetTitle(x, cb) {
        let r = driver.getTitle();
        r.then((resp) => {
            cb(resp);
        }).catch((err) => {
            throw err;
        });
    },
    // Find the element on the currently loaded page, eg:
    // *     var e1 = driver.findElement(By.id('foo'));
    // *     var e2 = driver.findElement({id:'foo'});
    wdFindElement(element, cb) {
        let r = driver.findElement(element);
        r.then((resp) => {
            cb(resp);
        }).catch((err) => {
            // should we immediately throw an error here? or let the test decide?
            throw err;
        });
    },
    // Find the elements on the currently loaded page, eg:
    // *     var e1 = driver.findElement(By.id('foo'));
    // *     var e2 = driver.findElement({id:'foo'});
    wdFindElements(elements, cb) {
        let r = driver.findElements(elements);
        r.then((resp) => {
            cb(resp);
        }).catch((err) => {
            // should we immediately throw an error here? or let the test decide?
            throw err;
        });
    },
    // Ask webdriver for a screenshot
    wdScreenshot(x, cb) {
        let r = driver.takeScreenshot();
        r.then((resp) => {
            cb(resp);
        }).catch((err) => {
            throw err;
        });
    },
    // close the current window through webdriver
    wdClose(x, cb) {
        let r = driver.close();
        r.then((resp) => {
            cb(true);
        }).catch((err) => {
            throw err;
        });
    },
    // stop the session
    wdDisconnect(x, cb) {
        let r = driver.quit();
        r.then((resp) => {
            driver = undefined;
            cb(true);
        }).catch((err) => {
            throw err;
        });
    },
    wdIsConnected(x, cb) {
        return driver === undefined ? false : true;
    }
};
