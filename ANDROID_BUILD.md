# RR GLOBAL Android build

This branch adds a first Android wrapper around the existing RR GLOBAL web experience using Capacitor.

## Current scope

- The Android app opens the existing RR GLOBAL home page.
- RR AI pages and the existing logo are packaged as local web assets.
- RR AI continues to call its configured HTTPS backend; provider API keys must remain on the server.
- GitHub Actions builds an installable **debug APK** for device testing.

## Build artifact

After the GitHub Actions workflow succeeds, open the workflow run and download the artifact named `rr-global-android-debug-apk`. This is a test build, not a Play Store release.

## Google Play release

Google Play expects an Android App Bundle (AAB) for a new app. A production release also needs a securely managed signing setup, app listing, privacy policy, Data safety declaration, content rating, testing and policy review. Do not commit signing keys, passwords, API keys or other secrets to this repository.

The Play Console account holder must meet Google's age and identity requirements. An adult account holder must manage the publishing account and release steps.

## Important testing before release

- Install and test the debug APK on real Android devices.
- Verify login or chat flows, message sending, network errors, navigation, back button and keyboard behavior.
- Confirm privacy disclosures match the actual data collected and transmitted.
- Check that all links, icons and offline behavior work inside the Android app.

This workflow does not publish to Google Play and does not change the protected `main` branch.
