import React, { Component } from 'react';
import { Route, Routes } from 'react-router-dom';
import './index.css';
import Greetings from "./Greetings";

export default function Header() {
  return (
    <>
      <div className="">
        <div className="flex header">
            <div className="logo">
                Cleland
            </div>
            <div className="relative flex-auto text-right">
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