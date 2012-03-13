#!/usr/bin/env python

"""Build the documentation, and run the JavaScript tests with phantomjs if
available."""

import sphinx.cmdline

import argparse
import os
import subprocess
import sys
import multiprocessing
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
parser.add_argument("-p", "--port",
        default=8080,
        type=int,
        help="Local port to run the web server for testing.")
parser.add_argument("-l", "--linger",
        action='store_true',
        help="Keep the local web server open after the tests run.")
parser.add_argument("-j", "--phantomjs",
        default="phantomjs",
        help="Path to the phantomjs executable.")
options = parser.parse_args()

# Build the documentation for vcwebedit.
source_dir = os.path.join(os.path.abspath(os.path.dirname(__file__)), '..', 'doc')
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


def test_json_directory_listing_output():
    top_level_listing = os.path.join(build_dir, 'html', '_sources',
            'directory_listing.json')
    listing_file = open(top_level_listing, 'r')
    listing_file_contents = listing_file.readline()
    listing_file.close()
    listing_file_baseline = """{"directories": [], "files": ["web_edit.rst", "configuration.rst", "index.rst"]}"""
    def compare_contents(output, baseline):
        if not output == baseline:
            sys.stderr.write('Output:\n\t')
            sys.stderr.write(output)
            sys.stderr.write('\nBaseline:\n\t')
            sys.stderr.write(baseline)
            sys.stderr.write('\n\nOutput did not match the baseline\n')
            sys.exit(1)
    compare_contents(listing_file_contents, listing_file_baseline)
    nested_level_listing = os.path.join(build_dir, 'html', '_sources',
            'push_methods', 'directory_listing.json')
    listing_file = open(nested_level_listing, 'r')
    listing_file_contents = listing_file.readline()
    listing_file.close()
    listing_file_baseline = """{"directories": [".."], "files": ["push_methods.rst"]}"""
    compare_contents(listing_file_contents, listing_file_baseline)

test_json_directory_listing_output()


print('Starting up the testing web server...')
os.chdir(os.path.join(build_dir, 'html'))
def serve_on_port(port):
    handler = server.SimpleHTTPRequestHandler
    httpd = TCPServer(("localhost", options.port), handler)
    httpd.serve_forever()
httpd_process = multiprocessing.Process(target=serve_on_port, args=[options.port])
httpd_process.start()

# Run the javascript tests with phantomjs if available.
testing_results = 0
try:
    print("phantomjs version:")
    return_code = subprocess.call([options.phantomjs, '--version'])
    if return_code != 0:
        print("\nCould not execute phantomjs.  Skipping automated JavaScript tests.")
    else:
        testing_results = subprocess.call([options.phantomjs,
            os.path.join(source_dir, '..', 'test', 'phantomjs_test.js'),
            'http://localhost:' + str(options.port) + '/_edit_index.html'])
        print("")
except OSError:
    print("Could not execute phantomjs.  Skipping automated JavaScript tests.")


if options.linger:
    print('Point your browser to http://localhost:' + str(options.port) + '/')
    raw_input('Press any key to shutdown the webserver.')

print('Shutting down the testing web server...')
httpd_process.terminate()

# Exit success
sys.exit(testing_results)
