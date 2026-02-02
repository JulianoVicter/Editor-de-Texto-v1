import json
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render, redirect
from django.views.decorators.http import require_POST
from .models import Document
from django.http import HttpResponse



def doc_list(request):
    print("DOC_LIST VIEW CHAMADA")
    docs = Document.objects.all().order_by("-updated_at")
    return render(request, "editor/doc_list.html", {"docs": docs})


def doc_create(request):
    doc = Document.objects.create(title="Novo documento")
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
