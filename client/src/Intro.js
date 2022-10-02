import React, { Component } from 'react';
import { Route, Routes } from 'react-router-dom';
import './index.css';
import Previewcard from "./Previewcard";
import { useLoaderData } from "react-router-dom";
import {cfetch} from "./cookiefetch";
import {url} from "./url";

export default function Home() {
    function reveal() {
        var reveals = document.getElementsByClassName('reveal');
        console.log(reveals);
      
        for (var i = 0; i < reveals.length; i++) {
          var windowHeight = window.innerHeight;
          var elementTop = reveals[i].getBoundingClientRect().top;
          var elementVisible = 150;
      
          if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
          } else {
//            reveals[i].classList.remove("active");
          }
        }
    }
    if(window.scrolll) {
        window.removeEventListener("scroll",window.scrolll);
    }
    window.scrolll = reveal;
    window.addEventListener("scroll", reveal);
    reveal();

    return <>
    <div className="text-center fromN reveal active">
        Welcome to Beaver Dam!
    </div>
    <img src="beaverread.png" style={{width:"100%",maxWidth:"800px",margin:"auto",paddingBottom:"100px"}}/>
    <div className="fromL reveal">
    You might read a lot :)
    </div>
    <div className="fromR reveal">
    You follow the daily news. You follow the latest trends. You watch random youtube videos.
    </div>
    <div className="fromL reveal">
    But you don't feel like you learned a lot. :-
    </div>
    <img src="Cambridge_Public_Library.jpg" className="fromD reveal"/>
    <div className="fromL reveal">
    In Beaver Dam, you probably can't read a lot.
    </div>
    <div className="fromR reveal">
    But every day, we hope you'll get something new!
    </div>
    <img src="Northern_Lights_timelapse.gif" className="fromD reveal"/>
    <div className="fromL reveal">
    Learn about how to build a rocket, be amazed by a newly discovered species, or read a moving sci-fi story.
    </div>
    <div className="fromR reveal">
    All from the fellow beavers around you.
    </div>
    <img src="beaver-on-a-dam.jpg" className="fromD reveal"/>
    <div className="fromL reveal">
    You get a new coin every day to read an article. Upvote to reward the author that coin, and share the article with others.
    </div>
    <div className="fromR reveal">
    To gain more coins, consider becoming a helping beaver and post something interesting!
    </div>
    <div className="Sep">&nbsp;</div>
    <div className="fromN reveal text-center abitskew">
    Beaver Dam, discover something new every day!
    <br/>
    <span className="reveals link" style={{color:"rgb(90,90,90)"}} onClick={()=>{document.location='/';}}>
    Get Started!
    </span>
    </div>
    <div className="Sep">&nbsp;</div>
    </>;
}