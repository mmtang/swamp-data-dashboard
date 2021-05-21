import React from 'react';
import Layout from '../../components/layout/layout';
import MapStation from '../../components/map/map-station';
import { leftContainer, siteMapContainer, rightContainer, stationName } from './station.module.css';


class Station extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        stationCode: null,
        station: null,
        status: null
      }
    }

    getStationCode = () => {
        return new Promise((resolve, reject) => {
            const url = this.props.location.href;
            console.log(url);
            const re = new RegExp(/station\/\?q=([a-z0-9]+)$/i);
            const matches = url.match(re);
            if (matches[1]) {
                this.setState({ stationCode: matches[1] });
            } else {
                this.setState({ loaded: 'error' });
            }
            resolve();
        })
    }

    getStationData = () => {
        return new Promise((resolve, reject) => {
            let url = 'https://data.ca.gov/api/3/action/datastore_search?resource_id=e747b11d-1783-4f9a-9a76-aeb877654244&limit=5';
            url += '&filters={%22StationCode%22:%22' + this.state.stationCode + '%22}';
            fetch(url)
                .then(response => response.json())
                .then(json => {
                    const data = json.result.records[0];
                    this.setState({ station: data });
                    resolve();
                })
        })
    }

    componentDidMount = () => {
        this.getStationCode()
        .then(() => this.getStationData())
        .then(() => {
            this.setState({ status: 'loaded' });
        });
    }

    render() {
        if (this.state.status === 'loaded') {
            let station = this.state.station;
            return (
                <Layout>
                    <div className={leftContainer}>
                        <div className={siteMapContainer}>
                            <MapStation coordinates={[station.TargetLongitude, station.TargetLatitude]} />
                        </div>
                        <section>
                            <h2 className={stationName}>{station.StationName ? station.StationName : null}</h2>
                            <span className="small">Code: {station.StationCode ? station.StationCode : null}</span>
                            <span className="small">San Diego Region</span>
                        </section>
                        <section>
                            <h2>Nearby waterbodies</h2>
                        </section>
                    </div>
                        <div className={rightContainer}>
                        <section>
                            <h2>Water quality data and trends</h2>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Praesent elementum facilisis leo vel fringilla est ullamcorper. Ornare aenean euismod elementum nisi quis. Scelerisque fermentum dui faucibus in ornare.</p>
                        </section>
                    </div>
                </Layout>
            )
        } else if (!this.state.status) {
            return (
                <div>Loading</div>
            )
        } 
    }

}

export default Station;

