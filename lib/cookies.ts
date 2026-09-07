import Cookies from 'js-cookie'

export const setCookie = (key: string, value: string, days: number = 1) => {
  Cookies.set(key, value, {
    expires: days,
    path: '/',
    secure: true,
    sameSite: 'strict',
  })
}

export const getCookie = (key: string): string | undefined => {
  return Cookies.get(key)
}

export const removeCookie = (key: string) => {
  Cookies.remove(key)
}

export const removeCookieIfExpired = (key: string) => {
  const token = Cookies.get(key)
  if (!token) {
    Cookies.remove(key)
  }
}
