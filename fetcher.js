function getNewFEN(fen, depth = 4) {
    var formdata = new FormData();
    formdata.append("fen", fen);
    formdata.append("depth", depth)

    var headers = new Headers({
        'Access-Control-Allow-Origin': 'https://chess-ai-api.herokuapp.com/nextmove'
    });

    const requestOptions = {
        method: 'POST',
        body: formdata,
        mode: 'cors',
        redirect: 'follow'
    };
    return fetch('https://chess-ai-api.herokuapp.com/nextmove', requestOptions)
}