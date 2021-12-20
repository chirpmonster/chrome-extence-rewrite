import React, { Component } from 'react';

import Rewrite from './Rewrite/index'

import './index.less'

export default class App extends Component{
    render() {
        return (
            <div className='chrome-box'>
                <Rewrite key='Rewrite'/>
                <div className='technical-support'>Powered by <a href='https://github.com/chirpmonster' target='_blank'>@chirpmonster</a></div>
            </div>
        )
    }
}