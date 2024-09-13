import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { RedisCache } from 'cache-manager-redis-yet';
import { RedisClientType } from 'redis';
import { UserEntity } from 'src/users/entities/user.entity';

const expiresIn = 30 * 24 * 60 * 60 * 1000;
type TCacheData = {
  user: UserEntity;
  refreshToken: string;
};

@Injectable()
export class SessionsService {
  private redisClient: RedisClientType;
  constructor(@Inject(CACHE_MANAGER) private cacheManager: RedisCache) {
    this.redisClient = this.cacheManager.store.client;
  }

  //   // ---------- Create ---------- //

  create(data: TCacheData) {
    const { refreshToken, user } = data;
    const value = { userId: user.id, role: user.role.title };
    this.cacheManager.store.client.sAdd(
      `user_sessions: ${user.id}`,
      refreshToken,
    );
    return this.cacheManager.set(refreshToken, value, expiresIn);
  }

  //   // ---------- Find One by key ---------- //

  async findOneByKey(key: string) {
    return await this.redisClient.get(key);
  }

  //   // ---------- Find all by User ---------- //

  async findAllByUser(userId: string) {
    const key = `user_sessions: ${userId}`;
    return await this.redisClient.sMembers(key);
  }

  //   // ---------- Update Session ---------- //

  async updateSession(
    oldSessionKey: string,
    newSessionKey: string,
    userData: { userId: number; role: string },
  ) {
    const mKey = `user_sessions: ${userData.userId}`;
    await this.redisClient.sRem(mKey, oldSessionKey);
    await this.redisClient.sAdd(mKey, newSessionKey);
    await this.cacheManager.del(oldSessionKey);
    return this.cacheManager.set(newSessionKey, userData, expiresIn);
  }

  async remove(key: string) {
    const session = await this.findOneByKey(key);
    const userData = JSON.parse(session);
    const mKey = `user_sessions: ${userData.userId}`;
    await this.redisClient.sRem(mKey, key);
    return await this.cacheManager.del(key);
	}
}
