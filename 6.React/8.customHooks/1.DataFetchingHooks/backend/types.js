import z from "zod";

const createTodoValidate = z.object({
  title: z.string(),
  description: z.string(),
  completed: z.boolean(),
});

const updateTodoValidate = z.string().uuid();

export { createTodoValidate, updateTodoValidate };
