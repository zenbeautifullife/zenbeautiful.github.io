# Little Moments

This is a static website. No build step or dependencies are needed.

## Run locally and test on an iPhone

From this folder, run:

```sh
sh run-local.sh
```

Keep the server running. On the Mac, open `http://localhost:8000/`. On your iPhone, connect to the same Wi-Fi as the Mac and open `http://<mac-ip>:8000/` in Safari. Find the Mac's Wi-Fi IP with:

```sh
ipconfig getifaddr en0
```

If that returns nothing, find the Wi-Fi IP in System Settings → Wi-Fi → Details. If the phone cannot connect, check that both devices are on the same non-guest network and allow Python incoming connections in the Mac firewall.

The local server listens on the Mac's network interfaces so another device on your Wi-Fi can reach it. Use it only on a trusted network and stop it with Ctrl+C when finished. You can choose another port with `PORT=8001 sh run-local.sh`.

This HTTP preview is suitable for testing layout and interactions. Service workers require a secure context, so offline/PWA behavior needs an HTTPS deployment. In an iPhone simulator, open `http://localhost:8000/` in Safari; if that does not connect, use the Mac's Wi-Fi IP address instead. A simulator is useful for checking screen sizes, while a physical iPhone is the better check for actual Safari and Home Screen behavior. Apple notes that simulators do not reproduce every physical-device feature or performance characteristic: https://developer.apple.com/documentation/Xcode/running-app-on-simulated-or-physical-devices
