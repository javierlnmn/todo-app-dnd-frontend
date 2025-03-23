import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

import LogoutIcon from '@icons/LogoutIcon';

import Option from '@common/components/Sidebar/Option';
import TitleSection from '@common/components/Sidebar/TitleSection';
import { sidebarRoutes } from '@common/routes/routes';
import ToggleDarkModeButtons from '@common/components/ToggleDarkModeButtons';

import { useUserStore } from '@auth/stores/userStore';


const Sidebar = () => {

    const { username, isSuperuser } = useUserStore();

    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    }

    const location = useLocation();

    return (
        <motion.nav
            layout
            className='h-screen z-20 w-full max-md:fixed max-md:top-0 max-md:left-0 bg-zinc-200 dark:bg-zinc-800 p-3 flex flex-col gap-3'
            style={{
                width: isOpen ? '225px': 'fit-content'
            }}
        >
            <TitleSection handleToggleSidebar={toggleSidebar} username={username} isSuperuser={isSuperuser} isSidebarOpen={isOpen} />
            <motion.span layout className='w-full h-[1px] bg-zinc-500 opacity-50'></motion.span>
            <div className='flex flex-col gap-2 flex-1'>
                {sidebarRoutes.map((route, index) => (
                    <Option
                        isSidebarOpen={isOpen}
                        currentLocation={location.pathname}
                        key={index}
                        {...route}
                    />
                ))}
                <div className='mt-auto'>
                    <ToggleDarkModeButtons />
                    <div className='text-red-500'>
                        <Option
                            isSidebarOpen={isOpen}
                            currentLocation={location.pathname}
                            Icon={LogoutIcon}
                            pathname='/logout'
                            title='Logout'
                        />
                    </div>
                </div>
            </div>
        </motion.nav>
	)
}

export default Sidebar;
