const appConfig = {
    // apiPrefix: import.meta.env.VITE_API_BASE_URL,
    // apiPrefix: 'http://bhhapi.tthd.vn',
    apiPrefix: '',
    authenticatedEntryPath: '/home',
    unAuthenticatedEntryPath: '/sign-in',
    locale: 'vi',
    accessTokenPersistStrategy: 'localStorage',
    enableMock: true,
    activeNavTranslation: true,
}

export default appConfig
