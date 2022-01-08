import React from 'react';
import LayoutInfo from '../../components/layout/layout-info';
import { Icon, Message, Table } from 'semantic-ui-react';
import { IconTrendingUp, IconTrendingDown, IconMinus } from '@tabler/icons';
import { main } from '../pages.module.css';
import { trendContainer, iconWrapper, textWrapper } from './trends.module.css';


export default function Trends() {
    return (
        <LayoutInfo active='learn'>
            <div className={main}>
                <h1>Calculating trends</h1>
                <h2>What can trends show us?</h2>
                <p>The SWAMP Data Dashboard displays trend for each water quality indicator at the station level. Tracking trends allows the Water Boards and others (i.e., water resource managers, the Legislature, and the public-at-large) to prioritize management actions, evaluate the effectiveness of Water Board programs, and identify emerging or previously unknown threats.</p>
                <p>The SWAMP Data Dashboard shows trends in two areas of the dashboard, the map and data tables.</p>
                <h2>Methodology</h2>
                <Message compact>
                    <Icon name='exclamation triangle' />The methodology described on this page is currently in draft form. We welcome your feedback: <a href="mailto:swamp@waterboards.ca.gov">swamp@waterboards.ca.gov</a>.
                </Message>
                <h3>General approach</h3>
                <p>Trends are calculated for all indicators using the seasonal Kendall test. The seasonal Kendall test is a statistical test used to analyze time series data for monotonic trends (i.e., as one variable increases, the other seems to increase or decrease). The seasonal Kendall test is a non-parametric test, meaning that it makes no underlying assumptions about the normality of the data. It can also handle missing data and censored data.</p>
                <p>Hypothesis test:</p>
                <ul>
                    <li>H<sub>0</sub> (null hypothesis): There is no trend present in the data.</li>
                    <li>H<sub>1</sub> (alternate hypothesis): There is a trend (positive or negative) present in the data.</li>
                </ul>
                <p>A p-value of 0.05 is used to determine if there is statistically significant evidence against the null hypothesis.</p>
                <h3>Data requirements</h3>
                <p>Data are evaluated for trends at the station-indicator level. The body of SWAMP data is filtered by station code and then again by indicator. Station-indicator datasets that meet the criteria below are included in the analysis. Station-indicator datasets that do not meet the criteria below are assigned the "Insufficient data" trend category. In general, the more data points that are available, the more statistical power there is for identifying a trend in the dataset.</p>
                <ul>
                    <li>Must have at least five observations spanning five years</li>
                    <li>At least three of those observations must be non-censored</li>
                    <li>At least one observation must be dated within the last five years</li>
                </ul>
                <h3>Seasonality</h3>
                <p>The seasonal Kendall test is a special case of the Mann-Kendall test. It runs a separate Mann-Kendall test on each season separately, which helps account for seasonal differences that might be present in the data. Many water quality parameters, including those featured in this dashboard, exhibit seasonality due to normal changes in weather, hydrology, land use, and other factors. In this analysis, we define the seasons in the seasonal Kendall test to be the 12 months of the year. In other words, January data are compared only to other January data, February data are compared only to other February data, etc.</p>
                <h3>Censored data</h3>
                <p>Non-censored data refers to results that were detected above the method detection limit (MDL) and therefore can be reported with a greater level of confidence. The MDL is the lowest possible calculated level, or the minimum concentration of an analyte, that can be reported using a given method.</p>
                <h3>Trend categories</h3>
                <p>Trends are categorized into one of four classes.</p>
                <Table celled collapsing>
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell>
                                <div className={trendContainer}>
                                    <div className={iconWrapper}><IconTrendingUp size={42} /></div>
                                    <div className={textWrapper}>Possibly increasing</div>
                                </div>
                            </Table.Cell>
                            <Table.Cell>
                                tau &gt; 0, p-value &lt; 0.05
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>
                                <div className={trendContainer}>
                                    <div className={iconWrapper}><IconTrendingDown size={42} /></div>
                                    <div className={textWrapper}>Possibly decreasing</div>
                                </div>
                            </Table.Cell>
                            <Table.Cell>
                                tau &lt; 0, p-value &lt; 0.05
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>
                                <div className={trendContainer}>
                                    <div className={iconWrapper}><IconMinus size={42} /></div>
                                    <div className={textWrapper}>No significant trend</div>
                                </div>
                            </Table.Cell>
                            <Table.Cell>
                                p-value &gt; 0.05
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>
                                <div className={trendContainer}>
                                    <div className={iconWrapper}><IconMinus size={42} /></div>
                                    <div className={textWrapper}>Insufficient data</div>
                                </div>
                            </Table.Cell>
                            <Table.Cell>
                                Does not meet data requirements
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
            </div>
        </LayoutInfo>
    )
}

