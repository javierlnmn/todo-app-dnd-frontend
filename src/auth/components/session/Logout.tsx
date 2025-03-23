import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { removeStoredUserToken } from '@auth/utils/jwt';
import { useUserStore } from '@auth/stores/userStore';

import LoadingThrobber from '@common/components/LoadingThrobber';


const Logout: FC = () => {

    const navigate = useNavigate();
	const { removeUser } = useUserStore();

    useEffect(() => {
        removeStoredUserToken();
		removeUser();
        navigate('/session/login');
    }, []); 

    return <LoadingThrobber className='h-screen w-full' />;
}

export default Logout;