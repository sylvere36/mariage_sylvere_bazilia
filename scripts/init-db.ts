import { execSync } from 'child_process';

async function main() {
  console.log('🚀 Initializing database...');
  
  try {
    // Push le schema vers la base de données
    execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
    console.log('✅ Database initialized successfully!');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
}

main();

