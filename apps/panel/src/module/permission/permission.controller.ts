import { PermissionsConst } from '@common/constants';
import { AuthDecorator, Permissions } from '@common/decorators';
import { EPermissionApps } from '@common/enums';
import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PermissionService } from './permission.service';

@Controller('permission')
@ApiTags('Permission')
@AuthDecorator()
export class PermissionController {
	constructor(private readonly permissionService: PermissionService) {}

	/**
	 * Endpoint: GET /api/permission/panel
	 * Retrieve panel permissions list
	 */
	@Get('/panel')
	@Permissions([PermissionsConst.PERMISSIONS_GET_ALL], EPermissionApps.PANEL)
	@ApiOperation({
		summary: `[RBAC: ${PermissionsConst.PERMISSIONS_GET_ALL}] - Get panel permissions list`,
	})
	getPanelPermissions() {
		return this.permissionService.getPanelPermissions();
	}
}
