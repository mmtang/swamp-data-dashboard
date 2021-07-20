import React from 'react';
import LayoutStation from '../../components/layout/layout-station';
import MapStation from '../../components/map/map-station';
import NearbyWaterbodies from '../../components/station-page/nearby-waterbodies';
import NearbyStations from '../../components/station-page/nearby-stations';
import StationTable from '../../components/station-page/station-table';
//import ChemistryTable from '../../components/station-page/chemistry-table';
import { regionDict } from '../../utils/utils';
import { leftContainer, titleContainer, siteMapContainer, rightContainer, stationName } from './station.module.css';


class Station extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        stationCode: null,
        station: null,
        status: null,
        nearbyStations: null
      }
    }

    getStationCode = () => {
        return new Promise((resolve, reject) => {
            const url = this.props.location.href;
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

    setNearbyStations = (stations) => {
        this.setState({ nearbyStations: stations });
    }

    render() {
        if (this.state.status === 'loaded') {
            let station = this.state.station;
            return (
                <LayoutStation>
                    <div className={leftContainer}>
                        <section className={titleContainer}>
                            <h2 className={stationName}>{station.StationName ? station.StationName : null}</h2>
                            <span style={{ fontSize: '0.95em' }}>Station: {station.StationCode ? station.StationCode : null}&nbsp;&nbsp;&#9679;&nbsp;&nbsp;{regionDict[station.Region]} Region</span>
                        </section>
                        <div className={siteMapContainer}>
                            <MapStation 
                                coordinates={[station.TargetLongitude, station.TargetLatitude]} 
                                stationCode={station.StationCode}
                                region={station.Region}
                                setNearbyStations={this.setNearbyStations}
                            />
                        </div>
                        <section style={{ margin: '1em 0' }}>
                            <NearbyWaterbodies coordinates={[station.TargetLongitude, station.TargetLatitude]} />
                        </section>
                        <section style={{ margin: '1em 0' }}>
                            <NearbyStations nearbyStations={this.state.nearbyStations} />
                        </section>
                    </div>
                    <div className={rightContainer}>
                        <section>
                            <h2>Water quality data and trends</h2>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Praesent elementum facilisis leo vel fringilla est ullamcorper. Ornare aenean euismod elementum nisi quis. Scelerisque fermentum dui faucibus in ornare.</p>
                        </section>
                        <section>
                            <StationTable station={this.state.station.StationCode} />
                        </section>
                    </div>
                </LayoutStation>
            )
        } else if (!this.state.status) {
            return (
                <div>Loading</div>
            )
        } else if (this.state.status === 'error') {
            return (
                <div>Error loading data. Please refresh and try again.</div>
            )
        }
    }

}

export default Station;

