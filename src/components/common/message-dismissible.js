import React, { useState } from 'react';
import { Message } from 'semantic-ui-react';

// This component shows a message that the user can dismiss. It is meant to stand out and catch the user's eye. It is used to display important information to the user.
// https://react.semantic-ui.com/collections/message/#types-dismissible-block
export default function MessageDismissible({ color = null, negative = false, header = null, message }) {   
    const [visible, setVisbile] = useState(true)

    const handleDismiss = () => {
        setVisbile(false);
    }

    return (
       <React.Fragment>
           { visible ? 
           <Message 
                compact={true}
                color={color}
                negative={negative}
                size='small'
                onDismiss={handleDismiss}
                header={header}
                content={message}
           /> 
           : <div></div> }
       </React.Fragment>
    )
}