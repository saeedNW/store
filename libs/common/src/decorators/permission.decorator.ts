import { EPermissionApps } from '@common/enums';
import { SetMetadata } from '@nestjs/common';

export const PERMISSION_KEY = 'PERMISSION';
export function Permission(permissions: string[], app: EPermissionApps) {
	return SetMetadata(PERMISSION_KEY, { permissions, app });
}
