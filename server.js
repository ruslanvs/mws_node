console.log( "******** server.js ********" )

let port = 8000
let express = require( "express" )
let app = express()
// let bodyparser = require( "body-parser" )
let pg = require( "pg" )
let format = require( "pg-format" )
let PGUSER = "postgres"
let PW = "MXtG2ZesVF9p" //>> hardcoded password
let PGDATABASE = "mws"

let config = {
    user: PGUSER,
    password: PW,
    database: PGDATABASE,
    max: 100,
    idleTimeoutMillis: 30000
}

let pool = new pg.Pool( config )

app.get( "/schools", function( req, res ){
    console.log( "Get all schools route triggered" )
    pool.connect( function( err, client, done ){
        if( err ){ res.json( err ) }
        let query = format( "SELECT * FROM schools" )
        client.query( query, function( err, data ){
            if( err ){ res.json( { message: "Error", error: err } ) }
            else { res.json( data.rows ) }
            client.end()
        })
    })
})

app.get( "/schools_updated_after/:timestamp", function( req, res ){
    console.log( "Incremental schools fetch route triggered for dates after: " )
    let timestamp = req.params.timestamp
    console.log( timestamp )
    pool.connect( function( err, client, done ){
        if( err ){ res.json( err ) }
        let query = format( "SELECT * FROM schools WHERE updated_at > '" + timestamp + "'" )
        client.query( query, function( err, data ){
            if( err ){ res.json( { message: "Error", error: err } ) }
            else { res.json( data.rows ) }
            client.end()
        })
    })
})

app.listen( port, function(){
    console.log(`listening on port ${port}` )
} )