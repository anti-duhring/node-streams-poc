import http from 'http'
import { Readable } from 'stream'
import { randomUUID } from 'crypto'

function* run(){
    for(let i = 0; i <= 99; i++){
        const data = {
            id: randomUUID(),
            name: `User ${i}`
        }

        yield data
    }

}

async function handler(request, response) {
    const readable = new Readable({
        read() {
            for(const data of run()){
                const string = JSON.stringify(data) + '\n'
                this.push(string)
            }
            // To show that all data has been read
            this.push(null)
        }
    })

    readable
        .pipe(response)
}

http.createServer(handler)
.listen(3000)
.on('listening', () => console.log('Listening on port 3000'))