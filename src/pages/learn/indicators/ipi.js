import React from 'react';
import { Link } from 'gatsby';
import LayoutParameter from '../../../components/layout/layout-parameter';
import { container, wrapper } from './ipi.module.css';

export default function Ipi() {
    return (
        <LayoutParameter parameter={{ name: 'ipi', display: 'Index of Physical Habitat Integrity' }}>
            <div>
                <h2>What is the Index of Physical Habitat Integrity?</h2>
                <p>The Index of Physical Habitat Integrity (IPI) is a statewide scoring tool for measuring the condition of a stream or river's physical habitat. It integrates a number of individual habitat attributes (related to substrate, riparian vegetation, flow habitat variability, in-channel cover, and channel morphology) into an overall measure of physical condition.</p>
                <h2>Why is it important to measure the IPI?</h2>
                <p>Physical habitat is a fundamental driver of stream ecosystem health and is critical for maintaining the chemical, physical, and biological integrity of a waterbody. It is one of the primary factors that influence the population and diversity of organisms found living in a stream. Physical habitat chracteristics such as streambed substrate, channel morphology, and flow-microhabitat complexity, can vary due to both natural factors and human disturbance. Human activities, such as agriculture, forestry, and urbanization, can directly or indirectly alter physical attributes. Habitat degradation and loss of habitat are often found to co-occur with poor biological condition.</p>
                <p>The IPI combines multiple types of habitat metrics into an overall score of physical habitat condition at a site. IPI scores can be used in a variety of stream management applications, including assessing potential causes of poor biological condition, setting targets for restoration, and prioritizing sites for protection or intervention. When used with other indices, such as the <Link to='/learn/indicators/csci'>California Stream Condition Index</Link>, the IPI can provide a more complete assessment of overall ecological condition at a site.</p>
                <h2>How do I interpret the data?</h2>
                <p>In general, IPI scores closer to 0 indicate a degradation of physical condition based on expected/predicted condition, and scores closer to 1 indicate healthy physical condition based on expected/predicted condition. Scores greater than 1 indicate that the site has greater physical complexity than predicted, given the site's natural environmental setting.</p>
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
                <p>The above thresholds and categories were established based on the 30th, 10th, and 1st percentiles of IPI scores at reference sites.</p>
                <h2>References</h2>
                <p><a href="https://www.waterboards.ca.gov/water_issues/programs/swamp/bioassessment/docs/physical_habitat_index_technical_memo.pdf" target="_blank" rel="noreferrer noopener">Rehn, A.C., R.D. Mazor and P.R. Ode. 2018. An index to measure the quality of physical habitat in California wadeable streams. SWAMP Technical Memorandum SWAMP-TM-2018-0005.</a></p>
            </div>
        </LayoutParameter>
    )
}