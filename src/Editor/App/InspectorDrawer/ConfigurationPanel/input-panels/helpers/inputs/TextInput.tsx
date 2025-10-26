import React, { useEffect, useState } from "react";

import { InputProps, TextField } from "@mui/material";

type Props = {
	label: string;
	rows?: number;
	placeholder?: string;
	helperText?: string | JSX.Element;
	InputProps?: InputProps;
	value?: string;
	defaultValue: string;
	onChange: (v: string) => void;
};
export default function TextInput({
	helperText,
	label,
	placeholder,
	rows,
	InputProps,
	defaultValue,
	onChange,
	value: initialValue,
}: Props) {
	const [value, setValue] = useState(defaultValue);
	const isMultiline = typeof rows === "number" && rows > 1;

	useEffect(() => {
		if (initialValue != undefined) {
			setValue(initialValue);
		}
	}, [initialValue]);

	return (
		<TextField
			fullWidth
			multiline={isMultiline}
			minRows={rows}
			variant={isMultiline ? "outlined" : "standard"}
			label={label}
			placeholder={placeholder}
			helperText={helperText}
			InputProps={InputProps}
			value={value}
			onChange={(ev) => {
				const v = ev.target.value;
				setValue(v);
				onChange(v);
			}}
		/>
	);
}
