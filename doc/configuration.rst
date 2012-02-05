:tocdepth: 3
:editable: True

===================
Configure vcwebedit
===================
How to configure your Sphinx project to use vcwebedit
=====================================================

.. index:: install

Install the extension
---------------------

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

Configuration
-------------

Custom templates used for creating links in the sidebar to go to the editing
page, and for the edit page itself.  For Sphinx to see these templates, they
should be added to the `templates_path` `conf.py` configuration entry::

  template_path = ['_templates', 'ext/vcwebedit/templates']

The the location of the editting link in the sidebar is controlled by position
at which the *editlink.html* entry appears the `html_sidebars`_ configuration
entry::

  html_sidebars = {
      '**': ['localtoc.html', 'relations.html', 'editlink.html', 'searchbox.html']
      }

Note that using the glob key entry for `html_sidebars`_ is one way to configure
which pages are editable.

To make all documents editable, set the `vcwebedit_all_editable` entry in your
`conf.py` to `True` (defaults to `False`)::

  vcwebedit_all_editable = False

The `html_copy_source` configuration entry must be set to `True` (the default).


.. index:: editable

Mark documents as editable
--------------------------

There are three ways to control which pages are editable,

1. The `editable` `file-wide metadata`_ entry.
2. The presence/absence of *editlink.html* in the `html_sidebars`_ configuration entry.
3. The global `vcwebedit_all_editable` configuration entry.

By default, no files are assumed to be editable.  The `editable` file-wide
metadata entry should have a boolean value like *True* or *False*.


.. _Git submodule:      http://book.git-scm.com/5_submodules.html
.. _html_sidebars:      http://sphinx.pocoo.org/config.html?highlight=html_sidebars#confval-html_sidebars
.. _file-wide metadata: http://sphinx.pocoo.org/markup/misc.html#file-wide-metadata
