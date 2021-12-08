import React, { useEffect, useState } from 'react';
import HelpIcon from '../../components/icons/help-icon';
import CardWaterbody from './card-waterbody';
import { title } from './nearby.module.css';


export default function NearbyWaterbodies({ coordinates }) {
    const [loading, setLoading] = useState(true);
    const [features, setFeatures] = useState(null);
    const distance = 500; // meters

    useEffect(() => {
        const getLines = (meters) => {
            return new Promise((resolve, reject) => {
                const url = `https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/CA_2018_Integrated_Report_Assessed_Lines_and_Polys/FeatureServer/0/query?where=&text=&objectIds=&time=&geometry=${coordinates[0]}%2C${coordinates[1]}&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&distance=${meters}&units=esriSRUnit_Meter&relationParam=&outFields=wbid%2Cwbname%2Cwb_listingstatus%2Clisted_pollutants%2Cfact_sheet&returnGeometry=false&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&havingClause=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&returnExtentOnly=false&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&featureEncoding=esriDefault&f=json`;
                fetch(url)
                .then(response => response.json())
                .then(json => {
                    resolve(json);
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
            })
        } 
  
        Promise.all([
            getLines(distance),
            getPolys(distance)
        ]).then(responses => {
            const data = responses[0].features.concat(responses[1].features);
            let features = data.map(d => d.attributes);
            if (features.length > 3) { 
                features = features.slice(0, 3);
            }
            setFeatures(features);
            setLoading(false);
        });
    }, [coordinates])

    return (
        <div>
            <h3 className={title}>
                Nearby waterbodies
                <HelpIcon>Waterbodies located within {distance} meters of the station. Queried from the <a href="https://gispublic.waterboards.ca.gov/portalserver/rest/services/Hosted/CA_2018_Integrated_Report_Assessed_Lines_and_Polys/FeatureServer" target="_blank" rel="noreferrer noopener">Integrated Report 2018 dataset</a>.</HelpIcon>
            </h3>
            { loading ? <i className="light">Loading...</i> 
                : features.length > 0 ? features.map(d => <CardWaterbody key={d.wbid} feature={d} />) 
                : <i className="light">No waterbodies found within {distance} meters.</i> 
            }
        </div>
    )
}