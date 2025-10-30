import ImageCard from "@/components/image-card";
import Feather from "@expo/vector-icons/build/Feather";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

export default function Home() {
  // Fetch images from Database
  const cards = [
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
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Suchleiste */}
      <View style={styles.searchBar}>
        <Feather name="search" size={20} color="#aaa" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#aaa"
        />
      </View>

      {/* Liste von Pins */}
      <ScrollView style={styles.cardList}>
        {cards.map((card) => (
          <ImageCard
            key={card.id}
            imageUri={card.imageUri}
            onPress={() => {}}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 20,
    marginHorizontal: 20,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    width: "100%",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: "#fafafa",
  },
  searchInput: {
    padding: 10,
    borderRadius: 8,
    width: "100%",
  },
  cardList: {
    width: "100%",
    paddingHorizontal: 20,
  },
});
