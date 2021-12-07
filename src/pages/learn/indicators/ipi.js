import React from 'react';
import { Link } from 'gatsby';
import LayoutParameter from '../../../components/layout/layout-parameter';
import { container, wrapper } from './ipi.module.css';

export default function Ipi() {
    return (
        <LayoutParameter parameter={{ name: 'ipi', display: 'Index of Physical Habitat Integrity' }}>
            <div>
                <h2>What is the Index of Physical Habitat Integrity?</h2>
                <p>The Index of Physical Habitat Integrity (IPI) is a statewide scoring tool for measuring the condition of a stream or river's physical habitat. It integrates a number of individual habitat attributes (related to substrate, riparian vegetation, flow habitat variability, in-channel cover, and channel morphology) into an overall measure of physical condition. Like the <Link to='/learn/indicators/csci'>California Stream Condition Index (CSCI)</Link>, the IPI is calculated by comparing the expected condition modeled at reference sites with the actual (observed) results.</p>
                <h2>Why is it important to measure the IPI?</h2>
                <p>Physical habitat is a fundamental driver of stream ecosystem health and is critical for maintaining the chemical, physical, and biological integrity of a waterbody. It is one of the primary factors that influence the structure and composition of biological assemblages found at a given area. Physical habitat chracteristics such as streambed substrate, channel morphology, flow-microhabitat complexity, in-stream cover-type complexity, and riparian vegetation cover all contribute to the overall physical and biological integrity of a stream.</p>
                <p>Physical habitat characteristics can vary due to both natural factors and human disturbance. Human activities can directly or indirectly alter physical attributes, and habitat degradation and loss related to human land use are often found to co-occur with poor biological condition.</p>
                <h2>How do I interpret the data?</h2>
                <p>The scoring categories for the IPI are similar to those of the <Link to='/learn/indicators/csci'>CSCI</Link>, but the exact threshold values differ slightly. In general, IPI scores closer to 0 indicate a degradation of physical condition based on reference (expected) condition, and scores closer to 1 indicate greater physical complexity than predicted for a site given its natural environmental setting.</p>
                <h3>Physical condition categories</h3>
                <div className={container}>
                    {/* Very likely altered */}
                    <div className={wrapper}>
                        <svg width="25" height="25" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="5" cy="5" r="4" fill="#b8544f" />
                        </svg>
                        <span>
                            Very likely altered
                            <br />
                            &#8804; 0.70
                        </span>
                    </div>
                    {/* Likely altered */}
                    <div className={wrapper}>
                        <svg width="25" height="25" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="5" cy="5" r="4" fill="#f7c00d" />
                        </svg>
                        <span>
                            Likely altered
                            <br />
                            0.71 - 0.83
                        </span>
                    </div>
                    {/* Possibly altered */}
                    <div className={wrapper}>
                        <svg width="25" height="25" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="5" cy="5" r="4" fill="#ffeda0" />
                        </svg>
                        <span>
                            Possibly altered
                            <br />
                            0.84 - 0.93
                        </span>
                    </div>
                    {/* Likely intact */}
                    <div className={wrapper}>
                        <svg width="25" height="25" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="5" cy="5" r="4" fill="#558ed5" />
                        </svg>
                        <span>
                            Likely intact
                            <br />
                            &#8805; 0.94
                        </span>
                    </div>
                </div>    
                <p>For the purposes of making statewide assessments, the above thresholds (analogous to those used for the <Link to='/learn/indicators/csci'>CSCI</Link>) were established based on the 30th, 10th, and 1st percentiles of IPI scores at reference sites.</p>
                <h2>References</h2>
                <p><a href="https://www.waterboards.ca.gov/water_issues/programs/swamp/bioassessment/docs/physical_habitat_index_technical_memo.pdf" target="_blank" rel="noreferrer noopener">Rehn, A.C., R.D. Mazor and P.R. Ode. 2018. An index to measure the quality of physical habitat in California wadeable streams. SWAMP Technical Memorandum SWAMP-TM-2018-0005.</a></p>
            </div>
        </LayoutParameter>
    )
}