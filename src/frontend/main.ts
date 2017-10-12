import xs, { Stream } from "xstream";
import { h } from "@cycle/native-screen";
import { ScreenVNode, ScreensSource, Command } from "cycle-native-navigation";
import { StartDatReq } from "../typings/messages";
import { ReactElement } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
const RNFS = require("react-native-fs");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});

type Sources = {
  screen: ScreensSource;
  nodejs: Stream<string>;
};

type Sinks = {
  screen: Stream<ScreenVNode>;
  navCommand: Stream<Command>;
  nodejs: Stream<string>;
};

export default function main(sources: Sources): Sinks {
  const response$ = sources.nodejs.startWith("");

  const vdom$ = response$.map(response => ({
    screen: "DatInstaller.Central",
    vdom: h(View, { style: styles.container }, [
      h(Text, { style: styles.welcome }, "Dat Installer"),
      h(Text, { style: styles.instructions }, response)
    ])
  }));

  const nodejsRequest$ = xs.of({
    type: "START_DAT",
    storagePath:
      RNFS.ExternalStorageDirectoryPath +
      "/dats/778f8d955175c92e4ced5e4f5563f69bfec0c86cc6f670352c457943666fe639",
    datKey:
      "dat://778f8d955175c92e4ced5e4f5563f69bfec0c86cc6f670352c457943666fe639"
  } as StartDatReq);

  return {
    screen: vdom$,
    navCommand: xs.never(),
    nodejs: nodejsRequest$.map(req => JSON.stringify(req))
  };
}
