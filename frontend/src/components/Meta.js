import React from 'react'
import { Helmet } from 'react-helmet'

const Meta = ({ title, description, keywords }) => {
    return (
        <Helmet>
            <title>{title}</title>
            <meta name='description' content={description} />
            <meta name='keywords' content={keywords} />
        </Helmet>
    )
}

export default Meta

Meta.defaultProps = {
    title: 'Welcome To The E-Store',
    description: 'We sell the best electronics',
    keywords: 'electronics, buy electronics, cheap electronics'
}

