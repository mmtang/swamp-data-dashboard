import React from 'react';
import IconStation from '../common/icon-station';
import { header, headerRight, title } from './popup.module.css';


class StationPopup extends React.Component {
    render() {
        return (
            <div className={header}>
                <IconStation size={28} />
                <div className={headerRight}>
                    <h5 className={title}>{this.props.station.name}</h5>
                </div>
            </div>
        )
    }

}

export default StationPopup;