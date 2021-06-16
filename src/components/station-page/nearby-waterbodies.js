import React, { useEffect, useState, useRef } from 'react';
import WaterbodyCard from './waterbody-card';


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
            getLines(100),
            getPolys(100)
        ]).then(responses => {
            const data = responses[0].concat(responses[1]);
            const features = data.map(d => d.attributes);
            if (features.length > 0) {
                setFeatures(features);
            }
            setLoading(false);
        });
    }, [coordinates])

    if (loading) {
        return (
            <div>Loading...</div>
        )
    } else if (features) {
        return (
            <div>
                <h2 style={{ margin: "25px 0 15px 0" }}>Nearby waterbodies</h2>
                {features.map(d => (
                    <WaterbodyCard key={'card-' + d.assessmentunitidentifier} feature={d} />
                ))}
            </div>
        )
    } else {
        return (
            <div></div>
        )
    }
}