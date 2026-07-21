import type { InputHTMLAttributes } from "react";

import "./styles.css";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function Input({ label, id, ...props }: InputProps) {
  return (
    <div className="input-group">
      <label htmlFor={id} className="input-label">
        {label}
      </label>

      <input id={id} className="input" {...props} />
    </div>
  );
}