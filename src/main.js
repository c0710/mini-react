import React from './react';
import ReactDom from './react-dom';

let a = 'aaa'
let b = 'bbb'

function tick() {
    const element = (
    <h2>It {a} is {new Date().toLocaleTimeString()} . {b}</h2>
      );
    ReactDom.render(
        element,
        document.getElementById( 'root' )
    );
}
tick();
