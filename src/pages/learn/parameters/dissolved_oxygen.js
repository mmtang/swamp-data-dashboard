import React from 'react';
import LayoutParameter from '../../../components/layout/layout-parameter';

export default function DissolvedOxygen() {
    return (
        <LayoutParameter title="SWAMP Data Dashboard" parameter={{ name: 'dissolvedOxygen', display: 'Dissolved Oxygen' }}>
            <div>
                <h2>What is Dissolved Oxygen?</h2>
                <p>Dissolved oxygen (DO) is the amount of oxygen that is present in water. Water bodies receive oxygen from the atmosphere and from aquatic plants. Running water, such as that of a swift moving stream, dissolves more oxygen than the still water of a pond or lake.</p>
                <h2>Why is it important to measure Dissolved Oxygen?</h2>
                <p>All aquatic animals need DO to breathe. Low levels of oxygen (hypoxia) or no oxygen levels (anoxia) can occur when excess organic materials, such as large algal blooms, are decomposed by microorganisms. During this decomposition process, DO in the water is consumed. Low oxygen levels often occur in the bottom of the water column and affect organisms that live in the sediments. In some water bodies, DO levels fluctuate periodically, seasonally and even as part of the natural daily ecology of the aquatic resource. As DO levels drop, some sensitive animals may move away, decline in health or even die.</p>
                <p>DO is considered an important measure of water quality as it is a direct indicator of an aquatic resource’s ability to support aquatic life. While each organism has its own DO tolerance range, generally, DO levels below 3 milligrams per liter (mg/L) are of concern and waters with levels below 1 mg/L are considered hypoxic and usually devoid of life.</p>
            </div>
        </LayoutParameter>
    )
}

