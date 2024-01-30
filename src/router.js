/**
 * We need to index all the files inside the ROOT/markdown folder
 */
import { Router } from "express";
import { OPTIONS } from "./env.js";

import fs from "fs";
import { marked } from "marked";

const ROOT_PATH = `${process.cwd()}/markdown`;

const router = Router();

function getFileTree(path, files) {
    const filesAndFolders = fs.readdirSync(path);

    filesAndFolders.forEach((fileOrFolder) => {
        const stats = fs.statSync(`${path}/${fileOrFolder}`);
        if (stats.isDirectory()) {
            files.push({
                filename: fileOrFolder,
                kids: getFileTree(`${path}/${fileOrFolder}`, []),
            });
        } else {
            files.push({
                filename: fileOrFolder,
            });
        }
    });

    return files;
}

function findFile(path, files) {
    const pathParts = path.split('/').filter((part) => part !== '');
    let file = null;

    for (const part of pathParts) {
        file = files.find((f) => f.filename === part);

        if (!file) {
            return null;
        }

        files = file.kids;
    }

    return file;
}

function validatePath(path) {
    // we don't want to allow paths like ../../file.md
    if (path.includes('..')) {
        return false;
    }

    return true;
}

let files = getFileTree(ROOT_PATH, []);
const cache = {};

setInterval(() => {
    files = getFileTree(ROOT_PATH, []);
}, OPTIONS.timeBeforeIndex);

function putInCache(path, value) {
    cache[path] = value;

    setTimeout(() => {
        delete cache[path];
    }, OPTIONS.cacheTTL);
}

function redirectToIndex(res) {
    res.redirect('/index');
}

router.get('/*', async (req, res) => {
    const { path } = req;

    if (path === '/') {
        redirectToIndex(res);
        return;
    }

    if (cache[path]) {
        res.set('Content-Type', 'text/html');
        res.send(cache[path]);
        return;
    }

    const valid = validatePath(path);

    if (!valid) {
        console.log(path);
        redirectToIndex(res);
        return;
    }

    const file = findFile(`${path}.md`, files);

    if (!file) {
        console.log(path)
        redirectToIndex(res);
        return;
    }

    // the folder is everything before the last slash
    const folder = path.substring(0, path.lastIndexOf('/'));

    // use the marked library to parse the markdown file to HTML
    // return the HTML to the client
    marked.setOptions({
        gfm: true,
        breaks: true,
    });

    const html = await marked(fs.readFileSync(`${ROOT_PATH}/${folder}/${file.filename}`, 'utf8'));

    putInCache(path, html);

    res.set('Content-Type', 'text/html');
    res.send(html);
});

export { router };
