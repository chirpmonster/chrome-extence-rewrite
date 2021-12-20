'use strict';

import reWrite from './background/reWrite'

init()

function test() {
    chrome.browserAction.setIcon({
        path: {
            16: '/images/16.png',
            32: '/images/32.png',
            48: '/images/48.png',
            128: '/images/128.png',
        }
    });
}

function init() {
    console.log('chrome-cookie-issue is powered by chirpmonster')
    reWrite.init()
}