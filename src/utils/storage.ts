import {MMKV} from 'react-native-mmkv';

/**
 *  storage init
 */
const SecureStorage = new MMKV({
  id: 'AgentUserData',
  //   path: `/storage`,
  encryptionKey: '799156bd-587ee17450',
});

function GetString(key: string) {
  try {
    return SecureStorage.getString(key);
  } catch (error) {}
}
function GetKey(key) {
  try {
    return SecureStorage.getString(key);
  } catch (error) {}
}
/**
 *
 * @param key
 * @param value
 */
async function SetKey(key: string, value: any) {
  try {
    SecureStorage.set(key, value);
  } catch (error) {}
}
async function deleteKey(key: string) {
  try {
    SecureStorage.delete(key);
  } catch (error) {}
}

async function clearAll() {
  try {
    SecureStorage.clearAll();
  } catch (error) {}
}

export {SecureStorage, GetKey, deleteKey, clearAll, SetKey, GetString};
