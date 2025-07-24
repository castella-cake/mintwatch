export function validateBaseResponse(response: baseResponse) {
    return response.meta && (response.meta.status === 200 || response.meta.status === 201)
}
