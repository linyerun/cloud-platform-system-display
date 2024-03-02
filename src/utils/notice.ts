import { ElNotification, ElMessage } from 'element-plus'

export function ErrorInfo (msg: string) {
    ElNotification({
        title: 'Error',
        message: msg,
        type: 'error'
    })
}

export function SuccessInfo(msg: string) {
    ElMessage({
        message: msg,
        type: 'success',
    })
}