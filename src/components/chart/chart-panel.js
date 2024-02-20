import React, { useEffect, useState } from 'react';
import Chart from './chart';
import ChartSpecies from './chart-species';
import NdMessage from '../common/nd-message';

export default function ChartPanel({ 
    analyte, 
    data,
    setSiteShapeDict,
    unit,
    vizColors 
}) {  
    const [showNdMessage, setShowNdMessage] = useState(false);

    // This useEffect mainly used for determining whether there is a presence of ND or DNQ values in the data and if the ND message should be displayed below the chart
    useEffect(() => {
        setShowNdMessage(false);
        if (data) {
            const allSites = Object.keys(data.sites);
            let allValues = [];
            for (const d of allSites) {
                // Get all ND_in_Avg values
                const values = data.sites[d].map(d => d['Censored']);
                allValues = [...allValues, ...values];
            }
            if (allValues.includes(true)) {
                setShowNdMessage(true);
            }
        }
    }, [data]);

    return (
        <div>
            { analyte && (analyte.source === 'toxicity' || analyte.source === 'tissue') ?
                <ChartSpecies 
                    analyte={analyte}
                    data={data}
                    setSiteShapeDict={setSiteShapeDict}
                    unit={unit}
                    vizColors={vizColors}
                />
            : 
                <Chart 
                    analyte={analyte}
                    data={data}
                    setSiteShapeDict={setSiteShapeDict}
                    unit={unit}
                    vizColors={vizColors}
                />
            }
            { showNdMessage ?
                <NdMessage />
            : null }
        </div>
    )
}