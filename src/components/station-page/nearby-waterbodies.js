import React, { useEffect, useState } from 'react';
import CardWaterbody from './card-waterbody';
import { title } from './nearby.module.css';


export default function NearbyWaterbodies({ coordinates }) {
    const [loading, setLoading] = useState(true);
    const [features, setFeatures] = useState(null);

    useEffect(() => {
        const getLines = (distance) => {
            return new Promise((resolve, reject) => {
                // Input distance is in meters
                const url = 'https://gispub.epa.gov/arcgis/rest/services/OW/ATTAINS_Assessment/MapServer/1/query?where=organizationid%3D%27CA_SWRCB%27&text=&objectIds=&time=&geometry=' + coordinates[0] + '%2C' + coordinates[1] + '&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&distance=' + distance + '&units=esriSRUnit_Meter&relationParam=&outFields=assessmentunitidentifier%2cassessmentunitname%2creportingcycle%2Cwaterbodyreportlink%2Coverallstatus%2Con303dlist&returnGeometry=false&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&havingClause=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&returnExtentOnly=false&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&featureEncoding=esriDefault&f=pjson';
                fetch(url)
                    .then(response => response.json())
                    .then(json => json.features)
                    .then(features => {
                        resolve(features);
                    })
            })
        }
        const getPolys = (distance) => {
            return new Promise((resolve, reject) => {
                // Input distance is in meters
                const url = 'https://gispub.epa.gov/arcgis/rest/services/OW/ATTAINS_Assessment/MapServer/2/query?where=organizationid%3D%27CA_SWRCB%27&text=&objectIds=&time=&geometry=' + coordinates[0] + '%2C' + coordinates[1] + '&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&distance=' + distance + '&units=esriSRUnit_Meter&relationParam=&outFields=assessmentunitidentifier%2cassessmentunitname%2creportingcycle%2Cwaterbodyreportlink%2Coverallstatus%2Con303dlist&returnGeometry=false&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&havingClause=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&returnExtentOnly=false&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&featureEncoding=esriDefault&f=pjson';
                fetch(url)
                    .then(response => response.json())
                    .then(json => json.features)
                    .then(features => {
                        resolve(features);
                    })
            })
        }

        Promise.all([
            getLines(3000),
            getPolys(3000)
        ]).then(responses => {
            console.log(responses);
            const data = responses[0].concat(responses[1]);
            const features = data.map(d => d.attributes);
            setFeatures(features);
            setLoading(false);
        });
    }, [coordinates])

    if (loading) {
        return (
            <div>Loading...</div>
        )
    } else if (features) {
        if (features.length > 0) {
            return (
                <div>
                    <h3 className={title}>Nearby waterbodies</h3>
                    {features.map(d => (
                        <CardWaterbody key={'card-' + d.assessmentunitidentifier} feature={d} />
                    ))}
                </div>
            )
        } else {
            return (
                <div>
                    <h3 className={title}>Nearby waterbodies</h3>
                    <i className="light">No waterbodies within 3,000 meters.</i>
                </div>
            )
        }
    } else {
        return (
            <div></div>
        )
    }
}