import { Platform, StyleSheet } from "react-native";

export const colors = {
  primary: "white",
  secondary: "#adadad",
  tertiary: "#057afd",
  alternative: "#666",
  fb: "#39559f",
  disabled: "rgba(5, 122, 253, 0.5)"
};

export const global = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24
  },
  center: {
    alignItems: "center",
    justifyContent: "center"
  },
  flex: {
    flex: 1
  },
  centerText: {
    textAlign: "center"
  },
  // center: {
  //   alignItems: "center",
  //   flex: 1,
  //   flexDirection: "column",
  //   padding: 24
  // },
  column: {
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    width: "100%"
  },
  row: {
    flexDirection: "row",
    width: "100%"
  },
  white: {
    color: "white"
  },
  black: {
    color: "black"
  },
  bgWhite: {
    backgroundColor: "white"
  },
  bgGray: {
    backgroundColor: "#F3F4F6"
  },
  bgOrange: {
    backgroundColor: "#FF4500",
    borderRadius: 8
  },
  bgGreen: {
    backgroundColor: "green"
  },
  bgBlue: {
    backgroundColor: "blue"
  },
  spaceAround: {
    justifyContent: "space-around"
  },
  spaceBetween: {
    justifyContent: "space-between"
  },
  spaceEvenly: {
    justifyContent: "space-evenly"
  },
  justifyContent: {
    justifyContent: "center"
  },
  alignItems: {
    alignItems: "center"
  },
  flexWrap: {
    flexWrap: "wrap"
  },
  form: {
    flex: 1,
    padding: 24
  },
  title: {
    color: "#ff4500",
    fontSize: 24,
    fontWeight: "bold",
    paddingBottom: 16
  },
  subtitle: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
    paddingBottom: 8
  },
  field: {
    paddingVertical: 8,
    width: "100%"
  },
  input: {
    backgroundColor: "white",
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 8,
    borderWidth: 1,
    height: 50,
    paddingHorizontal: 8,
  },
  inputContainer: {
    borderBottomWidth: 0,
    paddingHorizontal: 0,
    width: "100%"
  },
  password: {
    backgroundColor: "white",
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
    borderWidth: 0,
    height: 50,
    paddingHorizontal: 8,
    width: "100%"
  },
  textArea: {
    backgroundColor: "white",
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 8,
    borderWidth: 1,
    height: 100,
    padding: 8,
  },
  otpInput: {
    backgroundColor: "white",
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 8,
    borderWidth: 1,
    color: "black",
    height: 50,
    paddingHorizontal: 8,
    width: 50
  },
  dropdown: {
    ...Platform.select({
      web: {
        padding: 16
      }
    })
  },
  autocomplete: {
    backgroundColor: "white",
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 8,
    borderWidth: 1,
    height: 50,
    paddingHorizontal: 8,
    width: "100%"
  },
  buttons: {
    alignItems: "center", 
    flexDirection: "row", 
    justifyContent: "center",
    paddingTop: 16
  },
  button: {
    alignItems: "center",
    backgroundColor: "#ff4500",
    borderRadius: 4,
    elevation: 2,
    justifyContent: "center",
    padding: 16,
    ...Platform.select({
      android: {
        padding: "100%"
      },
      ios: {
        width: "100%"
      },
      web: {
        width: 300
      }
    }),
    textAlign: "center"
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    lineHeight: 20,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  btn: {
    backgroundColor: "#ff4500",
    borderRadius: 8,
    marginVertical: 8,
    padding: 16,
    width: "100%"
  },
  btn2: {
    backgroundColor: "#ff4500",
    borderRadius: 8,
    marginVertical: 8,
    padding: 16,
    width: "40%"
  },
  btnContainer: {
    marginBottom: 16,
  },
  btnText: {
    fontSize: 18,
    fontWeight: "700", 
    lineHeight: 28,
    textAlign: "center"
  },
  link: {
    color: "black",
    fontSize: 16,
    fontWeight: "700",
    paddingVertical: 8,
    textAlign: "center",
    textDecorationLine: 'underline'
  },
  liItem: {
    marginVertical: 4,
    width: "100%"
  },
  liTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  liSubtitle: {
    color: "#666",
    fontSize: 14,
    fontWeight: "600"
  },
  liContent: {
    color: "#6B7280",
    fontSize: 12,
    lineHeight: 24
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    margin: 16,
  },
  cardContent: {
    padding: 16
  },
  cardImg: {
    height: 200,
    marginVertical: 8,
    width: "100%",
  },
});