const path = require('path');

const stationTemplate = path.resolve(`src/pages/stations/index.js`)

exports.onCreatePage = async ({ page, actions }) =>{
    const { createPage } = actions
    console.log('Page - ' + page.page);
    if (page.path.match(/^\/stations/)){
        createPage({
            path: `/stations/:id`,
            matchPath: `/stations/:id`,
            component: stationTemplate
        })
    }
}