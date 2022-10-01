import React, { Component } from 'react';
import { Route, Routes } from 'react-router-dom';
import './index.css';
import { IconContext } from "react-icons";
import { HiOutlineLightBulb, HiOutlineSparkles, HiOutlineSun, HiOutlineMoon } from 'react-icons/hi';
import { BsMoonStars } from 'react-icons/bs';
import {IoSparklesOutline} from 'react-icons/io5';

/*
function Vote(props) {
    let vote=props.votes;
    let color='rgb(15,15,15)';
    if(vote) {
        if(props.type=='down') {
            vote='-'+vote; color='red';
        }
        if(props.type=='up') {
            vote='+'+vote; color='green';
        }
    }
  return (
    <>
    <span style={{color:color}}>{vote}</span>
    </>
  );
}*/
function Vote(props) {
    let vote=props.votes;
    let color='rgb(15,15,15)';
    if(vote>=0) vote='+'+vote;
    if(vote>0) color='green';
    else if(vote<0) color='brown';
  return (
    <>
    <span style={{color:color,fontSize:"20px",marginLeft:"5px"}}>({vote})</span>
    </>
  );
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

export default function Previewcard(props) {
  return (
    <>
      <div className="rounded border-2 p-3 mt-4 border-neutral-300">
        <div className="flex justify-between align-end">
        <div>
            <div className="text-2xl">
            <Tag type={props.type}/>
            <span style={{fontWeight:"600"}}>
            {props.title}
            </span>
            <Vote votes={props.votes[0]-props.votes[1]}/>
            </div>
        </div>
        <div className="text-right">
        {props.author}
        </div>
        </div>
        {props.description}
      </div>
    </>
  );
}