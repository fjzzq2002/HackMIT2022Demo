import React, { Component, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import './index.css';
import Greetings from "./Greetings";
import { BiCoinStack } from 'react-icons/bi';
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import { cfetch } from './cookiefetch';
import { BiBookOpen, BiPen, BiGlassesAlt } from 'react-icons/bi';
import {BsPencilSquare} from 'react-icons/bs';
import {BiHomeAlt, BiLogOut} from 'react-icons/bi';
import {url} from './url';

export default function Header() {

  function loginreg() {
    document.location='/login';
    //navigate('/login');
  }
  const cookies = new Cookies();
  const [user, setUser] = React.useState(cookies.get('username'));
  const [coins, setCoins] = React.useState(-1);
  const [rng, setRng] = React.useState(0);
  window.refresh_un = async ()=>{
    const un = cookies.get('username');
    setUser(un);
    if(!un) {
      setCoins(0);
    }
    else {
      await cfetch(url + "/api/getInfo?username="+un)
      .then((res)=>{return res.json()})
      .then((res) => {
        setCoins(res.coins);
      });
    }
    setRng(Math.random());
  };

  useEffect(() => {
    if(user&&coins==-1) window.refresh_un();
    else setTimeout(window.refresh_un,10000);
  });
  return (
    <>
      <div className="">
        <div className="flex flex-wrap header justify-between border-neutral-200 pb-2 border-b-2 mb-3 px-2">
            <div className="logo text-neutral-800 cursor-pointer" onClick={()=>{document.location='/'}}>
                Beaver Dam
            </div>
            <div className="text-right">
            {
                user?
                <div className="flex flex-wrap justify-end text-right text-2xl" style={{paddingTop:"12px"}}>
                  <div className="inline">
                    <span className="linknl" onClick={()=>{
                      document.location='/user/'+user;
                    }}>{user}</span>
                    <BiPen style={{display:"inline",paddingBottom:"5px",fontSize:"28px"}} className="link" onClick={()=>{
                      document.location='/write';
                    }}/>
                    </div>
                    {(coins>=0)?<><div className="inline pl-1">
                      {coins}<BiCoinStack style={{display:"inline",paddingBottom:"3px"}} className="coin"/>
                      </div></>:<></>}
                </div>
                :
                <div className="text-right text-2xl linknl" style={{paddingTop:"10px"}} onClick={loginreg}>
                  Login / Register
                </div>
            }
            </div>
        </div>
      </div>
    </>
  );
}