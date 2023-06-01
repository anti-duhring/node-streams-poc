import axios from 'axios'
import { Transform, Writable } from 'stream'

const url = 'http://localhost:3000'

async function consumer() {
    const response = await axios({
        url,
        method: 'get',
        responseType: 'stream'
    })

    return response.data
}

const stream = await consumer()
stream
    .pipe(
        new Transform({
            transform(chunk, enc, cb) {
                const item = JSON.parse(chunk)
                const userNumber = /\d+/.exec(item.name)[0]
                let name = item.name

                if(userNumber % 2 === 0) name = name.concat(' is even')
                else name = name.concat(' is odd')

                item.name = name
                
                cb(null, JSON.stringify(item))
            }
        })
    )
    .pipe(
        new Writable({
            write(chunk, enc, cb) {
                console.log(chunk)
                cb()
            }
        })
    )