from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from datetime import datetime, timedelta
from django.db.models import Q
from django.db.models import Count
import random
from django.db.models.functions import Random
from django.http import Http404
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import *
from .serializers import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .permissions import IsNotSuperuserOrStaff
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from django.http import JsonResponse
from django.db.models.signals import post_save
from django.dispatch import receiver


def are_friends(user_id_1, user_id_2):
    if Follows.objects.filter(user_id=user_id_1, follows_id=user_id_2).exists() and Follows.objects.filter(user_id=user_id_2, follows_id=user_id_1).exists():
        return True
    else:
        return False

# Create a users list
class UserListCreateView(generics.ListCreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated, IsAdminUser | IsNotSuperuserOrStaff]


class UserRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated, IsAdminUser | IsNotSuperuserOrStaff]

    def get_queryset(self):
        queryset = CustomUser.objects.filter(id=self.request.user.id)
        return queryset

# Sign Up/Register
class UserRegistrationView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserRegistrationSerializer

# User Login
class UserLoginView(TokenObtainPairView):
    serializer_class = CustomUserLoginSerializer


class UserRefreshView(TokenRefreshView):
    serializer_class = CustomUserRefreshSerializer

# views.py


class ProfileListCreateView(generics.ListCreateAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.request.user.id
        return Profile.objects.filter(user_id=user_id)

    def perform_create(self, serializer):
        user_id = self.request.user.id
        serializer.save(user_id=user_id)


class ProfileUpdateView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user_id = self.request.user.id
        if not user_id:
            raise PermissionDenied('User ID not found in token.')
        try:
            profile = Profile.objects.get(user_id=user_id)
        except Profile.DoesNotExist:
            raise ('Profile not found.')
        return profile

    def perform_update(self, serializer):
        user_id = self.request.user.id
        if not user_id:
            raise PermissionDenied('User ID not found in token.')
        user_model = get_user_model()
        user = user_model.objects.get(id=user_id)
        user.first_name = self.request.data.get('first_name', user.first_name)
        user.last_name = self.request.data.get('last_name', user.last_name)
        user.email = self.request.data.get('email', user.email)
        user.username = self.request.data.get('username', user.username)
        user.save()
        serializer.save(user_id=user_id)

    def perform_destroy(self, instance):
        user_id = self.request.user.id
        if not user_id:
            raise PermissionDenied('User ID not found in token.')
        if instance.user_id != user_id:
            raise PermissionDenied(
                'You do not have permission to delete this profile.')
        instance.delete()


class TimeCapsuleListCreateView(generics.ListCreateAPIView):
    serializer_class = TimeCapsuleSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user_id = request.user.id
        now = timezone.now()
        posted_capsules = TimeCapsule.objects.filter(
            user_id=user_id, available_date__lte=now).order_by('-publish_date')
        upcoming_capsules = TimeCapsule.objects.filter(
            user_id=user_id, available_date__gt=now).order_by('-publish_date')
        posted_serializer = TimeCapsuleSerializer(
            posted_capsules, many=True, context={'request': request})
        upcoming_serializer = TimeCapsuleSerializer(
            upcoming_capsules, many=True, context={'request': request})
        data = {
            'posted': posted_serializer.data,
            'upcoming': upcoming_serializer.data
        }
        print(data)
        return Response(data)

    def perform_create(self, serializer):
        hashtags = self.request.POST.get('hashtags')
        hashtags = hashtags.split(',')
        user_id = self.request.user.id
        serializer.save(user_id=user_id, hashtags=hashtags)

#decorator used to notify all users 
@receiver(post_save, sender=TimeCapsule)
def send_notification_to_followers(sender, instance, created, **kwargs):
    if created:
        user_id = instance.user_id
        followers = Follows.objects.filter(follows=user_id)
        for follower in followers:
            zap_trigger = ZapTriggers(userby=instance.user, userfor=follower.user,
                                      message=f"New time capsule created by {instance.user.username}: {instance.title} 💊")
            zap_trigger.save()


class CommentListCreateView(generics.ListCreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['timecapsule_id']

    def perform_create(self, serializer):
        user_id = self.request.user.id
        serializer.save(user_id=user_id)


@receiver(post_save, sender=Comment)
def send_notification_to_owner(sender, instance, created, **kwargs):
    if created:
        time_capsule = instance.timecapsule
        owner = time_capsule.user
        zap_trigger = ZapTriggers(userby=instance.user, userfor=owner,
                                  message=f"New comment posted on your time capsule by {instance.user.username}: {instance.comment} 🗨️")
        zap_trigger.save()


class CommentRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]
    queryset = Comment.objects.all()


class LikeListCreateView(generics.ListCreateAPIView):
    serializer_class = LikeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.request.user.id
        return Like.objects.filter(user_id=user_id)

    def perform_create(self, serializer):
        user_id = self.request.user.id
        serializer.save(user_id=user_id)


@receiver(post_save, sender=Like)
def send_notification_to_owner(sender, instance, created, **kwargs):
    if created:
        time_capsule = instance.timecapsule
        owner = time_capsule.user
        zap_trigger = ZapTriggers(userby=instance.user, userfor=owner,
                                  message=f"Your time capsule '{time_capsule.title}' was liked by {instance.user.username}. ❤️")
        zap_trigger.save()


class LikeRetrieveDestroyView(generics.RetrieveDestroyAPIView):
    serializer_class = LikeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.request.user.id
        return Like.objects.filter(user=user_id)

    def perform_destroy(self, instance):
        user_id = self.request.user.id
        print(user_id)
        if instance.user_id != user_id:
            raise PermissionDenied(
                'You do not have permission to delete this like.')
        instance.delete()


class FollowsListCreateView(generics.ListCreateAPIView):
    serializer_class = FollowsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.request.user.id
        return Follows.objects.filter(user_id=user_id)

    def perform_create(self, serializer):
        user_id = self.request.user.id
        serializer.save(user_id=user_id)


@receiver(post_save, sender=Follows)
def send_notification_to_followed_user(sender, instance, created, **kwargs):
    if created:
        user_id = CustomUser.objects.get(id=instance.follows_id)
        follower = instance.user
        zap_trigger = ZapTriggers(userby=follower, userfor=user_id,
                                  message=f"You have a new follower: {follower.username} 🤝")
        zap_trigger.save()


class FollowsRetrieveDestroyView(generics.RetrieveDestroyAPIView):
    serializer_class = FollowsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.request.user.id
        return Follows.objects.filter(user=user_id)

    def perform_destroy(self, instance):
        user_id = self.request.user.id
        if instance.user_id != user_id:
            raise PermissionDenied(
                'You do not have permission to delete this follow.')
        instance.delete()


class TotalFollowersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = request.user.id
        total_followers = Follows.objects.filter(follows=user_id).count()
        return JsonResponse({"totalfollowers": total_followers})


class ExploreView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TimeCapsuleSerializer
    queryset = TimeCapsule.objects.filter(is_private=False, available_date__lte=timezone.now(
    )).order_by(Random())
    search_fields = ['hashtags', 'content', 'title']


class SearchView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProfileSerializer
    search_fields = ['user__username', 'user__first_name', 'user__last_name']
    def get_queryset(self):
        queryset = Profile.objects.all()
        user_id = self.request.user.id
        if user_id:
            queryset = queryset.exclude(user_id=user_id)
        return queryset


class UserView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProfileSerializer

    def get_object(self):
        try:
            return Profile.objects.get(user__username=self.request.query_params.get('username'))
        except Profile.DoesNotExist:
            raise Http404("Profile does not exist")


class UserTimeCapsuleView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TimeCapsuleSerializer

    def get_queryset(self):
        # Get the user whose time capsules are being viewed
        username = self.request.query_params.get('username')
        user_time_capsules = TimeCapsule.objects.filter(
            user__username=username)

        # Check if the authenticated user is friends with the user whose time capsules are being viewed
        is_friend = are_friends(self.request.user.id,
                                user_time_capsules.first().user.id)

        # Filter the time capsules based on the friendship status and privacy settings
        if is_friend:
            time_capsules = user_time_capsules.filter().order_by('-publish_date')
        else:
            time_capsules = user_time_capsules.filter(is_private=False).order_by('-publish_date')

        return time_capsules

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        # Separate the time capsules based on the available date
        posted_capsules = queryset.filter(
            available_date__lte=timezone.now())
        upcoming_capsules = queryset.filter(
            available_date__gt=timezone.now())
        print(posted_capsules)

        # Serialize the time capsules and return a JSON response
        posted_serializer = TimeCapsuleSerializer(
            posted_capsules, many=True, context={'request': request})
        upcoming_serializer = TimeCapsuleSerializer(
            upcoming_capsules, many=True, context={'request': request})
        data = {
            'posted': posted_serializer.data,
            'upcoming': upcoming_serializer.data
        }

        return Response(data)


class UserFollows(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = request.user.id
        userviewing = CustomUser.objects.get(
            username=request.GET.get('username'))
        if Follows.objects.filter(user=user_id, follows=userviewing).exists():
            return JsonResponse({"follows": True})
        else:
            return JsonResponse({"follows": False})

    def post(self, request):
        user_id = request.user.id
        userviewing = CustomUser.objects.get(
            username=request.GET.get('username'))
        Follows.objects.create(user_id=user_id, follows=userviewing)
        return JsonResponse({"follows": True})

    def delete(self, request):
        user_id = request.user.id
        userviewing = CustomUser.objects.get(
            username=request.GET.get('username'))
        Follows.objects.filter(user=user_id, follows=userviewing).delete()
        return JsonResponse({"follows": False})


class HomeView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = HomeCapsuleSerializer

    def get_queryset(self):
        user_id = self.request.user.id
        follows = Follows.objects.filter(user=user_id)
        follows_list = []
        for follow in follows:
            follows_list.append(follow.follows)
        public_capsules = TimeCapsule.objects.filter(is_private=False, available_date__lte=timezone.now(
        )).exclude(user=user_id)
        private_capsules = TimeCapsule.objects.filter(is_private=True, available_date__lte=timezone.now(
        ), user__in=follows_list)
        friend_capsules = []
        for capsule in private_capsules:
            if are_friends(user_id, capsule.user_id):
                friend_capsules.append(capsule)
        friend_capsules = [obj.id for obj in friend_capsules]
        return TimeCapsule.objects.filter(Q(user__in=follows_list) | Q(id__in=public_capsules.values('id')) | Q(id__in=friend_capsules), available_date__lte=timezone.now()).order_by('-publish_date')


class HomeHashtagsView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        hashtags = TimeCapsule.objects.filter(is_private=False, available_date__lte=timezone.now(
        )).values_list('hashtags', flat=True)
        hashtags_list = []
        for capsule_hashtags in hashtags:
            for hashtag in capsule_hashtags:
                if hashtag not in hashtags_list:
                    hashtags_list.append(hashtag)
        hashtags_list_with_count = []
        for hashtag in hashtags_list:
            total_count = TimeCapsule.objects.filter(is_private=False, available_date__lte=timezone.now(
            ), hashtags__contains=[hashtag]).count()
            hashtags_list_with_count.append(
                {'name': hashtag, 'total': total_count})
        random.shuffle(hashtags_list_with_count)
        follows_list = Follows.objects.filter(
            user=request.user.id).values_list('follows', flat=True)
        suggested_people = CustomUser.objects.exclude(
            id=request.user.id).exclude(id__in=follows_list).order_by('?')[:5]
        print(suggested_people)
        suggested_people_list = []
        for person in suggested_people:
            profile = Profile.objects.get(user_id=person.id)
            print(profile)
            suggested_people_list.append({'username': person.username, 'pfp': request.build_absolute_uri(
                profile.profile_picture.url) if profile.profile_picture else ""})
        return JsonResponse({"hashtags": hashtags_list_with_count[:5], "suggested_people": suggested_people_list})


class ZaptriggerView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ZapTriggerSerializer

    def get_queryset(self):
        user_id = self.request.user.id
        return ZapTriggers.objects.filter(userfor=user_id).order_by('-trigger_date')
    
class FutureCapsules(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TimeCapsuleSerializer

    def get_queryset(self):
        user_id = self.request.user.id
        return TimeCapsule.objects.filter(is_private=False, available_date__gt=timezone.now(
        )).exclude(user=user_id).order_by('-publish_date')
    search_fields = ['hashtags', 'content', 'title']
    
