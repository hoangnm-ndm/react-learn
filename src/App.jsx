import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import "./App.scss";
import instance from "./axios";
import AuthForm from "./components/AuthForm";
import Footer from "./components/Footer";
import Header from "./components/Header";
import ProductForm from "./components/ProductForm";
import About from "./pages/About";
import Dashboard from "./pages/admin/Dashboard";
import Home from "./pages/Home";
import Notfound from "./pages/Notfound";
import ProductDetail from "./pages/ProductDetail";
import PrivateRouter from "./components/PrivateRouter";

function App() {
	const [products, setProducts] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		(async () => {
			try {
				const { data } = await instance.get("/products");
				console.log(data);
				setProducts(data);
			} catch (error) {
				console.log(error);
			}
		})();
	}, []);

	const handleProduct = async (data) => {
		try {
			if (data.id) {
				await instance.patch(`/products/${data.id}`, data);
				const newData = await instance.get(`/products`);
				setProducts(newData);
			} else {
				const res = await instance.post(`/products`, data);
				setProducts([...products, res.data]);
			}
			if (confirm("Successfully, redirect to admin page!")) {
				navigate("/admin");
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			<Header />
			<main>
				<Routes>
					<Route path="/" element={<Home data={products} />} />
					<Route path="/home" element={<Navigate to="/" />} />
					<Route path="/product-detail/:id" element={<ProductDetail />} />
					<Route path="/about" element={<About />} />
					<Route path="/register" element={<AuthForm isRegister />} />
					<Route path="/login" element={<AuthForm />} />

					<Route path="/admin" element={<PrivateRouter />}>
						<Route path="/admin" element={<Dashboard data={products} />} />
						<Route path="/admin/product-add" element={<ProductForm onSubmit={handleProduct} />} />
						<Route path="/admin/product-edit/:id" element={<ProductForm onSubmit={handleProduct} />} />
					</Route>

					<Route path="*" element={<Notfound />} />
				</Routes>
			</main>
			<Footer />
		</>
	);
}

export default App;
