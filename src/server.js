/**
 * 2024-01-29, gustrb 
 * 
 * This is the main server file for the application, the main idea is to create a server
 * that will recieve GET requests from the client, and return the HTML file that should be rendered,
 * according to the URL requested.
 * 
 * Example:
 * GET /binary-search -> will go into the /markdown folder, find the file binary-search.md, parse it to HTML and return it to the client.
 * 
 * This server will be using Express.js and the marked library to parse markdown to HTML.
 * And we will have folders for the markdown files, so we can organize the content, for example:
 * 
 * GET /algorithms/binary-search -> will go into the /markdown/algorithms folder, find the file binary-search.md, parse it to HTML and return it to the client.
 */
import express from 'express';
import { OPTIONS } from './env.js';
import { router } from './router.js';

function main() {
    const app = express();

    app.use(router);

    app.listen(OPTIONS.port, (error) => {
        if (error) {
            console.error(error);
            process.exit(1);
        }

        console.log(`Server listening at http://localhost:${OPTIONS.port}`);
    });
}

main();