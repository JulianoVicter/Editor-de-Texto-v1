from django.urls import path
from . import views

urlpatterns = [
    path("", views.doc_list, name="doc_list"),
    path("keyboard/", views.keyboard_editor, name="keyboard_editor"),
    path("new/", views.doc_create, name="doc_create"),
    path("<int:doc_id>/", views.doc_edit, name="doc_edit"),
    path("<int:doc_id>/delete/", views.doc_delete, name="doc_delete"),
    path("<int:doc_id>/save/", views.doc_save, name="doc_save"),
]
