import React from 'react';

function Button (props) {
    return <button
    id={props.id} onClick={props.onClick} type={props.type} className={`${props.className} p-3 rounded-xl`}>
        {props.children}
    </button>
}

export default Button;