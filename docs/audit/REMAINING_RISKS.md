# Remaining risks and required manual validation

- This is not a clinically validated device. Pulse, posture, wake-like, facial-asymmetry, and gesture observations must not be treated as diagnosis, emergency dispatch, sleep-stage monitoring, or medical measurement.
- Camera, microphone, speech recognition, wake lock, push, and service-worker behavior varies by browser, OS, device permissions, thermal state, lighting, and background-tab policy. Test the actual patient device and accessibility setup.
- Browser speech recognition can hear nearby voices. Pause/resume reduces Asha echo but is not speaker identification or guaranteed acoustic echo cancellation.
- Simultaneous caregiver receipt/acknowledgement and simultaneous identical event submissions are not atomically serialized by both supported storage adapters. UUID retry semantics reduce duplicate delivery; a durable compare-and-set/RPC design is required for strict concurrency guarantees.
- ONNX Runtime WASM currently has a jsDelivr runtime dependency in the YOLO worker. Deploying it locally with integrity/version review is recommended before offline or controlled-network use.
- Browser integration tests are environment-specific and were not run here. Validate patient/caregiver two-device delivery, camera interruption, microphone denial, worker/model fallback, PWA update/offline behavior, keyboard focus, screen-reader semantics, touch sizing, push permissions, and session deletion in a controlled environment.
- Dependency advisory status is unknown until `npm ci` and `npm audit` can run with approved network access. No dependencies were installed or upgraded during this audit.
- YOLO26n-pose is accompanied by AGPL-3.0 terms. The included license and model provenance are not a commercial-use clearance; obtain legal review and any appropriate enterprise license before proprietary distribution.
- Production safety also depends on Vercel environment variables, Supabase RLS/schema deployment, private Blob access, VAPID configuration, and origin/domain configuration. None was changed or validated against live data.
