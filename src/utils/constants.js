export const analytes = {
    'Alkalinity as CaCO3, Total': {
        code: null,
        label: 'Alkalinity',
        page: null,
        blurb: 'Alkalinity, also called acid-buffering capacity, refers to the ability of a waterbody to neutralize acidity and maintain a relatively stable pH level. Higher alkalinity levels protect a waterbody against rapid changes in pH.'
    },
    'Aluminum, Total': {
        code: 'aluminum',
        label: 'Aluminum',
        page: null,
        blurb: "Aluminum is a naturally occurring metal found in the earth's crust. It can enter a waterbody via natural processes and human-based activities. High concentrations of aluminum can be toxic to aquatic life."
    },
    'Ammonia as N, Total': {
        code: null,
        label: 'Ammonia',
        page: null,
        blurb: 'Ammonia is a form of nitrogen that is common in the environment. It is an essential nutrient for plants, but high levels of it can be toxic to fish and other aquatic life.'
    },
    'Ammonia as NH3, Total': {
        code: null,
        label: 'Ammonia',
        page: null,
        blurb: 'Ammonia is a form of nitrogen that is common in the environment. It is an essential nutrient for plants, but high levels of it can be toxic to fish and other aquatic life. The neutral, un-ionized form of ammonia (NH3) is highly toxic.'
    },
    'Arsenic, Total': {
        code: 'arsenic',
        label: 'Arsenic',
        page: null,
        blurb: 'Arsenic is a semi-metallic element that occurs naturally in the environment and as a by-product of agricultural and industrial activites. Inorganic arsenic is the more toxic form of arsenic and a known human carcinogen.'
    },
    'Boron, Dissolved': {
        code: 'boron',
        label: 'Boron',
        page: 'boron',
        blurb: 'Boron is a naturally occurring element found in rocks, soil, and water. It is an essential nutrient for most plants, but it can be toxic to aquatic life at high concentrations.'
    },
    'CSCI': {
        code: 'csci',
        label: 'California Stream Condition Index',
        page: 'csci',
        blurb: 'The California Stream Condition Index (CSCI) is a statewide index used to translate complex data about benthic macroinvertebrates found living in a stream into an overall measure of stream health.'
    },
    'E. coli': {
        code: 'ecoli',
        label: 'E. coli',
        page: 'ecoli',
        blurb: 'E. coli bacteria live in the intestines of warm-blooded animals and humans. In water, they are a strong indicator of sewage contamination.'
    },
    'Enterococcus': {
        code: null,
        label: 'Enterococcus',
        page: null,
        blurb: 'Enterococcus bacteria live in the intestines of warm-blooded animals and humans. They are widely used as a bacterial indicator of health risk in fresh and salt water.'
    },
    'Fluoride, Dissolved': {
        code: 'fluoride',
        label: 'Fluoride',
        page: null,
        blurb: 'Fluoride is a naturally occurring compound found in water, soil, and rocks. Small amounts of fluoride are added to public water supplies and dental products such as toothpaste to prevent tooth decay.'
    },
    'IPI': {
        code: 'ipi',
        label: 'Index of Physical Habitat Integrity',
        page: 'ipi',
        blurb: 'The Index of Physical Habitat Integrity (IPI) is a statewide index used to measure physical habitat integrity based on the physical characteristics of stream and river channels and their proximate riparian zones.'
    },
    'Oxygen, Dissolved, Total': {
        code: 'dissolvedOxygen',
        label: 'Dissolved Oxygen',
        page: 'dissolved_oxygen',
        blurb: "Dissolved Oxygen is the amount of oxygen that is present in water. It is an essential element used by all forms of aquatic life."
    },
    'pH': {
        code: 'ph',
        label: 'pH',
        page: 'ph',
        blurb: 'pH is a measure of how acidic or basic water is. It affects most chemical and biological processes in water, and is crucial for the survival of aquatic organisms.'
    },
    'SpecificConductivity, Total': {
        code: 'conductivity',
        label: 'Conductivity',
        page: 'conductivity',
        blurb: 'Conductivity, or specific conductivity, is a measure of the ability of water to pass an electrical current. It is an indirect measure of the amount of dissolved materials, such as salts and metals, in the water.'
    },
    'Temperature': {
        code: 'temperature',
        label: 'Temperature',
        page: 'temperature',
        blurb: 'Water temperature is a measure of the average kinetic energy of water molecules. It is an important indicator of the general condition of a waterbody and the ecosystem it supports.'
    },
    'Total Dissolved Solids, Total': {
        code: 'tds',
        label: 'Total Dissolved Solids',
        page: 'tds',
        blurb: 'Total Dissolved Solids refers to the total concentration of organic and inorganic substances dissolved in water. Most dissolved substances do not pose a threat, but a high level can indicate the presence of other pollutants in the water.'
    },
    'Nitrogen, Total Kjeldahl, Total': {
        code: 'tkn',
        label: 'Total Kjeldahl Nitrogen',
        page: null,
        blurb: 'Total Kjeldahl Nitrogen refers to the sum of organic nitrogen, ammonia, and ammonium. High concentrations can indicate sewage manure discharges are present in the water.'
    },
    'Nitrogen, Total, Total': {
        code: 'totalNitrogen',
        label: 'Total Nitrogen',
        page: 'total_nitrogen',
        blurb: 'Nitrogen is an essential plant nutrient, but too much can lead to an excessive growth of plants and algae in the water, which has adverse ecological effects.'
    },
    'Phosphorus as P, Total': {
        code: 'totalPhosphorus',
        label: 'Total Phosphorus',
        page: 'total_phosphorus',
        blurb: 'Phosphorus is an essential plant nutrient, but too much can lead to an excessive growth of plants and algae in the water, which has adverse ecological effects.'
    },
    'Turbidity, Total': {
        code: 'turbidity',
        label: 'Turbidity',
        page: 'turbidity',
        blurb: 'Turbidity is a measure of the clarity or cloudiness of water. It is an important indicator of sediment and erosion levels, which can affect ecological productivity and habitat quality.'
    }
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