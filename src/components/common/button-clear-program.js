import React from 'react';
import { Link } from 'gatsby';
import { Icon } from 'semantic-ui-react';
import { container } from './button-clear.module.css';

export default function ButtonClearProgram() {   
    return (
        <Link to='/'>
            <div className={container}>
                <Icon
                    size='large'
                    name='angle left' 
                    color='teal'
                />
                <span>Home</span>
            </div>
        </Link>
    )
}