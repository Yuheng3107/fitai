import React from 'react';

function TextBox(props) {
    return <span
        id={props.id} className={`${props.className} bg-zinc-500 p-3 rounded-xl`}>
            {props.children}
        </span>
}
export default TextBox;