import React from 'react';
import PageContent, { ContentType } from '@/components/PageContent';


const Books: React.FC = () => {

    return (
        <>
            <PageContent contentType={ContentType.Movie} />
        </>
    );
};

export default Books;
