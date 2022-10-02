import React, { Component } from "react";
import { Route, Routes } from "react-router-dom";
import "./index.css";
import Previewcard from "./Previewcard";
import { useLoaderData } from "react-router-dom";
import { cfetch } from "./cookiefetch";
import { url } from "./url";

export async function loader({ params }) {
    console.log("params", params);
    const curUrl =
		url +
		"/api/retrieve?username=" +
		params.username +
		"&article=" +
		params.article +
		"&hash=" +
		params.hash;
    const result = await cfetch(curUrl);
    return params.article;
}
export default function Shared() {
    // document redirect
    const article = useLoaderData();
    document.location = "/read/" + article;
}
