import React from 'react';
import { withPrefix } from 'gatsby';
import HelpIcon from '../icons/help-icon';

export default function TrendHelpIcon() {
    return (
        <div>
            Trend
            <HelpIcon>
                <p>Trend assignments and categories are provisional. <a href={withPrefix("/learn/trends")} target="_blank" rel="noreferrer noopener">Read more</a> about how we calculate trends.</p>
            </HelpIcon>
        </div>
    )
}