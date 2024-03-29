import os
import chess
from flask import Flask, request, jsonify
import nbformat
from nbconvert import PythonExporter
import time
from flask_cors import CORS, cross_origin


def execute_chess_core(notebook_path, module_path):

    with open(module_path, 'w+', encoding="utf8") as fh:
        fh.writelines(source)


with open(os.path.join(os.path.dirname(__file__),
                       "chess_core.ipynb")) as fh:
    nb = nbformat.reads(fh.read(), nbformat.NO_CONVERT)

exporter = PythonExporter()
source, meta = exporter.from_notebook_node(nb)
exec(source)
POLYGLOT_PATH = os.path.join(os.path.dirname(
    __file__), "data/polyglot/performance.bin")

app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/nextmove/', methods=['POST'])
@cross_origin()
def post_something():
    param = request.form.get('fen')
    depth = 4  # default to 4
    if request.form.get('depth'):
        depth = int(request.form.get('depth'))
    print(param)
    # You can add the test cases you made in the previous function, but in our case here you are just testing the POST functionality
    if param:
        start_time = time.time()
        board = chess.Board(param)
        value, move = minimax_input(board, depth)
        board.push(move)
        return jsonify({
            "move": move.uci(),
            "updatedFEN": board.fen(),
            "calculationTimeInSeconds": time.time() - start_time,
            "value": value
        })
    else:
        return jsonify({
            "ERROR": "no fen found"
        })

# A welcome message to test our server


@app.route('/', methods=["POST"])
@cross_origin()
def index():
    return "<h1>Welcome to our server!!</h1>\nYou can get the next move at /nextmove"


if __name__ == '__main__':
    # Threaded option to enable multiple instances for multiple user access support
    app.run(threaded=True, port=5000)