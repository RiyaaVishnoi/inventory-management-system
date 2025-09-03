from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

##who am i test 
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    u = request.user
    return Response({
        "id": u.id, 
        "email": u.email, 
        "first_name": u.first_name,
        "last_name": u.last_name,
        "role": u.role,
        "unitec_id": u.unitec_id,
        "year_group": u.year_group,
        "approval_status": u.approval_status,
        "is_unitec_email": u.is_unitec_email
    })
