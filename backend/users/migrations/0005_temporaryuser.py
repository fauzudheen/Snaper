# Generated by Django 5.1.2 on 2024-10-26 09:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_remove_image_album_delete_album'),
    ]

    operations = [
        migrations.CreateModel(
            name='TemporaryUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.EmailField(max_length=255, unique=True)),
                ('username', models.CharField(max_length=150)),
                ('password', models.CharField(max_length=128)),
                ('otp', models.CharField(max_length=6)),
                ('otp_created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
