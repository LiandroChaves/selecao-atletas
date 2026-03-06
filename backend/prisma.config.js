require('dotenv').config();

function buildUrl() {
    const url = process.env.DATABASE_URL || '';
    const isExternal = url.includes('onrender.com') || process.env.NODE_ENV === 'production';
    if (isExternal && !url.includes('sslmode=')) {
        return url + (url.includes('?') ? '&' : '?') + 'sslmode=require';
    }
    return url;
}

module.exports = {
    datasource: {
        url: buildUrl()
    }
}
