/**
 * !!!!!---------------------------------------------------------- PLEASE READ ----------------------------------------------------------!!!!!
 * i do not know if this can be called logic, it does work most of the time tough
 * if someone wants to make this prettier, please submit a pull request
 * get ready for some really ugly js
 */

var turn = true;

function updatePlayerTurn() {
    $("#player_turn").text(turn ? "Weiß am Zug" : "Schwarz am Zug, bitte warten...")
}

function onDrop(source, target, piece, newPos, oldPos, orientation) {
    if (source == target) {
        return;
    }
    board.move(source + "-" + target)

    // promote white pawns
    if (board.fen().split("/")[0].includes("P")) {
        let newFen = board.fen().replace("P", "Q");
        board.position(newFen)
    }

    turn = !turn
    updatePlayerTurn()
    performAiMove()
}

var board = Chessboard('board', {
    draggable: true,
    position: 'start',
    onDrop: onDrop
})

function turnChar() {
    return turn ? " w KQkq - 0 1" : " b KQkq - 0 1";
}

async function performAiMove() {
    let currentFen = board.fen() + turnChar();
    let successful = false
    let maxTries = 6
    var currentTries = 1
    var data;

    while (!successful && currentTries < maxTries) {
        try {
            data = await (await getNewFEN(currentFen)).json()
            if (data == undefined) {
                currentTries += 1
                $("#error_text").text("Zug wird gesucht... Versuch: " + currentTries)
                return;
            }
            successful = true
            $("#error_text").text("")
        } catch (e) {
            console.log(e)
            currentTries += 1
            $("#error_text").text("Zug wird gesucht... Versuch: " + currentTries)
        }

    }
    if (!successful) {
        $("#error_text").text("Ein Fehler ist aufgetreten, es konnte kein Zug gefunden werden :(")

    } else {
        turn = !turn
        updatePlayerTurn()
        board.position(data.updatedFEN)
        console.log("time:" + data.calculationTimeInSeconds)
        $("#last_time").text("Letzte Antwortzeit: " + Math.round(data.calculationTimeInSeconds) + " Sekunden")
        console.log(data.move)
        $("#last_move_and_value").text("Letzter Zug: " + data.move + " (" + data.value + ")")
    }


}

function castle(kingside) {
    if (kingside) {
        console.log("Castle Kingside")
        board.move("e1-g1", "h1-f1")
    } else {
        console.log("Castle Queenside")
        board.move("e1-c1", "a1-d1")
    }
    turn = !turn
    updatePlayerTurn()
    performAiMove()
}

$("#castle_kingside_button").on("click", () => castle(true))
$("#castle_queenside_button").on("click", () => castle(false))