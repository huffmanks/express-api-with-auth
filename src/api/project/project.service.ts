// import TeamModel from '../team/team.model'
import { ProjectModel } from '../../models'
import { CreateProjectInput, UpdateProjectInput } from './project.schema'

export function getProjects() {
    return ProjectModel.find({})
}

export function getProjectById(id: string) {
    return ProjectModel.findById(id)
}

export async function createProject(input: CreateProjectInput) {
    return ProjectModel.create(input)
}

export async function updateProject(id: string, input: UpdateProjectInput) {
    const project = await ProjectModel.findByIdAndUpdate(id, input, { new: true })
    if (!project) return

    await project.setProjectStats()

    return project
}

export async function deleteProject(id: string) {
    const project = ProjectModel.findByIdAndDelete(id)
    // await TeamModel.findByIdAndDelete({ projects: { project: id } })

    return project
}
