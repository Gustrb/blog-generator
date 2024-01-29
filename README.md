# Blog Generator

This app is meant for study only, and doesn't really meet any performance or security criteria (only the ones I thought would be really obvious).
Here I will dump most of the files I generated while studying in an easy to approach way.
By doing this I will force myself to start using less pen-and-paper and using more markdown, being able to keep versions of my study.

It is really simple to use, you can just run:
`$ npm run start`

And then to be able to access your markdown files you can just add them inside the `markdown` folder, for example, let's say I'm studying about
binary search, and I want to have a markdown about it, I could create a file in `markdown/binary-search.md` containing all my notes about this algorithm, and whenever I want to look at my notes, I could simply:
`GET /binary-search`;

There is also folder support, so if I want to group my notes I could do something like creating a folder structure such as: `markdown/algorithms/binary-search.md`. And to be able to read my notes I could simply:
`GET /algorithms/binary-search`