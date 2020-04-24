import * as React from './react';
import ReactDom from './react-dom';
let a = 'aaa'
let b = 'bbb'
function Welcome( props ) {
    return <h1>Function Component, {props.name}</h1>;
}
class Welcome2 extends React.Component {
    // constructor(props){
    //     super(props);
    // }
    render() {
        return <h1>classComponent, {this.props.name}</h1>
    }
}

const element = (
    <div>
        <Welcome name={'wang'}></Welcome>
        {/* <Welcome2 name={'chengcheng'} /> */}
        {/* <h2>It {a} is {new Date().toLocaleTimeString()} . {b}</h2>
        <div>111</div>
        <div>222</div> */}
    </div>
    
    );
ReactDom.render(
    element,
    document.getElementById( 'root' )
);


