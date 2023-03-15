
const withTM = require('next-transpile-modules')([
    '@ionic/react',
    '@ionic/core',
    '@stencil/core',
    'ionicons',
]);

/** @type {import('next').NextConfig} */
module.exports = withTM({
    experimental: {
        images: {
            allowFutureImage: true
        }
    },
    basePath: '',
    images: {
        domains: ['images.unsplash.com'],
    },
    swcMinify: true,
});



// module.exports = {
    // experimental: {
    //     images: {
    //         allowFutureImage: true
    //     }
    // }
// }