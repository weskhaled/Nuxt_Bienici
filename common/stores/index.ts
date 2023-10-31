import { breakpointsTailwind, useBreakpoints, useStorage } from '@vueuse/core'

export const token: Ref<string | null> = useStorage('token', null)
export const refreshToken: Ref<string | null> = useStorage('refreshToken', null)
export const isAuthenticated = computed(() => token.value && token.value?.length && refreshToken.value && refreshToken.value?.length)
export const currentUser: Ref<any | null> = ref(null)

export const layoutBoxed: Ref<boolean> = useStorage('layout-boxed', false)
export const sideCollapsed: Ref<boolean> = useStorage('side-collapsed', false)
export const sideHidden: Ref<boolean> = useStorage('side-hidden', true)
export const sideFixed: Ref<boolean> = useStorage('side-fixed', false)

export const breakpoints = useBreakpoints(breakpointsTailwind)
export const mdAndLarger = breakpoints.greaterOrEqual('md')
export const smAndSmaller = breakpoints.smallerOrEqual('sm')
export const mdAndSmaller = breakpoints.smallerOrEqual('md')
