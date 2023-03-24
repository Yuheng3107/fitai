import React, { forwardRef } from 'react';

type TextInputProps = {
    inputName: string;
    label: string;
    placeholder?: string;
}

type Ref = HTMLInputElement;

const TextInput = forwardRef<Ref, TextInputProps>((props, ref) => {
    return <div className="flex flex-col content-start">
        <label htmlFor={props.inputName}>{props.label}</label>
        <input className="border-b border-b-zinc-400" name={props.inputName} id={props.inputName} type="text" ref={ref} />
    </div>
});

export default TextInput;