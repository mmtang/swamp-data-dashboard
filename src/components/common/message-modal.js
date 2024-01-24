import React from 'react';
import {
    ModalContent,
    ModalActions,
    Button,
    Modal
} from 'semantic-ui-react';

// This component takes input text to show a pop up modal for display 
export default function MessageModal({ message, setMessageModalVisible, visible }) {
    const handleClose = () => {
        setMessageModalVisible(false);
    }

    return (
        <Modal
            closeOnDimmerClick
            closeOnEscape
            onClose={handleClose}
            open={visible}
            size='tiny'
        >
            <ModalContent>
                <p style={{ textAlign: 'center' }}>{message}</p>
            </ModalContent>
            <ModalActions>
                <Button compact onClick={handleClose} size='small'>
                    Close
                </Button>
            </ModalActions>
      </Modal>
    )
}