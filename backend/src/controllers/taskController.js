const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getTasks = async (req, res) => {
  const { projectId } = req.query;
  const tasks = await prisma.task.findMany({
    where: projectId ? { projectId } : {},
    include: { assignee: true }
  });
  res.json(tasks);
};

const createTask = async (req, res) => {
  const { title, projectId, assigneeId, dueDate } = req.body;
  const task = await prisma.task.create({
    data: { title, projectId, assigneeId, dueDate: dueDate ? new Date(dueDate) : null }
  });
  res.json(task);
};

const updateTask = async (req, res) => {
  const task = await prisma.task.update({
    where: { id: req.params.id },
    data: req.body
  });
  res.json(task);
};

const deleteTask = async (req, res) => {
  await prisma.task.delete({ where: { id: req.params.id } });
  res.json({ message: 'Task deleted' });
};

module.exports = { getTasks, createTask, updateTask, deleteTask };