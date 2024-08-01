import { MongoClient } from 'mongodb'

const config = useRuntimeConfig()

const client = new MongoClient(config.mongodbUri)

export default client