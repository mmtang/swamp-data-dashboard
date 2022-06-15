import React from 'react';
import MenuPanePrograms from './menu-pane-programs';
import MenuPaneRegions from './menu-pane-regions';
import { Tab } from 'semantic-ui-react'

export default function MenuIndex() {   
    const panes = [
        { 
            menuItem: 'Statewide Programs', 
            render: () => <Tab.Pane><MenuPanePrograms /></Tab.Pane>
        },
        { 
            menuItem: 'Regions', 
            render: () => <Tab.Pane><MenuPaneRegions /></Tab.Pane>
        }
      ]

    return (
        <div>
            <Tab 
                panes={panes} 
                renderActiveOnly={true} 
            />
        </div>
    )
}