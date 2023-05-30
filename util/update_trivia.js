import fetch from "node-fetch";
import esbuild from "esbuild";
import { writeFile } from "fs/promises";

fetch("https://raw.githubusercontent.com/cursorweb/Cycle-Bot-Game/master/src/util/data/trivia.ts")
    .then(r => r.text())
    .then(async tscode => {
        const transformed = await esbuild.transform(tscode, {
            format: "esm",
            loader: "ts"
        });

        await writeFile(
            "src/trivia.js",
            transformed.code
        );
    });