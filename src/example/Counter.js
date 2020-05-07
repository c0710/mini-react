import * as React from '../react';

export default class Counter extends React.Component {
    constructor( props ) {
        super( props );
        this.state = {
            num: 0
        }
    }


    componentWillUpdate() {
        console.log( 'update' );
    }

    componentWillMount() {
        console.log( 'mount' );
    }

    componentDidMount() {
        for ( let i = 0; i < 100; i++ ) {
            this.setState(prevState => {
                console.log( prevState.num );
                return {
                    num: prevState.num + 1
                }
            } );
            console.log( this.state.num ); 
        }
    }

    onClick() {
        this.setState( { num: this.state.num + 1 } );
    }

    render() {
        return (
            <div onClick={ () => this.onClick() }>
                <h1>number: {this.state.num}</h1>
                <button>add</button>
            </div>
        );
    }
}