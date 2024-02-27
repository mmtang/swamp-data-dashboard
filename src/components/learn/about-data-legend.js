import React from 'react';
import ToxicityLegend from './analytes/toxicity-legend';

const AboutDataLegend = ({ analyte }) => {
    const getAnalyteInfo = (analyte) => {
        if (analyte) {
            if (analyte.Source === 'toxicity') {
                return <ToxicityLegend />
            } else {
                return <div></div>;
            }
        } else {
            return <div></div>;
        }
    }

    return (
        getAnalyteInfo(analyte)
    )
}

export default AboutDataLegend;