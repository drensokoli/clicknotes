import React from 'react';

const NotionResponse = ({ apiResponse, setApiResponse }: { apiResponse: string | null, setApiResponse: any }) => {
    if (apiResponse === 'Added movie to Notion' || apiResponse === 'Added TV show to Notion' || apiResponse === 'Added book to Notion') {

        setTimeout(() => {
            setApiResponse(null);
        }, 2000);

        return (
            <div className="success-message">
                <p>{apiResponse}</p>
            </div>
        );

    } else if (apiResponse === 'Error adding movie to Notion' || apiResponse === 'Error adding TV show to Notion' || apiResponse === 'Error adding book to Notion') {

        setTimeout(() => {
            setApiResponse(null);
        }, 4000);

        return (
            <div className="error-message">
                <p>{apiResponse}</p>
                Need <a href="/help" target="_blank">
                    <span className="text-blue-500">help</span>?
                </a>
            </div>
        );
    } else if (apiResponse === 'Adding movie to Notion...' || apiResponse === 'Adding TV show to Notion...' || apiResponse === 'Adding book to Notion...') {
        return (
            <div className="loading-message">
                <p>{apiResponse}</p>
            </div>
        );
    } else {
        return null;
    }
}

export default NotionResponse;
