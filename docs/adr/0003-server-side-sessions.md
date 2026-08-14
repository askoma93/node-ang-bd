# Server-side sessions instead of browser-held JWTs

Authentication will use opaque session identifiers in protected cookies with session state stored in Redis, rather than access and refresh JWTs stored by the Angular client. This fits same-origin Angular SSR, supports immediate revocation and session rotation, and concentrates cookie, CSRF, email/password, and GitHub OAuth behavior behind the Identity module interface.
