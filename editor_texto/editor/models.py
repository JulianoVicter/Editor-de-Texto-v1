
# Create your models here.
from django.conf import settings
from django.db import models

class Document(models.Model):
    title = models.CharField(max_length=200, default="Sem título")
    content = models.TextField(blank=True, default="")  # pode ser HTML ou texto puro
    updated_at = models.DateTimeField(auto_now=True)
