export interface LoginFormProps {
    username: string;
    password: string;
}

export interface LoginFormFieldErrors {
    username: string[];
    password: string[];
}

export interface SignUpFormProps extends LoginFormProps {
    confirmPassword: string;
}

export interface SignUpFormFieldErrors {
    username: string[];
    password: string[];
    confirmPassword: string[];
}