const path = require("path");
module.exports = {
    entry: "./src/main.ts",
    output: {
        filename: "./dist/bundle.js"
    },
    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",
    resolve: {
        // Add '.ts' as resolvable extensions.
        extensions: [".ts", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ["source-map-loader"],
                enforce: "pre"
            },
            {
                test: /\.ts$/,
                use: ["ts-loader"]
            }
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, "/dist"),
        compress: true,
        port: 8000
    },
    // Omit "externals" if you don't have any. Just an example because it's
    // common to have them.
    externals: [
        // Don't bundle giant dependencies, instead assume they're available in
        // the html doc as global variables node module name -> JS global
        // through which it is available
        {"d3": "d3",
         "immutable": "Immutable"}
    ]
};