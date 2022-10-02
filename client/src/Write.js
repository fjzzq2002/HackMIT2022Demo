import React, { Component } from 'react';
import './index.css';
import Cookies from "universal-cookie";
import Greetings from "./Greetings";
import { BiCoinStack, BiBookOpen, BiPen, BiGlassesAlt } from 'react-icons/bi';
import { BsBook, BsVectorPen, BsPen } from 'react-icons/bs';
import { useLoaderData } from 'react-router-dom';
import Previewcard from './Previewcard';
import { IconContext } from "react-icons";
import { HiOutlineLightBulb, HiOutlineSparkles, HiOutlineSun, HiOutlineMoon } from 'react-icons/hi';
import { useNavigate } from "react-router-dom";
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import {url} from './url';

window.katex = katex;

export default function Editor() {
    const [checked, setChecked] = useState(false);
    const [radioValue, setRadioValue] = useState('1');
    const [value, setValue] = useState('');
    let [title, setTitle] = useState('');
    let [summary, setSummary] = useState('');

    const modules = {
      toolbar: [
        ['bold', 'italic', 'underline','strike'],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        ['link', 'image', 'formula'],
        ['clean']
      ],
    };
  
    const formats = [
      'bold', 'italic', 'underline', 'strike',
      'list', 'bullet', 'indent',
      'link', 'image', 'formula'
    ];
    
    const radios = [
        { value: 'Life', content: <><HiOutlineSun className="sun"/> Life</> },
        { value: 'Fiction', content: <><HiOutlineSparkles className="sparkle"/> Fiction</> },
        { value: 'Insight', content: <><HiOutlineLightBulb className="lightbulb"/> Insight</> },
    ];

    async function onClick() {
        // console.log(value,title,summary);
        const content = value, description = summary, type = radioValue;
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({content: content, title: title, description: description, type: type})
          };
        const cookies = new Cookies();
        const suffix =
        "?loginname=" +
        cookies.get("username") +
        "&password=" +
        cookies.get("password");
        console.log(requestOptions);
        const result = await fetch(url + "/api/post" + suffix, requestOptions);
        console.log(await result.text());
    }

    return (<>
    <div className="text-2xl pb-3 flex m-2">
    <input type="text" className="text-3xl border-b-2 border-neutral-300 p-1 Lora"
    placeholder="Title" style={{width:"100%"}} maxLength="50"
    value={title} onChange={(t)=>setTitle(t.target.value)}
    />
    </div>
    <ReactQuill theme="snow" value={value} onChange={setValue} modules={modules} formats={formats}
    className="px-2"/>
    <div className="m-2">
    <div className='pt-6 text-center'>
    <div className="text-xl pb-3 flex mx-1">
    <input type="text" className="border-b-2 border-neutral-300 p-1 Lora flex-grow mr-2"
    placeholder="Add a short summary (100 characters max)..." maxLength="100"
    value={summary} onChange={(t)=>setSummary(t.target.value)}/>
    <ButtonGroup>
      {radios.map((radio, idx) => (
        <ToggleButton
          key={idx}
          id={`radio-${idx}`}
          type="radio"
          variant={['outline-success','outline-primary','outline-danger'][idx]}
          name="radio"
          value={radio.value}
          checked={radioValue === radio.value}
          onChange={(e) => setRadioValue(e.currentTarget.value)}
        >
          {radio.content}
        </ToggleButton>
      ))}
    </ButtonGroup>
    </div>
    <Button variant="primary" onClick={onClick} size="lg" className="mt-2">Post Article!</Button>
    </div>
    </div>
    </>);
}