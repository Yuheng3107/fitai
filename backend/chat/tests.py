from django.test import TestCase
from django.contrib.auth import get_user_model
from model_bakery import baker
from .models import ChatGroup, ChatMessage

class ChatGroupTest(TestCase):
    def test_create_chat_group(self):
        User = get_user_model()
        user = baker.make(User)
        name = 'test_group'
        ChatGroup.objects.create(
            name = name,
        )
        chat_group = ChatGroup.objects.get()
        chat_group.members.add(user)
        chat_group = ChatGroup.objects.get()
        self.assertEqual(chat_group.name,name)

        # many to many check
        for x in chat_group.members.all():
            self.assertEqual(x,user)
    
    def test_update_chat_group(self):
        chat_group = baker.make(ChatGroup)
        updated_name = "New Name"
        chat_group.name = updated_name
        chat_group.save()
        new_chat_group = ChatGroup.objects.get(pk=chat_group.id)
        self.assertEqual(new_chat_group.name, updated_name)

    def test_delete_chat_group(self):
        chat_group = baker.make(ChatGroup)
        ChatGroup.objects.get(pk=chat_group.id).delete()
        with self.assertRaises(ChatGroup.DoesNotExist):
            ChatGroup.objects.get(pk=chat_group.id)

    def test_delete_founder(self):
        """To test whether chat_group is not deleted after founder is deleted"""
        User = get_user_model()
        user = baker.make(User)
        chat_group = baker.make(ChatGroup,created_by=user)
        self.assertIsInstance(chat_group, ChatGroup)
        chat_group_id = chat_group.id
        User.objects.get(pk=user.id).delete()
        updated_chat_group =  ChatGroup.objects.get(pk=chat_group.id)
        self.assertEqual(updated_chat_group.id, chat_group_id)
        self.assertEqual(updated_chat_group.created_by, None)

class ChatMessageTest(TestCase):
    def test_create_chat_message(self):
        User = get_user_model()
        user = baker.make(User)
        group = baker.make(ChatGroup)
        text = 'test_message'
        ChatMessage.objects.create(
            sender = user,
            text = text,
            group = group
        )
        chat_message = ChatMessage.objects.get()
        self.assertEqual(chat_message.sender,user)
        self.assertEqual(chat_message.text,text)
        self.assertEqual(chat_message.group,group)
    
    def test_update_chat_message(self):
        chat_message = baker.make(ChatMessage)
        updated_text = "New Text"
        chat_message.text = updated_text
        chat_message.save()
        new_chat_message = ChatMessage.objects.get(pk=chat_message.id)
        self.assertEqual(new_chat_message.text, updated_text)

    def test_delete_chat_message(self):
        chat_message = baker.make(ChatMessage)
        ChatMessage.objects.get(pk=chat_message.id).delete()
        with self.assertRaises(ChatMessage.DoesNotExist):
            ChatMessage.objects.get(pk=chat_message.id)