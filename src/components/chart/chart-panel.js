import React from 'react';
import Chart from './chart';
import ChartSpecies from './chart-species';


export default function ChartPanel({ 
    analyte, 
    data,
    setSiteShapeDict,
    species,
    unit,
    vizColors 
}) {  
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
                    species={species}
                    unit={unit}
                    vizColors={vizColors}
                />
            }
        </div>
    )
}