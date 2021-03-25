/**
 * Example:
 * {
 *   ActionFlag: "0"
 *   ID: "4"
 *   Name: "10. Обещание об оплате"
 * }
 * {
 *   ActionFlag: "2"
 *   ID: "13"
 *   Name: "50. Нет ответа"
 * }
 */
export interface CallCode {
  ID: string;
  Name: string;
  ActionFlag: string;
}
