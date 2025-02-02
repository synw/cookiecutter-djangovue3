import Cookies from 'js-cookie';


class Api {
  serverUrl: string;
  csrfCookieName: string;
  csrfHeaderKey: string;
  credentials: RequestCredentials | null;
  mode: RequestMode;
  private csrfToken: string | null = null;

  constructor(serverUrl: string, options: {
    csrfCookieName: string,
    csrfHeaderKey: string,
    credentials: RequestCredentials | null,
    mode: RequestMode,
  } = {
      csrfCookieName: "csrftoken",
      csrfHeaderKey: "X-CSRFToken",
      credentials: "include",
      mode: "cors",
    }
  ) {
    this.serverUrl = serverUrl;
    this.csrfCookieName = options.csrfCookieName;
    this.csrfHeaderKey = options.csrfHeaderKey;
    this.credentials = options.credentials;
    this.mode = options.mode;
  }

  get hasCsrfCookie(): boolean {
    const cookie = Cookies.get(this.csrfCookieName);
    if (cookie) {
      return true
    }
    return false
  }

  get csrfFromCookie(): string {
    const c = Cookies.get(this.csrfCookieName);
    if (!c) {
      throw ("Csrf cookie not found")
    }
    return c
  }

  setCsrfToken(verbose = false): boolean {
    if (this.hasCsrfCookie) {
      if (verbose) {
        console.log("User logged in with csrf cookie, setting api token", this.csrfFromCookie);
      }
      this.csrfToken = this.csrfFromCookie;
      return true
    } else {
      if (verbose) {
        console.log("User does not have csrf cookie")
      }
    }
    return false
  }

  setLoginStatus(): boolean {
    console.log("Checking login status from cookie")
    if (this.hasCsrfCookie) {
      console.log("User logged in with csrf cookie, setting api token");
      this.csrfToken = this.csrfFromCookie;
      return true
    }
    console.log("User does not have csrf cookie")
    return false;
  }

  async login(username: string, password: string, autoLogOut = false): Promise<Record<string, any>> {
    let url = this.serverUrl + "/auth/login/";
    if (username !== "") {
      console.log(`Logging user ${username} in on ${url}`)
    } else {
      console.log(`Logging user in from session cookie on ${url}`)
    }
    const payload = {
      username: username,
      password: password,
    }
    const opts = this.postHeader(payload);
    const response = await fetch(url, opts);
    if (!response.ok) {
      if (autoLogOut) {
        console.log("Autologout", response.status)
        if (response.status === 403) {
          throw response.status;
        }
      }
      console.log("Django login RESP NOT OK", response);
      throw new Error(response.status.toString());
    }
    const data = await response.json() as Record<string, any>;
    return data;
  }

  async logout() {
    const uri = this.serverUrl + "/auth/logout/";
    console.log("Logout", uri)
    const response = await fetch(uri, this.header("get"));
    if (!response.ok) {
      throw new Error(`Server logout failed ${response}`);
    }
    Cookies.remove(this.csrfCookieName);
  }

  async post<T>(uri: string, payload: Array<any> | Record<string, any> | FormData, multipart: boolean = false, verbose = false) {
    const opts = this.postHeader(payload, "post", multipart);
    let url = this.serverUrl + uri;
    if (verbose) {
      console.log("POST", url);
      console.log(JSON.stringify(opts, null, "  "));
    }
    const response = await fetch(url, opts);
    if (!response.ok) {
      throw new Error(`Error: ${response}`);
    }
    return (await response.json()) as T;
  }

  async patch<T>(uri: string, payload: Array<any> | Record<string, any>, verbose = false) {
    const opts = this.postHeader(payload, "patch");
    let url = this.serverUrl + uri;
    if (verbose) {
      console.log("PATCH", url);
      console.log(JSON.stringify(opts, null, "  "));
    }
    const response = await fetch(url, opts);
    if (!response.ok) {
      throw new Error(`Error: ${response}`);
    }
    return (await response.json()) as T;
  }

  async put<T>(uri: string, payload: Array<any> | Record<string, any>, verbose = false) {
    let url = this.serverUrl + uri;
    const opts = this.postHeader(payload, "put");
    if (verbose) {
      console.log("PUT", url);
      console.log(JSON.stringify(opts, null, "  "));
    }
    const response = await fetch(url, opts);
    if (!response.ok) {
      throw new Error(`Error: ${response}`);
    }
    return (await response.json()) as T;
  }

  async get<T>(uri: string, verbose = false): Promise<T> {
    let url = this.serverUrl + uri;
    const opts = this.header("get");
    if (verbose) {
      console.log("GET", url);
      console.log(JSON.stringify(opts, null, "  "));
    }
    const response = await fetch(url, opts);
    if (!response.ok) {
      throw new Error(`Error: ${response}`);
    }
    return (await response.json()) as T;
  }

  async delete(uri: string, verbose = false): Promise<void> {
    const url = this.serverUrl + uri;
    const opts = this.header("delete");
    if (verbose) {
      console.log("DELETE", url);
      console.log(JSON.stringify(opts, null, "  "));
    }
    const response = await fetch(url, opts);
    if (!response.ok) {
      throw new Error(`Error: ${response}`);
    }
  }

  header(method: string = "get"): RequestInit {
    const h = {
      method: method,
      headers: { "Content-Type": "application/json" },
      mode: this.mode,
    } as RequestInit;
    if (this.credentials !== null) {
      h.credentials = this.credentials as RequestCredentials;
    }
    if (this.csrfToken !== null) {
      h.headers = { "Content-Type": "application/json" }
      h.headers[this.csrfHeaderKey] = this.csrfToken;
    }
    return h;
  }

  postHeader(payload: Array<any> | Record<string, any> | FormData, method = "post", multipart: boolean = false): RequestInit {
    const pl = multipart ? payload as FormData : JSON.stringify(payload);
    const r: RequestInit = {
      method: method,
      mode: this.mode,
      body: pl
    };
    if (!multipart) {
      r.headers = { "Content-Type": "application/json" }
    }
    if (this.credentials !== null) {
      r.credentials = this.credentials as RequestCredentials
    }
    if (this.csrfToken !== null) {
      if (multipart) {
        r.headers = {}
        r.headers[this.csrfHeaderKey] = this.csrfToken;
      } else {
        r.headers = { "Content-Type": "application/json" }
        r.headers[this.csrfHeaderKey] = this.csrfToken;
      }
    }
    return r;
  }
}

export default Api;