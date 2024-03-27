'use client'
import React from 'react';
import { lusitana } from '@/app/ui/fonts';



export default function Page() {
    return (
        <div className="w-full " style={{ position: 'relative' }}>

            <div className=" text-justify ">
                <h2 className={`${lusitana.className} text-3xl  items-full`} >Carbon Credit Market Metrics</h2>
            </div>

            <div
                style={{
                    position: 'absolute',
                    top: 30,
                    left: 0,
                    width: '100%',
                    height: '8.5%',
                    backgroundColor: 'white',
                    opacity: 1, // Adjust the opacity as needed          
                    zIndex: 2, // Ensure the overlay is above the Power BI component
                }}
            ></div>

            <div
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '8.5%',
                    backgroundColor: 'white',
                    opacity: 1, // Adjust the opacity as needed          
                    zIndex: 2, // Ensure the overlay is above the Power BI component
                }}
            ></div>

            <div
                style={{
                    position: 'absolute',
                    top: 51,
                    left: 0,
                    width: '2%',
                    height: '8.5%',
                    backgroundColor: 'white',
                    opacity: 1, // Adjust the opacity as needed          
                    zIndex: 2, // Ensure the overlay is above the Power BI component
                }}
            ></div>



            <iframe title="Metrics" width="800" height="541.25" src="https://app.powerbi.com/reportEmbed?reportId=34ca1de5-28df-47d0-bfcc-4fe0d32e78eb&autoAuth=true&ctid=30a5145e-75bd-4212-bb02-8ff9c0ea4ae9" frameBorder="0" allowFullScreen={true}></iframe>
            {/* 

            <PowerBIEmbed
                embedConfig={
                    {
                        type: 'report', // Supported types: report, dashboard, tile, visual, and qna.
                        id: '<Report Id>',
                        embedUrl: 'https://app.powerbi.com/groups/me/reports/34ca1de5-28df-47d0-bfcc-4fe0d32e78eb/ReportSection?experience=power-bi',
                        accessToken: '<Access Token>',
                        tokenType: models.TokenType.Embed, // Use models.TokenType.Aad if you're embedding for your organization.
                        settings: {
                            panes: {
                                filters: {
                                    expanded: false,
                                    visible: false
                                }
                            },
                        }
                    }
                }

                eventHandlers={
                    new Map([
                        ['loaded', function () {
                            console.log('Report loaded');
                        }],
                        ['rendered', function () {
                            console.log('Report rendered');
                        }],
                        ['error', function (event) {
                            console.log(event.detail);
                        }]
                    ])
                }

                cssClassName={
                    "report-style-class"
                }

                getEmbeddedComponent={
                    (embeddedReport) => {
                        window.report = embeddedReport;
                    }
                }
            /> */}
        </div>



    );
}; 