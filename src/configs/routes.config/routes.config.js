import authDemoRoute from './authDemoRoute'
import authRoute from './authRoute'
import conceptsRoute from './conceptsRoute'
import dashboardsRoute from './dashboardsRoute'
import guideRoute from './guideRoute'
import othersRoute from './othersRoute'
import root from './rootRoute'
import uiComponentsRoute from './uiComponentsRoute'

export const publicRoutes = [...authRoute]

export const protectedRoutes = [
    ...root,
    ...dashboardsRoute,
    ...conceptsRoute,
    ...uiComponentsRoute,
    ...authDemoRoute,
    ...guideRoute,
    ...othersRoute,
]
