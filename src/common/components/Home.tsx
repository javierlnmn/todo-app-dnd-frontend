import { toast } from "react-toastify";

import CrownIcon from "@icons/CrownIcon";

import ToggleDarkModeButtons from "@common/components/ToggleDarkModeButtons";


const Home = () => {

    const notifyExample = () => {
        toast.info('This is a notification example!', {
            className: '!bg-zinc-100 dark:!bg-zinc-800 !text-zinc-800 dark:!text-zinc-200',
        });
    }

    return (
        <div className="h-full grid place-items-center">
            <div className="w-11/12 max-w-5xl m-auto flex flex-col justify-center gap-4">
                <h1 className="font-bold text-4xl text-center">Welcome to the Todo App :)</h1>

                <div>
                    <p className="text-lg dark:text-zinc-200">
                        With this app you can <b>efficiently</b> manage your todos. You can register and login easily with just a username and password. Your session will be stored.
                    </p>

                    <p className="text-lg dark:text-zinc-200">
                        There are two kind of users in the app: <span className="text-sky-600">regular users</span> and <span className="text-yellow-600">admins</span>.
                        Depending on the role, you have will have more or less permissions.
                    </p>
                </div>

                <div className="text-lg flex flex-col gap-2">
                    <h2 className="font-semibold text-2xl text-sky-600">Everyone is able to:</h2>
                    <ul className="list-disc pl-5 dark:text-zinc-200">
                        <li><b>Manage their own todos</b>: create, update and delete them.</li>
                        <li><b>Comment on anyone's todo</b>, and <b>delete</b> their own comments too.</li>
                    </ul>

                    <h2 className="font-semibold text-2xl text-yellow-600">Admins:</h2>
                    <ul className="list-disc pl-5 dark:text-zinc-200">
                        <li>Are easily identifiable with a <b>yellow crown <span className="relative">badge<CrownIcon className='absolute top-0 -right-[5px] rotate-[35deg] w-3 h-3 dark:fill-yellow-400 dark:stroke-yellow-400 fill-yellow-600 stroke-yellow-600' /></span></b> next to their name in the sidebar.</li>
                        <li>Have special control to manage <b>all tasks</b> across users, not just their own.</li>
                        <li>Can <b>delete anyone's comments</b> in any todo</li>
                    </ul>
                    
                    <h2 className="font-semibold text-2xl">Among the app's features:</h2>
                    <ul className="list-disc pl-5 dark:text-zinc-200">
                        <li>You will find some <b>animations</b>.</li>
                        <li>Thanks to the interface, todo's <b>status</b> is easily changed by <b>dragging the todos</b> you aree allowed to.</li>
                        <li>When confirming the deletion of an item, you will be <button className="cursor-pointer" onClick={notifyExample}><b>notified</b> <span className="underline opacity-50">(Click to see!)</span></button>.</li>
                        <li>When an operation is not completed successfully, you will be notified as well.</li>
                        <li><span className="flex gap-2 items-center">You can change between dark and light mode: <ToggleDarkModeButtons />.</span></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Home;
