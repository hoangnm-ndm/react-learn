import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ProductContext } from "../../contexts/ProductContext";
import instance from "../../axios";

const Dashboard = () => {
	const { state, dispatch } = useContext(ProductContext);

	const handleDelete = async (id) => {
		if (window.confirm("Are you sure you want to delete this product?")) {
			try {
				await instance.delete(`/products/${id}`);
				dispatch({ type: "DELETE_PRODUCT", payload: id });
			} catch (error) {
				console.error("Failed to delete product:", error);
			}
		}
	};
	return (
		<div>
			<h1>Hello, admin</h1>
			<Link to="/admin/product-add" className="btn btn-primary">
				Add new product
			</Link>
			<table className="table table-bordered table-striped text-center">
				<thead>
					<tr>
						<th>ID</th>
						<th>Title</th>
						<th>Price</th>
						<th>Description</th>
						<th>Thumbnail</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					{state.products.map((p) => (
						<tr key={p.id}>
							<td>{p.id}</td>
							<td>{p.title}</td>
							<td>{p.price}</td>
							<td>{p.description || "Dang cap nhat"}</td>
							<td>{p.thumbnail ? <img src={p.thumbnail} alt="Dang cap nhat" /> : "Dang cap nhat"}</td>
							<td>
								<button className="btn btn-danger" onClick={() => handleDelete(p.id)}>
									Delete
								</button>
								<Link to={`/admin/product-edit/${p.id}`} className="btn btn-warning">
									Edit
								</Link>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default Dashboard;
