#!/usr/bin/env python

"""Build the documentation, and run the JavaScript tests with karma if
available."""

import sphinx.cmdline

import argparse
import os
import subprocess
import sys
import threading
# Sane name in Python 3
try:
    from http import server
except ImportError:
    import SimpleHTTPServer as server
try:
    from socketserver import TCPServer
except ImportError:
    from SocketServer import TCPServer

parser = argparse.ArgumentParser(description="Build the vcwebedit documention \
and run the JavaScript tests.")
parser.add_argument("-k", "--karma",
                    default="karma",
                    help="Path to the karma executable.")
parser.add_argument("-p", "--port",
                    default=8080,
                    type=int,
                    help="Local port to run the web server.")
parser.add_argument("-l", "--linger",
                    action='store_true',
                    help="Start a local web server after the tests run.")
options = parser.parse_args()


# Build the documentation for vcwebedit.
source_dir = os.path.join(os.path.abspath(os.path.dirname(__file__)),
                          '..', 'doc')
build_dir = os.path.join(source_dir, '_build')
# Build html, warning treated as errors, output the doctrees to
# build_dir/doctrees.
sphinx_argv = ['sphinx-build',
               '-b', 'html',
               '-W',
               '-d', os.path.join(build_dir, 'doctrees'),
               source_dir, os.path.join(build_dir, 'html')]
print("Building vcwebedit documentation with:\n")
print(' '.join(sphinx_argv))
build_result = sphinx.cmdline.main(sphinx_argv)
if build_result:
    sys.stderr.write("sphinx-build failed.\n")
    sys.exit(build_result)
else:
    print("sphinx-build succeeded!")


# Start the patch pushing proxy server.
sys.path.insert(1, os.path.abspath(os.path.dirname(__file__)))
import vcwebproxy
if not options.linger:
    vcwebproxy.app.config['TESTING'] = True
app = vcwebproxy.app.test_client()

# Run the javascript tests with karma if available.
testing_results = 0
try:
    print("karma version:")
    return_code = subprocess.call([options.karma, '--version'])
    if return_code != 0:
        print("\nCould not execute karma.  ' " +
              "Skipping automated JavaScript tests.")
    else:
        karma_conf = os.path.join(source_dir, '..', 'test', 'karma.conf.js')
        testing_results = subprocess.call([options.karma,
                                           'start',
                                           karma_conf])
        print("")
except OSError:
    print("Could not execute karma.  Skipping automated JavaScript tests.")


class ThreadedHTTPServer(TCPServer):
    allow_reuse_address = True


class ServerRunner(object):
    def serve_on_port(self, port):
        handler = server.SimpleHTTPRequestHandler
        self.httpd = ThreadedHTTPServer(("localhost", options.port), handler)
        self.server_thread = threading.Thread(
            target=self.httpd.serve_forever)
        self.server_thread.daemon = True
        self.server_thread.start()

    def cleanup(self):
        if self.httpd is not None:
            print('Shutting down the testing web server...')
            self.httpd.shutdown()
            self.httpd.server_close()

if options.linger:
    print('Starting up the testing web server...')
    os.chdir(os.path.join(build_dir, 'html'))

    server_runner = ServerRunner()
    server_runner.serve_on_port(options.port)

    print('Point your browser to http://localhost:' + str(options.port) + '/')
    print('Press Ctrl+C to shutdown the webserver.')
    subprocess.call([sys.executable,
                    vcwebproxy.__file__,
                    '--host', 'localhost',
                    '--port', str(options.port+1),
                    '--debug'])

sys.exit(testing_results)
