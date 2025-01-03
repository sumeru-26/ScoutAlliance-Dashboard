import { metadata } from '@vueuse/core/metadata.cjs'
import { defineEventHandler, H3Event, parseCookies } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
    
    // console.log('new request')
        
    const cookies = parseCookies(event)
    const query = getQuery(event)
    
    const dbQuery = JSON.parse(String(query.dbQuery))
    const page = Number(query.page)
    const entriesPerPage = Number(query.entriesPerPage)

    const token = cookies['auth:token']
    const team = await getTeamFromToken(token)

    // console.log(JSON.parse(String(query.dbQuery)))
    // console.log(JSON.parse(String(query.dbQuery)))

    const pipeline = [
        { $match: dbQuery },
        { $sort: { "metadata.timestamp": -1 } },
        { $facet: {
            metadata: [ { $count: 'numEntries' } ],
            entries: [
                { $skip: (page - 1) * entriesPerPage },
                { $limit: entriesPerPage },
                { $unset: [ "_id" ] }
            ]
        }}
        
    ]
    
    const col = dbClient.db('entries').collection(`${team}`)
    const data = await col.aggregate(pipeline).toArray()
    return data
    
})