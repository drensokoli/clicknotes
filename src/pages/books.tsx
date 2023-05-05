import React from 'react';
import PageContent, { ContentType } from '@/components/PageContent';


const Books: React.FC = () => {

    return (
        <>
            <div title='Books'>
                <PageContent contentType={ContentType.Movie} />
            </div>
        </>
    );
};

export default Books;
