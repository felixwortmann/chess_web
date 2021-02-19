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

function fenSuffix() {
    return turn ? " w KQkq - 0 1" : " b KQkq - 0 1";
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

$($("#try_again_button")).on("click", () => {
    showError(false)
    performAiMove(3)
})

function showError(show) {
    $("#try_again_button").toggle(show)
}




async function performAiMove(depth = 4) {
    let currentFen = board.fen() + fenSuffix();
    let successful = false
    var data;

    try {
        data = await (await getNewFEN(currentFen, depth)).json()
        successful = true
    } catch (e) {
        console.log(e)
    }

    if (!successful) {
        showError(true)
    } else {
        turn = !turn
        updatePlayerTurn()
        board.position(data.updatedFEN)
        $("#last_time").text("Letzte Antwortzeit: " + Math.round(data.calculationTimeInSeconds) + " Sekunden")
        $("#last_move_and_value").text("Letzter Zug: " + data.move + " (" + data.value + ")")
    }


}

function castle(kingside) {
    if (kingside) {
        board.move("e1-g1", "h1-f1")
    } else {
        board.move("e1-c1", "a1-d1")
    }
    turn = !turn
    updatePlayerTurn()
    performAiMove()
}

$("#castle_kingside_button").on("click", () => castle(true));
$("#castle_queenside_button").on("click", () => castle(false));