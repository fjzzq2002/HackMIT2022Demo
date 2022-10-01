import React, { Component } from 'react';
import { Route, Routes } from 'react-router-dom';
import './index.css';
import Previewcard from "./Previewcard";
import { useLoaderData } from "react-router-dom";

export async function loader({ params }) {
  const articleList = await fetch("/api/list")
  .then((res)=>res.text())
  .then((res) => {
    console.log(res.text);
		return res.map((x) => (
			<Previewcard
				title={x.title}
				author={x.author}
				type={x.type}
				votes={[x.votes.upvotes, x.votes.downvotes]}
				description={x.description}
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