import React, { Component } from 'react';
import './index.css';
import Greetings from "./Greetings";
import { BiCoinStack, BiBookOpen, BiPen, BiGlassesAlt } from 'react-icons/bi';
import { BsBook, BsVectorPen, BsPen } from 'react-icons/bs';
import { useLoaderData } from 'react-router-dom';
import Previewcard from './Previewcard';

export async function loader({params}) {
    const uid=params.userId;
    return {id:uid,coin:10,list:[114514]};
}

function UserPanel(props) {
    const userInfo=props.userInfo;
    const listOwned=[114514];//props.listOwned;
    const listWritten=[1919810];//props.listWritten;
    return (<>
    <div className="text-xl flex-auto p-4 rounded-lg">
    <div>
    <div className='pb-2 mb-4 border-b-2 border-dashed border-neutral-400'>
        <span className="text-2xl">
    <span className="text-3xl">{userInfo.id}</span>&nbsp;&nbsp;
    {userInfo.coin}<BiCoinStack style={{display:"inline",paddingBottom:"3px"}}/>
    </span>
    </div>
    <div className='pb-7'>
    <span className="text-2xl">
    <BiPen style={{display:"inline",paddingBottom:"3px",paddingLeft:"1px"}}/> Articles Written ({listWritten.length})
    </span>
    <div className="px-3">
    <Previewcard title="Is earth flat?" author="daxiang" type="Insight" votes={[3,5]} description="You can have a description of 30~100 characters. Yes, make a description of 100 characters, at most."/>
      <Previewcard title="Rainbow near Charles" author="jinglu" type="Life" votes={[3,0]} description="Came across this rainbow today."/>
      <Previewcard title="The three body problem" author="daliu" type="Fiction" votes={[0,5]} description="My latest work!!"/>
    </div>
    </div>
    <div className='pb-6'>
    <span className="text-2xl">
    <BiGlassesAlt style={{display:"inline",paddingBottom:"3px"}}/> Articles Read ({listOwned.length})
    </span>
    <div className="px-3">
    <Previewcard title="Is earth flat?" author="daxiang" type="Insight" votes={[3,5]} description="You can have a description of 30~100 characters. Yes, make a description of 100 characters, at most."/>
      <Previewcard title="Rainbow near Charles" author="jinglu" type="Life" votes={[3,0]} description="Came across this rainbow today."/>
      <Previewcard title="The three body problem" author="daliu" type="Fiction" votes={[0,5]} description="My latest work!!"/>
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
    <UserPanel userInfo={userInfo}/>
    </>)
}