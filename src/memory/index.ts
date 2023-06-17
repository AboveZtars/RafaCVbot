// momento cache
import {CacheClient, Configurations, CredentialProvider} from "@gomomento/sdk";

/**
 * Memory is a class that is used to store and retrieve data from a cache.
 */
export class Memory {
  /**
   * momentoMemory is a function that returns a momento memory object.
   * @param {string} cacheName is the name of the cache.
   * @param {string} sessionId is the id of the session.
   * @return {Promise<BufferMemory>} the momento memory object.
   */
  async momentoMemory(cacheName: string, sessionId: string): Promise<void> {
    const momentoClient = new CacheClient({
      configuration: Configurations.Laptop.v1(),
      credentialProvider: CredentialProvider.fromString({
        authToken: process.env.MOMENTO_API_KEY || "",
      }),
      defaultTtlSeconds: 60 * 60 * 24,
    });
  }
}
