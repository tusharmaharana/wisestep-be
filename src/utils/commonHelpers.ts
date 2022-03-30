import isObject from 'lodash/isObject';
import omit from 'lodash/omit';
import pick from 'lodash/pick';
import transform from 'lodash/transform';
import { Types } from 'mongoose';

export const pickWrapper = (object: Record<string, unknown>, keys: string[]): Record<string, unknown> =>
  pick(object, keys);
export const omitWrapper = (object: Record<string, unknown>, keys: string[]): Record<string, unknown> =>
  omit(object, keys);

export const replaceKeysDeep = (obj: Record<string, any>, keysMap: Record<string, string>): Record<string, any> => {
  return transform(obj, (result, value, key) => {
    const currentKey = (keysMap[key] || key) as string;
    result[currentKey] =
      isObject(value) && !(value instanceof Types.ObjectId)
        ? replaceKeysDeep(value as Record<string, any>, keysMap)
        : value;
  });
};

export const cleanMongoObject = (
  obj: Record<string, unknown>,
  keysMap: Record<string, string> = {}
): Record<string, unknown> => replaceKeysDeep(omitWrapper(obj, ['__v']), { _id: 'id', ...keysMap });

export const isNotEmptyObject = (obj: Record<string, unknown>): boolean => obj && Object.keys(obj).length > 0;

export const generateId = ({ length, isNumeric = true }: { length: number; isNumeric?: boolean }): string => {
  let result = '';
  const characters = isNumeric ? '0123456789' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

export const MongoIdType = (id: string): Types.ObjectId => new Types.ObjectId(id);
