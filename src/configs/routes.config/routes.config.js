import authRoute from './authRoute'
import root from './rootRoute'

export const publicRoutes = [...authRoute]
export const protectedRoutes = [...root]
