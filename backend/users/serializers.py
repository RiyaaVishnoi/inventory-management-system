"""
Custom serializers for user registration and management.
"""

from djoser.serializers import UserCreateSerializer, UserSerializer
from rest_framework import serializers
from .models import User
from .utils import is_unitec_email, validate_unitec_id, get_approval_status_by_email


class CustomUserCreateSerializer(UserCreateSerializer):
    """
    Custom user creation serializer with automatic approval logic.
    """
    

    
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = (
            'email', 
            'password', 
            'first_name',
            'last_name',
            'unitec_id',
            'year_group',
            'graduation_date'
        )
        extra_kwargs = {
            'password': {'write_only': True},
            'first_name': {'required': True},
            'last_name': {'required': True},
        }
    
    def validate_unitec_id(self, value):
        """
        Validate Unitec ID format if provided.
        """
        if value and not validate_unitec_id(value):
            raise serializers.ValidationError(
                "Invalid Unitec student ID format. Please check your student ID."
            )
        return value
    
    def validate_email(self, value):
        """
        Validate email and set Unitec email flag.
        """
        if not value:
            raise serializers.ValidationError("Email is required.")
        
        # Check if email is from Unitec domain
        is_unitec = is_unitec_email(value)
        
        # Store the result for use in create method
        self.context['is_unitec_email'] = is_unitec
        
        return value
    
    def validate(self, attrs):
        """
        Additional validation logic.
        """
        # If Unitec ID is provided, ensure email is from Unitec domain
        if attrs.get('unitec_id'):
            if not self.context.get('is_unitec_email', False):
                raise serializers.ValidationError(
                    "Unitec student ID can only be provided with Unitec email addresses."
                )
        
        return attrs
    
    def create(self, validated_data):
        """
        Override create method to use our custom logic.
        """
        # Extract Unitec-specific fields
        unitec_id = validated_data.pop('unitec_id', None)
        year_group = validated_data.pop('year_group', None)
        graduation_date = validated_data.pop('graduation_date', None)
        
        # Determine approval status based on email domain
        is_unitec = self.context.get('is_unitec_email', False)
        approval_status = get_approval_status_by_email(validated_data['email'])
        

        
        # Create user with additional fields using our custom manager
        user = User.objects.create_user(
            **validated_data,
            unitec_id=unitec_id,
            year_group=year_group,
            graduation_date=graduation_date,
            is_unitec_email=is_unitec,
            approval_status=approval_status,
            role='student',  # 일반 사용자는 기본적으로 student 역할
        )
        
        return user


class CustomUserSerializer(UserSerializer):
    """
    Custom user serializer for displaying user information.
    """
    
    approval_status_display = serializers.CharField(source='get_approval_status_display', read_only=True)
    is_unitec_email_display = serializers.SerializerMethodField()
    graduation_status = serializers.SerializerMethodField()
    
    class Meta(UserSerializer.Meta):
        model = User
        fields = (
            'id',
            'email',
            'first_name',
            'last_name',
            'unitec_id',
            'role',
            'year_group',
            'approval_status',
            'approval_status_display',
            'is_unitec_email',
            'is_unitec_email_display',
            'graduation_date',
            'graduation_status',
            'created_at',
        )
        read_only_fields = ('id', 'created_at', 'is_unitec_email')
    
    def get_is_unitec_email_display(self, obj):
        """Get display text for Unitec email status."""
        return "Unitec" if obj.is_unitec_email else "Non-Unitec"
    
    def get_graduation_status(self, obj):
        """Get graduation status display."""
        if not obj.graduation_date:
            return "Not Graduated"
        
        from .utils import is_graduated_user
        if is_graduated_user(obj.graduation_date):
            return "Graduated (≤12m)"
        else:
            return "Expired (>12m)"


class UserApprovalSerializer(serializers.ModelSerializer):
    """
    Serializer for user approval management.
    """
    
    class Meta:
        model = User
        fields = ('id', 'email', 'approval_status', 'first_name', 'last_name')
        read_only_fields = ('id', 'email', 'first_name', 'last_name')
    
    def validate_approval_status(self, value):
        """
        Validate approval status changes.
        """
        if value not in ['pending', 'approved', 'denied']:
            raise serializers.ValidationError("Invalid approval status.")
        return value


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for user profile updates.
    """
    
    class Meta:
        model = User
        fields = (
            'first_name',
            'last_name',
            'unitec_id',
            'year_group',
            'graduation_date'
        )
    
    def validate_unitec_id(self, value):
        """
        Validate Unitec ID format if provided.
        """
        if value and not validate_unitec_id(value):
            raise serializers.ValidationError(
                "Invalid Unitec student ID format."
            )
        return value
