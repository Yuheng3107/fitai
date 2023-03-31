import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

function FeedbackBox ({ children, className }: Props) {
    return <div className={`${className}`}>
        {children}
    </div>
}

export default FeedbackBox