===================
Configure vcwebedit
===================
How to configure your Sphinx project to use vcwebedit
=====================================================

.. index:: install

Install the vcwebedit extension
-------------------------------

If you Sphinx documentation is stored under the *doc* directory in a Git
repository, the vcwebedit can be added as a `Git submodule`_::

  mkdir doc/ext
  git submodule add -- git://github.com/thewtex/vcwebedit.git doc/ext/vcwebedit

In your *conf.py*, add the extension location to the `sys.path` and the list of
enabled extensions::

  ...
  sys.path.insert(0, os.path.abspath('ext/vcwebedit'))
  ...
  extensions = ['vcwebedit']


.. _Git submodule:  http://book.git-scm.com/5_submodules.html
