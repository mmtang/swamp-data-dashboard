import React, { useState } from 'react';
import ChartSection from './chart-section';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';
import { rowButton } from './chart-modal.module.css';


export default function ChartModal({ station, stationName, selectedAnalytes }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);

    const handleClick = () => {
        if (modalVisible === false) {
            setLoading(true);
            setModalVisible(true);
            setLoading(false);
        }
    }

    return (
        <div>
            <Button 
                className={rowButton}
                compact 
                size='tiny'
                disabled={selectedAnalytes.length < 1}
                onClick={handleClick} 
                onKeyPress={handleClick}
            >
                <Icon name='chart bar' />
                Graph data for selected indicators {selectedAnalytes.length > 0 ? `(${selectedAnalytes.length})` : '(0)' }
            </Button>
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