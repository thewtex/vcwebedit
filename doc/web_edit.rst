==============
Online editing
==============
How to use the browser based editing system
===========================================

Working with the editor on *localhost*
--------------------------------------

If you are using the editor on files from your local machine, the editor may be
unable to perform the AJAX load of local sources because *file://* requests have
a null origin for the purposes of the `Same Origin Policy`_.

To get around this, you can start a web server locally.  For instance, *cd* to
the build directory, then run::

  python -m SimpleHTTPServer

and point your browser to *http://localhost:8000*.  Alteratively, if you are
using chromium, start it with the flag::

  chromium --allow-file-access-from-files


.. _Same Origin Policy: http://en.wikipedia.org/wiki/Same_origin_policy
