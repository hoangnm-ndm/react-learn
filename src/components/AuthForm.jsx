import { zodResolver } from "@hookform/resolvers/zod";
import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { schemaLogin, schemaRegister } from "../schemaValid/authSchema";
import { AuthContext } from "../contexts/AuthContext";

const AuthForm = ({ isRegister }) => {
	const nav = useNavigate();
	const { login, register: registerUser } = useContext(AuthContext);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({ resolver: zodResolver(isRegister ? schemaRegister : schemaLogin) });
	const onSubmit = async (data) => {
		try {
			if (isRegister) {
				await registerUser(data.email, data.password);
				if (confirm("Successfully, redirect to login page?")) nav("/login");
			} else {
				await login(data.email, data.password);
				if (confirm("Successfully, redirect to admin page?")) nav("/");
			}
		} catch (error) {
			alert(error.response.data || "Failed");
		}
	};
	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<h1>{isRegister ? "Register" : "Login"}</h1>
				<div className="mb-3">
					<label htmlFor="email" className="form-label">
						email
					</label>
					<input className="form-control" type="email" {...register("email")} />
					{errors.email && <p className="text-danger">{errors.email.message}</p>}
				</div>

				<div className="mb-3">
					<label htmlFor="password" className="form-label">
						password
					</label>
					<input className="form-control" type="password" {...register("password")} />
					{errors.password && <p className="text-danger">{errors.password.message}</p>}
				</div>

				{isRegister && (
					<div className="mb-3">
						<label htmlFor="confirmPass" className="form-label">
							Confirm password
						</label>
						<input className="form-control" type="password" {...register("confirmPass")} />
						{errors.confirmPass && <p className="text-danger">{errors.confirmPass.message}</p>}
					</div>
				)}

				<div className="mb-3">
					<button type="submit" className="btn btn-primary w-100">
						{isRegister ? "Register" : "Login"}
					</button>
				</div>
			</form>
		</div>
	);
};

export default AuthForm;
