import React, { useState, ReactNode, forwardRef } from 'react';

type TextAreaInputProps = {
    inputName: string;
    label: string;
    placeholder?: string;
    className?: string;
    children?: ReactNode;
    defaultValue?: string;
}

type Ref = HTMLTextAreaElement;
// forwardRef is used here so we can reference this component when it's used in other components
const TextAreaInput = forwardRef<Ref, TextAreaInputProps>((props, ref) => {

    const [textInput, setTextInput] = useState(props.defaultValue);
    console.log(props.defaultValue);
    return <div className={`relative flex flex-col justify-start ${props.className}`}>
        <label className="text-neutral-700 text-sm resize-none" htmlFor={props.inputName}>{props.label}</label>
        <textarea value={textInput} className="p-1 mt-1 border rounded-xl border-b-zinc-400 bg-transparent" name={props.inputName}
            onChange={(event) => {
                if (event.target.value.length <= 150) {
                    setTextInput(event.target.value)
                } else {
                    let exceededLength = (event.target.value.length - 150) * -1;
                    setTextInput(event.target.value.slice(0, exceededLength))
                }
            }}
            id={props.inputName} ref={ref} rows={5}>
                {textInput}
        </textarea>
        <span className={`absolute bottom-1 right-2 text-xs text-neutral-400`}>{textInput ? textInput.length : 0}/150</span>
    </div>
});

export default TextAreaInput;