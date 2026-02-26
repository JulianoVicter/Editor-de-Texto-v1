import json

from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render, redirect
from django.urls import reverse
from django.utils.http import url_has_allowed_host_and_scheme
from django.views.decorators.http import require_POST

from .i18n import set_language
from .models import Document


def doc_list(request):
    docs = Document.objects.all().order_by("-updated_at")
    return render(request, "editor/doc_list.html", {"docs": docs})


def keyboard_editor(request):
    return render(request, "editor/keyboard_editor.html")


def doc_create(request):
    doc = Document.objects.create(title="New document")
    return redirect("doc_edit", doc_id=doc.id)


def doc_edit(request, doc_id):
    doc = get_object_or_404(Document, id=doc_id)
    return render(request, "editor/doc_edit.html", {"doc": doc})


@require_POST
def doc_delete(request, doc_id):
    doc = get_object_or_404(Document, id=doc_id)
    doc.delete()
    return redirect("doc_list")


@require_POST
def doc_save(request, doc_id):
    doc = get_object_or_404(Document, id=doc_id)
    payload = json.loads(request.body.decode("utf-8"))

    doc.title = payload.get("title", doc.title)[:200]
    doc.content = payload.get("content", "")
    doc.save(update_fields=["title", "content", "updated_at"])

    return JsonResponse({"ok": True})


@require_POST
def change_language(request):
    chosen = request.POST.get("lang", "en")
    set_language(request, chosen)

    target = request.POST.get("next") or reverse("doc_list")
    if url_has_allowed_host_and_scheme(target, allowed_hosts={request.get_host()}, require_https=request.is_secure()):
        return redirect(target)
    return redirect("doc_list")
