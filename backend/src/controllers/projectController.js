const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getProjects = async (req, res) => {
  const projects = await prisma.project.findMany({ include: { members: true, tasks: true } });
  res.json(projects);
};

const createProject = async (req, res) => {
  const { name } = req.body;
  const project = await prisma.project.create({ data: { name } });
  res.json(project);
};

const deleteProject = async (req, res) => {
  await prisma.project.delete({ where: { id: req.params.id } });
  res.json({ message: 'Project deleted' });
};

module.exports = { getProjects, createProject, deleteProject };