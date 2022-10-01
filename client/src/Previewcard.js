import React, { Component } from 'react';
import { Route, Routes } from 'react-router-dom';
import './index.css';
import { IconContext } from "react-icons";
import { HiOutlineLightBulb, HiOutlineSparkles, HiOutlineSun, HiOutlineMoon } from 'react-icons/hi';
import { BsMoonStars } from 'react-icons/bs';
import {IoSparklesOutline} from 'react-icons/io5';

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
}

function Tag(props) {
    let icon=<></>;
    if(props.type=='Insight')
        icon=<div className="lightbulb"><HiOutlineLightBulb/></div>;
    if(props.type=='Fiction')
        icon=<div className="sparkle"><HiOutlineSparkles/></div>;
    if(props.type=='Life')
        icon=<div className="sun"><HiOutlineSun/></div>;
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
      <div className="rounded border-2 p-3 mb-3">
        <div className="flex justify-between pb-1 align-end">
        <div>
            <div className="text-2xl font-bold">
            <Tag type={props.type}/>
            
            {props.title}
            
            </div>
        
        </div>
        <div className="text-right">
        {props.author}<br/>
        <Vote votes={props.votes[0]} type="up"/>
        <span className="pl-0.5 pr-0.5" style={{color:"rgb(100,100,100)"}}>/</span>
        <Vote votes={props.votes[1]} type="down"/>
        </div>
        </div>
        {props.description}
      </div>
    </>
  );
}