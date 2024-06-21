import { z } from "zod";

export const schemaLogin = z.object({
	email: z.string().email(),
	password: z.string().min(6),
});

export const schemaRegister = z
	.object({
		email: z.string().email(),
		password: z.string().min(6),
		confirmPass: z.string().min(6),
	})
	.refine((data) => data.password === data.confirmPass, {
		message: "Password not match",
		path: ["confirmPass"],
	});
