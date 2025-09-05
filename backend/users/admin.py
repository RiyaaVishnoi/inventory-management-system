from django.contrib import admin
from django.utils.html import format_html
from django.db.models import Q
from .models import User
from .utils import is_unitec_email, is_graduated_user


class UnitecEmailFilter(admin.SimpleListFilter):
    """
    Filter for Unitec vs Non-Unitec email users.
    """
    title = 'Email Domain'
    parameter_name = 'email_domain'
    
    def lookups(self, request, model_admin):
        return (
            ('unitec', 'Unitec Email'),
            ('non_unitec', 'Non-Unitec Email'),
        )
    
    def queryset(self, request, queryset):
        if self.value() == 'unitec':
            return queryset.filter(is_unitec_email=True)
        if self.value() == 'non_unitec':
            return queryset.filter(is_unitec_email=False)


class GraduatedUserFilter(admin.SimpleListFilter):
    """
    Filter for graduated users within 12 months.
    """
    title = 'Graduation Status'
    parameter_name = 'graduation_status'
    
    def lookups(self, request, model_admin):
        return (
            ('graduated', 'Graduated (≤12m)'),
            ('expired', 'Expired (>12m)'),
            ('not_graduated', 'Not Graduated'),
        )
    
    def queryset(self, request, queryset):
        from django.utils import timezone
        from datetime import timedelta
        
        today = timezone.now().date()
        
        if self.value() == 'graduated':
            # Users graduated within 12 months
            twelve_months_ago = today - timedelta(days=365)
            return queryset.filter(
                graduation_date__gte=twelve_months_ago,
                graduation_date__lte=today
            )
        elif self.value() == 'expired':
            # Users graduated more than 12 months ago
            twelve_months_ago = today - timedelta(days=365)
            return queryset.filter(graduation_date__lt=twelve_months_ago)
        elif self.value() == 'not_graduated':
            # Users without graduation date
            return queryset.filter(graduation_date__isnull=True)


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    """
    Custom User Admin interface for managing users with approval system.
    """
    
    # Display fields in the list view
    list_display = [
        'email', 
        'first_name', 
        'last_name', 
        'unitec_id', 
        'role', 
        'year_group', 
        'approval_status_display',
        'is_unitec_email_display',
        'graduation_status',
        'created_at'
    ]
    
    # Fields that can be used for searching
    search_fields = ['email', 'first_name', 'last_name', 'unitec_id']
    
    # Filters for the right sidebar
    list_filter = [
        'approval_status',
        'role',
        'is_unitec_email',
        'graduation_date',
        'created_at',
        UnitecEmailFilter,
        GraduatedUserFilter,
    ]
    
    # Fields to display in the detail view
    fieldsets = (
        ('Basic Information', {
            'fields': ('email', 'first_name', 'last_name', 'username')
        }),
        ('Unitec Information', {
            'fields': ('unitec_id', 'year_group', 'graduation_date', 'is_unitec_email'),
            'classes': ('collapse',)
        }),
        ('Approval & Status', {
            'fields': ('approval_status', 'role', 'created_at')
        }),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
            'classes': ('collapse',)
        }),
    )
    
    # Read-only fields
    readonly_fields = ['created_at', 'is_unitec_email']
    
    # Actions for bulk operations
    actions = ['approve_users', 'deny_users', 'extend_graduated_users']
    
    # Items per page
    list_per_page = 25
    
    # Ordering
    ordering = ['-created_at']
    
    def approval_status_display(self, obj):
        """Display approval status with color coding."""
        colors = {
            'pending': 'orange',
            'approved': 'green',
            'denied': 'red'
        }
        color = colors.get(obj.approval_status, 'black')
        return format_html(
            '<span style="color: {};">{}</span>',
            color,
            obj.get_approval_status_display()
        )
    approval_status_display.short_description = 'Approval Status'
    
    def is_unitec_email_display(self, obj):
        """Display Unitec email status with icon."""
        if obj.is_unitec_email:
            return format_html('✅ Unitec')
        return format_html('❌ Non-Unitec')
    is_unitec_email_display.short_description = 'Email Type'
    
    def graduation_status(self, obj):
        """Display graduation status."""
        if not obj.graduation_date:
            return 'N/A'
        
        if is_graduated_user(obj.graduation_date):
            return format_html('🎓 Graduated (≤12m)')
        else:
            return format_html('⏰ Expired (>12m)')
    graduation_status.short_description = 'Graduation Status'
    
    # Bulk actions
    def approve_users(self, request, queryset):
        """Approve selected users."""
        updated = queryset.update(approval_status='approved')
        self.message_user(
            request, 
            f'Successfully approved {updated} user(s).'
        )
    approve_users.short_description = "Approve selected users"
    
    def deny_users(self, request, queryset):
        """Deny selected users."""
        updated = queryset.update(approval_status='denied')
        self.message_user(
            request, 
            f'Successfully denied {updated} user(s).'
        )
    deny_users.short_description = "Deny selected users"
    
    def extend_graduated_users(self, request, queryset):
        """Extend graduated users by updating their graduation date."""
        from datetime import date
        today = date.today()
        updated = 0
        
        for user in queryset:
            if user.graduation_date:
                # Extend by 12 months from today
                user.graduation_date = date(today.year + 1, today.month, today.day)
                user.save()
                updated += 1
        
        self.message_user(
            request, 
            f'Successfully extended {updated} graduated user(s).'
        )
    extend_graduated_users.short_description = "Extend graduated users (12 months)"
