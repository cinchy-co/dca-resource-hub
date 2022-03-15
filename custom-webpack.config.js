const CompressionPlugin = require(`compression-webpack-plugin`);
const BrotliPlugin = require(`brotli-webpack-plugin`);
const zlib = require("zlib");
const path = require(`path`);
module.exports = {
    plugins:[
      new CompressionPlugin({
        filename: "[path][base].br",
        algorithm: "brotliCompress",
        test: /\.(js|css|html|svg|txt|eot|otf|ttf|gif)$/,
        compressionOptions: {
          params: {
            [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
          },
        },
        deleteOriginalAssets: false,
      })
      /*,
        new BrotliPlugin({
            asset: '[fileWithoutExt].[ext].br',
            test: /\.(js|css|html|svg|txt|eot|otf|ttf|gif)$/
        }),
        new CompressionPlugin({
            test: /\.(js|css|html|svg|txt|eot|otf|ttf|gif)$/,
            filename(info){
                let opFile= info.filename.split('.'),
                opFileType =  opFile.pop(),
                opFileName = opFile.join('.');
                return `${opFileName}.${opFileType}.gz`;
            }
        })*/
    ],
}
