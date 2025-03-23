import '@/index.css';
import AppLayout from '@/AppLayout';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import ErrorLayout from '@common/components/ErrorLayout';
import { sidebarRouteConstants } from '@common/routes/routes';
import Home from '@common/components/Home';

import Session from '@auth/components/Session';
import PrivateRoute from '@auth/components/PrivateRoute';
import Logout from '@auth/components/session/Logout';
import LoginForm from '@auth/components/session/LoginForm';
import SignupForm from '@auth/components/session/SignUpForm';

import TodoKanban from '@todos/components/TodoKanban';


const router = createBrowserRouter([
	{
		path: '',
		element: (
			<PrivateRoute>
				<AppLayout />
			</PrivateRoute>
		),
		errorElement: (
			<ErrorLayout />
		),
		children: [
			{ path: sidebarRouteConstants.HOME, element: <Home /> },
			{ path: sidebarRouteConstants.TODOS, element: <TodoKanban /> },
		],
	},
	{
		path: 'session',
		element: <Session />,
		children: [
			{ index: true, element: <Navigate to="login" replace /> },
			{ path: 'login', element: <LoginForm /> },
			{ path: 'signup', element: <SignupForm /> },
		],
	},
	{
		path: 'logout',
		element: <Logout />
	},
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
		</QueryClientProvider>
	</React.StrictMode>
)
