import { Request, Response, NextFunction } from 'express'

import { CreateProjectInput, UpdateProjectInput } from './project.schema'

import { getProjects, getProjectById, createProject, updateProject, deleteProject } from './project.service'

export async function getProjectsHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const projects = await getProjects()

        res.status(200).send(projects)
    } catch (err) {
        next(err)
    }
}

export async function getProjectHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id as string
        const project = await getProjectById(id)

        res.status(200).send(project)
    } catch (err) {
        next(err)
    }
}

export async function createProjectHandler(req: Request<{}, {}, CreateProjectInput>, res: Response, next: NextFunction) {
    try {
        const input = { ...req.body, createdBy: res.locals.user._id }
        const project = await createProject(input)

        res.status(201).send(project)
    } catch (err) {
        next(err)
    }
}

export async function updateProjectHandler(req: Request<{ id: string }, {}, UpdateProjectInput>, res: Response, next: NextFunction) {
    try {
        const id = req.params.id
        const updatedProject = await updateProject(id, req.body)

        res.status(200).send(updatedProject)
    } catch (err) {
        next(err)
    }
}

export async function deleteProjectHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id as string
        const project = await deleteProject(id)

        res.status(200).send(project)
    } catch (err) {
        next(err)
    }
}
