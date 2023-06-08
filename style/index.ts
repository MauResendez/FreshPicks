import { StyleSheet } from "react-native";
import { Colors } from "react-native-ui-lib";

export const global = StyleSheet.create({
  container: {
    padding: 24
  },
  center: {
    alignItems: "center",
    justifyContent: "center"
  },
  flex: {
    flex: 1
  },
  flexWrap: {
    flexWrap: "wrap"
  },
  spaceBetween: {
    justifyContent: "space-between"
  },
  spaceEvenly: {
    justifyContent: "space-evenly"
  },
  white: {
    backgroundColor: Colors.white
  },
  button: {
    borderRadius: 8,
    marginVertical: 8,
    padding: 16,
  },
  checkbox: {
    backgroundColor: Colors.white,
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 8,
    borderWidth: 1,
  },
  image: {
    width: "100%",
    height: 150
  },
  fab: {
    bottom: 16,
    right: 16,
    backgroundColor: '#32CD32',
    padding: 16,
    width: 64,
    height: 64,
    position: 'absolute',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 16,
  },
  field: {
    paddingVertical: 8,
    width: "100%"
  },
  input: {
    backgroundColor: Colors.white,
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 8,
    borderWidth: 1,
    height: 50,
    paddingHorizontal: 8,
  },
  otp: {
    backgroundColor: Colors.white,
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 8,
    borderWidth: 1,
    color: Colors.black,
    height: 50,
    paddingHorizontal: 8,
    width: 50
  },
  area: {
    backgroundColor: Colors.white,
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 50,
    paddingHorizontal: 8,
  }
});