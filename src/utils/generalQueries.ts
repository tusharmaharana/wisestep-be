import { Document, FilterQuery, Model as TModel, QueryOptions, UpdateQuery } from 'mongoose';
import { isNotEmptyObject, omitWrapper } from './commonHelpers';

export const saveQuery = async (data: Document<unknown>): Promise<Record<string, unknown>> => {
  const mongoDoc = await data.save();
  return isNotEmptyObject(mongoDoc as unknown as Record<string, unknown>) ? mongoDoc.toObject() : null;
};

export const findQuery = async <T>(
  Model: TModel<T>,
  params: FilterQuery<T> & { skip?: number; limit?: number; sortOrder?: number; sortKey?: string }
): Promise<Record<string, unknown>[]> => {
  let data = Model.find(omitWrapper(params, ['skip', 'limit', 'sortOrder', 'sortKey']));

  if (params.limit) {
    data = data.skip(+params.skip).limit(+params.limit);
  }

  if (params.sortKey) {
    data = data.sort({ [params.sortKey]: params.sortOrder || 1 });
  }

  const res = await data.lean().exec();

  return res;
};

export const findOneQuery = async <T>(Model: TModel<T>, params: FilterQuery<T>): Promise<Record<string, unknown>> => {
  const data = await Model.findOne(params).lean().exec();

  return data as unknown as Record<string, unknown>;
};

export const findOneAndUpdateQuery = async <T>(
  Model: TModel<T>,
  params: FilterQuery<T>,
  valuesToUpdate: UpdateQuery<T>,
  options?: QueryOptions
): Promise<Record<string, unknown>> => {
  const data = await Model.findOneAndUpdate(params, valuesToUpdate, options);

  return isNotEmptyObject(data as unknown as Record<string, unknown>) ? data.toObject() : null;
};

export const findOneAndDeleteQuery = async <T>(
  Model: TModel<T>,
  params: FilterQuery<T>,
  options?: QueryOptions
): Promise<Record<string, unknown>> => {
  const data = await Model.findOneAndDelete(params, options);

  return isNotEmptyObject(data as unknown as Record<string, unknown>) ? data.toObject() : null;
};

export const createDocumentQuery = async <T>(
  Model: TModel<T>,
  params: FilterQuery<T>
): Promise<Record<string, unknown>> => {
  const data = await Model.create(params);
  return isNotEmptyObject(data as unknown as Record<string, unknown>) ? data.toObject() : null;
};
