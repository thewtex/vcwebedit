from docutils import nodes
from sphinx.util.compat import Directive


def mark_all_editable(app, doctree, docname):
    """If the `vcwebedit_all_editable` config entry is True, mark all documents
    as editable that do have an *editable* file-wide metadata entry."""
    env = doctree.settings.env
    meta = env.metadata[docname]
    if meta.has_key('editable'):
        val = meta['editable']
        if isinstance(val, basestring):
            meta['editable'] = val.lower() in ('true', '1', 'yes', 'on')
    else:
        all_editable = app.config.vcwebedit_all_editable
        meta['editable'] = all_editable

def purge_editable(app, env, docname):
    """Reset the editable metadata."""
    meta = env.metadata[docname]
    if meta.has_key('editable'):
        meta.pop('editable')

def setup(app):
    app.add_config_value('vcwebedit_all_editable', False, True)
    app.connect('doctree-resolved', mark_all_editable)
    app.connect('env-purge-doc', purge_editable)
