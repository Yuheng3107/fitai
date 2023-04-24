import React from 'react';

function TextBox(props) {
    return <span
        id={props.id} className={`${props.className} p-3 rounded-xl`}>
            {props.children}
        </span>
}
export default TextBox;