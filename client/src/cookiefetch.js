import React, { Component, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import "./index.css";
import Greetings from "./Greetings";
import { BiCoinStack } from "react-icons/bi";
import Cookies from "universal-cookie";
export function cfetch(url) {
    const cookies = new Cookies();
    let mid = "&",
        suffix = "loginname=" + cookies.get("username") +
			"&password=" +
			cookies.get("password");
    if (url.indexOf("?") === -1) {
        mid = "?";
    }
    return fetch(url + mid + suffix);
}




