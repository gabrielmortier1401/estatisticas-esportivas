
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Criar esportes
  const futebol = await prisma.sport.create({ data: { name: 'Futebol' } });
  const basquete = await prisma.sport.create({ data: { name: 'Basquete' } });

  // Criar times
  const brasil = await prisma.team.create({ data: { name: 'Brasil', sportId: futebol.id } });
  const argentina = await prisma.team.create({ data: { name: 'Argentina', sportId: futebol.id } });
  const bulls = await prisma.team.create({ data: { name: 'Chicago Bulls', sportId: basquete.id } });
  const lakers = await prisma.team.create({ data: { name: 'Los Angeles Lakers', sportId: basquete.id } });

  // Jogadores Futebol
  await prisma.player.createMany({
    data: [
      { name: 'Pelé', goals: 1281, teamId: brasil.id },
      { name: 'Neymar', goals: 450, teamId: brasil.id },
      { name: 'Maradona', goals: 346, teamId: argentina.id },
      { name: 'Messi', goals: 800, teamId: argentina.id }
    ]
  });

  // Jogadores Basquete
  await prisma.player.createMany({
    data: [
      { name: 'Michael Jordan', goals: 32292, teamId: bulls.id },
      { name: 'LeBron James', goals: 39000, teamId: lakers.id }
    ]
  });

  // Recordes
  await prisma.record.createMany({
    data: [
      { title: 'Maior artilheiro da história: Pelé', sportId: futebol.id },
      { title: 'Maior goleador do século XXI: Messi', sportId: futebol.id },
      { title: 'Maior pontuador da NBA: LeBron James', sportId: basquete.id },
      { title: 'Mais títulos da NBA: Michael Jordan (6)', sportId: basquete.id }
    ]
  });

  console.log('Dados inseridos com sucesso!');
}

main()
  .then(() => prisma.$disconnect())
  .catch(e => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
