export function uniqueEmail(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `test.api.${timestamp}.${random}@taskly.test`;
}

export function validPassword(): string {
  return "Password1!";
}
