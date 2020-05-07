
import { setAttribute, removeNode, replaceNode } from './utils';


/**
 * @param {HTMLElement} dom 真实DOM
 * @param {vnode} vnode 虚拟DOM
 * @returns {HTMLElement} 更新后的DOM
 */
function diff( dom, vnode ) {

    let out = dom;

    if ( vnode === undefined || vnode === null || typeof vnode === 'boolean' ) vnode = '';

    if ( typeof vnode === 'number' ) vnode = String( vnode );

    // 新的vnode是文本节点
    if ( typeof vnode === 'string' ) {

        // 如果当前的DOM就是文本节点，则直接更新内容
        if ( dom && dom.nodeType === 3 ) {
            if ( dom.textContent !== vnode ) {
                dom.textContent = vnode;
            }
        // 如果DOM不是文本节点，则新建一个文本节点DOM，并移除掉原来的
        } else {
            out = document.createTextNode( vnode );
            replaceNode(out, dom)
        }

        return out;
    }

    // 如果节点是个组件，则采用组件的diff方法
    if ( typeof vnode.tag === 'function' ) {
        return diffComponent( dom, vnode );
    }

    // vnode是一个非文本节点
    if (!dom || dom.nodeName.toLowerCase() !== vnode.tag.toLowerCase()) {
        out = document.createElement( vnode.tag );

        if ( dom ) {
            [ ...dom.childNodes ].map( out.appendChild );    // 将原来的子节点移到新节点下
    
            replaceNode(out, dom)   // 移除掉原来的DOM对象
        }
    }
}


function diffChildren(dom, vchildren) {

    const domChildren = dom.childNodes;

    const children = [];    // 存放没有key的节点
    const keyMap = {};      // 存放有key的节点

     // 将有key的节点和没有key的节点分开
    if (domChildren.length > 0) {

        for (let i = 0; i < domChildren.length; i++) {
            const child = domChildren[i];
            const key = child.key;

            if (key) {
                keyMap[key] = child;
            } else {
                children.push(child);
            }
        }

    }

    if ( vchildren && vchildren.length ) {

        let childrenLen = children.length;
        let min = 0;

        for( let i = 0; i < vchildren.length; i++) {
            const vchild = vchildren[i];
            const key = vchild.key;

            let child;

            // 如果有key，找到对应key值的节点
            if (key) {
                if (keyMap[key]) {
                    child = keyMap[key];
                    keyMap[key] = undefined;
                }
            } else {
                // 如果没有key，则优先找类型相同的节点
                for (let j = min; m < childrenLen; j++) {
                    let c = children[j];

                    if (c && isSameNodeType(c, vchild)) {
                        child = c;
                        children[j] = undefined;

                        if ( j === childrenLen - 1 ) childrenLen--;
                        if ( j === min ) min++;
                        break;
                    }
                }
            }

            // 对比
            child = diff( child, vchild );




        }
    }
}


function diffAttributes( dom, vnode ) {

    const old = {}; // 当前dom属性
    const attrs = vnode.attrs;  // vnode所携带的属性

    for (let i = 0; i < dom.attributes.length; i++) {
        const attr = dom.attributes[i];

        old[attr.name] = attr.value; 
    }

    // 如果原来的属性不在新属性里，则将原来的属性设置为undefeated
    for ( let name in old ) {
        if (!(name in attr)) {
            setAttribute(dom, name, undefined);

        }
    }

    // 更新新的属性值
    for (let name in attrs) {
        if (attrs[name] !== old[name]) {
            setAttribute(dom, name, attrs[name]);
        }
    }
}

function isSameNodeType( dom, vnode ) {
    if ( typeof vnode === 'string' || typeof vnode === 'number' ) {
        return dom.nodeType === 3;
    }

    if ( typeof vnode.tag === 'string' ) {
        return dom.nodeName.toLowerCase() === vnode.tag.toLowerCase();
    }

    return dom && dom._component && dom._component.constructor === vnode.tag;
}