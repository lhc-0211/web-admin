import authNavigationConfig from './auth.navigation.config'
import conceptsNavigationConfig from './concepts.navigation.config'
import dashboardsNavigationConfig from './dashboards.navigation.config'
import guideNavigationConfig from './guide.navigation.config'
import othersNavigationConfig from './others.navigation.config'
import rootNavigationConfig from './root.navigation.config'
import uiComponentNavigationConfig from './ui-components.navigation.config'

const navigationConfig = [
    ...rootNavigationConfig,
    ...dashboardsNavigationConfig,
    ...conceptsNavigationConfig,
    ...uiComponentNavigationConfig,
    ...authNavigationConfig,
    ...othersNavigationConfig,
    ...guideNavigationConfig,
]

export default navigationConfig
