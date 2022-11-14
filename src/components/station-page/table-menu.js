import React, { useEffect, useState } from 'react';

import Select, { components } from 'react-select';
import { Icon } from 'semantic-ui-react';

import { customSelectStyle } from '../../utils/utils';

export default function TableMenu({ categories, selectedCategory, setSelectedCategory }) {
    const [options, setOptions] = useState(null);

    const containerStyle = {
        marginRight: '0.32em',
        width: '185px'
    }

    const handleChange = (selection) => {
        if (selection) {
            setSelectedCategory(selection);
        } else {
            setSelectedCategory(null);
        }
    }

    useEffect(() => {
        if (categories) {
            const selectOptions = [];
            for (let i = 0; i < categories.length; i++) {
                selectOptions.push({
                    label: categories[i],
                    value: categories[i]
                });
            }
            setOptions(selectOptions);
        }
    }, [categories]);

    return (
        <div style={containerStyle}>
            <Select
                components={{
                    Control: ({ ...props }) => (
                        <components.Control {...props}>  
                            <span style={{ marginLeft: '10px' }}>
                                <Icon name='filter' />
                            </span>
                            {props.children}
                        </components.Control>
                    ),
                    ValueContainer: ({ ... props }) => (
                        <components.ValueContainer {...props}>
                            <span style={{ padding: '0' }}>
                                {props.children}
                            </span>
                        </components.ValueContainer>
                    )
                }}
                isClearable={true}
                isLoading={ options ? false : true }
                isSearchable={false}
                maxMenuHeight={200}
                onChange={handleChange}
                options={options}
                placeholder='Category'
                styles={customSelectStyle}
                value={selectedCategory ? selectedCategory : null}
            />      
        </div>
    )
}