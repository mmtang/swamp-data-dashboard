import React, { useRef } from 'react';
import Layout from '../components/layout/layout';
import { Button } from 'semantic-ui-react';
import { parent, hero, sectionContent, footer, copyright } from './home.module.css';

export default function Home() {
    const yearRef = useRef(new Date().getFullYear());


    return (
        <Layout>
            <div className={parent}>
                <div className={hero}>
                    <div className={sectionContent}>
                        <h1>SWAMP Data Dashboard</h1>
                        <p>The Surface Water Ambient Monitoring Program (SWAMP) mission is to generate  high quality, accessible, and usable data and information that is used to protect and restore California’s watersheds, and to inform California communities about local conditions of waterbodies monitored by SWAMP. This dashboard provides data generated by SWAMP for the time period of 2000-{yearRef.current}.</p>
                        <Button size="medium" color="teal">Explore the data</Button>
                    </div>
                </div>
                <div className="section">
                    <div className={sectionContent}>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Aliquam etiam erat velit scelerisque. Blandit aliquam etiam erat velit scelerisque in dictum. Morbi tincidunt augue interdum velit euismod in pellentesque massa placerat. Varius vel pharetra vel turpis nunc eget lorem dolor.</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Aliquam etiam erat velit scelerisque. Blandit aliquam etiam erat velit scelerisque in dictum. Morbi tincidunt augue interdum velit euismod in pellentesque massa placerat. Varius vel pharetra vel turpis nunc eget lorem dolor. </p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Aliquam etiam erat velit scelerisque. Blandit aliquam etiam erat velit scelerisque in dictum. Morbi tincidunt augue interdum velit euismod in pellentesque massa placerat. Varius vel pharetra vel turpis nunc eget lorem dolor. </p>
                    </div>
                </div>
                <div className={footer}>
                    <div className={sectionContent}>
                        <span className={copyright}>
                            Copyright © {yearRef.current} State of California<br />
                            Surface Water Ambient Monitoring Program&nbsp;&nbsp;|&nbsp;&nbsp;California Water Boards
                        </span>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

