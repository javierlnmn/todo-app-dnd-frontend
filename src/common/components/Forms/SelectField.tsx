import { FC } from 'react';

interface SelectFieldProps {
    name: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    options: { label: string, value: string }[];
    disabled?: boolean;
    error?: boolean;
    id?: string;
    placeholder?: string;
    allowEmpty?: boolean;
}

const SelectField: FC<SelectFieldProps> = ({ name, value, onChange, options, disabled = false, error = false, placeholder = "-", allowEmpty = false}) => {
    return (
        <select
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={`w-full p-3 border bg-zinc-50 border-zinc-200 hover:border-zinc-300 hover: focus:border-zinc-300 dark:bg-zinc-700 dark:border-zinc-600 dark:hover:border-zinc-500 hover: dark:focus:border-zinc-500 rounded-md outline-none transition-all
                ${error && '!border !border-red-400 dark:!border-red-500 text-red-600 dark:text-red-500'}
            `}
        >
            {allowEmpty && <option value={''} defaultChecked>{placeholder}</option>}
            {options.map((option, key) => (
                <option key={key} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
};

export default SelectField;
