import React from 'react';

export default function Temperature({ props }) {
    return (
        <svg width={props.size} height={props.size} version="1.1" viewBox="0 0 105.04297 105.04298" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(-.72583 -191.72)">
            <circle cx="53.247" cy="244.24" r="52.521" fill={props.fill} strokeWidth=".19933"/>
            <g transform="matrix(.98459 0 0 .98459 .57793 4.1538)">
            <path d="m58.083 255.4v-49.847c0-2.5466-2.0636-4.6102-4.6102-4.6102-2.545 0-4.61 2.0636-4.61 4.6102v49.847c-6.5643 1.9795-11.347 8.067-11.347 15.277 0 8.8125 7.145 15.957 15.958 15.957 8.8142 0 15.959-7.1448 15.959-15.957 0-7.2101-4.785-13.298-11.349-15.277z" fill={props.stroke} strokeWidth=".17138"/>
            <g fill={props.fill} stroke={props.fill} strokeWidth="2.1504">
                <line x1="53.098" x2="60.191" y1="212.53" y2="212.53"/>
                <line x1="53.098" x2="60.194" y1="220.57" y2="220.57"/>
                <line x1="53.098" x2="60.194" y1="228.69" y2="228.69"/>
                <line x1="53.098" x2="60.194" y1="236.69" y2="236.69"/>
                <line x1="53.098" x2="60.194" y1="244.69" y2="244.69"/>
            </g>
            </g>
            </g>
        </svg>
    )
}