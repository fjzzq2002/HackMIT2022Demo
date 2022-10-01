import React, { Component } from 'react';
import './index.css';
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
window.katex = katex;

export default function Editor() {
    const [checked, setChecked] = useState(false);
    const [radioValue, setRadioValue] = useState('1');
    const [value, setValue] = useState('');
    console.log(value);

    const modules = {
      toolbar: [
        ['bold', 'italic', 'underline','strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        ['link', 'image', 'formula'],
        ['clean']
      ],
    };
  
    const formats = [
      'bold', 'italic', 'underline', 'strike', 'blockquote',
      'list', 'bullet', 'indent',
      'link', 'image', 'formula'
    ];
    
    const radios = [
        { value: 'Life', content: <><HiOutlineSun className="sun"/> Life</> },
        { value: 'Fiction', content: <><HiOutlineSparkles className="sparkle"/> Fiction</> },
        { value: 'Insight', content: <><HiOutlineLightBulb className="lightbulb"/> Insight</> },
    ];

    return (<>
    <div className="text-2xl pb-3 flex m-2">
    <input type="text" className="text-3xl border-b-2 border-neutral-300 p-1 Lora"
    placeholder="Title" style={{width:"100%"}} maxLength="50"/>
    </div>
    <ReactQuill theme="snow" value={value} onChange={setValue} modules={modules} formats={formats}
    className="px-2"/>
    <div className="m-2">
    <div className='flex p-2 pt-4 justify-center'>
    <div className="pr-3 text-xl pt-1">Pick a category... </div>
    
      <ButtonGroup>
        {radios.map((radio, idx) => (
          <ToggleButton
            key={idx}
            id={`radio-${idx}`}
            type="radio"
            variant={['outline-danger','outline-primary','outline-success'][idx]}
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
    <div className='pt-4 text-center'>
    I acknowledge that low-quality articles may be removed and corresponding accounts may be banned. Coins gained by boosting might be revoked.<br/><br/>
    <div className="text-2xl pb-3 flex mx-5">
    <input type="text" className="text-xl border-b-2 border-neutral-300 p-1 Lora flex-grow mr-3"
    placeholder="Add a short summary (150 characters max)..." maxLength="150"/>
    <Button variant="primary">Submit</Button>
    </div>
    </div>
    </div>
    </>);
}