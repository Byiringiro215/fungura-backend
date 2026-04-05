# Build Fix - Notification Service

## Issue
TypeScript compilation error in `notifications.service.ts`:

```
error TS2769: No overload matches this call.
Type 'null' is not assignable to type 'string | undefined'.
```

## Root Cause
The `Notification` entity had `userId` typed as `string`, but the column was marked as `nullable: true`. When trying to create a broadcast notification with `userId: null`, TypeScript complained about the type mismatch.

## Solution

### 1. Updated Entity Type Definition
**File**: `src/modules/notifications/entities/notification.entity.ts`

Changed:
```typescript
@Column({ nullable: true })
@Index()
userId: string;
```

To:
```typescript
@Column({ nullable: true })
@Index()
userId: string | null;
```

### 2. Added Type Assertion in Service
**File**: `src/modules/notifications/notifications.service.ts`

Changed:
```typescript
const notif = this.notifRepo.create({ ...data, userId: null });
```

To:
```typescript
const notif = this.notifRepo.create({ ...data, userId: null as any });
```

## Verification

✅ TypeScript compilation successful
✅ Build completes without errors
✅ No diagnostics errors found

## Testing

After this fix, you can now:

1. Start the API server:
```bash
npm run start:dev
```

2. Run the endpoint tests:
```bash
npm run test:endpoints
```

The broadcast notification endpoint should now work correctly:
```bash
POST /api/notifications/broadcast
{
  "title": "System Announcement",
  "message": "Server maintenance scheduled",
  "type": "info"
}
```

## Impact

This fix allows broadcast notifications (notifications sent to all users) to be created with a `null` userId, which is the intended behavior for system-wide announcements.

## Related Files
- `src/modules/notifications/entities/notification.entity.ts`
- `src/modules/notifications/notifications.service.ts`
- `src/modules/notifications/notifications.controller.ts`
