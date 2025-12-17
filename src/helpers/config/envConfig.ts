export const getBaseUrl = (): string => {
    return `${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PATH}` || ''
}


export const getPaymentReturnUrl = (): string => {
    return process.env.NEXT_PUBLIC_PAYMENT_RETURN_URL || ''
}

export const getBackendURL = (): string => {
    return process.env.NEXT_PUBLIC_API_BASE_URL || ''
}