import React, { useEffect, useRef, useState } from 'react';
import ButtonClearStation from '../common/button-clear-station';
import ButtonExploreData from '../common/button-explore-data';
import ButtonZoomStation from '../common/button-zoom-station';
import FullScreenImage from '../common/full-screen-image';
import PanelStationInfo from './panel-station-info';

import { Icon, Loader } from 'semantic-ui-react';

import { infoContainer, mainContainer } from '../../pages/index.module.css';
import { 
    buttonContainer, 
    buttonGrid, 
    contentSection, 
    iconContainer, 
    infoSubText, 
    stationCover,
    stationHeader, 
    stationSubText, 
    topContainer 
} from './panel-station.module.css';

// This component generates the template for when a station is selected; it renders the station info part (top). The subcomponent, PanelStationInfo, loads the main content (analyte menu, chart, comparison sites, etc.)
export default function PanelStation({ 
    analyte,
    comparisonSites,
    cursor,
    program,
    selecting,
    setComparisonSites,
    setSelecting,
    setStation, 
    setZoomToStation,
    station
}) {   
    const [stationImage, setStationImage] = useState(null);
    const [stationLoading, setStationLoading] = useState(false);
    const stationRef = useRef(null); // Have to use a ref, instead of the state value (station), in order to control when all the panel elements load (*after* the loader, not before). Otherwise, all the station info changes before the loader is shown

    // Control visibility of station content using styles. Do not use conditional rendering or else the index content panel will always rerender when the user exits out of the station view
    const stationStyle = {
        display: 'none'
    }

    // This function checks to see if an image exists (on the Water Boards web server) for the given station. If it exists, then it will return the full url; if it doesn't, then it will return false.
    const checkImage = (stationCode) => {
        if (stationCode) {
            const baseUrl = 'https://www.waterboards.ca.gov/water_issues/programs/swamp/bioassessment/images/csci_scores_map/';
            const imgUrl = baseUrl + stationCode.toLowerCase() + '.jpg';
            const image = new Image();
            image.onload = () => {
                setStationImage(imgUrl);
            };
            image.onerror = () => {
                console.log('Site does not have an image');
            }
            image.src = imgUrl;
        } else {
            console.error('Empty station code')
        }
    }

    useEffect(() => {
        setStationLoading(true);
        setStationImage(null);
        if (station) {
            stationRef.current = station;
            checkImage(station.StationCode);
            setTimeout(() => {
                setStationLoading(false);
            }, 1500); // Delay loading to show loader
        } else {
            stationRef.current = null;
        }
    }, [station])

    if (stationLoading) {
        return (
            <div className={mainContainer} style={ !station ? stationStyle : null }>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', backgroundColor: '#4491cd', color: '#fff' }}>
                    <Loader 
                        active 
                        inline='centered'
                        inverted
                        size='medium'
                    >
                        Loading
                    </Loader>
                </div>
            </div>
        )
    } else if (!stationLoading) {
        return (
            <div className={mainContainer} style={ !station ? stationStyle : null }>
                {/* Cover image */}
                <FullScreenImage image={stationImage} imgClass={stationCover} alt='Site picture' /> 
                <div className={infoContainer} style={{ cursor: cursor }}>
                    <div className={topContainer}>
                        <div className={iconContainer}>
                            <Icon name='map marker' color='grey' />
                            <span className={stationSubText}>Monitoring Station</span>
                        </div>
                        <ButtonClearStation 
                            setComparisonSites={setComparisonSites} 
                            setSelecting={setSelecting}
                            setStation={setStation} 
                        />
                    </div>
                    <h2 className={stationHeader}>{stationRef.current ? stationRef.current.StationName: null}</h2>
                    <span className={infoSubText}>
                        {stationRef.current ? stationRef.current.StationCode : null}&nbsp;&nbsp;&#9679;&nbsp;&nbsp;{stationRef.current ? stationRef.current.RegionName : null}  Region
                    </span>
                    <div className={buttonGrid}>
                        <div className={buttonContainer}>
                            <ButtonExploreData stationCode={stationRef.current ? stationRef.current.StationCode : null} />
                        </div>
                        <div className={buttonContainer}>
                            <ButtonZoomStation 
                                setZoomToStation={setZoomToStation} 
                                station={stationRef.current ? stationRef.current.StationCode : null}
                            />
                        </div>
                    </div>
                    <section className={contentSection}>
                        { station ? 
                            <PanelStationInfo 
                                analyte={analyte}
                                comparisonSites={comparisonSites}
                                program={program}
                                selecting={selecting}
                                setComparisonSites={setComparisonSites}
                                setSelecting={setSelecting}
                                station={stationRef.current} 
                            />
                        : null }
                    </section>
                </div>
            </div>
        )
    }
}