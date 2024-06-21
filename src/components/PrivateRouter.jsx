import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const PrivateRouter = () => {
	const { isAuthenticated, user } = useContext(AuthContext);

	if (!isAuthenticated) {
		return <Navigate to="/login" />;
	}

	if (user?.role !== "admin") {
		return <Navigate to="/" />;
	}

	return <Outlet />;
};

export default PrivateRouter;
