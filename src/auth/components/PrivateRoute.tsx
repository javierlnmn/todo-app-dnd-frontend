import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import LoadingThrobber from "@common/components/LoadingThrobber";

import { isUserAuthenticated } from "@auth/utils/user";


interface PrivateRouteProps {
	children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
	const { data: isAuthenticated, isLoading } = useQuery({
		queryKey: ["authStatus"],
		queryFn: isUserAuthenticated,
		// staleTime: 5 * 60 * 1000,
		retry: false,
		refetchOnWindowFocus: false,
	});

	return isLoading ? (
		<LoadingThrobber className="h-screen w-full" />
	) : !isAuthenticated ? (
		<Navigate to="/session/login" />
	) :  (
		children
	);
};

export default PrivateRoute;