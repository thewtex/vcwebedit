"""WSGI application that takes patches, commits them, and pushes them to the
review application."""

import argparse
import os

from flask import Flask

root = os.path.dirname(os.path.realpath(__file__))
static_folder = os.path.realpath(os.path.join(root, '..', 'doc', '_build',
                                              'html'))
app = Flask(__name__, static_folder=static_folder)


@app.route('/')
def hello():
    return 'hello vcweb world!'


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=
                                     'Run the patch pushing proxy server.')
    parser.add_argument('--host', help='Hostname to listen on')
    parser.add_argument('--port', help='Port to serve on', type=int)
    parser.add_argument('--debug', help='Enable debug mode',
                        action='store_true')
    args = parser.parse_args()
    app.run(host=args.host, port=args.port, debug=args.debug)
