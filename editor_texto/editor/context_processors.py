from .i18n import LANGUAGE_OPTIONS, get_language


def language_context(request):
    return {
        "lang_code": get_language(request),
        "language_options": LANGUAGE_OPTIONS,
    }
