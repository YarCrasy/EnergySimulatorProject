import { useId, useState, type InputHTMLAttributes } from "react";

import "./PasswordInput.css";

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "className"> & {
  containerClassName?: string;
  inputClassName?: string;
  toggleClassName?: string;
};

export default function PasswordInput({
  containerClassName,
  inputClassName,
  toggleClassName,
  id,
  ...inputProps
}: PasswordInputProps) {
  const fallbackId = useId();
  const inputId = id ?? fallbackId;
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className={["password-input", containerClassName].filter(Boolean).join(" ")}>
      <input
        {...inputProps}
        id={inputId}
        className={["password-input__field", inputClassName].filter(Boolean).join(" ")}
        type={isVisible ? "text" : "password"}
      />
      <button
        type="button"
        className={["password-input__toggle", toggleClassName].filter(Boolean).join(" ")}
        onClick={() => setIsVisible((currentValue) => !currentValue)}
        aria-label={isVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
        aria-pressed={isVisible}
      >
        {isVisible ? "Ocultar" : "Mostrar"}
      </button>
    </div>
  );
}