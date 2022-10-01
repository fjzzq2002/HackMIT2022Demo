import React, { Component } from "react";
import "./index.css";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import Button from "react-bootstrap/Button";
import { useState } from "react";
const CryptoJS = require("crypto-js");


export default function Login() {

    const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [remark, setRemark] = useState("");
    async function login() {
        // md5 password
        let md5Password = CryptoJS.MD5(password + "goodeat").toString();
        const query = "?username=" + username + "&password=" + md5Password;
        let result = await (await fetch("http://localhost:5000/api/createUser" + query)).text();
        console.log(result);
        if (result.indexOf("success") != -1) {
            setRemark("Successully registered!");
            return;
        }
        result = await (await fetch("http://localhost:5000/api/login" + query)).text();
        console.log(result);
        if (result.indexOf("success") != -1) {
			setRemark("Successully logged in!");
			return;
		}
        console.log(result);
        setRemark("Invalid username or password!");
    }
    return (
		<>
			<input
				type="text"
				className="text-3xl border-b-2 border-neutral-300 p-1 Lora"
				placeholder="Username"
				style={{ width: "100%" }}
				onChange={(t) => setUsername(t.target.value)}
				maxLength="20"
			/>
			<input
				type="text"
				className="text-3xl border-b-2 border-neutral-300 p-1 Lora"
				placeholder="Password"
				style={{ width: "100%" }}
				onChange={(t) => setPassword(t.target.value)}
				maxLength="20"
			/>
			<Button variant="primary" onClick={login}>
				Submit
			</Button>
			<p>{remark}</p>
		</>
	);
}
