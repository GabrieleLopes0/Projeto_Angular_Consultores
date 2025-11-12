const admin = require('firebase-admin');
require('dotenv').config();

if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL
    })
  });
} else {
  console.error('❌ Firebase Admin SDK não configurado!');
  console.error('Verifique se as variáveis FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY e FIREBASE_CLIENT_EMAIL estão no arquivo .env');
  process.exit(1);
}

async function setRole(email, role) {
  try {
    const userRecord = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(userRecord.uid, { role: role });
    console.log(`✅ Role "${role}" definida para ${email} (UID: ${userRecord.uid})`);
    console.log(`⚠️  IMPORTANTE: O usuário precisa fazer logout e login novamente para que a role seja aplicada.`);
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      console.error(`❌ Usuário não encontrado: ${email}`);
      console.error('Verifique se o email está correto e se o usuário existe no Firebase Authentication.');
    } else {
      console.error('❌ Erro:', error.message);
    }
    process.exit(1);
  }
}

const email = process.argv[2];
const role = process.argv[3] || 'admin';

if (!email) {
  console.error('❌ Uso: node set-admin-role.js <email> [role]');
  console.error('');
  console.error('Exemplos:');
  console.error('  node set-admin-role.js admin@exemplo.com admin');
  console.error('  node set-admin-role.js usuario@exemplo.com user');
  process.exit(1);
}

if (role !== 'admin' && role !== 'user') {
  console.error('❌ Role deve ser "admin" ou "user"');
  process.exit(1);
}

setRole(email, role).then(() => {
  console.log('');
  console.log('✅ Concluído!');
  process.exit(0);
});

