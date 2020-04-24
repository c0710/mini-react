import ReactDom from './react-dom';


function createElement(tag, attrs, ...children) {
    // console.log(`tag: ${tag}, \n attrs: ${JSON.stringify(attrs)}, \n children : ${children}`)
    return {
        tag,
        attrs,
        children
    }
}

class Component {
    constructor(props = {}) {
        this.state = {}
        this.props = props
    }

    setState(stateChange) {
        // 将修改合并到state
        Object.assign(this.state, stateChange)

        // 重新渲染组件
        ReactDom.renderComponent(this)
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