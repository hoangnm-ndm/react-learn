import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function Header() {
	const { isAuthenticated, user, logout } = useContext(AuthContext);
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate("/");
	};

	return (
		<header>
			<ul>
				<li>
					<Link to="/">Home</Link>
				</li>
				<li>
					<Link to="/about">About</Link>
				</li>
				<li>
					<Link to="/products">Shop</Link>
				</li>
				{isAuthenticated ? (
					<>
						<li>
							<span>Welcome, {user?.email}</span>
						</li>
						<li>
							<button onClick={handleLogout}>Logout</button>
						</li>
						<li>
							<Link to="/admin">Bạn là admin?</Link>
						</li>
					</>
				) : (
					<>
						<li>
							<Link to="/login">Login</Link>
							{"/"}
							<Link to="/register">Register</Link>
						</li>
					</>
				)}
			</ul>
		</header>
	);
}
