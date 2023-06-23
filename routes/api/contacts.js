const express = require("express");
const router = express.Router();
const Joi = require("joi");
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../models/contacts");

const createSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

const updateSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string(),
}).or("name", "email", "phone");

router.get("/", async (req, res, next) => {
  const contacts = await listContacts();
  res.status(200).json({
    status: "success",
    code: 200,
    data: {
      contacts,
    },
  });
});
const validator = (schema, message) => (req, res, next) => {
  const body = req.body;
  const validation = schema.validate(body);

  if (validation.error) {
    res.status(400).json({ message });
    return;
  }

  return next();
};

router.get("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const contacts = await getContactById(contactId);
  if (!contacts) {
    res.status(404).json({
      status: "error",
      code: 404,
      message: "Not found",
    });
    return;
  }
  res.status(200).json({
    status: "success",
    code: 200,
    data: {
      contacts,
    },
  });
});

router.post(
  "/",
  validator(createSchema, "missing required name field"),
  async (req, res, next) => {
    const contacts = await addContact(req.body);

    res.status(201).json({
      status: "success",
      code: 201,
      data: {
        contacts,
      },
    });
  }
);

router.delete("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const contacts = await removeContact(contactId);
  if (!contacts) {
    res.status(404).json({
      status: "error",
      code: 404,
      message: "Not found",
    });
    return;
  }
  res.status(200).json({
    status: "success",
    code: 200,
    message: "contact deleted",
  });
});

router.put(
  "/:contactId",
  validator(updateSchema, "missing required name field"),
  async (req, res, next) => {
    const { contactId } = req.params;
    const contacts = await updateContact(contactId, req.body);

    if (!contacts) {
      res.status(404).json({
        status: "error",
        code: 404,
        message: "Not found",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      code: 200,
      data: {
        contacts,
      },
    });
  }
);

module.exports = router;
