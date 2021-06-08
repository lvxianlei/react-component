import { post } from '../config/request'
const createSevices = (path, param, config) => (newPath, newParam, newconfig) => post(newPath || path, newParam || param, newconfig || config || ({}))

export const createDepSevices = (path, param, config) => post(path, param, config)

export default createSevices