import React, { createContext, useEffect, useReducer } from "react";
import instance from "../axios";
import productReducer from "../reducers/productReducer";

export const ProductContext = createContext();

const ProductContextProvider = (props) => {
	const [state, dispatch] = useReducer(productReducer, { products: [] });

	useEffect(() => {
		(async () => {
			const { data } = await instance.get("/products");
			dispatch({ type: "SET_PRODUCTS", payload: data });
		})();
	}, []);

	return <ProductContext.Provider value={{ state, dispatch }}>{props.children}</ProductContext.Provider>;
};

export default ProductContextProvider;
