import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRouter = () => {
	const accessToken = JSON.parse(localStorage.getItem("user"))?.accessToken;
	console.log(accessToken);
	return accessToken ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRouter;
