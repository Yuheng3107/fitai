from django.db import models

# Create your models here.

<<<<<<< HEAD

=======
>>>>>>> a92f66c257841abf52bdcc4b10f42ab9e78ae86b
class Achievement(models.Model):

    name = models.CharField(max_length=100)
    description = models.CharField(max_length=100)
    image = models.ImageField()

    def __str__(self):
        return self.name
<<<<<<< HEAD

=======
>>>>>>> a92f66c257841abf52bdcc4b10f42ab9e78ae86b
