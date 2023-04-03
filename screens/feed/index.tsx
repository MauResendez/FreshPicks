import { useNavigation } from "@react-navigation/native";
import { collection, onSnapshot, query } from "firebase/firestore";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { FlatList } from "react-native";
import { View } from "react-native-ui-lib";
import Loading from "../../components/extra/loading";
import PostCard from "../../components/feed/post-card";
import { db } from "../../firebase";
import { global } from "../../style";

const Timeline = () => {
  const navigation = useNavigation<any>();
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onSnapshot(query(collection(db, "Posts")), async (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });
  }, []);

  useEffect(() => {
    if (posts) {
      setLoading(false);
    }
  }, [posts]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    });
  }, []);

  if (loading) {
    return (
      <Loading />
    )
  }
  
  return (
    <View useSafeArea flex>
      <FlatList 
        data={posts}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <PostCard id={item.id} business={item.business} address={item.address} logo={item.logo} title={item.title} description={item.description} image={item.image} />
        )}
        contentContainerStyle={[global.container]}
      />
    </View>
  )
}

export default Timeline