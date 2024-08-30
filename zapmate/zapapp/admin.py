from django.contrib import admin
from .models import *
# Register your models here.
admin.site.register(CustomUser)
admin.site.register(Like)
admin.site.register(Follows)
admin.site.register(TimeCapsule)
admin.site.register(ZapTriggers)
admin.site.register(Profile)
admin.site.register(Comment)