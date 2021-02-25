function getNewFEN(fen, aiDepth) {
    var formdata = new FormData();
    formdata.append("fen", fen);
    formdata.append("depth", aiDepth)

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