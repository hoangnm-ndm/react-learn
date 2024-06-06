import React, { useEffect, useState } from "react";
import "./App.scss";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Notfound from "./pages/Notfound";
import instance, { getProducts } from "./axios";
import ProductDetail from "./pages/ProductDetail";
import Dashboard from "./pages/admin/Dashboard";
import ProductAdd from "./pages/admin/ProductAdd";
import Register from "./pages/Register";
import ProductEdit from "./pages/admin/ProductEdit";

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

	const handleSubmit = (data) => {
		(async () => {
			try {
				const res = await instance.post("/products", data);
				setProducts([...products, res.data]);
				if (confirm("Add product successfully, redirect to admin page!")) {
					navigate("/admin");
				}
			} catch (error) {
				console.log(error);
			}
		})();
	};

	const handleSubmitEdit = (data) => {
		(async () => {
			try {
				const res = await instance.patch(`/products/${data.id}`, data);
				const newDatas = await instance.get(`/products`);
				setProducts(newDatas.data);
				if (confirm("Add product successfully, redirect to admin page!")) {
					navigate("/admin");
				}
			} catch (error) {
				console.log(error);
			}
		})();
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
					<Route path="/register" element={<Register />} />
					<Route path="/login" element={<Login />} />
					<Route path="/admin" element={<Dashboard data={products} />} />
					<Route path="/admin/product-add" element={<ProductAdd onAdd={handleSubmit} />} />
					<Route path="/admin/product-edit/:id" element={<ProductEdit onEdit={handleSubmitEdit} />} />
					<Route path="*" element={<Notfound />} />
				</Routes>
			</main>
			<Footer />
		</>
	);
}

export default App;
