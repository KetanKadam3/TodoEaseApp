import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import CheckBox from "react-native-check-box";

function formatDate(date) {
  let day = ('0' + date.getDate()).slice(-2);
  let month = ('0' + (date.getMonth() + 1)).slice(-2);
  let year = date.getFullYear();
  let hours = date.getHours() % 12 || 12;
  let minutes = ('0' + date.getMinutes()).slice(-2);
  let ampm = date.getHours() >= 12 ? 'PM' : 'AM';

  return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
}


export default function HomePage() {
  const navigation = useNavigation();
  const [inputText, setInputText] = useState("");
  const [loggedUser, setLoggedUser] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchLoggedUser = async () => {
      try {
        const user = await AsyncStorage.getItem("loggedUser");
        if (user) {
          setLoggedUser(JSON.parse(user));
        }
      } catch (error) {
        console.error("Failed to fetch logged user", error);
      }
    };
    fetchLoggedUser();
  }, []);

  useEffect(() => {
    const fetchOldTodo = async () => {
      if (loggedUser !== null) {
        try {
          const task = await AsyncStorage.getItem(`${loggedUser?.username}`);

          if (task) {
            const myTasks = JSON.parse(task);

            if (myTasks) {
              setTasks([...myTasks]);
            }
          }
        } catch (error) {
          console.error("Failed to fetch task", error);
        }
      }
    };
    fetchOldTodo();
  }, [loggedUser]);

  useEffect(() => {
    if (loggedUser) {
      addToLocalStorage(tasks);
    }
  }, [tasks, loggedUser]);

  const handleAddTask = async () => {
    const datetime = formatDate(new Date())
    if (inputText.trim() === "") {
      Alert.alert("Error", "Task cannot be empty", [{ text: "OK" }]);
      return;
    }
    setTasks((prev) => [...prev, {
       id:tasks?.length +1,
       isCompleted:false,
      title: inputText,
      cretedAt:datetime
    }]);
    setInputText("");
  };

  const addToLocalStorage = async (data) => {
    try {
      await AsyncStorage.setItem(
        `${loggedUser?.username}`,
        JSON.stringify(data)
      );
    } catch (error) {
      console.error("Failed to add tasks to local storage", error);
    }
  };

  const handleDelete = (id) => {
    setTasks((prev) => prev.filter((res) => res.id !== id));
  };

  const renderTask = ({ item }) => (
    <View style={styles.taskdiv}>
     <CheckBox 
      isChecked={item.isCompleted}
      onClick={()=> toggleTask(item.id)}
      style={styles.checkbox}
      checkBoxColor="#2B1887"
      checkedCheckBoxColor="green"
     />
     <Text style={styles.taskText}>{item?.title}</Text>

      <Text style={{fontSize:8,position:'absolute',bottom:0,right:0,padding:10}}>{item?.cretedAt}</Text>
      <TouchableOpacity
        onPress={() => handleDelete(item?.id)}
        style={styles.buttonContainer}
      >
        <Ionicons name="trash" size={25} color="#2B1887" />
      </TouchableOpacity>
    </View>
  );


  const removeToken = async()=>{
      try {
        await AsyncStorage.removeItem("loggedUser");
        // Navigate to login screen
        navigation.reset({
          index: 0,
          routes: [{ name: "login" }],
        });
      } catch (error) {
        console.error("Failed to log out:", error);
      }
    };
    
  const handleLogout = () => {
    Alert.alert("Success", "You have been logged out successfully.", [
      { text: "OK", onPress: () => {navigation.navigate("login") ; removeToken() } },
    ]);
  };


  const toggleTask = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task ) =>
        task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
      )
    );
  };
  

  const ListEmptyComponent = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height:'100%'}}>
      <Text style={{fontSize:20,color:'grey'}}>No tasks available</Text>
    </View>
  );


  
  return (
    <View style={styles.main}>
      <View style={styles.headerDiv}>
        <View>
          <Text
            style={{
              color: "#2B1887",
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            {loggedUser ? loggedUser.username : "None"}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => handleLogout()}
          // style={styles.buttonContainer}
        >
          <MaterialIcons name="logout" size={30} color="#2B1887" />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        {/* <View> */}
          <View style={styles.headingDiv}>
            <Image
              source={require("../assets/to-do-list.png")} // Path to your local image
              style={styles.image}
            />
            {/* <MaterialIcons Text */}

            <Text
              style={{
                color: "#5D5FEF",
                fontSize: 30,
                fontWeight: "bold",
                textAlign: "center",
                textDecorationLine: "underline",
              }}
            >
              To - Do
            </Text>
          </View>

          <View style={styles.myTasks}>
            <FlatList
              data={tasks?.length > 0 ? tasks?.sort((a,b) => b.id -a.id) : []}
              renderItem={renderTask}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={ListEmptyComponent}
              
            />
          </View>
        {/* </View> */}
        <View style={styles.addTaskDiv}>
          <TextInput
            value={inputText}
            onChangeText={(text) => setInputText(text)}
            style={styles.inputBox}
            placeholder="Enter your task here ..."
          />
          <TouchableOpacity
            onPress={handleAddTask}
            style={styles.buttonContainer}
          >
            <MaterialIcons name="add-circle" size={40} color="#2B1887" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: "#D5CCFF",
    display:'flex',  
  },

  headerDiv: {
    display: "flex",
    flexDirection: "row",
    gap: 2,
    padding: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  image: {
    height: 40,
    width: 40,
  },

  container: {
    display:'flex',
    gap:2,
    // height:'100%',
    flex:1,
    backgroundColor: "#D5CCFF",
    // alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal:30,
    paddingVertical:10,
    flexDirection: "column",
  },
 
  headingDiv: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  addTaskDiv: {
    display: "flex",
    flexDirection: "row",
    width:'100%',
    justifyContent:'space-between',
    alignItems:'center',
    gap: 4,
    marginTop:10
  },
  inputBox: {
    padding: 10,
    paddingRight:60,
    // width:'80%',
    flex:1,
    borderRadius: 10,
    backgroundColor: "#F4F2FF",
    color: "#2B1887",
    
  },
  buttonContainer: {
    padding: 10,
    position:'absolute',
    // top:'50%',
    // bottom:0,
    right:0,
    // width: 60,
  },
  taskdiv: {
    display: "flex",
    flexDirection: "row",
    gap: 2,
    justifyContent: "space-between",
    backgroundColor: "#DED7FF",
    margin:3,
    padding: 10,
    minHeight:60,
    borderRadius: 10,
    shadowColor: "#5D5FEF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    width:'100%',
    position:'relative'
 
  },
  taskText: {
    color: "black",
    fontWeight: "bold",
    textAlign: "justify",
    marginRight:40,
    marginLeft:40,
    marginBottom:10
  },
  checkbox:{
    // backgroundColor:'red'
    position:'absolute',
    left:10,
    color:'red',
    top:10,
    // paddingVertical:10,

  },
  myTasks: {
    // height: '100%',
    width: '100%',
    marginTop: 20,
    flex:1,

  },
});
