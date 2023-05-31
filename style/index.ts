import { Platform, StyleSheet } from "react-native";
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
    backgroundColor: Colors.secondary,
    borderRadius: 8
  },
  bgGreen: {
    backgroundColor: "green"
  },
  bgDarkGreen: {
    backgroundColor: Colors.green5
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
    color: Colors.secondary,
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
  checkbox: {
    backgroundColor: "white",
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 8,
    borderWidth: 1,
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
    minHeight: 50,
    paddingHorizontal: 8,
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
    backgroundColor: Colors.secondary,
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
  fwbtn: {
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    marginVertical: 8,
    padding: 16,
    width: "100%"
  },
  btn2: {
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    marginVertical: 8,
    padding: 16,
    width: "40%"
  },
  btnTest: {
    borderRadius: 8,
    marginVertical: 8,
    padding: 16,
    width: "100%"
  },
  btn: {
    borderRadius: 8,
    marginVertical: 8,
    padding: 16,
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
  activeTabTextColor: {
    color: "#32CD32"
  },
  tabTextColor: {
    color: "black"
  },
  androidHeader: {
    width: 200, 
    height: 50, 
    marginTop: 8
  },
  iosHeader: {
    width: 200, 
    height: 50, 
  },
  image: {
    width: "100%",
    height: 150
  }
});