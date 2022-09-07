import { Request, Response } from 'express'

import { CreateProjectInput, UpdateProjectInput } from './project.schema'

import { getProjects, getProjectById, createProject, updateProject, deleteProject } from './project.service'

export async function getProjectsHandler(req: Request, res: Response) {
    const projects = await getProjects()

    res.status(200).send(projects)
}

export async function getProjectHandler(req: Request, res: Response) {
    const id = req.params.id as string
    const project = await getProjectById(id)

    res.status(200).send(project)
}

export async function createProjectHandler(req: Request<{}, {}, CreateProjectInput>, res: Response) {
    const project = await createProject(req.body)

    res.status(201).send(project)
}

export async function updateProjectHandler(req: Request<{ id: string }, {}, UpdateProjectInput>, res: Response) {
    try {
        const id = req.params.id

        const updatedProject = await updateProject(id, req.body)
        if (!updatedProject) return res.status(500).send('Could not update project.')

        return res.status(200).send(updatedProject)
    } catch (e: any) {}
}

export async function deleteProjectHandler(req: Request, res: Response) {
    const id = req.params.id as string

    const project = await deleteProject(id)
    if (!project) return res.status(500).send('Could not delete project.')

    res.status(200).send(project)
}
