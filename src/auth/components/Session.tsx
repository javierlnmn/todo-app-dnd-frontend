import { FC } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import LoadingThrobber from '@common/components/LoadingThrobber';
import ToggleDarkModeButtons from '@common/components/ToggleDarkModeButtons';

import { isUserAuthenticated } from '@auth/utils/user';


const Session: FC = () => {

	const { data: isAuthenticated, isLoading } = useQuery({
		queryKey: ["authStatus"],
		queryFn: isUserAuthenticated,
		retry: false,
		refetchOnWindowFocus: false,
	});

	return isLoading ? (
		<LoadingThrobber className='h-screen w-full bg-zinc-50 text-zinc-800 dark:text-zinc-200 dark:bg-zinc-800' />
	) : isAuthenticated ? (
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
