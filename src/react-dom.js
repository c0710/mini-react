import { Component } from './react';

function render (vnode, container) {
    return container.appendChild( _render( vnode ) );
}

// 将vnode转为真实Dom
function _render( vnode ) {

    if ( vnode === undefined || vnode === null || typeof vnode === 'boolean' ) vnode = '';

    if ( typeof vnode === 'number' ) vnode = String( vnode );

    // 当vnode为字符串时，渲染结果是一段文本
    if ( typeof vnode === 'string' ) {
        const textNode = document.createTextNode( vnode );
        return textNode
    }

    // 当vnode为组件时，tag值为函数
    if ( typeof vnode.tag === 'function' ) {
        const component = createComponent(vnode.tag, vnode.attrs);
        setComponentProps( component, vnode.attrs );
        return component.base;
    }

    const dom = document.createElement( vnode.tag );
    if ( vnode.attrs ) {
        Object.keys( vnode.attrs ).forEach( key => {
            const value = vnode.attrs[ key ];
             setAttribute( dom, key, value );    // 设置属性
        } );
    }
    if ( vnode.children ) {
        vnode.children.forEach( child => render( child, dom ) );    // 递归渲染子节点
    }

    return dom;    // 将渲染结果挂载到真正的DOM上
}

function setAttribute( dom, name, value ) {
    // 如果属性名是className，则改回class
    if ( name === 'className' ) name = 'class';

    // 如果属性名是onXXX，则是一个事件监听方法
    if ( /on\w+/.test( name ) ) {
        name = name.toLowerCase();
        dom[ name ] = value || '';
    // 如果属性名是style，则更新style对象
    } else if ( name === 'style' ) {
        if ( !value || typeof value === 'string' ) {
            dom.style.cssText = value || '';
        } else if ( value && typeof value === 'object' ) {
            for ( let name in value ) {
                // 可以通过style={ width: 20 }这种形式来设置样式，可以省略掉单位px
                dom.style[ name ] = typeof value[ name ] === 'number' ? value[ name ] + 'px' : value[ name ];
            }
        }
    // 普通属性则直接更新属性
    } else {
        if ( name in dom ) {
            dom[ name ] = value || '';
        }
        if ( value ) {
            dom.setAttribute( name, value );
        } else {
            dom.removeAttribute( name );
        }
    }
}

// 渲染组件
function renderComponent (component) {
    let base;
    // 是否是组件初次渲染
    let isInitalRender = !!component.base;

    const renderer = component.render();
    if (isInitalRender && component.componentWillUpdate) {
        component.componentWillUpdate();
    }

    // component.base保存的是组件的dom对象
    base = _render(renderer);

    if ( isInitalRender ) {
        if ( component.componentDidUpdate ) component.componentDidUpdate();
    } else if ( component.componentDidMount ) {
        component.componentDidMount();
    }

    if (isInitalRender && component.base.parentNode) {
        component.base.parentNode.replaceChild(base, component.base)
    }

    component.base = base;
    base._component = component;
}

// 创建组件
function createComponent( component, props ) {
    let inst;

    // 如果是类组件，则直接返回组件实例
    if (component.prototype && component.prototype.render) {
        inst = new component(props)
    } else {
        // 如果是函数组件，则将其拓展为类组件
        inst = new Component(props);
        inst.constructor = component;
        inst.render = function() {
            return this.constructor(props);
        }
    }

    return inst;
}

// 更新组件props
function setComponentProps(component, props) {

    // 初始化组件
    if (!component.base) {
        if (component.componentWillMount) component.componentWillMount();
    } else {
        // 组件props更新
        if (component.componentWillReceiveProps) component.componentWillReceiveProps(props);
    }
    component.props = props;
    
    renderComponent( component );
}

export default {
    render,
    renderComponent
}