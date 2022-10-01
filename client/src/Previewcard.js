import React, { Component } from 'react';
import { Route, Routes } from 'react-router-dom';
import './index.css';

export default function Previewcard(props) {
  return (
    <>
      <div className="rounded border-2 p-3 mb-3">
        <div className="flex justify-between pb-1">
        <div>
            <div className="text-2xl font-bold">{props.title}</div>
        </div>
        <div>
            By {props.author}
        </div>
        </div>
        {props.description}
      </div>
    </>
  );
}