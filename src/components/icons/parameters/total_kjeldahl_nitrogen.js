import React from 'react';

export default function TotalKjeldahlNitrogen({ props }) {
    return (
        <svg width={props.size} height={props.size} version="1.1" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50%" cy="50%" r="50%" fill={props.fill} strokeWidth=".19933"/>
            <text x="50%" y="55%" textAnchor="middle" dominantBaseline="middle" fill={props.stroke} fontFamily="sans-serif" fontSize="22px">TKN</text>
        </svg>
    )
}