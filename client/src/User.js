import React, { Component } from 'react';
import './index.css';
import Greetings from "./Greetings";
import { BiCoinStack, BiBookOpen, BiPen, BiGlassesAlt } from 'react-icons/bi';
import { BsBook, BsVectorPen, BsPen } from 'react-icons/bs';
import { useLoaderData } from 'react-router-dom';
import Previewcard from './Previewcard';
import useEffect from 'react';
import {url} from "./url";
import { cfetch } from './cookiefetch';

export async function loader({params}) {
  const articleList = await (await cfetch(url + "/api/list")).json();
  const userInfo = await (await cfetch(url + "/api/getInfo?username="+params.userId)).json();
  return {articleList:articleList,userInfo:userInfo,id:params.userId};
}

function UserPanel(props) {
    const data=props.data;
    const userInfo=data.userInfo;
    const articleList=data.articleList;
    const articleMap={};
    for(let i=0;i<articleList.length;i++) {
      articleMap[articleList[i].article]=articleList[i];
    }
    const listOwned=[];//props.listOwned;
    const listWritten=[];//props.listWritten;
    for(const t of userInfo.articles) {
      console.log(t.article);
      if(t.cost>=0)
        listOwned.push(articleMap[t.article]);
      else
        listWritten.push(articleMap[t.article]);
    }
    return (<>
    <div className="text-xl flex-auto p-4 rounded-lg">
    <div>
    <div className='pb-2 mb-4 border-b-2 border-dashed border-neutral-400'>
    <span className="text-2xl">
    <span className="text-3xl">{data.id}</span>&nbsp;&nbsp;
    {userInfo.coins}<BiCoinStack style={{display:"inline",paddingBottom:"3px"}}/>
    </span>
    </div>
    <div className='pb-7'>
    <span className="text-2xl">
    <BiPen style={{display:"inline",paddingBottom:"3px",paddingLeft:"1px"}}/> Articles Written ({listWritten.length})
    </span>
    <div className="px-3">
      {
        listWritten.reverse().map((x) => (
          <Previewcard
            title={x.title}
            author={x.author}
            type={x.type}
            votes={[x.votes.upvotes, x.votes.downvotes]}
            description={x.description}
            id={x.article}
          />
        ))
      }
    </div>
    </div>
    <div className='pb-6'>
    <span className="text-2xl">
    <BiGlassesAlt style={{display:"inline",paddingBottom:"3px"}}/> Articles Read ({listOwned.length})
    </span>
    <div className="px-3">
      {
        listOwned.reverse().map((x) => (
          <Previewcard
            title={x.title}
            author={x.author}
            type={x.type}
            votes={[x.votes.upvotes, x.votes.downvotes]}
            description={x.description}
            id={x.article}
          />
        ))
      }
    </div>
    </div>
    </div>
    </div>
    </>)
}

export default function User() {
    const userInfo=useLoaderData();
    return (<>
    <Greetings text={<span>You've received your daily coin! Next daily coin in <b>3h5m66s</b>.</span>}/>
    <UserPanel data={userInfo}/>
    </>)
}