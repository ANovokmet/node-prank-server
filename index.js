const path = require('path');
const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');

app.use(cors());
app.use(express.json());
const ws = require('express-ws')(app);

app.get('/:roomId', (req, res) => {
    const file = fs.readFileSync(path.join(__dirname, './index.html'));
    const roomId = req.params.roomId;
    let response = file.toString().replace(/\$\$roomId/g, roomId);
    res.set('Content-Type', 'text/html');
    res.send(response);
});

app.get('/api/:roomId', (req, res) => {
    const roomId = req.params.roomId;
    const room = getRoom(roomId);
    const data = {
        users: Object.entries(room.users).map(([id, s]) => ({ id, ip: s.ip })),
        messages: room.messages.map(m => ({ date: m.date, text: m.text }))
    };
    res.send(data);
});

app.get('/client.js', (req, res) => {
    res.sendFile(path.join(__dirname, './client.js'));
});

// <script src="https://7fa2-86-32-74-150.ngrok.io/client.js"></script>
let connections = {}; 
let rooms = {};
let id = 0;

function sendTo(users, message) {
    for (const id in users) {
        const s = users[id];
        s.send(message);
    }
}

function getRoom(roomId) {
    if(!rooms[roomId]) {
        rooms[roomId] = {
            admins: {},
            users: {},
            messages: []
        };
    }
    return rooms[roomId];
}

function timeFormat(d) {
    const hours = leftPad(d.getHours());
    const minutes = leftPad(d.getMinutes());
    const seconds = leftPad(d.getSeconds());
    return hours + ":" + minutes + ":" + seconds;
}

function leftPad(n) {
    return n < 10 ? '0' + n : n;
}


app.ws('/:roomId', (s, req) => {
    console.log('websocket connection');
    console.log(req.headers);
    const roomId = req.params.roomId;
    const userId = id++ + '';
    const room = getRoom(roomId);
    const ip = req.socket.remoteAddress;
    s.ip = ip;

    function log(text) {
        const date = timeFormat(new Date());
        console.log(date, text);
        room.messages.unshift({ date, text });
        sendTo(room.admins, `ii;;${date};;${text}`);
    }

    if(req.query.admin) {
        room.admins[userId] = s;

        log(`Admin ${ip} (${userId}) connected`);

        s.on('message', m => {
            const [t, id, msg] = m.split('::');
            log(`Admin ${ip} (${userId}):${m}`);
            if(room.users[id]) {
                room.users[id].send(`${t}:${msg}`);
            }
        });

        s.on('close', e => {
            log(`Admin ${ip} (${userId}) disconnected`);
            delete room.admins[userId];
        });
    } else {
        room.users[userId] = s;
        log(`User ${ip} (${userId}) connected`);
        sendTo(room.admins, `ct;;;;${userId},${ip}`);

        s.on('message', m => {
            log(`User ${userId}:${m}`);
        });

        s.on('close', e => {
            log(`User ${ip} (${userId}) disconnected`);
            sendTo(room.admins, `dc;;;;${userId},${ip}`);
            delete room.users[userId];
        });
    }
});

app.listen(3001, () => console.log('listening on http://localhost:3001/'));