import { Client, Databases, ID, Query } from 'appwrite';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1') // Your Appwrite Endpoint
    .setProject(PROJECT_ID); // Your project ID

const database = new Databases(client);

export const updateSearchCount = async (searchTerm, movie) =>   {
    //1. Use appwrite API to update search count exist in database
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            //query to find if searchTerm exist
            Query.equal('searchTerm', searchTerm),
        ])

        //2. If exist, update count
        if (result.documents.length > 0) {
            //document exist, update count
            const doc = result.documents[0];
            await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
                count: doc.count + 1,
            })
        } else {
          //3. If not exist, create new doc with the search term and count = 1  
            await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
                searchTerm,
                count: 1,
                movie_id: movie.id,
                poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            })
        }

    } catch (error) {
        console.error('Error updating search count:', error);
    }
    

    
}