import React from 'react';
import Layout from '../components/layout/layout';
import MapIndex from '../components/map/map-index';
import Home from '../components/views/home';
import Region from '../components/views/region';
import { mapContainer, mainContainer, infoContainer } from './index.module.css';

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedStation: null,
      selectedAnalyte: null,
      selectedRegion: null,
      view: 'home'
    }
  }

  setAnalyte = (newAnalyte) => {
    this.setState({ selectedAnalyte: newAnalyte });
  }

  setRegion = (newRegion) => {
    this.setState({ 
      selectedRegion: newRegion,
      selectedAnalyte: null
    });
  }

  setView = (newView) => {
    this.setState({ view: newView });
  }

  render() {
    return (
      <Layout>
        <div className={mapContainer}>
          <MapIndex selectedAnalyte={this.state.selectedAnalyte} selectedRegion={this.state.selectedRegion} />
        </div>
        <div className={mainContainer}>
          <div className={infoContainer}>
            { this.state.view === 'home' ? 
              <Home
                selectedAnalyte={this.state.selectedAnalyte}
                selectedRegion={this.state.selectedRegion}
                setAnalyte={this.setAnalyte}
                setRegion={this.setRegion}
                setView={this.setView} 
              /> 
            : this.state.view === 'region' ?
              <Region 
                selectedRegion={this.state.selectedRegion}
                setView={this.setView}
                setRegion={this.setRegion} />
            : null
            }
          </div>
        </div>
      </Layout>
    )
  }
}

export default Index;

