import React from 'react';
import LayoutParameter from '../../../components/layout/layout-parameter';

export default function Csci() {
    return (
        <LayoutParameter title="SWAMP Data Dashboard" parameter={{ name: 'csci', display: 'California Stream Condition Index' }}>
            <div>
                <h2>What is the California Stream Condition Index?</h2>
                <p>The California Stream Condition Index (CSCI) is a biological scoring tool that helps aquatic resource managers translate complex data about benthic macroinvertebrates found living in a stream into an overall measure of stream health. The CSCI score indicates whether, and to what degree, the ecology of a stream is altered from a healthy state.</p>
                <h2>Why is it important to measure the CSCI?</h2>
                <p>Direct measures of ecosystem health like the CSCI are preferable to those based on chemical or physical measurements for many management questions. Living organisms integrate the effects of multiple stressors, such as sedimentation, nutrient enrichment and riparian disturbance, over both space and time.</p>
                <p>The CSCI can be used to assess the status and trends of stream condition at multiple scales (sites, watersheds, regions, and statewide) and is also well-suited for compliance monitoring, evaluating the success of mitigation and restoration projects, and evaluating the success of stream protection policies and programs. It is also an integral component of the state’s <a href="https://www.waterboards.ca.gov/plans_policies/biological_objective.html" target="_blank" rel="noreferrer noopener">Biological Integrity Assessment Implementation Plan</a>.</p>
            </div>
        </LayoutParameter>
    )
}

