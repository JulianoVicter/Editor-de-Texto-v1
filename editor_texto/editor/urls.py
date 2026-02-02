from django.urls import path
from . import views

urlpatterns = [
    path("", views.doc_list, name="doc_list"),
    path("new/", views.doc_create, name="doc_create"),
    path("<int:doc_id>/", views.doc_edit, name="doc_edit"),
    path("<int:doc_id>/save/", views.doc_save, name="doc_save"),
]
