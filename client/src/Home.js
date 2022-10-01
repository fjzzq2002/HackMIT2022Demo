import React, { Component } from 'react';
import { Route, Routes } from 'react-router-dom';
import './index.css';
import Previewcard from "./Previewcard";

export default function Home() {
  return (
    <>
      <Previewcard title="Is earth flat?" author="daxiang" tags={['Insight','Technology']} votes={[3,5]} description="You can have a description of 30~100 characters. Yes, make a description of 100 characters, at most."/>
      <Previewcard title="Is earth flat?" author="daxiang" tags={['Insight','Technology']} votes={[3,5]} description="You can have a description of 30~100 characters. Yes, make a description of 100 characters, at most."/>
      <Previewcard title="Is earth flat?" author="daxiang" tags={['Insight','Technology']} votes={[3,5]} description="You can have a description of 30~100 characters. Yes, make a description of 100 characters, at most."/>
      <Previewcard title="Is earth flat?" author="daxiang" tags={['Insight','Technology']} votes={[3,5]} description="You can have a description of 30~100 characters. Yes, make a description of 100 characters, at most."/>
      <Previewcard title="Is earth flat?" author="daxiang" tags={['Insight','Technology']} votes={[3,5]} description="You can have a description of 30~100 characters. Yes, make a description of 100 characters, at most."/>
    </>
  );
}