from rest_framework import serializers
from .models import *
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from drf_dynamic_fields import DynamicFieldsMixin
import json


class CustomUserSerializer(serializers.ModelSerializer):
    old_password = serializers.CharField(write_only=True, required=False)
    new_password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'first_name', 'last_name', 'username',
                  'date_joined', 'is_active', 'is_staff', 'old_password', 'new_password')
        read_only_fields = ('id', 'date_joined', 'is_staff')

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

    def update(self, instance, validated_data):
        print(validated_data)
        old_password = validated_data.pop('old_password', None)
        new_password = validated_data.pop('new_password', None)
        print(old_password, new_password)

        if old_password is not None and new_password is not None:
            if instance.check_password(old_password):
                instance.set_password(new_password)
            else:
                raise serializers.ValidationError("Old password is incorrect")

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance


class CustomUserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('email', 'password', 'first_name', 'last_name', 'username')

    def create(self, validated_data):
        password = validated_data.pop('password')
        instance = self.Meta.model(**validated_data)
        instance.set_password(password)
        instance.save()
        Profile.objects.create(user=instance)
        return instance


class CustomUserLoginSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        if isinstance(user, CustomUser):
            token['username'] = user.username
            token['user_id'] = user.id

        return token


class CustomUserRefreshSerializer(TokenRefreshSerializer):
    def validate(self, attrs):
        refresh = RefreshToken(attrs['refresh'])
        data = {'access': str(refresh.access_token)}

        # Assuming that the refresh token contains the user information.
        user = CustomUser.objects.get(id=refresh.payload['user_id'])

        if user:
            data['username'] = user.username
            data['user_id'] = user.id

        return data


class ProfileSerializer(DynamicFieldsMixin, serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    totalfollowers = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ('bio', 'profile_picture', 'username', 'totalfollowers')

    def to_representation(self, instance):
        if self.context['request'].method == 'GET':
            self.fields['username'].read_only = False
            self.fields['first_name'] = serializers.SerializerMethodField()
            self.fields['last_name'] = serializers.SerializerMethodField()
            self.fields['email'] = serializers.SerializerMethodField()
            self.fields['total_capsules'] = serializers.SerializerMethodField()
        return super().to_representation(instance)

    def get_first_name(self, obj):
        user = CustomUser.objects.get(id=obj.user_id)
        return user.first_name

    def get_last_name(self, obj):
        user = CustomUser.objects.get(id=obj.user_id)
        return user.last_name

    def get_email(self, obj):
        user = CustomUser.objects.get(id=obj.user_id)
        return user.email

    def get_total_capsules(self, obj):
        user = CustomUser.objects.get(id=obj.user_id)
        return TimeCapsule.objects.filter(user=user).count()

    def get_totalfollowers(self, obj):
        user = CustomUser.objects.get(id=obj.user_id)
        return Follows.objects.filter(follows=user).count()


class TimeCapsuleSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    total_likes = serializers.SerializerMethodField()
    total_comments = serializers.SerializerMethodField()
    liked = serializers.SerializerMethodField()
    pfp = serializers.SerializerMethodField()

    class Meta:
        model = TimeCapsule
        fields = ['id', 'username', 'title', 'content', 'publish_date', 'available_date','pfp',
                  'image', 'is_available', 'hashtags', 'is_private', 'total_likes', 'total_comments','liked']
        read_only_fields = ['publish_date', 'is_available']

    def get_total_likes(self, obj):
        return Like.objects.filter(timecapsule=obj).count()

    def get_total_comments(self, obj):
        return Comment.objects.filter(timecapsule=obj).count()
    def get_liked(self, obj):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            user = request.user
            if user.is_authenticated:
                try:
                    return Like.objects.get(user=user, timecapsule=obj).id

                except Like.DoesNotExist:
                    pass
        return False
    def get_pfp(self, obj):
        user = CustomUser.objects.get(id=obj.user_id)
        profile = Profile.objects.get(user=user)
        if profile.profile_picture:
            return self.context["request"].build_absolute_uri(profile.profile_picture.url)
        else:
            return None

class CommentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    pfp = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'username', 'timecapsule',
                  'comment', 'publish_date', 'pfp']
        read_only_fields = ['publish_date']

    def to_representation(self, instance):
        if self.context['request'].method == 'GET':
            self.fields['username'].read_only = False

        return super().to_representation(instance)

    def get_pfp(self, obj):
        user = CustomUser.objects.get(id=obj.user_id)
        profile = Profile.objects.get(user=user)
        if profile.profile_picture:
            return self.context["request"].build_absolute_uri(profile.profile_picture.url)
        else:
            return None


class LikeSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Like
        fields = ['id', 'username', 'timecapsule', 'publish_date']
        read_only_fields = ['publish_date']

    def to_representation(self, instance):
        if self.context['request'].method == 'GET':
            self.fields['username'].read_only = False

        return super().to_representation(instance)


class FollowsSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    follows_username = serializers.CharField(
        source='follows.username', read_only=True)

    class Meta:
        model = Follows
        fields = ['id', 'username', 'follows_username',
                  'follow_date', 'follows']
        read_only_fields = ['follow_date']

    def to_representation(self, instance):
        if self.context['request'].method == 'GET':
            self.fields['username'].read_only = False
            self.fields['follows_username'].read_only = False

        return super().to_representation(instance)


class HomeCapsuleSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    total_likes = serializers.SerializerMethodField()
    total_comments = serializers.SerializerMethodField()
    pfp = serializers.SerializerMethodField()
    comments = serializers.SerializerMethodField()
    liked = serializers.SerializerMethodField()

    class Meta:
        model = TimeCapsule
        fields = ['liked', 'id', 'username', 'title', 'content', 'publish_date', 'available_date', 'image',
                  'is_available', 'hashtags', 'is_private', 'total_likes', 'total_comments', 'pfp', 'comments']
        read_only_fields = ['publish_date', 'is_available']

    def get_total_likes(self, obj):
        return Like.objects.filter(timecapsule=obj).count()

    def get_total_comments(self, obj):
        return Comment.objects.filter(timecapsule=obj).count()

    def get_pfp(self, obj):
        user = CustomUser.objects.get(id=obj.user_id)
        profile = Profile.objects.get(user=user)
        if profile.profile_picture:
            return self.context["request"].build_absolute_uri(profile.profile_picture.url)
        else:
            return None

    def get_comments(self, obj):
        comments = Comment.objects.filter(timecapsule=obj)
        serializer = CommentSerializer(comments, many=True, context={
                                       'request': self.context.get('request')})
        return serializer.data

    def get_liked(self, obj):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            user = request.user
            if user.is_authenticated:
                try:
                    return Like.objects.get(user=user, timecapsule=obj).id

                except Like.DoesNotExist:
                    pass
        return False


class ZapTriggerSerializer(serializers.ModelSerializer):
    userbypfp = serializers.SerializerMethodField()
    username = serializers.CharField(source='userby.username', read_only=True)

    class Meta:
        model = ZapTriggers
        fields = ['username', 'message', 'trigger_date', 'userbypfp']
        read_only_fields = ['trigger_date', 'username', 'message', 'userbypfp']

    def get_userbypfp(self, obj):
        user = CustomUser.objects.get(id=obj.userby_id)
        profile = Profile.objects.get(user=user)
        if profile.profile_picture:
            return self.context["request"].build_absolute_uri(profile.profile_picture.url)
        else:
            return None
