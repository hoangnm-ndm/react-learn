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

function App() {
	return (
		<>
			<Header />
			<main>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/home" element={<Navigate to="/" />} />
					<Route path="/product-detail/:id" element={<ProductDetail />} />
					<Route path="/register" element={<AuthForm isRegister />} />
					<Route path="/login" element={<AuthForm />} />

					<Route path="/admin" element={<PrivateRouter />}>
						<Route path="/admin" element={<Dashboard />} />
						<Route path="/admin/product-add" element={<ProductForm />} />
						<Route path="/admin/product-edit/:id" element={<ProductForm />} />
					</Route>

					<Route path="*" element={<Notfound />} />
				</Routes>
			</main>
			<Footer />
		</>
	);
}

export default App;
