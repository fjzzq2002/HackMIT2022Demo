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
    let reason='';
    let data;
    try {
        data = await response.json();
        console.log(data);
        reason=data.reason+'';
    } catch (error) {
        if(reason=='') reason='Unknown error';
    }
    const info = await artinfo(uid);
    console.log(info);
    return {id:uid,content:data.content,title:data.title,type:data.type,
        author:data.author,access:reason=='',reason:reason,info:info};
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

	console.log(articleInfo.access);

    let content=<></>;
    if(!articleInfo.access) {
        content=(<>
        <div style={{position:"relative"}}>
        <div style={{filter:"blur(3px)",opacity:"0.2",maxHeight:"400px",overflow:"hidden"}} className="noselect">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vitae sapien pellentesque habitant morbi tristique senectus et. Fringilla est ullamcorper eget nulla facilisi. Neque aliquam vestibulum morbi blandit cursus risus at ultrices mi. Ultricies integer quis auctor elit sed vulputate. Pretium lectus quam id leo in vitae turpis massa sed. Quis imperdiet massa tincidunt nunc pulvinar sapien et. Congue quisque egestas diam in arcu cursus euismod quis. Commodo viverra maecenas accumsan lacus vel facilisis volutpat est velit. Magna fermentum iaculis eu non diam phasellus vestibulum lorem. Faucibus scelerisque eleifend donec pretium. Odio facilisis mauris sit amet. Aliquam sem et tortor consequat id. Nec sagittis aliquam malesuada bibendum. Etiam tempor orci eu lobortis elementum nibh. Nulla posuere sollicitudin aliquam ultrices sagittis orci a. Tortor at risus viverra adipiscing. Turpis tincidunt id aliquet risus feugiat in ante metus. Suspendisse potenti nullam ac tortor vitae purus faucibus ornare suspendisse.<br/>
Posuere morbi leo urna molestie at. Tellus orci ac auctor augue mauris augue. Tristique nulla aliquet enim tortor at auctor urna. Non quam lacus suspendisse faucibus interdum posuere lorem ipsum. Nunc sed augue lacus viverra vitae. Egestas sed tempus urna et pharetra. Interdum posuere lorem ipsum dolor sit. Dictum at tempor commodo ullamcorper a lacus vestibulum sed. Sem et tortor consequat id porta nibh. Commodo quis imperdiet massa tincidunt nunc pulvinar sapien. At imperdiet dui accumsan sit amet.<br/>
Arcu cursus vitae congue mauris rhoncus aenean vel elit. Risus viverra adipiscing at in. In cursus turpis massa tincidunt dui ut ornare lectus sit. Sagittis eu volutpat odio facilisis mauris sit. Sed viverra ipsum nunc aliquet bibendum. Sed libero enim sed faucibus turpis. In pellentesque massa placerat duis. Mi in nulla posuere sollicitudin aliquam ultrices sagittis orci. Quam id leo in vitae turpis massa sed elementum. Diam vulputate ut pharetra sit amet aliquam id. Morbi leo urna molestie at elementum eu facilisis. Et pharetra pharetra massa massa ultricies mi quis hendrerit dolor. Id diam maecenas ultricies mi. Viverra mauris in aliquam sem fringilla. Enim ut sem viverra aliquet eget sit.
        </div>
        <div style={{position:"absolute",top:"0px"}}>
        <Greetings text={
        (articleInfo.reason.indexOf('access')!=-1)?
        <>You don't have access to this article so far. You can&nbsp;
        
        <span onClick={()=>unlock(articleInfo.id)} className="link">unlock it with 1 coin</span>.
        
        </>:((articleInfo.reason.indexOf('not')!=-1)?<>Article not found.</>:<>Please login first!</>)
    
    }/></div>
        </div>
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
											document.location.protocol + '//' + document.location.host +
												"/retrieve/" +
												new Cookies().get("username") +
												"/" +
												articleInfo.id +
												"/" +
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
        <div className="text-lg pt-1 px10m">
            <div className="flex flex-row justify-between pb-1 mb-4 border-dashed border-neutral-400 border-b-2">
            <div className="text-3xl">
            <Tag type={articleInfo.type}/>
            <div style={{fontWeight:"600",paddingLeft:"10px"}} className="Rashi titleskew">
            {articleInfo.title}
            </div>
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