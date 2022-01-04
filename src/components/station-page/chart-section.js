import React, { useEffect } from 'react';
import HelpIcon from '../icons/help-icon';
import DownloadData from '../common/download-data';
import { Icon } from 'semantic-ui-react';
import { analytes } from '../../utils/constants';
import { sectionContainer, analyteContainer, analyteHeader, analyteTitle } from './chart-section.module.css';


export default function ChartSection({ station, selectedAnalytes }) {
    useEffect(() => {
        if (station) {
            console.log('get data');
        }
    }, [station, selectedAnalytes])

    return (
        <div className={sectionContainer}>
            { selectedAnalytes.map(analyteName => 
                <div className={analyteContainer} key={analytes[analyteName].code}>
                    <div className={analyteHeader}>
                        <h4 className={analyteTitle}>
                            {analyteName}
                            <HelpIcon position='right center' color='grey'>
                                { analytes[analyteName]['blurb'] }
                                &nbsp;
                                {/* Display the 'Read more' link for those indicators that have an indicator page. Do not display the link if the page does not exist yet */}
                                { analytes[analyteName]['page'] ? <a href={`/learn/indicators/${analytes[analyteName]['page']}`} target='_blank' rel='noreferrer noopener'>Read more&nbsp;&nbsp;<Icon name='external' /></a> : '' }
                            </HelpIcon>
                        </h4>
                        <DownloadData 
                            color='grey'
                        >
                            Download data
                        </DownloadData>
                    </div>
                </div>
            )}
        </div>
    )
}