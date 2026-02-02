import * as Joi from 'joi';

export const createAlbumSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().required(),
});

export const updateAlbumSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().required(),
});
