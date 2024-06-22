import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import AccessDenied from "../pages/AccessDenied";

const PrivateRouter = () => {
	const { isAuthenticated, user } = useContext(AuthContext);
	console.log(isAuthenticated, user);
	/**
	 * isAuthenticated: true | false
	 * user: { email: "...", role: "admin}
	 *
	 */

	// Trong trường hợp muốn bắt người dùng đăng nhập mới được truy cập vào trang home để mua hàng thì bật phần này
	// if (!isAuthenticated) {
	// 	return <Navigate to="/login" />;
	// }

	// Trong trường hợp muốn bắt người dùng đăng nhập và role=admin được truy cập vào trang admin thì bật phần này
	if (user?.role !== "admin") {
		return <AccessDenied />;
	}

	return <Outlet />;
};

export default PrivateRouter;
