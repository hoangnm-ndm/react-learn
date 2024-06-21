import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import instance from "../axios";

const ProductDetail = () => {
	const { id } = useParams();
	const [product, setProduct] = useState({});
	useEffect(() => {
		(async () => {
			const { data } = await instance.get(`/products/${id}`);
			setProduct(data);
		})();
	}, [id]);
	return (
		<div>
			<h1>Product Detail</h1>
			<img src={product.thumbnail} alt="" />
			<h1>{product.title}</h1>
		</div>
	);
};

export default ProductDetail;
