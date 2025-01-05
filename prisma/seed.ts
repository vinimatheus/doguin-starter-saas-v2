const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('vinicius02442', 10);

  const user = await prisma.user.upsert({
    where: { email: 'vinicius@profood.com.br' },
    update: {},
    create: {
      name: 'Vinicius Matheus Moreira',
      email: 'vinicius@profood.com.br',
      password: hashedPassword,
      role: 'ADMIN'
    }
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch((error) => {
    prisma.$disconnect();
    process.exit(1);
  });
