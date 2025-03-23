import { FC, useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';

import LoadingThrobber from '@common/components/LoadingThrobber';
import ToggleDarkModeButtons from '@common/components/ToggleDarkModeButtons';

import { isUserAuthenticated } from '@auth/utils/user';


const Session: FC = () => {
	const navigate = useNavigate();

	// Check if user is authenticated already
    const [userAuthenticated, setUserAuthenticated] = useState<boolean | null>(null);

	useEffect(() => {

        const checkUserIsAuthenticated = async () => {
            try {
				const userAuthenticated = await isUserAuthenticated();

                if (userAuthenticated) navigate('/');

				setUserAuthenticated(userAuthenticated);
			} catch (error) {
				setUserAuthenticated(false);
			}
        };

        checkUserIsAuthenticated();

    }, []);

	return userAuthenticated === null ? (
		<LoadingThrobber className='h-screen w-full bg-zinc-50 text-zinc-800 dark:text-zinc-200 dark:bg-zinc-800' />
	) : userAuthenticated ? (
		<Navigate to={'/'} />
	) : (
		<div className='h-screen w-screen grid place-items-center bg-zinc-50 text-zinc-800 dark:text-zinc-200 dark:bg-zinc-900'>
			<div className='absolute top-3 right-3'>
				<ToggleDarkModeButtons />
			</div>
			<Outlet />
		</div>
	);
};

export default Session;
