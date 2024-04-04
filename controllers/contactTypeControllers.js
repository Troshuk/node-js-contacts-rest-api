import { StatusCodes } from 'http-status-codes';

import catchErrors from '../decorators/catchErrors.js';
import HttpError from '../helpers/HttpError.js';
import { transformContactType } from '../transformers/contactTypeTransformer.js';
import contactTypeService from '../services/modelServices/ContactTypeService.js';

const getId = (req) => req.params.id;

export const getAllContactTypes = catchErrors(async (req, res) => {
  const types = await contactTypeService.getAll({
    owner: req.user,
  });

  res.json(types.map(transformContactType));
});

export const getOneContactType = catchErrors(async (req, res) => {
  const type = await contactTypeService.findOne({
    _id: getId(req),
    owner: req.user,
  });

  if (!type) throw new HttpError(StatusCodes.NOT_FOUND);

  res.json(transformContactType(type));
});

export const createContactType = catchErrors(async (req, res) => {
  res.status(StatusCodes.CREATED).json(
    await contactTypeService.create({
      ...req.body,
      owner: req.user,
    })
  );
});

export const updateContactType = catchErrors(async (req, res) => {
  const type = await contactTypeService.updateOne(
    { _id: getId(req), owner: req.user },
    req.body
  );

  if (!type) throw new HttpError(StatusCodes.NOT_FOUND);

  res.json(transformContactType(type));
});

export const deleteContactType = catchErrors(async (req, res) => {
  const type = await contactTypeService.deleteOne({
    _id: getId(req),
    owner: req.user,
  });

  if (!type) throw new HttpError(StatusCodes.NOT_FOUND);

  res.json(transformContactType(type));
});
