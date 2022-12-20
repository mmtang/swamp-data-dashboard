import React, { useState } from 'react';
import ChartSection from './chart-section';
import { Button, Header, Icon, Modal, Popup } from 'semantic-ui-react';
import { popupStyle } from '../../constants/constants-app';
import { container, rowButton } from './chart-modal.module.css';

export default function ChartModal({ station, stationName, selectedAnalytes }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const selectLimit = 5;

    const handleClick = () => {
        if (modalVisible === false) {
            setLoading(true);
            setModalVisible(true);
            setLoading(false);
        }
    }

    return (
        <div className={container}>
            {/* Wrap button in span in order for the popup to show when the button is disabled: https://github.com/Semantic-Org/Semantic-UI-React/issues/1413 */}
            <Popup
                inverted
                style={popupStyle}
                trigger={
                    <span>  
                        <Button 
                            basic
                            className={rowButton}
                            color='grey'
                            size='tiny'
                            disabled={selectedAnalytes.length < 1 || selectedAnalytes.length > selectLimit}
                            onClick={handleClick} 
                            onKeyPress={handleClick}
                        >
                            <Icon name='chart bar' />
                            &nbsp;&nbsp;Graph
                        </Button>
                    </span>
                }
                content={selectedAnalytes.length <= selectLimit ? `Select up to ${selectLimit} parameters` : <div><Icon bordered inverted color='red' name='exclamation' size='small' />&nbsp;{`A maximum of ${selectLimit} parameters can be graphed at one time`}</div>}
                size='tiny'
            />
            { modalVisible ? 
                <Modal
                    closeIcon
                    open={modalVisible}
                    onClose={() => setModalVisible(false)}
                    closeOnDimmerClick={false}
                >
                    <Header content={`${stationName} (${station})`} />
                    <Modal.Content image scrolling>
                        { loading ? 'Loading...' : 
                            <div style={{ width: '100%' }}>
                                <ChartSection
                                    station={station}
                                    selectedAnalytes={selectedAnalytes}
                                />
                            </div>
                        }
                    </Modal.Content>
                    <Modal.Actions>
                        <Button
                            compact 
                            size='small'
                            onClick={() => setModalVisible(false)} 
                            onKeyPress={() => setModalVisible(false)}
                        >
                            Close
                        </Button>
                    </Modal.Actions>
                </Modal> 
            : '' }
        </div>
    )
}