import { useNavigation } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { collection, onSnapshot, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { LoaderScreen, View } from "react-native-ui-lib";
import PostCard from "../../components/feed/post-card";
import { db } from "../../firebase";
import { global } from "../../style";

const Timeline = () => {
  const navigation = useNavigation<any>();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onSnapshot(query(collection(db, "Posts")), async (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });
  }, []);

  useEffect(() => {
    if (posts) {
      console.log(posts.length);
      setLoading(false);
    }
  }, [posts]);

  if (loading) {
    return (
      <LoaderScreen color={"#32CD32"} />
    )
  }
  
  return (
    <View useSafeArea flex style={global.bgWhite}>
      <FlashList 
        data={posts}
        keyExtractor={(item: any) => item.id}
        renderItem={({item}) => (
          <PostCard id={item.id} business={item.business} address={item.address} title={item.title} description={item.description} image={item.image} />
        )}
        contentContainerStyle={global.container}
      />
    </View>
  )
}

export default Timeline