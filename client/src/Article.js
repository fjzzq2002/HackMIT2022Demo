import React, { Component } from 'react';
import './index.css';
import Greetings from "./Greetings";
import { BiCoinStack, BiBookOpen, BiPen, BiGlassesAlt } from 'react-icons/bi';
import { BsBook, BsVectorPen, BsPen } from 'react-icons/bs';
import { useLoaderData } from 'react-router-dom';
import Previewcard from './Previewcard';
import { IconContext } from "react-icons";
import { HiOutlineLightBulb, HiOutlineSparkles, HiOutlineSun, HiOutlineMoon } from 'react-icons/hi';
import { useNavigate } from "react-router-dom";
import {cfetch} from './cookiefetch';

export async function loader({params}) {
    const uid=params.articleId;
    const response = await cfetch(
		"http://localhost:5000/api/fetch?id=" + uid
	);
    let data;
    try {
        data = await response.json();
        console.log(data);
        if (data.article === undefined) 
            throw("No article found");
    } catch (error) {
        console.log(error);
        return {id:uid, access:false};
    }
    return {id:uid,content:data.content,title:data.title,type:data.type,author:data.author,access:true};
}

function Tag(props) {
    let icon=<></>;
    if(props.type=='Insight')
        icon=<HiOutlineLightBulb className="lightbulb"/>;
    if(props.type=='Fiction')
        icon=<HiOutlineSparkles className="sparkle"/>;
    if(props.type=='Life')
        icon=<HiOutlineSun className="sun"/>;
  return (
    <>
    <IconContext.Provider value={{ color: "black", className: "s1" }}>
        {icon}
    </IconContext.Provider>
    </>
  );
}

export default function Article() {
    const articleInfo=useLoaderData();
    const navigate = useNavigate();

    async function unlock(id) {
        console.log('unlock',id);
        const data = await cfetch('http://localhost:5000/api/buy?id='+id);
        console.log(data.text());
        //data = await data.text();
        //if (data.indexOf('success') !== -1) {
        document.location=('/read/'+id);
    }

    let content=<></>;
    if(!articleInfo.access) {
        content=(<>
        <Greetings text={<>You don't have access to this article so far. You can&nbsp;
        
        <span onClick={()=>unlock(articleInfo.id)} className="link">unlock it with 1 coin</span>.
        
        </>}/>
        </>);
    }
    else {
        content=<div dangerouslySetInnerHTML={{ __html: articleInfo.content }} />;
    }
    return (<>
        <div className="text-lg px-10">
            <div className="flex flex-row justify-between pb-3">
            <div className="text-3xl">
            <Tag type={articleInfo.type}/>
            <span style={{fontWeight:"600",paddingLeft:"10px"}}>
            {articleInfo.title}
            </span>
            </div>
            <div className="text-xl mt-1">
                By&nbsp;<span className="link" onClick={
                    ()=>{document.location='/user/'+articleInfo.author}
                }>{articleInfo.author}</span>
            </div>
            </div>
            {content}
        </div>
    </>);
}