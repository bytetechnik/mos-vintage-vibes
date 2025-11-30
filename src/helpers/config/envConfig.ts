export const getBaseUrl = (): string => {

    return process.env.NEXT_PUBLIC_API_BASE_URL || ''
}


export const getPaymentReturnUrl = (): string => {
    return process.env.NEXT_PUBLIC_PAYMENT_RETURN_URL || ''
}

export const getOAuthBaseUrl = (): string => {

    return process.env.NEXT_PUBLIC_OAUTH_BASE_URL || ''
}