"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const triggers = [
        'stress',
        'after_meal',
        'coffee',
        'alcohol',
        'boredom',
        'social_event',
        'driving',
        'work_break',
        'anxiety',
    ];
    for (const name of triggers) {
        await prisma.trigger.upsert({
            where: { name },
            update: {},
            create: { name },
        });
    }
    console.log('Default triggers seeded.');
}
main()
    .then(async () => {
    await prisma.$disconnect();
})
    .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
});
