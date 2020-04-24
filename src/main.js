import * as React from './react';
import ReactDom from './react-dom';

import Counter from './example/Counter';

const App = () => {
    return (
        <div>
            <Counter></Counter>
        </div>
    )
}

ReactDom.render(
    <App />,
    document.getElementById( 'root' )
);


