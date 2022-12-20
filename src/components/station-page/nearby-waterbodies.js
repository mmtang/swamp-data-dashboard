import React, { useEffect, useState } from 'react';
import CardWaterbody from './card-waterbody';
import HelpIcon from '../../components/icons/help-icon';
import LoaderBlock from '../loaders/loader-block';
import { popupContent, title } from './nearby-waterbodies.module.css';

// This component queries for the nearby waterbodies of a given set of coordinates (representing a monitoring station). It uses the REST API on the Water Boards ArcGIS Portal to perform a spatial query on the Integrated Report 2018 line and polygon layers. It renders the subcomponent CardWaterbody based on the number of nearby waterbody features returned from the API queries
export default function NearbyWaterbodies({ coordinates }) {
    const [loading, setLoading] = useState('true');
    const [features, setFeatures] = useState(null);
    const distance = 500; // meters

    // Limit the number of nearby waterbodies shown to 3 max
    // This number is arbitrary and can be changed
    const maxCards = 3;

    useEffect(() => {
        const getLines = (meters) => {
            return new Promise((resolve, reject) => {
                const url = `https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/CA_2018_Integrated_Report_Assessed_Lines_and_Polys/FeatureServer/0/query?where=&text=&objectIds=&time=&geometry=${coordinates[0]}%2C${coordinates[1]}&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&distance=${meters}&units=esriSRUnit_Meter&relationParam=&outFields=wbid%2Cwbname%2Cwb_listingstatus%2Clisted_pollutants%2Cfact_sheet&returnGeometry=false&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&havingClause=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&returnExtentOnly=false&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&featureEncoding=esriDefault&f=json`;
                fetch(url)
                    .then(response => response.json())
                    .then(json => {
                        resolve(json);
                    })
                    .catch(error => {
                        reject(error);
                    })
            })
        }

        const getPolys = (meters) => {
            return new Promise((resolve, reject) => {
                const url = `https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/CA_2018_Integrated_Report_Assessed_Lines_and_Polys/FeatureServer/1/query?where=&text=&objectIds=&time=&geometry=${coordinates[0]}%2C${coordinates[1]}&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&distance=${meters}&units=esriSRUnit_Meter&relationParam=&outFields=wbid%2Cwbname%2Cwb_listingstatus%2Clisted_pollutants%2Cfact_sheet&returnGeometry=false&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&havingClause=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&returnExtentOnly=false&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&featureEncoding=esriDefault&f=json`;
                fetch(url)
                    .then(response => response.json())
                    .then(json => {
                        resolve(json);
                    })
                    .catch(error => {
                        reject(error);
                    })
            })
        } 
  
        Promise.all([
            getLines(distance),
            getPolys(distance)
        ]).then(responses => {
            const data = responses[0].features.concat(responses[1].features);
            let features = data.map(d => d.attributes);
            // Limit the number of nearby waterbodies shown, trim array
            if (features.length > maxCards) { 
                features = features.slice(0, maxCards);
            }
            setFeatures(features);
            setLoading('false');
        })
        .catch(error => {
            console.error(error.message);
            setLoading('error');
        });
    }, [coordinates])

    return (
        <div>
            <h3 className={title}>
                Nearby waterbodies
                <HelpIcon position='right center' color='grey'>
                    <div className={popupContent}>
                        Waterbodies located within {distance} meters of the station. Queried from the <a href="https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/CA_2018_Integrated_Report_Assessed_Lines_and_Polys/FeatureServer" target="_blank" rel="noreferrer noopener">Integrated Report 2018 dataset</a>.
                    </div>
                </HelpIcon>
            </h3>
            { 
              loading === 'true' ? <LoaderBlock /> : 
              loading === 'error' ? <div><p>Error fetching data. Refresh the page or try again later.</p></div> :
              loading === 'false' && features.length > 0 ? features.map(d => <CardWaterbody key={d.wbid} feature={d} />) : 
              loading === 'false' && features.length === 0 ? <i className="light">No waterbodies found within {distance} meters.</i> :
              <div></div> // Return an empty div for all other cases
            }
        </div>
    )
}