export default async function requestMove(fen: string, aiDepth: number): Promise<any> {
    var formdata = new FormData();
    formdata.append("fen", fen);
    formdata.append("depth", Math.floor(aiDepth).toString())

    // var headers = new Headers({
    //     'Access-Control-Allow-Origin': 'https://chess-ai-api.herokuapp.com/nextmove'
    // });

    const requestOptions: RequestInit = {
        method: 'POST',
        body: formdata,
        mode: 'cors',
        redirect: 'follow'
    };
    const url = process.env.API_HOST ? "http://" + process.env.API_HOST + ":5000/nextmove" : 'https://chess-ai-api.herokuapp.com/nextmove'
    const response = await fetch(url, requestOptions).then((value) => value.json())
    return response
}



