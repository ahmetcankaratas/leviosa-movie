import Joi from 'joi';

//Register Validation
export const register = (data: any) => {
  const schema = Joi.object({
    email: Joi.string().min(2).max(30).required(),
    username: Joi.string().min(2).max(15).required(),
    password: Joi.string().min(6).max(15).required(),
  });
  return schema.validate(data);
};

//Login Validation
export const login = (data: any) => {
  const schema = Joi.object({
    username: Joi.string().min(2).max(15).required(),
    password: Joi.string().min(6).max(15).required(),
  });
  return schema.validate(data);
};

// Movie Validation
export const movie = (data: any) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(30).required(),
    overview: Joi.string().min(20).max(300).required(),
    isPublic: Joi.boolean().required(),
  });
  return schema.validate(data);
};

// Actor Validation
export const actor = (data: any) => {
  const schema = Joi.object({
    fullname: Joi.string().min(2).max(30).required(),
    biography: Joi.string().min(20).max(300).required(),
    isPublic: Joi.boolean().required(),
  });
  return schema.validate(data);
};

// Comment Validation
export const comment = (data: any) => {
  const schema = Joi.object({
    title: Joi.string().min(2).max(30).required(),
    text: Joi.string().min(2).max(300).required(),
  });
  return schema.validate(data);
};

// Like Validation
export const like = (data: any) => {
  const schema = Joi.object({
    isLike: Joi.boolean().required(),
  });
  return schema.validate(data);
};
