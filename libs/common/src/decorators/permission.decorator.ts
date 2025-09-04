import { TPermissions } from '@common/constants';
import { EPermissionApps } from '@common/enums';
import { SetMetadata } from '@nestjs/common';

export const PERMISSION_KEY = 'PERMISSION';
export function Permissions(permissions: TPermissions[], app: EPermissionApps) {
	return SetMetadata(PERMISSION_KEY, { permissions, app });
}
