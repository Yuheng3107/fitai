from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
class Command(BaseCommand):
    help = """Sets the active state of all users to False
            Is supposed to be run once every day"""
            
    def handle(self, *args, **options):
        User = get_user_model()
        # Resets streak of everyone who was inactive
        User.objects.filter(active=False).update(streak=0)
        # Makes all users active status False
        User.objects.update(active=False)