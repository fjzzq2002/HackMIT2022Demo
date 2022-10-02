import React, { Component, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import './index.css';
import Greetings from "./Greetings";
import { BiCoinStack } from 'react-icons/bi';
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import { cfetch } from './cookiefetch';

export default function Header() {

  function loginreg() {
    document.location='/login';
    //navigate('/login');
  }
  const cookies = new Cookies();
  const [user, setUser] = React.useState(cookies.get('username'));
  const [coins, setCoins] = React.useState(0);
  const [rng, setRng] = React.useState(0);
  window.refresh_un = async ()=>{
    const un = cookies.get('username');
    setUser(un);
    if(!un) {
      setCoins(0);
    }
    else {
      const articleList = await cfetch("http://127.0.0.1:5000/api/getInfo?username="+un)
      .then((res)=>{return res.json()})
      .then((res) => {
        setCoins(res.coins);
      });
    }
    setRng(Math.random());
  };

  useEffect(() => {
    setTimeout(window.refresh_un,5000);
  });
  return (
    <>
      <div className="">
        <div className="flex header justify-between border-neutral-200 pb-2 border-b-2 mb-3">
            <div className="logo text-neutral-800 cursor-pointer" onClick={()=>{document.location='/'}}>
                Cleland
            </div>
            <div className="relative text-right">
            {
                user?
                <div className="text-right text-lg" style={{paddingTop:"10px"}}>
                    {user}&nbsp;&nbsp;{coins}<BiCoinStack style={{display:"inline",paddingBottom:"3px"}}/>
                </div>
                :
                <div className="text-right text-lg linknl" style={{paddingTop:"12px"}} onClick={loginreg}>
                    Login / Register
                </div>
            }
            </div>
        </div>
      </div>
    </>
  );
}