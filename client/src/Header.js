import React, { Component, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import './index.css';
import Greetings from "./Greetings";
import { BiCoinStack } from 'react-icons/bi';

export default function Header() {
  const [user, setUser] = React.useState(null);
  const [coins, setCoins] = React.useState(0);
  useEffect(() => {
    setTimeout(()=>{
      console.log('refresh!');
    },5000);
  });
  return (
    <>
      <div className="">
        <div className="flex header justify-between border-neutral-200 pb-2 border-b-2 mb-3">
            <div className="logo text-neutral-800">
                Cleland
            </div>
            <div className="relative text-right">
            {
                user?
                <div className="text-right text-lg" style={{paddingTop:"10px"}}>
                    {user}&nbsp;&nbsp;{coins}<BiCoinStack style={{display:"inline",paddingBottom:"3px"}}/>
                </div>
                :
                <div className="text-right text-lg link" style={{paddingTop:"10px"}}>
                    Login / Register
                </div>
            }
            </div>
        </div>
      </div>
    </>
  );
}