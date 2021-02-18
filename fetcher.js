function getNewFEN(fen) {
    var formdata = new FormData();
    formdata.append("fen", fen);

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