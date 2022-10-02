import React, { Component } from 'react';
import { Route, Routes } from 'react-router-dom';
import './index.css';
import Previewcard from "./Previewcard";
import { useLoaderData } from "react-router-dom";
import {cfetch} from "./cookiefetch";

export async function loader({ params }) {
  console.log(params);
  const articleList = await cfetch("http://127.0.0.1:5000/api/list")
  .then((res)=>{console.log(res);return res.json()})
  .then((res) => {
    //res = res.json();
    console.log(res)
		return res.map((x) => (
			<Previewcard
				title={x.title}
				author={x.author}
				type={x.type}
				votes={[x.votes.upvotes, x.votes.downvotes]}
				description={x.description}
        id={x.article}
			/>
		));
  });
  return articleList;
}
export default function Home() {
  // let lists = fetch("/api/list");
  const homePage = useLoaderData();
  return homePage;
  // return (
  //   <>
  //     <Previewcard title="Is earth flat?" author="daxiang" type="Insight" votes={[3,5]} description="You can have a description of 30~100 characters. Yes, make a description of 100 characters, at most."/>
  //     <Previewcard title="Rainbow near Charles" author="jinglu" type="Life" votes={[3,0]} description="Came across this rainbow today."/>
  //     <Previewcard title="The three body problem" author="daliu" type="Fiction" votes={[0,5]} description="My latest work!!"/>
  //   </>
  // );
}