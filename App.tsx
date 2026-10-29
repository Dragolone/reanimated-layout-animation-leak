import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";

/**
 * Minimal reproduction: a "value transition" widget. Every 500 ms the value changes and
 * the keyed Animated.View is remounted with entering / exiting layout animations.
 * With layout animations ON the app's native heap grows for as long as the counter runs;
 * with them OFF (plain View, same remounting) it stays flat.
 */
export default function App() {
  const [value, setValue] = useState(0);
  const [animated, setAnimated] = useState(true);
  const [running, setRunning] = useState(true);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setValue((v) => v + 1), 500);
    return () => clearInterval(id);
  }, [running]);
  return (
    <View style={styles.root}>
      <Text style={styles.label}>
        layout animations: {animated ? "ON" : "OFF"} · {running ? "running" : "paused"}
      </Text>
      <View style={styles.cell}>
        {animated ? (
          <Animated.View
            key={String(value)}
            entering={FadeInDown.duration(200)}
            exiting={FadeOutUp.duration(140)}
          >
            <Text style={styles.value}>{value}</Text>
          </Animated.View>
        ) : (
          <View key={String(value)}>
            <Text style={styles.value}>{value}</Text>
          </View>
        )}
      </View>
      <Pressable style={styles.btn} onPress={() => setAnimated((a) => !a)}>
        <Text style={styles.btnText}>toggle layout animations</Text>
      </Pressable>
      <Pressable style={styles.btn} onPress={() => setRunning((r) => !r)}>
        <Text style={styles.btnText}>{running ? "pause" : "resume"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: "center", justifyContent: "center", gap: 24, backgroundColor: "#111" },
  label: { color: "#aaa", fontSize: 14 },
  cell: { height: 80, alignItems: "center", justifyContent: "center" },
  value: { color: "#fff", fontSize: 48, fontWeight: "700" },
  btn: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8, backgroundColor: "#333" },
  btnText: { color: "#fff" },
});
