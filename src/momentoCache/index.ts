import {
  CacheGet,
  CreateCache,
  CacheSet,
  CacheClient,
  CacheListConcatenateBack,
  CacheListFetch,
} from "@gomomento/sdk";

export const createCache = async (cacheClient: CacheClient): Promise<void> => {
  const result = await cacheClient.createCache("test-cache");
  if (result instanceof CreateCache.Success) {
    console.log("Cache 'test-cache' created");
  } else if (result instanceof CreateCache.AlreadyExists) {
    console.log("Cache 'test-cache' already exists");
  } else if (result instanceof CreateCache.Error) {
    throw new Error(
      `An error occurred while attempting to create cache 'test-cache': ${result.errorCode()}: ${result.toString()}`
    );
  }
};

export const setCache = async (cacheClient: CacheClient): Promise<void> => {
  const result = await cacheClient.set("test-cache", "test-key", "test-value");
  if (result instanceof CacheSet.Success) {
    console.log("Key 'test-key' stored successfully");
  } else if (result instanceof CacheSet.Error) {
    throw new Error(
      `An error occurred while attempting to store key 'test-key' in cache 'test-cache': ${result.errorCode()}: ${result.toString()}`
    );
  }
};

export const setCacheList = async (
  cacheClient: CacheClient,
  list: string[]
): Promise<void> => {
  const result = await cacheClient.listConcatenateBack(
    "test-cache",
    "test-list",
    list
  );
  if (result instanceof CacheListConcatenateBack.Success) {
    console.log(
      `Values added successfully to the back of the list 'test-list'. Result - ${result.toString()}`
    );
  } else if (result instanceof CacheListConcatenateBack.Error) {
    throw new Error(
      `An error occurred while attempting to call cacheListConcatenateBack on list 'test-list' in cache 'test-cache': ${result.errorCode()}: ${result.toString()}`
    );
  }
};

export const getCacheList = async (cacheClient: CacheClient) => {
  const result = await cacheClient.listFetch("test-cache", "test-list");
  if (result instanceof CacheListFetch.Hit) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    console.log(`List fetched successfully: ${result.valueList()}`);
    return result.valueList();
  } else if (result instanceof CacheListFetch.Miss) {
    console.log("List 'test-list' was not found in cache 'test-cache'");
  } else if (result instanceof CacheListFetch.Error) {
    throw new Error(
      `An error occurred while attempting to fetch the list 'test-list' from cache 'test-cache': ${result.errorCode()}: ${result.toString()}`
    );
  }
};

export const getCache = async (cacheClient: CacheClient): Promise<void> => {
  const result = await cacheClient.get("test-cache", "test-key");
  if (result instanceof CacheGet.Hit) {
    console.log(`Retrieved value for key 'test-key': ${result.valueString()}`);
  } else if (result instanceof CacheGet.Miss) {
    console.log("Key 'test-key' was not found in cache 'test-cache'");
  } else if (result instanceof CacheGet.Error) {
    throw new Error(
      `An error occurred while attempting to get key 'test-key' from cache 'test-cache': ${result.errorCode()}: ${result.toString()}`
    );
  }
};
