import React, { createContext, useState, useEffect } from "react";
import instance from "../axios";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [user, setUser] = useState(null);

	useEffect(() => {
		const checkAuth = async () => {
			const token = localStorage.getItem("token");

			if (token) {
				try {
					// Dùng cách này khi đã có api/endpoint để kiểm tra token
					// const { data } = await instance.get("/me", {
					// 	headers: {
					// 		Authorization: `Bearer ${token}`,
					// 	},
					// });

					// Dùng cách này khi chưa có api/endpoint để kiểm tra token
					const { data } = await instance.get("/660/users/1", {
						headers: {
							Authorization: `Bearer ${token}`,
						},
					});
					console.log(data);
					setUser(data);
					setIsAuthenticated(true);
				} catch (error) {
					console.error(error);
					setIsAuthenticated(false);
					setUser(null);
				}
			}
		};
		checkAuth();
	}, []);

	const login = async (email, password) => {
		try {
			const { data } = await instance.post("/login", { email, password });
			localStorage.setItem("token", data.token);
			setUser(data.user);
			setIsAuthenticated(true);
		} catch (error) {
			console.error(error);
			setIsAuthenticated(false);
			setUser(null);
		}
	};

	const register = async (email, password) => {
		try {
			const { data } = await instance.post("/register", { email, password });
			localStorage.setItem("token", data.accessToken);
			setUser(data.user);
			setIsAuthenticated(true);
		} catch (error) {
			console.error(error);
			setIsAuthenticated(false);
			setUser(null);
		}
	};

	const logout = () => {
		localStorage.removeItem("token");
		setUser(null);
		setIsAuthenticated(false);
	};

	return (
		<AuthContext.Provider value={{ isAuthenticated, user, register, login, logout }}>{children}</AuthContext.Provider>
	);
};

export default AuthContextProvider;
