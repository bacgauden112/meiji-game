const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.gameConfig.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      maxRetryPerUser: 2,
      maxSessionPerDay: 1000,
      currentDayCount: 0,
      lastResetDate: '',
    },
  });
  console.log('✅ Seeded default config');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
