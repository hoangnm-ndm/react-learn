const myInfor = {
	name: "hoang",
	age: 22,
};

myInfor.name;

const { name, age } = myInfor;

function useForm() {
	return {
		register: () => {},
		handleSubmit: () => {},
		formState: {
			errors: {},
		},
	};
}

const {
	register,
	handleSubmit,
	formState: { errors },
} = useForm();
