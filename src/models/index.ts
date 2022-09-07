import { getModelForClass } from '@typegoose/typegoose'

// import { Team } from '../api/team/team.model'
import { Project } from '../api/project/project.model'
import { Task } from '../api/task/task.model'
import { User } from '../api/user/user.model'
import { Session } from '../api/auth/auth.model'

// export const TeamModel = getModelForClass(Team)
export const ProjectModel = getModelForClass(Project)
export const TaskModel = getModelForClass(Task)
export const UserModel = getModelForClass(User)
export const SessionModel = getModelForClass(Session)
