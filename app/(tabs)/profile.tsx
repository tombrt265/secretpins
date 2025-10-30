import { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
} from "react-native";

interface User {
  username: string;
  bio: string;
  profilePicture: string;
  posts: Post[];
}

interface Post {
  id: string;
  imageUri: string;
  aspectRatio?: number;
}

export default function Profile() {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    // Fetch user data from database
    const user = {
      username: "tom.blrt",
      bio: "19 y/o\nProgrammer\nBased in Germany",
      profilePicture:
        "https://i.pinimg.com/736x/27/a8/c0/27a8c019738a9004cc980531ac8f4f77.jpg",
      posts: [
        {
          id: "1",
          imageUri:
            "https://i.pinimg.com/736x/27/a8/c0/27a8c019738a9004cc980531ac8f4f77.jpg",
        },
        {
          id: "2",
          imageUri:
            "https://i.pinimg.com/736x/04/81/b1/0481b1554a6e3975c2f644701c01404c.jpg",
        },
        {
          id: "3",
          imageUri:
            "https://i.pinimg.com/736x/a0/68/ba/a068ba165aa50a27754413ee8c9c6ef1.jpg",
        },
        {
          id: "6",
          imageUri:
            "https://i.pinimg.com/736x/a0/68/ba/a068ba165aa50a27754413ee8c9c6ef1.jpg",
        },
        {
          id: "4",
          imageUri:
            "https://i.pinimg.com/736x/27/a8/c0/27a8c019738a9004cc980531ac8f4f77.jpg",
        },
        {
          id: "5",
          imageUri:
            "https://i.pinimg.com/736x/04/81/b1/0481b1554a6e3975c2f644701c01404c.jpg",
        },
        {
          id: "7",
          imageUri:
            "https://i.pinimg.com/736x/a0/68/ba/a068ba165aa50a27754413ee8c9c6ef1.jpg",
        },
      ],
    };

    if (user.posts.length > 0) {
      // Preload image sizes to calculate aspect ratios
      Promise.all(
        user.posts.map(
          (post) =>
            new Promise<Post>((resolve) => {
              Image.getSize(post.imageUri, (width, height) => {
                resolve({
                  ...post,
                  aspectRatio: width / height,
                });
              });
            })
        )
      ).then((postsWithSizes) => {
        user.posts = postsWithSizes;
        setUser(user);
      });
    } else {
      setUser(user);
    }
  }, []);

  const numColumns = 3;
  const screenWidth = Dimensions.get("window").width;
  const imageWidth = (screenWidth / numColumns) * 0.9;

  if (!user) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Profilbild */}
      <Image
        source={{ uri: user.profilePicture }}
        style={styles.profileImage}
      />

      {/* Username */}
      <Text style={styles.username}>{user.username}</Text>

      {/* Bio */}
      <Text style={styles.bio}>{user.bio}</Text>

      {/* Grid der User Posts */}
      <FlatList
        data={user.posts}
        numColumns={numColumns}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item.imageUri }}
            style={{
              width: imageWidth,
              height: imageWidth / item.aspectRatio!,
              margin: 2,
              borderRadius: 8,
              alignSelf: "center",
            }}
          />
        )}
        contentContainerStyle={styles.postsGrid}
        scrollEnabled={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: 24,
    marginBottom: 12,
  },
  username: {
    fontSize: 20,
    fontWeight: "600",
  },
  bio: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  postsGrid: {
    alignItems: "center",
  },
});
