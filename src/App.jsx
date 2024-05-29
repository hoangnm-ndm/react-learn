import React, { useEffect, useState } from "react";
import "./App.scss";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Notfound from "./pages/Notfound";
import instance from "./axios";
import ProductDetail from "./pages/ProductDetail";
import Dashboard from "./pages/admin/Dashboard";

function App() {
	const [products, setProducts] = useState([]);

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
	return (
		<>
			<Header />
			<main>
				<Routes>
					<Route path="/" element={<Home data={products} />} />
					<Route path="/home" element={<Navigate to="/" />} />
					<Route path="/product-detail/:id" element={<ProductDetail />} />
					<Route path="/about" element={<About />} />
					<Route path="/login" element={<Login />} />
					<Route path="/admin" element={<Dashboard data={products} />} />
					<Route path="*" element={<Notfound />} />
				</Routes>
			</main>
			<Footer />
		</>
	);
}

export default App;
