import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { LocalStorageStrategy } from './strategies/local.strategy';
import { LiaraStorageStrategy } from './strategies/liara.strategy';

@Module({
	providers: [StorageService, LocalStorageStrategy, LiaraStorageStrategy],
	exports: [StorageService],
})
export class StorageModule {}
