// import TeamModel from '../team/team.model'
import { ProjectModel } from '../../models'
import { CreateProjectInput, UpdateProjectInput } from './project.schema'

export function getProjects() {
    return ProjectModel.find({})
}

export function getProjectById(id: string) {
    return ProjectModel.findById({ userId: id })
}

export function createProject(input: CreateProjectInput) {
    return ProjectModel.create(input)
}

export function updateProject(id: string, input: UpdateProjectInput) {
    return ProjectModel.findByIdAndUpdate({ _id: id }, input, { new: true })
}

export async function deleteProject(id: string) {
    const project = ProjectModel.findByIdAndDelete(id)
    // await TeamModel.findByIdAndDelete({ projects: { project: id } })

    return project
}
