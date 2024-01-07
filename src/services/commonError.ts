export class CommonError {
  getMessageError = (message: string) => {
    return {
      customError: true,
      status: 400,
      json: {
        error: {
          message,
        },
      },
    };
  };
}
