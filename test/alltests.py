#!/usr/bin/env python

"""Build the documentation, and run the JavaScript tests."""

import sphinx.cmdline

import os
import sys

# Build the documentation for vcwebedit.
source_dir = os.path.join(os.path.abspath(os.path.dirname(__file__)), '..', 'doc')
build_dir = os.path.join(source_dir, '_build')
# Build html, warning treated as errors, output the doctrees to
# build_dir/doctrees.
sphinx_argv = ['sphinx-build',
    '-b', 'html',
    '-W',
    '-d', os.path.join(build_dir, 'doctrees'),
    source_dir, build_dir]
print("Building vcwebedit documentation with:\n")
print(' '.join(sphinx_argv))
build_result = sphinx.cmdline.main(sphinx_argv)
if build_result:
    sys.stderr.write("sphinx-build failed.\n")
    sys.exit(build_result)
else:
    print("sphinx-build succeeded!")

# Exit success
sys.exit(0)
