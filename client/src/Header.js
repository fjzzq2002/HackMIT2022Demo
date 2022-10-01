import React, { Component } from 'react';
import { Route, Routes } from 'react-router-dom';
import './index.css';
import Greetings from "./Greetings";
import { Icon, InlineIcon } from '@iconify/react';


export default function Header() {
  return (
    <>
      <div className="">
        <div className="flex header justify-between">
            <div className="logo">
                Cleland
            </div>
            <div className="relative text-right">
            <div className="text-right text-lg" style={{paddingTop:"13px"}}>
                toaster 1C ▽
            </div>
            </div>
        </div>
        <hr/>
        <Greetings/>
      </div>
    </>
  );
}