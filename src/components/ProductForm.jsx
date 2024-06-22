import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import productSchema from "../schemaValid/productSchema";
import { useNavigate, useParams } from "react-router-dom";
import { ProductContext } from "../contexts/ProductContext";
import instance from "../axios";
import { zodResolver } from "@hookform/resolvers/zod";

const { VITE_CLOUD_NAME, VITE_UPLOAD_PRESET } = import.meta.env;

const ProductForm = () => {
	const { id } = useParams();
	const { dispatch } = useContext(ProductContext);
	const nav = useNavigate();
	const [thumbnailUrl, setThumbnailUrl] = useState(null);

	// State để lưu trữ lựa chọn của người dùng
	const [thumbnailOption, setThumbnailOption] = useState("keep");

	// State lưu trữ link ảnh từ bên ngoài
	const [linkOnlineImage, setLinkOnlineImage] = useState("");

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		resolver: zodResolver(productSchema),
	});

	useEffect(() => {
		if (id) {
			(async () => {
				const { data } = await instance.get(`/products/${id}`);
				console.log(data);
				reset(data);
				setThumbnailUrl(data.thumbnail);
			})();
		}
	}, [id, reset]);

	const uploadImage = async (file) => {
		const formData = new FormData();
		formData.append("file", file);
		formData.append("upload_preset", VITE_UPLOAD_PRESET);

		const response = await fetch(`https://api.cloudinary.com/v1_1/${VITE_CLOUD_NAME}/image/upload`, {
			method: "POST",
			body: formData,
		});
		const data = await response.json();
		console.log(data);
		return data.secure_url;
	};

	const onSubmit = async (product) => {
		try {
			let updatedProduct = { ...product };
			// Kiểm tra lựa chọn của người dùng và xử lý tương ứng
			switch (thumbnailOption) {
				case "upload":
					// Xử lý upload ảnh từ local
					if (product.thumbnail && product.thumbnail[0]) {
						const thumbnailUrl = await uploadImage(product.thumbnail[0]);
						updatedProduct = { ...updatedProduct, thumbnail: thumbnailUrl };
					}
					break;
				default:
				// Giữ nguyên ảnh cũ khi không thay đổi
				// Hoặc mặc định khi người dùng chọn "link online"
			}

			if (id) {
				const { data } = await instance.patch(`/products/${id}`, updatedProduct);
				dispatch({ type: "UPDATE_PRODUCT", payload: { id, product: updatedProduct } });
				console.log(data);
			} else {
				const { data } = await instance.post("/products", updatedProduct);
				dispatch({ type: "ADD_PRODUCT", payload: data });
				console.log(data);
			}

			nav("/admin");
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
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
				{/* <div className="mb-3">
					<label htmlFor="thumbnail" className="form-label">
						Thumbnail
					</label>
					<input type="file" className="form-control" id="thumbnail" {...register("thumbnail")} />
					{errors.thumbnail?.message && <p className="text-danger">{errors.thumbnail?.message}</p>}
					{thumbnailUrl && (
						<img src={thumbnailUrl} alt="Product Thumbnail" style={{ maxWidth: "200px", marginTop: "10px" }} />
					)}
				</div> */}

				<div className="mb-3">
					<label htmlFor="thumbnailOption" className="form-label">
						Choose Thumbnail Option
					</label>
					<select
						className="form-control"
						id="thumbnailOption"
						value={thumbnailOption}
						onChange={(e) => setThumbnailOption(e.target.value)}
					>
						<option value="keep">Keep Current Thumbnail</option>
						<option value="link">Add Thumbnail from Link</option>
						<option value="upload">Upload Thumbnail from Local</option>
					</select>
				</div>

				{thumbnailOption === "link" && (
					<div className="mb-3">
						<label htmlFor="thumbnail" className="form-label">
							Thumbnail
						</label>
						<input type="text" className="form-control" id="thumbnail" {...register("thumbnail")} />
						{errors.thumbnail?.message && <p className="text-danger">{errors.thumbnail?.message}</p>}
						{thumbnailUrl && (
							<img src={thumbnailUrl} alt="Product Thumbnail" style={{ maxWidth: "200px", marginTop: "10px" }} />
						)}
					</div>
				)}

				{thumbnailOption === "upload" && (
					<div className="mb-3">
						<label htmlFor="thumbnail" className="form-label">
							Thumbnail
						</label>
						<input type="file" className="form-control" id="thumbnail" {...register("thumbnail")} />
						{errors.thumbnail?.message && <p className="text-danger">{errors.thumbnail?.message}</p>}
						{thumbnailUrl && (
							<img src={thumbnailUrl} alt="Product Thumbnail" style={{ maxWidth: "200px", marginTop: "10px" }} />
						)}
					</div>
				)}
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
