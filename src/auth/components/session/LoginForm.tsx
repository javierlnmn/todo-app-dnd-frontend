import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { Link } from 'react-router-dom';

import { setStoredUserToken } from '@auth/utils/jwt';
import { LoginFormFieldErrors, LoginFormProps } from '@auth/types/session';
import { userLogin } from '@auth/services/user';

import LoadingThrobberIcon from '@icons/LoadingThrobberIcon';

const LoginForm: FC = () => {
    const navigate = useNavigate();

    // Login form
    const [formData, setFormData] = useState<LoginFormProps>({ username: '', password: '' });
    const [formFieldErrors, setFormFieldErrors] = useState<LoginFormFieldErrors>({ username: [], password: [] });
    const [formError, setFormError] = useState('');

    const isLoginFormValid = (): boolean => !formData.username || !formData.password;

    // Mutation for handling login
    const loginMutation = useMutation({
        mutationFn: userLogin,
        onSuccess: (userLoginResponseData) => {
            const token = `Bearer ${userLoginResponseData.access}`;
            setStoredUserToken(token);
            navigate('/');
        },
        onError: (error) => {
            if (isAxiosError(error) && error.response && error.response.data) {
                if (error.response.data.non_field_errors) {
                    setFormError(error.response.data.non_field_errors);
                } else {
                    setFormFieldErrors(error.response.data);
                }
            } else {
                setFormError('An unexpected error occurred during login');
            }
        }
    });

    const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = () => {
        setFormFieldErrors({ username: [], password: [] });
        setFormError('');
        loginMutation.mutate(formData);
    };

    return (
        <div className='bg-zinc-100 dark:bg-zinc-800 w-11/12 max-w-[500px] p-5 rounded-md shadow-md flex flex-col gap-3'>
            <h2 className='text-lg font-bold'>Login</h2>
            <div className='flex flex-col gap-5 items-center justify-center'>
                <div className='flex flex-col gap-1 w-full'>
                    <input
                        onChange={handleFieldChange}
                        name='username'
                        value={formData.username}
                        type='text'
                        placeholder='Username or Email'
                        className={`w-full p-3 bg-zinc-200 dark:bg-zinc-700 rounded-md border-0 shadow-md outline-none transition-all
                            ${formFieldErrors.username?.length > 0 ? '!border !border-red-400 dark:!border-red-500 text-red-600 dark:text-red-500' : ''}
                        `}
                    />
                    {formFieldErrors.username?.length > 0 && <p className='text-red-500'>{formFieldErrors.username?.join(' ')}</p>}
                </div>

                <div className='flex flex-col gap-1 w-full'>
                    <input
                        onChange={handleFieldChange}
                        name='password'
                        value={formData.password}
                        type='password'
                        placeholder='Password'
                        className={`w-full p-3 bg-zinc-200 dark:bg-zinc-700 rounded-md border-0 shadow-md outline-none transition-all
                            ${formFieldErrors.password?.length > 0 ? '!border !border-red-400 dark:!border-red-500 text-red-600 dark:text-red-500' : ''}
                        `}
                    />
                    {formFieldErrors.password?.length > 0 && <p className='text-red-500'>{formFieldErrors.password?.join(' ')}</p>}
                </div>

                <button
                    disabled={isLoginFormValid() || loginMutation.isPending}
                    onClick={handleSubmit}
                    type='submit'
                    className='text-zinc-100 bg-sky-600 transition-colors disabled:opacity-50 hover:bg-sky-500 w-full p-3 rounded-md font-bold flex justify-center'
                >
                    {loginMutation.isPending ? (
                        <LoadingThrobberIcon className='w-5 h-5 !fill-zinc-100' />
                    ) : (
                        'Login'
                    )}
                </button>
            </div>
            {formError && <p className='text-red-500'>{formError}</p>}
            <Link className='underline opacity-50 text-right' to={'/session/signup'}>Don't have an account?</Link>
        </div>
    );
};

export default LoginForm;
