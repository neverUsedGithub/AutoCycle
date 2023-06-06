import { ActivityType, Client, GatewayIntentBits } from "discord.js";
import { trivia } from "./trivia.js";
import { config } from "dotenv";
config();

const bot = new Client({
    intents: [
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.Guilds,
    ],
});

const CODE_BLOCK_REGEX = /```[A-Za-z]*((?:\n|.)*?)```/;
const LINE_NUMBER_REGEX = /^ *[0-9]* *\| /gm;

bot.on("messageCreate", (msg) => {
    if (!msg.author.bot) return;
    if (msg.author.id !== "781939317450342470") return;
    if (!msg.embeds[0].title?.includes("Trivia")) return;

    const blockMatch = msg.embeds[0].description?.match(CODE_BLOCK_REGEX);
    if (!blockMatch) {
        msg.channel.send(`Couldn't find code block.`);
        return;
    }

    const codeWithLines = blockMatch[1];
    const code = codeWithLines.replace(LINE_NUMBER_REGEX, "").substring(1);

    const foundTrivia = trivia.find((triv) => triv.code === code);

    if (foundTrivia)
        msg.channel.send(
            `Found line! The error is on line ${foundTrivia.line}.`
        );
    else
        msg.channel.send(
            `Couldn't find line. The bot's trivia data might be outdated.`
        );
});

bot.on("ready", () => {
    console.log("The bot is online!");
    bot.user?.setPresence({
        status: "online",
        activities: [
            {
                name: `Automating cycle bot in ${bot.guilds.cache.size} server${bot.guilds.cache.size !== 1 ? "s" : ""}`,
                type: ActivityType.Playing
            }
        ]
    })
});

bot.login(process.env.TOKEN);
