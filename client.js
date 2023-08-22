function cnnt() {
    // ante test
    var s = window.s = new WebSocket('ws://localhost:3001/test');
    s.addEventListener('error', (m) => {
        console.log("error");
    });
    s.addEventListener('open', (m) => {
    });
    s.addEventListener('message', (m) => {
        const c = m.data.slice(0, m.data.indexOf(':'));
        const d = m.data.slice(m.data.indexOf(':') + 1);
        if(c == 'al') alert(d);
        if(c == 'pr') s.send('::' + prompt(d));
        if(c == 'go') location = d;
    });
    s.addEventListener('close', (m) => {
        setTimeout(() => {
            cnnt();
        }, 1000);
    });
}

if (!window.s) {
    cnnt();
    document.addEventListener('keyup', e => s.send(e.key))
    document.addEventListener('click', e => s.send('<' + e.target.innerText + '>'))
}
