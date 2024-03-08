import {request} from '../utils/request'

export function login(email: string, password: string, captcha: string) {
    return request({
        method: 'post',
        url: '/v0/user/login',
        data: {
            email, password, captcha
        }
    })
}

export function register(email: string, password: string, name: string, captcha: string) {
    return request({
        method: 'post',
        url: '/v0/user/register',
        data: {
            email, password, name, captcha
        }
    })
}

export function sendCaptchaToEmail(email: string) {
    return request({
        method: 'get',
        url: '/v0/user/captcha/email',
        params: {email}
    })
}
