const appConfig = {
    // apiPrefix: import.meta.env.VITE_API_BASE_URL,
    apiPrefix: 'http://bhhapi.tthd.vn',
    authenticatedEntryPath: '/home',
    unAuthenticatedEntryPath: '/sign-in',
    locale: 'en',
    accessTokenPersistStrategy: 'localStorage',
    enableMock: true,
    activeNavTranslation: true,
}

export default appConfig
