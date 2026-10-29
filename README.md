# Reanimated: keyed `entering` / `exiting` layout animations retain native memory on every remount

Minimal reproduction for a native-memory growth in `react-native-reanimated` 4.5.x (Fabric).

`App.tsx` is a "value transition" widget: every 500 ms the value changes and the keyed
`Animated.View` is remounted with `entering={FadeInDown}` / `exiting={FadeOutUp}`.
With layout animations **ON** the app's native heap grows for as long as the counter runs;
with them **OFF** (plain `View`, same remounting) it stays flat. The screen has a button to
toggle between the two so the comparison runs in one process.

## Run

```bash
npm install
npx expo prebuild --platform android --no-install
cd android && ./gradlew assembleRelease -PreactNativeArchitectures=arm64-v8a
adb install -r app/build/outputs/apk/release/app-release.apk
```

Measure the native heap once a minute while the counter runs:

```bash
while true; do adb shell dumpsys meminfo com.example.reanimatedleak | grep 'Native Heap:'; sleep 60; done
```

For call stacks of the retained allocations, add `<profileable android:shell="true"/>` to the
manifest's `<application>` and record with Perfetto heapprofd (`android.heapprofd`,
`process_cmdline: "com.example.reanimatedleak"`, continuous dumps).

## Versions

- react-native-reanimated 4.5.1 (also reproduced on 4.5.5)
- react-native-worklets 0.10.1
- react-native 0.86.2, Expo SDK 57, Hermes, New Architecture
