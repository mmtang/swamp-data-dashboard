import React from 'react';
import LayoutParameter from '../../../components/layout/layout-parameter';
import { container, wrapper } from './csci.module.css';

export default function Csci() {
    return (
        <LayoutParameter title="SWAMP Data Dashboard" parameter={{ name: 'csci', display: 'California Stream Condition Index' }}>
            <div>
                <h2>What is the California Stream Condition Index?</h2>
                <p>The California Stream Condition Index (CSCI) is a biological scoring tool that helps aquatic resource managers translate complex data about benthic macroinvertebrates found living in a stream into an overall measure of stream health. It is calculated by comparing the expected condition with the actual (observed) results. The CSCI score indicates whether, and to what degree, the ecology of a stream is altered from a healthy state.</p>
                <h2>Why is it important to measure the CSCI?</h2>
                <p>Direct measures of ecosystem health like the CSCI are preferable to those based on chemical or physical measurements for many management questions. Living organisms integrate the effects of multiple stressors, such as sedimentation, nutrient enrichment, and riparian disturbance over both space and time.</p>
                <p>The CSCI can be used to assess the status and trends of stream condition at multiple scales (sites, watersheds, regions, and statewide) and is also well-suited for compliance monitoring, evaluating the success of mitigation and restoration projects, and evaluating the success of stream protection policies and programs. It is also an integral component of the state’s <a href="https://www.waterboards.ca.gov/plans_policies/biological_objective.html" target="_blank" rel="noreferrer noopener">Biological Integrity Assessment Implementation Plan</a>.</p>
                <h2>How do I interpret the data?</h2>
                <p>In general, CSCI scores closer to 0 indicate a degradation of biological condition based on reference (expected) condition, and scores closer to 1 indicate healthy biological condition based on reference (expected) condition. Scores greater than 1 can indicate greater taxonomic richness and more complex ecological function than predicted for a site given its natural environment setting.</p>
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
                <p>The above thresholds and categories were established based on the 30th, 10th, and 1st percentiles of CSCI scores at <strong>reference sites</strong>.</p>
                <img src="\csci_scores_distribution.png" alt='Bar graph showing the distribution of CSCI scores for reference sites' style={{ display: 'block', margin: 'auto', maxWidth: '87%' }} />
                <h2>References</h2>
                <p><a href="https://www.waterboards.ca.gov/water_issues/programs/swamp/bioassessment/docs/csci_tech_memo.pdf" target="_blank" rel="noreferrer noopener">The California Stream Condition Index (CSCI): A New Statewide Biological Scoring Tool for Assessing the Health of Freshwater Streams SWAMP Technical Memo"; by Andrew C. Rehn, Raphael D. Mazor, Peter R. Ode</a></p>
            </div>
        </LayoutParameter>
    )
}

