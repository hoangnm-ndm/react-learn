import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import productSchema from "../../schemaValid/productSchema";
import { useParams } from "react-router-dom";
import instance from "../../axios";

const ProductEdit = ({ onEdit }) => {
	const { id } = useParams();
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		resolver: zodResolver(productSchema),
	});
	useEffect(() => {
		(async () => {
			const res = await instance.get(`/products/${id}`);
			reset(res.data);
		})();
	}, []);
	return (
		<div>
			<form onSubmit={handleSubmit((data) => onEdit({ ...data, id }))}>
				<h1>Product Edit</h1>
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
						Edit Product
					</button>
				</div>
			</form>
		</div>
	);
};

export default ProductEdit;
