from django import template
from editor.i18n import translate

register = template.Library()


@register.simple_tag
def tr(request, key):
    return translate(request, key)
