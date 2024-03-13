import { StatusCodes } from "http-status-codes";

import { catchErrors } from "../decorators/ControllerError.js";
import HttpError from "../helpers/HttpError.js";
import * as contactTypesService from "../services/contactTypesServices.js";

const getId = (req) => req.params.id;

export const getAllContactTypes = catchErrors(async (_, res) =>
  res.json(await contactTypesService.listContactTypes())
);

export const getOneContactType = catchErrors(async (req, res) => {
  const contact = await contactTypesService.getContactTypeById(getId(req));

  if (!contact) throw HttpError(StatusCodes.NOT_FOUND);

  res.json(contact);
});

export const deleteContactType = catchErrors(async (req, res) => {
  const contact = await contactTypesService.removeContactType(getId(req));

  if (!contact) throw HttpError(StatusCodes.NOT_FOUND);

  res.json(contact);
});

export const createContactType = catchErrors(async ({ body }, res) =>
  res.status(201).json(await contactTypesService.addContactType(body))
);

export const updateContactType = catchErrors(async (req, res) => {
  const contact = await contactTypesService.updateContactType(
    getId(req),
    req.body
  );

  if (!contact) throw HttpError(StatusCodes.NOT_FOUND);

  res.json(contact);
});
