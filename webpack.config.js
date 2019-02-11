const path = require('path');

const base_config = {
    mode: "development",
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: "awesome-typescript-loader",
            exclude: /node_modules/
        }]
    },
    resolve: {
        extensions: [ ".tsx", ".ts", ".js" ]
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist")
    },
    devtool: "source-map"
};

const server_config = Object.assign(
    {
        target: "node",
        entry: {
            server: "./src/server/main.ts"
        }
    },
    base_config
);

const client_config = Object.assign(
    {
        target: "web",
        entry: {
            client: "./src/client/main.ts"
        }
    },
    base_config
);

module.exports = [server_config, client_config];