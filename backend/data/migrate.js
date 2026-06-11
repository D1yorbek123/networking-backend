import mongoose from 'mongoose';

// Old database (source)
const OLD_URI = 'mongodb+srv://abdukarim:abdukarim@cluster0.1cphvgq.mongodb.net/crm-system?appName=Cluster0';

// New database (destination)
const NEW_URI = 'mongodb+srv://diyorbekprimqulov334_db_user:UOzco2h2KMOWIp9a@cluster0.83jhfgo.mongodb.net/Networking?appName=Cluster0';

const migrateData = async () => {
  let oldConn, newConn;

  try {
    console.log('[Migrate] Connecting to OLD database...');
    oldConn = await mongoose.createConnection(OLD_URI).asPromise();
    console.log('[Migrate] Connected to OLD database successfully');

    console.log('[Migrate] Connecting to NEW database...');
    newConn = await mongoose.createConnection(NEW_URI).asPromise();
    console.log('[Migrate] Connected to NEW database successfully');

    // Get collections from old database
    const collections = await oldConn.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    console.log(`[Migrate] Found collections: ${collectionNames.join(', ')}`);

    for (const name of collectionNames) {
      console.log(`[Migrate] Migrating collection: ${name}...`);

      // Read all documents from old collection
      const documents = await oldConn.db.collection(name).find({}).toArray();
      console.log(`[Migrate]   Found ${documents.length} documents`);

      if (documents.length === 0) {
        console.log(`[Migrate]   Skipping empty collection`);
        continue;
      }

      // Drop the collection in new database if it exists
      try {
        await newConn.db.collection(name).drop();
        console.log(`[Migrate]   Dropped existing collection in new DB`);
      } catch (e) {
        // Collection might not exist yet, that's fine
      }

      // Insert documents into new database
      const result = await newConn.db.collection(name).insertMany(documents);
      console.log(`[Migrate]   Inserted ${Object.keys(result.insertedIds).length} documents into new DB`);
    }

    console.log('\n[Migrate] ✅ Migration completed successfully!');

    // Show summary
    console.log('\n[Migrate] === Migration Summary ===');
    for (const name of collectionNames) {
      const count = await newConn.db.collection(name).countDocuments();
      console.log(`[Migrate]   ${name}: ${count} documents`);
    }

  } catch (error) {
    console.error('[Migrate] ❌ Migration failed:', error);
    process.exit(1);
  } finally {
    if (oldConn) await oldConn.close();
    if (newConn) await newConn.close();
    console.log('[Migrate] Connections closed');
    process.exit(0);
  }
};

migrateData();
