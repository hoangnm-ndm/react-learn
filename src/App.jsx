import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.scss";
import AuthForm from "./components/AuthForm";
import Footer from "./components/Footer";
import Header from "./components/Header";
import PrivateRouter from "./components/PrivateRouter";
import ProductForm from "./components/ProductForm";
import Dashboard from "./pages/admin/Dashboard";
import Home from "./pages/Home";
import Notfound from "./pages/Notfound";
import ProductDetail from "./pages/ProductDetail";
import LayoutClient from "./components/LayoutClient";
import LayoutAdmin from "./components/LayoutAdmin";

function App() {
	return (
		<>
			<Routes>
				<Route path="/register" element={<AuthForm isRegister />} />
				<Route path="/login" element={<AuthForm />} />

				<Route path="/" element={<LayoutClient />}>
					<Route path="/" element={<Home />} />
					<Route path="/home" element={<Navigate to="/" />} />
					<Route path="/product-detail/:id" element={<ProductDetail />} />
				</Route>

				<Route path="/admin" element={<PrivateRouter />}>
					<Route path="/admin" element={<LayoutAdmin />}>
						<Route index element={<Dashboard />} />
						<Route path="/admin/product-add" element={<ProductForm />} />
						<Route path="/admin/product-edit/:id" element={<ProductForm />} />
					</Route>
				</Route>
				<Route path="*" element={<Notfound />} />
			</Routes>
		</>
	);
}

export default App;
