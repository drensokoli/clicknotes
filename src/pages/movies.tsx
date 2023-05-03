import React from 'react';
import PageContent, { ContentType } from '../components/PageContent';

const Movies: React.FC = () => {

    return (
        <>
            <PageContent contentType={ContentType.Movie} />
        </>
    );
};

export default Movies;
