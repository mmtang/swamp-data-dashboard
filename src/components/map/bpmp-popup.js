import React from 'react';
import IconWater from '../common/icon-water';
import { header, headerRight, title } from './popup.module.css';


class BasinPlanPopup extends React.Component {
    render() {
        return (
            <React.Fragment>
                <div className={header}>
                    <IconWater />
                    <div className={headerRight}>
                        <h5 className={title}>{this.props.waterbody.name}</h5>
                    </div>
                </div>
                <div>This is a popup for {this.props.waterbody.name}</div>
            </React.Fragment>
        )
    }
}

export default BasinPlanPopup;