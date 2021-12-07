export const analyteNameDict = {
    'CSCI': 'csci',
    'IPI': 'ipi',
    'Oxygen, Dissolved, Total': 'dissolvedOxygen'
}

export const analytePageDict = {
    'CSCI': 'csci',
    'IPI': 'ipi'
}

export const analyteBlurb = {
    'csci': 'The California Stream Condition Index (CSCI) translates complex data about benthic macroinvertebrates (bugs) found living in a stream into an overall measure of stream health.',
    'dissolvedOxygen': "The amount of oxygen present in the water. It is a direct indicator of a waterbody's ability to support aquatic life.",
    'ipi': 'The Index of Physical Habitat Integrity (IPI) is a statewide index for measuring physical habitat integrity based on the physical characteristics of stream and river channels and their proximate riparian zones.'
}

export const analyteYMax = {
    'CSCI': 1.5,
    'IPI': 1.3
}

export const analyteScoringCategories = {
    'csci': [
        {
            type: 'area',
            label: 'Very likely altered',
            lowerValue: 0,
            upperValue: 0.62, 
            fillColor: '#b8544f'
        },
        {
            type: 'area',
            label: 'Likely altered',
            lowerValue: 0.621, // Actual value is 0.63
            upperValue: 0.79,
            fillColor: '#f7c00d'
        },
        {
            type: 'area',
            label: 'Possibly altered',
            lowerValue: 0.791, // Actual value is 0.80
            upperValue: 0.91,
            fillColor: '#ffeda0'
        },
        {
            type: 'area',
            label: 'Likely intact',
            lowerValue: 0.911, // Actual value is 0.91
            upperValue: 1.5,  // Taken from the highest value found in CEDEN - Dec 2021
            fillColor: '#558ed5'
        }
    ],
    'ipi': [
        {
            type: 'area',
            label: 'Very likely altered',
            lowerValue: 0,
            upperValue: 0.7,
            fillColor: '#b8544f'
        },
        {
            type: 'area',
            label: 'Likely altered',
            lowerValue: 0.701,  // Actual value is 0.71
            upperValue: 0.83,
            fillColor: '#f7c00d'
        },
        {
            type: 'area',
            label: 'Possibly altered',
            lowerValue: 0.831,  // Actual value is 0.84
            upperValue: 0.93,
            fillColor: '#ffeda0'
        },
        {
            type: 'area',
            label: 'Likely intact',
            lowerValue: 0.931,  // Actual value is 0.94
            upperValue: 1.3,  // Taken from the highest value found in CEDEN - Dec 2021
            fillColor: '#558ed5'
        }
    ]
}