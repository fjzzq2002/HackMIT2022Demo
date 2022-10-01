import React, { Component } from 'react';
import { Route, Routes } from 'react-router-dom';
import './index.css';

export default function Greetings(props) {
  return (
    <>
      <div className="text-lg pb-4">
        {props.text}
      </div>
    </>
  );
}