import ReactDom from './react-dom';

const queue = [];
const renderQueue = [];

function createElement(tag, attrs, ...children) {
    // console.log(`tag: ${tag}, \n attrs: ${JSON.stringify(attrs)}, \n children : ${children}`)
    return {
        tag,
        attrs,
        children
    }
}

function enqueueSetState( stateChange, component ) {

    if ( queue.length === 0 ) {
        defer( flush );
    }

    queue.push({
        stateChange,
        component
    })

    // 如果renderQueue里没有当前组件，则添加到队列中
    if ( !renderQueue.some(item => item === component) ) {
        renderQueue.push( component );
    }
}

// 清空队列
function flush () {
    let item, component;

    while( item = queue.shift() ) {
        const { stateChange, component } = item;
        
        // 如果没有prevState，则将当前的state作为初始的prevState
        if ( !component.prevState ) {
            component.prevState = Object.assign({}, component.state)
        }

        if ( typeof stateChange === 'function' ) {
            component.state = Object.assign(component.state, stateChange(component.prevState, component.props))
        } else {
            component.state = Object.assign(component.state, stateChange)
        }

        component.prevState = component.state;
    }

    // 渲染每一个组件
    while( component = renderQueue.shift() ) {
        ReactDom.renderComponent( component );
    }
}

function defer( fn ) {
    return Promise.resolve().then( fn );
}

class Component {
    constructor(props = {}) {
        this.state = {}
        this.props = props
    }

    setState(stateChange) {
        // 将修改合并到state
        // Object.assign(this.state, stateChange)
        enqueueSetState(stateChange, this);

        // 重新渲染组件
        // ReactDom.renderComponent(this)
    }

    componentWillMount() {
        console.log('componentWillMount')
    }

    componentDidMount() {
        console.log('componentDidMount')
    }

    componentWillReceiveProps() {
        console.log('componentWillReceiveProps')
    }

    componentWillUpdate() {
        console.log('componentWillUpdate')
    }

    componentDidUpdate() {
        console.log('componentDidUpdate')
    }


}

export {
    createElement,
    Component
}