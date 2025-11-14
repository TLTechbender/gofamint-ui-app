"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("prisma/config");
require("dotenv/config");
exports.default = (0, config_1.defineConfig)({
    schema: "prisma/schema.prisma",
    migrations: {
        path: "prisma/migrations",
        // seed: `tsx prisma/seed.ts`,
        // seed: `tsx prisma/seedAuthor.ts`
    },
    engine: "classic",
    datasource: {
        url: (0, config_1.env)("DATABASE_URL"),
    },
});
