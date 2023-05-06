import React from 'react';
import PageContent, { ContentType } from '../components/PageContent';

const Movies: React.FC = () => {

    return (
        <>
            <div title='Movies'>
                <PageContent contentType={ContentType.Movie} />
            </div>
        </>
    );
};

export default Movies;
