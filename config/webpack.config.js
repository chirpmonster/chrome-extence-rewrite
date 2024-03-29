'use strict';

const {merge} = require('webpack-merge');

const common = require('./webpack.common.js');
const PATHS = require('./paths');

// Merge webpack configuration files
const config = (env, argv) => merge(common, {
    entry: {
        // popup: PATHS.src + '/popup.js',
        index: PATHS.src + '/iframe/index.js',
        contentScript: PATHS.src + '/contentScript.js',
        background: PATHS.src + '/background.js',
    },
    devtool: argv.mode === 'production' ? false : 'source-map'
});

module.exports = config;
