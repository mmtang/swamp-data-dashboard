import React, { useEffect } from 'react';
import { timeFormat } from 'd3-time-format';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, Label } from 'recharts';
import { customTooltip } from './time-series.module.css';


export default function TimeSeries({ data }) {
    const analyte = data[0].Analyte;
    const unit = data[0].Unit;
    // calculate average for placeholder threshold line
    const results = data.map(d => d.Result).filter(d => d !== 'NaN');
    const avgResult = results.reduce((a, b) => a + b) / results.length;

    const renderTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const dateFormatter = timeFormat('%B %e, %Y');
            const attributes = payload[0].payload;
            return (
                <div className={customTooltip}>
                    {/* payload.value holds the x-axis value (sample date) */}
                    <span>{`${dateFormatter(payload[0].value)}`}</span> 
                    <br />
                    <span>{`${attributes.Result} ${attributes.Unit}`}</span>
                </div>
            )
        } 
        return null;
    }
    
    return (
        <div style={{ width: '500px', height: '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                    width={500}
                    height={350}
                    margin={{
                        top: 30,
                        right: 20,
                        bottom: 20,
                        left: 20,
                    }}>
                    <Label value={analyte} position="top" />
                    <CartesianGrid />
                    <XAxis 
                        type="number"
                        dataKey="parsedDate" 
                        name="sampledate"
                        domain={['auto', 'auto']} 
                        tickFormatter={timeFormat('%b %Y')}
                        scale="time" />
                    <YAxis 
                        type="number" 
                        dataKey="Result" 
                        name="result" 
                        domain={[0, 'dataMax']} >
                         <Label
                            value={unit}
                            position="insideLeft"
                            angle={-90}
                            style={{ textAnchor: 'middle' }} />
                    </YAxis>
                    <ReferenceLine y={avgResult} label="Threshold" stroke="red" strokeDasharray="3 3" />
                    <Tooltip content={renderTooltip} isAnimationActive={false} />
                    <Scatter name="Timeseries" data={data} fill="#0071bc" isAnimationActive={false} />
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    )
}