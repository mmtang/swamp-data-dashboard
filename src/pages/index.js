import React from 'react';
import Layout from '../components/layout/layout';
import MapIndex from '../components/map/map-index';
import SearchContainer from '../components/search/search-container';
import AnalyteMenu from '../components/map-controls/analyte-menu';
import RegionMenu from '../components/map-controls/region-menu';
import { mapContainer, mainContainer, infoContainer } from './index.module.css';

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedStation: null,
      selectedAnalyte: null,
      view: 'home'
    }
  }

  setAnalyte = (newAnalyte) => {
    this.setState({ selectedAnalyte: newAnalyte });
  }

  render() {
    return (
      <Layout>
        <div className={mapContainer}>
          <MapIndex selectedAnalyte={this.state.selectedAnalyte} />
        </div>
        <div className={mainContainer}>
          <div className={infoContainer}>
            <p>The Surface Water Ambient Monitoring Program (SWAMP) mission is to generate  high quality, accessible, and usable data and information that is used to protect and restore California’s watersheds, and to inform California communities about local conditions of waterbodies monitored by SWAMP. To learn more about SWAMP and the work we do, check out our <a href="https://www.waterboards.ca.gov/water_issues/programs/swamp/" target="_blank" rel="noopener noreferrer">website</a>!</p>
            <p>This dashboard provides data generated by SWAMP for the time period of 2000-2021. Select a monitoring site from the map or explore the data by water quality parameter or region.</p>
            <h2>Explore SWAMP data</h2>
              <AnalyteMenu selectedAnalyte={this.state.selectedAnalyte} setAnalyte={this.setAnalyte} />
              <RegionMenu />
            <h2>Search SWAMP data</h2>
            <SearchContainer />
          </div>
        </div>
      </Layout>
    )
  }
}

export default Index;

