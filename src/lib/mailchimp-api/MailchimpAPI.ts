import { env } from "~/env";
import { API } from "../base-api/src/API";
import { type APIFetchOptions } from "../base-api/src/API.types";

export default class MailchimpAPI extends API {
  protected static BASE_URL = env.MAILCHIMP_API_BASE_URL;

  public static _Fetch<
    BodyType = unknown,
    ParamType = unknown,
    ResponseType = unknown,
  >(
    path: string,
    fetchOpts: APIFetchOptions<BodyType, ParamType>,
  ): Promise<ResponseType> {
    // Add the access token to the headers
    fetchOpts.headers ??= {};
    fetchOpts.headers.Authorization ??= `Bearer ${env.MAILCHIMP_API_ACCESS_TOKEN}`;

    return super._Fetch(path, fetchOpts);
  }
}
