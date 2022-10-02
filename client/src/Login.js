import React, { Component } from "react";
import "./index.css";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import Cookies from "universal-cookie";
const CryptoJS = require("crypto-js");


export default function Login() {
    const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [remark, setRemark] = useState("");
    async function login() {
        // md5 password
        let md5Password = CryptoJS.MD5(password + "goodeat").toString();
        const query = "?username=" + username + "&password=" + md5Password;
        let result = await (await fetch("http://127.0.0.1:5000/api/createUser" + query)).text();
        console.log(result);
        if (result.indexOf("success") != -1) {
			const cookies = new Cookies();
			cookies.set("username", username, { path: "/" });
			cookies.set("password", md5Password, { path: "/" });
            setRemark("Successfully registered & logged in! Redirecting...");
			if(window.refresh_un) window.refresh_un();
			setTimeout(()=>{
				document.location='/';
			},1500);
            return;
        }
        result = await (await fetch("http://127.0.0.1:5000/api/login" + query)).text();
        console.log(result);
        if (result.indexOf("success") != -1) {
			const cookies = new Cookies();
			cookies.set("username", username, { path: "/" });
			cookies.set("password", md5Password, { path: "/" });
			setRemark("Successfully logged in! Redirecting...");
			if(window.refresh_un) window.refresh_un();
			setTimeout(()=>{
				document.location='/';
			},1500);
			return;
		}
        console.log(result);
        setRemark("Invalid username or password!");
    }
    return (
		<div className="flex justify-center align-between flex-column text-center">
			<input
				type="text"
				className="text-3xl border-b-2 border-neutral-300 p-1 Lora m-auto my-3"
				placeholder="Username"
				style={{ width: "50%" }}
				onChange={(t) => setUsername(t.target.value)}
				maxLength="20"
			/>
			<input
				type="password"
				className="text-3xl border-b-2 border-neutral-300 p-1 Lora m-auto my-1"
				placeholder="Password"
				style={{ width: "50%" }}
				onChange={(t) => setPassword(t.target.value)}
				maxLength="20"
			/>
			<Button
				variant="outline-primary"
				onClick={login}
				className="m-auto mt-5 mb-4"
                size="lg"
				style={{ width: "20%" }}
			>
				Login / Register
			</Button>
			<p className="text-center" style={{color:"red"}}>{remark}</p>
		</div>
	);
}
