import React, { Component } from 'react';
import { Route, Routes } from 'react-router-dom';
import './index.css';
import { IconContext } from "react-icons";
import { HiOutlineLightBulb, HiOutlineSparkles, HiOutlineSun, HiOutlineMoon } from 'react-icons/hi';
import { BsMoonStars } from 'react-icons/bs';
import {IoSparklesOutline} from 'react-icons/io5';
import { useNavigate } from "react-router-dom";

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

export default function Previewcard(props) {
    let icon=<></>;
    let className="";
    if(props.type=='Insight') {
        icon=<HiOutlineLightBulb className="lightbulb"/>;
        className="redlayer";
    }
    if(props.type=='Fiction') {
        icon=<HiOutlineSparkles className="sparkle"/>;
        className="bluelayer";
    }
    if(props.type=='Life') {
        icon=<HiOutlineSun className="sun"/>;
        className="greenlayer";
    }
    let navigate=useNavigate();
    let id=props.id;
    function toArticle() {
      navigate("/read/"+id);
    }
  return (
    <>
      <div className={"rounded border-2 p-3 mt-4 cursor-pointer border-neutral-300 "+className} onClick={toArticle}>
        <div className="flex justify-between align-end">
        <div>
            <div className="text-2xl">
            <IconContext.Provider value={{ color: "black" }}>
                {icon}
            </IconContext.Provider>
            <span style={{fontWeight:"500"}} className="Rashi">
            {props.title}
            </span>
            <Vote votes={props.votes[0]-props.votes[1]}/>
            </div>
        </div>
        <div className="text-right">
        {props.author}
        </div>
        </div>
        <span className="text-lg ml-1">
        {props.description}
        </span>
      </div>
    </>
  );
}