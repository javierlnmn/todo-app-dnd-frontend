import { FC } from 'react';

interface InputFieldProps {
    name: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    placeholder: string;
    type: string;
    id?: string;
    required?: boolean;
    error?: boolean;
    isTextArea?: boolean;
}

const InputField: FC<InputFieldProps> = ({ name, value, onChange, placeholder, type, id, required = false, error = false, isTextArea = false, }) => {
    const inputStyles = `w-full p-3 border bg-zinc-50 border-zinc-200 hover:border-zinc-300 focus:border-zinc-300 dark:bg-zinc-700 dark:border-zinc-600 dark:hover:border-zinc-500 hover: dark:focus:border-zinc-500 rounded-md outline-none transition-all
        ${error && '!border !border-red-400 dark:!border-red-500 text-red-600 dark:text-red-500'}
    `;
    
    if (isTextArea) {
        return (
            <textarea
                onChange={onChange}
                id={id}
                name={name}
                value={value}
                required={required}
                placeholder={placeholder}
                className={inputStyles}
            />
        );
    }
    return (
        <input
            onChange={onChange}
            id={id}
            name={name}
            value={value}
            type={type}
            required={required}
            placeholder={placeholder}
            className={inputStyles}
        />
    );
};

export default InputField;
