let backendHost;

const hostname = window && window.location && window.location.hostname;

console.log("hostname", hostname);
if (hostname === "localhost") {
    backendHost = "http://localhost:8080";
} else {
    backendHost = "https://your-production-url.com"; // 로컬호스트가 아닌 경우 사용할 URL을 추가하세요.
}

export const API_BASE_URL = `${backendHost}`;
