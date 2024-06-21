import { zodResolver } from "@hookform/resolvers/zod";
import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import productSchema from "../schemaValid/productSchema";
import { useNavigate, useParams } from "react-router-dom";
import instance from "../axios";
import { ProductContext } from "../contexts/ProductContext";

const ProductForm = () => {
	const { dispatch } = useContext(ProductContext);
	const { id } = useParams();

	const nav = useNavigate();
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
			})();
		}, [id]);
	}

	const onSubmit = async (data) => {
		try {
			if (id) {
				await instance.patch(`/products/${id}`, data);
				dispatch({ type: "EDIT_PRODUCT", payload: { id, ...data } });
			} else {
				const res = await instance.post(`/products`, data);
				dispatch({ type: "ADD_PRODUCT", payload: res.data });
			}
			if (confirm("Successfully, redirect to admin page!")) {
				nav("/admin");
			}
		} catch (error) {
			console.log(error);
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
					<button className="btn btn-primary w-100" type="submit">
						{id ? "Edit" : "Add"} product
					</button>
				</div>
			</form>
		</div>
	);
};

export default ProductForm;
