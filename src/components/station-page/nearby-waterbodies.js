import React, { useEffect, useState } from 'react';
import CardWaterbody from './card-waterbody';
import HelpIcon from '../../components/icons/help-icon';
import LoaderBlock from '../loaders/loader-block';
import { popupContent, title } from './nearby-waterbodies.module.css';

// This component queries for the nearby waterbodies of a given set of coordinates (representing a monitoring station). It uses the REST API on the Water Boards ArcGIS Portal to perform a spatial query on the Integrated Report 2024 line and polygon layers. It renders the subcomponent CardWaterbody based on the number of nearby waterbody features returned from the API queries
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
                const outFields = ['waterbodyid','waterbodyname','listingstatus','integratedreportcategory','newpollutantlisted', 'newpollutantsdelisted', 'pastcyclelistings', 'hyperlink'];
                const url = 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/Proposed_2024_Integrated_Report_Lines/FeatureServer/0/'
                const urlWithParams = url + `query?where=&fullText=&objectIds=&uniqueIds=&time=&geometry=${coordinates[0]}%2C${coordinates[1]}&geometryType=esriGeometryPoint&inSR=4326&defaultSR=&spatialRel=esriSpatialRelIntersects&distance=${meters}&units=esriSRUnit_Meter&relationParam=&outFields=${outFields.join('%2C')}&returnGeometry=false&maxAllowableOffset=&geometryPrecision=&outSR=&havingClause=&gdbVersion=&historicMoment=&returnDistinctValues=false&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&multipatchOption=xyFootprint&resultOffset=&resultRecordCount=&returnTrueCurves=false&returnCentroid=false&returnEnvelope=false&timeReferenceUnknownClient=false&maxRecordCountFactor=&sqlFormat=none&resultType=&datumTransformation=&lodType=geohash&lod=&lodSR=&cacheHint=false&returnUniqueIdsOnly=false&f=json`;
                fetch(urlWithParams)
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
                const outFields = ['waterbodyid','waterbodyname','listingstatus','integratedreportcategory','newpollutantlisted', 'newpollutantsdelisted', 'pastcyclelistings', 'hyperlink'];
                const url = 'https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/2024_Integrated_Report_Polygons/FeatureServer/0/'
                const urlWithParams = url + `query?where=&fullText=&objectIds=&uniqueIds=&time=&geometry=${coordinates[0]}%2C${coordinates[1]}&geometryType=esriGeometryPoint&inSR=4326&defaultSR=&spatialRel=esriSpatialRelIntersects&distance=${meters}&units=esriSRUnit_Meter&relationParam=&outFields=${outFields.join('%2C')}&returnGeometry=false&maxAllowableOffset=&geometryPrecision=&outSR=&havingClause=&gdbVersion=&historicMoment=&returnDistinctValues=false&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&multipatchOption=xyFootprint&resultOffset=&resultRecordCount=&returnTrueCurves=false&returnCentroid=false&returnEnvelope=false&timeReferenceUnknownClient=false&maxRecordCountFactor=&sqlFormat=none&resultType=&datumTransformation=&lodType=geohash&lod=&lodSR=&cacheHint=false&returnUniqueIdsOnly=false&f=pjson`;
                fetch(urlWithParams)
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
                        Waterbodies located within {distance} meters of the station. Queried from the <a href="https://gispublic.waterboards.ca.gov/portal/home/item.html?id=f0e4ac76fd0e4a53bebead89339ef3c9" target="_blank" rel="noreferrer noopener">2024 Integrated Report</a>.
                    </div>
                </HelpIcon>
            </h3>
            { 
              loading === 'true' ? <LoaderBlock /> : 
              loading === 'error' ? <div><p>Error fetching data. Refresh the page or try again later.</p></div> :
              loading === 'false' && features.length > 0 ? features.map(d => <CardWaterbody key={d.waterbodyid} feature={d} />) : 
              loading === 'false' && features.length === 0 ? <i className="light">No waterbodies found within {distance} meters.</i> :
              <div></div> // Return an empty div for all other cases
            }
        </div>
    )
}