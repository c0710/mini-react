
function createElement( tag, attrs, ...children ) {
    console.log(tag, attrs, ...children)
    return {
        tag,
        attrs,
        children
    }
}

export default {
    createElement
}