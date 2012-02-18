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
    if env.metadata.has_key(docname):
        meta = env.metadata[docname]
        if meta.has_key('editable'):
            meta.pop('editable')


def page_to_editpage(page):
    """Translate a page name to its edit page name.  If it already is the edit
    page, return the original page name."""
    if page.find('/') != -1:
        page_split = page.rsplit('/')
        if len(page_split[0]) > 6 and page_split[1][:6] == '_edit_':
            new_page = page_split[0] + '/' + page_split[1][6:]
        else:
            new_page = page_split[0] + '/_edit_' + page_split[1]
    else:
        if len(page) > 6 and page[:6] == '_edit_':
            new_page = page[6:]
        else:
            new_page = '_edit_' + page
    return new_page

def add_editpage_to_context(app, pagename, templatename, context, doctree):
    """Add the editpage name to the HTML template context."""
    context['editpagename'] = page_to_editpage(pagename)


def collect_edit_pages(app):
    """Add the edit pages to the HTML pages that will be rendered."""
    env = app.builder.env
    for page, meta in env.metadata.iteritems():
        if meta.has_key('editable') and meta['editable']:
            new_page = page_to_editpage(page)
            context = app.builder.get_doc_context(page, 'unused', '')
            # Prevent the HTMLBuilder from attempting to copy the source.
            context['editsourcename'] = context['sourcename']
            context.pop('sourcename')
            yield (new_page, context, 'edit.html')


def setup(app):
    app.add_config_value('vcwebedit_all_editable', True, True)
    app.connect('doctree-resolved', mark_all_editable)
    app.connect('env-purge-doc', purge_editable)
    app.connect('html-collect-pages', collect_edit_pages)
    app.connect('html-page-context', add_editpage_to_context)
