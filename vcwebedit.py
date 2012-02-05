from docutils import nodes
from sphinx.util.compat import Directive


def process_vcwebedit(app, doctree, fromdocname):
    """ Process the vcwebedit nodes by adding web editting
    capabilities and removing the node to prevent further processing."""

    pass
    #for node in doctree.traverse(vcwebedit):

def setup(app):
    pass
    #app.add_node(vcwebedit)
    #app.add_directive('vcwebedit', VCWebEditDirective)
    #app.connect('doctree-resolved', process_vcwebedit)
