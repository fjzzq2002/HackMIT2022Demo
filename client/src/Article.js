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
import {artinfo} from './artinfo';
import Cookies from "universal-cookie";
import Tooltip from '@mui/material/Tooltip';
import CryptoJS from 'crypto-js';

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
    const info = await artinfo(uid);
    console.log(info);
    return {id:uid,content:data.content,title:data.title,type:data.type,author:data.author,access:true, info:info};
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
    const [refresh, setRefresh] = React.useState(13123);
    const [shared, setShared] = React.useState(false);
    const [reported, setReported] = React.useState(false);


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
        setRefresh(refresh+1);
        if (txt == 0) {    
            if (vote == 1) 
                articleInfo.info.cost = 2;
            else
                articleInfo.info.cost = 3;
            return 0;
        }
        if (txt == 1) {
            if (vote == 1) 
                articleInfo.info.cost = 2;
            else
                articleInfo.info.cost = 3;
            return 1;
        }
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
        content = (
			<>
				<div
					dangerouslySetInnerHTML={{ __html: articleInfo.content }}
				/>
				<div className="flex justify-center">
					<div className="inline-block">
						<div className="flex">
							<Tooltip
								title={
									articleInfo.info.cost == 2
										? "You have upvoted!"
										: "Click to upvote"
								}
							>
								<div
									className={
										articleInfo.info.cost == 2
											? "circle-a"
											: "circle"
									}
									style={{
										color: "blue",
										borderColor: "blue",
									}}
									onClick={() => vote(articleInfo.id, 1)}
								>
									<ThumbUpIcon sx={{ fontSize: 45 }} />
								</div>
							</Tooltip>
							<Tooltip
								title={
									articleInfo.info.cost == 3
										? "You have downvoted!"
										: "Click to downvote"
								}
							>
								<div
									className={
										articleInfo.info.cost == 3
											? "circle-a"
											: "circle"
									}
									style={{
										color: "brown",
										borderColor: "brown",
									}}
									onClick={() => vote(articleInfo.id, -1)}
								>
									<ThumbDownIcon sx={{ fontSize: 45 }} />
								</div>
							</Tooltip>

							<Tooltip
								title={
									(!reported)
										? "Click to report low effort or inapproriate content"
										: "Admin will take a look"
								}
							>
								<div
									className={reported?"circle-a":"circle"}
									style={{ color: "red", borderColor: "red" }}
                                    onClick={() => {
                                        setReported(true);
                                    }}
								>
									<ReportIcon sx={{ fontSize: 45 }} />
								</div>
							</Tooltip>
							<Tooltip
								title={
									articleInfo.info.shared
										? "you can't share it"
										: shared
										? "Link copied to clipboard!"
										: "Share this article to a friend"
								}
							>
								<div
									className={
										articleInfo.info.shared
											? "circle-a"
											: "circle"
									}
									style={{
										color: "green",
										borderColor: "green",
									}}
									onClick={() => {
										console.log("share");
										navigator.clipboard.writeText(
											url +
												"/api/retrieve?username=" +
												new Cookies().get("username") +
												"&article=" +
												articleInfo.id +
												"&hash=" +
												CryptoJS.MD5(
													new Cookies().get(
														"password"
													) + articleInfo.id
												)
										);
										setShared(true);
									}}
									onMouseLeave={() => setShared(false)}
								>
									<SendIcon sx={{ fontSize: 45 }} />
								</div>
							</Tooltip>
						</div>
					</div>
				</div>
			</>
		);
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