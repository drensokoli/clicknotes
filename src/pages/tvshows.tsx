import React from 'react';
import PageContent, { ContentType } from '@/components/PageContent';

const Movies: React.FC = () => {

    return (
        <>
        <div title='TV Shows'>
            <PageContent contentType={ContentType.TvShow} />
        </div>
        </>
    );
};

export default Movies;
