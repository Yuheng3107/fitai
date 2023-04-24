import React, { ReactNode } from 'react';

interface Props {
    children: ReactNode;
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}


function UpDownButton({ children, onClick }: Props) {
    return <button onClick={onClick} className="bg-stone-200 p-2 rounded">
        {children}
    </button>
}

export default UpDownButton;