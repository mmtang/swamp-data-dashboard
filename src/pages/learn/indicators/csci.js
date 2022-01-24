import React from 'react';
import { withPrefix } from 'gatsby';
import LayoutParameter from '../../../components/layout/layout-parameter';
import { container, wrapper } from './csci.module.css';

export default function Csci() {
    return (
        <LayoutParameter title="SWAMP Data Dashboard" parameter={{ name: 'csci', display: 'California Stream Condition Index' }}>
            <div>
                <h2>What is the California Stream Condition Index?</h2>
                <p>The California Stream Condition Index (CSCI) is a biological scoring tool that helps aquatic resource managers translate complex data about benthic macroinvertebrates found living in a stream into an overall measure of stream health. It is a measure of whether, and to what degree, the ecology of a stream is altered from a healthy state.</p>
                <h2>Why is it important?</h2>
                <p>Benthic macroinvertebrates are small invertebrates that live on stream bottoms. They are commonly used as indicators of water quality because they are sensitive to changes in their habitats and responsive to multiple stressors, such as sedimentation, nutrient enrichment, and riparian disturbance. Because benthic macroinvertebrates spend most of their lives in water, they can show the cumulative impacts of these stressors over time and space.</p>
                <p>The CSCI combines two separate indices: a multi-metric index that measures the ecological structure and function of a stream, and an observed-to-expected index that measures the taxonomic completeness of benthic macroinvertebrates found living in the same stream. Together, they offer multiple lines of evidence about the condition of the stream, providing greater confidence than a single index.</p>
                <p>The CSCI can be used to assess the status and trends of stream condition at multiple scales (sites, watersheds, regions, and statewide). It is well-suited for compliance monitoring and evaluating the success of mitigation and restoration projects, and stream protection policies and programs. It is also an integral component of the state’s <a href="https://www.waterboards.ca.gov/water_issues/programs/biostimulatory_substances_biointegrity/" target="_blank" rel="noreferrer noopener">Biostimulatory Substances and Biological Integrity Provisions</a>.</p>
                <h2>How do I interpret the data?</h2>
                <p>In general, CSCI scores closer to 0 indicate a degradation of biological condition based on expected/predicted condition, and scores close to 1 or greater than 1 indicate healthy biological condition based on expected/predicted condition.</p>
                <h3>Biological condition categories</h3>
                <div className={container}>
                    {/* Very likely altered */}
                    <div className={wrapper}>
                        <svg width="25" height="25" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="5" cy="5" r="4" fill="#b8544f" />
                        </svg>
                        <span>
                            Very likely altered
                            <br />
                            &#8804; 0.62
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
                            0.63 - 0.79
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
                            0.80 - 0.91
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
                            &#8805; 0.92
                        </span>
                    </div>
                </div>
                <p>The above thresholds and categories were established based on the 30th, 10th, and 1st percentiles of CSCI scores at reference sites.</p>
                <img src={withPrefix("csci-scores-distribution.png")} alt='Bar graph showing the distribution of CSCI scores for reference sites' style={{ display: 'block', margin: 'auto', maxWidth: '87%' }} />
                <h2>References</h2>
                <p><a href="https://www.waterboards.ca.gov/water_issues/programs/swamp/bioassessment/docs/csci_factsheet.pdf" target="_blank" rel="noreferrer noopener">California State Water Resources Control Board. 2015. The California Stream Condition Index [Fact sheet].</a></p>
                <p><a href="https://www.waterboards.ca.gov/water_issues/programs/swamp/bioassessment/docs/csci_tech_memo.pdf" target="_blank" rel="noreferrer noopener">Rehn, A.C., R.D. Mazor and P.R. Ode. 2015. The California Stream Condition Index (CSCI): A New Statewide Biological Scoring Tool for Assessing the Health of Freshwater Streams. SWAMP Technical Memorandum SWAMP-TM-2015-0002.</a></p>
            </div>
        </LayoutParameter>
    )
}

