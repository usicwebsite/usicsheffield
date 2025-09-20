import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/firebase-admin-utils';
import { getAllUsers, restrictUser, unrestrictUser, syncUserDisplayNameWithGoogle, batchSyncDisplayNamesWithGoogle } from '@/lib/firebase-admin-utils';
import { z } from 'zod';

const restrictUserSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  action: z.enum(['restrict', 'unrestrict']),
  reason: z.string().optional()
});

const syncDisplayNameSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  action: z.literal('sync_display_name')
});

const batchSyncDisplayNamesSchema = z.object({
  action: z.literal('batch_sync_display_names')
});

// GET /api/admin/users - Get all users
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const verification = await verifyAdminToken(request);
    if (!verification.success) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get all users
    const users = await getAllUsers();

    return NextResponse.json({
      success: true,
      data: users
    });

  } catch (error) {
    console.error('[Users API] Error getting users:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get users'
      },
      { status: 500 }
    );
  }
}

// POST /api/admin/users - Restrict or unrestrict a user
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const verification = await verifyAdminToken(request);
    if (!verification.success) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();

    // Try to validate against different schemas based on the action
    const restrictResult = restrictUserSchema.safeParse(body);
    const syncResult = syncDisplayNameSchema.safeParse(body);
    const batchSyncResult = batchSyncDisplayNamesSchema.safeParse(body);

    if (!restrictResult.success && !syncResult.success && !batchSyncResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request data',
          details: 'Request must be for restrict/unrestrict, sync_display_name, or batch_sync_display_names'
        },
        { status: 400 }
      );
    }

    // Handle restrict/unrestrict action
    if (restrictResult.success) {
      const { userId, action, reason } = restrictResult.data;

      if (action === 'restrict') {
        await restrictUser(userId, (verification as { uid: string }).uid, reason);
      } else {
        await unrestrictUser(userId, (verification as { uid: string }).uid);
      }

      return NextResponse.json({
        success: true,
        message: `User ${action}ed successfully`,
        data: {
          userId,
          action,
          performedBy: (verification as { uid: string }).uid,
          timestamp: new Date().toISOString()
        }
      });
    }

    // Handle sync display name action
    if (syncResult.success) {
      const { userId } = syncResult.data;

      const syncResultData = await syncUserDisplayNameWithGoogle(userId, (verification as { uid: string }).uid);

      return NextResponse.json({
        success: true,
        message: syncResultData.synced
          ? `User display name synced successfully: "${syncResultData.oldName}" → "${syncResultData.newName}"`
          : 'User display name was already in sync with Google account',
        data: {
          userId,
          synced: syncResultData.synced,
          oldName: syncResultData.oldName,
          newName: syncResultData.newName,
          performedBy: (verification as { uid: string }).uid,
          timestamp: new Date().toISOString()
        }
      });
    }

    // Handle batch sync display names action
    if (batchSyncResult.success) {
      const batchResult = await batchSyncDisplayNamesWithGoogle((verification as { uid: string }).uid);

      return NextResponse.json({
        success: true,
        message: `Batch sync completed: ${batchResult.syncedUsers} users synced, ${batchResult.errors} errors out of ${batchResult.totalUsers} total users`,
        data: {
          totalUsers: batchResult.totalUsers,
          syncedUsers: batchResult.syncedUsers,
          errors: batchResult.errors,
          performedBy: (verification as { uid: string }).uid,
          timestamp: new Date().toISOString()
        }
      });
    }

  } catch (error) {
    console.error('[Users API] Error managing user:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to manage user'
      },
      { status: 500 }
    );
  }
}
