import React from 'react';
import { Link, withPrefix } from 'gatsby';
import LayoutInfo from '../../components/layout/layout-info';
import { Icon, Message, Table } from 'semantic-ui-react';
import { IconTrendingUp, IconTrendingDown, IconMinus } from '@tabler/icons';
import { main } from '../pages.module.css';
import { trendContainer, iconWrapper, textWrapper, imageSetContainer, imageSet } from './trends.module.css';
import Metadata from '../../components/layout/metadata';


export default function Trends() {
    return (
        <LayoutInfo active='learn'>
            <Metadata title='Trends' />
            <div className={main}>
                <h1>Calculating trends</h1>
                <p>The SWAMP Data Dashboard displays trends for a suite of water quality parameters at the station level. Tracking water quality trends allows the Water Boards and others (i.e., water resource managers, the Legislature, and the public-at-large) to prioritize management actions, evaluate the effectiveness of Water Board programs, and identify emerging or previously unknown threats.</p>
                <div className={imageSetContainer}>
                    <img className={imageSet} src={withPrefix("trends-dashboard.png")} alt='Screenshot of dashboard showing trends' />
                </div>
                <h2>Methodology</h2>
                <Message compact>
                    <Icon name='exclamation triangle' />The methodology described on this page is currently in draft form. We welcome your feedback: <a href="mailto:swamp@waterboards.ca.gov">swamp@waterboards.ca.gov</a>.
                </Message>
                <h3>Data requirements</h3>
                <p>SWAMP data are analyzed for trends at the station-indicator level. The records are filtered by station code and then again by indicator. Only those records assigned a <Link to='../../data'>data quality category</Link> of "Passed", "Some review needed", or "Spatial accuracy unknown" are used in the analysis.</p>
                <p>Station-indicator datasets that meet the three criteria below are analyzed for trends. Station-indicator datasets that do not meet the criteria are assigned the "Insufficient data" trend category. In general, the more data points that are available, the more statistical power there is for identifying a trend in the dataset.</p>
                <ul>
                    <li>Must have at least five observations spanning five years</li>
                    <li>At least three of those observations must be non-censored</li>
                    <li>At least one observation must be dated within the last five years</li>
                </ul>
                <p></p>
                <h3>General approach</h3>
                <p>Trends are calculated for all water quality indicators using the seasonal Kendall test. The seasonal Kendall test is a statistical test used to analyze data for monotonic trends (i.e., as one variable increases, the other seems to increase or decrease). It evaluates all pairwise combinations of the data, determining if the latter observation is greater than, less than, or equal to the earlier observation. The seasonal Kendall test is a non-parametric test, meaning that missing values are allowed and the data do not need to conform to any particular distribution.</p>
                <p>The seasonal Kendall test is a special case of the Mann-Kendall test. It runs a separate Mann-Kendall test on each season separately, which helps account for seasonal differences that might be present in the data. Many water quality parameters, including those featured in this dashboard, exhibit seasonality due to normal changes in weather, hydrology, land use, and other factors. In this analysis, we define the seasons in the seasonal Kendall test to be the 12 months of the year. In other words, January data are compared only to other January data, February data are compared only to other February data, etc.
                </p>
                <p>The data is processed through R using the <i>censeaken</i> function in the <a href='https://cran.r-project.org/web/packages/NADA2/index.html' target='_blank' rel='noreferrer noopener'>NADA2: Data Analysis for Censored Environmental Data</a> package. The function utilizes ranked censored data (values that are not-detected, less than the detection limit, or greater than the detection limit) and performs permutation tests to compute the p-values. The resulting tau and p-values from R are analyzed to determine the significance and direction of the trend, if applicable. The significance level is placed at 0.05, meaning that the estimated probability that the identified trend is actually present in the data (and not found by chance) is at least 95 percent.</p>
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
                                tau &gt; 0, p-value &#8804; 0.05
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
                                tau &lt; 0, p-value &#8804; 0.05
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

