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
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ReportIcon from '@mui/icons-material/Report';
import SendIcon from '@mui/icons-material/Send';
import {url} from './url';

export async function loader({params}) {
    const uid=params.articleId;
    const response = await cfetch(
		url + "/api/fetch?id=" + uid
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
        const data = await cfetch(url + '/api/buy?id='+id);
        console.log(data.text());
        //data = await data.text();
        //if (data.indexOf('success') !== -1) {
        document.location=('/read/'+id);
    }

    async function vote(id, vote) {
        // return -1: if you are the author, or you have voted
        // otherwise, return your orginal cost (0/1)
        console.log('vote',id);
        const data = await cfetch(url + '/api/vote?id='+id+'&vote='+vote);
        const txt = await data.text();
        if (txt == 0) return 0;
        if (txt == 1) return 1;
        return -1;
    };

    let content=<></>;
    if(!articleInfo.access) {
        content=(<>
        <Greetings text={<>You don't have access to this article so far. You can&nbsp;
        
        <span onClick={()=>unlock(articleInfo.id)} className="link">unlock it with 1 coin</span>.
        
        </>}/>
        </>);
    }
    else {
        content=<>
        <div dangerouslySetInnerHTML={{ __html: articleInfo.content }} />
        <div className="flex justify-center">
            <div className="inline-block">
                <div className="flex">
							<div
								className="circle"
								style={{ color: "blue", borderColor: "blue" }}
								onClick={() => vote(articleInfo.id, 1)}
							>
								<ThumbUpIcon sx={{ fontSize: 45 }} />
							</div>
							<div
								className="circle"
								style={{ color: "brown", borderColor: "brown" }}
								onClick={() => vote(articleInfo.id, -1)}
							>
								<ThumbDownIcon sx={{ fontSize: 45 }} />
							</div>
							<div
								className="circle"
								style={{ color: "red", borderColor: "red" }}
							>
								<ReportIcon sx={{ fontSize: 45 }} />
							</div>
							<div
								className="circle"
								style={{ color: "green", borderColor: "green" }}
							>
								<SendIcon sx={{ fontSize: 45 }} />
							</div>
                </div>
                </div></div>
        </>;
    }
    return (<>
        <div className="text-lg px-10">
            <div className="flex flex-row justify-between pb-1 mb-4 border-dashed border-neutral-400 border-b-2">
            <div className="text-3xl">
            <Tag type={articleInfo.type}/>
            <span style={{fontWeight:"600",paddingLeft:"10px"}} className="Rashi">
            {articleInfo.title}
            </span>
            </div>
            <div className="text-xl mt-2">
                <span className="linknl" onClick={
                    ()=>{document.location='/user/'+articleInfo.author}
                }>@{articleInfo.author}</span>
            </div>
            </div>
            {content}
        </div>
    </>);
}
/*

            <div className="flex justify-center">
            <div className="p-3 mt-10 inline-block" style={{backgroundColor:'#FFDA947F',borderRadius:"15px"}}>
                <p className="text-2xl">Thanks for reading! Your opinion matters.</p>
                <div className="flex">
                <div className="circle">
                <ThumbUpIcon/>
                </div>
                <div className="circle">
                <ThumbDownIcon/>
                </div>
                </div>
            </div>
            </div>
            */