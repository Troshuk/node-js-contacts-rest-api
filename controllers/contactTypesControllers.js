import { StatusCodes } from "http-status-codes";

import { catchErrors } from "../decorators/CatchErrors.js";
import HttpError from "../helpers/HttpError.js";
import * as contactTypesService from "../services/contactTypesServices.js";
import { transformContactType } from "../transformers/contactTypeTransformer.js";

const getId = (req) => req.params.id;
const getUserId = (req) => req.user._id;

export const getAllContactTypes = catchErrors(async (req, res) => {
  const types = await contactTypesService.getAllContactTypes({
    owner: getUserId(req),
  });

  res.json(types.map(transformContactType));
});

export const getOneContactType = catchErrors(async (req, res) => {
  const type = await contactTypesService.getOneContactType({
    _id: getId(req),
    owner: getUserId(req),
  });

  if (!type) throw HttpError(StatusCodes.NOT_FOUND);

  res.json(transformContactType(type));
});

export const createContactType = catchErrors(async (req, res) =>
  res.status(StatusCodes.CREATED).json(
    await contactTypesService.createContactType({
      ...req.body,
      owner: getUserId(req),
    })
  )
);

export const updateContactType = catchErrors(async (req, res) => {
  const type = await contactTypesService.updateOneContactType(
    { _id: getId(req), owner: getUserId(req) },
    req.body
  );

  if (!type) throw HttpError(StatusCodes.NOT_FOUND);

  res.json(transformContactType(type));
});

export const deleteContactType = catchErrors(async (req, res) => {
  const type = await contactTypesService.deleteOneContactType({
    _id: getId(req),
    owner: getUserId(req),
  });

  if (!type) throw HttpError(StatusCodes.NOT_FOUND);

  res.json(transformContactType(type));
});
