import React from 'react';

export default function Conductivity({ props }) {
    return (
        <svg width={props.size} height={props.size} version="1.1" viewBox="0 0 105.04 105.04" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(-.72583 -191.72)">
            <circle cx="53.247" cy="244.24" r="52.521" fill={props.fill} strokeWidth=".19933"/>
            <g fill="#fff">
            <g transform="matrix(-.1532 .11969 -.11969 -.1532 123.09 252.09)">
                <path d="m464.53 123.46-227.41 52.414 55.688 50.717-141.79 18.705 48.734 54.775-156.84 75.76 242.19-45.023-48.865-56.459 134.78-17.623-39.069-59.741z" fill={props.stroke}/>
            </g>
            {/* The lines below add the positive and negative icons on the left and right of the lightning bolt */}
            {/*
            <g transform="matrix(.17984 0 0 .17984 -3.6055 221.9)">
                <path d="m179.72 120.64c0 30.43-24.672 55.115-55.035 55.115-30.495 0-55.125-24.686-55.125-55.115 0-30.43 24.631-55.116 55.125-55.116 30.363 0 55.035 24.685 55.035 55.116z"/>
                <line x1="124.68" x2="124.68" y1="88.532" y2="158.41" stroke="#010101" stroke-linecap="round" stroke-linejoin="round" stroke-width="5"/>
                <line x1="89.685" x2="159.6" y1="123.46" y2="123.46" stroke="#010101" stroke-linecap="round" stroke-linejoin="round" stroke-width="5"/>
            </g>
            <g transform="matrix(.17988 0 0 .17988 23.557 178.17)">
                <path d="m414.96 370.53c0 30.454-24.679 55.127-55.126 55.127-30.398 0-55.125-24.673-55.125-55.127 0-30.425 24.727-55.08 55.125-55.08 30.447 0 55.126 24.655 55.126 55.08z"/>
                <line x1="324.92" x2="394.83" y1="370.53" y2="370.53" stroke="#010101" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5"/>
            </g>
            */}
            </g>
            </g>
        </svg>
    )
}