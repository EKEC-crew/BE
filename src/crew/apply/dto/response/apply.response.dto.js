export class ApplySuccessResponseDTO {
    constructor(message) {
        this.resultType = 'SUCCESS';
        this.error = null;
        this.success = {
            message,
        };
    }
}

export class ApplyErrorResponseDTO {
    constructor(message, code = 400) {
        this.resultType = 'FAIL';
        this.error = {
            message,
            code,
        };
        this.success = null;
    }
}
