
import urllib.request

from django.conf import settings
from django.http import HttpResponse
from django.template import engines
from django.views.generic import TemplateView

def catchall_dev(request, upstream='http://localhost:3000'):
    upstream_url = upstream + request.path
    with urllib.request.urlopen(upstream_url) as response:
        content_type = response.headers.get('Content-Type')

        if content_type == 'text/html; charset=UTF-8':
            response_text = response.read().decode()
            content = engines['django'].from_string(response_text).render()
        else:
            content = response.read()

        return HttpResponse(
            content,
            content_type=content_type,
            status=response.status,
            reason=response.reason,
        )

catchall_prod = TemplateView.as_view(template_name='index.html')

catchall = catchall_dev if settings.DEBUG else catchall_prod