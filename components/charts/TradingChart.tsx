'use client';

import React, { useEffect, useRef, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';

interface TradingChartProps {
    symbol?: string;
    theme?: 'light' | 'dark';
}

export default function TradingChart({ symbol = 'BTC/USDT', theme = 'dark' }: TradingChartProps) {
    const [options, setOptions] = useState<EChartsOption>({});

    useEffect(() => {
        // Mock Data Generation
        const upColor = '#00da3c';
        const upBorderColor = '#008F28';
        const downColor = '#ec0000';
        const downBorderColor = '#8A0000';

        const generateData = () => {
            const data: any[] = [];
            let date = new Date().getTime();
            let open = 45000;
            let close;
            let lowest;
            let highest;

            for (let i = 0; i < 50; i++) {
                const variance = Math.random() * 1000 - 500;
                open = open + variance;
                close = open + (Math.random() * 500 - 250);
                lowest = Math.min(open, close) - Math.random() * 200;
                highest = Math.max(open, close) + Math.random() * 200;
                data.push([
                    new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    open,
                    close,
                    lowest,
                    highest
                ]);
                date += 60000;
            }
            return data;
        };

        const data0 = splitData(generateData());

        function splitData(rawData: any[]) {
            const categoryData = [];
            const values = [];
            for (let i = 0; i < rawData.length; i++) {
                categoryData.push(rawData[i][0]);
                values.push([rawData[i][1], rawData[i][2], rawData[i][3], rawData[i][4]]);
            }
            return {
                categoryData: categoryData,
                values: values
            };
        }

        const chartOptions: EChartsOption = {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                },
                backgroundColor: 'rgba(20, 20, 20, 0.9)',
                borderColor: '#333',
                textStyle: {
                    color: '#eee'
                }
            },
            grid: {
                left: '3%',
                right: '3%',
                bottom: '10%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: data0.categoryData,

                boundaryGap: false,
                axisLine: { onZero: false, lineStyle: { color: '#555' } },
                splitLine: { show: false },
                min: 'dataMin',
                max: 'dataMax'
            },
            yAxis: {
                scale: true,
                splitArea: {
                    show: true,
                    areaStyle: {
                        color: ['rgba(255,255,255,0.02)', 'rgba(255,255,255,0.01)']
                    }
                },
                axisLine: { show: false },
                splitLine: { lineStyle: { color: '#333' } }
            },
            dataZoom: [
                {
                    type: 'inside',
                    start: 50,
                    end: 100
                },
                {
                    show: true,
                    type: 'slider',
                    top: '90%',
                    start: 50,
                    end: 100,
                    borderColor: 'transparent',
                    backgroundColor: '#1a1a1a',
                    fillerColor: 'rgba(100, 149, 237, 0.2)',
                    handleStyle: {
                        color: '#6495ED'
                    }
                }
            ],
            series: [
                {
                    name: 'Candlestick',
                    type: 'candlestick',
                    data: data0.values,
                    itemStyle: {
                        color: upColor,
                        color0: downColor,
                        borderColor: upBorderColor,
                        borderColor0: downBorderColor
                    }
                }
            ]
        };

        setOptions(chartOptions);
    }, []);

    return (
        <div className="w-full h-full rounded-xl overflow-hidden glass-panel border border-white/10 bg-black/40 backdrop-blur-md p-4">
            <div className="flex justify-between items-center mb-4 px-2">
                <h3 className="text-white font-mono text-sm tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    {symbol}
                </h3>
                <div className="text-xs text-white/50 font-mono">LIVE MARKET DATA</div>
            </div>
            <ReactECharts
                option={options}
                style={{ height: 'calc(100% - 40px)', width: '100%' }}
                className="w-full"
                theme={theme}
            />
        </div>
    );
}
