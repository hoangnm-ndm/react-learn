import { zodResolver } from "@hookform/resolvers/zod";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import productSchema from "../schemaValid/productSchema";
import { useNavigate, useParams } from "react-router-dom";
import { ProductContext } from "../contexts/ProductContext";
import instance from "../axios";

console.log(import.meta.env.VITE_UPLOAD_PRESET);

// const { CLOUD_NAME, API_KEY, API_SECRET, UPLOAD_PRESET } = process.env;
// console.log(process.env);

const ProductForm = () => {
	const { id } = useParams();
	const { dispatch } = useContext(ProductContext);
	const nav = useNavigate();
	const [thumbnail, setThumbnail] = useState(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		resolver: zodResolver(productSchema),
	});

	if (id) {
		useEffect(() => {
			(async () => {
				const { data } = await instance.get(`/products/${id}`);
				reset(data);
				setThumbnail(data.thumbnail);
			})();
		}, [id, reset]);
	}

	const uploadImage = async (file) => {
		const formData = new FormData();
		formData.append("file", file);
		formData.append("upload_preset", UPLOAD_PRESET);

		const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
			method: "POST",
			body: formData,
		});
		const data = await response.json();
		return data.secure_url;
	};

	const onSubmit = async (product) => {
		try {
			let thumbnailUrl = thumbnail;
			if (product.thumbnail && product.thumbnail[0]) {
				thumbnailUrl = await uploadImage(product.thumbnail[0]);
			}
			const updatedProduct = { ...product, thumbnail: thumbnailUrl };

			if (id) {
				await instance.put(`/products/${id}`, updatedProduct);
				dispatch({ type: "UPDATE_PRODUCT", payload: { id, product: updatedProduct } });
			} else {
				const { data } = await instance.post("/products", updatedProduct);
				dispatch({ type: "ADD_PRODUCT", payload: data });
			}
			if (confirm("Redirect to admin?")) nav("/admin");
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div>
			<form onSubmit={handleSubmit((data) => onSubmit({ ...data, id }))}>
				<h1>{id ? "Edit" : "Add"} product</h1>
				<div className="mb-3">
					<label htmlFor="title" className="form-label">
						Title
					</label>
					<input type="text" className="form-control" id="title" {...register("title", { required: true })} />
					{errors.title?.message && <p className="text-danger">{errors.title?.message}</p>}
				</div>
				<div className="mb-3">
					<label htmlFor="price" className="form-label">
						Price
					</label>
					<input
						type="number"
						className="form-control"
						id="price"
						{...register("price", { required: true, valueAsNumber: true })}
					/>
					{errors.price?.message && <p className="text-danger">{errors.price?.message}</p>}
				</div>
				<div className="mb-3">
					<label htmlFor="description" className="form-label">
						Description
					</label>
					<input type="text" className="form-control" id="description" {...register("description")} />
					{errors.description?.message && <p className="text-danger">{errors.description?.message}</p>}
				</div>
				<div className="mb-3">
					<label htmlFor="thumbnail" className="form-label">
						Thumbnail
					</label>
					<input type="file" className="form-control" id="thumbnail" {...register("thumbnail")} />
					{thumbnail && (
						<img src={thumbnail} alt="Product Thumbnail" style={{ maxWidth: "200px", marginTop: "10px" }} />
					)}
				</div>
				<div className="mb-3">
					<button className="btn btn-primary w-100" type="submit">
						{id ? "Edit" : "Add"} product
					</button>
				</div>
			</form>
		</div>
	);
};

export default ProductForm;
