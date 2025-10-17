# Research - Cockers Capstone Stack Demo
## My Demo Research App - Gym Pro Bro 
### Watch the demo walkthrough
[![Video walkthrough](https://img.youtube.com/vi/1PNH7nlLf8k/maxresdefault.jpg)](https://www.youtube.com/watch?v=1PNH7nlLf8k)
[Click the thumbnail to watch the video on YouTube.]((https://img.youtube.com/vi/1PNH7nlLf8k/maxresdefault.jpg))

## Requirements to Hit
- react native, expo, typescript
- react native component lib
- supabase database (user data)
- use of camera
### Requirements to explore in the future
- more supabase
- auth with external provider
- cloud video storage

## Development Steps
### React Native Setup
https://reactnative.dev/docs/typescript
- `npx create-expo-app --template`
- selected typescript (routed) and kept app name the default ("my-app")
- 
	```bash
	cd my-app
	npx expo run android
	```
- need use the Expo app to test iOS (only mac supports ios emulator)
#### Error
- Tried to run android, ran into issue:
`Failed to resolve the Android SDK path. Default install location not found: /home/steven-dindl/Android/sdk. Use ANDROID_HOME to set the Android SDK location.`
- Installed Android sdk - [tutorial](https://www.youtube.com/watch?v=Q2hkxB3HN6M) 
- run emulator on linux with `enumlator @testDevice -no-accel`
#### Error 2
- [ADB] Couldn't reverse port 8081: adb: device offline
› Opening exp://10.35.232.235:8081 on testDevice
Error: adb: device offline
- I believe this is bc its not booting / taking so long to boot
- setup emulator hardware accel
```bash

sudo apt install -y qemu-kvm libvirt-daemon-system libvirt-clients bridge-utils virt-manager cpu-checker
```
### Note 1
- the /apps folder is part of the react native router structure
- _layout.tsx file is essentially a config / entry point for navigation
- `<button></button>` and many other standard html tag WILL work when testing in web BUT are not valid react native and **WILL NOT** work when testing in the emulator.
- Component libaraies can simplify the front-end code, and limit complicated boiler plate

### React native paper
- [React native paper](https://callstack.github.io/react-native-paper/docs/guides/getting-started/)
- Exploring components in this lib
- Using the input component
- Messing around with creating my own adjusted text input components
- Created signup and signin components, made adjustments with prop inputs
- Used secure entry toggle for password input
- Created a 'duplicate-input' toggle for when application needs a 'Confirm [ ]" text box, and added option to 
turn secure input toggle on or off for that, if its being used for confirm password.
- Implemented core screens (home, add, and logs) as tabs (using base react native routing and base bottom nav) with components of react native paper

#### Error / Notes
- ran into issue with build not being able to find the index.tsx, even after going back a few steps and trying to give it a basic _layout.tsx and "hello word" style index.tsx, it still wouldn't pick up on it. Went back to previous commit for temporary testing, and swapped over to windows momentarily. Got routes and running on windows in the web, 
- swapped back to linux, still having issues with build even on the version I routed on windows, but it did run on web. Began troubleshooting the issue with android build.
- running into issues with packages, even with expo manager helping with package managing, and android emulator was not booting. Decided to create new emulator and remove node modules, that got the project back up and running.
- Conclusion: we will likely want to containerize our project
##### Also
- web view requires additional setup for component libs
- we will want to test not just on device with expo go, but with cable connection, esp for camera

### Vision camera setup
- [Camera setup docs](https://react-native-vision-camera.com/docs/guides)
- `npx expo install react-native-vision-camera`
- updated app.json
- `npx expo prebuild`
- `eas build` (did not run, only need to run for new binaries)
- using imperative api, more intuitive than hooks for me 
```JavaScript
const cameraPermission = Camera.getCameraPermissionStatus()

const newCameraPermission = await Camera.requestCameraPermission()
```
- note: web view does not work at all with camera (doesn't allow screens to be viewed at all)
- also, my emulator gives animation when camera is being used to show that it would be working

#### Re-requesting premissions
Can't request permissions again if user declined, need to direct to settings:
- [Linking: opensettings docs](https://reactnative.dev/docs/linking#opensettings)

```JavaScript
static openSettings(): Promise<void>;
```

### Database setup
[supabase docs for expo react native](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native?queryGroups=database-method&database-method=dashboard&queryGroups=auth-store&auth-store=async-storage)
- [React native env files](https://dev.to/dallington256/using-env-file-in-react-native-application-3961)
- `npx expo install @supabase/supabase-js @react-native-async-storage/async-storage`
- `npm install react-native-dotenv`
- `supabase link --project-ref <project-id>`
- https://supabase.com/docs/guides/auth/social-login/auth-google?queryGroups=platform&platform=react-native
- `npx expo install @react-native-google-signin/google-signin`
- https://developers.google.com/identity/oauth2/web/guides/get-google-api-clientid
- https://console.cloud.google.com/auth/
- need to get SHA-1 fingerprint for Android
- `npm install -g eas-cli` 
- skipping 3rd party auth implementation for now
- mistake: don't make .env variables strings
- setup for user auth, working
