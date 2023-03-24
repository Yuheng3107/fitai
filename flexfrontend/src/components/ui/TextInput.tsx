import React, { forwardRef } from 'react';

type TextInputProps = {
    inputName: string;
    label: string;
    placeholder?: string;
    className?: string;
    defaultValue?:string;
}

type Ref = HTMLInputElement;

const TextInput = forwardRef<Ref, TextInputProps>((props, ref) => {
    return <div className={`flex flex-col content-start ${props.className}`}>
        <label className="text-neutral-700 text-sm" htmlFor={props.inputName}>{props.label}</label>
        <input defaultValue={props.defaultValue} className="mt-1 border-b border-b-zinc-400 bg-transparent" name={props.inputName} id={props.inputName} type="text" ref={ref} />
    </div>
});

export default TextInput;