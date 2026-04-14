import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const SOURCE_DB = 'test';
const TARGET_DB = 'pahinga_db';

const migrate = async () => {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('❌ MONGODB_URI not found in .env');
    process.exit(1);
  }

  // Connect to source database (test)
  const sourceUri = uri.replace(/\/[^\/]*\?/, `/${SOURCE_DB}?`);
  const targetUri = uri.replace(/\/[^\/]*\?/, `/${TARGET_DB}?`);

  console.log('🔗 Connecting to source database:', SOURCE_DB);
  const sourceConn = await mongoose.createConnection(sourceUri).asPromise();
  
  console.log('🔗 Connecting to target database:', TARGET_DB);
  const targetConn = await mongoose.createConnection(targetUri).asPromise();

  const collections = ['users', 'services', 'bookings'];

  for (const collName of collections) {
    console.log(`\n📦 Migrating ${collName}...`);
    
    const sourceColl = sourceConn.collection(collName);
    const targetColl = targetConn.collection(collName);
    
    // Get all documents from source
    const docs = await sourceColl.find({}).toArray();
    console.log(`   Found ${docs.length} documents in ${SOURCE_DB}.${collName}`);
    
    if (docs.length === 0) {
      console.log(`   ⏭️  Skipping (empty)`);
      continue;
    }
    
    // Clear target collection
    await targetColl.deleteMany({});
    console.log(`   🗑️  Cleared ${TARGET_DB}.${collName}`);
    
    // Insert to target
    if (docs.length > 0) {
      await targetColl.insertMany(docs);
      console.log(`   ✅ Inserted ${docs.length} documents to ${TARGET_DB}.${collName}`);
    }
  }

  console.log('\n🎉 Migration completed successfully!');
  
  await sourceConn.close();
  await targetConn.close();
  process.exit(0);
};

migrate().catch(err => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
