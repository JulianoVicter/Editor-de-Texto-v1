SUPPORTED_LANGUAGES = ("en", "pt-br", "es")
DEFAULT_LANGUAGE = "en"

LANGUAGE_OPTIONS = [
    ("en", "English"),
    ("pt-br", "Portugues (BR)"),
    ("es", "Espanol"),
]

TRANSLATIONS = {
    "en": {
        "APP_BRAND": "Editor",
        "LANGUAGE": "Language",
        "LIST_TITLE": "Documents",
        "EYEBROW": "Text Editor",
        "HERO_TITLE": "Archaic and Ancient Greek.",
        "HERO_SUBHEAD": "Create, edit and track everything in one place.",
        "NEW_DOCUMENT": "+ New document",
        "DOC_SHORT": "document(s)",
        "LATEST_EDITS": "Latest edits",
        "NO_DOCS_YET": "No documents here yet.",
        "DOCUMENTS": "Documents",
        "CREATE_NEW": "Create new",
        "CLICK_TO_EDIT": "Click to edit",
        "DELETE": "Delete",
        "START_FIRST_DOCUMENT": "Start with your first document",
        "USE_BUTTON_CREATE": "Use the button above to create a new file.",
        "BACK": "Voltar",
        "DOCUMENT": "Document",
        "READY": "Ready",
        "SAVE": "Save",
        "TITLE": "Title",
        "TITLE_PLACEHOLDER": "Document title",
        "VIRTUAL_KEYBOARD": "Virtual Keyboard",
        "TOGGLE_LATIN": "Latin",
        "TOGGLE_GREEK": "Greek",
        "KEYBOARD_TIP": "Tip: The virtual keyboard is always active on screen. Click the keys below, use the Latin/Greek button to switch layouts, or type Greek with Alt + letter on your physical keyboard.",
        "CONVERSION_TITLE": "Conversion to Archaic Greek",
        "CONVERSION_DESC": "The conversion is character-only and does not change words or punctuation.",
        "ORIGINAL_TEXT": "Original text",
        "ORIGINAL_PLACEHOLDER": "Paste or write your text...",
        "CONVERTED_TEXT": "Converted text",
        "SAVING": "Saving...",
        "SAVE_ERROR": "Save failed.",
        "SAVED": "Saved",
    },
    "pt-br": {
        "APP_BRAND": "Editor",
        "LANGUAGE": "Idioma",
        "LIST_TITLE": "Documentos",
        "EYEBROW": "Editor de Texto",
        "HERO_TITLE": "Grego Arcaico e Antigo.",
        "HERO_SUBHEAD": "Crie, edite e acompanhe tudo em um so lugar.",
        "NEW_DOCUMENT": "+ Novo documento",
        "DOC_SHORT": "documento(s)",
        "LATEST_EDITS": "Ultimas edicoes",
        "NO_DOCS_YET": "Nenhum documento por aqui ainda.",
        "DOCUMENTS": "Documentos",
        "CREATE_NEW": "Criar novo",
        "CLICK_TO_EDIT": "Clique para editar",
        "DELETE": "Excluir",
        "START_FIRST_DOCUMENT": "Comece pelo primeiro documento",
        "USE_BUTTON_CREATE": "Use o botao acima para criar um novo arquivo.",
        "BACK": "Voltar",
        "DOCUMENT": "Documento",
        "READY": "Pronto",
        "SAVE": "Salvar",
        "TITLE": "Titulo",
        "TITLE_PLACEHOLDER": "Titulo do documento",
        "VIRTUAL_KEYBOARD": "Teclado Virtual",
        "TOGGLE_LATIN": "Latin",
        "TOGGLE_GREEK": "Grego",
        "KEYBOARD_TIP": "Dica: o teclado virtual esta sempre ativo na tela. Clique nas teclas abaixo, use o botao Latin/Grego para trocar o layout ou digite grego com Alt + letra no teclado fisico.",
        "CONVERSION_TITLE": "Conversao para Grego Arcaico",
        "CONVERSION_DESC": "A conversao e apenas de caracteres, sem alterar palavras ou pontuacao.",
        "ORIGINAL_TEXT": "Texto original",
        "ORIGINAL_PLACEHOLDER": "Cole ou escreva o texto...",
        "CONVERTED_TEXT": "Texto convertido",
        "SAVING": "Salvando...",
        "SAVE_ERROR": "Erro ao salvar.",
        "SAVED": "Salvo",
    },
    "es": {
        "APP_BRAND": "Editor",
        "LANGUAGE": "Idioma",
        "LIST_TITLE": "Documentos",
        "EYEBROW": "Editor de Texto",
        "HERO_TITLE": "Griego Arcaico y Antiguo.",
        "HERO_SUBHEAD": "Crea, edita y sigue todo en un solo lugar.",
        "NEW_DOCUMENT": "+ Nuevo documento",
        "DOC_SHORT": "documento(s)",
        "LATEST_EDITS": "Ultimas ediciones",
        "NO_DOCS_YET": "Aun no hay documentos.",
        "DOCUMENTS": "Documentos",
        "CREATE_NEW": "Crear nuevo",
        "CLICK_TO_EDIT": "Haz clic para editar",
        "DELETE": "Eliminar",
        "START_FIRST_DOCUMENT": "Empieza con tu primer documento",
        "USE_BUTTON_CREATE": "Usa el boton de arriba para crear un archivo nuevo.",
        "BACK": "Atras",
        "DOCUMENT": "Documento",
        "READY": "Listo",
        "SAVE": "Guardar",
        "TITLE": "Titulo",
        "TITLE_PLACEHOLDER": "Titulo del documento",
        "VIRTUAL_KEYBOARD": "Teclado Virtual",
        "TOGGLE_LATIN": "Latin",
        "TOGGLE_GREEK": "Griego",
        "KEYBOARD_TIP": "Tip: el teclado virtual siempre esta activo en pantalla. Haz clic en las teclas, usa el boton Latin/Griego para cambiar el layout o escribe griego con Alt + letra en tu teclado fisico.",
        "CONVERSION_TITLE": "Conversion a Griego Arcaico",
        "CONVERSION_DESC": "La conversion solo cambia caracteres y no altera palabras ni puntuacion.",
        "ORIGINAL_TEXT": "Texto original",
        "ORIGINAL_PLACEHOLDER": "Pega o escribe el texto...",
        "CONVERTED_TEXT": "Texto convertido",
        "SAVING": "Guardando...",
        "SAVE_ERROR": "Error al guardar.",
        "SAVED": "Guardado",
    },
}


def normalize_language(code: str | None) -> str:
    if not code:
        return DEFAULT_LANGUAGE
    code = code.strip().lower()
    return code if code in SUPPORTED_LANGUAGES else DEFAULT_LANGUAGE


def get_language(request) -> str:
    return normalize_language(request.session.get("lang"))


def set_language(request, code: str) -> str:
    lang = normalize_language(code)
    request.session["lang"] = lang
    return lang


def translate(request, key: str) -> str:
    lang = get_language(request)
    return TRANSLATIONS.get(lang, {}).get(key) or TRANSLATIONS[DEFAULT_LANGUAGE].get(key, key)
