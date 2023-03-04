import React from 'react';

function TextBox(props) {
    return <div
        id={props.id} className={`${props.className} p-3 rounded-xl`}>
            {props.text}
        </div>
}
export default TextBox;