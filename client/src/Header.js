import React, { Component } from 'react';
import { Route, Routes } from 'react-router-dom';
import './index.css';
import Greetings from "./Greetings";
import { BiCoinStack } from 'react-icons/bi';


export default function Header() {
  const username="daxiang";
  const numCoins=10;
  return (
    <>
      <div className="">
        <div className="flex header justify-between">
            <div className="logo">
                Cleland
            </div>
            <div className="relative text-right">
            <div className="text-right text-lg" style={{paddingTop:"10px"}}>
                {username}&nbsp;&nbsp;{numCoins}<BiCoinStack style={{display:"inline",paddingBottom:"3px"}}/>
            </div>
            </div>
        </div>
        <hr/>
        <Greetings/>
      </div>
    </>
  );
}