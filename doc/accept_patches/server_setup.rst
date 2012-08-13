
.. _server_setup:

==========================
Setting up the WSGI server
==========================

Any server software that supports the `WSGI standard`_ can be used to host the
vcwebedit web application used to accept patches.  For reference, example server
software stacks and configurations are provided here.  Easy setup is possible
with a Linux server on the `Rackspace OpenStack`_ or the `Amazon EC2`_ cloud,
for example.

Gunicorn and Nginx
------------------

Gunicorn_ is a Python WSGI server for UNIX that is simple, light on resources,
and fast.  `Gunicorn installation`_ is described well on their website.  For a
Debian, a configuration file at */etc/gunicorn.d/vcwebedit* could be

.. literalinclude:: vcwebedit.gunicorn

.. todo:: insert something about async workers

The Gunicorn WSGI server should be coupled with an Nginx_ proxy server.  An
`example Nginx configuration`_ can also be found on the Gunicorn website.
Again, on a stock Debian system, the following example configuration could live in
*/etc/nginx/sites-available/vcwebedit* with a symlink at
*/etc/nginx/sites-enabled/vcwebedit*

.. literalinclude:: vcwebedit.nginx


.. _Amazon EC2: http://aws.amazon.com/ec2/
.. _example Nginx configuration: http://gunicorn.org/deploy.html
.. _Rackspace OpenStack: http://www.rackspace.com/cloud/public/servers/
.. _Gunicorn: http://gunicorn.org/
.. _Gunicorn installation: http://gunicorn.org/install.html
.. _Nginx: http://nginx.org/
.. _WSGI standard: http://www.python.org/dev/peps/pep-3333/
